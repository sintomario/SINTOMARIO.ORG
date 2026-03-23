// lib/kv.ts — Vercel KV Redis · estrategia completa de caché
import { kv } from '@vercel/kv'

function today() {
  return new Date().toISOString().split('T')[0]
}

export const cache = {

  reading: {
    async get(zona: string, ctx: string) {
      return kv.get<Record<string, unknown>>(`reading:${zona}:${ctx}`)
    },
    async set(zona: string, ctx: string, data: unknown) {
      return kv.set(`reading:${zona}:${ctx}`, data, { ex: 3600 })
    },
    async invalidate(zona: string, ctx: string) {
      return kv.del(`reading:${zona}:${ctx}`)
    },
  },

  counters: {
    async trackView(readingId: string, zona: string, ctx: string) {
      const date = today()
      const pipeline = kv.pipeline()
      pipeline.incr(`views:${zona}:${ctx}:${date}`)
      pipeline.incr(`views:total:${date}`)
      pipeline.incr(`views:reading:${readingId}:${date}`)
      await pipeline.exec()
    },
    async trackShare(readingId: string) {
      const date = today()
      await Promise.all([
        kv.incr(`shares:${readingId}:${date}`),
        kv.incr(`shares:total:${date}`),
      ])
    },
    async getDailyViews(date = today()) {
      return (await kv.get<number>(`views:total:${date}`)) ?? 0
    },
  },

  unlock: {
    async set(token: string, readingId: string) {
      return kv.set(`session:unlock:${token}`, { readingId }, { ex: 86400 })
    },
    async get(token: string) {
      return kv.get<{ readingId: string }>(`session:unlock:${token}`)
    },
  },

  dashboard: {
    async getSummary() {
      return kv.get<Record<string, unknown>>('dashboard:summary')
    },
    async setSummary(data: unknown) {
      return kv.set('dashboard:summary', data, { ex: 300 })
    },
    async invalidate() {
      return kv.del('dashboard:summary')
    },
  },
}
