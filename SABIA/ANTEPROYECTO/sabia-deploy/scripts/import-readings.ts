// scripts/import-readings.ts
// Importa los JSON generados por sabia_v2.py a Postgres
// Uso: npx tsx scripts/import-readings.ts
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { db } from '../lib/db'

const JSON_DIR = join(process.cwd(), 'content/readings/json')

async function main() {
  const files = readdirSync(JSON_DIR).filter(f => f.endsWith('.json') && f !== 'index.json')
  console.log(`\n🌿 Importando ${files.length} lecturas...\n`)

  let imported = 0, skipped = 0, errors = 0

  for (const file of files) {
    const raw = readFileSync(join(JSON_DIR, file), 'utf-8')
    const data = JSON.parse(raw)

    try {
      await db.reading.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          sabia_index: data.sabia_index,
          url_slug: `/${data.id}`,
          zona: data.zona,
          contexto: data.contexto,
          herida: data.herida ?? '',
          tcm_elemento: data.tcm_elemento,
          meridiano: data.meridiano,
          cie10: data.cie10,
          tipo_condicion: data.tipo_condicion ?? 'fisica',
          emocion_raiz: data.emocion_raiz ?? '',
          lectura_libre: data.lectura_base ?? '',
          jung_analisis: data.jung_analisis ?? '',
          microterapi: JSON.stringify(data.microterapi ?? {}),
          maxima_sabia: data.maxima_sabia ?? data.guia_sabia ?? '',
          maxima_suntzu: data.maxima_suntzu ?? '',
          maxima_luz: data.maxima_luz ?? '',
          og_desc: data.og_desc ?? '',
          keywords_json: JSON.stringify(data.keywords_20 ?? []),
          tags_json: JSON.stringify(data.tags ?? []),
          share_wa_text: data.share_texto ?? '',
          ref_autor: data.ref_autor ?? '',
          ref_libro: data.ref_libro ?? '',
          afirmacion: data.afirmacion ?? '',
          pregunta_cierre: data.pregunta_cierre ?? '',
          patron_apertura: data.patron_apertura ?? 'A',
          status: data.status ?? 'pendiente',
          palabras: data.palabras ?? 0,
          fuente: data.fuente ?? 'motor_v2',
        },
        update: {
          emocion_raiz: data.emocion_raiz ?? '',
          lectura_libre: data.lectura_base ?? '',
          og_desc: data.og_desc ?? '',
          keywords_json: JSON.stringify(data.keywords_20 ?? []),
          palabras: data.palabras ?? 0,
          updated_at: new Date(),
        },
      })

      // Importar productos afiliados si existen
      if (data.afiliados_libros?.length || data.musica || data.productos) {
        const products = [
          ...(data.afiliados_libros ?? []).map((b: Record<string,unknown>, i: number) => ({
            reading_id: data.id, type: 'libro',
            name: String(b.titulo ?? ''), asin: String(b.asin ?? ''),
            price_usd: Number(b.precio ?? 0),
            url: `https://www.amazon.com/dp/${b.asin}?tag=sabia-21`,
            sort_order: i,
          })),
        ]
        for (const p of products) {
          await db.product.upsert({
            where: { id: `${data.id}-${p.type}-${p.sort_order}` },
            create: { id: `${data.id}-${p.type}-${p.sort_order}`, ...p },
            update: p,
          })
        }
      }

      imported++
      process.stdout.write(`  ✓ ${data.sabia_index} ${data.id}\n`)
    } catch (e) {
      errors++
      console.error(`  ✗ Error en ${file}:`, e)
    }
  }

  console.log(`\n✅ Completado: ${imported} importados · ${skipped} omitidos · ${errors} errores\n`)
  await db.$disconnect()
}

main().catch(console.error)
