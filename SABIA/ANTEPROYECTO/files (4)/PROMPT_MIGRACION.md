# SABIA.INFO — Prompt de migración para nuevo chat
## Pega este prompt completo al inicio del nuevo chat

---

Soy el creador de SABIA.INFO. El diseño está **100% completo**. 
Necesito implementación técnica para deploy esta semana.

## ESTADO DEL PROYECTO

**Lo que ya existe (no rediseñar):**
- Motor narrativo determinista completo (sabia_v2.py funcional)
- Schema Prisma completo (5 tablas, 32+ campos)
- API routes: /api/reading, /api/unlock, /api/track, /api/og
- lib/db.ts, lib/kv.ts, lib/stripe.ts completos
- GitHub Actions: generate.yml, deploy.yml
- package.json, next.config.js, prisma/schema.prisma
- Scripts: import-readings.ts, score-readings.ts, indexnow-submit.ts

**Lo que falta implementar:**

### PRIORIDAD 1 — El SVG corporal (BodySVG.tsx)
```
- 20 zonas táctiles en SVG viewBox="0 0 200 400"
- Menú contextual tipo right-click 3DS Max (3 niveles)
- Nivel 1: 6 contextos con 3 sinónimos cada uno
- Nivel 2: condiciones relacionadas con nombre común
- Nivel 3: acciones (lectura / jung / recursos)
- Hover states con color esmeralda #1D9E75
- Funciona en móvil 375px (touch targets 44x44px)
- Emite evento → router.push('/zona-contexto')
```

### PRIORIDAD 2 — Página de lectura ([zona]-[ctx]/page.tsx)
```
- SSG + ISR revalidate=3600
- generateStaticParams() de la DB
- generateMetadata() con OG dinámico
- ReadingCard.tsx con:
  - IntersectionObserver 85% → CTA paywall
  - setTimeout 30s → Ko-fi
  - useEffect cleanup → tracking tiempo
  - Token URL post-Stripe → unlock
```

### PRIORIDAD 3 — Dashboard (/dashboard)
```
- Auth simple con DASHBOARD_PASSWORD
- Las 7 pestañas ya diseñadas (están en el widget del chat anterior)
- Resumen 20 KPIs · Publicar · Editor · SEO · JSON · Design tokens · Salud
```

### PRIORIDAD 4 — Home (/)
```
- BodySVG centrado
- Tagline "Tu cuerpo te dice."
- Logo SABIA italic esmeralda
- Sin header pesado — mínimo y sereno
```

## PALETA DEFINITIVA (no cambiar)
```css
--bg: #F8F7F3;      /* crema cálido */
--s:  #FFFFFF;      /* superficie */
--em: #1A7A58;      /* esmeralda principal */
--em2: #0C4A34;     /* esmeralda profundo */
--em3: #2EAA7A;     /* esmeralda claro */
--emp: #EAF5EE;     /* verde pálido fondo */
--eml: #B8E0CE;     /* verde borde */
--gd: #8A6A12;      /* dorado Sun Tzu */
--gdp: #FBF7E8;     /* dorado pálido */
--vt: #4E3E8A;      /* violeta dirección interior */
--vtp: #F0EEF8;     /* violeta pálido */
--t1: #1A1816;      /* texto principal */
--t2: #3C3A30;      /* texto cuerpo lectura */
--t3: #7A786E;      /* texto suave */
--t4: #B0AEA4;      /* hints */
```

## ESTRUCTURA DE ARTÍCULO (en este orden exacto)
1. Emocion chip (verde pálido)
2. Lectura libre 430 palabras (Georgia serif, drop cap, frases solas centradas)
3. Diamond divider ──◇──
4. Máxima SabiaSavia (fondo #EAF5EE · borde izq #2EAA7A)
5. Máxima Sun Tzu (fondo #FBF7E8 · borde izq #E0C870)
6. Máxima Dirección interior (fondo #F0EEF8 · borde izq #C0B8E0)
7. Análisis junguiano (fondo #F0EEF8 · borde 1px #C0B8E0)
8. Diamond divider
9. Paywall blur + gate card oscura (bg #0C4A34)
10. Microterapia 3 pasos (números círculos esmeralda)
11. Guía SabiaSavia (fondo #EAF5EE · texto 15.5px italic)
12. 12 productos afiliados scroll horizontal
13. Share WhatsApp · Copiar · Ko-fi
14. 6 hipervínculos relacionados
15. Disclaimer (fondo #F2F1EC · texto 10.5px sans)

## STACK EXACTO
- Next.js 14 App Router TypeScript
- Vercel Postgres (Neon) + Prisma ORM
- Vercel KV (Redis)
- Stripe guest checkout $3
- Ko-fi embed
- Amazon Associates tag=sabia-21
- GitHub Actions CI/CD
- Plausible CE analytics (sin cookies)
- $0 hosting + $10/año dominio

## ARCHIVOS YA LISTOS (no tocar)
```
lib/db.ts           ✓ completo
lib/kv.ts           ✓ completo  
lib/stripe.ts       ✓ completo
prisma/schema.prisma ✓ completo
app/api/reading/    ✓ completo
app/api/unlock/     ✓ completo
app/api/track/      ✓ completo
app/api/og/         ✓ completo
scripts/*.ts        ✓ completos
.github/workflows/  ✓ completos
package.json        ✓ completo
next.config.js      ✓ completo
scripts/sabia_v2.py ✓ completo y probado
```

## TAREA INMEDIATA
1. Construir BodySVG.tsx con el menú contextual multinivel
2. Construir ReadingCard.tsx con los 3 loops y el paywall
3. Construir [zona]-[ctx]/page.tsx con SSG
4. Construir / (home) con el SVG centrado
5. Verificar que `npm run dev` funciona sin errores
6. Hacer primer deploy a Vercel

## CRITERIO DE ÉXITO MVP
5 shares orgánicos WhatsApp + 1 pago Stripe en 72h = modelo validado

---

*SABIA.INFO · Prompt de migración · Marzo 2026*
