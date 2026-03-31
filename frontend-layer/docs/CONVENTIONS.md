# CODE CONVENTIONS | Naming, Style, and Best Practices

Consistency across the frontend layer ensures maintainability and reduces friction during integration.

---

## CSS Conventions

### Naming: BEM (Block__Element--Modifier)

Use **Block Element Modifier** naming for clarity and predictability.

```css
/* BLOCK: Main component */
.card {
  background: var(--color-bg-secondary);
}

/* ELEMENT: Part of block */
.card__header {
  padding: var(--space-lg);
}

.card__body {
  padding: var(--space-lg);
}

.card__footer {
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border-light);
}

/* MODIFIER: Variation of block or element */
.card--featured {
  border: 2px solid var(--color-accent);
}

.card__header--dark {
  background: var(--color-bg-tertiary);
}
```

**Usage:**
```html
<article class="card card--featured">
  <div class="card__header card__header--dark">
    <h3>Title</h3>
  </div>
  <div class="card__body">
    <p>Content</p>
  </div>
  <div class="card__footer">
    <a href="#">Action</a>
  </div>
</article>
```

### Utility Classes

Keep utility class names short and predictable.

```css
/* Text utilities */
.text-center { text-align: center; }
.text-muted  { color: var(--color-text-muted); }
.text-bold   { font-weight: bold; }

/* Visibility */
.hidden      { display: none !important; }
.visually-hidden { /* Screen-reader only */ }

/* Spacing */
.mt-large    { margin-top: var(--space-2xl); }
.mb-large    { margin-bottom: var(--space-2xl); }
.p-lg        { padding: var(--space-lg); }

/* Responsive */
@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
}

@media (min-width: 768px) {
  .show-mobile { display: none !important; }
}
```

### Property Order

Organize CSS properties logically:

```css
.card {
  /* Display & Layout */
  display: block;
  position: relative;
  
  /* Sizing */
  width: 100%;
  height: auto;
  max-width: 400px;
  
  /* Spacing */
  margin: var(--space-lg);
  padding: var(--space-xl);
  
  /* Background & Borders */
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--size-border-radius);
  
  /* Typography */
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  
  /* Effects */
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-md);
}
```

### Color Usage

Always use custom properties (CSS variables), never hardcoded colors:

```css
/* ✅ Correct */
.heading {
  color: var(--color-text-heading);
}

/* ❌ Wrong */
.heading {
  color: #f6eedf; /* Hardcoded! */
}
```

See [DESIGN_TOKENS.md](../docs/DESIGN_TOKENS.md) for all available tokens.

### Media Queries

Use mobile-first approach (start small, enhance for larger screens):

```css
/* Default: mobile layout */
.grid-3 {
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

/* Tablet and up */
@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1200px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Breakpoints:**
- Mobile: 320px (default, no breakpoint needed)
- Tablet: `@media (min-width: 768px)`
- Desktop: `@media (min-width: 1200px)`

### Selectors

Prefer **class selectors**, avoid IDs and element selectors for styling:

```css
/* ✅ Class selectors (best) */
.button { padding: var(--space-lg); }
.button--primary { background: var(--color-accent); }
.button:hover { opacity: 0.9; }

/* ⚠️ Element selectors (less specific) */
button { padding: var(--space-lg); }

/* ❌ ID selectors (avoid for styling) */
#submit-btn { padding: var(--space-lg); } /* Too specific, inflexible */

/* ❌ Attribute selectors (avoid unless necessary) */
[type="submit"] { padding: var(--space-lg); } /* Hard to override */
```

---

## HTML Conventions

### Semantic Elements

Use semantic HTML5 elements for clarity and accessibility:

```html
<!-- ✅ Semantic structure -->
<header class="site-header">
  <nav class="main-nav" aria-label="Main navigation">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>
</header>

<main class="wrap">
  <article class="card">
    <h1>Title</h1>
    <section>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer class="site-footer">
  <p>© 2026 SINTOMARIO</p>
</footer>

<!-- ❌ Non-semantic (div soup) -->
<div class="header">
  <div class="nav">
    <div><a href="#">Home</a></div>
  </div>
</div>
```

### Accessibility Attributes

Include ARIA attributes where appropriate:

```html
<!-- ✅ Labeled navigation (screen readers) -->
<nav aria-label="Table of contents">
  <ul>...</ul>
</nav>

<!-- ✅ Expanded/collapsed state (buttons) -->
<button aria-expanded="false" aria-controls="panel-1">
  Toggle FAQ
</button>
<div id="panel-1" hidden>
  Answer goes here...
</div>

<!-- ✅ Form labels associated with inputs -->
<label for="search">Search:</label>
<input id="search" type="search" placeholder="...">

<!-- ❌ Inaccessible button (no label, no ARIA) -->
<div onclick="toggle()">Click</div>
```

### Attribute Order

Keep attributes in a consistent order:

```html
<element
  id="unique-id"
  class="class-name"
  data-attribute="value"
  aria-label="Label for screen readers"
  role="region"
  href="/url"
  onclick="handler()"
>
</element>
```

### Comments

Add comments for integration points and complex logic:

```html
<!-- 
  INTEGRATION POINT: Motor injects <h1> here
  Expected: Motor provides heading text
  Class: h1 (styled in main.css)
-->
<h1></h1>

<!-- Dynamic TOC: Generated from H2, H3 anchors -->
<nav class="toc">
  <!-- Populate with JS from headings -->
</nav>

<!-- CTA: Affiliate link with disclaimer -->
<a href="/affiliate-link" class="btn btn--affiliate">
  Learn more
</a>
```

---

## JavaScript Conventions

### File Organization

```
assets/js/
  ├── index.js              ← Entry point, global init
  ├── utils.js              ← Helper functions
  ├── toc.js                ← TOC expand/collapse logic
  ├── mobile-menu.js        ← Mobile menu toggling
  ├── expand-collapse.js    ← Generic accordion logic
  ├── search.js             ← Search filtering
  └── polyfills.js          ← Browser compatibility
```

### Naming Conventions

```javascript
// Constants: UPPERCASE_WITH_UNDERSCORES
const MAX_ITEMS_PER_PAGE = 20;
const CSS_CLASS_ACTIVE = 'is-active';

// Functions: camelCase, verb-first
function initTOC() { }
function toggleMenu() { }
function formatDate(date) { }

// DOM references: element or el prefix
const headerEl = document.querySelector('.site-header');
const menuEl = document.querySelector('.main-nav');

// Event handlers: handle + action
function handleMenuToggle() { }
function handleSearchInput(event) { }

// Objects: camelCase
const config = {
  selectorTOC: '.toc',
  clasToggle: 'is-expanded'
};
```

### Code Structure

```javascript
// Initialize immediately (IIFE pattern for encapsulation)
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    selector: '.toc',
    class: 'is-active'
  };
  
  // Helper functions
  function queryAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }
  
  // Main logic
  function init() {
    const items = queryAll(CONFIG.selector);
    items.forEach(bindClickHandler);
  }
  
  // Event handler
  function bindClickHandler(item) {
    item.addEventListener('click', handleToggle);
  }
  
  function handleToggle(event) {
    event.preventDefault();
    event.target.classList.toggle(CONFIG.class);
  }
  
  // Initialize on DOM ready
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
```

### Progressive Enhancement

Ensure functionality degrades gracefully without JS:

```javascript
// ✅ Safe: Works without JS
// HTML: <div id="faq-1" hidden>Answer</div>
// JS: Show/hide with toggle
// Without JS: Content is hidden but discoverable in source

// ❌ Unsafe: Completely broken without JS
// HTML: <div id="faq-1">Answer</div> (visible always)
// JS: Expected to handle visibility (fails silently)
```

### DOM Queries

Use efficient selectors:

```javascript
// ✅ Specific, performant
const item = document.querySelector('[data-id="123"]');
const items = document.querySelectorAll('.card');

// ⚠️ Less efficient (but acceptable for small lists)
const item = document.querySelector('#item-123');

// ❌ Avoid: Inefficient queries
const item = document.querySelector('div'); // Too broad!
```

### Event Delegation

For dynamic content, use event delegation:

```javascript
// ✅ Event delegation (handles dynamic elements)
document.addEventListener('click', function(event) {
  if (event.target.matches('.faq-question')) {
    toggleFAQ(event.target);
  }
});

// ❌ Direct binding (fails for dynamically added elements)
document.querySelectorAll('.faq-question').forEach(item => {
  item.addEventListener('click', toggleFAQ); // Won't work for new items!
});
```

---

## File Naming

### CSS Files
- `main.css` — Primary stylesheet (all-in-one deployment)
- `variables.css` — Reference (not deployed)
- `components.css` — Reference (not deployed)

**Format:** lowercase, hyphen-separated
```
✅ main.css, components.css, variables.css
❌ Main.css, componentStyles.css, vars.css
```

### JavaScript Files
- `index.js` — Entry point / global initialization
- `[component-name].js` — Single responsibility
- `utils.js` — Shared utility functions

**Format:** lowercase, hyphen-separated
```
✅ toc.js, mobile-menu.js, expand-collapse.js
❌ TOC.js, mobileMenu.js, expandCollapse.js
```

### HTML Component Files
- `[component-name].html` — Single component pattern

**Format:** lowercase, hyphen-separated
```
✅ card-topic.html, faq-block.html, affiliate-block.html
❌ CardTopic.html, faqBlock.html, AFFILIATE_BLOCK.html
```

---

## Code Comments

### When to Comment

```css
/* ✅ Useful: Explains "why", not "what" */
.hero {
  background: linear-gradient(...);
  /* Gradient darkens text for readability on light backgrounds */
}

/* ❌ Obvious: Explains "what" (code is clear) */
.hero {
  background: #171717; /* Set background color */
}
```

### Comment Format

```css
/* Single line comment for brief notes */

/* 
  Multi-line comment for detailed explanation
  Break into multiple lines for clarity
  Use consistent formatting
*/

/* Section headers for grouping */
/* ============================================================================
   TYPOGRAPHY
   ============================================================================ */
```

---

## Validation & Tools

### CSS Validation
- Focus on correctness, not perfection
- Minify before deployment
- Test at multiple viewports

### HTML Validation
- Use semantic HTML5
- Validate with W3C validator
- Check for accessibility issues

### JavaScript Validation
- Use `'use strict'` in modules
- No console errors in production
- Test keyboard interactions

---

## Summary Checklist

Before committing code:

**CSS:**
- [ ] Uses custom properties (no hardcoded colors)
- [ ] Classes follow BEM or utility naming
- [ ] Mobile-first responsive design
- [ ] No unused styles
- [ ] Valid syntax

**HTML:**
- [ ] Uses semantic elements
- [ ] ARIA attributes where necessary
- [ ] Classes exist in CSS
- [ ] Accessibility considerations
- [ ] Valid HTML5 syntax

**JavaScript:**
- [ ] Progressive enhancement (works without JS)
- [ ] No external dependencies
- [ ] Event delegation for dynamic content
- [ ] No console errors
- [ ] Minifiable (test with uglify)

---

**Last Updated:** 2026-03-24  
**Version:** 1.0 (Stable)
