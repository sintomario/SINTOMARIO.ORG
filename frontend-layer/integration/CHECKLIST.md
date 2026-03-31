# INTEGRATION CHECKLIST | Carril A → Carril B

**Purpose:** Validación paso a paso cuando `frontend-layer/` se copie a `SINTOMARIO.ORG/publish/assets/`

---

## PHASE 1: Pre-Integration Validation

- [ ] **Architecture check:** Confirm `sintomario_motor.py` has been refactored to use `<link rel="stylesheet" href="/assets/css/main.css">`
- [ ] **Directory structure:** Verify `/publish/assets/css/` exists and is writable
- [ ] **Encoding:** All files are UTF-8, no BOM
- [ ] **Backup:** Copy `/publish/` to `/publish.backup/` before proceeding
- [ ] **Motor state:** Last build was clean, all pages generated

---

## PHASE 2: File Placement

### Copy CSS Assets
```
From: frontend-layer/assets/css/
To:   SINTOMARIO.ORG/publish/assets/css/

Files to copy:
  ✓ main.css
  ✓ components.css (if exists)
  ✓ utilities.css (if exists)
  ✓ [any future modular CSS]
```

**Action:**
```bash
cp frontend-layer/assets/css/* SINTOMARIO.ORG/publish/assets/css/
```

### Copy JS Assets (if any)
```
From: frontend-layer/assets/js/
To:   SINTOMARIO.ORG/publish/assets/js/

Files to copy:
  ✓ index.js
  ✓ toc.js
  ✓ mobile-menu.js
  ✓ [utilities, polyfills]
```

**Action:**
```bash
cp frontend-layer/assets/js/* SINTOMARIO.ORG/publish/assets/js/
```

### Copy Icon Assets (if any)
```
From: frontend-layer/assets/icons/
To:   SINTOMARIO.ORG/publish/assets/icons/

Files to copy:
  ✓ svg/ folder (all SVG icons)
  ✓ sprite.svg (if generated)
```

**Action:**
```bash
cp -r frontend-layer/assets/icons/* SINTOMARIO.ORG/publish/assets/icons/
```

---

## PHASE 3: HTML Verification

### Check Motor Output
After integration, **do NOT rebuild the motor yet**. Instead:

1. **Open a published page** in browser:
   ```
   file:///path/SINTOMARIO.ORG/publish/index.html
   ```

2. **Open DevTools** (F12) → **Network** tab

3. **Verify CSS loads:**
   - [ ] `main.css` appears in Network tab
   - [ ] Status is 200 (or 304 cached)
   - [ ] No 404 errors for CSS
   - [ ] CSS file size > 0 (not empty)

4. **Visual check:**
   - [ ] Background is dark (#0a0a0a)
   - [ ] Text is light (#efe8d8)
   - [ ] Headings show accent color (#c9a961)
   - [ ] Cards have borders and rounded corners
   - [ ] Links are styled (not default blue)
   - [ ] Mobile view (375px) is readable

### Test Key Pages
For each page type, verify rendering:

- [ ] **Home:** `/index.html`
- [ ] **Hub (Entity):** `/cuerpo/[entity-id]/index.html`
- [ ] **Hub (Context):** `/cuerpo/contextos/[context-id]/index.html`
- [ ] **Static:** `/sobre/index.html`
- [ ] **404:** `/404.html` (if accessible)
- [ ] **Admin:** `/admin/index.html` (if needed)

---

## PHASE 4: Responsive & Cross-Browser

### Mobile Test (320px – 480px)
- [ ] Text is readable (no horizontal scroll)
- [ ] Headings scale properly (using `clamp()`)
- [ ] Padding/margins adjust correctly
- [ ] Grid items stack to single column
- [ ] Links have adequate tap targets (≥44px min height)
- [ ] `hide-mobile` class elements don't display

### Tablet Test (768px – 1024px)
- [ ] Layout is clean (grid uses 2–3 columns appropriately)
- [ ] Sidebars (if any) display correctly
- [ ] Hero sections look good
- [ ] Images/cards proportional

### Desktop Test (≥1200px)
- [ ] Max-width 980px container respected
- [ ] Content doesn't stretch edge-to-edge
- [ ] Sidebars positioned correctly
- [ ] Grid shows full 3+ columns

### Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

---

## PHASE 5: Accessibility & A11y

### Color Contrast
- [ ] Body text (#efe8d8) on background (#0a0a0a) ≥ 4.5:1 ratio
- [ ] Links (#d6ba7c) on background (#0a0a0a) ≥ 4.5:1 ratio
- [ ] Muted text (#b7ae9a) on background ≥ 3:1 ratio
- [ ] Accent (#c9a961) text readable

**Tool:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Keyboard Navigation
- [ ] Tab key cycles through interactive elements
- [ ] Focus indicators visible (outline or border)
- [ ] Links and buttons are keyboard-accessible
- [ ] No keyboard traps

### Screen Reader Test (if possible)
- [ ] Headings announce correctly (h1, h2, h3 hierarchy)
- [ ] Links have meaningful text (not "click here")
- [ ] Images have alt text (if any)
- [ ] Lists announce as lists

---

## PHASE 6: Performance & Load

### CSS Load
- [ ] `main.css` loads before render-blocking scripts
- [ ] File size is reasonable (ideally < 50KB minified)
- [ ] No @import chains (inline all CSS)
- [ ] No missing fonts or external resources

### Page Load Times
- [ ] Homepage loads < 2s on 3G (if possible to test)
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

**Tool:** Use [PageSpeed Insights](https://pagespeed.web.dev/) or Chrome DevTools Lighthouse

### CSS Minification
- [ ] Minified main.css deployed (no whitespace)
- [ ] Gzip enabled on server (if applicable)
- [ ] No unused CSS shipped

---

## PHASE 7: SEO & Meta

### HTML Structure
- [ ] `<title>` tags present and descriptive
- [ ] `<meta name="description">` present
- [ ] `<meta name="viewport">` set correctly
- [ ] `<meta charset="utf-8">` declared
- [ ] Canonical tags (if applicable)

### Semantic HTML
- [ ] `<h1>` used once per page
- [ ] Heading hierarchy respected (H1 → H2 → H3)
- [ ] `<nav>`, `<main>`, `<article>`, `<aside>` used appropriately
- [ ] `<header>` and `<footer>` structurally sound

### Schema Markup
- [ ] Schema.org JSON-LD in `<head>` (if generated by motor)
- [ ] No validation errors in [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## PHASE 8: Visual QA

### Layout Consistency
- [ ] All cards use same border radius (18px)
- [ ] Padding/margins consistent (.wrap, .card, .product)
- [ ] Color scheme adhered to (no random colors)
- [ ] Typography hierarchy respected

### Hero Sections
- [ ] Gradient or background displays correctly
- [ ] Text is readable over background
- [ ] Eyebrow badges show golden accent color
- [ ] Title sizes scale appropriately

### Cards & Components
- [ ] Cards have border, padding, rounded corners
- [ ] Hover states work (border/color changes)
- [ ] Links are underlined or styled distinctly
- [ ] Badges display uppercase, monospace

### Grid Layouts
- [ ] Cards align to grid properly
- [ ] Gaps are consistent (16px between cards)
- [ ] Responsive columns adjust at breakpoints (768px)

---

## PHASE 9: Functional Testing

### Links
- [ ] Internal links point to correct URLs
- [ ] No broken links (404s) within site
- [ ] External links (if any) open in new tab (`target="_blank"`)
- [ ] Affiliate links have proper disclaimers visible

### Forms (if any)
- [ ] Search input responds to keyboard
- [ ] Submit buttons are accessible
- [ ] Error messages are clear
- [ ] Success states are obvious

### JavaScript (if integrated)
- [ ] TOC expand/collapse works smoothly
- [ ] Mobile menu toggles on/off
- [ ] Search functionality responds
- [ ] No console errors logged

---

## PHASE 10: Final Sign-Off

### Stakeholder Review
- [ ] Visual designer approves layout
- [ ] Product owner validates UX
- [ ] Legal/compliance reviews disclaimers
- [ ] SEO specialist validates metadata

### Build Verification
- [ ] Full motor rebuild successful (no errors)
- [ ] All output pages generated (check file count)
- [ ] No encoding issues (UTF-8 valid)
- [ ] Deploy simulation successful (if applicable)

---

## Rollback Procedure

If issues are found, **do not panic**. Rollback is simple:

```bash
# Restore backup
rm -rf SINTOMARIO.ORG/publish
cp -r SINTOMARIO.ORG/publish.backup SINTOMARIO.ORG/publish

# Or manually restore CSS:
cp SINTOMARIO.ORG/publish.backup/assets/css/* SINTOMARIO.ORG/publish/assets/css/
```

Document the issue and report back to Carril A for fixes.

---

## Sign-Off Template

```
✅ INTEGRATION COMPLETE

Date: [YYYY-MM-DD]
Integrated by: [Name]
CSS Version: [version from MAPPING.md]
Pages Tested: [count]
Issues Found: [count]
Status: ✅ READY FOR PRODUCTION / 🔴 BLOCKED

Notes:
[Any findings or observations]

Next Steps:
[ ] Deploy to staging
[ ] Deploy to production
[ ] Monitor for issues
```

---

**Last Updated:** 2026-03-24  
**Responsible:** Carril B Integration Engineer  
**Escalation:** If integration fails, check MAPPING.md for CSS class expectations
