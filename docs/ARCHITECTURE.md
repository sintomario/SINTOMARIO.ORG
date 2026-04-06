# SINTOMARIO.ORG - Guía de Arquitectura Limpia

## 📁 Estructura Optimizada del Proyecto

```
SINTOMARIO.ORG/
├── 🏠 index.html                    # Homepage principal
├── 🔧 api/                          # Backend API
│   ├── counter.php                 # Sistema de contador real
│   └── counter.json                # Base de datos JSON
├── 🧍 cuerpo/                       # Atlas corporal interactivo
│   ├── index.html                  # Atlas principal con 8 sistemas
│   ├── sistema/                    # 9 hubs de sistema corporal
│   │   ├── nervioso/index.html
│   │   ├── oseo/index.html
│   │   ├── circulatorio/index.html
│   │   ├── muscular/index.html
│   │   ├── digestivo/index.html
│   │   ├── psiquico/index.html
│   │   ├── emocional/index.html
│   │   └── perceptual/index.html
│   └── [63-zonas]/                 # Artículos por zona corporal
│       ├── cabeza/index.html
│       ├── estomago-rabia/index.html
│       └── ...
├── ❓ faq/index.html               # FAQ con 7 preguntas clave
├── ℹ️ sobre/index.html             # Página institucional
├── 🎨 layers/                      # Assets visuales del atlas
│   └── PNG/                        # 10 capas optimizadas
│       ├── 01_LUZ.png              # Iluminación
│       ├── 02_PIEL.png             # Sistema perceptual
│       ├── 03_EMOTION.png          # Sistema emocional
│       ├── 04_TRIPAS.png           # Sistema digestivo
│       ├── 05_MENTE.png            # Sistema psíquico
│       ├── 06_MUSCULOS.png         # Sistema muscular
│       ├── 07_CARDIOVASCULAR.png   # Sistema circulatorio
│       ├── 08_OSEO.png             # Sistema óseo
│       ├── 09_NERVIOS.png          # Sistema nervioso
│       └── 10_BASE.png             # Base anatómica
├── 🎯 assets/                      # Recursos consolidados
│   ├── images/                     # Imágenes optimizadas
│   │   ├── LOGO_HORIZONTAL.png     # Logo principal
│   │   └── favicon.ico             # Icono del sitio
│   ├── css/                        # Hojas de estilo
│   │   └── main.css                # CSS unificado
│   └── js/                         # JavaScript
│       ├── search.js               # Buscador funcional
│       └── counter.js              # Contador real
├── 📚 docs/                        # Documentación técnica
│   ├── API.md                      # Documentación de API
│   ├── DEPLOYMENT.md               # Guía de deployment
│   └── ARCHITECTURE.md             # Arquitectura del sistema
└── ⚙️ 404.html, robots.txt, sitemap.xml  # SEO y configuración
```

## 🔧 Componentes Principales

### Atlas Interactivo (`/cuerpo/index.html`)
- **Función**: Navegación por 8 sistemas corporales
- **Tecnología**: HTML5, CSS3, JavaScript vanilla
- **Features**: Scroll interactivo, botones dinámicos, blend modes
- **Assets**: 10 capas PNG con transparencia

### API de Contador (`/api/counter.php`)
- **Función**: Tracking de visitas y usuarios online
- **Persistencia**: JSON file-based database
- **Endpoints**: 
  - `GET ?action=get` - Obtener estadísticas
  - `GET ?action=visit` - Registrar visita
  - `GET ?action=heartbeat` - Mantener online

### Sistema de Navegación
- **Links**: Siempre apuntan a `/index.html` explícito
- **Botones dinámicos**: Generados por sistema con rutas absolutas
- **Sin 404s**: Validación completa de enlaces internos

## 🎨 Design System

### Paleta de Colores
- **Deep**: `#1a010c` - Fondo principal
- **Mid**: `#670433` - Elementos interactivos  
- **Light**: `#8c0548` - Acentos y highlights
- **Gold**: `#F5C400` - Estados activos/hover
- **Text**: `rgba(255,255,255,0.85)` - Texto principal

### Tipografía
- **Headings**: EB Garamond (serif elegante)
- **Body**: Inter (sans-serif moderna)
- **Navigation**: 13px uppercase, letter-spacing 0.12em
- **Botones**: 13px, padding 8x16px, min-height 36px

### Componentes UI
- **Botones**: `.wbtn` con border-left accent
- **Footer**: Fixed 36px height, contador alineado
- **Disclaimer**: Barra superior con emoji ⚠️
- **Atlas**: Full viewport con overlay de color

## 📊 Estructura de Contenido

### Sistema de Zonas
- **9 sistemas corporales** con sus respectivos hubs
- **63 zonas corporales** únicas (cabeza, estómago, corazón, etc.)
- **51 contextos emocionales** (rabia, ansiedad, alegría, etc.)
- **3,213 combinaciones** únicas de síntomas

### Multi-idioma
- **ES**: Español (idioma principal)
- **EN**: Inglés 
- **PT**: Portugués
- **Total**: 9,639 artículos generados

## 🚀 Optimizaciones Implementadas

### Performance
- **Imágenes optimizadas**: PNG con tamaños reducidos
- **CSS inline**: Crítico CSS en HTML para render rápido
- **JavaScript async**: IIFE para contador no bloqueante
- **Cache headers**: Configurado para assets estáticos

### Accesibilidad
- **Alt tags**: Todas las imágenes con descripción
- **Keyboard navigation**: Tab order funcional
- **Contraste**: WCAG 2.1 AA+ compliance
- **Semantic HTML**: Estructura correcta de elementos

### SEO
- **Meta tags**: Descripción y keywords optimizadas
- **Open Graph**: Social media sharing
- **Sitemap**: XML con todas las páginas
- **Robots.txt**: Directivas para crawlers

## 🔄 Flujo de Desarrollo

### 1. Desarrollo Local
```bash
cd SINTOMARIO.ORG
python -m http.server 8000
# Acceder en http://localhost:8000
```

### 2. Testing
- **Navegación**: Verificar todos los links funcionan
- **Contador**: Confirmar API responde correctamente
- **UI/UX**: Probar en diferentes viewports
- **Accesibilidad**: Validar con screen readers

### 3. Deployment
- **GitHub Pages**: Push a main branch
- **Dominio**: sintomario.org configurado
- **SSL**: HTTPS automático
- **CDN**: GitHub Pages CDN global

## 📋 Checklist de Mantenimiento

### ✅ Diario
- [ ] Verificar funcionamiento del contador
- [ ] Monitorear errores 404
- [ ] Revisar performance de carga

### ✅ Semanal  
- [ ] Backup de `counter.json`
- [ ] Revisar analytics de visitas
- [ ] Validar enlaces rotos

### ✅ Mensual
- [ ] Optimizar nuevas imágenes
- [ ] Actualizar documentación
- [ ] Revisar SEO rankings

## 🚨 Troubleshooting

### Contador no funciona
1. Verificar `/api/counter.php` accesible
2. Confirmar permisos de escritura en `counter.json`
3. Revisar CORS headers

### Links 404
1. Validar ruta incluye `/index.html`
2. Verificar case sensitivity
3. Confirmar archivo existe en filesystem

### Imágenes no cargan
1. Validar ruta en `/layers/PNG/`
2. Verificar nomenclatura con guiones bajos
3. Confirmar formato PNG válido

---

**Última actualización**: 6 Abr 2026  
**Versión**: 2.0 - Arquitectura Limpia  
**Estado**: Producción estable
