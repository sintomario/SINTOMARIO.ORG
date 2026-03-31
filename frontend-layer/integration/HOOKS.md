# HOOKS & INTEGRATION POINTS

**Purpose:** Map the HTML injection points where Carril A components will integrate with Carril B motor output.

This document identifies where the motor generates HTML and what classes/structures are already baked in.

---

## Global Integration Points

### Every Page: `<head>` Section

**Motor generates:**
```html
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Dynamic Title]</title>
  <meta name="description" content="[Dynamic]">
  [OpenGraph tags]
  [Schema.org JSON-LD]
  <link rel="stylesheet" href="/assets/css/main.css">
  <!-- CSS now external -->
</head>
```

**Carril A insertion points:**
- **Line:** In `<head>`, after `<link rel="stylesheet">`
- **Use case:** Additional CSS files (fonts, animations, print styles)
- **Format:** `<link rel="stylesheet" href="/assets/css/[module].css">`

**Current classes used by motor:**
- None specific in `<head>` (clean separation)

---

### Every Page: `<body>` Wrapper

**Motor generates:**
```html
<body>
  <main class="wrap">
    <!-- Page content -->
  </main>
</body>
```

**Carril A insertion points:**
- **Before `<main class="wrap">`:** Header component (global nav)
- **After `</main>`:** Footer component (global footer, disclaimer)

**Current classes used by motor:**
- `.wrap` — Container max-width 980px, padding 24px (mobile: 16px)

---

## Page Type: Homepage

**Motor generates:** `index.html`

**Structure:**
```html
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">Fase 2 local</div>
    <h1>SINTOMARIO</h1>
    <p>Build local generado con {nodes_written} articulos...</p>
  </section>
  <!-- Optional: grid of top-level sections -->
</main>
```

**Carril A insertion points:**
- **Hero:** Already styled (`class="hero"`, `class="eyebrow"`)
- **Grid section:** Could use `.grid-3` for entity cards (if motor adds them)
- **Below hero:** Could inject featured content cards

**Current classes used by motor:**
- `.hero` — Styled container with gradient
- `.eyebrow` — Small uppercase label (golden accent)
- `h1`, `p` — Heading and body text

---

## Page Type: Entity Hub (Body Part, Context)

**Motor generates:** `/cuerpo/[entity-id]/index.html` and `/cuerpo/contextos/[context-id]/index.html`

**Structure:**
```html
<main class="wrap">
  <section class="hero">
    <h1>{entidad['nombre'].title()}</h1>
    <p>Hub de entidad corporal para navegar lecturas por contexto emocional.</p>
  </section>
  <!-- Motor could generate grid of related articles here -->
</main>
```

**Carril A insertion points:**
- **Hero:** Already styled
- **Breadcrumbs:** Could inject before hero (add `<nav class="breadcrumbs">`)
- **Grid of articles/sub-entities:** Could use `.grid-3` or `.grid-2` for cards
- **Sidebar (future):** Could add related links, categories

**Current classes used by motor:**
- `.hero`, `h1`, `p`

---

## Page Type: Static Pages (About, Affiliates, FAQ)

**Motor generates:** `/sobre/index.html`, `/afiliados/index.html`, etc.

**Structure:**
```html
<main class="wrap">
  <section class="hero">
    <h1>{title}</h1>
    <p>{description}</p>
  </section>
</main>
```

**Carril A insertion points:**
- **Hero:** Already styled
- **Content body:** Motor could fetch from external files (Markdown, JSON)
- **Disclaimers:** Already styled in footer (global insertion point)
- **FAQ block:** If FAQ page, could use `.faq-block` component with `.faq-item` accordions

**Current classes used by motor:**
- `.hero`, `h1`, `p`

---

## Page Type: Article Node (not yet in current motor, but planned)

**Future motor generation:** `/cuerpo/[entity-id]/[perspective-id]/[article-id]/index.html`

**Expected structure:**
```html
<main class="wrap">
  <nav class="breadcrumbs">
    <!-- Breadcrumb trail -->
  </nav>

  <section class="hero">
    <h1>{Article Title}</h1>
    <p>{Summary}</p>
    <meta>Fecha, autor (si existe)</meta>
  </section>

  <aside class="toc-sidebar">
    <nav class="toc">
      <!-- Table of Contents from H2, H3 -->
    </nav>
  </aside>

  <article class="article-body">
    <!-- Main content from corpus -->
    <h2>Section 1</h2>
    <p>Content...</p>
    <h3>Subsection</h3>
    <p>Content...</p>
  </article>

  <section class="related-links">
    <h2>Ver también</h2>
    <div class="grid-2">
      <article class="card"><!-- Related item --></article>
    </div>
  </section>

  <section class="faq-block">
    <!-- FAQ items as accordion -->
  </section>

  <aside class="affiliate-block">
    <!-- Affiliate CTA with disclaimer -->
  </aside>
</main>
```

**Carril A insertion points:**
- **Breadcrumbs:** Add `<nav class="breadcrumbs">` structure
- **TOC sidebar:** Generate from H2/H3 using `.toc` class
- **Article body:** Apply `.article-body` styles (already covered by global typography)
- **Related links:** Use `.grid-2` + `.card` for styling
- **FAQ:** Use `.faq-block` structure with JS for expand/collapse
- **Affiliate:** Use `.affiliate-block` structure with disclaimer

**Current classes used by motor (planned):**
- `.breadcrumbs`, `.toc`, `.article-body`, `.card`, `.grid-2`
- `.faq-block`, `.faq-item`, `.affiliate-block`

---

## Page Type: Search Results (future, não yet in motor)

**Future motor generation:** `/search/index.html` or `/search/?q=query`

**Expected structure:**
```html
<main class="wrap">
  <h1>Search</h1>
  
  <form class="search-form">
    <input type="search" placeholder="...">
    <button>Buscar</button>
  </form>

  <section class="search-results">
    <h2>Resultados para: "<span>{query}</span>"</h2>
    <div class="results-count">20 resultados</div>
    <div class="results-list">
      <article class="result-item">
        <a href="/url" class="result-title">Title</a>
        <p class="result-excerpt">Fragment...</p>
        <span class="result-url">sintomario.org/url</span>
      </article>
    </div>
  </section>

  <nav class="pagination">
    <!-- Pagination controls -->
  </nav>
</main>
```

**Carril A insertion points:**
- **Search form:** Style with `.search-form` + button styles
- **Results list:** Style with `.result-item`, `.result-title`, `.result-excerpt`, `.result-url`
- **Pagination:** Style with `.pagination` class

**Current classes used by motor (planned):**
- `.search-form`, `.search-results`, `.result-item`, `.pagination`

---

## Global Components Already Integrated

### Header (Motor → Carril A)
**Motor does NOT generate:** No global header currently baked in motor output.

**Carril A responsibility:** Create and inject header via:
1. **Option A:** Separate `/assets/js/inject-header.js` that runs on page load
2. **Option B:** Motor template modification to include `{{% include 'header.html' %}}`
3. **Option C:** Static `/assets/includes/header.html` copied to all pages via build script

**Current status:** Placeholder only. Motor refactoring may add this.

**Classes needed:** `.site-header`, `.main-nav`, `.logo`, `.search-toggle`

---

### Footer (Motor → Carril A)
**Motor does NOT generate:** Footer currently baked in motor output.

**Carril A responsibility:** Create and inject footer via same methods as header.

**Classes needed:** `.site-footer`, `.footer-content`, `.footer-disclaimer`, `.footer-nav`

---

### Breadcrumbs (Motor → Carril A)
**Motor does NOT generate:** Not yet in current motor output.

**Carril A responsibility:** Add breadcrumb generation logic to motor OR inject via JS for dynamic URLs.

**Classes needed:** `.breadcrumbs`, `.breadcrumb-item`

---

## CSS Classes Already Active in Motor

| Class | Usage | Source |
|-------|-------|--------|
| `.wrap` | Main container (max-width 980px) | `_write_file()` for all pages |
| `.hero` | Hero section styling | Homepage, hubs, static pages |
| `.eyebrow` | Small uppercase label | Homepage |
| `h1`, `h2`, `h3` | Headings | Global typography |
| `p`, `li` | Paragraph, list items | Global typography |
| `a` | Links | Global link styling |
| `.grid-3` | 3-column responsive grid | (Motor could use this for card grids) |
| `.product` | Product/card styling | (Motor could use this for entity cards) |
| `.card` | Generic card styling | (Future: related links, affiliates) |
| `.toc` | Table of contents tags | (Future: generated from headings) |
| `.muted` | Muted text color | (Future: metadata, secondary info) |

---

## CSS Classes Available for Motor But NOT YET USED

| Class | Intended Use | When to Activate |
|-------|--------------|------------------|
| `.grid-2` | 2-column grid | Related articles, sidebar layouts |
| `.grid` | Generic grid (gap only) | Flexible layouts |
| `.breadcrumbs` | Breadcrumb navigation | Entity pages, article nodes |
| `.toc` (full structure) | Sticky TOC sidebar | Article nodes with long content |
| `.article-body` | Article main content styling | Article nodes |
| `.faq-block`, `.faq-item` | FAQ accordion | FAQ pages, article FAQs |
| `.affiliate-block` | Affiliate CTA section | Affiliate pages, article sidebars |
| `.badge` | Inline badges | Tags, labels (like `.eyebrow`) |
| `.search-form` | Search input + button | Search pages |
| `.result-item` | Individual search result | Search results pages |
| `.site-header` | Global header | All pages (needs injection) |
| `.site-footer` | Global footer | All pages (needs injection) |

---

## Integration Workflow Summary

### Current State ✅
- Motor outputs HTML with external CSS reference
- CSS file exists and contains all classes
- Basic styling works for existing pages

### Immediate Next (Carril A)
1. [ ] Create header component HTML in `components-spec/header.html`
2. [ ] Create footer component HTML in `components-spec/footer.html`
3. [ ] Add injection logic (header/footer to all pages)
4. [ ] Test on homepage, hubs, static pages

### Short Term (Carril A)
5. [ ] Create breadcrumbs component HTML + JS
6. [ ] Create TOC component HTML + JS
7. [ ] Add to article node templates (when motor supports articles)

### Medium Term (Carril A)
8. [ ] Add FAQ accordion component + JS
9. [ ] Add affiliate block component
10. [ ] Add search results page styling

### Long Term (Carril B support)
11. [ ] Motor generates article nodes
12. [ ] Motor generates search pages
13. [ ] Motor injects header/footer OR Carril A handles via JS
14. [ ] Full integration validated

---

**Last Updated:** 2026-03-24  
**Status:** Ready for component development

**Key Insight:** Motor outputs clean, structural HTML. Carril A adds styling and interactivity via CSS/JS without touching motor code (except for optional template integration later).
