'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

type Zona = {
  id: string
  label: string
  labelCorto: string
  tcm: string
  sinonimos: string[]          // 3 sinónimos del contexto
  condiciones: { nombre: string; clinico: string }[]   // nivel 2
  frente: boolean              // aparece en vista frontal
  dorso: boolean               // aparece en vista dorsal
}

type Menu = {
  x: number
  y: number
  zona: Zona
  nivel: 1 | 2 | 3
  ctx?: string
  condicion?: string
} | null

// ─── DATOS MAESTROS ──────────────────────────────────────────────────────────

const CTX_SINONIMOS: Record<string, string[]> = {
  carga:    ['Peso · responsabilidad · agotamiento'],
  soledad:  ['Aislamiento · vacío · desconexión'],
  conflicto:['Tensión · choque · no-dicho'],
  cambio:   ['Transición · resistencia · umbral'],
  bloqueo:  ['Estancamiento · parálisis · cierre'],
  culpa:    ['Remordimiento · autoexigencia · deuda'],
}

const ZONAS: Zona[] = [
  {
    id: 'cabeza', label: 'Cabeza', labelCorto: 'Cabeza',
    tcm: 'Du Mai · Yang',
    sinonimos: ['Mente · pensamiento · control'],
    condiciones: [
      { nombre: 'Tensión craneal', clinico: 'cefalea tensional' },
      { nombre: 'Mareo y vértigo', clinico: 'vértigo posicional' },
      { nombre: 'Agotamiento mental', clinico: 'neurastenia' },
    ],
    frente: true, dorso: true,
  },
  {
    id: 'garganta', label: 'Garganta', labelCorto: 'Garganta',
    tcm: 'Ren Mai · Metal',
    sinonimos: ['Voz · expresión · límites'],
    condiciones: [
      { nombre: 'Nudo en la garganta', clinico: 'disfagia funcional' },
      { nombre: 'Sequedad persistente', clinico: 'xerostomía' },
      { nombre: 'Ronquera sin causa', clinico: 'disfonía psicógena' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'pecho', label: 'Pecho', labelCorto: 'Pecho',
    tcm: 'Corazón · Fuego',
    sinonimos: ['Corazón · amor · duelo'],
    condiciones: [
      { nombre: 'Opresión en el pecho', clinico: 'dolor precordial funcional' },
      { nombre: 'Ritmo acelerado', clinico: 'taquicardia situacional' },
      { nombre: 'Latido lento', clinico: 'bradicardia emocional' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'hombro', label: 'Hombros', labelCorto: 'Hombro',
    tcm: 'Intestino grueso · Metal',
    sinonimos: ['Carga · responsabilidad · peso ajeno'],
    condiciones: [
      { nombre: 'Contractura de trapecios', clinico: 'mialgia tensional' },
      { nombre: 'Dolor irradiado al brazo', clinico: 'cervicobraquialgia' },
      { nombre: 'Rigidez articular', clinico: 'capsulitis adhesiva' },
    ],
    frente: true, dorso: true,
  },
  {
    id: 'espalda-alta', label: 'Espalda alta', labelCorto: 'Espalda·alta',
    tcm: 'Pulmón · Metal',
    sinonimos: ['Apoyo · protección · lo no dicho'],
    condiciones: [
      { nombre: 'Tensión dorsal', clinico: 'dorsalgia miofascial' },
      { nombre: 'Dificultad al respirar', clinico: 'disnea funcional' },
      { nombre: 'Bloqueo entre escápulas', clinico: 'síndrome interescapular' },
    ],
    frente: false, dorso: true,
  },
  {
    id: 'espalda-baja', label: 'Espalda baja', labelCorto: 'Espalda·baja',
    tcm: 'Riñón · Agua',
    sinonimos: ['Sostén · supervivencia · raíces'],
    condiciones: [
      { nombre: 'Dolor lumbar', clinico: 'lumbago miofascial' },
      { nombre: 'Hernia discal', clinico: 'protrusión discal L4-L5' },
      { nombre: 'Ciática', clinico: 'radiculopatía lumbar' },
    ],
    frente: false, dorso: true,
  },
  {
    id: 'estomago', label: 'Estómago', labelCorto: 'Estómago',
    tcm: 'Estómago · Tierra',
    sinonimos: ['Digestión · asimilación · miedo'],
    condiciones: [
      { nombre: 'Digestión difícil', clinico: 'dispepsia funcional' },
      { nombre: 'Acidez persistente', clinico: 'reflujo gastroesofágico' },
      { nombre: 'Náuseas sin causa', clinico: 'gastroparesia funcional' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'higado', label: 'Hígado', labelCorto: 'Hígado',
    tcm: 'Hígado · Madera',
    sinonimos: ['Rabia · planificación · decisión'],
    condiciones: [
      { nombre: 'Tensión en costado derecho', clinico: 'hepatalgia funcional' },
      { nombre: 'Bilis retenida', clinico: 'colestasis funcional' },
      { nombre: 'Irritabilidad crónica', clinico: 'síndrome de qi hepático estancado' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'intestino', label: 'Intestino', labelCorto: 'Intestino',
    tcm: 'Intestino grueso · Metal',
    sinonimos: ['Soltar · purgar · dejar ir'],
    condiciones: [
      { nombre: 'Colon irritable', clinico: 'síndrome de intestino irritable' },
      { nombre: 'Estreñimiento emocional', clinico: 'discinesia intestinal' },
      { nombre: 'Hinchazón crónica', clinico: 'distensión abdominal funcional' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'cadera', label: 'Cadera', labelCorto: 'Cadera',
    tcm: 'Riñón · Vejiga · Agua',
    sinonimos: ['Movimiento · avance · sexualidad'],
    condiciones: [
      { nombre: 'Dolor en la cadera', clinico: 'coxartrosis inicial' },
      { nombre: 'Trocánter doloroso', clinico: 'trocanteritis' },
      { nombre: 'Rigidez al girar', clinico: 'sacroileítis funcional' },
    ],
    frente: true, dorso: true,
  },
  {
    id: 'rodilla', label: 'Rodillas', labelCorto: 'Rodilla',
    tcm: 'Hígado · Vesícula · Madera',
    sinonimos: ['Flexibilidad · decisión · rendición'],
    condiciones: [
      { nombre: 'Dolor al doblar', clinico: 'condromalacia rotuliana' },
      { nombre: 'Rigidez matutina', clinico: 'gonalgia funcional' },
      { nombre: 'Bloqueo articular', clinico: 'pinzamiento femorotibial' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'pies', label: 'Pies', labelCorto: 'Pies',
    tcm: 'Riñón · Agua · raíces',
    sinonimos: ['Arraigo · dirección · apoyo'],
    condiciones: [
      { nombre: 'Dolor en la planta', clinico: 'fascitis plantar' },
      { nombre: 'Entumecimiento', clinico: 'neuropatía distal' },
      { nombre: 'Frío persistente', clinico: 'acrocianosis funcional' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'piel', label: 'Piel', labelCorto: 'Piel',
    tcm: 'Pulmón · Metal · límites',
    sinonimos: ['Límites · contacto · identidad'],
    condiciones: [
      { nombre: 'Eccema emocional', clinico: 'dermatitis atópica' },
      { nombre: 'Manchas por estrés', clinico: 'vitiligo' },
      { nombre: 'Urticaria sin alérgeno', clinico: 'urticaria crónica espontánea' },
    ],
    frente: true, dorso: true,
  },
  {
    id: 'tiroides', label: 'Tiroides', labelCorto: 'Tiroides',
    tcm: 'Ren Mai · Metal',
    sinonimos: ['Ritmo · voz propia · metabolismo'],
    condiciones: [
      { nombre: 'Tiroides lenta', clinico: 'hipotiroidismo subclínico' },
      { nombre: 'Nódulo tiroideo', clinico: 'bocio nodular' },
      { nombre: 'Hashimoto', clinico: 'tiroiditis autoinmune' },
    ],
    frente: true, dorso: false,
  },
  {
    id: 'vientre', label: 'Vientre', labelCorto: 'Vientre',
    tcm: 'Útero · Chong Mai · origen',
    sinonimos: ['Creación · ciclo · origen'],
    condiciones: [
      { nombre: 'Dolor menstrual', clinico: 'dismenorrea primaria' },
      { nombre: 'Ciclo irregular', clinico: 'metrorragia funcional' },
      { nombre: 'Tensión pélvica', clinico: 'síndrome de congestión pélvica' },
    ],
    frente: true, dorso: false,
  },
]

const CTXS = [
  { id: 'carga',     label: 'Carga',     desc: 'Peso · responsabilidad · agotamiento' },
  { id: 'soledad',   label: 'Soledad',   desc: 'Aislamiento · vacío · desconexión' },
  { id: 'conflicto', label: 'Conflicto', desc: 'Tensión · choque · no-dicho' },
  { id: 'cambio',    label: 'Cambio',    desc: 'Transición · resistencia · umbral' },
  { id: 'bloqueo',   label: 'Bloqueo',   desc: 'Estancamiento · parálisis · cierre' },
  { id: 'culpa',     label: 'Culpa',     desc: 'Remordimiento · autoexigencia · deuda' },
]

// ─── PATHS SVG ────────────────────────────────────────────────────────────────
// viewBox="0 0 120 280" — silueta femenina serena, trazos orgánicos

const BODY_OUTLINE_FRONT = `
  M60,8 C52,8 46,14 46,22 C46,30 52,36 60,36 C68,36 74,30 74,22 C74,14 68,8 60,8 Z
  M52,36 C44,38 38,44 36,52 L34,72 C33,78 35,82 40,83 L42,100
  C42,108 44,116 44,124 L40,148 C38,152 37,158 38,162 L42,180
  C43,186 44,192 44,196 L42,224 C42,230 44,234 48,235 L52,236
  C54,236 56,234 56,230 L56,216 L56,196 L58,185
  M68,36 C76,38 82,44 84,52 L86,72 C87,78 85,82 80,83 L78,100
  C78,108 76,116 76,124 L80,148 C82,152 83,158 82,162 L78,180
  C77,186 76,192 76,196 L78,224 C78,230 76,234 72,235 L68,236
  C66,236 64,234 64,230 L64,216 L64,196 L62,185
  M58,185 L60,196 L62,185
  M56,216 C54,218 52,222 52,228 L52,252 C52,258 54,264 58,268 L60,270
  M64,216 C66,218 68,222 68,228 L68,252 C68,258 66,264 62,268 L60,270
`

// ─── ZONA SHAPES (coordenadas sobre viewBox 0 0 120 280) ──────────────────────

const ZONA_SHAPES: Record<string, { path: string; cx: number; cy: number }> = {
  cabeza:       { path: 'M46,8 C46,8 46,36 60,36 C74,36 74,8 74,8 Z', cx: 60, cy: 22 },
  garganta:     { path: 'M50,36 L70,36 L72,48 L48,48 Z', cx: 60, cy: 42 },
  tiroides:     { path: 'M52,44 L68,44 L70,54 L50,54 Z', cx: 60, cy: 49 },
  pecho:        { path: 'M38,54 L82,54 L84,88 L36,88 Z', cx: 60, cy: 70 },
  hombro:       { path: 'M34,52 L50,52 L50,72 L32,72 Z M70,52 L86,52 L88,72 L70,72 Z', cx: 60, cy: 62 },
  'espalda-alta': { path: 'M36,54 L84,54 L82,84 L38,84 Z', cx: 60, cy: 69 },
  estomago:     { path: 'M40,88 L80,88 L78,116 L42,116 Z', cx: 60, cy: 102 },
  higado:       { path: 'M60,88 L80,88 L78,116 L60,116 Z', cx: 70, cy: 102 },
  intestino:    { path: 'M42,116 L78,116 L76,144 L44,144 Z', cx: 60, cy: 130 },
  vientre:      { path: 'M44,130 L76,130 L74,156 L46,156 Z', cx: 60, cy: 143 },
  cadera:       { path: 'M38,144 L82,144 L84,168 L36,168 Z', cx: 60, cy: 156 },
  rodilla:      { path: 'M42,200 L56,200 L56,220 L42,220 Z M64,200 L78,200 L78,220 L64,220 Z', cx: 60, cy: 210 },
  pies:         { path: 'M44,252 L58,252 L58,270 L44,270 Z M62,252 L76,252 L76,270 L62,270 Z', cx: 60, cy: 261 },
  piel:         { path: 'M46,8 L74,8 L86,72 L80,156 L68,268 L52,268 L40,156 L34,72 Z', cx: 60, cy: 138 },
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function BodySVG() {
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [hoveredZona, setHoveredZona] = useState<string | null>(null)
  const [menu, setMenu] = useState<Menu>(null)
  const [vista, setVista] = useState<'frente' | 'dorso'>('frente')

  // Cerrar menú al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [])

  const handleZonaClick = useCallback((e: React.MouseEvent | React.TouchEvent, zona: Zona) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    // Posicionar menú relativo al contenedor
    let x = clientX - rect.left + 12
    let y = clientY - rect.top - 8
    // Evitar que salga por la derecha
    if (x + 220 > rect.width) x = rect.width - 230
    if (x < 4) x = 4
    setMenu({ x, y, zona, nivel: 1 })
  }, [])

  const navigateTo = useCallback((zona: string, ctx: string) => {
    setMenu(null)
    router.push(`/${zona}-${ctx}`)
  }, [router])

  const zonasFiltradas = ZONAS.filter(z => vista === 'frente' ? z.frente : z.dorso)

  return (
    <div className="body-svg-root" style={{ position: 'relative', userSelect: 'none' }}>

      {/* Toggle frente/dorso */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16,
      }}>
        {(['frente', 'dorso'] as const).map(v => (
          <button
            key={v}
            onClick={() => { setVista(v); setMenu(null) }}
            style={{
              padding: '5px 18px',
              borderRadius: 20,
              border: vista === v ? '1px solid #1D9E75' : '1px solid #B8E0CE',
              background: vista === v ? '#1D9E75' : 'transparent',
              color: vista === v ? '#fff' : '#1A7A58',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all .15s',
              letterSpacing: '.04em',
            }}
          >
            {v === 'frente' ? 'Frente' : 'Dorso'}
          </button>
        ))}
      </div>

      {/* SVG corporal */}
      <svg
        ref={svgRef}
        viewBox="0 0 120 280"
        style={{
          width: '100%',
          maxWidth: 240,
          display: 'block',
          margin: '0 auto',
          overflow: 'visible',
        }}
        aria-label="Silueta corporal interactiva — selecciona una zona"
        role="img"
      >
        {/* Silueta base */}
        <g opacity={0.12} fill="none" stroke="#1A7A58" strokeWidth={1.2}>
          {/* Cabeza */}
          <ellipse cx={60} cy={22} rx={14} ry={14} />
          {/* Cuello */}
          <rect x={54} y={36} width={12} height={14} rx={3} />
          {/* Torso */}
          <path d="M36,50 C36,50 28,56 28,72 L28,156 C28,160 32,164 36,164 L84,164 C88,164 92,160 92,156 L92,72 C92,56 84,50 84,50 Z" />
          {/* Brazos */}
          <path d="M36,54 C30,56 24,62 22,70 L18,110 C17,116 19,120 24,121 L26,148 C26,152 28,155 31,155" />
          <path d="M84,54 C90,56 96,62 98,70 L102,110 C103,116 101,120 96,121 L94,148 C94,152 92,155 89,155" />
          {/* Piernas */}
          <path d="M44,164 L42,220 C42,226 44,232 48,236 L50,270 C50,274 53,276 56,276 L60,276" />
          <path d="M76,164 L78,220 C78,226 76,232 72,236 L70,270 C70,274 67,276 64,276 L60,276" />
        </g>

        {/* Zonas táctiles */}
        {zonasFiltradas.map(zona => {
          const shape = ZONA_SHAPES[zona.id]
          if (!shape) return null
          const isHovered = hoveredZona === zona.id
          return (
            <g
              key={zona.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredZona(zona.id)}
              onMouseLeave={() => setHoveredZona(null)}
              onClick={e => handleZonaClick(e, zona)}
              onTouchEnd={e => handleZonaClick(e, zona)}
              aria-label={`Zona ${zona.label}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleZonaClick(e as unknown as React.MouseEvent, zona)}
            >
              {/* Área táctil ampliada (44×44px mínimo WCAG) */}
              <rect
                x={shape.cx - 22}
                y={shape.cy - 22}
                width={44}
                height={44}
                fill="transparent"
              />
              {/* Fill de zona */}
              <path
                d={shape.path}
                fill={isHovered ? '#1D9E75' : '#2EAA7A'}
                fillOpacity={isHovered ? 0.35 : 0.15}
                stroke={isHovered ? '#1D9E75' : '#2EAA7A'}
                strokeWidth={isHovered ? 1.2 : 0.6}
                strokeOpacity={isHovered ? 0.9 : 0.4}
                style={{ transition: 'fill-opacity .18s, stroke-opacity .18s' }}
              />
              {/* Label */}
              {isHovered && (
                <text
                  x={shape.cx}
                  y={shape.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={6}
                  fontWeight={600}
                  fill="#0C4A34"
                  letterSpacing={0.3}
                >
                  {zona.labelCorto}
                </text>
              )}
            </g>
          )
        })}

        {/* Punto de indicación dinámico */}
        {hoveredZona && ZONA_SHAPES[hoveredZona] && (
          <circle
            cx={ZONA_SHAPES[hoveredZona].cx}
            cy={ZONA_SHAPES[hoveredZona].cy}
            r={3}
            fill="#1D9E75"
            opacity={0.7}
          />
        )}
      </svg>

      {/* Menú contextual 3 niveles */}
      {menu && (
        <ContextMenu
          ref={menuRef}
          menu={menu}
          onNivel2={(ctx) => setMenu({ ...menu, nivel: 2, ctx })}
          onNivel3={(condicion) => setMenu({ ...menu, nivel: 3, condicion })}
          onNavigate={navigateTo}
          onClose={() => setMenu(null)}
        />
      )}

      {/* Instrucción sutil */}
      {!menu && (
        <p style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#7A786E',
          marginTop: 16,
          letterSpacing: '.04em',
        }}>
          Toca la zona que sientes
        </p>
      )}
    </div>
  )
}

// ─── MENÚ CONTEXTUAL ─────────────────────────────────────────────────────────

import React from 'react'

const ContextMenu = React.forwardRef<HTMLDivElement, {
  menu: NonNullable<Menu>
  onNivel2: (ctx: string) => void
  onNivel3: (condicion: string) => void
  onNavigate: (zona: string, ctx: string) => void
  onClose: () => void
}>(({ menu, onNivel2, onNivel3, onNavigate, onClose }, ref) => {
  const { x, y, zona, nivel, ctx, condicion } = menu

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    zIndex: 100,
    background: '#FFFFFF',
    border: '1px solid #B8E0CE',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(10,61,42,0.13)',
    minWidth: 210,
    maxWidth: 240,
    overflow: 'hidden',
    fontFamily: 'inherit',
  }

  const headerStyle: React.CSSProperties = {
    background: '#EAF5EE',
    padding: '10px 14px 8px',
    borderBottom: '1px solid #B8E0CE',
  }

  const itemStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '9px 14px',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    borderBottom: '0.5px solid #EAF5EE',
    cursor: 'pointer',
    transition: 'background .12s',
    fontFamily: 'inherit',
  }

  return (
    <div ref={ref} style={menuStyle} role="menu">
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0C4A34', letterSpacing: '.02em' }}>
          {zona.label}
        </div>
        <div style={{ fontSize: 10, color: '#1A7A58', marginTop: 2, letterSpacing: '.06em' }}>
          {zona.tcm}
        </div>
      </div>

      {/* NIVEL 1 — Selecciona contexto */}
      {nivel === 1 && (
        <div>
          <div style={{ padding: '7px 14px 4px', fontSize: 10, color: '#7A786E', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            ¿Qué sientes?
          </div>
          {CTXS.map(c => (
            <button
              key={c.id}
              style={itemStyle}
              onMouseEnter={e => (e.currentTarget.style.background = '#EAF5EE')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              onClick={() => onNivel2(c.id)}
            >
              <span style={{ fontSize: 13, color: '#1A1816', fontWeight: 500 }}>{c.label}</span>
              <span style={{ display: 'block', fontSize: 11, color: '#7A786E', marginTop: 1 }}>{c.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* NIVEL 2 — Condición específica o ir directo */}
      {nivel === 2 && ctx && (
        <div>
          <div style={{ padding: '7px 14px 4px', fontSize: 10, color: '#7A786E', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            ¿Más específico?
          </div>
          {/* Opción directa */}
          <button
            style={{ ...itemStyle, background: '#EAF5EE' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#D4EFE2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#EAF5EE')}
            onClick={() => onNavigate(zona.id, ctx)}
          >
            <span style={{ fontSize: 13, color: '#0C4A34', fontWeight: 600 }}>
              Ir a la lectura →
            </span>
            <span style={{ display: 'block', fontSize: 11, color: '#1A7A58', marginTop: 1 }}>
              {zona.label} · {CTXS.find(c => c.id === ctx)?.label}
            </span>
          </button>
          {/* Condiciones relacionadas */}
          <div style={{ padding: '7px 14px 4px', fontSize: 10, color: '#7A786E', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Síntomas relacionados
          </div>
          {zona.condiciones.map(cond => (
            <button
              key={cond.clinico}
              style={itemStyle}
              onMouseEnter={e => (e.currentTarget.style.background = '#EAF5EE')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              onClick={() => onNavigate(zona.id, ctx)}
            >
              <span style={{ fontSize: 12, color: '#1A1816' }}>{cond.nombre}</span>
              <span style={{ fontSize: 10, color: '#B0AEA4', marginLeft: 6, fontStyle: 'italic' }}>
                ({cond.clinico})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Botón cerrar */}
      <button
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 14px',
          textAlign: 'center',
          background: 'transparent',
          border: 'none',
          borderTop: '0.5px solid #EAF5EE',
          cursor: 'pointer',
          fontSize: 11,
          color: '#B0AEA4',
          letterSpacing: '.04em',
        }}
        onClick={onClose}
      >
        cerrar
      </button>
    </div>
  )
})

ContextMenu.displayName = 'ContextMenu'
