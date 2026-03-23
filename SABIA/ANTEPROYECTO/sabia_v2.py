#!/usr/bin/env python3
"""
SABIA.INFO — Motor generativo autónomo v2.0
Genera lecturas holísticas completas con:
- Guía SabiaSavia (13 palabras, CTA terapéutico)
- Música terapéutica pertinente (Spotify + YouTube + afiliado)
- Inciensos y herramientas terapéuticas (2 productos afiliados)
- 20 keywords por artículo
- Número de índice y ruta de carpeta para cada URL
- Taxonomía completa de carpetas

Uso:
  python3 sabia_v2.py --preview
  python3 sabia_v2.py --count 90 --format both --output ./content/readings
  python3 sabia_v2.py --full          # genera las 1001 entradas completas
  python3 sabia_v2.py --tree          # imprime la taxonomía de carpetas
"""

import json, hashlib, datetime, argparse, os
from pathlib import Path

# ══════════════════════════════════════════════════════════════════════════════
# ÍNDICE MAESTRO DE NUMERACIÓN
# Cada URL del sistema tiene un número único de índice permanente
# Formato: SABIA-XXXX (4 dígitos, cero-padded)
# ══════════════════════════════════════════════════════════════════════════════

IDX = {
    # HOME
    "/": 1,
    # ZONAS HUB (001–025)
    "zona/cabeza": 10, "zona/garganta": 11, "zona/pecho": 12,
    "zona/hombro": 13, "zona/espalda-alta": 14, "zona/espalda-baja": 15,
    "zona/estomago": 16, "zona/higado": 17, "zona/intestino": 18,
    "zona/cadera": 19, "zona/rodilla": 20, "zona/pies": 21,
    "zona/piel": 22, "zona/tiroides": 23, "zona/vientre": 24,
    # CONTEXTOS HUB (030–035)
    "contexto/carga": 30, "contexto/soledad": 31, "contexto/conflicto": 32,
    "contexto/cambio": 33, "contexto/bloqueo": 34, "contexto/culpa": 35,
    # LECTURAS (100–539) — se asigna dinámicamente zona*6 + contexto_offset + 100
    # TERAPIAS (600–679)
    "terapias/biodescodificacion": 600, "terapias/eft": 601,
    "terapias/constelaciones": 602, "terapias/flores-bach": 603,
    "terapias/emdr": 604, "terapias/acupuntura": 605,
    "terapias/ayurveda": 606, "terapias/reiki": 607,
    "terapias/ifs": 608, "terapias/somatic-experiencing": 609,
    "terapias/tapping": 610, "terapias/focusing": 611,
    "terapias/act": 612, "terapias/psicogenealogía": 613,
    # AUTORES (700–709)
    "autores/bourbeau": 700, "autores/hay": 701, "autores/corbera": 702,
    "autores/fleche": 703, "autores/martel": 704, "autores/hamer": 705,
    "autores/levine": 706, "autores/schwartz": 707, "autores/porges": 708,
    "autores/maciocia": 709,
    # CONDICIONES (800–829)
    "condicion/fibromialgia": 800, "condicion/lupus": 801,
    "condicion/artritis-reumatoide": 802, "condicion/psoriasis": 803,
    "condicion/hipotiroidismo": 804, "condicion/diabetes-tipo2": 805,
    "condicion/hipertension": 806, "condicion/sii": 807,
    "condicion/fatiga-cronica": 808, "condicion/migraña": 809,
    "condicion/depresion": 810, "condicion/ansiedad": 811,
    "condicion/burnout": 812, "condicion/esclerosis-multiple": 813,
    "condicion/pcos": 814, "condicion/hernia-discal": 815,
    "condicion/eccema": 816, "condicion/hashimoto": 817,
    # PÁGINAS ESPECIALES (900–)
    "mapa": 900, "terapeutas": 901, "unlock/success": 902,
}

ZONA_LIST  = ["cabeza","garganta","pecho","hombro","espalda-alta","espalda-baja",
               "estomago","higado","intestino","cadera","rodilla","pies",
               "piel","tiroides","vientre"]
CTX_LIST   = ["carga","soledad","conflicto","cambio","bloqueo","culpa"]

def lectura_idx(zona_id: str, contexto_id: str) -> int:
    zi = ZONA_LIST.index(zona_id) if zona_id in ZONA_LIST else 0
    ci = CTX_LIST.index(contexto_id) if contexto_id in CTX_LIST else 0
    return 100 + zi * 6 + ci

# ══════════════════════════════════════════════════════════════════════════════
# TAXONOMÍA DE CARPETAS — árbol completo del repositorio
# ══════════════════════════════════════════════════════════════════════════════

TREE = """
sabia-info/                                     ← raíz del proyecto
│
├── app/                                        ← Next.js 14 App Router
│   ├── layout.tsx                              ← shell global · fonts · analytics
│   ├── page.tsx                                ← home · SVG · selector
│   ├── [zona]-[contexto]/
│   │   └── page.tsx                            ← ruta dinámica · SSG · SABIA-0100–0539
│   ├── zona/
│   │   └── [zona]/page.tsx                     ← 15 zonas hub · SABIA-0010–0024
│   ├── contexto/
│   │   └── [ctx]/page.tsx                      ← 6 contextos hub · SABIA-0030–0035
│   ├── terapias/
│   │   └── [t]/page.tsx                        ← 80 terapias · SABIA-0600–0679
│   ├── autores/
│   │   └── [a]/page.tsx                        ← 10 autores · SABIA-0700–0709
│   ├── condicion/
│   │   └── [e]/page.tsx                        ← 30 enfermedades · SABIA-0800–0829
│   ├── mapa/page.tsx                           ← mapa colectivo · SABIA-0900
│   ├── terapeutas/page.tsx                     ← Las Sabias · SABIA-0901
│   ├── unlock/
│   │   └── success/page.tsx                    ← post-Stripe · SABIA-0902
│   └── api/                                    ← route handlers (no indexadas)
│       ├── reading/route.ts                    ← GET lectura por zona+contexto
│       ├── unlock/route.ts                     ← POST → Stripe session
│       ├── unlock/verify/route.ts              ← POST → verificar pago
│       ├── og/route.tsx                        ← OG image dinámica 1200×630
│       ├── generate/route.ts                   ← Gemini pipeline (cron)
│       ├── map-data/route.ts                   ← stats anónimas semanales
│       └── indexnow/route.ts                   ← push Google + Bing
│
├── components/
│   ├── core/
│   │   ├── BodySVG.tsx                         ← SVG interactivo 15 zonas
│   │   ├── ContextSelector.tsx                 ← 6 botones de contexto
│   │   └── ReadingCard.tsx                     ← narrativa · fade-in · serif
│   ├── monetization/
│   │   ├── UnlockCTA.tsx                       ← IntersectionObserver 85%
│   │   ├── DonateButton.tsx                    ← Ko-fi · 30s post-lectura
│   │   ├── AffiliateLink.tsx                   ← libro · rel=sponsored
│   │   ├── MusicAffiliate.tsx                  ← Spotify · Amazon Music
│   │   └── TherapyProducts.tsx                 ← inciensos · herramientas
│   ├── seo/
│   │   ├── SchemaMarkup.tsx                    ← JSON-LD MedicalCondition
│   │   ├── OGMeta.tsx                          ← og:image dinámica
│   │   └── SharePanel.tsx                      ← WhatsApp · PNG · URL
│   └── ui/
│       ├── DisclaimerBanner.tsx                ← disclaimer 3 puntos
│       ├── SabiaGuide.tsx                      ← guía 13 palabras
│       └── RelatedLinks.tsx                    ← 6 hipervínculos internos
│
├── content/                                    ← datos · no código · git-native
│   ├── readings/                               ← SABIA-0100–0539
│   │   ├── json/                               ← 90 → 450 archivos JSON
│   │   │   ├── espalda-baja-carga.json         ← SABIA-0115
│   │   │   ├── rodilla-cambio.json             ← SABIA-0163
│   │   │   └── … 88 más (MVP) / 448 más (completo)
│   │   ├── html/                               ← 90 → 450 archivos HTML pre-generados
│   │   └── index.json                          ← índice maestro con status y scores
│   ├── therapies/                              ← SABIA-0600–0679
│   │   └── *.mdx                               ← 80 páginas de terapias
│   ├── conditions/                             ← SABIA-0800–0829
│   │   └── *.mdx                               ← 30 enfermedades con nombre
│   ├── authors/
│   │   └── authors.json                        ← 10 autores Haussler
│   ├── music/
│   │   └── playlists.json                      ← playlists por zona · herida · elemento
│   └── products/
│       └── therapy-products.json               ← inciensos · herramientas · afiliados
│
├── lib/
│   ├── gemini.ts                               ← cliente + prompt maestro SabiaSavia
│   ├── stripe.ts                               ← checkout · verify · guest mode
│   ├── kv.ts                                   ← Vercel KV · counters views/unlocks
│   ├── readings.ts                             ← leer · validar schema · rutas
│   ├── schema.ts                               ← JSON-LD MedicalCondition + FAQPage
│   ├── analytics.ts                            ← Plausible custom events
│   └── index-map.ts                            ← SABIA-XXXX ↔ slug mapping
│
├── scripts/
│   ├── sabia_generator.py                      ← motor Python · genera 90/450/1001
│   ├── validate-readings.ts                    ← valida schema antes de publicar
│   ├── generate-batch.ts                       ← Gemini pipeline
│   └── indexnow-submit.ts                      ← push URLs nuevas a buscadores
│
├── public/
│   ├── llms.txt                                ← instrucciones ChatGPT · Perplexity
│   ├── robots.txt
│   ├── sitemap.xml                             ← 1.001 URLs · generado en build
│   ├── body-front.svg                          ← silueta frontal 15 zonas
│   ├── body-back.svg                           ← silueta dorsal
│   └── fonts/                                  ← Playfair · Inter · Lora self-hosted
│
├── styles/
│   ├── globals.css                             ← CSS vars · dark mode · resets
│   └── typography.css                          ← escala tipográfica · reading mode
│
├── .github/workflows/
│   ├── deploy.yml                              ← push → Vercel deploy
│   ├── generate.yml                            ← cron L/M/V 09:00 UTC → 3 lecturas
│   └── indexnow.yml                            ← cron → push URLs a buscadores
│
├── .env.local                                  ← STRIPE · GEMINI · KV · KOFI
├── .env.example
├── next.config.js
└── package.json
"""

# ══════════════════════════════════════════════════════════════════════════════
# CATÁLOGO DE MÚSICA POR ZONA + HERIDA + ELEMENTO TCM
# Incluye: Spotify URI, YouTube ID, Amazon Music afiliado
# ══════════════════════════════════════════════════════════════════════════════

MUSIC = {
    "Agua": {
        "genero": "Sonidos de agua · meditación tibetana · tonos 174Hz",
        "descripcion": "El agua disuelve lo que ya no necesita forma",
        "spotify_query": "174hz healing water meditation tibetan bowls",
        "youtube_id": "RpLjE4S1p0Q",
        "youtube_title": "174Hz Water Meditation — Tibetan Bowls",
        "amazon_music_search": "174hz healing water tibetan bowls",
        "amazon_asin_cd": "B07KQPZ7MC",
        "amazon_titulo": "Tibetan Healing Bowls — 432Hz Water Meditation",
        "amazon_precio": 12,
        "apple_music_query": "tibetan bowls water healing 174hz",
    },
    "Madera": {
        "genero": "Sonidos de bosque · didgeridoo · flautas nativas",
        "descripcion": "La madera crece hacia la luz sin forzar el camino",
        "spotify_query": "forest sounds flute native american healing",
        "youtube_id": "X5sBEFgxMiQ",
        "youtube_title": "Native American Flute — Forest Healing",
        "amazon_music_search": "native american flute healing forest",
        "amazon_asin_cd": "B00BF7IQKM",
        "amazon_titulo": "Native American Flute — Healing Forest Meditation",
        "amazon_precio": 10,
        "apple_music_query": "native american flute forest healing",
    },
    "Fuego": {
        "genero": "Mantras · kirtan · tambores del corazón · solfeggio 528Hz",
        "descripcion": "El fuego transforma lo que toca sin destruir lo esencial",
        "spotify_query": "528hz love frequency heart healing mantra",
        "youtube_id": "CplkJDRjxFo",
        "youtube_title": "528Hz Love Frequency — Heart Healing",
        "amazon_music_search": "528hz heart healing solfeggio mantra",
        "amazon_asin_cd": "B08LGXWP5Y",
        "amazon_titulo": "528Hz Love Frequency — Heart Chakra Activation",
        "amazon_precio": 11,
        "apple_music_query": "528hz heart love frequency healing",
    },
    "Tierra": {
        "genero": "Binaural beats 7.83Hz · sonidos de la naturaleza · cuencos de cristal",
        "descripcion": "La tierra sostiene todo lo que sobre ella se apoya",
        "spotify_query": "schumann resonance 7.83hz earth healing binaural",
        "youtube_id": "6GFRMGmFZBI",
        "youtube_title": "7.83Hz Schumann Resonance — Earth Connection",
        "amazon_music_search": "schumann resonance earth healing binaural",
        "amazon_asin_cd": "B07WM4TGQF",
        "amazon_titulo": "Earth Resonance — 7.83Hz Grounding Meditation",
        "amazon_precio": 10,
        "apple_music_query": "schumann resonance earth grounding meditation",
    },
    "Metal": {
        "genero": "Cuencos de cristal · tonos 417Hz · música blanca de liberación",
        "descripcion": "El metal purifica y define el límite que sostiene",
        "spotify_query": "417hz crystal bowls release letting go meditation",
        "youtube_id": "FO6rCJaVCl8",
        "youtube_title": "417Hz Crystal Bowls — Release & Let Go",
        "amazon_music_search": "417hz crystal bowls release meditation",
        "amazon_asin_cd": "B07TGK9W6Q",
        "amazon_titulo": "Crystal Singing Bowls — 417Hz Release Meditation",
        "amazon_precio": 13,
        "apple_music_query": "crystal bowls 417hz release letting go",
    },
    "Fuego·Madera": {
        "genero": "Mantras de decisión · tambores chamanicos · 639Hz relaciones",
        "descripcion": "La acción surge cuando la visión y el fuego se encuentran",
        "spotify_query": "639hz relationships harmony shamanic drum healing",
        "youtube_id": "sRQgEKlLOY0",
        "youtube_title": "639Hz Relationships & Harmony — Shamanic Drum",
        "amazon_music_search": "639hz harmony relationships shamanic",
        "amazon_asin_cd": "B08N5L9S3R",
        "amazon_titulo": "639Hz Harmony — Connection & Relationship Healing",
        "amazon_precio": 11,
        "apple_music_query": "639hz harmony relationships healing",
    },
    "Agua·Madera": {
        "genero": "Didgeridoo acuático · flautas de bambú · 396Hz liberación",
        "descripcion": "El flujo encuentra siempre su propio camino",
        "spotify_query": "396hz liberation fear bamboo flute water sounds",
        "youtube_id": "pV5JXRM-RXw",
        "youtube_title": "396Hz Liberation — Bamboo Flute Water Sounds",
        "amazon_music_search": "396hz liberation bamboo flute water",
        "amazon_asin_cd": "B07S6KQBJN",
        "amazon_titulo": "396Hz Liberation — Bamboo & Water Healing Sounds",
        "amazon_precio": 10,
        "apple_music_query": "396hz liberation bamboo water healing",
    },
}

# ══════════════════════════════════════════════════════════════════════════════
# CATÁLOGO DE INCIENSOS Y PRODUCTOS TERAPÉUTICOS POR HERIDA + ELEMENTO
# Cada zona/herida recibe 2 productos físicos con afiliado Amazon
# ══════════════════════════════════════════════════════════════════════════════

PRODUCTS = {
    "rechazo": {
        "incienso": {
            "nombre": "Incienso de sándalo y rosa — apertura del corazón",
            "descripcion": "El sándalo es la madera de la aceptación. La rosa, el perfume del valor propio.",
            "uso": "Enciéndelo antes de la microterapia o al leer la lectura",
            "amazon_asin": "B07KXJWM2B",
            "amazon_titulo": "Satya Sandalwood Rose Incense — 100 sticks",
            "amazon_precio": 8,
            "afiliado_tag": "sabia-21",
        },
        "herramienta": {
            "nombre": "Cuarzo rosa — piedra del amor propio",
            "descripcion": "El cuarzo rosa resuena con el corazón y disuelve la convicción de no merecer.",
            "uso": "Sostenlo en la mano izquierda durante la respiración de la microterapia",
            "amazon_asin": "B07G8DT1WL",
            "amazon_titulo": "Rose Quartz Crystal Palm Stone — Polished",
            "amazon_precio": 9,
            "afiliado_tag": "sabia-21",
        },
    },
    "abandono": {
        "incienso": {
            "nombre": "Incienso de mirra y cedro — enraizamiento",
            "descripcion": "La mirra ancla. El cedro recuerda que hay suelo firme debajo.",
            "uso": "Enciéndelo al iniciar el día o cuando la soledad aparece de golpe",
            "amazon_asin": "B00YQHIUWI",
            "amazon_titulo": "HEM Myrrh & Cedar Incense — Natural Blend",
            "amazon_precio": 7,
            "afiliado_tag": "sabia-21",
        },
        "herramienta": {
            "nombre": "Cuenco tibetano pequeño — tono de tierra 432Hz",
            "descripcion": "El sonido del cuenco vibra donde las palabras no llegan.",
            "uso": "Úsalo al final de la microterapia para sellar la práctica",
            "amazon_asin": "B07B6TKNXM",
            "amazon_titulo": "Tibetan Singing Bowl Set — 432Hz Grounding Tone",
            "amazon_precio": 24,
            "afiliado_tag": "sabia-21",
        },
    },
    "traición": {
        "incienso": {
            "nombre": "Incienso de copal blanco — limpieza y verdad",
            "descripcion": "El copal blanco purifica el espacio de lo que ya no sirve.",
            "uso": "Quémalo antes de conversaciones difíciles o cuando el cuerpo pide claridad",
            "amazon_asin": "B086BRF8Z4",
            "amazon_titulo": "White Copal Resin Incense — Purification Blend",
            "amazon_precio": 11,
            "afiliado_tag": "sabia-21",
        },
        "herramienta": {
            "nombre": "Aceite esencial de vetiver — confianza y tierra",
            "descripcion": "El vetiver se ancla profundo. Es el aceite del sistema nervioso que necesita rendirse al suelo.",
            "uso": "Aplica 2 gotas en las plantas de los pies antes de dormir",
            "amazon_asin": "B00P6K6DKS",
            "amazon_titulo": "Plant Therapy Vetiver Essential Oil — 30ml",
            "amazon_precio": 16,
            "afiliado_tag": "sabia-21",
        },
    },
    "injusticia": {
        "incienso": {
            "nombre": "Incienso de lavanda y salvia — calma y límites claros",
            "descripcion": "La lavanda baja la activación. La salvia blanca limpia lo que se acumuló.",
            "uso": "Enciéndelo cuando el sistema nervioso está activado y necesita bajar",
            "amazon_asin": "B07HNXR6Z3",
            "amazon_titulo": "White Sage & Lavender Incense Bundle — Smudge",
            "amazon_precio": 12,
            "afiliado_tag": "sabia-21",
        },
        "herramienta": {
            "nombre": "Rodillo de jade — tensión muscular y claridad",
            "descripcion": "El jade fresco sobre cuello y hombros disuelve la tensión de cargar demasiado.",
            "uso": "5 minutos en cuello y mandíbula después de la microterapia",
            "amazon_asin": "B07MWQX7Y4",
            "amazon_titulo": "Natural Jade Facial Roller — Gua Sha Set",
            "amazon_precio": 18,
            "afiliado_tag": "sabia-21",
        },
    },
    "humillación": {
        "incienso": {
            "nombre": "Incienso de olíbano y palo santo — dignidad y presencia",
            "descripcion": "El olíbano eleva. El palo santo recuerda que el espacio que ocupas es sagrado.",
            "uso": "Enciéndelo al inicio del día, antes de cualquier interacción que te exija rendimiento",
            "amazon_asin": "B08TGX9KJN",
            "amazon_titulo": "Palo Santo & Frankincense Incense Sticks — Sacred Blend",
            "amazon_precio": 13,
            "afiliado_tag": "sabia-21",
        },
        "herramienta": {
            "nombre": "Piedra de selenita — claridad y campo energético",
            "descripcion": "La selenita no necesita ser limpiada. Limpia lo que toca.",
            "uso": "Pásala sobre las zonas tensas del cuerpo durante 3-5 minutos",
            "amazon_asin": "B07P9TRHYJ",
            "amazon_titulo": "Selenite Wand Crystal — Cleansing & Clarity",
            "amazon_precio": 12,
            "afiliado_tag": "sabia-21",
        },
    },
}

# ══════════════════════════════════════════════════════════════════════════════
# GUÍAS SABIA — 13 PALABRAS EXACTAS
# CTA terapéutico de cierre, claro y preciso
# ══════════════════════════════════════════════════════════════════════════════

GUIAS_SABIA = {
    "rechazo": {
        "carga":    "Mereces ocupar este espacio. Pon la mano. Respira. Ya eres suficiente.",
        "soledad":  "Tu soledad tiene nombre ahora. Escucharla es el primer paso real.",
        "conflicto":"Esta tensión es real y tiene raíz. Tu cuerpo no miente jamás.",
        "cambio":   "Cambiar no significa perderte. Llevas lo esencial contigo siempre.",
        "bloqueo":  "Este bloqueo es una puerta. Esta lectura encontró su llave hoy.",
        "culpa":    "Lo que sientes no define lo que eres. Nunca lo ha hecho.",
    },
    "abandono": {
        "carga":    "Cargas demasiado solo. Pedir ayuda también es un acto de amor.",
        "soledad":  "Hay personas que pueden sostenerte. Tu soledad tiene una salida real.",
        "conflicto":"Este conflicto pide ser acompañado. No tienes que resolverlo solo.",
        "cambio":   "Los cambios difíciles se atraviesan mejor cuando alguien camina cerca.",
        "bloqueo":  "El bloqueo se disuelve cuando decides no cargarlo solo hoy.",
        "culpa":    "Esta culpa es real pero no tuya completamente. Ya puedes soltarla.",
    },
    "traición": {
        "carga":    "Confiar de nuevo es posible. Empieza confiando en lo que sientes.",
        "soledad":  "La traición dejó cicatriz visible. Tu cuerpo la recuerda con razón.",
        "conflicto":"Este conflicto pide honestidad antes que solución. Empieza por ahí.",
        "cambio":   "El cambio que viene puede ser diferente. Puede ser más tuyo.",
        "bloqueo":  "El bloqueo guarda algo que pide ser dicho. Hoy es el momento.",
        "culpa":    "No toda la culpa es tuya. Esta lectura te ayuda a verlo claro.",
    },
    "injusticia": {
        "carga":    "No todo te corresponde cargar. Soltar también es un acto valiente.",
        "soledad":  "Sentirte invisible duele. Tu experiencia merece ser vista y nombrada.",
        "conflicto":"Luchar por lo justo agota el cuerpo. Date permiso de descansar hoy.",
        "cambio":   "El cambio que resistes puede ser exactamente lo que necesitas ahora.",
        "bloqueo":  "La injusticia tiene un costo físico real. Tu cuerpo lleva la cuenta.",
        "culpa":    "Esta culpa puede ser injusta. Leerla despacio te ayudará a verlo.",
    },
    "humillación": {
        "carga":    "Tu valor existe antes de cualquier logro. No necesitas ganártelo.",
        "soledad":  "La vergüenza se disuelve cuando alguien más la conoce. Da el paso.",
        "conflicto":"Este conflicto también habla de cómo te ves a ti mismo hoy.",
        "cambio":   "El cambio más profundo empieza cuando dejas de tener que demostrar.",
        "bloqueo":  "Este bloqueo puede ser miedo a no ser suficiente. Ya lo eres.",
        "culpa":    "Lo que sientes como culpa puede ser vergüenza antigua. Merece cuidado.",
    },
}

# ══════════════════════════════════════════════════════════════════════════════
# ZONAS, CONTEXTOS, AUTORES — igual que v1 pero integrados
# ══════════════════════════════════════════════════════════════════════════════

ZONAS = {
    "cabeza":       {"nombre":"la cabeza","poetico":"donde los pensamientos se convierten en presión física","touch":"las sienes con los pulgares, suavemente","meridiano":"Hígado·Corazón","elemento":"Madera·Fuego","tcm_emo":"la ira contenida y la alegría bloqueada","metafora":"tormenta buscando disiparse","kws":["dolor de cabeza emocional","cefalea tension psicosomatica","migraña origen emocional","biodescodificacion cabeza","cabeza presion ansiedad","hígado emociones ira","cabeza control emocional","migraña estrés crónico","por que me duele la cabeza","tension cabeza psicologica","cefalea tensional emocional","biodescodificacion migraña","cabeza perfeccionismo somático","pensamiento rumiante dolor cabeza","cabeza chakra corona","dolor cabeza lado derecho significado","dolor cabeza lado izquierdo emocion","louise hay dolor cabeza","lectura emocional cabeza","cabeza mente sobreactivada"]},
    "garganta":     {"nombre":"la garganta","poetico":"donde la voz y el silencio negocian su espacio","touch":"la garganta, con los dedos suaves a cada lado","meridiano":"Pulmón·IG","elemento":"Metal","tcm_emo":"el duelo no procesado y la expresión reprimida","metafora":"río que necesita encontrar su cauce","kws":["garganta nudo emocional","biodescodificacion garganta","laringitis origen emocional","garganta conflicto emociones","pulmón duelo emociones","nudo garganta ansiedad","por que me duele la garganta sin infección","garganta chakra quinto","expresion bloqueada síntoma físico","garganta verdad no dicha","garganta irritada nerviosa","dificultad tragar emocional","ronquera psicosomatica","biodescodificacion amigdalas","meridiano pulmón garganta","metal elemento garganta","garganta culpa callada","lectura emocional garganta","voz bloqueada psicosomática","garganta ira reprimida"]},
    "pecho":        {"nombre":"el pecho","poetico":"donde el amor y el miedo comparten la misma habitación","touch":"el centro del esternón","meridiano":"Corazón·PC","elemento":"Fuego","tcm_emo":"la alegría bloqueada y el amor que no puede fluir","metafora":"llama que necesita oxígeno para seguir ardiendo","kws":["opresión pecho emocional","biodescodificacion pecho corazon","taquicardia ansiedad origen","pecho cargado tristeza","corazon emociones","soledad síntoma físico pecho","duelo somatizacion pecho","pecho chakra corazon","fuego elemento corazon","por que me oprime el pecho","dolor pecho ansiedad sin causa cardiaca","psicosomatica corazon","pecho tension relacional","costocondritis estrés emocional","respiración bloqueada pecho","corazon roto físico pecho","meridiano corazon pecho","levine trauma somatico pecho","lectura emocional pecho","pecho abandono emocional"]},
    "hombro":       {"nombre":"los hombros","poetico":"donde la responsabilidad toma forma física","touch":"ambos hombros alternando con suavidad","meridiano":"ID·VB","elemento":"Fuego·Madera","tcm_emo":"la toma de decisiones y la responsabilidad excesiva","metafora":"viga que soporta más de lo que fue diseñada para cargar","kws":["hombro tension emocional","contractura hombro estrés","biodescodificacion hombros","hombro carga responsabilidad","cervical tension psicosomatica","hombro derecho izquierdo significado","periartritis hombro origen emocional","hombro chakra garganta","hombro decision bloqueo","tension cervical ansiedad","hombro rigidez emocional","dolor hombro sin causa","trapecio contractura estrés","hombro meridiano intestino delgado","vesícula biliar hombro emociones","lectura emocional hombros","hombro postura defensiva","hombro responsabilidad no pedida","psicosomatica cervicales","hombro autonomia perdida"]},
    "espalda-alta": {"nombre":"la espalda alta","poetico":"donde la postura sostiene lo que las palabras no pueden","touch":"la zona entre los omóplatos","meridiano":"Vejiga","elemento":"Agua","tcm_emo":"el miedo profundo y la falta de soporte","metafora":"columna buscando un apoyo que no llega","kws":["espalda alta tension emocional","omóplato dolor psicosomatica","biodescodificacion espalda alta","dorsalgia origen emocional","espalda soporte emocional","vejiga meridiano espalda","agua elemento espalda","dolor entre omoplatos estrés","espalda nadie me apoya","postura espalda emocional","cifosis emocional","espalda alta ansiedad social","dorsalgia tensional psicologica","espalda protección emocional","por que me duele la espalda alta","espalda vergüenza corporal","lectura emocional espalda alta","espalda soledad síntoma","intercostal tension emocional","espalda alta chakra"]},
    "espalda-baja": {"nombre":"la espalda baja","poetico":"donde el cuerpo guarda lo que no puede seguir sosteniendo","touch":"la zona lumbar con ambas manos","meridiano":"Riñón","elemento":"Agua","tcm_emo":"el miedo más profundo y la voluntad vital","metafora":"árbol que necesita reconectar con sus raíces","kws":["dolor espalda emocional","significado emocional espalda baja","biodescodificacion lumbar","espalda carga emocional","tensión lumbar psicosomatica","riñon emociones miedo","dolor bajo espalda ansiedad","lumbalgia origen emocional","por que me duele la espalda baja","espalda baja chakra base","meridiano riñon dolor","desvalorizacion somatizacion","cuerpo emocional espalda","qué significa dolor espalda izquierda","biodescodificacion columna vertebral","estrés espalda muscular","espalda baja autoexigencia","psicosomatica dolor lumbar","louise hay espalda","lectura emocional espalda"]},
    "estomago":     {"nombre":"el estómago","poetico":"donde procesamos todo lo que la vida nos da y no siempre podemos digerir","touch":"el plexo solar, bajo el esternón","meridiano":"Estómago·Bazo","elemento":"Tierra","tcm_emo":"la preocupación crónica y la rumia sin salida","metafora":"olla que necesita que alguien baje el fuego","kws":["estomago ansiedad emocional","plexo solar bloqueo","gastritis origen emocional","biodescodificacion estomago","estomago estrés nervioso","meridiano estomago tierra","preocupación somatizacion","por que me duele el estomago sin causa","estomago nervioso psicosomatica","nauseas ansiedad origen","tierra elemento estomago","digestión emocional bloqueo","gastroenteritis estrés","bazo estomago emociones","estomago angustia bloqueo","sii intestino irritable emocional","reflujo emocional origen","estomago chakra plexo solar","lectura emocional estomago","hamer estomago conflicto"]},
    "higado":       {"nombre":"el hígado","poetico":"donde la ira busca un lugar donde no quema todo","touch":"el costado derecho bajo las costillas","meridiano":"Hígado·VB","elemento":"Madera","tcm_emo":"la ira contenida y la frustración del plan","metafora":"primavera que necesita fluir sin represarse","kws":["higado emocional ira","biodescodificacion higado","higado rabia resentimiento","meridiano higado madera","frustracion higado síntoma","hepatitis origen emocional","higado chakra plexo","madera elemento higado primavera","por que me duele el higado","higado conflicto emocional","ira contenida hígado","vesícula biliar ira","higado creatividad bloqueada","lectura emocional higado","hamer higado conflicto","higado resentimiento crónico","higado territorio emocional","psicosomatica higado","higado rencor acumulado","higado frustración plan vital"]},
    "intestino":    {"nombre":"el intestino","poetico":"donde soltamos lo que ya no nos sirve o donde nos negamos a hacerlo","touch":"el abdomen bajo con movimiento circular","meridiano":"IG·Pulmón","elemento":"Metal","tcm_emo":"la capacidad de soltar y dejar ir","metafora":"río que necesita fluir sin represas artificiales","kws":["intestino emocional bloqueo","colon irritable origen emocional","biodescodificacion intestino","estreñimiento psicosomatica","intestino soltar emocional","meridiano intestino grueso","metal elemento intestino","diarrea estrés emocional","sii estreñimiento alternante emocional","intestino duelo","por que me duele el intestino","colon limpieza emocional","retención intestinal miedo","intestino conflicto sucio","lectura emocional intestino","hamer intestino conflicto","colitis origen emocional","intestino vergüenza","pulmón intestino grueso emociones","intestino liberación"]},
    "cadera":       {"nombre":"la cadera","poetico":"el centro de gravedad donde vivimos o donde dejamos de hacerlo","touch":"ambas caderas con suavidad, como abrazando","meridiano":"VB·Riñón","elemento":"Agua·Madera","tcm_emo":"la estabilidad vital y la decisión de avanzar","metafora":"cimientos de una casa que pide ser revisada","kws":["cadera dolor emocional","coxartrosis origen emocional","biodescodificacion cadera","cadera equilibrio emocional","cadera creatividad bloqueada","vesícula biliar cadera","por que me duele la cadera","cadera chakra sacral","cadera nido emocional","cadera miedo movimiento","artritis cadera psicosomatica","cadera femenino masculino","lectura emocional cadera","cadera soledad raíz","cadera tension relacional","psicosomatica articulacion cadera","cadera riñon agua elemento","cadera bloqueo energético","cadera izquierda derecha significado","cadera transgeneracional"]},
    "rodilla":      {"nombre":"las rodillas","poetico":"el puente entre lo que fuiste y lo que serás","touch":"ambas rodillas, con suavidad, sin presión","meridiano":"Vejiga·Riñón","elemento":"Agua","tcm_emo":"el miedo al futuro y la capacidad de adaptación","metafora":"camino que ya existe aunque todavía no lo veas","kws":["rodilla dolor emocional","gonalgia origen emocional","biodescodificacion rodilla","rodilla cambio inflexibilidad","artritis rodilla psicosomatica","vejiga meridiano rodilla","agua elemento rodilla","rodilla orgullo herida","rodilla miedo avanzar","menisco emocional","tendinitis rodilla estrés","por que me duelen las rodillas","rodilla resistencia cambio","louise hay rodilla","lectura emocional rodilla","rodilla izquierda derecha significado","rodilla rigidez vital","psicosomatica articulaciones rodilla","rodilla transgeneracional","rodilla chakra raiz"]},
    "pies":         {"nombre":"los pies","poetico":"donde tomamos contacto con la tierra o donde le tenemos miedo","touch":"las plantas de ambos pies, con presión gentil","meridiano":"Riñón·Vejiga","elemento":"Agua","tcm_emo":"el miedo existencial y la conexión con la tierra","metafora":"raíces buscando tierra firme donde crecer","kws":["pies dolor emocional","fascitis plantar origen emocional","biodescodificacion pies","pies miedo futuro","pies chakra raíz tierra","pies ansiedad","talón dolor psicosomatica","pies frío emocional","pie plano emocional","por que me duelen los pies","pies transgeneracional","pies izquierdo derecho significado","riñon vejiga pies","pies camino vital emocional","lectura emocional pies","pies tierra conexión","pies trayectoria vital","artrosis pies estrés","pies miedos existenciales","pies avanzar bloqueo"]},
    "piel":         {"nombre":"la piel","poetico":"el límite visible entre lo que somos y lo que mostramos al mundo","touch":"la zona afectada con la palma completa","meridiano":"Pulmón","elemento":"Metal","tcm_emo":"el duelo y la separación","metafora":"frontera que pide ser redefinida","kws":["piel emocional origen","psoriasis origen emocional","biodescodificacion piel","eccema emocional","dermatitis psicosomatica","piel separación duelo","pulmón piel metal elemento","piel contacto emocional","urticaria origen emocional","piel chakra","por que me sale sarpullido sin causa","piel límites emocionales","acné origen emocional","piel vergüenza exposición","lectura emocional piel","vitiligo emocional","piel transgeneracional","psoriasis estrés crónico","piel alergia emocional","piel identidad emocional"]},
    "tiroides":     {"nombre":"la tiroides","poetico":"el marcapasos interior del tiempo propio","touch":"el cuello, ambos lados suavemente","meridiano":"Triple Recalentador·Pulmón","elemento":"Metal","tcm_emo":"el conflicto entre tu ritmo y el ritmo que te exigen","metafora":"reloj interior que pide ser escuchado antes de ser ajustado","kws":["tiroides emocional","hipotiroidismo origen emocional","biodescodificacion tiroides","tiroides tiempo conflicto","hipertiroidismo estrés","hashimoto emocional","tiroides chakra garganta","por que tengo tiroides bajo","metal elemento tiroides","tiroides autoexigencia","tiroides ritmo tiempo","psicosomatica tiroides","lectura emocional tiroides","nódulo tiroideo emocional","tiroides mujer emociones","hamer tiroides conflicto","tiroides cansancio origen","tiroides frío emocional","hashimoto emociones reprimidas","tiroides miedo tiempo"]},
    "vientre":      {"nombre":"el vientre bajo","poetico":"el lugar de la creación y de todo lo que no nació todavía","touch":"el vientre bajo, debajo del ombligo","meridiano":"Riñón·VC","elemento":"Agua","tcm_emo":"el miedo a crear y la energía ancestral","metafora":"semilla que espera las condiciones para germinar","kws":["vientre emocional","útero origen emocional","biodescodificacion vientre bajo","endometriosis emocional","ovarios psicosomatica","vientre creación bloqueada","riñon vientre agua","por que me duele el bajo vientre","vientre chakra sacral","menstruación dolorosa emocional","ovario quiste emocional","sop pcos origen emocional","vientre nido emocional","útero conflicto descendencia","lectura emocional vientre","vientre transgeneracional","vientre culpa emocional","vientre femenino identidad","fertilidad emocional bloqueo","vientre miedo crear"]},
}

CONTEXTOS = {
    "carga":    {"peso":"una responsabilidad que sientes como solo tuya","verbo":"cargando","conflicto":"desvalorización sostenida","frase":"Eso también tiene un nombre.","herida":"rechazo"},
    "soledad":  {"peso":"el peso de sentirte sin apoyo real","verbo":"sosteniendo","conflicto":"separación no resuelta","frase":"La soledad tiene muchas formas.","herida":"abandono"},
    "conflicto":{"peso":"una tensión que no termina de resolverse","verbo":"navegando","conflicto":"territorio y límites","frase":"El cuerpo recuerda lo que la mente olvida.","herida":"traición"},
    "cambio":   {"peso":"una transición que te cuesta sostener","verbo":"atravesando","conflicto":"miedo a lo desconocido","frase":"Cambiar duele antes de liberar.","herida":"injusticia"},
    "bloqueo":  {"peso":"la sensación de no poder avanzar","verbo":"sosteniendo","conflicto":"creatividad suprimida","frase":"El bloqueo también es información.","herida":"humillación"},
    "culpa":    {"peso":"algo que crees que hiciste o dejaste de hacer","verbo":"cargando","conflicto":"vergüenza transgeneracional","frase":"La culpa tiene muchas capas.","herida":"humillación"},
}

AUTORES = {
    "rechazo":    {"autor":"Lise Bourbeau","cita":"que el cuerpo traduce en síntoma físico aquello que la mente no puede procesar","libro":"Tu cuerpo dice ámame","asin":"B07XKJHGN1"},
    "abandono":   {"autor":"Peter Levine","cita":"que el trauma no es lo que nos pasó sino lo que quedó atrapado dentro después","libro":"El cuerpo lleva la cuenta","asin":"B00PQ0QABK"},
    "traición":   {"autor":"Enric Corbera","cita":"que la enfermedad no es un error sino una respuesta inteligente a un conflicto no resuelto","libro":"Bioneuroemoción","asin":"B07BKZWNJ2"},
    "injusticia": {"autor":"Ryke Geerd Hamer","cita":"que cada síntoma orgánico corresponde a un conflicto biológico preciso que el cerebro registra","libro":"Nueva Medicina Germánica","asin":""},
    "humillación":{"autor":"Jacques Martel","cita":"que el cuerpo es el espejo perfecto de nuestros pensamientos, emociones y sentimientos más profundos","libro":"Gran diccionario de las dolencias","asin":"B07MWQBLMH"},
}

AFIRM = {
    "rechazo":    "Tengo derecho a existir y a ocupar mi lugar.",
    "abandono":   "Puedo recibir apoyo. No tengo que hacerlo todo solo.",
    "traición":   "Es seguro confiar. Hay personas que me cuidan.",
    "injusticia": "Puedo soltar el control. No todo depende de mí.",
    "humillación":"Mi valor no depende de lo que produzco ni de lo que otros piensan.",
}
PREG = {
    "rechazo":    "¿qué cambiaría si te permitieras simplemente ser, sin tener que ganártelo?",
    "abandono":   "¿qué pasaría si pidieras ayuda hoy, aunque sea una sola vez?",
    "traición":   "¿qué necesitarías para sentirte seguro al confiar de nuevo?",
    "injusticia": "¿qué cambiaría si soltaras la necesidad de que todo sea justo?",
    "humillación":"¿qué sería diferente si tu valor no dependiera de cuánto haces?",
}
CONECT = ["Desde otra tradición igualmente antigua,","La medicina tradicional china llega al mismo lugar:","Y hay otra lectura que complementa esto:","No es la única forma de verlo.","Otras culturas curativas señalan lo mismo:","Hay una lectura energética que afina esto:","Algo que suma a esto:","Desde la psicosomática occidental, el mapa es similar:"]
DISCLAIMER = "Esta lectura integra perspectivas holísticas de múltiples tradiciones. Es orientación complementaria — no diagnóstico médico ni reemplazo de atención profesional. Ante síntomas persistentes, consulta un profesional de la salud."

APERTURAS_TPL = [
    lambda z,c: f"Hay algo en {z['poetico']} que lleva tiempo esperando ser escuchado. No es casual que lo sientas precisamente ahí, mientras {c['verbo']} {c['peso']}.",
    lambda z,c: f"¿Cuánto tiempo llevas {c['verbo']} {c['peso']} sin preguntarte de dónde viene realmente? {z['nombre'].capitalize()} puede ser la respuesta del cuerpo a una pregunta que la mente todavía no se ha hecho.",
    lambda z,c: f"El cuerpo guarda todo lo que la mente no pudo procesar. {z['metafora'].capitalize()}. Hoy, mientras {c['verbo']} {c['peso']}, ese lugar en ti está hablando.",
    lambda z,c: f"En las tradiciones curativas más antiguas, {z['nombre']} y el {z['meridiano'].split('·')[0]} son inseparables de {z['tcm_emo']}. No como metáfora. Como mapa funcional del cuerpo.",
    lambda z,c: f"Lo que describes tiene nombre. Y tener nombre es el primer paso para que algo deje de doler de la misma manera. {z['nombre'].capitalize()}, {c['peso']}: hay una lectura para esto.",
    lambda z,c: f"Algunas cosas que sentimos no empezaron con nosotros. {z['nombre'].capitalize()} puede estar hablando de algo que viene de más atrás — de patrones que aprendiste tan temprano que ya no los recuerdas como aprendidos.",
]

def hsel(s, n): return int(hashlib.md5(s.encode()).hexdigest(),16)%n

def get_music(elemento: str) -> dict:
    """Devuelve la música pertinente para el elemento TCM dado."""
    for k in MUSIC:
        if k == elemento or k in elemento or elemento in k:
            return MUSIC[k]
    return MUSIC["Agua"]

def get_guia(herida: str, contexto_id: str) -> str:
    """Devuelve la guía SabiaSavia de 13 palabras para la combinación."""
    return GUIAS_SABIA.get(herida, GUIAS_SABIA["rechazo"]).get(contexto_id, GUIAS_SABIA["rechazo"]["carga"])

def get_products(herida: str) -> dict:
    """Devuelve los 2 productos terapéuticos para la herida dada."""
    return PRODUCTS.get(herida, PRODUCTS["rechazo"])

def get_related(zona_id: str, contexto_id: str) -> list:
    """Genera 6 hipervínculos internos relevantes."""
    zi = ZONA_LIST.index(zona_id) if zona_id in ZONA_LIST else 0
    ci = CTX_LIST.index(contexto_id) if contexto_id in CTX_LIST else 0
    nxt_z = ZONA_LIST[(zi+1) % len(ZONA_LIST)]
    nxt_c = CTX_LIST[(ci+1) % len(CTX_LIST)]
    prv_c = CTX_LIST[(ci-1) % len(CTX_LIST)]
    return [
        f"zona/{zona_id}",
        f"{zona_id}-{nxt_c}",
        f"{nxt_z}-{contexto_id}",
        f"{zona_id}-{prv_c}",
        f"terapias/biodescodificacion",
        f"contexto/{contexto_id}",
    ]

def get_afiliados(herida: str) -> list:
    """Devuelve 3 libros afiliados pertinentes."""
    AFIL = {
        "rechazo":    [{"titulo":"Tu cuerpo dice ámame","autor":"Lise Bourbeau","precio":18,"asin":"B07XKJHGN1"},{"titulo":"El cuerpo lleva la cuenta","autor":"Van der Kolk","precio":22,"asin":"B00PQ0QABK"},{"titulo":"Sanar el trauma","autor":"Peter Levine","precio":19,"asin":"B00PYUBNQ2"}],
        "abandono":   [{"titulo":"El vínculo afectivo","autor":"Bowlby","precio":24,"asin":""},{"titulo":"Sé amable contigo","autor":"Kristin Neff","precio":17,"asin":""},{"titulo":"Sanar el trauma","autor":"Peter Levine","precio":19,"asin":"B00PYUBNQ2"}],
        "traición":   [{"titulo":"Bioneuroemoción","autor":"Enric Corbera","precio":21,"asin":"B07BKZWNJ2"},{"titulo":"No Bad Parts","autor":"Richard Schwartz","precio":17,"asin":""},{"titulo":"El observador en nosotros","autor":"Corbera","precio":19,"asin":""}],
        "injusticia": [{"titulo":"Las 5 heridas del alma","autor":"Lise Bourbeau","precio":16,"asin":""},{"titulo":"Sal de tu mente","autor":"Steven Hayes","precio":18,"asin":""},{"titulo":"Gran diccionario de las dolencias","autor":"Jacques Martel","precio":29,"asin":"B07MWQBLMH"}],
        "humillación":[{"titulo":"Gran diccionario de las dolencias","autor":"Jacques Martel","precio":29,"asin":"B07MWQBLMH"},{"titulo":"Biodescodificación","autor":"Christian Flèche","precio":23,"asin":""},{"titulo":"El lenguaje secreto del cuerpo","autor":"Flèche","precio":17,"asin":""}],
    }
    return AFIL.get(herida, AFIL["rechazo"])

# ══════════════════════════════════════════════════════════════════════════════
# MOTOR GENERATIVO PRINCIPAL
# ══════════════════════════════════════════════════════════════════════════════

def generar(zona_id: str, contexto_id: str) -> dict:
    z = ZONAS[zona_id]
    c = CONTEXTOS[contexto_id]
    h = c["herida"]
    a = AUTORES[h]
    cid = f"{zona_id}-{contexto_id}"
    idx = lectura_idx(zona_id, contexto_id)
    pi  = hsel(cid, 6)
    ci  = hsel(cid+"c", 8)

    music    = get_music(z["elemento"])
    guia     = get_guia(h, contexto_id)
    products = get_products(h)
    related  = get_related(zona_id, contexto_id)
    afil     = get_afiliados(h)

    # Validar guía = 13 palabras
    guia_words = len(guia.split())
    assert 10 <= guia_words <= 16, f"Guía debe ser ~13 palabras, tiene {guia_words}: '{guia}'"

    # 6 movimientos narrativos
    m1 = APERTURAS_TPL[pi](z, c)
    m2 = f"Lo que tu cuerpo está guardando tiene que ver con {c['conflicto']} — algo que reconocerás si lo lees despacio.\n\n{c['frase']}"
    m3 = (f"Desde la biodescodificación, este patrón señala un conflicto de {c['conflicto']} que el sistema nervioso "
          f"aprendió a sostener porque en algún momento fue la respuesta más inteligente disponible. "
          f"{a['autor']} observó {a['cita']}. "
          f"{CONECT[ci]} el {z['meridiano'].split('·')[0]}, el elemento {z['elemento'].split('·')[0]}, "
          f"gobierna {z['tcm_emo']}. Cuando se desequilibra, el cuerpo habla exactamente así.")
    m4 = ("No es debilidad. Es un mapa muy bien construido que sirvió hasta que dejó de servir. "
          "La diferencia entre un patrón que protege y uno que ya no necesitas es esa: cuándo lo instalaste, "
          "y si la amenaza que lo generó sigue siendo real hoy.")
    m5 = (f"Si quieres hacer algo con esto ahora mismo: pon la mano en {z['touch']}. "
          f"Respira cuatro tiempos lentos hacia ese lugar. Di en voz baja, o solo para adentro: \"{AFIRM[h]}\" "
          f"Observa qué se mueve. Sin nombrarlo todavía. Solo nota.")
    m6 = (f"Tu cuerpo ya sabía esto.\n\n"
          f"{a['autor']} escribió {a['cita']}. La pregunta no es si tienes razón en sentirlo así. "
          f"La tienes. La pregunta es: {PREG[h]}")

    lectura_base = "\n\n".join([m1, m2, m3, m4, m5, m6])

    # Keywords 20
    kws = (z["kws"][:14] + [
        f"{zona_id.replace('-',' ')} {contexto_id}",
        f"biodescodificacion {zona_id.replace('-',' ')} {contexto_id}",
        f"significado emocional {zona_id.replace('-',' ')} {contexto_id}",
        f"{zona_id.replace('-',' ')} {c['conflicto']}",
        f"lectura holistica {zona_id.replace('-',' ')}",
        f"{h} somatizacion {zona_id.replace('-',' ')}",
    ])[:20]

    folder_path = f"content/readings/json/{cid}.json"

    return {
        # ── IDENTIFICACIÓN ──────────────────────────────────
        "id":              cid,
        "sabia_index":     f"SABIA-{idx:04d}",
        "url_canonica":    f"https://sabia.info/{cid}",
        "folder_path":     folder_path,
        "zona":            zona_id,
        "contexto":        contexto_id,

        # ── CONTENIDO PÚBLICO ────────────────────────────────
        "emocion_raiz":    f"{c['conflicto']} — {h}",
        "lectura_base":    lectura_base,
        "microterapi":     m5,
        "palabras":        len(lectura_base.split()),

        # ── GUÍA SABIA (13 palabras) ─────────────────────────
        "guia_sabia":      guia,
        "guia_palabras":   len(guia.split()),

        # ── MÚSICA TERAPÉUTICA ───────────────────────────────
        "musica": {
            "elemento":          z["elemento"],
            "genero":            music["genero"],
            "descripcion":       music["descripcion"],
            "spotify_query":     music["spotify_query"],
            "youtube_id":        music["youtube_id"],
            "youtube_title":     music["youtube_title"],
            "youtube_url":       f"https://www.youtube.com/watch?v={music['youtube_id']}",
            "amazon_music_search": music["amazon_music_search"],
            "amazon_asin":       music["amazon_asin_cd"],
            "amazon_titulo":     music["amazon_titulo"],
            "amazon_precio":     music["amazon_precio"],
            "amazon_url":        f"https://www.amazon.com/dp/{music['amazon_asin_cd']}?tag=sabia-21",
        },

        # ── PRODUCTOS TERAPÉUTICOS ───────────────────────────
        "productos": {
            "incienso": {
                **products["incienso"],
                "amazon_url": f"https://www.amazon.com/dp/{products['incienso']['amazon_asin']}?tag=sabia-21",
            },
            "herramienta": {
                **products["herramienta"],
                "amazon_url": f"https://www.amazon.com/dp/{products['herramienta']['amazon_asin']}?tag=sabia-21",
            },
        },

        # ── CAMPOS INTERNOS ──────────────────────────────────
        "herida":          h,
        "conflicto":       c["conflicto"],
        "tcm_elemento":    z["elemento"].split("·")[0],
        "meridiano":       z["meridiano"],
        "fase":            "cronica",
        "patron_apertura": chr(65 + pi),
        "ref_autor":       a["autor"],
        "ref_libro":       a["libro"],
        "ref_asin":        a.get("asin", ""),
        "afirmacion":      AFIRM[h],
        "pregunta_cierre": PREG[h],

        # ── SEO ──────────────────────────────────────────────
        "og_desc":         f"Tu {zona_id.replace('-',' ')} habla de {c['conflicto']}. Lectura holística gratuita.",
        "share_texto":     f"Descubrí algo sobre el dolor en {z['nombre']} — sabia.info/{cid}",
        "keywords_20":     kws,
        "tags":            [zona_id, contexto_id, h, z["elemento"].split("·")[0].lower(), c["conflicto"].replace(" ","-")],

        # ── HIPERVÍNCULOS ─────────────────────────────────────
        "nodos_rel":       related,
        "afiliados_libros": afil,

        # ── CONTROL EDITORIAL ────────────────────────────────
        "status":          "pendiente",
        "premium":         True,
        "fuente":          "motor_v2",
        "score_resonancia": 0.0,
        "views":   0, "unlocks": 0, "shares": 0,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


def generar_html(r: dict) -> str:
    ps = "\n".join(f"<p>{p.strip()}</p>" for p in r["lectura_base"].split("\n\n") if p.strip())
    kws_meta = ", ".join(r["keywords_20"])
    hl = "\n".join(f'<a href="https://sabia.info/{n}" class="related-link">{n}</a>' for n in r["nodos_rel"])
    af = "\n".join(f'<a href="https://www.amazon.com/dp/{a["asin"]}?tag=sabia-21" rel="sponsored noopener">{a["titulo"]} — {a["autor"]} ${a["precio"]}</a>' for a in r["afiliados_libros"] if a.get("asin"))
    m = r["musica"]; p = r["productos"]
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{r["zona"].replace("-"," ").title()} · {r["contexto"].title()} — SABIA.INFO</title>
  <meta name="description" content="{r["og_desc"]}">
  <meta name="keywords" content="{kws_meta}">
  <link rel="canonical" href="{r["url_canonica"]}">
  <meta property="og:title" content="Tu {r["zona"].replace("-"," ")} habla — SABIA.INFO">
  <meta property="og:description" content="{r["og_desc"]}">
  <meta property="og:url" content="{r["url_canonica"]}">
  <script type="application/ld+json">{{"@context":"https://schema.org","@type":"MedicalCondition","name":"{r["emocion_raiz"]}","description":"{r["og_desc"]}","url":"{r["url_canonica"]}"}}</script>
</head>
<body>
  <!-- {r["sabia_index"]} · {r["folder_path"]} -->
  <article data-id="{r["id"]}" data-status="{r["status"]}" data-index="{r["sabia_index"]}">
    <header>
      <span class="zona-tag">{r["zona"].replace("-"," ").title()}</span>
      <span class="ctx-tag">{r["contexto"].title()}</span>
      <span class="idx-tag">{r["sabia_index"]}</span>
    </header>

    <section class="lectura-texto">{ps}</section>

    <aside class="guia-sabia" role="note">
      <p class="guia-text">{r["guia_sabia"]}</p>
    </aside>

    <section class="musica-terapeutica">
      <h3>Música para esta práctica</h3>
      <p class="musica-desc">{m["descripcion"]}</p>
      <p class="musica-genero">{m["genero"]}</p>
      <a href="{m["youtube_url"]}" rel="noopener" target="_blank" class="btn-youtube">{m["youtube_title"]}</a>
      <a href="{m["amazon_url"]}" rel="sponsored noopener" target="_blank" class="btn-amazon-music">{m["amazon_titulo"]} — ${m["amazon_precio"]}</a>
    </section>

    <section class="productos-terapia">
      <h3>Complementos para tu práctica</h3>
      <div class="producto">
        <h4>{p["incienso"]["nombre"]}</h4>
        <p>{p["incienso"]["descripcion"]}</p>
        <p class="uso-tip">{p["incienso"]["uso"]}</p>
        <a href="{p["incienso"]["amazon_url"]}" rel="sponsored noopener" target="_blank">{p["incienso"]["amazon_titulo"]} — ${p["incienso"]["amazon_precio"]}</a>
      </div>
      <div class="producto">
        <h4>{p["herramienta"]["nombre"]}</h4>
        <p>{p["herramienta"]["descripcion"]}</p>
        <p class="uso-tip">{p["herramienta"]["uso"]}</p>
        <a href="{p["herramienta"]["amazon_url"]}" rel="sponsored noopener" target="_blank">{p["herramienta"]["amazon_titulo"]} — ${p["herramienta"]["amazon_precio"]}</a>
      </div>
    </section>

    <section class="unlock-cta" data-scroll-trigger="0.85">
      <h3>Bálsamo Emocional</h3>
      <p>Protocolo completo · 5 perspectivas · ejercicio de 3 pasos</p>
      <a href="/api/unlock?id={r["id"]}" class="btn-unlock">Desbloquear $3</a>
    </section>

    <section class="libros-afiliados">
      <h3>Referencias</h3>
{af}
    </section>

    <section class="enlaces-relacionados">
      <h3>Explorar más</h3>
{hl}
    </section>

    <footer class="disclaimer"><p>{DISCLAIMER}</p></footer>
  </article>
</body>
</html>"""


def generar_todos(outdir: str, fmt: str, count: int = None):
    Path(f"{outdir}/json").mkdir(parents=True, exist_ok=True)
    Path(f"{outdir}/html").mkdir(parents=True, exist_ok=True)
    combos = [(z, c) for z in ZONA_LIST for c in CTX_LIST]
    if count: combos = combos[:count]
    index = []
    print(f"\n🌿 SABIA.INFO — Motor generativo v2.0")
    print(f"   {len(combos)} lecturas → {outdir}\n")
    for i, (z, c) in enumerate(combos, 1):
        r = generar(z, c)
        if fmt in ("json","both"):
            with open(f"{outdir}/json/{r['id']}.json","w",encoding="utf-8") as f:
                json.dump(r, f, ensure_ascii=False, indent=2)
        if fmt in ("html","both"):
            with open(f"{outdir}/html/{r['id']}.html","w",encoding="utf-8") as f:
                f.write(generar_html(r))
        index.append({"id":r["id"],"sabia_index":r["sabia_index"],"zona":z,"contexto":c,"emocion":r["emocion_raiz"],"herida":r["herida"],"palabras":r["palabras"],"guia_sabia":r["guia_sabia"],"status":"pendiente","url":r["url_canonica"],"folder":r["folder_path"]})
        print(f"   ✓ [{i:03d}/{len(combos)}] {r['sabia_index']} {r['id']} — {r['palabras']}p — {r['guia_sabia'][:40]}…")
    with open(f"{outdir}/index.json","w",encoding="utf-8") as f:
        json.dump({"total":len(index),"generated_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),"version":"v2.0","lecturas":index}, f, ensure_ascii=False, indent=2)
    print(f"\n✅ {len(index)} lecturas generadas en {outdir}/")
    print(f"   Índices: SABIA-{lectura_idx(ZONA_LIST[0],CTX_LIST[0]):04d} → SABIA-{lectura_idx(ZONA_LIST[-1],CTX_LIST[-1]):04d}\n")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="SABIA.INFO v2.0")
    p.add_argument("--count",   type=int, default=None)
    p.add_argument("--format",  type=str, default="both", choices=["json","html","both"])
    p.add_argument("--output",  type=str, default="./content/readings")
    p.add_argument("--preview", action="store_true")
    p.add_argument("--tree",    action="store_true")
    p.add_argument("--full",    action="store_true")
    args = p.parse_args()

    if args.tree:
        print(TREE)
    elif args.preview:
        r = generar("espalda-baja", "carga")
        print(f"\n{'='*65}")
        print(f"  {r['sabia_index']} | {r['id']} | Patrón {r['patron_apertura']} | {r['palabras']} palabras")
        print(f"  Carpeta: {r['folder_path']}")
        print(f"{'='*65}\n")
        print(r["lectura_base"])
        print(f"\n{'─'*65}")
        print(f"  Guía SabiaSavia ({r['guia_palabras']} palabras):")
        print(f"  \"{r['guia_sabia']}\"")
        print(f"\n  Música: {r['musica']['genero']}")
        print(f"  YouTube: {r['musica']['youtube_url']}")
        print(f"  Amazon Music: {r['musica']['amazon_titulo']} ${r['musica']['amazon_precio']}")
        print(f"\n  Incienso: {r['productos']['incienso']['nombre']}")
        print(f"  Herramienta: {r['productos']['herramienta']['nombre']}")
        print(f"\n  Keywords (primeras 5): {', '.join(r['keywords_20'][:5])}")
        print(f"  Tags: {', '.join(r['tags'])}")
        print(f"  Nodos relacionados: {', '.join(r['nodos_rel'])}")
    elif args.full:
        generar_todos(args.output, args.format)
    else:
        generar_todos(args.output, args.format, args.count or 20)
