# SABIA.INFO — Guía de Deploy Completa
## Tu cuerpo te dice.

**Estado:** Diseño 100% completo. Implementación técnica pendiente.
**Stack:** Next.js 14 · Vercel · Postgres · Redis · Stripe · Prisma
**Costo operativo:** $10/año (solo dominio)

---

## PASO 1 — Dominio (5 min)
```
1. Ve a namecheap.com o godaddy.com
2. Busca: sabia.info
3. Compra por ~$10/año
4. Guarda las credenciales — las necesitas para el DNS en Vercel
```

## PASO 2 — GitHub (5 min)
```
1. Ve a github.com/new
2. Nombre: sabia-info
3. Privado: SÍ
4. No inicialices con README
5. Copia la URL del repo: https://github.com/TU_USUARIO/sabia-info.git
```

## PASO 3 — Setup local (15 min)
```bash
# Instalar Node.js 20+ si no lo tienes
# https://nodejs.org

# Crear el proyecto
npx create-next-app@latest sabia-info \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd sabia-info

# Instalar dependencias
npm install \
  @prisma/client \
  prisma \
  @vercel/kv \
  stripe \
  @stripe/stripe-js

npm install -D tsx

# Copiar TODOS los archivos de este paquete al proyecto
# (ver instrucciones por carpeta abajo)

# Inicializar Prisma
npx prisma init

# Reemplazar prisma/schema.prisma con el archivo incluido en este paquete
```

## PASO 4 — Vercel (10 min)
```bash
# Instalar CLI de Vercel
npm i -g vercel

# Login
vercel login

# Deploy inicial
vercel

# Seguir el asistente:
# - Link to existing project? NO
# - Project name: sabia-info
# - Directory: ./
# - Override settings? NO

# Conectar dominio
vercel domains add sabia.info
```

## PASO 5 — Base de datos Vercel Postgres (5 min)
```
1. Ve a vercel.com/dashboard
2. Tu proyecto sabia-info → Storage → Create Database
3. Tipo: Postgres (powered by Neon)
4. Name: sabia-postgres
5. Region: iad1 (US East) o el más cercano a LATAM
6. Haz click "Create"
7. Ve a .env.local tab → copia DATABASE_URL y POSTGRES_URL
```

## PASO 6 — Vercel KV Redis (5 min)
```
1. Mismo proyecto → Storage → Create Database
2. Tipo: KV (Redis)
3. Name: sabia-kv
4. Ve a .env.local → copia KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN
```

## PASO 7 — Stripe (10 min)
```
1. Ve a dashboard.stripe.com
2. Crea cuenta o login
3. Modo TEST primero
4. Developers → API Keys
5. Copia: STRIPE_SECRET_KEY (sk_test_...)
6. Copia: STRIPE_PUBLISHABLE_KEY (pk_test_...)
7. Webhooks → Add endpoint
   URL: https://sabia.info/api/unlock/verify
   Events: checkout.session.completed
8. Copia: STRIPE_WEBHOOK_SECRET (whsec_...)
```

## PASO 8 — Variables de entorno (5 min)
```bash
# Crea el archivo .env.local en la raíz del proyecto
# Copia el contenido de env.local.example incluido en este paquete
# y llena todos los valores reales
```

## PASO 9 — Migración de base de datos (2 min)
```bash
# Con las variables de entorno configuradas:
npx prisma migrate deploy

# Seed inicial con artículos generados
python3 scripts/sabia_v2.py --count 20 --format json --output ./content/readings
npx tsx scripts/import-readings.ts
```

## PASO 10 — Deploy final (2 min)
```bash
# Push a GitHub → auto-deploy en Vercel
git add .
git commit -m "feat: SABIA.INFO MVP launch"
git push origin main

# Vercel detecta el push y hace deploy automático
# Tu sitio estará en https://sabia.info en ~60 segundos
```

## PASO 11 — Verificar todo funciona
```
✓ https://sabia.info carga
✓ SVG corporal responde al toque
✓ Una lectura abre completa
✓ Botón "Desbloquear $3" redirige a Stripe
✓ Dashboard accesible en /dashboard
✓ Métricas registrando visitas
```

---

## Archivos incluidos en este paquete

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Esta guía |
| `env.local.example` | Template de variables de entorno |
| `prisma/schema.prisma` | Schema completo de la base de datos |
| `scripts/sabia_v2.py` | Generador de lecturas Python |
| `scripts/import-readings.ts` | Importa JSON a Postgres |
| `scripts/score-readings.ts` | Calcula scores de resonancia |
| `lib/db.ts` | Cliente Prisma + helpers |
| `lib/kv.ts` | Redis KV estrategia de caché |
| `lib/stripe.ts` | Configuración Stripe |
| `lib/motor.ts` | Motor narrativo determinista |
| `app/api/reading/route.ts` | API GET lectura |
| `app/api/unlock/route.ts` | API POST Stripe checkout |
| `app/api/track/route.ts` | API tracking visitas |
| `app/api/og/route.tsx` | OG image dinámica |
| `PROMPT_MIGRACION.md` | Prompt para continuar en nuevo chat |

---

*SABIA.INFO · Paquete de deploy · Marzo 2026*
