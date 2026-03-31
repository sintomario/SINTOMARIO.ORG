# INTEGRATION GUIDE | Carril A Frontend → Carril B Motor

This directory contains all documentation needed to seamlessly merge the decoupled frontend layer with SINTOMARIO.ORG motor output.

---

## Quick Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[MAPPING.md](MAPPING.md)** | How CSS tokens map to HTML classes; design system reference | Product Owner, Designers, Frontend Dev |
| **[HOOKS.md](HOOKS.md)** | Where motor injects HTML; integration points identified | Frontend Dev, Motor Engineer |
| **[CHECKLIST.md](CHECKLIST.md)** | Step-by-step validation before deploying to production | QA Engineer, Integration Lead |

---

## The Two-Track Strategy

### Carril A: Decoupled Frontend (You Are Here)
**Location:** `frontend-layer/` (independent design workspace)

**Maintains:**
- CSS modular architecture (`assets/css/`)
- Component specifications (`components-spec/`)
- Integration documentation (`integration/`)
- Design tokens and tokens (docs/)

**Does NOT depend on:**
- Motor code
- Corpus data
- Build pipeline
- Python environment

**Output:** Portable folder ready to copy to production.

---

### Carril B: Motor Sanitization & Integration
**Location:** `SINTOMARIO.ORG/` (live project)

**Currently completed:**
- ✅ Refactored `sintomario_motor.py` to use external CSS
- ✅ All pages now reference `<link rel="stylesheet" href="/assets/css/main.css">`
- ✅ Inline CSS removed; no more motor rebuilds for style changes

**Ongoing:**
- UTF-8 validation
- Template stabilization
- Asset structure preparation

---

## Integration Timeline

### Phase 1: Decoupling (Carril B) ✅ DONE
Motor refactored to use external CSS. Motor output is now CSS-agnostic.

**Result:** `<link rel="stylesheet" href="/assets/css/main.css">`

---

### Phase 2: Design & Modularization (Carril A) 🔄 IN PROGRESS
Build comprehensive CSS + components architecture here, independently.

**Deliverables:**
- [ ] Main CSS modules (typography, components, layout, utilities)
- [ ] Component specs (header, footer, breadcrumbs, TOC, FAQ, affiliate, etc.)
- [ ] Template guides (hub layout, article layout, search layout)
- [ ] Design tokens documentation
- [ ] Accessibility checklist

**Current status:**
- ✅ Base CSS with design tokens
- ✅ All original styles converted to modular architecture
- 🔄 Component specs being developed
- 🔄 Template guides being prepared

---

### Phase 3: Integration Assembly (Carril B) ⏳ PENDING
Copy frontend-layer/ to SINTOMARIO.ORG and validate every page.

**Checklist:** See [CHECKLIST.md](CHECKLIST.md)

---

### Phase 4: Deployment & Monitoring
Go live, monitor, iterate.

---

## How to Use This Guide

### I'm a Product Owner / Designer
1. Go to [MAPPING.md](MAPPING.md)
2. Review design tokens (colors, spacing, typography)
3. Approve visual direction and component specifications

### I'm a Frontend Developer (Carril A)
1. Read [HOOKS.md](HOOKS.md) to understand motor output structure
2. Review [MAPPING.md](MAPPING.md) for class names and token usage
3. Build components in `../components-spec/` using these classes
4. Add CSS modules to `../assets/css/` as needed
5. Update docs/ with new component documentation

### I'm an Integration Engineer (Carril B)
1. Read [MAPPING.md](MAPPING.md) first (understand CSS expectations)
2. When ready to integrate, follow [CHECKLIST.md](CHECKLIST.md) step by step
3. Refer to [HOOKS.md](HOOKS.md) if you need to understand where specific HTML should go
4. Sign off in CHECKLIST.md when complete

---

## Key Concepts

### Design Tokens
All sizes, colors, fonts are defined as CSS custom properties (variables) in `assets/css/main.css`:

```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-accent: #c9a961;
  --space-xl: 24px;
  --font-serif: Georgia, serif;
}
```

**Why:** Consistency, easy updates, one source of truth.

### CSS Architecture
```
assets/css/
  ├── main.css          ← Single deployed file (all modules combined)
  ├── normalize.css     ← (reference; parts merged into main.css)
  ├── variables.css     ← (reference; parts merged into main.css)
  ├── typography.css    ← (reference; parts merged into main.css)
  └── components.css    ← (reference; parts merged into main.css)
```

**For deployment:** Only `main.css` is needed. It's self-contained, no @imports.

### Motor Integration Points
Motor generates clean HTML with predictable classes. Carril A CSS targets those classes.

**Example:**
```html
<!-- Motor generates: -->
<section class="hero">
  <h1>Title</h1>
</section>

<!-- Carril A CSS styles: -->
.hero {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: var(--space-xl);
}

h1 {
  font-size: clamp(2.4rem, 6vw, 4.1rem);
  color: var(--color-text-heading);
}
```

---

## File Placement

### Source (Carril A - This Folder)
```
frontend-layer/
  ├── assets/css/main.css              ← CSS source
  ├── assets/js/                       ← JS components
  ├── assets/icons/                    ← SVG assets
  ├── components-spec/                 ← HTML patterns
  ├── templates-guides/                ← Layout templates
  ├── integration/                     ← YOU ARE HERE
  ├── docs/                            ← Design system docs
  └── README.md                        ← Project overview
```

### Destination (Carril B - Production)
```
SINTOMARIO.ORG/
  └── publish/
      ├── assets/
      │   ├── css/
      │   │   └── main.css             ← Copied from Carril A
      │   ├── js/                      ← Copied from Carril A
      │   └── icons/                   ← Copied from Carril A
      ├── index.html                   ← Motor output (unchanged)
      ├── cuerpo/
      └── ... (all motor-generated HTML)
```

---

## Validation Workflow

Before integration, ensure:

1. **CSS Validation**
   - [ ] main.css is valid CSS
   - [ ] All custom properties (--var) are defined
   - [ ] No unused CSS
   - [ ] Minified size < 50KB

2. **Component Specs**
   - [ ] All HTML in `components-spec/` is valid
   - [ ] All classes map to CSS rules
   - [ ] All components are documented

3. **Design System**
   - [ ] Design tokens documented in `docs/DESIGN_TOKENS.md`
   - [ ] Accessibility guidelines in `docs/ACCESSIBILITY.md`
   - [ ] Typography scale defined

4. **Integration Points**
   - [ ] [HOOKS.md](HOOKS.md) maps all motor classes
   - [ ] [MAPPING.md](MAPPING.md) documents CSS token usage
   - [ ] No breaking changes to motor output expected

---

## Common Integration Issues

### Issue: Links are not styled
**Check:** Is `a { color: var(--color-link); }` in main.css?  
**Fix:** Verify CSS loaded by checking DevTools Network tab.

### Issue: Text color looks wrong
**Check:** Are custom properties (`--color-text-primary`, etc.) defined?  
**Fix:** Check `:root` section in main.css for all color tokens.

### Issue: Cards don't have rounded corners
**Check:** Does motor output have `class="card"` on elements?  
**Fix:** Verify `.card { border-radius: var(--size-border-radius); }` in CSS.

### Issue: Mobile layout breaks
**Check:** Are media queries set at `@media (max-width: 768px)`?  
**Fix:** Test responsive at 320px, 768px, 1200px viewports.

### Issue: "File not found" for assets
**Check:** Is `/assets/css/main.css` accessible from browser?  
**Fix:** Verify file is at correct path in production; check relative URLs.

---

## Escalation Path

If integration blocks or issues arise:

1. **CSS/Design Issue** → Refer to [MAPPING.md](MAPPING.md); contact Carril A lead
2. **Motor Output Issue** → Refer to [HOOKS.md](HOOKS.md); contact Carril B engineer
3. **Integration Error** → Follow [CHECKLIST.md](CHECKLIST.md); document findings
4. **Rollback Needed** → See CHECKLIST.md Phase 9 (Rollback Procedure)

---

## Success Criteria

Integration is **complete and successful** when:

✅ All pages load without CSS errors  
✅ Mobile (320px) and desktop (1200px+) layouts render correctly  
✅ All interactive components (menu, TOC, FAQ) work as intended  
✅ Accessibility standards met (WCAG AA)  
✅ Performance baseline met (LCP < 2.5s)  
✅ SEO metadata intact and valid  
✅ Team sign-off on visual quality  

---

## Next Steps

**For Carril A (Frontend Dev):**
1. Complete component specs in `../components-spec/`
2. Add JavaScript for interactive components in `../assets/js/`
3. Create template guides in `../templates-guides/`
4. Update design documentation in `../docs/`

**For Carril B (Motor Engineer):**
1. Validate motor outputs HTML with `.wrap`, `.hero`, etc. classes
2. Prepare asset folder structure in production
3. Schedule integration window
4. Review CHECKLIST.md before executing integration

**For Both:**
1. Weekly sync to align on integration blockers
2. Test on staging before production deployment
3. Maintain this documentation as changes occur

---

**Project Status:** 🟡 IN PROGRESS  
**Last Updated:** 2026-03-24  
**Maintainer:** Frontend Architecture Team (Carril A)
