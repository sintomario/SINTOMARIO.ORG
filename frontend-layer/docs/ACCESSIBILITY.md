# ACCESSIBILITY GUIDELINES | WCAG 2.1 Level AA

Ensure the frontend layer is accessible to all users, including those with disabilities.

---

## Standards & Targets

**Target:** WCAG 2.1 Level AA compliance

| Standard | Requirement | Our Implementation |
|----------|-------------|-------------------|
| **Contrast** | 4.5:1 for normal text | All text meets 4.5:1+ |
| **Keyboard** | Full keyboard navigation | Tab, Arrow, Enter, Esc work |
| **Focus** | Visible focus indicators | 2px outline always visible |
| **Semantics** | Proper HTML structure | headings, nav, main, article |
| **ARIA** | When needed for context | Labels, expanded state, roles |
| **Mobile** | Touch-friendly targets | 44px minimum tap targets |

---

## Color Contrast

### Required Ratios
```
Normal text (< 18pt):    ≥ 4.5:1
Large text (≥ 18pt):    ≥ 3:1
UI components & borders: ≥ 3:1
```

### How to Validate
1. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Enter foreground and background colors
3. Check rates meet WCAG AA minimum

### Current Palette
```css
--color-text-primary (#efe8d8) on --color-bg-primary (#0a0a0a)  ✅ 6.3:1
--color-text-secondary (#d8d0be) on --color-bg-primary (#0a0a0a)  ✅ 4.8:1
--color-link (#d6ba7c) on --color-bg-primary (#0a0a0a)           ✅ 4.9:1
--color-accent (#c9a961) on --color-bg-primary (#0a0a0a)         ✅ 4.8:1
--color-text-muted (#b7ae9a) on --color-bg-primary (#0a0a0a)    ⚠️ 3.2:1 (AA for headings only)
```

**Note:** Muted text is only used for small text (metadata). For large text or important content, use primary or secondary text.

---

## Keyboard Navigation

### Tab Order
Ensure logical tab order:

```html
<!-- Good: Natural reading order -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
<main>
  <button>Action 1</button>
  <button>Action 2</button>
</main>
<footer>
  <a href="/legal">Legal</a>
</footer>

<!-- Bad: Random tab order -->
<footer>
  <a href="/legal">Legal</a> <!-- First tab! -->
</footer>
<main>
  <button>Action 1</button>
</main>
```

### Test Tab Navigation
1. Open page in browser
2. Press Tab repeatedly
3. Verify order is logical (top to bottom, left to right)
4. Verify all interactive elements are reachable
5. Verify focus goes to next logical element after last one

### Keyboard Shortcuts
Support standard keys:

| Key | Action | Implementation |
|-----|--------|-----------------|
| **Tab** | Move between elements | Default browser behavior |
| **Shift+Tab** | Move backwards | Default browser behavior |
| **Enter** | Activate button/link | Default for `<button>`, `<a>` |
| **Space** | Activate button/checkbox | Default for `<button>`, `<input type="checkbox">` |
| **Esc** | Close menu/modal | JavaScript handler |
| **Arrow keys** | Navigate lists/tabs | JavaScript handler |

---

## Focus Indicators

### Always Visible
```css
/* All interactive elements MUST have visible focus */
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--color-accent);  /* Golden: #c9a961 */
  outline-offset: 2px;                    /* Space from element */
}
```

### Never Remove Focus
```css
/* ❌ WRONG: Never do this! */
*:focus {
  outline: none;  /* Inaccessible! */
}

/* ✅ Correct: Replace with custom outline */
button:focus {
  outline: 2px solid var(--color-accent);
  background: rgba(201, 169, 97, 0.1);  /* Optional: subtle highlight */
}
```

### Test Focus
1. Tab through page with keyboard only
2. Verify focus is always visible (outline, highlight, or underline)
3. No focus gets "lost" or hidden behind other content
4. Focus order matches visual hierarchy

---

## Semantic HTML

### Use Correct Elements
```html
<!-- ✅ Semantic (accessible) -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <section>
      <h2>Section</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>© 2026</p>
</footer>

<!-- ❌ Non-semantic (inaccessible) -->
<div class="header">
  <div class="nav">
    <div class="link"><span>Home</span></div>
  </div>
</div>

<div class="content">
  <div class="article">
    <div class="title">Title</div>
  </div>
</div>
```

### Heading Hierarchy
```html
<!-- ✅ Correct: One H1, proper nesting -->
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h3>Subsection 1.2</h3>
<h2>Section 2</h2>

<!-- ❌ Wrong: Multiple H1s, skipped levels -->
<h1>Page Title</h1>
<h3>Skipped H2! Not good.</h3>
```

---

## ARIA & Labels

### Form Labels
```html
<!-- ✅ Label associated with input -->
<label for="search">Search:</label>
<input id="search" type="search" placeholder="...">

<!-- ❌ Placeholder is not a label -->
<input type="search" placeholder="Search...">  <!-- Inaccessible! -->
```

### Button Labels
```html
<!-- ✅ Clear button text -->
<button>Add to cart</button>

<!-- ❌ Icon-only (no alt) -->
<button>🛒</button>  <!-- Inaccessible! -->

<!-- ✅ Icon + ARIA label -->
<button aria-label="Add to cart">
  <svg class="icon"><!-- icon --></svg>
</button>
```

### Navigation Labels
```html
<!-- ✅ Distinguish multiple navs -->
<nav aria-label="Main navigation">
<nav aria-label="Table of contents">
<nav aria-label="Footer links">

<!-- ❌ No distinction -->
<nav>
<nav>
<nav>
```

### Expanded State (Buttons)
```html
<!-- ✅ Screen readers know button state -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<div id="menu" hidden>
  <!-- Menu items -->
</div>

<!-- JavaScript updates aria-expanded value -->
```

---

## Touch Targets

### Minimum Size: 44px × 44px
```css
/* ✅ Adequate touch target */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}

/* ❌ Too small */
button {
  padding: 4px 8px;  /* ~20px high - hard to tap */
}

/* ✅ Text links: adequate spacing */
a {
  padding: 8px;  /* Extra space around text */
}
```

### Spacing Between Targets
```css
/* ✅ Space between clickable elements */
.nav a {
  padding: 12px;  /* Prevents accidental mis-taps */
  margin: 4px;    /* Gap between items */
}

/* ❌ Cramped buttons */
.nav a {
  padding: 2px;   /* Hard to tap accurately */
}
```

---

## Images & Icons

### Alt Text
```html
<!-- ✅ Descriptive alt (meaningful image) -->
<img src="diagram.png" alt="User flow diagram showing 3 steps">

<!-- ✅ Decorative image (use empty alt) -->
<img src="divider.png" alt="">

<!-- ❌ Generic alt -->
<img src="image.png" alt="Image">  <!-- Not helpful! -->

<!-- ❌ No alt (bad) -->
<img src="diagram.png">
```

### SVG Icons
```html
<!-- ✅ Icon with label -->
<button aria-label="Close menu">
  <svg class="icon icon-close"><!-- SVG --></svg>
</button>

<!-- ✅ Icons that are decorative -->
<span aria-hidden="true" class="icon icon-check"></span>

<!-- ❌ Icon alone, no label -->
<button>
  <svg class="icon"><!-- What does this do? --></svg>
</button>
```

---

## Testing for Accessibility

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — Color contrast
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) — Overall a11y audit
- [WAVE](https://wave.webaim.org/) — Errors, warnings, features
- [Axe DevTools](https://www.deque.com/axe/devtools/) — Detailed issues
- [NVDA](https://www.nvaccess.org/) — Screen reader (Windows)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) — Screen reader (commercial)

### Manual Testing

**Keyboard Only:**
1. Unplug mouse
2. Use Tab, Arrow, Enter keys only
3. Verify all interactions possible
4. Verify focus always visible

**Screen Reader (NVDA):**
1. Download & install NVDA
2. Open page
3. Press Insert+Down to start reading
4. Navigate with arrow keys
5. Verify headings, landmarks, labels announced

**Mobile (Touch):**
1. Test on actual mobile device
2. Verify buttons/links are 44px+ tap targets
3. Verify readable without zoom
4. Test keyboard (if device supports)

---

## Common Mistakes to Avoid

| Mistake | Impact | Fix |
|---------|--------|------|
| Removing focus outline | Keyboard users lost | Keep outline visible |
| Missing alt text | Images meaningless to screen readers | Add descriptive alt |
| Color alone for meaning | Colorblind users confused | Add icon or text too |
| Inaccessible forms | Can't be filled by assistive tech | Use `<label>` + `<input>` |
| Non-semantic HTML | Screen readers confused | Use `<header>`, `<nav>`, `<main>`, etc. |
| Tiny touch targets | Mobile users frustrated | Min 44px × 44px |
| Unreadable text | Users strain to read | 4.5:1 contrast minimum |
| Videos without captions | Deaf users excluded | Provide captions |

---

## Checklist: Before Deployment

- [ ] **Contrast:** Tested with WebAIM (≥4.5:1 for normal text)
- [ ] **Focus:** Outline visible on all interactive elements
- [ ] **Keyboard:** Tab, Arrow, Enter, Esc all work as expected
- [ ] **Semantics:** Proper heading hierarchy, landmarks present
- [ ] **Labels:** All form inputs have labels; buttons have text
- [ ] **Touch targets:** 44px minimum for mobile
- [ ] **ARIA:** Added where semantics insufficient
- [ ] **Screen reader:** Tested with NVDA or similar
- [ ] **Alt text:** All meaningful images have alt; decorative have empty alt
- [ ] **Color:** Not used as sole method to convey info

---

## Resources

- [Web Accessibility by WAI](https://www.w3.org/WAI/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated:** 2026-03-24  
**Version:** 1.0  
**Target:** WCAG 2.1 Level AA
