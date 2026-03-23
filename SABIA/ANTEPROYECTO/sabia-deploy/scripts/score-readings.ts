// scripts/score-readings.ts — Calcula y actualiza score_resonancia
import { db } from '../lib/db'

function thirtyDaysAgo() {
  const d = new Date(); d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

async function main() {
  const readings = await db.reading.findMany({ where: { status: 'publicado' } })
  console.log(`\n📊 Calculando scores para ${readings.length} lecturas...\n`)

  for (const r of readings) {
    const metrics = await db.metricsDaily.findMany({
      where: { reading_id: r.id, date: { gte: thirtyDaysAgo() } },
    })

    const totalViews  = metrics.reduce((s, m) => s + m.views, 0)
    const totalUnlock = metrics.reduce((s, m) => s + m.unlocks, 0)
    const totalShares = metrics.reduce((s, m) => s + m.shares, 0)
    const avgTime     = metrics.length
      ? metrics.reduce((s, m) => s + m.avg_sec, 0) / metrics.length : 0

    const score = (
      (Math.min(totalViews, 1000) / 1000) * 3 +
      (totalUnlock / Math.max(totalViews, 1)) * 4 +
      (Math.min(totalShares, 100) / 100) * 2 +
      (Math.min(avgTime, 300) / 300) * 1
    ) * 10

    const rounded = Math.round(score * 10) / 10

    await db.reading.update({
      where: { id: r.id },
      data: {
        score_resonancia: rounded,
        ...(rounded < 7.0 && totalViews > 50 && { status: 'regenerar' }),
      },
    })
    console.log(`  ${r.id}: ${rounded} (${totalViews}v · ${totalUnlock}u · ${totalShares}s)`)
  }

  console.log('\n✅ Scores actualizados\n')
  await db.$disconnect()
}

main().catch(console.error)
