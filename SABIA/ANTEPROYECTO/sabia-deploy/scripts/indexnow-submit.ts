// scripts/indexnow-submit.ts — Envía URLs nuevas a Google y Bing
import { db } from '../lib/db'

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? 'sabia-indexnow-key'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sabia.info'

async function main() {
  const recent = await db.reading.findMany({
    where: {
      status: 'publicado',
      published_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    select: { url_slug: true },
  })

  if (recent.length === 0) {
    console.log('No hay URLs nuevas en los últimos 7 días')
    return
  }

  const urls = recent.map(r => `${SITE_URL}${r.url_slug}`)

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'sabia.info',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  })

  console.log(`IndexNow: ${res.status} · ${urls.length} URLs enviadas`)
  console.log(urls.join('\n'))
}

main().catch(console.error)
