# TEMPLATE LAYOUTS | Complete Page Patterns

Full-page layout templates ready for integration with motor output. These templates combine components (header, TOC, cards, etc.) into complete, functional pages.

---

## Available Layouts

| Layout | File | Purpose |
|--------|------|---------|
| **Hub** | [layout-hub.html](layout-hub.html) | Entity/context hub (zona, contexto) |
| **Article** | [layout-article.html](layout-article.html) | Individual article/node page |
| **FAQ** | [layout-faq.html](layout-faq.html) | FAQ collection page |
| **Search** | [layout-search.html](layout-search.html) | Search results page |

---

## How to Use These Templates

### For Integration Engineers
1. Choose the layout matching your page type
2. Map motor output to each section
3. Copy structure + classes
4. Test with real motor output

### For Motor Engineers
1. Review layout structure
2. Identify insertion points for dynamic content
3. Ensure all sections have corresponding motor output
4. Validate with integration engineer

---

## Content Areas

Each template defines these zones:

| Zone | Purpose | Motor Output |
|------|---------|--------------|
| **Header** | Global navigation | Injected (Carril A) |
| **Breadcrumbs** | Hierarchical path | From motor context |
| **Main content** | Page-specific content | Motor output |
| **Sidebar** | Supporting info (TOC, FAQ, related) | Generated/injected |
| **Footer** | Global footer + disclaimer | Injected (Carril A) |

---

## Common Sections

### Hero (Intro Section)
```html
<section class="hero">
  <h1>Page Title</h1>
  <p>Page description or tagline</p>
</section>
```

### Breadcrumbs
```html
<nav class="breadcrumbs" aria-label="Breadcrumbs">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/zona">Zona</a></li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>
```

### Grid of Cards
```html
<div class="grid-3">
  <article class="card">
    <!-- Card content -->
  </article>
</div>
```

### TOC Sidebar (Sticky)
```html
<aside class="toc-sidebar">
  <nav class="toc" aria-label="Table of contents">
    <!-- Generated from H2, H3 -->
  </nav>
</aside>
```

### Related Links
```html
<section class="related-links">
  <h2>Ver también</h2>
  <div class="grid-2">
    <article class="card">
      <!-- Related item -->
    </article>
  </div>
</section>
```

---

## Responsive Stacking

All layouts stack for mobile (320px):
- Main content: full width
- Sidebar: moves below main
- Grid items: single column
- Header/footer: full width

Example:
```
DESKTOP (1200px+)      TABLET (768px)         MOBILE (320px)
[Header]               [Header]               [Header]
[Breadcrumbs]          [Breadcrumbs]          [Breadcrumbs]
[Main]  [Sidebar]      [Main]                 [Main]
                       [Sidebar]              [Sidebar]
[Footer]               [Footer]               [Footer]
```

---

## Testing Layouts

Before deployment:

- [ ] Desktop (1200px+): All sections properly positioned
- [ ] Tablet (768px): Sidebar stacks below main
- [ ] Mobile (320px): Single column, readable
- [ ] Keyboard: Tab navigation flows naturally
- [ ] Screen reader: Headings, landmarks announced correctly
- [ ] Performance: Page loads < 2s (if testable)

---

## Integration Checklist

- [ ] Layout HTML is valid
- [ ] All classes exist in [../assets/css/main.css](../assets/css/main.css)
- [ ] Breadcrumbs have schema markup (if SEO needed)
- [ ] Sidebar hidden/shown appropriately per breakpoint
- [ ] Related links point to correct URLs
- [ ] Mobile menu toggle works (if present)
- [ ] TOC scroll sync (if needed)
- [ ] Footer disclaimer is visible and readable

---

## Files

- 📋 [layout-hub.html](layout-hub.html) — Not yet created
- 📋 [layout-article.html](layout-article.html) — Not yet created
- 📋 [layout-faq.html](layout-faq.html) — Not yet created
- 📋 [layout-search.html](layout-search.html) — Not yet created

---

**Last Updated:** 2026-03-24  
**Status:** 🟡 Ready for template development
