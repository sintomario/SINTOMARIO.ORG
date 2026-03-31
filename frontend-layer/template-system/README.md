# Template System Documentation

## Overview

This directory contains the **TemplateManager** — a lightweight, zero-dependency Python template engine designed to decouple the SINTOMARIO motor logic from HTML presentation.

**Purpose:** Eliminate inline f-string HTML from `sintomario_motor.py` and create a clean separation between backend logic (motor) and frontend layer (Carril A).

---

## Directory Structure

```
template-system/
├── template_manager.py          # Core template engine (280 lines, no deps)
├── templates/                   # HTML template files
│   ├── base.html               # Global layout (header, footer, inheritance)
│   ├── node.html               # Article/node pages
│   ├── hub.html                # Entity/context hubs
│   ├── simple.html             # Static pages (About, FAQ, Legal)
│   └── homepage.html           # Homepage with zones, featured, CTA
├── example_motor_refactor.py    # Example: How to use TemplateManager in motor
├── MOTOR_REFACTORING_GUIDE.md   # Step-by-step refactoring instructions
└── README.md                    # This file
```

---

## Files Explained

### `template_manager.py` (Core Engine)

**280 lines, zero npm dependencies** (stdlib only: re, os, pathlib, typing)

#### Key Features:

1. **Variable Substitution**
   ```html
   {{ page_title }}
   {{ article_body }}
   {{ user.name }}  <!-- Nested access -->
   ```

2. **Filters** (chainable)
   ```html
   {{ text | lower }}
   {{ text | upper }}
   {{ text | escape }}
   {{ text | safe }}
   {{ text | truncate:50 }}
   ```

3. **Template Inheritance**
   ```html
   {% extends "base.html" %}
   {% block content %}
     <h1>Custom content</h1>
   {% endblock %}
   ```

4. **Conditional Blocks**
   ```html
   {% if condition %}
     <p>Shown when true</p>
   {% endif %}
   ```

#### Usage:

```python
from template_manager import TemplateManager

# Initialize (once in motor __init__)
tm = TemplateManager("/path/to/templates")

# Render template
html = tm.render("node.html", {
    "page_title": "My Article",
    "article_body": "<p>Content...</p>",
    "show_toc": True,
})
```

---

### Template Files

#### `base.html` (70 lines)
**Global template** — All pages extend this.

**Provides:**
- HTML5 doctype, head, meta tags
- CSS/JS includes
- Header (global nav)
- Footer (disclaimer)
- `{% block content %}` for child templates

**Used by:** All pages

**Context variables:**
```python
{
    "page_title": "Article Title",
    "page_description": "Meta description",
    "page_url": "https://sintomario.org/path",
    "robots_noindex": False,
    "schema_json": "<script type='application/ld+json'>...</script>",
}
```

---

#### `node.html` (100 lines)
**Article/node pages** — Individual symptom, cause, context pages.

**Extends:** `base.html`

**Provides:**
- Breadcrumb navigation
- Hero section
- Main article content (left column)
- Sidebar:
  - Table of Contents (sticky)
  - FAQ accordion
  - Related articles
- Schema.org markup

**Used by:** `motor._build_node()`

**Context variables:**
```python
{
    "page_title": "Article Title",
    "page_description": "...",
    "breadcrumbs": [
        {"url": "/", "label": "Inicio"},
        {"url": "/cuerpo", "label": "Cuerpo"},
    ],
    "article_title": "Full Title",
    "article_eyebrow": "Symptom",
    "article_body": "<h2>...</h2><p>...</p>",
    "article_date": "2026-03-20",
    "related_articles": [
        {"url": "/...", "title": "Related", "excerpt": "..."},
    ],
    "faq_items": [
        {"question": "Q?", "answer": "<p>A</p>"},
    ],
    "show_toc": True,
    "schema_json": "...",
}
```

---

#### `hub.html` (75 lines)
**Hub pages** — Entity hubs, context hubs, category pages.

**Extends:** `base.html`

**Provides:**
- Breadcrumb navigation
- Hub title + description
- Grid of hub items (3 columns)
- Related zones section

**Used by:** `motor._write_entity_hub()`, `motor._write_context_hub()`

**Context variables:**
```python
{
    "page_title": "Hub Title",
    "page_description": "...",
    "breadcrumbs": [...],
    "hub_title": "Hub Name",
    "hub_eyebrow": "Entity Hub",
    "hub_description": "Description text",
    "hub_items": [
        {
            "url": "/slug",
            "title": "Item Title",
            "excerpt": "Short description",
            "icon": "<svg>...</svg>",
        },
    ],
    "related_zones": [...],
    "schema_json": "...",
}
```

---

#### `simple.html` (50 lines)
**Static pages** — About, FAQ, Legal, Affiliates, etc.

**Extends:** `base.html`

**Provides:**
- Single or two-column layout
- Optional sidebar_content
- Minimal styling (focus on reading)

**Used by:** Static page methods

**Context variables:**
```python
{
    "page_title": "Page Title",
    "page_description": "...",
    "heading": "Page Heading",
    "content": "<h2>...</h2><p>...</p>",
    "sidebar_content": "<aside>...</aside>",  # Optional
    "robots_noindex": False,
}
```

---

#### `homepage.html` (120 lines) — NEW
**Homepage** — Index page with search, zones, featured articles, how-it-works.

**Extends:** `base.html`

**Provides:**
- Hero section (title, CTA)
- Featured articles grid (3 columns)
- Zones grid (body parts, clickable)
- How-it-works section (4 steps)
- Search form
- Affiliate block

**Used by:** `motor._write_homepage()`

**Context variables:**
```python
{
    "page_title": "SINTOMARIO",
    "page_description": "...",
    "hero_title": "SINTOMARIO",
    "hero_subtitle": "Motor Sintomatológico",
    "featured_articles": [
        {
            "url": "/...",
            "title": "Article",
            "excerpt": "...",
            "category": "Síntoma",
            "icon": "<svg>...</svg>",
            "eyebrow": "Featured",
        },
    ],
    "zones": [
        {
            "slug": "/cuerpo/cabeza",
            "title": "Cabeza",
            "count": 25,
            "icon": "<svg>...</svg>",
        },
    ],
    "affiliate_block": "<aside>...</aside>",  # Optional
}
```

---

## How to Use

### For Motor Developers

1. **Import TemplateManager** in `sintomario_motor.py`:
   ```python
   from template_system.template_manager import TemplateManager
   ```

2. **Initialize in `__init__`**:
   ```python
   self.template_manager = TemplateManager(
       Path(__file__).parent / "template-system" / "templates"
   )
   ```

3. **Replace f-strings with templates**:
   ```python
   # OLD:
   html = f"<h1>{title}</h1><p>{content}</p>"
   
   # NEW:
   html = self.template_manager.render("node.html", {
       "article_title": title,
       "article_body": content,
   })
   ```

4. **See:** [MOTOR_REFACTORING_GUIDE.md](MOTOR_REFACTORING_GUIDE.md) for step-by-step instructions

---

### For Frontend Developers (Carril A)

1. **Edit HTML structure** in template files — no Python knowledge needed
2. **Use CSS classes** from `/assets/css/main.css`
3. **Follow template syntax**:
   - `{{ variable }}` — Insert variable
   - `{{ variable | filter }}` — Apply filter
   - `{% if condition %}...{% endif %}` — Conditionals
   - `{% extends "base.html" %}` — Inheritance
   - `{% block content %}...{% endblock %}` — Block override

4. **Test locally**:
   ```python
   from template_manager import TemplateManager
   
   tm = TemplateManager("./templates")
   html = tm.render("node.html", {
       "page_title": "Test",
       "article_body": "<p>Test content</p>",
   })
   print(html)
   ```

---

## Template Syntax Reference

### Variables

```html
<!-- Simple variable -->
{{ page_title }}

<!-- Nested object access -->
{{ article.title }}
{{ user.profile.name }}

<!-- With filter -->
{{ page_title | escape }}

<!-- Chained filters -->
{{ page_title | escape | truncate:60 }}
```

### Filters

| Filter | Usage | Example |
|--------|-------|---------|
| `escape` | HTML-escape string | `{{ text \| escape }}` |
| `safe` | Don't escape (safe HTML) | `{{ html \| safe }}` |
| `lower` | Lowercase | `{{ text \| lower }}` |
| `upper` | Uppercase | `{{ text \| upper }}` |
| `truncate:N` | Cut off at N chars | `{{ text \| truncate:50 }}` |

### Conditionals

```html
{% if show_toc %}
  <nav class="toc">...</nav>
{% endif %}

{% if related_articles %}
  <section>
    {% for article in related_articles %}
      <a href="{{ article.url }}">{{ article.title }}</a>
    {% endfor %}
  </section>
{% endif %}
```

### Template Inheritance

**Parent (base.html):**
```html
<!doctype html>
<html>
<head>
  <title>{% block title %}Default{% endblock %}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

**Child (node.html):**
```html
{% extends "base.html" %}

{% block title %}{{ page_title }}{% endblock %}

{% block content %}
  <h1>{{ article_title }}</h1>
{% endblock %}
```

---

## Integration Checklist

- [ ] TemplateManager imported in motor
- [ ] Motor `__init__` initializes `self.template_manager`
- [ ] All motor HTML methods use `.render()` instead of f-strings
- [ ] Context dicts prepared for each template
- [ ] Template files deployed to production
- [ ] CSS `/assets/css/main.css` deployed
- [ ] HTML output verified identical to before
- [ ] Frontend developers can edit templates independently
- [ ] No Python errors on render
- [ ] Performance acceptable (template caching works)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `TemplateNotFound: node.html` | Verify template path is correct; use absolute path or verify relative from execution dir |
| `KeyError: variable_name` | Add variable to context dict in motor method; check spelling |
| HTML appears escaped when shouldn't be | Use `{{ variable \| safe }}` instead of `{{ variable }}` |
| Template renders blank | Check `{% if condition %}` — condition might be False |
| CSS classes don't apply | Verify class exists in `main.css`; check class names in template match CSS |
| Performance slow | Clear cache: `tm.cache.clear()` (though shouldn't be needed) |

---

## Best Practices

1. **Always use context dicts** — Don't pass raw HTML strings
2. **Prepare data in motor** — Don't do data processing in templates
3. **Use `escape` filter** — Except for `article_body` which should be `| safe`
4. **Keep templates simple** — Logic lives in Python, presentation in HTML
5. **Test locally first** — Before pushing to production
6. **Version control** — Track template changes in git
7. **Document changes** — Update context dict docs if adding new template variables

---

## Next Steps

1. ✅ **TemplateManager created** (this folder)
2. ✅ **Template files created** (base, node, hub, simple, homepage)
3. 🔄 **Motor refactoring** → Update motor methods to use templates
   - See [MOTOR_REFACTORING_GUIDE.md](MOTOR_REFACTORING_GUIDE.md)
4. 🔄 **Component specs** → HTML patterns for individual components
5. 🔄 **JavaScript modules** → Interactivity (TOC sync, mobile menu, etc.)
6. 🔄 **Validation** → Test everything end-to-end

---

## Questions?

Refer to:
- [MOTOR_REFACTORING_GUIDE.md](MOTOR_REFACTORING_GUIDE.md) — Step-by-step motor integration
- [example_motor_refactor.py](example_motor_refactor.py) — Working code examples
- [../integration/MAPPING.md](../integration/MAPPING.md) — Template → HTML class mapping
- [../docs/CONVENTIONS.md](../docs/CONVENTIONS.md) — HTML/CSS naming conventions
