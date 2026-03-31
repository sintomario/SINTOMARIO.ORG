# FRONTEND-LAYER | Carril A: Decoupled Visual Experience

**Mission:** Design and deliver a portable, modular frontend layer that elevates SINTOMARIO's visual and functional experience without touching the Python motor or core corpus.

**Status:** 🟡 **IN PROGRESS** — Phase 2 (Component Design & CSS Modularization)

---

## Project Structure

```
frontend-layer/
│
├── assets/                          # Deliverable assets (copy to production)
│   ├── css/
│   │   ├── main.css                ← Single CSS file for deployment
│   │   └── [future modular splits]
│   ├── js/
│   │   ├── index.js                ← Global initialization
│   │   ├── toc.js
│   │   ├── mobile-menu.js
│   │   ├── expand-collapse.js
│   │   ├── search.js
│   │   ├── utils.js
│   │   └── polyfills.js
│   └── icons/
│       └── svg/
│           ├── menu.svg
│           ├── search.svg
│           ├── close.svg
│           └── [more as needed]
│
├── components-spec/                 # HTML patterns (reference + integration)
│   ├── header.html
│   ├── footer.html
│   ├── breadcrumbs.html
│   ├── toc.html
│   ├── card-topic.html
│   ├── card-related.html
│   ├── faq-block.html
│   ├── affiliate-block.html
│   ├── search-results.html
│   ├── hero.html
│   └── README.md
│
├── templates-guides/                # Complete page layouts
│   ├── layout-hub.html
│   ├── layout-article.html
│   ├── layout-faq.html
│   ├── layout-search.html
│   └── README.md
│
├── integration/                     # Integration documentation
│   ├── README.md                   ← START HERE
│   ├── MAPPING.md                  ← CSS class → HTML mapping
│   ├── HOOKS.md                    ← Motor integration points
│   └── CHECKLIST.md                ← Deployment validation
│
├── docs/                            # Design system documentation
│   ├── DESIGN_TOKENS.md            ← Color, space, type reference
│   ├── CONVENTIONS.md              ← Code style + naming
│   ├── ACCESSIBILITY.md            ← A11y guidelines
│   └── MOBILE_FIRST.md             ← Responsive strategy
│
└── README.md                        ← YOU ARE HERE
```

---

## Quick Start

### I'm Starting Carril A Development
1. Read [integration/README.md](integration/README.md) first (2 min)
2. Review [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) (5 min)
3. Check [integration/HOOKS.md](integration/HOOKS.md) to see motor output structure (5 min)
4. Start designing components in `components-spec/` using CSS classes from `assets/css/main.css`

### I Need to Integrate This Into SINTOMARIO.ORG
1. Read [integration/README.md](integration/README.md) (overview)
2. Follow [integration/CHECKLIST.md](integration/CHECKLIST.md) step by step
3. Use [integration/MAPPING.md](integration/MAPPING.md) for reference

### I Need to Update CSS
1. Edit `assets/css/main.css` directly (all CSS in one file for deployment)
2. Reference [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) for consistent values
3. Test mobile (320px) and desktop (1200px) responsiveness
4. Validate A11y using [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)

---

## Key Principles

### 1. **No Dependencies**
- ✅ HTML5, CSS3, vanilla JavaScript
- ❌ React, Vue, Tailwind, npm packages, build tools
- **Why:** Simplicity, portability, zero friction integration

### 2. **Progressive Enhancement**
- ✅ Works without JavaScript (degradation OK)
- ✅ CSS is foundational
- ✅ JS adds interactivity (expand/collapse, search, menu toggle)
- **Why:** Resilience, SEO, accessibility

### 3. **Modular Architecture**
- ✅ Components are self-contained
- ✅ CSS classes map 1:1 to motor HTML output
- ✅ Easy to copy, test, deploy
- **Why:** Maintainability, reusability, decoupling

### 4. **Mobile-First**
- ✅ Design for 320px (mobile) first
- ✅ Enhance for tablet (768px) and desktop (1200px)
- ✅ Responsive breakpoints built in
- **Why:** 60%+ traffic is mobile; desktop is easier to enhance

### 5. **Accessibility by Default**
- ✅ WCAG AA contrast ratios met
- ✅ Semantic HTML (h1, nav, main, aside, article)
- ✅ Keyboard navigation supported
- ✅ Focus indicators visible
- **Why:** Legal requirement, ethical imperative, better UX

---

## Development Workflow

### Adding a New Component

1. **Create HTML pattern** in `components-spec/[component].html`
   - Use semantic HTML (no divitis)
   - Use class names that map to motor output
   - Include comments for integration
   - Example: `components-spec/hero.html`

2. **Add CSS to** `assets/css/main.css`
   - Follow design tokens (colors, spacing, fonts)
   - Use custom properties (--var-name)
   - Include responsive breakpoints
   - Test at 320px, 768px, 1200px

3. **Add JavaScript** (if needed) to `assets/js/[component].js`
   - Vanilla JS only
   - No dependencies
   - Progressive enhancement (works without JS)
   - Example: `assets/js/toc.js` for expand/collapse

4. **Document in** `integration/HOOKS.md`
   - Where does motor inject this component?
   - What classes are expected?
   - Any prerequisites?

5. **Test**
   - Responsive at 3 breakpoints
   - Keyboard accessible (Tab, Enter, Esc)
   - Mobile touch-friendly (44px minimum targets)
   - Cross-browser (Chrome, Firefox, Safari, Edge)

---

## CSS Architecture

### Single File Deployment

All CSS lives in `assets/css/main.css` for deployment. This file:
- ✅ Includes all reset, variables, typography, components, utilities
- ✅ No @import statements (everything concatenated)
- ✅ Self-contained (no external deps)
- ✅ Minifiable for production (< 50KB target)

### Modular Development (Optional)

For development clarity, conceptually split into:
- **normalize.css** — Reset, base styles
- **variables.css** — Custom properties (colors, spacing, fonts)
- **typography.css** — Headings, body text, links
- **layout.css** — Grid, flex, responsive containers
- **components.css** — Buttons, cards, badges, etc.
- **utilities.css** — Helpers, responsive utilities

**When deploying:** Merge all into `main.css`. Motor references only `main.css`.

---

## Design System

### Colors
See [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) for complete palette.

**Key:**
- Background: #0a0a0a (near-black)
- Text: #efe8d8 (light cream)
- Accent: #c9a961 (warm gold)

### Typography
- **Serif** (body): Georgia
- **Mono** (badges, code): DM Mono
- **Scale:** clamp() for responsive sizing (no breakpoint jumps)

### Spacing
- Base unit: 4px (use multiples: 6, 8, 12, 16, 24, 32px)
- Grid gap: 16px
- Container padding: 24px (mobile: 16px)
- Vertical rhythm: 1.76 line-height (generous)

###Breakpoints
- Mobile: 320px (minimum)
- Tablet: 768px
- Desktop: 1200px+

---

## Performance Targets

| Metric | Target | Note |
|--------|--------|------|
| CSS file size | < 50KB minified | Includes all components |
| JS total | < 40KB minified | All JS combined |
| First Contentful Paint (FCP) | < 1.5s | On 3G (if testable) |
| Largest Contentful Paint (LCP) | < 2.5s | |
| Cumulative Layout Shift (CLS) | < 0.1 | No jank on interactions |

---

## Accessibility Compliance

**Target:** WCAG 2.1 Level AA

**Checklist:**
- [ ] Color contrast ≥ 4.5:1 (normal text)
- [ ] Focus indicators visible
- [ ] Keyboard navigation works (Tab, Arrow, Enter, Esc)
- [ ] Semantic HTML (h1, nav, main, aside, etc.)
- [ ] Form labels associated with inputs
- [ ] Images have alt text
- [ ] Interactive elements are 44px+ (touch targets)

See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) for detailed guidelines.

---

## Integration Checklist

**Before copying to production:**

- [ ] All CSS is in `assets/css/main.css`
- [ ] All JS is in `assets/js/` (vendor-free)
- [ ] All icons are in `assets/icons/`
- [ ] Components are documented in `components-spec/`
- [ ] Templates are in `templates-guides/`
- [ ] Integration docs are complete (`integration/`)
- [ ] CSS is minified (< 50KB)
- [ ] Responsive testing done (320px, 768px, 1200px)
- [ ] A11y testing done (contrast, keyboard, screen reader)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] No console errors in DevTools

---

## How This Fits Into SINTOMARIO.ORG

### Current Motor State (Carril B) ✅
Motor generates clean HTML → outputs with `<link href="/assets/css/main.css">`

### What Carril A Delivers
A complete `frontend-layer/` folder that copies to `/publish/assets/` in production.

### Integration Steps
1. Copy `frontend-layer/assets/*` → `SINTOMARIO.ORG/publish/assets/`
2. Verify all pages render correctly
3. Validate mobile, a11y, performance
4. Deploy to production

See [integration/CHECKLIST.md](integration/CHECKLIST.md) for full validation process.

---

## File Index

| File | Purpose | Audience |
|------|---------|----------|
| [assets/css/main.css](assets/css/main.css) | All CSS (deployed) | Frontend dev, product |
| [components-spec/](components-spec/) | HTML patterns | Frontend dev, integrator |
| [templates-guides/](templates-guides/) | Page layouts | Integrator, motor engineer |
| [integration/README.md](integration/README.md) | Integration overview | All stakeholders |
| [integration/MAPPING.md](integration/MAPPING.md) | CSS class reference | Designer, frontend dev |
| [integration/HOOKS.md](integration/HOOKS.md) | Motor integration points | Integrator, motor engineer |
| [integration/CHECKLIST.md](integration/CHECKLIST.md) | Validation checklist | QA, integrator |
| [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) | Color, type, space reference | All developers |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | A11y guidelines | QA, accessibility engineer |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Code style guide | Frontend dev |
| [docs/MOBILE_FIRST.md](docs/MOBILE_FIRST.md) | Responsive strategy | Frontend dev |

---

## Current Status

### ✅ Completed
- Decoupled CSS from motor (Carril B refactored)
- Created modular CSS with design tokens
- Documented integration points
- Set up folder structure
- Created integration guides

### 🔄 In Progress
- Component specifications (header, footer, breadcrumbs, TOC, etc.)
- Template layouts (hub, article, FAQ, search)
- JavaScript for interactivity (expand/collapse, mobile menu, TOC sync)
- Icon library (SVG assets)

### ⏳ Pending
- Final component specs + testing
- Full integration test in SINTOMARIO.ORG
- Production deployment + monitoring

---

## Communication & Escalation

### Questions About Design Tokens?
→ See [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md)

### Questions About Motor Integration?
→ See [integration/HOOKS.md](integration/HOOKS.md)

### Ready to Deploy?
→ Follow [integration/CHECKLIST.md](integration/CHECKLIST.md)

### Found a Bug or Inconsistency?
→ Document in issue + tag Carril A lead

---

## References

- **Motor refactored by:** Senior Lead Engineer (Carril B)
- **Frontend designed by:** Product Owner/Architect (Carril A)
- **CSS file supplied by:** Frontend layer
- **Motor output expected:** Home, hubs, static pages (articles coming)

---

## Next Steps

1. **Complete component specs** (header, footer, cards, etc.)
2. **Add JavaScript** for interactivity (TOC, mobile menu, search)
3. **Create template guides** for integration teams
4. **Final validation** (responsive, a11y, performance)
5. **Integration dry-run** in staging
6. **Production deployment**

---

**Project Start:** 2026-03-24  
**Current Phase:** Component Design & CSS Architecture  
**Estimated Completion:** 2026-04-15  
**Next Review:** 2026-03-31

---

**For questions or updates:** See [integration/README.md](integration/README.md)  
**For design reference:** See [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md)  
**For deployment:** See [integration/CHECKLIST.md](integration/CHECKLIST.md)
