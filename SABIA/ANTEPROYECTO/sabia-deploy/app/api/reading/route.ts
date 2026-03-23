// app/api/reading/route.ts
// GET /api/reading?zona=espalda-baja&ctx=carga&token=UUID
import { NextRequest } from 'next/server'
import { getReadingByZonaCtx, verifyUnlockToken, upsertDailyMetric, upsertSiteMetric } from '@/lib/db'
import { cache } from '@/lib/kv'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const zona  = searchParams.get('zona')
  const ctx   = searchParams.get('ctx')
  const token = searchParams.get('token')

  if (!zona || !ctx) {
    return Response.json({ error: 'zona y ctx requeridos' }, { status: 400 })
  }

  // 1. Caché Redis primero (sin tocar Postgres)
  const cached = await cache.reading.get(zona, ctx)
  if (cached) {
    void trackView(cached.id as string, zona, ctx)
    const unlocked = token ? await verifyUnlockToken(token, cached.id as string) : false
    return Response.json(
      { ...cached, lectura_pago: unlocked ? cached.lectura_pago : null, unlocked },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } }
    )
  }

  // 2. Buscar en Postgres
  const reading = await getReadingByZonaCtx(zona, ctx)
  if (!reading) {
    return Response.json({ error: 'Lectura no encontrada' }, { status: 404 })
  }

  // 3. Verificar token de unlock
  const unlocked = token ? await verifyUnlockToken(token, reading.id) : false

  // 4. Serializar (sin lectura_pago si no está desbloqueado)
  const payload = {
    ...reading,
    keywords_json: JSON.parse(reading.keywords_json ?? '[]'),
    tags_json: JSON.parse(reading.tags_json ?? '[]'),
    microterapi: JSON.parse(reading.microterapi ?? '{}'),
    lectura_pago: unlocked ? reading.lectura_pago : null,
    unlocked,
  }

  // 5. Guardar en Redis y trackear
  await cache.reading.set(zona, ctx, payload)
  void trackView(reading.id, zona, ctx)

  return Response.json(payload, {
    headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
  })
}

async function trackView(readingId: string, zona: string, ctx: string) {
  try {
    await Promise.all([
      cache.counters.trackView(readingId, zona, ctx),
      upsertDailyMetric(readingId, 'views'),
      upsertSiteMetric('total_views'),
    ])
  } catch (e) {
    console.error('Track view error:', e)
  }
}
