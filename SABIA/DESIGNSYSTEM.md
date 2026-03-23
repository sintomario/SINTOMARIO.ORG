# SABIA.INFO — Design System
### Formato DESIGN.md · Compatible con Google Stitch & Coding Agents
### v1.0 · Equinoccio de Aries · Marzo 2026

---

## Meta

```yaml
name: sabia-design-system
version: 1.0.0
platform: web
framework: next-js-14
renderer: app-router
language: typescript
target: mobile-first
theme: dark-botanical
```

---

## 1. Brand Identity

### Voz
- **Arquetipo:** SabiaSavia — Anciana sabia, Sophia interior
- **Tono:** Erudito-íntimo, cálido pero preciso. Nunca clínico, nunca místico explícito
- **Registro:** Tuteo respetuoso, frases cortas, ritmo poético-narrativo

### Tagline
> "Tu cuerpo te dice."

### Logo
- Tipográfico: `SABIA` en weight 700 + `.INFO` en weight 300
- Sin ícono. La marca ES el mapa corporal interactivo

---

## 2. Color Palette

### Modo Oscuro (Principal)

```css
:root {
  /* ─── Fondos ─── */
  --bg-deep:        hsl(220, 20%, 6%);     /* #0e1013 — fondo principal */
  --bg-surface:     hsl(220, 16%, 10%);    /* #161a1f — tarjetas, paneles */
  --bg-elevated:    hsl(220, 14%, 14%);    /* #1f2329 — modales, dropdowns */
  --bg-hover:       hsl(220, 12%, 18%);    /* #282d34 — hover states */

  /* ─── Texto ─── */
  --text-primary:   hsl(40, 20%, 92%);     /* #ede8e0 — texto principal, cálido */
  --text-secondary: hsl(40, 10%, 62%);     /* #a39d93 — texto secundario */
  --text-muted:     hsl(220, 8%, 42%);     /* #656a72 — hints, placeholders */

  /* ─── Acentos Emocionales ─── */
  --accent-savia:   hsl(145, 45%, 42%);    /* #3da664 — verde savia, CTA principal */
  --accent-gold:    hsl(42, 78%, 58%);     /* #d4a83c — sabiduría, premium */
  --accent-amber:   hsl(28, 72%, 55%);     /* #cc7a3a — calidez, energía */
  --accent-rose:    hsl(350, 55%, 55%);    /* #c45b6a — emoción, urgencia */
  --accent-indigo:  hsl(235, 45%, 55%);    /* #5b62c4 — introspección, calma */
  --accent-teal:    hsl(175, 50%, 42%);    /* #369e94 — sanación, flujo */

  /* ─── Emociones del ContextSelector ─── */
  --emotion-carga:     var(--accent-amber);
  --emotion-soledad:   var(--accent-indigo);
  --emotion-conflicto: var(--accent-rose);
  --emotion-cambio:    var(--accent-teal);
  --emotion-bloqueo:   hsl(260, 35%, 50%);  /* #7a5eab — estancamiento */
  --emotion-culpa:     hsl(15, 50%, 48%);   /* #b55c3d — peso interno */

  /* ─── Bordes y líneas ─── */
  --border-subtle:  hsl(220, 10%, 18%);    /* #2a2d32 */
  --border-default: hsl(220, 10%, 24%);    /* #373b42 */
  --border-focus:   var(--accent-savia);

  /* ─── Glass / Overlay ─── */
  --glass-bg:       hsla(220, 16%, 10%, 0.72);
  --glass-border:   hsla(40, 20%, 92%, 0.08);
  --overlay:        hsla(220, 20%, 4%, 0.6);
}
```

### Gradientes

```css
:root {
  --grad-savia:     linear-gradient(135deg, hsl(145, 45%, 42%), hsl(175, 50%, 42%));
  --grad-gold:      linear-gradient(135deg, hsl(42, 78%, 58%), hsl(28, 72%, 55%));
  --grad-reading:   linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-surface) 100%);
  --grad-hero:      radial-gradient(ellipse at 50% 0%, hsla(145, 45%, 42%, 0.12) 0%, transparent 60%);
  --grad-body-glow: radial-gradient(circle, hsla(145, 45%, 42%, 0.15) 0%, transparent 70%);
}
```

---

## 3. Typography

### Font Stack

```css
:root {
  --font-display:  'Outfit', system-ui, sans-serif;      /* Títulos, tagline */
  --font-body:     'Source Serif 4', Georgia, serif;      /* Lecturas, narrativa */
  --font-ui:       'Inter', system-ui, sans-serif;        /* UI, botones, chips */
  --font-mono:     'JetBrains Mono', monospace;           /* Códigos SABIA-XXXX */
}
```

### Escala Tipográfica (Mobile-first)

| Token            | Mobile        | Desktop (≥768px) | Weight | Line-height | Font         |
|------------------|---------------|-------------------|--------|-------------|--------------|
| `--text-hero`    | 2.5rem (40px) | 3.5rem (56px)     | 700    | 1.1         | display      |
| `--text-h1`      | 2rem (32px)   | 2.5rem (40px)     | 700    | 1.2         | display      |
| `--text-h2`      | 1.5rem (24px) | 1.75rem (28px)    | 600    | 1.3         | display      |
| `--text-h3`      | 1.25rem (20px)| 1.375rem (22px)   | 600    | 1.35        | display      |
| `--text-body`    | 1.0625rem (17px)| 1.125rem (18px) | 400    | 1.7         | body         |
| `--text-body-sm` | 0.9375rem (15px)| 1rem (16px)     | 400    | 1.6         | body         |
| `--text-caption` | 0.8125rem (13px)| 0.875rem (14px) | 400    | 1.5         | ui           |
| `--text-label`   | 0.75rem (12px)| 0.8125rem (13px)  | 500    | 1.4         | ui           |
| `--text-code`    | 0.8125rem (13px)| 0.875rem (14px) | 400    | 1.5         | mono         |

### Drop Cap (Lecturas)

```css
.reading-content > p:first-of-type::first-letter {
  font-family: var(--font-display);
  font-size: 3.5em;
  float: left;
  line-height: 0.8;
  margin: 0.05em 0.12em 0 0;
  color: var(--accent-savia);
  font-weight: 700;
}
```

---

## 4. Spacing & Layout

### Escala de Espaciado (base 4px)

```css
:root {
  --space-1:  0.25rem;   /* 4px  */
  --space-2:  0.5rem;    /* 8px  */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### Grid

```css
:root {
  --content-max:   720px;   /* Lectura — ancho óptimo de lectura */
  --layout-max:    1120px;  /* Layout general */
  --sidebar-width: 280px;   /* Panel lateral (desktop) */
  --gutter:        var(--space-4);  /* 16px mobile, 24px desktop */
}
```

### Breakpoints

```css
/* Mobile-first */
/* sm:  ≥ 480px  — móvil landscape */
/* md:  ≥ 768px  — tablet */
/* lg:  ≥ 1024px — desktop */
/* xl:  ≥ 1280px — desktop wide */
```

---

## 5. Borders & Radius

```css
:root {
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;

  --border-width: 1px;
}
```

---

## 6. Shadows & Effects

```css
:root {
  /* Elevación sutil para modo oscuro */
  --shadow-sm:   0 1px 2px hsla(0, 0%, 0%, 0.3);
  --shadow-md:   0 4px 12px hsla(0, 0%, 0%, 0.35);
  --shadow-lg:   0 8px 24px hsla(0, 0%, 0%, 0.4);
  --shadow-glow: 0 0 20px hsla(145, 45%, 42%, 0.2);

  /* Glassmorphism */
  --blur-glass:  blur(16px);
  --blur-subtle: blur(8px);
}
```

---

## 7. Motion & Animation

### Tokens

```css
:root {
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);     /* Material standard */
  --ease-enter:    cubic-bezier(0, 0, 0.2, 1);        /* Decelerate */
  --ease-exit:     cubic-bezier(0.4, 0, 1, 1);        /* Accelerate */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot */

  --duration-fast:    120ms;
  --duration-normal:  200ms;
  --duration-slow:    350ms;
  --duration-reveal:  600ms;
}
```

### Micro-animaciones Clave

| Elemento             | Animación                           | Duración   | Easing       |
|----------------------|-------------------------------------|------------|--------------|
| BodySVG zona hover   | scale(1.04) + glow                  | normal     | spring       |
| BodySVG zona tap     | pulse + color fill                  | slow       | enter        |
| Chip emoción         | slide-in-up + fade                  | normal     | enter        |
| ReadingCard reveal   | slide-up + fade                     | reveal     | enter        |
| Paywall CTA          | subtle pulse + glow                 | 2s loop    | default      |
| Page transition      | fade + slide-y(8px)                 | slow       | default      |
| Drop cap             | scale-in desde 0.8                  | reveal     | spring       |

### Animación `@keyframes`

```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 hsla(145, 45%, 42%, 0.3); }
  50%      { box-shadow: 0 0 20px 4px hsla(145, 45%, 42%, 0.15); }
}

@keyframes bodyZonePulse {
  0%   { opacity: 0.5; }
  50%  { opacity: 1; }
  100% { opacity: 0.5; }
}
```

### `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Components

### 8.1 BodySVG (Componente Estrella)

```yaml
name: BodySVG
type: interactive-svg
role: "Selector corporal — entrada principal del flujo de 3 clics"
states: [idle, hover, active, selected, disabled]
views: [front, back]
zones: 15
touch-target-min: 44x44px  # WCAG AA
features:
  - Hover: glow + scale + tooltip con nombre de zona
  - Tap/Click: fill animado + navega a ContextSelector
  - Vista dual: toggle front/back con transición flip
  - Responsive: escala proporcional, nunca < 300px ancho
accessibility:
  - role="img" con aria-label descriptivo
  - Cada zona: role="button" + aria-label="Zona [nombre]"
  - Focus visible: outline 2px var(--accent-savia)
  - Keyboard: Tab navega zonas, Enter selecciona
```

### 8.2 ContextSelector

```yaml
name: ContextSelector
type: chip-group
role: "Selector de emoción raíz — segundo clic del flujo"
emotions:
  - label: "Carga"      color: var(--emotion-carga)     icon: "weight"
  - label: "Soledad"    color: var(--emotion-soledad)    icon: "moon"
  - label: "Conflicto"  color: var(--emotion-conflicto)  icon: "swords"
  - label: "Cambio"     color: var(--emotion-cambio)     icon: "spiral"
  - label: "Bloqueo"    color: var(--emotion-bloqueo)    icon: "lock"
  - label: "Culpa"      color: var(--emotion-culpa)      icon: "chain"
layout: "2×3 grid en mobile, 1×6 row en desktop"
chip-style:
  border: "1px solid [emotion-color] at 30% opacity"
  background: "[emotion-color] at 8% opacity"
  hover: "[emotion-color] at 15% opacity + border 60%"
  active: "solid [emotion-color] + text white"
  radius: var(--radius-full)
  padding: "var(--space-2) var(--space-4)"
  font: var(--font-ui) / var(--text-caption) / weight 500
```

### 8.3 ReadingCard

```yaml
name: ReadingCard
type: article-card
role: "Tarjeta de lectura — resultado final del flujo"
structure:
  - header:
      - Código SABIA-XXXX (mono, text-muted)
      - Chip de emoción raíz
      - Contador de palabras (~600)
      - Zona + ícono
  - body:
      - Drop cap (primera letra)
      - Narrativa (430 palabras visibles)
      - Paywall fade (gradiente sobre texto)
  - paywall-section:
      - UnlockCTA button
      - Precio: $3 MXN / Bálsamo Emocional
  - premium-content (post-pago):
      - Resto de la lectura
      - Sección MICROTERAPIA (3 pasos numerados)
      - 3 Máximas (SabiaSavia + Sun Tzu + Dirección interior)
      - Recomendaciones Amazon afiliados
      - YouTube música terapéutica (embed)
      - Share WhatsApp
      - Ko-fi / donación
max-width: var(--content-max)  # 720px
background: var(--bg-surface)
border: "1px solid var(--border-subtle)"
radius: var(--radius-lg)
padding: "var(--space-8) var(--space-6)"
```

### 8.4 UnlockCTA

```yaml
name: UnlockCTA
type: button
role: "Botón de desbloqueo premium — Stripe guest checkout"
style:
  background: var(--grad-savia)
  color: white
  font: var(--font-ui) / 1rem / weight 600
  padding: "var(--space-3) var(--space-8)"
  radius: var(--radius-full)
  shadow: var(--shadow-glow)
  animation: pulseGlow 2s infinite
hover:
  transform: "translateY(-1px)"
  shadow: "0 0 24px hsla(145, 45%, 42%, 0.35)"
copy: "Desbloquear Lectura Completa · $3"
sub-copy: "Pago único · Sin cuenta · Acceso inmediato"
```

### 8.5 Navigation

```yaml
name: NavBar
type: header
style:
  background: var(--glass-bg)
  backdrop-filter: var(--blur-glass)
  border-bottom: "1px solid var(--glass-border)"
  height: 56px
  position: sticky
  top: 0
  z-index: 100
items:
  - logo: "SABIA.INFO" (font-display, weight 700)
  - nav-links: ["Explorar", "¿Qué es SABIA?", "Contacto"]
  - mobile: hamburger menu con slide-in panel
```

### 8.6 Footer

```yaml
name: Footer
type: footer
sections:
  - disclaimer: "Contenido informativo. No reemplaza consulta médica profesional."
  - links: ["Aviso legal", "Privacidad", "Sobre la autora"]
  - ko-fi: "☕ Invítame un café"
  - copyright: "© 2026 SABIA.INFO"
style:
  background: var(--bg-deep)
  border-top: "1px solid var(--border-subtle)"
  padding: "var(--space-12) var(--space-6)"
  text: var(--text-muted)
```

---

## 9. Page Templates

### 9.1 Home (`/`)

```
┌──────────────────────────────────────┐
│  NavBar (glass, sticky)              │
├──────────────────────────────────────┤
│                                      │
│  Hero Section                        │
│  ┌────────────────────────────────┐  │
│  │ "Tu cuerpo te dice."          │  │
│  │  Subtítulo + CTA              │  │
│  │  BodySVG (front)     [flip]   │  │
│  │  Glow radial backdrop         │  │
│  └────────────────────────────────┘  │
│                                      │
│  ¿Cómo funciona? (3 pasos visual)   │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  1   │ │  2   │ │  3   │        │
│  │ Zona │ │Emoc. │ │Lect. │        │
│  └──────┘ └──────┘ └──────┘        │
│                                      │
│  Lecturas Recientes (carousel)       │
│                                      │
│  Footer                             │
└──────────────────────────────────────┘
```

### 9.2 Lectura (`/lectura/SABIA-XXXX`)

```
┌──────────────────────────────────────┐
│  NavBar                              │
├──────────────────────────────────────┤
│  Breadcrumb (Zona > Emoción)         │
│                                      │
│  ReadingCard                         │
│  ┌────────────────────────────────┐  │
│  │ SABIA-0042 · Carga · Hombros  │  │
│  │ ~600 palabras                  │  │
│  │                                │  │
│  │ C uando los hombros cargan... │  │ ← Drop cap
│  │ [narrativa 430 palabras]      │  │
│  │                                │  │
│  │ ░░░ paywall gradient ░░░░░░░  │  │
│  │                                │  │
│  │  [ Desbloquear · $3 ]         │  │ ← UnlockCTA
│  └────────────────────────────────┘  │
│                                      │
│  Lecturas Relacionadas               │
│  Footer                             │
└──────────────────────────────────────┘
```

### 9.3 Hub de Zona (`/zona/[slug]`)

```
┌──────────────────────────────────────┐
│  NavBar                              │
├──────────────────────────────────────┤
│  Título de Zona + Mini BodySVG       │
│  (zona resaltada)                    │
│                                      │
│  Grid de lecturas de esta zona       │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ card │ │ card │ │ card │        │
│  └──────┘ └──────┘ └──────┘        │
│                                      │
│  Footer                             │
└──────────────────────────────────────┘
```

---

## 10. Responsive Behavior

| Breakpoint | Layout                         | BodySVG        | ReadingCard     |
|------------|--------------------------------|----------------|-----------------|
| < 480px    | 1 col, full-width              | 300px, centrado | padding 16px    |
| ≥ 480px    | 1 col, max-width containers    | 360px           | padding 24px    |
| ≥ 768px    | 2 col grids donde aplica       | 400px           | padding 32px    |
| ≥ 1024px   | Layout con sidebar posible     | 440px, aside    | max-width 720px |
| ≥ 1280px   | Contenido centrado con margen  | 480px           | max-width 720px |

---

## 11. Accessibility

```yaml
standards: WCAG 2.1 AA
contrast-ratio:
  text-primary-on-bg-deep: "15.2:1 ✓"
  text-secondary-on-bg-deep: "7.8:1 ✓"
  accent-savia-on-bg-deep: "5.1:1 ✓"
  accent-gold-on-bg-surface: "5.4:1 ✓"
focus:
  style: "2px solid var(--accent-savia), offset 2px"
  visible: "always on keyboard navigation"
touch-targets:
  minimum: "44×44px (WCAG)"
  recommended: "48×48px"
aria:
  body-svg: "role='img', zonas role='button'"
  reading-card: "article con heading hierarchy"
  paywall: "aria-hidden en contenido bloqueado"
  navigation: "nav con aria-label"
motion:
  respects: "prefers-reduced-motion"
  fallback: "transiciones instantáneas"
```

---

## 12. SEO & Schema

```yaml
schema-type: Article  # NO MedicalCondition — evita YMYL
additional-schemas:
  - FAQPage (en hubs de zona)
  - BreadcrumbList
meta:
  title-template: "[Zona] + [Emoción] — Lectura SABIA | SABIA.INFO"
  description-template: "Lectura personalizada de [zona] y [emoción]. Descubre qué te dice tu cuerpo desde la medicina china y la biodescodificación."
  og-image: dynamic (zona + emoción)
sitemap: auto-generated, 450+ URLs
canonical: absolute URLs
```

---

## 13. Iconography

```yaml
system: lucide-react  # Open source, tree-shakeable
style: stroke-width 1.5px, 20×20px default
custom-icons:
  - body-zones (SVG custom)
  - emotion-set (6 íconos custom para el ContextSelector)
color: "inherit from parent, default var(--text-secondary)"
```

---

## 14. File Structure (Next.js 14)

```
SABIA/
├── app/
│   ├── layout.tsx              # Root layout + fonts + meta
│   ├── page.tsx                # Home
│   ├── globals.css             # Design tokens (este documento como CSS)
│   ├── lectura/
│   │   └── [slug]/
│   │       └── page.tsx        # Lectura individual
│   ├── zona/
│   │   └── [slug]/
│   │       └── page.tsx        # Hub de zona
│   └── api/
│       └── stripe/
│           └── checkout/
│               └── route.ts    # Stripe guest checkout
├── components/
│   ├── BodySVG.tsx             # Mapa corporal interactivo
│   ├── ContextSelector.tsx     # Selector de emociones
│   ├── ReadingCard.tsx         # Tarjeta de lectura
│   ├── UnlockCTA.tsx           # Botón de pago
│   ├── NavBar.tsx              # Navegación
│   ├── Footer.tsx              # Footer
│   ├── PaywallFade.tsx         # Gradiente de paywall
│   └── ShareWhatsApp.tsx       # Botón compartir
├── content/
│   └── readings/               # Lecturas MDX o JSON
│       ├── cabeza/
│       ├── hombros/
│       └── .../
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── zones.ts                # Mapa de zonas corporales
│   ├── emotions.ts             # Config de emociones
│   └── stripe.ts               # Stripe helpers
├── scripts/
│   └── sabia_v2.py             # Motor de generación de lecturas
├── public/
│   ├── body-front.svg
│   ├── body-back.svg
│   └── og/                     # Open Graph images
├── DESIGNSYSTEM.md             # ← Este archivo
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 15. Performance Budget

```yaml
lighthouse-targets:
  performance: ">= 95"
  accessibility: ">= 95"
  best-practices: ">= 90"
  seo: ">= 95"
bundle:
  first-load-js: "< 80KB"
  total-css: "< 25KB"
fonts:
  strategy: "font-display: swap, preload critical"
  subset: "latin, latin-ext"
images:
  format: "WebP, AVIF fallback"
  lazy-loading: "below-the-fold"
svg:
  body-svg: "inline, < 15KB"
  optimization: "SVGO processed"
```

---

## 16. Design Tokens Export

Este documento es la **fuente de verdad** del sistema de diseño.

Compatible con:
- **Google Stitch**: importable como DESIGN.md context
- **Coding Agents** (Antigravity, Cursor, Claude Code): parseado como referencia directa
- **Figma**: tokens mapeables a Figma Variables
- **CSS**: convertible directamente a `globals.css`

```
DESIGNSYSTEM.md → globals.css → Componentes TSX → Páginas
```

---

> *"El diseño no es cómo se ve. Es cómo funciona."* — Steve Jobs
> 
> Adaptado para SABIA: **El diseño es cómo sana.**
