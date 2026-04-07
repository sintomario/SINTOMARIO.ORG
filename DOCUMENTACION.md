# SINTOMARIO.ORG — Documentación Esencial

## Estado del Proyecto — Abril 2026 (Refactorización Universal)

**Frontend COMPLETO e IMPERMEABLE. 100% Native Vanilla.**
- 0 Dependencias de framework CSS (Purga absoluta de Tailwind CDN en los 24,562 archivos).
- 0 Latencia tipográfica (Reemplazo universal por System Fonts y Native Emojis/Glyphs 🔍).
- Header Layout universal inyectado.

### Páginas Activas

| Página | URL | Descripción |
|--------|-----|-------------|
| Homepage | `/` | CLICKER design, 10 capas PNG, scroll/touch/keyboard nav |
| FAQ | `/faq/` | 7 preguntas, tono Saramago/PCP, Índice Sinto explicado |
| Sobre | `/sobre/` | Misión del proyecto, cómo usar, cómo apoyar |
| Atlas | `/cuerpo/` | Navegación por 63 zonas corporales |
| 8 Hubs | `/cuerpo/sistema/*` | Nervioso, Óseo, Circulatorio, Muscular, Psíquico, Digestivo, Emocional, Perceptual |

### Estructura de Carpetas

```
SINTOMARIO.ORG/
├── index.html              # Homepage CLICKER
├── favicon.ico.jpg         # Favicon
├── LOGO HORIZONTAL-02.png  # Logo
├── README.md               # Documentación principal
├── 404.html, robots.txt, CNAME, .nojekyll, sitemap.xml
├── sobre/index.html        # Página Sobre
├── faq/index.html          # FAQ
├── cuerpo/
│   ├── index.html          # Atlas
│   ├── sistema/            # 8 hubs (nervioso, oseo, circulatorio, muscular, psiquico, digestivo, emocional, perceptual)
│   └── {63 zonas}/         # Artículos generados
├── layers/PNG/             # 10 capas del CLICKER
└── .sintomario-local/      # Workspace local (gitignored)
```

### Design System CLICKER

**Paleta:**
- Deep: `#1a010c`
- Mid: `#670433`
- Light: `#8c0548`
- Text-dim: `rgba(255,255,255,0.65)`

**Tipografía NATIVA (Offline, Cero Dependencias):**
- Títulos: System Serif (`Georgia`, `Times New Roman`)
- Cuerpo: System UI (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`)

**Elementos:**
- Border-radius: 0.05px
- Background boxes: rgba(0,0,0,0.35)
- Borders: rgba(255,255,255,0.15)

### Principios de Contenido

1. **Tono Saramago**: Oraciones largas, flujo continuo, densidad poética
2. **Modelo PCP**: Permiso → Contexto → Propuesta implícito
3. **No anglicismos**: Español puro
4. **No estado futuro**: Lenguaje presente
5. **SINTOMARIO mayúsculas**: Siempre

### Contacto

- **Email**: sintomario@proton.me
- **PayPal**: paypal.me/sintomario
- **Wise**: wise.com/pay/sintomario

### Deploy

1. Desarrollo en `SINTOMARIO.ORG/`
2. Copiar a `.sintomario-local/git.sintomario/`
3. Git commit/push manual
4. GitHub Pages sirve automáticamente

---

## Archivos de Documentación Histórica (Conservar)

Los siguientes archivos contienen estrategia, investigación y contexto histórico del proyecto. No son necesarios para el funcionamiento pero contienen valor referencial:

- `docs/ARQUITECTURA_PERSUASIVA_PCP.md` — Modelo PCP
- `docs/ATLAS-SOMATICO-EDITORIAL.md` — Estrategia editorial
- `docs/GRAMATICA_LIDERAZGO_NODOS.md` — Gramática de contenido
- `docs/MATRIZ_EVALUACION_PCP_100K.md` — Matriz de evaluación

## Archivos Candidatos a Purga (Obsoletos)

- `MEMORY.md` — Reemplazado por memoria del sistema
- `docs/BRIEF_OPERATIVO_ARQUITECTURA_DESACOPLADA.md` — Estrategia antigua
- `docs/HOJA_RUTA_EQUIPO_A_100K.md` — Planificación obsoleta
- `docs/EVALUACION_DIAGNOSTICA_SISTEMA_DISENO.md` — Diagnóstico superado
- `design-system/` — Design system anterior (reemplazado por CLICKER)
- `frontend-layer/` — Frontend layer obsoleto

---

*Checkpoint: Marzo 2026*
*Estado: Frontend completo, documentado, listo para purga de archivos obsoletos*
