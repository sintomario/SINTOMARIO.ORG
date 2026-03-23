// lib/db.ts — Cliente Prisma + helpers completos
import { PrismaClient } from '@prisma/client'

// Singleton pattern: evita múltiples conexiones en hot reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// ── HELPERS DE LECTURAS ────────────────────────────────────────────

export async function getReading(id: string) {
  return db.reading.findUnique({
    where: { id },
    include: {
      products: { orderBy: { sort_order: 'asc' } },
      metrics: { orderBy: { date: 'desc' }, take: 30 },
    },
  })
}

export async function getReadingByZonaCtx(zona: string, ctx: string) {
  return db.reading.findFirst({
    where: { zona, contexto: ctx, status: 'publicado' },
    include: { products: { orderBy: { sort_order: 'asc' } } },
  })
}

export async function getPublishedReadings(opts?: { limit?: number; zona?: string }) {
  return db.reading.findMany({
    where: {
      status: 'publicado',
      ...(opts?.zona && { zona: opts.zona }),
    },
    orderBy: { score_resonancia: 'desc' },
    take: opts?.limit ?? 200,
    select: {
      id: true, sabia_index: true, zona: true, contexto: true,
      emocion_raiz: true, views: true, score_resonancia: true,
      url_slug: true, og_desc: true,
    },
  })
}

export async function getAllReadingSlugs() {
  const readings = await db.reading.findMany({
    where: { status: 'publicado' },
    select: { zona: true, contexto: true },
  })
  return readings.map(r => ({ zona: r.zona, ctx: r.contexto }))
}

export async function upsertReading(data: Record<string, unknown>) {
  return db.reading.upsert({
    where: { id: data.id as string },
    create: data as Parameters<typeof db.reading.create>[0]['data'],
    update: { ...data as object, updated_at: new Date() } as Parameters<typeof db.reading.update>[0]['data'],
  })
}

export async function updateReadingStatus(id: string, status: string) {
  return db.reading.update({
    where: { id },
    data: {
      status,
      ...(status === 'publicado' && { published_at: new Date() }),
      updated_at: new Date(),
    },
  })
}

export async function updateReadingMetrics(
  id: string,
  delta: { views?: number; unlocks?: number; shares?: number; avg_time_sec?: number }
) {
  return db.reading.update({
    where: { id },
    data: {
      ...(delta.views && { views: { increment: delta.views } }),
      ...(delta.unlocks && { unlocks: { increment: delta.unlocks } }),
      ...(delta.shares && { shares: { increment: delta.shares } }),
      ...(delta.avg_time_sec && { avg_time_sec: delta.avg_time_sec }),
      updated_at: new Date(),
    },
  })
}

// ── HELPERS DE UNLOCKS ─────────────────────────────────────────────

export async function createUnlock(readingId: string, stripeSession: string, country?: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
  return db.unlock.create({
    data: {
      reading_id: readingId,
      stripe_session: stripeSession,
      access_token: token,
      token_expires: expires,
      status: 'completed',
      amount_cents: 300,
      user_country: country,
    },
  })
}

export async function verifyUnlockToken(token: string, readingId: string): Promise<boolean> {
  const unlock = await db.unlock.findFirst({
    where: {
      access_token: token,
      reading_id: readingId,
      status: 'completed',
      token_expires: { gt: new Date() },
    },
  })
  return !!unlock
}

// ── HELPERS DE MÉTRICAS ────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0]
}

export async function upsertDailyMetric(
  readingId: string,
  field: 'views' | 'unlocks' | 'shares' | 'revenue_cts'
) {
  const date = today()
  return db.metricsDaily.upsert({
    where: { reading_id_date: { reading_id: readingId, date } },
    create: { reading_id: readingId, date, [field]: 1 },
    update: { [field]: { increment: 1 } },
  })
}

export async function upsertSiteMetric(field: 'total_views' | 'unlocks' | 'revenue_cts' | 'wa_shares') {
  const date = today()
  return db.siteMetrics.upsert({
    where: { date },
    create: { date, [field]: 1 },
    update: { [field]: { increment: 1 } },
  })
}

export async function getDashboardSummary() {
  const [totalPublished, totalUnlocks, totalRevenue, topReadings, recentMetrics] = await Promise.all([
    db.reading.count({ where: { status: 'publicado' } }),
    db.unlock.count({ where: { status: 'completed' } }),
    db.unlock.aggregate({ where: { status: 'completed' }, _sum: { amount_cents: true } }),
    db.reading.findMany({
      where: { status: 'publicado' },
      orderBy: { views: 'desc' },
      take: 10,
      select: { id: true, zona: true, contexto: true, views: true, unlocks: true, score_resonancia: true },
    }),
    db.siteMetrics.findMany({ orderBy: { date: 'desc' }, take: 14 }),
  ])
  return {
    totalPublished,
    totalUnlocks,
    totalRevenueCents: totalRevenue._sum.amount_cents ?? 0,
    topReadings,
    recentMetrics,
  }
}
