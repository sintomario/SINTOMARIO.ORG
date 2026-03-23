// app/api/track/route.ts — tracking de tiempo en página y eventos
import { NextRequest } from 'next/server'
import { updateReadingMetrics, upsertDailyMetric, upsertSiteMetric } from '@/lib/db'
import { cache } from '@/lib/kv'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { id, event, sec, zona, ctx } = await req.json()

  if (event === 'time' && id && sec > 10) {
    void updateReadingMetrics(id, { avg_time_sec: sec })
  }

  if (event === 'share' && id) {
    void Promise.all([
      upsertDailyMetric(id, 'shares'),
      upsertSiteMetric('wa_shares'),
      cache.counters.trackShare(id),
    ])
  }

  return Response.json({ ok: true })
}
