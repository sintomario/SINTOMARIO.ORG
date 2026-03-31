# MOBILE-FIRST STRATEGY | Responsive Design Approach

Build for small screens first, then enhance for larger devices.

---

## Philosophy

**Why Mobile-First?**
- ~60% of web traffic is mobile
- Constraints on mobile force clarity and focus
- Easier to enhance for desktop than reduce for mobile
- Better performance on constrained devices

**Our Promise:**
- Fully functional at 320px (smallest phones)
- Optimal experience at 768px (tablets)
- Enhanced at 1200px+ (desktops)

---

## Breakpoint Strategy

### Three Breakpoints
```css
/* Default: Mobile (320px+) */
/* No media query needed; mobile CSS is default */

/* Tablet: 768px+ */
@media (min-width: 768px) {
  /* Enhance for tablet */
}

/* Desktop: 1200px+ */
@media (min-width: 1200px) {
  /* Enhance for large screens */
}
```

### Why These Numbers?
- **320px:** iPhone SE, smallest modern phone
- **768px:** iPad portrait, tablet size
- **1200px:** Laptop/desktop minimum

---

## Designing Each Breakpoint

### Mobile (320px)

**Constraints:**
- Full-width content (less padding)
- Single column layout
- Larger touch targets (44px)
- Simplified navigation
- Readable without pinch-zoom

**CSS:**
```css
body, .wrap {
  padding: var(--space-lg);  /* 16px */
}

.grid-3 {
  grid-template-columns: 1fr;  /* Single column */
  gap: var(--space-lg);
}

button {
  min-height: 44px;  /* Touch-friendly */
  padding: 12px 16px;
}

h1 {
  font-size: 2rem;  /* Readable but fits screen */
}

.menu {
  display: none;  /* Hidden by default */
}

.menu-toggle {
  display: block;  /* Visible for mobile */
}
```

### Tablet (768px)

**Enhancements:**
- Two-column layouts possible
- Wider spacing allowed
- More complex navigation can show
- Images and cards can be larger

**CSS:**
```css
@media (min-width: 768px) {
  body, .wrap {
    padding: var(--space-xl);  /* 24px */
  }

  .grid-3 {
    grid-template-columns: repeat(2, 1fr);  /* Two columns */
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .menu {
    display: flex;  /* Show navigation */
  }

  .menu-toggle {
    display: none;  /* Hide hamburger */
  }

  h1 {
    font-size: 2.8rem;  /* Bigger, more space */
  }
}
```

### Desktop (1200px+)

**Full Experience:**
- Three-column layouts
- Sidebars and complex layouts
- Full navigation and menus
- Generous whitespace
- Optimized for comfortable reading

**CSS:**
```css
@media (min-width: 1200px) {
  .wrap {
    max-width: 980px;  /* Center content */
    padding: var(--space-xl) var(--space-2xl);  /* More horizontal space */
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);  /* Three columns */
  }

  main {
    display: grid;
    grid-template-columns: 1fr 280px;  /* Main + sidebar */
    gap: var(--space-2xl);
  }

  .sidebar {
    position: sticky;
    top: var(--space-xl);  /* Sticky TOC */
  }

  h1 {
    font-size: 3.2rem;  /* Large and comfortable */
  }
}
```

---

## Responsive Patterns

### Text Scaling (clamp)

Use `clamp()` for fluid text sizing:

```css
h1 {
  /* Scales smoothly between 2.4rem and 4.1rem */
  font-size: clamp(2.4rem, 6vw, 4.1rem);
  /* 
    - Minimum: 2.4rem (if viewport < ~400px)
    - Preferred: 6% of viewport width (scales smoothly)
    - Maximum: 4.1rem (if viewport > ~700px)
  */
}

h2 {
  font-size: clamp(1.4rem, 4vw, 2rem);
}

p {
  font-size: 1rem;  /* Fixed: readable on all sizes */
}
```

**Why clamp() is better:**
- ✅ Smooth scaling (no sudden jumps)
- ✅ Accessible (respects user zoom preferences)
- ✅ Fewer breakpoints needed

### Responsive Padding

Use `clamp()` or adjust per breakpoint:

```css
/* Default: Mobile padding */
.card {
  padding: var(--space-lg);  /* 16px */
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    padding: var(--space-xl);  /* 24px */
  }
}

/* Desktop */
@media (min-width: 1200px) {
  .card {
    padding: var(--space-xl) var(--space-2xl);  /* 24px top/bottom, 32px left/right */
  }
}
```

### Responsive Grid

```css
/* Mobile: 1 column */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1200px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* OR: Use auto-fit (responsive without breakpoints) */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-lg);
}
```

### Mobile Menu (Show/Hide)

```css
/* Mobile: Menu hidden by default */
.menu {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.menu.is-open {
  display: flex;
  flex-direction: column;
}

.menu-toggle {
  display: block;
  background: none;
  border: none;
  padding: var(--space-md);
}

/* Tablet+: Menu always visible, toggle hidden */
@media (min-width: 768px) {
  .menu {
    display: flex;
    position: static;
    background: transparent;
    border: none;
    flex-direction: row;
  }

  .menu-toggle {
    display: none;
  }
}
```

---

## Common Mobile Issues & Fixes

### Issue: Text too small to read
```css
/* ❌ Wrong */
body { font-size: 12px; }

/* ✅ Correct */
body { font-size: 1rem; }  /* ~16px */
```

### Issue: Links too small to tap
```css
/* ❌ Wrong */
button { padding: 4px 8px; }  /* ~20px high */

/* ✅ Correct */
button { min-height: 44px; padding: 12px 16px; }
```

### Issue: Content wider than screen
```css
/* ❌ Wrong */
.container { width: 1200px; }  /* Always 1200px wide! */

/* ✅ Correct */
.wrap {
  max-width: 980px;
  padding: var(--space-lg);
  margin: 0 auto;
}
```

### Issue: Horizontal scrolling
```css
/* ❌ Wrong */
table { width: 100%; }  /* Overflows on mobile */

/* ✅ Correct */
@media (max-width: 768px) {
  table { font-size: 0.9rem; overflow-x: auto; }
}
```

### Issue: Images too large/too small
```css
/* ✅ Responsive images */
img {
  max-width: 100%;
  height: auto;  /* Maintains aspect ratio */
  display: block;  /* Removes inline space */
}

/* Larger screens: limit max size */
@media (min-width: 1200px) {
  img { max-width: 600px; }
}
```

---

## Testing Mobile Responsiveness

### Browser DevTools
1. Open DevTools (F12)
2. Click device toggle (⌘+Shift+M on Mac, Ctrl+Shift+M on Windows)
3. Select device or custom size
4. Test interactions

### Key Viewports to Test
- **360px** (common Android)
- **375px** (iPhone 6-12)
- **768px** (iPad)
- **1024px** (iPad Pro)
- **1280px** (Desktop)

### Interaction Testing
- [ ] Text readable at 100% zoom
- [ ] Links/buttons clickable (44px minimum)
- [ ] No horizontal scrolling
- [ ] Touch menu works
- [ ] Forms fillable
- [ ] Images load and scale
- [ ] Navigation clear

### Performance Testing
- [ ] Loads in < 2s on 3G (if testable)
- [ ] Smooth scrolling (60fps)
- [ ] No layout shift when images load
- [ ] Buttons respond immediately to tap

---

## Accessibility + Mobile

### Touch Target Size
```css
/* Mobile: 44px minimum */
@media (max-width: 768px) {
  button, a.btn {
    min-width: 44px;
    min-height: 44px;
  }
}
```

### Font Size for Mobile
```css
/* Mobile: Larger text for readability */
@media (max-width: 768px) {
  body { font-size: 1.1rem; }
  h1 { font-size: 2rem; }
  h2 { font-size: 1.4rem; }
}
```

### Spacing for Interaction
```css
/* Mobile: More space between tappable items */
@media (max-width: 768px) {
  .nav a {
    display: block;
    padding: 12px;
    margin: 4px 0;
  }
}
```

---

## Performance Optimization

### Mobile Performance Tips

1. **Minimize CSS**
   - Remove unused styles
   - Combine selectors
   - Minify before deployment

2. **Optimize Images**
   - Use appropriate format (WebP, JPEG, PNG)
   - Resize for viewport size
   - Consider lazy loading

3. **Prioritize CSS**
   - Load critical CSS inline
   - Defer non-critical CSS
   - Avoid blocking render

4. **JavaScript**
   - Minimize JavaScript
   - Defer non-critical JS
   - Test performance impact

---

## Checklist: Before Deployment

- [ ] Tested at 320px (mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1200px (desktop)
- [ ] No horizontal scrolling on any viewport
- [ ] Touch targets are 44px+ on mobile
- [ ] Text is readable at 100% zoom
- [ ] Images scale responsively
- [ ] Forms are usable on mobile
- [ ] Navigation is clear on all sizes
- [ ] Performance is acceptable (< 2s on 3G if possible)
- [ ] Tested on real mobile device (if possible)

---

## Tools & Resources

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) — Built-in testing
- [Responsively App](https://responsively.app/) — Multi-device testing
- [BrowserStack](https://www.browserstack.com/) — Real device testing
- [Google PageSpeed Insights](https://pagespeed.web.dev/) — Performance testing
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design) — Learning resource

---

**Last Updated:** 2026-03-24  
**Version:** 1.0  
**Status:** Ready for development
