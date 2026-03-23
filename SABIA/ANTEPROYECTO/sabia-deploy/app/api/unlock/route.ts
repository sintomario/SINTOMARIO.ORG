// app/api/unlock/route.ts
import { NextRequest } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { createUnlock, updateReadingMetrics, upsertDailyMetric } from '@/lib/db'
import { cache } from '@/lib/kv'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'

// POST /api/unlock — crea sesión Stripe Checkout
export async function POST(req: NextRequest) {
  const { readingId, zona, ctx } = await req.json()
  if (!readingId || !zona || !ctx) {
    return Response.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  const session = await createCheckoutSession(readingId, zona, ctx)
  return Response.json({ url: session.url })
}

// POST /api/unlock/verify — webhook de Stripe
export async function PUT(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Firma inválida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session
    const { readingId, zona, ctx } = s.metadata!
    const country = s.customer_details?.address?.country ?? undefined

    await Promise.all([
      createUnlock(readingId, s.id, country),
      updateReadingMetrics(readingId, { unlocks: 1 }),
      upsertDailyMetric(readingId, 'unlocks'),
      cache.reading.invalidate(zona, ctx),
      cache.dashboard.invalidate(),
    ])
  }

  return Response.json({ received: true })
}
