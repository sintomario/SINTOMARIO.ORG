# COMPONENTS SPECIFICATION | HTML Patterns

This directory contains reusable HTML patterns for all frontend components. Each file is a **reference template** for integration with the motor output.

---

## Component Files

| File | Purpose | Status |
|------|---------|--------|
| [header.html](header.html) | Global site header + navigation | 📋 Template |
| [footer.html](footer.html) | Global site footer + disclaimer | 📋 Template |
| [breadcrumbs.html](breadcrumbs.html) | Hierarchical navigation path | 📋 Template |
| [toc.html](toc.html) | Table of contents (sticky sidebar) | 📋 Template |
| [card-topic.html](card-topic.html) | Card for zone/perspective/article link | 📋 Template |
| [card-related.html](card-related.html) | Lightweight related link card | 📋 Template |
| [faq-block.html](faq-block.html) | Expandable FAQ section + items | 📋 Template |
| [affiliate-block.html](affiliate-block.html) | Affiliate CTA + disclaimer | 📋 Template |
| [search-results.html](search-results.html) | Search results page pattern | 📋 Template |
| [hero.html](hero.html) | Hero section (intro + visual) | 📋 Template |

---

## Using These Templates

### For Integration Engineers
1. Copy the HTML pattern from the file
2. Map it to your motor output structure
3. Verify all `class` names are present in [../assets/css/main.css](../assets/css/main.css)
4. Test in browser (Network tab → verify CSS loads)

### For Frontend Developers
1. Create your component in a file here
2. Use only semantic HTML + classes from main.css
3. Document expected `class` names and attributes
4. Add comments for integration points
5. Test responsive (320px, 768px, 1200px)

### For Designers/Product
1. Review HTML structure (readability, semantic flow)
2. Check for accessibility (headings, landmarks, labels)
3. Validate against [../docs/DESIGN_TOKENS.md](../docs/DESIGN_TOKENS.md)
4. Approve before integration

---

## HTML Best Practices in These Templates

### 1. Semantic HTML
```html
<!-- ✅ Good: semantic elements -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<!-- ❌ Avoid: div soup -->
<div class="header">
  <div class="nav">
    <div class="link">...</div>
  </div>
</div>
```

### 2. CSS Classes
All classes used must be defined in [../assets/css/main.css](../assets/css/main.css):

```html
<!-- ✅ Use these classes -->
<article class="card">
  <h3>Title</h3>
</article>

<!-- ❌ Don't invent new classes -->
<article class="my-custom-card">
  <!-- Won't work; not in CSS -->
</article>
```

### 3. Accessibility (ARIA)
```html
<!-- ✅ Provide context for screen readers -->
<nav aria-label="Table of contents">
<button aria-expanded="false" aria-controls="faq-panel-1">

<!-- ❌ Never rely on class names alone -->
<div class="nav"> <!-- No aria-label! -->
```

### 4. Responsive Structure
```html
<!-- ✅ Mobile-first: stack by default -->
<div class="grid-3">
  <article class="card">...</article>
</div>
<!-- CSS handles: 1 col @ mobile, 3 cols @ desktop -->

<!-- ❌ Avoid: media query hacks in HTML -->
<article class="card hide-on-mobile"> <!-- Wrong! -->
```

### 5. Links & CTAs
```html
<!-- ✅ Meaningful link text -->
<a href="/about">Learn more about SINTOMARIO</a>

<!-- ❌ Generic link text -->
<a href="/about">Click here</a>
```

---

## Class Reference

Use only these classes from [../assets/css/main.css](../assets/css/main.css):

| Class | Purpose | Example |
|-------|---------|---------|
| `.wrap` | Max-width container | `<main class="wrap">` |
| `.hero` | Introduction section | `<section class="hero">` |
| `.card` | Generic card/container | `<article class="card">` |
| `.product` | Product/item card | `<article class="product">` |
| `.grid-2` | 2-column responsive grid | `<div class="grid-2">` |
| `.grid-3` | 3-column responsive grid | `<div class="grid-3">` |
| `.eyebrow` | Small uppercase label | `<div class="eyebrow">` |
| `.badge` | Badge/pill label | `<span class="badge">` |
| `.toc` | Table of contents list | `<nav class="toc">` |
| `.breadcrumbs` | Breadcrumb navigation | `<nav class="breadcrumbs">` |
| `.faq-block` | FAQ section | `<section class="faq-block">` |
| `.faq-item` | Individual FAQ item | `<div class="faq-item">` |
| `.affiliate-block` | Affiliate CTA section | `<aside class="affiliate-block">` |
| `.site-header` | Global header (if injected) | `<header class="site-header">` |
| `.site-footer` | Global footer (if injected) | `<footer class="site-footer">` |
| `.muted` | Muted text color | `<span class="muted">` |
| `.flex` | Flex container | `<div class="flex">` |
| `.hidden` | Display: none | `<div class="hidden">` |

---

## Testing Checklist

Before finalizing a component:

- [ ] **HTML is valid** (no unclosed tags, proper nesting)
- [ ] **All classes exist** in [../assets/css/main.css](../assets/css/main.css)
- [ ] **Mobile-friendly** (320px viewport, readable, no horizontal scroll)
- [ ] **Keyboard accessible** (Tab navigation, focus visible)
- [ ] **Contrast ≥ 4.5:1** (text on background)
- [ ] **Semantic HTML** (h1–h6, nav, main, aside, article, etc.)
- [ ] **No inline styles** (use CSS classes)
- [ ] **Documented** (comments for integration points)
- [ ] **No external dependencies** (vanilla HTML)

---

## Integration Points

Each template includes **integration comments** highlighting where motor output connects:

```html
<!-- 
  INTEGRATION POINT: Motor generates <h1>{entity.name}</h1>
  Expected class: .hero (must be present)
  Motor responsibility: Inject h1 here
  Carril A responsibility: Style .hero and h1
-->
```

**Before integrating:**
1. Find all integration comments
2. Verify motor output structure matches expectation
3. Test with real motor output
4. Reference [../integration/HOOKS.md](../integration/HOOKS.md) for full mapping

---

## File Template

When creating a new component, use this structure:

```html
<!-- 
component-name.html
Purpose: [What does this component do?]
Motor source: [Where does motor output this?]
Classes used: [List classes from main.css]
A11y notes: [Any ARIA or semantic considerations]
Integration: [Any special setup needed?]
-->

<article class="card">
  <!-- INTEGRATION POINT: Motor injects title here -->
  <h3>Title</h3>
  
  <!-- Content goes here -->
  <p>Description</p>
  
  <!-- Call-to-action or link -->
  <a href="#">Link</a>
</article>
```

---

## Files Ready for Review

Currently implemented:
- [ ] header.html — **Create next**
- [ ] footer.html — **Create next**
- [ ] breadcrumbs.html — **Create next**
- [ ] toc.html — **Create next**
- [ ] card-topic.html — **Create next**
- [ ] card-related.html — **Create next**
- [ ] faq-block.html — **Create next**
- [ ] affiliate-block.html — **Create next**
- [ ] search-results.html — **Create next**
- [ ] hero.html — **Create next**

---

## Questions?

- **CSS class not found?** Check [../assets/css/main.css](../assets/css/main.css)
- **Design token needed?** See [../docs/DESIGN_TOKENS.md](../docs/DESIGN_TOKENS.md)
- **Motor integration?** See [../integration/HOOKS.md](../integration/HOOKS.md)
- **A11y guidelines?** See [../docs/ACCESSIBILITY.md](../docs/ACCESSIBILITY.md)

---

**Last Updated:** 2026-03-24  
**Status:** 🟡 Ready for component development
