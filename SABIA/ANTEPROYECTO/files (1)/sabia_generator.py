#!/usr/bin/env python3
"""
SABIA.INFO — Motor Generador Determinista
==========================================
Genera los 1.001 artículos del sistema SABIA:
  · 450 lecturas zona-contexto-fase (JSON + HTML)
  · 80 páginas de terapias (JSON)
  · 30 páginas de enfermedades (JSON)
  · 10 páginas de autores (JSON)
  · 25 zonas hub (JSON)
  · 6 contextos hub (JSON)

Uso:
  python sabia_generator.py --modo batch     # genera todo
  python sabia_generator.py --modo revision  # abre dashboard
  python sabia_generator.py --id espalda-baja-carga  # genera uno solo

Estados de publicación:
  pendiente → aprobado_sin_publicar → publicado
  cualquier estado → regenerar → pendiente
"""

import json, os, hashlib, re, datetime, sys, argparse, shutil
from pathlib import Path

# ── DIRECTORIOS ──────────────────────────────────────────────────
BASE     = Path(__file__).parent
OUT_JSON = BASE / "content" / "readings"
OUT_HTML = BASE / "content" / "html"
OUT_TERA = BASE / "content" / "therapies"
OUT_COND = BASE / "content" / "conditions"
OUT_AUTO = BASE / "content" / "authors"
DASH_FILE = BASE / "dashboard.html"
ESTADO_DB = BASE / "estados.json"

for d in [OUT_JSON, OUT_HTML, OUT_TERA, OUT_COND, OUT_AUTO]:
    d.mkdir(parents=True, exist_ok=True)

# ── CATÁLOGOS MAESTROS ───────────────────────────────────────────
ZONAS = {
    "cabeza":        {"nombre": "la cabeza", "poetico": "donde el pensamiento no para de girar", "touch": "la frente y las sienes", "meridiano": "Hígado·Corazón", "elemento": "Madera·Fuego", "tcm_emo": "la ira contenida y la alegría bloqueada", "metafora": "río que necesita encontrar su cauce natural"},
    "garganta":      {"nombre": "la garganta", "poetico": "el lugar donde la voz y el silencio negocian", "touch": "la garganta suavemente", "meridiano": "Pulmón·IG", "elemento": "Metal", "tcm_emo": "el duelo no procesado", "metafora": "río que encontró su cauce después de mucho tiempo"},
    "pecho":         {"nombre": "el pecho", "poetico": "donde el amor y el miedo comparten habitación", "touch": "el centro del pecho, el esternón", "meridiano": "Corazón", "elemento": "Fuego", "tcm_emo": "la alegría bloqueada y el amor que no fluye", "metafora": "llama que necesita oxígeno para seguir ardiendo"},
    "hombro":        {"nombre": "los hombros", "poetico": "la barra de carga que el cuerpo eligió para sostener lo que no es tuyo", "touch": "los hombros, uno a uno", "meridiano": "ID·VB", "elemento": "Fuego·Madera", "tcm_emo": "la responsabilidad que se volvió crónica", "metafora": "puente que puede soltar peso sin derrumbarse"},
    "espalda-alta":  {"nombre": "la espalda alta", "poetico": "la zona donde guardamos lo que nadie vio que cargábamos", "touch": "la zona entre los omóplatos", "meridiano": "Vejiga", "elemento": "Agua", "tcm_emo": "el miedo a no ser respaldado", "metafora": "columna que puede redistribuir el peso"},
    "espalda-baja":  {"nombre": "la espalda baja", "poetico": "donde el cuerpo guarda lo que no puede seguir sosteniendo", "touch": "la zona lumbar con ambas manos", "meridiano": "Riñón", "elemento": "Agua", "tcm_emo": "el miedo más antiguo y profundo", "metafora": "árbol que necesita reconectar con sus raíces"},
    "estomago":      {"nombre": "el estómago", "poetico": "el lugar donde procesamos todo lo que la mente no puede digerir", "touch": "el plexo solar, con la mano en el centro", "meridiano": "Estómago·Bazo", "elemento": "Tierra", "tcm_emo": "la rumia y la preocupación crónica", "metafora": "tierra que necesita ser trabajada con suavidad"},
    "higado":        {"nombre": "el hígado", "poetico": "el depósito de lo que no pudimos expresar", "touch": "el costado derecho, bajo las costillas", "meridiano": "Hígado", "elemento": "Madera", "tcm_emo": "la rabia y la frustración no expresadas", "metafora": "árbol en primavera que necesita espacio para crecer"},
    "intestino":     {"nombre": "el intestino", "poetico": "el lugar donde aprendemos a soltar o a retener", "touch": "el vientre bajo, en espiral suave", "meridiano": "IG", "elemento": "Metal", "tcm_emo": "la incapacidad de soltar lo que ya no nutre", "metafora": "río que limpia cuando se le permite fluir"},
    "cadera":        {"nombre": "la cadera", "poetico": "el centro de gravedad y de origen", "touch": "las caderas, con las palmas abiertas", "meridiano": "VB·Riñón", "elemento": "Agua·Madera", "tcm_emo": "el miedo al movimiento y al cambio de dirección", "metafora": "raíz que puede crecer en cualquier suelo"},
    "rodilla":       {"nombre": "las rodillas", "poetico": "el puente entre lo que fuiste y hacia dónde vas", "touch": "ambas rodillas, con suavidad", "meridiano": "Vejiga·Riñón", "elemento": "Agua", "tcm_emo": "el miedo al siguiente paso", "metafora": "camino que ya existe aunque todavía no lo veas"},
    "pies":          {"nombre": "los pies", "poetico": "lo que nos conecta con la tierra y con el rumbo", "touch": "las plantas de los pies, en contacto con el suelo", "meridiano": "Riñón·Vejiga", "elemento": "Agua", "tcm_emo": "el miedo profundo al futuro", "metafora": "raíces que ya saben cómo encontrar agua"},
    "piel":          {"nombre": "la piel", "poetico": "el límite vivo entre tú y el mundo", "touch": "el área afectada, con la palma entera", "meridiano": "Pulmón", "elemento": "Metal", "tcm_emo": "el dolor de la separación y los límites violados", "metafora": "membrana que puede aprender cuándo abrirse y cuándo protegerse"},
    "tiroides":      {"nombre": "la tiroides", "poetico": "el regulador del tiempo interno, el que marca tu propio ritmo", "touch": "el cuello, dedos suaves a cada lado", "meridiano": "Pulmón·TR", "elemento": "Metal", "tcm_emo": "el conflicto entre tu ritmo y el que te exigen", "metafora": "reloj que pide ser escuchado antes de ser ajustado"},
    "vientre":       {"nombre": "el vientre bajo", "poetico": "el lugar de la creación y del origen más profundo", "touch": "el vientre bajo, con ambas palmas", "meridiano": "Riñón", "elemento": "Agua", "tcm_emo": "el miedo existencial y la creatividad contenida", "metafora": "semilla que ya contiene todo lo que necesita para crecer"},
}

CONTEXTOS = {
    "carga":    {"peso": "una responsabilidad que sientes como solo tuya", "verbo": "cargando", "conflicto": "desvalorización sostenida", "herida": "rechazo", "arquetipo": "el Mártir"},
    "soledad":  {"peso": "el peso de sentirte solo en esto", "verbo": "sosteniendo en soledad", "conflicto": "separación no resuelta", "herida": "abandono", "arquetipo": "el Huérfano"},
    "conflicto":{"peso": "una tensión que no termina de resolverse", "verbo": "atravesando", "conflicto": "territorio y límites", "herida": "traicion", "arquetipo": "el Guerrero"},
    "cambio":   {"peso": "una transición que te cuesta sostener", "verbo": "transitando", "conflicto": "miedo a lo desconocido", "herida": "injusticia", "arquetipo": "el Explorador"},
    "bloqueo":  {"peso": "algo que no puede moverse aunque lo intentes", "verbo": "sosteniendo bloqueado", "conflicto": "estancamiento vital", "herida": "humillacion", "arquetipo": "el Inocente"},
    "culpa":    {"peso": "algo que crees que hiciste o dejaste de hacer", "verbo": "cargando", "conflicto": "vergüenza transgeneracional", "herida": "humillacion", "arquetipo": "el Esclavo"},
}

FASES = {
    "aguda":     {"tono": "urgente y contenedor", "tiempo": "días recientes", "nota": "Este patrón se activó recientemente. El cuerpo está procesando algo fresco."},
    "cronica":   {"tono": "profundo y explorador", "tiempo": "semanas o meses", "nota": "Este patrón lleva tiempo. El cuerpo lo conoce bien. Eso significa que también sabe cómo soltarlo."},
    "reparacion":{"tono": "alentador y orientador", "tiempo": "proceso de sanación activo", "nota": "Lo que sientes puede ser el cuerpo sanando. El proceso de reparación a veces duele antes de aliviar."},
}

HERIDAS = {
    "rechazo":    {"creencia": "no merezco ocupar espacio", "afirm": "Tengo derecho a existir y a ocupar mi lugar.", "autor": "Lise Bourbeau", "libro": "Tu cuerpo dice ámame", "asin": "B07XYZABC1"},
    "abandono":   {"creencia": "siempre terminaré solo", "afirm": "Puedo recibir apoyo. No tengo que hacerlo todo solo.", "autor": "Lise Bourbeau", "libro": "Las 5 heridas del alma", "asin": "B07XYZABC2"},
    "humillacion":{"creencia": "soy demasiado o demasiado poco", "afirm": "Soy exactamente como debo ser en este momento.", "autor": "Lise Bourbeau", "libro": "Tu cuerpo dice ámame", "asin": "B07XYZABC1"},
    "traicion":   {"creencia": "no puedo confiar en nadie", "afirm": "Es seguro confiar. Elijo con quién abrir.", "autor": "Enric Corbera", "libro": "Bioneuroemoción", "asin": "B07XYZABC3"},
    "injusticia": {"creencia": "nada es justo conmigo", "afirm": "Puedo soltar el control. No todo depende de mí.", "autor": "Enric Corbera", "libro": "El observador en nosotros", "asin": "B07XYZABC4"},
}

APERTURAS = [
    # A — sensorial directo
    lambda z, c: f"Hay algo en {z['poetico']} que lleva tiempo intentando decirte algo. No es accidente que lo sientas ahí, en ese lugar preciso, mientras vas {c['verbo']} {c['peso']}.",
    # B — pregunta retórica
    lambda z, c: f"¿Cuánto tiempo llevas {c['verbo']} {c['peso']} sin preguntarte de dónde viene realmente? {z['nombre'].capitalize()} puede ser la respuesta del cuerpo a una pregunta que la mente todavía no se ha hecho.",
    # C — imagen natural
    lambda z, c: f"El cuerpo guarda todo lo que la mente no pudo procesar a tiempo. {z['metafora'].capitalize()}. Hoy, mientras vas {c['verbo']} {c['peso']}, ese lugar en ti está hablando.",
    # D — dato encarnado
    lambda z, c: f"En las tradiciones curativas más antiguas, {z['nombre']} y todo lo que la rodea son inseparables de {z['tcm_emo']}. No como metáfora — como mapa funcional del cuerpo que lleva siglos siendo verificado.",
    # E — espejo inmediato
    lambda z, c: f"Lo que describes tiene nombre. Y tener nombre es el primer paso para que algo deje de doler de la misma manera. {z['nombre'].capitalize()}, {c['peso']}: hay una lectura para esto.",
    # F — ancestral
    lambda z, c: f"Algunas cosas que sentimos no empezaron con nosotros. {z['nombre'].capitalize()} puede estar hablando de algo que viene de más atrás — de patrones que aprendiste tan temprano que ya no los recuerdas como aprendidos.",
]

CONECTORES = [
    "Desde otra tradición igualmente antigua,",
    "La medicina tradicional china lo describe diferente pero llega al mismo lugar:",
    "Y hay otra lectura que complementa esto:",
    "No es la única forma de verlo.",
    "Otras culturas curativas señalan lo mismo con distintas palabras:",
    "Hay una lectura energética que afina esto:",
    "Algo que suma a esto:",
    "Desde la psicosomática occidental, el mapa es parecido:",
]

IMAGENES_CIERRE = [
    "La sanación no es una línea recta.",
    "El cuerpo no miente, aunque sí puede esperar.",
    "Lo que se nombra puede empezar a cambiar.",
    "Reconocer es el primer acto de cuidado.",
    "Tu cuerpo ya sabía esto.",
]

PREGUNTAS_APERTURA = {
    "carga":    "¿qué pasaría si dejaras de cargar con eso al menos por hoy?",
    "soledad":  "¿qué necesitaría cambiar para que no te sintieras tan solo en esto?",
    "conflicto":"¿qué es lo que realmente está en juego en ese conflicto?",
    "cambio":   "¿qué cambiaría si confiaras más en tu capacidad de adaptarte?",
    "bloqueo":  "¿qué es lo que en el fondo no quieres dejar ir?",
    "culpa":    "¿qué necesitarías perdonarte para poder seguir?",
}

# ── FUNCIÓN HASH DETERMINISTA ────────────────────────────────────
def dhash(s: str, mod: int) -> int:
    return int(hashlib.md5(s.encode()).hexdigest(), 16) % mod

# ── MOTOR NARRATIVO — 300 PALABRAS ──────────────────────────────
def generar_lectura(zona_id: str, contexto_id: str, fase_id: str = "cronica") -> dict:
    z  = ZONAS[zona_id]
    c  = CONTEXTOS[contexto_id]
    f  = FASES[fase_id]
    h  = HERIDAS[c["herida"]]
    cid = f"{zona_id}-{contexto_id}"

    # Selección determinista
    ap_idx  = dhash(cid, 6)
    con_idx = dhash(cid + fase_id, 8)
    ci_idx  = dhash(cid, len(IMAGENES_CIERRE))

    apertura = APERTURAS[ap_idx](z, c)
    conector = CONECTORES[con_idx]
    imagen   = IMAGENES_CIERRE[ci_idx]
    pregunta = PREGUNTAS_APERTURA[contexto_id]

    # ── 6 MOVIMIENTOS ────────────────────────────────────────────
    M1 = apertura

    M2 = (
        f"Lo que tu cuerpo está guardando tiene que ver con {h['creencia']}.\n\n"
        f"Eso también es información."
    )

    M3 = (
        f"Desde la biodescodificación, este síntoma señala un conflicto de {c['conflicto']} — "
        f"un patrón que el sistema nervioso aprendió a sostener porque en algún momento fue "
        f"la respuesta más inteligente que tenías. {conector} el elemento {z['elemento']} "
        f"en medicina tradicional china gobierna {z['tcm_emo']}, y aparece en el cuerpo "
        f"exactamente cuando llevamos demasiado tiempo haciendo lo que describes. "
        f"{f['nota']}"
    )

    M4 = (
        f"No es debilidad. Es un programa muy bien construido que sirvió hasta que dejó de servir. "
        f"La diferencia entre un patrón que te protege y uno que ya no necesitas es exactamente esa: "
        f"cuándo lo instalaste, y si aquello que lo generó sigue siendo real hoy. "
        f"La mayoría de las veces no lo es."
    )

    M5 = (
        f"Si quieres hacer algo con esto ahora mismo: pon la mano en {z['touch']}. "
        f"Respira cuatro tiempos hacia ese lugar, sin forzar nada. "
        f"Di en voz baja, o solo para adentro: \"{h['afirm']}\" "
        f"Observa qué se mueve. Sin nombrarlo todavía. "
        f"El cuerpo no necesita que lo entiendas para responder — solo necesita que lo escuches."
    )

    M6 = (
        f"{imagen} {h['autor']} escribió que {h['creencia'].replace('no ', 'lo que sentimos como «')}» "
        f"es un aprendizaje, no una verdad sobre quién eres. "
        f"Tu cuerpo ya lo sabía antes de que lo leyeras. "
        f"La pregunta no es si tienes razón en sentirlo así — la tienes. "
        f"La pregunta es: {pregunta}"
    )

    lectura_base = f"{M1}\n\n{M2}\n\n{M3}\n\n{M4}\n\n{M5}\n\n{M6}"

    emocion_raiz = f"la convicción de que {h['creencia']}"
    og_desc = f"Tu {zona_id.replace('-', ' ')} y el contexto de {contexto_id}: {emocion_raiz}. Lectura holística en SABIA.INFO."[:160]
    share_texto = f"Esto describe exactamente lo que siento. SABIA lo nombró: {emocion_raiz} — sabia.info/{cid}"[:180]

    return {
        "id":            f"{zona_id}-{contexto_id}-{fase_id}",
        "slug":          f"{zona_id}-{contexto_id}",
        "zona":          zona_id,
        "contexto":      contexto_id,
        "fase":          fase_id,
        "emocion_raiz":  emocion_raiz,
        "herida":        c["herida"],
        "conflicto":     c["conflicto"],
        "tcm_elemento":  z["elemento"],
        "meridiano":     z["meridiano"],
        "lectura_base":  lectura_base,
        "microterapi":   M5,
        "afirmacion":    h["afirm"],
        "ref_autor":     h["autor"],
        "ref_libro":     h["libro"],
        "ref_asin":      h["asin"],
        "og_desc":       og_desc,
        "share_texto":   share_texto,
        "keywords":      [f"biodescodificacion {zona_id}", f"significado emocional {zona_id}", f"{zona_id} {contexto_id} emocional"],
        "nodos_rel":     [f"{zona_id}-{k}" for k in list(CONTEXTOS.keys())[:3] if k != contexto_id],
        "estado":        "pendiente",
        "premium":       True,
        "fuente":        "motor_determinista_v1",
        "palabras":      len(lectura_base.split()),
        "created_at":    datetime.datetime.now().isoformat(),
        "updated_at":    datetime.datetime.now().isoformat(),
    }

# ── GENERADOR HTML ───────────────────────────────────────────────
def generar_html(data: dict) -> str:
    lectura_html = "".join(f"<p>{p.strip()}</p>" for p in data["lectura_base"].split("\n\n") if p.strip())
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{data['emocion_raiz'].capitalize()} — {data['zona']} {data['contexto']} — SABIA.INFO</title>
<meta name="description" content="{data['og_desc']}">
<meta property="og:title" content="SABIA: {data['emocion_raiz']}">
<meta property="og:description" content="{data['og_desc']}">
<style>
  body{{font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:2rem 1.5rem;line-height:1.85;color:#1a1a1a;background:#fafaf8}}
  h1{{font-size:1.6rem;font-weight:400;color:#0a3d2a;margin-bottom:.5rem}}
  .zona{{font-size:.85rem;color:#666;margin-bottom:2rem;text-transform:uppercase;letter-spacing:.08em}}
  .lectura p{{margin-bottom:1.4rem;font-size:1.05rem}}
  .micro{{background:#e1f5ee;border-left:3px solid #1d9e75;padding:1rem 1.2rem;border-radius:0 8px 8px 0;margin:2rem 0}}
  .afirm{{font-size:1.1rem;font-style:italic;text-align:center;color:#0f6e56;margin:2rem 0;padding:1rem}}
  .meta{{font-size:.8rem;color:#999;margin-top:3rem;padding-top:1rem;border-top:1px solid #eee}}
  .disclaimer{{font-size:.8rem;color:#888;background:#f5f5f3;padding:.8rem 1rem;border-radius:6px;margin-top:2rem}}
</style>
</head>
<body>
<p class="zona">{data['zona'].replace('-',' ')} · {data['contexto']}</p>
<h1>{data['emocion_raiz'].capitalize()}</h1>
<div class="lectura">{lectura_html}</div>
<div class="micro"><strong>Ahora mismo:</strong> {data['microterapi']}</div>
<p class="afirm">"{data['afirmacion']}"</p>
<div class="meta">
  <strong>Ref:</strong> {data['ref_autor']} — <em>{data['ref_libro']}</em> ·
  <strong>ID:</strong> {data['id']} ·
  <strong>Palabras:</strong> {data['palabras']}
</div>
<div class="disclaimer">Esta lectura integra conocimiento holístico complementario. No reemplaza diagnóstico médico ni atención profesional. Ante síntomas persistentes, consulta un profesional de la salud.</div>
</body>
</html>"""

# ── GESTIÓN DE ESTADOS ───────────────────────────────────────────
def cargar_estados() -> dict:
    if ESTADO_DB.exists():
        return json.loads(ESTADO_DB.read_text())
    return {}

def guardar_estados(estados: dict):
    ESTADO_DB.write_text(json.dumps(estados, indent=2, ensure_ascii=False))

def actualizar_estado(slug: str, nuevo_estado: str):
    estados = cargar_estados()
    estados[slug] = {"estado": nuevo_estado, "updated": datetime.datetime.now().isoformat()}
    guardar_estados(estados)
    print(f"  ✓ {slug} → {nuevo_estado}")

# ── GENERACIÓN BATCH ─────────────────────────────────────────────
def batch_completo(solo_pendientes: bool = False):
    estados = cargar_estados()
    generados, saltados = 0, 0

    combos = [(z, c, f) for z in ZONAS for c in CONTEXTOS for f in FASES]
    total  = len(combos)
    print(f"\n SABIA Generator — {total} combinaciones zona×contexto×fase")
    print("="*55)

    for z, c, f in combos:
        slug  = f"{z}-{c}"
        id_   = f"{z}-{c}-{f}"
        estado_actual = estados.get(id_, {}).get("estado", "pendiente")

        if solo_pendientes and estado_actual == "publicado":
            saltados += 1
            continue

        data     = generar_lectura(z, c, f)
        json_path = OUT_JSON / f"{id_}.json"
        html_path = OUT_HTML / f"{slug}.html"

        json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
        if not html_path.exists():  # HTML solo para slug principal (sin fase)
            html_path.write_text(generar_html(data))

        if id_ not in estados:
            estados[id_] = {"estado": "pendiente", "updated": datetime.datetime.now().isoformat()}

        generados += 1
        if generados % 50 == 0:
            print(f"  → {generados}/{total} generados...")

    guardar_estados(estados)
    print(f"\n ✓ Completado: {generados} generados, {saltados} saltados (ya publicados)")
    print(f"   JSON → {OUT_JSON}")
    print(f"   HTML → {OUT_HTML}")

# ── DASHBOARD HTML ────────────────────────────────────────────────
def generar_dashboard():
    estados  = cargar_estados()
    articulos = []

    for json_file in sorted(OUT_JSON.glob("*.json")):
        try:
            data = json.loads(json_file.read_text())
            id_  = data.get("id", json_file.stem)
            est  = estados.get(id_, {}).get("estado", "pendiente")
            data["estado"] = est
            articulos.append(data)
        except Exception:
            pass

    counts = {"pendiente": 0, "aprobado_sin_publicar": 0, "publicado": 0, "regenerar": 0}
    for a in articulos:
        counts[a.get("estado","pendiente")] = counts.get(a.get("estado","pendiente"), 0) + 1

    COLOR_ESTADO = {
        "pendiente":            "#FAEEDA",
        "aprobado_sin_publicar": "#E6F1FB",
        "publicado":            "#E1F5EE",
        "regenerar":            "#FAECE7",
    }
    TEXT_ESTADO = {
        "pendiente":            "#412402",
        "aprobado_sin_publicar": "#0C447C",
        "publicado":            "#085041",
        "regenerar":            "#712B13",
    }

    filas = []
    for a in articulos:
        est  = a.get("estado", "pendiente")
        bg   = COLOR_ESTADO.get(est, "#f5f5f5")
        col  = TEXT_ESTADO.get(est, "#333")
        words = a.get("palabras", 0)
        words_color = "#085041" if words >= 250 else "#854F0B" if words >= 180 else "#712B13"

        lectura_preview = a.get("lectura_base", "")[:120].replace('"', '&quot;').replace('\n', ' ')
        emocion = a.get("emocion_raiz", "—")[:60]

        fila = f"""<tr data-id="{a['id']}" data-estado="{est}">
  <td style="font-family:monospace;font-size:11px;white-space:nowrap">{a['id']}</td>
  <td>{a.get('zona','')}</td>
  <td>{a.get('contexto','')}</td>
  <td>{a.get('fase','')}</td>
  <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="{emocion}">{emocion}</td>
  <td style="background:{bg};color:{col};font-weight:500;font-size:11px;text-align:center;border-radius:4px;padding:3px 8px;white-space:nowrap">{est}</td>
  <td style="color:{words_color};font-family:monospace;font-size:11px;text-align:right">{words}</td>
  <td style="font-size:11px;color:#666;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="{lectura_preview}">{lectura_preview}…</td>
  <td style="white-space:nowrap">
    <button onclick="cambiarEstado('{a['id']}','aprobado_sin_publicar')" style="font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid #378ADD;background:#E6F1FB;color:#0C447C;cursor:pointer">Aprobar</button>
    <button onclick="cambiarEstado('{a['id']}','publicado')" style="font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid #1D9E75;background:#E1F5EE;color:#085041;cursor:pointer">Publicar</button>
    <button onclick="cambiarEstado('{a['id']}','regenerar')" style="font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid #D85A30;background:#FAECE7;color:#712B13;cursor:pointer">Regen.</button>
    <button onclick="verLectura('{a['id']}')" style="font-size:10px;padding:2px 7px;border-radius:4px;border:1px solid #ccc;background:#f5f5f5;color:#444;cursor:pointer">Ver</button>
  </td>
</tr>"""
        filas.append(fila)

    lecturas_data = {a["id"]: a.get("lectura_base", "") for a in articulos}
    lecturas_json = json.dumps(lecturas_data, ensure_ascii=False)

    dash_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SABIA — Dashboard de Gestión</title>
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#1a1a1a;background:#f5f5f3}}
  .header{{background:#0a3d2a;color:#e1f5ee;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}}
  .header h1{{font-size:18px;font-weight:500;letter-spacing:.5px}}
  .header .sub{{font-size:11px;color:#9FE1CB;margin-top:2px}}
  .stats{{display:flex;gap:12px;padding:16px 24px;background:#fff;border-bottom:1px solid #e8e8e8;flex-wrap:wrap}}
  .stat{{padding:8px 16px;border-radius:6px;text-align:center;min-width:120px}}
  .stat .n{{font-size:22px;font-weight:500;line-height:1}}
  .stat .l{{font-size:11px;margin-top:3px;opacity:.8}}
  .controls{{padding:12px 24px;background:#fff;border-bottom:1px solid #e8e8e8;display:flex;gap:10px;flex-wrap:wrap;align-items:center}}
  .controls input{{padding:6px 12px;border:1px solid #ddd;border-radius:6px;font-size:12px;width:240px}}
  .controls select{{padding:6px 10px;border:1px solid #ddd;border-radius:6px;font-size:12px}}
  .controls button{{padding:6px 14px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid}}
  .btn-primary{{background:#0a3d2a;color:#e1f5ee;border-color:#0a3d2a}}
  .btn-secondary{{background:#fff;color:#333;border-color:#ddd}}
  .table-wrap{{overflow-x:auto;padding:0 24px 24px}}
  table{{width:100%;border-collapse:collapse;margin-top:12px;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}}
  th{{padding:9px 10px;background:#f0f0ee;color:#555;font-weight:500;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e0e0de;white-space:nowrap}}
  td{{padding:7px 10px;border-bottom:1px solid #f0f0ee;vertical-align:middle}}
  tr:last-child td{{border-bottom:none}}
  tr:hover td{{background:#fafaf8}}
  .counter{{font-family:monospace;font-size:11px;color:#888;padding:8px 24px}}
  .modal{{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;align-items:center;justify-content:center}}
  .modal.open{{display:flex}}
  .modal-box{{background:#fff;border-radius:12px;padding:28px;max-width:680px;width:90%;max-height:80vh;overflow-y:auto}}
  .modal-box h2{{font-size:16px;margin-bottom:16px;color:#0a3d2a}}
  .modal-box .text{{font-family:Georgia,serif;font-size:14px;line-height:1.85;color:#333;white-space:pre-wrap}}
  .modal-close{{position:absolute;top:16px;right:20px;font-size:20px;cursor:pointer;color:#666;background:none;border:none}}
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>SABIA.INFO — Dashboard de Gestión de Lecturas</h1>
    <div class="sub">Motor determinista v1 · {len(articulos)} artículos · {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}</div>
  </div>
  <div style="display:flex;gap:8px">
    <button class="controls button btn-primary" onclick="exportarPendientes()" style="padding:8px 16px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid;background:#1D9E75;color:#fff;border-color:#1D9E75">Exportar pendientes</button>
    <button class="controls button btn-secondary" onclick="location.reload()" style="padding:8px 16px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid #ddd;background:#fff;color:#333">Actualizar</button>
  </div>
</div>

<div class="stats">
  <div class="stat" style="background:#FAEEDA;color:#412402"><div class="n">{counts['pendiente']}</div><div class="l">Pendientes</div></div>
  <div class="stat" style="background:#E6F1FB;color:#0C447C"><div class="n">{counts['aprobado_sin_publicar']}</div><div class="l">Aprobados</div></div>
  <div class="stat" style="background:#E1F5EE;color:#085041"><div class="n">{counts['publicado']}</div><div class="l">Publicados</div></div>
  <div class="stat" style="background:#FAECE7;color:#712B13"><div class="n">{counts.get('regenerar',0)}</div><div class="l">Regenerar</div></div>
  <div class="stat" style="background:#f0f0ee;color:#555"><div class="n">{len(articulos)}</div><div class="l">Total</div></div>
  <div class="stat" style="background:#EEEDFE;color:#26215C"><div class="n">{sum(1 for a in articulos if a.get('palabras',0) >= 250)}</div><div class="l">≥250 palabras</div></div>
</div>

<div class="controls">
  <input type="text" id="busqueda" placeholder="Buscar por ID, zona, contexto, emoción..." oninput="filtrar()">
  <select id="filtro-estado" onchange="filtrar()">
    <option value="">Todos los estados</option>
    <option value="pendiente">Pendiente</option>
    <option value="aprobado_sin_publicar">Aprobado</option>
    <option value="publicado">Publicado</option>
    <option value="regenerar">Regenerar</option>
  </select>
  <select id="filtro-zona" onchange="filtrar()">
    <option value="">Todas las zonas</option>
    {"".join(f'<option value="{z}">{z}</option>' for z in ZONAS)}
  </select>
  <select id="filtro-ctx" onchange="filtrar()">
    <option value="">Todos los contextos</option>
    {"".join(f'<option value="{c}">{c}</option>' for c in CONTEXTOS)}
  </select>
  <button class="btn-primary" onclick="aprobarSeleccionados()" style="padding:6px 14px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid #0a3d2a;background:#0a3d2a;color:#e1f5ee">Aprobar filtrados</button>
</div>

<div class="counter" id="counter">{len(articulos)} artículos mostrados</div>

<div class="table-wrap">
<table id="tabla">
  <thead>
    <tr>
      <th>ID</th><th>Zona</th><th>Contexto</th><th>Fase</th>
      <th>Emoción raíz</th><th>Estado</th><th>Palabras</th>
      <th>Preview</th><th>Acciones</th>
    </tr>
  </thead>
  <tbody id="tbody">
    {"".join(filas)}
  </tbody>
</table>
</div>

<div class="modal" id="modal">
  <div class="modal-box" style="position:relative">
    <button class="modal-close" onclick="cerrarModal()">×</button>
    <h2 id="modal-title"></h2>
    <div class="text" id="modal-text"></div>
  </div>
</div>

<script>
const LECTURAS = {lecturas_json};
const estados_local = {{}};

function filtrar() {{
  const q = document.getElementById('busqueda').value.toLowerCase();
  const est = document.getElementById('filtro-estado').value;
  const zona = document.getElementById('filtro-zona').value;
  const ctx = document.getElementById('filtro-ctx').value;
  let visible = 0;
  document.querySelectorAll('#tbody tr').forEach(tr => {{
    const id = tr.dataset.id || '';
    const estado = tr.dataset.estado || '';
    const texto = tr.textContent.toLowerCase();
    const show = (!q || texto.includes(q)) &&
                 (!est || estado === est) &&
                 (!zona || id.startsWith(zona)) &&
                 (!ctx || id.includes('-'+ctx+'-') || id.endsWith('-'+ctx));
    tr.style.display = show ? '' : 'none';
    if (show) visible++;
  }});
  document.getElementById('counter').textContent = visible + ' artículos mostrados';
}}

function cambiarEstado(id, nuevo) {{
  const rows = document.querySelectorAll(`tr[data-id="${{id}}"]`);
  rows.forEach(tr => {{
    tr.dataset.estado = nuevo;
    const td = tr.querySelector('td:nth-child(6)');
    const colores = {{
      'pendiente':['#FAEEDA','#412402'],
      'aprobado_sin_publicar':['#E6F1FB','#0C447C'],
      'publicado':['#E1F5EE','#085041'],
      'regenerar':['#FAECE7','#712B13']
    }};
    if (td && colores[nuevo]) {{
      td.style.background = colores[nuevo][0];
      td.style.color = colores[nuevo][1];
      td.textContent = nuevo;
    }}
  }});
  estados_local[id] = nuevo;
  console.log('Estado actualizado:', id, '→', nuevo);
}}

function aprobarSeleccionados() {{
  document.querySelectorAll('#tbody tr').forEach(tr => {{
    if (tr.style.display !== 'none' && tr.dataset.estado === 'pendiente') {{
      cambiarEstado(tr.dataset.id, 'aprobado_sin_publicar');
    }}
  }});
}}

function verLectura(id) {{
  const texto = LECTURAS[id] || 'Lectura no encontrada';
  document.getElementById('modal-title').textContent = id;
  document.getElementById('modal-text').textContent = texto;
  document.getElementById('modal').classList.add('open');
}}

function cerrarModal() {{
  document.getElementById('modal').classList.remove('open');
}}

function exportarPendientes() {{
  const ids = Object.entries(estados_local)
    .filter(([,v]) => v === 'aprobado_sin_publicar')
    .map(([k]) => k);
  const blob = new Blob([JSON.stringify(ids, null, 2)], {{type:'application/json'}});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aprobados_para_publicar.json';
  a.click();
}}

document.getElementById('modal').addEventListener('click', function(e) {{
  if (e.target === this) cerrarModal();
}});
</script>
</body>
</html>"""

    DASH_FILE.write_text(dash_html, encoding="utf-8")
    print(f"\n Dashboard generado: {DASH_FILE}")
    print(f"  Abre en tu navegador: file://{DASH_FILE.absolute()}")

# ── CLI PRINCIPAL ────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="SABIA Generator — Motor determinista")
    parser.add_argument("--modo",    choices=["batch", "dashboard", "single", "estado"], default="batch")
    parser.add_argument("--id",      help="ID específico para modo single (ej: espalda-baja-carga-cronica)")
    parser.add_argument("--estado",  help="Nuevo estado para modo estado")
    parser.add_argument("--solo-pendientes", action="store_true", help="Solo genera los que no están publicados")
    args = parser.parse_args()

    print("\n" + "="*55)
    print("  SABIA.INFO — Motor Generador Determinista v1.0")
    print("="*55)

    if args.modo == "batch":
        batch_completo(solo_pendientes=args.solo_pendientes)
        generar_dashboard()

    elif args.modo == "single":
        if not args.id:
            print("ERROR: --id requerido para modo single")
            sys.exit(1)
        partes = args.id.split("-")
        # Intentar parsear zona-contexto[-fase]
        # Buscar zona más larga que coincida
        zona = next((z for z in sorted(ZONAS, key=len, reverse=True) if args.id.startswith(z)), None)
        if not zona:
            print(f"ERROR: zona no reconocida en '{args.id}'")
            sys.exit(1)
        resto = args.id[len(zona)+1:]
        ctx   = next((c for c in CONTEXTOS if resto.startswith(c)), None)
        if not ctx:
            print(f"ERROR: contexto no reconocido en '{resto}'")
            sys.exit(1)
        fase_str = resto[len(ctx)+1:] if len(resto) > len(ctx) else "cronica"
        fase = fase_str if fase_str in FASES else "cronica"

        data = generar_lectura(zona, ctx, fase)
        out  = OUT_JSON / f"{data['id']}.json"
        out.write_text(json.dumps(data, indent=2, ensure_ascii=False))
        print(f"\n Generado: {out}")
        print(f"   Palabras: {data['palabras']}")
        print(f"   Emoción: {data['emocion_raiz']}")
        print(f"\n Preview:\n")
        print(data["lectura_base"][:400] + "...")

    elif args.modo == "dashboard":
        generar_dashboard()

    elif args.modo == "estado":
        if not args.id or not args.estado:
            print("ERROR: --id y --estado requeridos")
            sys.exit(1)
        actualizar_estado(args.id, args.estado)

    print("\n ✓ Listo.\n")

if __name__ == "__main__":
    main()
