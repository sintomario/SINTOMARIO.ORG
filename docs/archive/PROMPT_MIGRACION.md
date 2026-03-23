# SINTOMARIO.ORG — Prompt de Continuidad
## Contexto para continuar el proyecto en nuevas sesiones

**Fecha de última actualización:** Marzo 2026  
**Versión del motor:** v4.0 con índices SINTO-XXXX  
**Estado:** Estructura base completa, 400 nodos generados exitosamente

---

## Resumen del Proyecto

SINTOMARIO.ORG es una plataforma holística de información estática que responde búsquedas de síntomas con artículos de profundidad real desde múltiples perspectivas terapéuticas (Louise Hay, Hamer, Gabor Maté).

### Arquitectura Principal

- **Dominio único:** sintomario.org (acumula autoridad SEO)
- **Sitio 100% estático:** HTML generado por Python, servido por GitHub Pages
- **Coste operativo:** ~$9/año (solo dominio en Cloudflare)
- **Corpus actual:** 20 entidades × 20 contextos = 400 nodos indexables
- **Motor:** Python 3.11+ con generación automática de SEO, schema JSON-LD, sitemap

---

## Estructura del Repositorio

```
sintomario.org/
├── corpus/                    # Datos JSON del corpus
│   ├── entidades.json         # 20 entidades corporales
│   ├── contextos.json         # 20 contextos emocionales
│   ├── perspectivas.json      # 4 perspectivas de autores
│   └── productos.json         # Productos afiliados Amazon
├── motor/
│   └── sintomario_motor.py    # Motor v4.0 con índices SINTO-XXXX
├── templates/                 # Templates HTML
│   ├── base.html              # Template base
│   ├── lectura.html           # Template de lectura
│   ├── index.html             # Homepage
│   ├── sobre.html             # Página sobre
│   └── admin.html             # Dashboard admin
├── css/
│   └── main.css               # Sistema de diseño completo
├── public/                    # OUTPUT (no versionado)
│   └── cuerpo/                # Territorio cuerpo
│       └── [entidad]/
│           └── [contexto]/
│               └── index.html
├── sabia/                     # REFERENCIAS del proyecto SABIA
│   ├── DESIGNSYSTEM.md        # Design system completo
│   └── ANTEPROYECTO/          # Archivos de desarrollo
├── sabia.config.json          # Configuración del proyecto
└── README.md                  # Documentación
```

---

## Sistema de Índices SINTO-XXXX

Cada lectura tiene un índice único permanente:

- **Formato:** SINTO-XXXX (4 dígitos, cero-padded)
- **Rango lecturas:** SINTO-0100 a SINTO-0499 (400 nodos)
- **Fórmula:** `100 + zona_index * 20 + contexto_index`

### Ejemplos de índices

```
SINTO-0100 = cabeza + bloqueo
SINTO-0101 = cabeza + frustracion
SINTO-0120 = garganta + bloqueo
SINTO-0320 = rodilla + bloqueo
```

---

## URLs y Taxonomía

### Estructura de URL

```
https://sintomario.org/{territorio}/{entidad}/{contexto}/
```

### Ejemplos

```
https://sintomario.org/cuerpo/cabeza/bloqueo/
https://sintomario.org/cuerpo/estomago/ansiedad/
https://sintomario.org/cuerpo/espalda/frustracion/
```

---

## Comandos del Motor

```bash
# Activar entorno virtual
.venv\Scripts\activate

# Dry run (validación sin generar archivos)
python motor/sintomario_motor.py --dry-run --verbose

# Build completo
python motor/sintomario_motor.py --output ./public --verbose

# Ver reporte del último build
cat reports/build-report.json
```

---

## Stack Técnico

| Componente | Tecnología |
|------------|------------|
| Motor generador | Python 3.11+ |
| Hosting | GitHub Pages |
| DNS | Cloudflare |
| Dominio | sintomario.org |
| CI/CD | GitHub Actions |
| Afiliados | Amazon Associates (sintomario-20) |

---

## Design System

### Colores principales

```css
/* Modo claro */
--color-background-primary: #FAF8F4;
--color-text-primary: #1a1a1a;
--color-accent: #2d7d32;  /* Digestivo, varía por sistema */

/* Modo oscuro */
--color-background-primary: #141210;
--color-text-primary: #f0f0f0;
```

### Tipografía

```css
--font-display: 'Cormorant Garamond', serif;  /* Títulos */
--font-body: 'Source Serif 4', Georgia, serif;  /* Lectura */
--font-ui: 'DM Mono', monospace;  /* Metadata, índices */
```

### Medida óptima de lectura

```css
--sabia-measure: 65ch;  /* Ancho óptimo documentado */
```

---

## SEO Implementado

- ✅ Title tags optimizados (60 chars máx)
- ✅ Meta descriptions (155 chars máx)
- ✅ URLs canónicas absolutas
- ✅ Schema JSON-LD (Article, FAQPage, BreadcrumbList)
- ✅ Sitemap XML automático
- ✅ robots.txt optimizado
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Hreflang para español

---

## Próximas Tareas Pendientes

### Alta Prioridad

1. **Configurar GitHub Actions**
   - Workflow de build automatizado
   - Workflow de deploy a gh-pages
   - Verificación post-deploy

2. **Conectar dominio en Cloudflare**
   - Configurar DNS (4 IPs A de GitHub Pages)
   - Activar DNSSEC
   - Configurar SSL (automático en GitHub Pages)

3. **Google Search Console**
   - Añadir propiedad sintomario.org
   - Enviar sitemap.xml
   - Configurar alertas

### Media Prioridad

4. **Expandir corpus**
   - Añadir más entidades (objetivo: 50)
   - Añadir más contextos (objetivo: 50)
   - Total nodos objetivo: 2,500

5. **Mejorar contenido**
   - Enriquecer perspectivas de autores
   - Añadir más FAQs por nodo
   - Mejorar prácticas de integración

6. **Dashboard admin funcional**
   - Conectar con corpus JSON
   - Edición en tiempo real
   - Preview de cambios

### Baja Prioridad

7. **Optimizaciones avanzadas**
   - Pagefind para búsqueda estática
   - Imágenes OG dinámicas
   - PWA features

8. **Monetización**
   - Integrar links de afiliados Amazon
   - Tracking UTM
   - Dashboard de conversión

---

## Referencias de Desarrollo

El directorio `/sabia` contiene referencias del proyecto SABIA.INFO que inspiró este sistema:

- `DESIGNSYSTEM.md` — Design system completo con tokens
- `ANTEPROYECTO/sabia_v2.py` — Motor original de referencia
- `ANTEPROYECTO/sabia_sistema_maestro_v3.html` — Sistema maestro visual

---

## Notas Importantes

1. **El directorio `public/` nunca se versiona** — es output regenerable
2. **Cada nodo debe tener word count > 50** para ser indexable
3. **Los índices SINTO-XXXX son permanentes** — no cambiar la fórmula
4. **Las URLs son canónicas absolutas** — siempre con https://sintomario.org
5. **El sistema es autónomo** — una vez deployado, opera sin mantenimiento

---

## Contacto y Continuidad

Para continuar este proyecto en una nueva sesión:

1. Activar entorno virtual: `.venv\Scripts\activate`
2. Verificar motor: `python motor/sintomario_motor.py --dry-run --verbose`
3. Revisar este archivo para contexto completo
4. Ejecutar tareas pendientes según prioridad

**Estado actual:** Sistema base completado, listo para producción con GitHub Actions y DNS.

---

*SINTOMARIO.ORG — El diccionario del síntoma*  
*Construido para perdurar.*
