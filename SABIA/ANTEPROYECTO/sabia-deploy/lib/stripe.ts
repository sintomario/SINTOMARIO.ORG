// lib/stripe.ts — Configuración Stripe
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PRICE_CENTS = 300  // $3.00 USD

export function createCheckoutSession(readingId: string, zona: string, ctx: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Bálsamo Emocional · Lectura completa',
          description: `${zona.replace('-', ' ')} · ${ctx} · protocolo transgeneracional`,
        },
        unit_amount: PRICE_CENTS,
      },
      quantity: 1,
    }],
    success_url: `${baseUrl}/${readingId}?token={CHECKOUT_SESSION_ID}&unlocked=1`,
    cancel_url: `${baseUrl}/${readingId}`,
    metadata: { readingId, zona, ctx },
    customer_creation: 'if_required',
    allow_promotion_codes: false,
  })
}
