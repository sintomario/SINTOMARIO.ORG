# MAPPING: Carril A ↔ Carril B Integration

## Current State (After Carril B Refactor)

**Motor:** `sintomario_motor.py` now outputs `<link rel="stylesheet" href="/assets/css/main.css">`

**Expected file location in SINTOMARIO.ORG:**
```
SINTOMARIO.ORG/
  ├── /publish/          (deploy output)
  │   ├── /assets/
  │   │   └── /css/
  │   │       ├── main.css          ← Motor expects this
  │   │       ├── components.css    ← (future modular splits)
  │   │       └── (other modules)
  │   ├── index.html
  │   ├── cuerpo/
  │   └── ...
  └── /motor/
      └── sintomario_motor.py
```

---

## Design Tokens Reference

These tokens are defined in `frontend-layer/assets/css/main.css` and should remain **consistent across all future CSS additions**.

| Token Name | Value | Usage |
|-----------|-------|-------|
| `--color-bg-primary` | #0a0a0a | Main background |
| `--color-bg-secondary` | #171717 | Cards, heroes, containers |
| `--color-bg-tertiary` | #111 | Nested/tertiary backgrounds |
| `--color-border` | #353024 | Primary borders |
| `--color-text-primary` | #efe8d8 | Body text, default |
| `--color-text-heading` | #f6eedf | H2+ headings |
| `--color-accent` | #c9a961 | Accent, links, badges |
| `--font-serif` | Georgia, serif | Body font |
| `--font-mono` | "DM Mono", monospace | Badges, code |
| `--size-max-width` | 980px | Container max width |
| `--space-xl` | 24px | Primary padding/margin |

---

## HTML Integration Points

When motor generates HTML, these classes are now **structural hooks** for styling:

### Page Structure (All Pages)
```html
<!doctype html>
<html lang="es">
<head>
  <!-- ... existing meta ... -->
  <link rel="stylesheet" href="/assets/css/main.css">  ← CRITICAL
</head>
<body>
  <main class="wrap">
    <!-- Content goes here -->
  </main>
</body>
</html>
```

### Hero Sections
```html
<section class="hero">
  <div class="eyebrow">Label</div>
  <h1>Title</h1>
  <p>Description</p>
</section>
```

Classes used: `.hero`, `.eyebrow`, `h1`, `p`

### Cards (Entity Hubs, Related Links)
```html
<article class="card">
  <h3>Card Title</h3>
  <p>Card description</p>
  <a href="#">Read more</a>
</article>
```

Classes used: `.card`, `h3`, `p`, `a`

### Grids (Product/Entity Lists)
```html
<div class="grid-3">
  <article class="product">
    <!-- Item content -->
  </article>
</div>
```

Classes used: `.grid-3`, `.product`

### Table of Contents
```html
<div class="toc">
  <span><!-- item --></span>
  <span><!-- item --></span>
</div>
```

Classes used: `.toc`, `span`

---

## Current CSS Architecture

In `frontend-layer/assets/css/`:
- **main.css** — Consolidated output (all-in-one, minified for deploy)
- Future modular structure (optional, for dev workflow):
  - `normalize.css`
  - `variables.css`
  - `typography.css`
  - `layout.css`
  - `components.css`
  - `utilities.css`

For now, `main.css` is the single source of truth. All changes go here until modularization is needed.

---

## Deployment Flow

### Before (Carril B Refactor)
```
Motor generates HTML
  ↓
Includes <style>{INLINE_CSS}</style>
  ↓
CSS baked into every HTML file
  ↓
Change font in CSS → Rebuild entire motor → Regenerate all HTML
```

### After (Current State)
```
Motor generates HTML
  ↓
Includes <link rel="stylesheet" href="/assets/css/main.css">
  ↓
HTML references external CSS
  ↓
Change font in main.css → Update one file → Deploy ✅
```

---

## Checklist: Integration Readiness

- [x] Motor refactored to use external CSS
- [x] `main.css` created with all original styles converted to modular
- [x] Custom properties (design tokens) defined
- [x] Classes documented and mapped to HTML output
- [ ] Test build in SINTOMARIO.ORG (verify `/assets/css/main.css` is served)
- [ ] Verify all pages render correctly
- [ ] Mobile responsive test
- [ ] A11y validation (contrast, focus, etc.)

---

## Next Steps for Carril A

1. **Modularize CSS** (if complexity grows beyond main.css)
2. **Add interactive components** (TOC expand/collapse, mobile menu, search)
3. **Create component library** documentation in `components-spec/`
4. **Add responsive images/icons** in `/assets/icons/`
5. **Create template guide** for integration engineers

---

## File References

- **Motor file:** `SINTOMARIO.ORG/.sintomario-local/motor/sintomario_motor.py`
- **Deploy CSS:** `SINTOMARIO.ORG/publish/assets/css/main.css`
- **Carril A source:** `frontend-layer/assets/css/main.css`
- **Integration guide:** `frontend-layer/integration/README.md`

---

**Last updated:** 2026-03-24  
**Status:** Ready for modular CSS expansion and component development
