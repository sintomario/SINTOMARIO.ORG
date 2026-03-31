# ICONS | SVG Asset Library

This directory contains SVG icons used throughout the frontend. All icons are:
- ✅ Scalable (vector-based)
- ✅ Lightweight (small file size)
- ✅ Accessible (semantic, alt text when needed)
- ✅ Consistent (same style, sizing)

---

## Available Icons

See `svg/` directory for individual files:

| Icon | File | Usage |
|------|------|-------|
| Menu | `menu.svg` | Mobile menu toggle |
| Search | `search.svg` | Search input/button |
| Close | `close.svg` | Close menu/modal |
| Arrow | `arrow.svg` | Navigation, links |
| ... | (more as needed) | ... |

---

## Using SVGs

### Option 1: Inline SVG
```html
<button aria-label="Open menu">
  <svg class="icon icon-menu" viewBox="0 0 24 24" width="24" height="24">
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
  </svg>
</button>
```

**Pros:** No extra request, can be styled with CSS  
**Cons:** Larger HTML, harder to reuse

### Option 2: SVG Sprite Sheet
```html
<svg class="icon icon-menu" width="24" height="24">
  <use xlink:href="/assets/icons/sprite.svg#menu"></use>
</svg>
```

**Pros:** Single file, reusable, easy to cache  
**Cons:** Requires build step to generate sprite

### Option 3: Font Icon
```html
<span class="icon icon-menu" aria-hidden="true"></span>
```

**Pros:** Smallest file size, easiest  
**Cons:** Less flexible for complex shapes

---

## Icon Sizing

Use CSS custom properties for consistent sizing:

```css
/* Small icons (16px) */
.icon-sm { width: 16px; height: 16px; }

/* Standard icons (24px) */
.icon { width: 24px; height: 24px; }

/* Large icons (32px) */
.icon-lg { width: 32px; height: 32px; }
```

---

## SVG Best Practices

1. **Remove unnecessary attributes**
   - ❌ `<svg version="1.1" xmlns="..." xmlns:xlink="...">` (verbose)
   - ✅ `<svg viewBox="0 0 24 24">` (minimal)

2. **Use viewBox for scaling**
   ```html
   <svg viewBox="0 0 24 24" width="24" height="24">
   ```
   This makes the SVG scalable to any size.

3. **Add accessible labels**
   ```html
   <svg aria-label="Close" role="img" viewBox="0 0 24 24">
     <!-- paths -->
   </svg>
   ```

4. **Simplify paths**
   - Use tools like [SVGO](https://github.com/svg/svgo) to optimize
   - Reduce decimal places in coordinates
   - Combine paths where possible

---

## Color & Styling

Icons inherit text color by default:

```css
.icon {
  fill: currentColor;  /* Uses parent's text color */
  stroke: currentColor;
}

.icon-accent {
  color: var(--color-accent); /* Golden accent */
}
```

---

## When to Add Icons

✅ **Do add icons for:**
- Navigation (menu, search, close)
- Actions (edit, delete, download)
- Status (success, error, warning, info)
- UI controls (expand, collapse, share)

❌ **Don't add icons for:**
- Decoration only (use CSS gradients instead)
- Text replacement (use text + icon)
- Complex images (use PNG/JPEG instead)

---

## Generation (Optional)

When you have multiple SVG files, generate a sprite sheet:

```bash
# Using SVGO to clean SVGs
svgo svg/*.svg

# Using svg-sprite to create sprite
svg-sprite --config svg-sprite-config.json svg/*.svg
```

Result: Single `sprite.svg` file with all icons.

---

**Last Updated:** 2026-03-24  
**Status:** 🟡 Ready for icon assets
