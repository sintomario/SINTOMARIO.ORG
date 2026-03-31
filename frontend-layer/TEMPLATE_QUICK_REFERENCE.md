# Template Quick Reference

**Fast lookup for template syntax and context variables.**

---

## Template Syntax Cheat Sheet

### Variables

```html
<!-- Basic variable -->
{{ page_title }}
{{ article_body }}

<!-- Nested access (objects/dicts) -->
{{ breadcrumbs.0.url }}
{{ user.profile.name }}

<!-- With filter (single) -->
{{ text | escape }}

<!-- With filter (chained) -->
{{ page_title | escape | truncate:60 }}
```

### Filters

```html
{{ text | lower }}           <!-- abc -->
{{ text | upper }}           <!-- ABC -->
{{ text | escape }}          <!-- < → &lt; -->
{{ text | truncate:50 }}     <!-- Cut at 50 chars, add ... -->
{{ content | safe }}         <!-- Don't escape (safe HTML) -->
```

### Conditionals

```html
{% if show_toc %}
  <nav>Table of Contents</nav>
{% endif %}

{% if count > 0 %}
  <p>{{ count }} items</p>
{% endif %}

{% if related_items %}
  {% for item in related_items %}
    <a href="{{ item.url }}">{{ item.title }}</a>
  {% endfor %}
{% endif %}
```

### Template Inheritance

```html
<!-- parent.html -->
<!doctype html>
<html>
  <body>
    {% block content %}{% endblock %}
  </body>
</html>

<!-- child.html -->
{% extends "parent.html" %}

{% block content %}
  <h1>Hello World</h1>
{% endblock %}
```

---

## Context Variables by Template

### `base.html` (Global)

```python
context = {
    "page_title": "Page Title",           # <title>, OG tag
    "page_description": "Meta desc",       # <meta description>
    "page_url": "https://...",            # Canonical URL
    "robots_noindex": False,              # No indexing?
    "schema_json": "<script>...</script>", # JSON-LD markup
}
```

**Special:** All other templates extend base.html and inherit these variables.

---

### `node.html` (Article Pages)

```python
context = {
    # From base.html (inherited)
    "page_title": "Ansiedad en el Pecho",
    "page_description": "Cómo se manifiesta...",
    "page_url": "https://...",
    "schema_json": "...",
    
    # Node-specific
    "breadcrumbs": [
        {"url": "/", "label": "Inicio"},
        {"url": "/cuerpo", "label": "Cuerpo"},
    ],
    "article_title": "Ansiedad en el Pecho",
    "article_eyebrow": "Síntoma",
    "article_body": "<h2>...</h2><p>...</p>",  # HTML safe
    "article_date": "2026-03-20",
    "article_author": "SINTOMARIO",
    "article_word_count": 450,
    
    # Sidebar
    "related_articles": [
        {
            "url": "/cuerpo/pecho/taquicardia",
            "title": "Taquicardia",
            "excerpt": "Ritmo acelerado...",
        },
    ],
    "faq_items": [
        {
            "question": "¿Es peligrosa?",
            "answer": "<p>No, pero incómoda</p>",
        },
    ],
    "show_toc": True,  # Show Table of Contents?
}
```

**Used by:** `motor._build_node()`

---

### `hub.html` (Hub Pages)

```python
context = {
    # From base.html (inherited)
    "page_title": "Sistema Nervioso",
    "page_description": "Hub de síntomas...",
    "page_url": "https://...",
    
    # Hub-specific
    "breadcrumbs": [...],
    "hub_title": "Sistema Nervioso",
    "hub_eyebrow": "Contexto",  # Or "Entity"
    "hub_description": "Hub description text",
    
    "hub_items": [
        {
            "url": "/contextos/ansiedad",
            "title": "Ansiedad",
            "excerpt": "Respuesta del cuerpo...",
            "icon": "<svg>...</svg>",  # Optional
        },
    ],
    
    "related_zones": [
        {
            "slug": "/cuerpo/pecho",
            "title": "Pecho",
            "count": 25,
        },
    ],
}
```

**Used by:** `motor._write_entity_hub()`, `motor._write_context_hub()`

---

### `simple.html` (Static Pages)

```python
context = {
    # From base.html (inherited)
    "page_title": "Acerca de SINTOMARIO",
    "page_description": "Quiénes somos...",
    "page_url": "https://...",
    
    # Static page
    "heading": "Acerca de SINTOMARIO",
    "content": "<h2>...</h2><p>...</p>",  # HTML safe
    "sidebar_content": "<aside>...</aside>",  # Optional
}
```

**Used by:** Static page methods (About, FAQ, Legal, Affiliates)

---

### `homepage.html` (Homepage)

```python
context = {
    # From base.html (inherited)
    "page_title": "SINTOMARIO",
    "page_description": "Motor Sintomatológico",
    "page_url": "https://sintomario.org",
    
    # Hero
    "hero_title": "SINTOMARIO",
    "hero_subtitle": "Motor Sintomatológico",
    
    # Featured articles
    "featured_articles": [
        {
            "url": "/cuerpo/pecho/ansiedad",
            "title": "Ansiedad en el Pecho",
            "excerpt": "Síntomas de ansiedad...",
            "category": "Síntoma",
            "icon": "<svg>...</svg>",  # Optional
            "eyebrow": "Destacado",
        },
    ],
    
    # Zones (body parts)
    "zones": [
        {
            "slug": "/cuerpo/cabeza",
            "title": "Cabeza",
            "count": 25,
            "icon": "<svg>...</svg>",  # Optional
        },
    ],
    
    # Optional
    "affiliate_block": "<aside>...</aside>",
}
```

**Used by:** `motor._write_homepage()`

---

## Common Patterns

### Pattern 1: Safe HTML Content

**Motor prepares HTML:**
```python
context = {
    "article_body": generate_html_content(node),  # Already HTML
}
```

**Template renders safely:**
```html
<article class="article-body">
  {{ article_body | safe }}  <!-- Don't escape -->
</article>
```

### Pattern 2: Text with Escaping

**Motor provides plain text:**
```python
context = {
    "page_title": "Anxiety & Panic",
}
```

**Template escapes automatically:**
```html
<h1>{{ page_title | escape }}</h1>  <!-- & → &amp; -->
<!-- Output: <h1>Anxiety &amp; Panic</h1> -->
```

### Pattern 3: Conditional Sections

**Motor provides flags:**
```python
context = {
    "show_toc": len(node["headings"]) > 2,
    "is_premium": user["plan"] == "premium",
}
```

**Template hides/shows:**
```html
{% if show_toc %}
  <nav class="toc">...</nav>
{% endif %}

{% if is_premium %}
  <p>Premium content visible</p>
{% endif %}
```

### Pattern 4: List Rendering

**Motor provides list:**
```python
context = {
    "related_articles": [
        {"url": "/a", "title": "Article 1"},
        {"url": "/b", "title": "Article 2"},
    ]
}
```

**Template loops:**
```html
{% if related_articles %}
  <ul>
  {% for article in related_articles %}
    <li><a href="{{ article.url }}">{{ article.title }}</a></li>
  {% endfor %}
  </ul>
{% endif %}
```

---

## CSS Classes Reference

### Layout
- `.wrap` — Max-width container (980px with padding)
- `.grid` — CSS Grid container
- `.grid-2` — 2-column grid
- `.grid-3` — 3-column grid

### Typography
- `h1, h2, h3, h4, h5, h6` — Headings
- `p` — Paragraphs
- `strong` — Bold
- `em` — Italic
- `code` — Inline code
- `blockquote` — Quotes

### Components
- `.hero` — Hero section
- `.card` — Card component
- `.btn` — Button
- `.btn-primary` — Primary button
- `.btn-secondary` — Secondary button
- `.form-group` — Form grouping
- `input`, `textarea`, `select` — Form inputs

### Sidebar
- `.sidebar` — Sidebar container
- `.toc` — Table of Contents
- `.faq` — FAQ section
- `.related` — Related items

### Responsive
- `@media (max-width: 767px)` — Mobile (≤ 767px)
- `@media (min-width: 768px)` — Tablet+ (≥ 768px)
- `@media (min-width: 1200px)` — Desktop (≥ 1200px)

**See:** [../docs/DESIGN_TOKENS.md](../docs/DESIGN_TOKENS.md) for complete reference

---

## Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| Variable not appearing | Missing from context dict | Add to `context = {}`  |
| HTML appears escaped | Not marked safe | Use `{{ var \| safe }}` |
| Template not found | Wrong path | Check template dir path |
| CSS classes don't apply | Missing class def | Add to `main.css` |
| Mobile layout broken | Responsive CSS missing | Add `@media` queries |
| Content blank | `{% if %}` is false | Check condition logic |
| Quotes in text | HTML escaping | Use `\| escape` filter |

---

## Testing Template Locally

```python
from template_manager import TemplateManager

tm = TemplateManager("./templates")

# Render a template
html = tm.render("node.html", {
    "page_title": "Test Article",
    "article_title": "Test",
    "article_body": "<p>Test content</p>",
    "show_toc": True,
})

# Save to file
with open("output.html", "w") as f:
    f.write(html)

# Or print to terminal
print(html)
```

---

## Template File Locations

```
template-system/templates/
├── base.html         # All pages extend this
├── node.html         # Articles
├── hub.html          # Hubs
├── simple.html       # Static pages
└── homepage.html     # Homepage
```

---

## Further Reading

- [../template-system/README.md](../template-system/README.md) — Full template guide
- [../template-system/MOTOR_REFACTORING_GUIDE.md](../template-system/MOTOR_REFACTORING_GUIDE.md) — Integration steps
- [../docs/CONVENTIONS.md](../docs/CONVENTIONS.md) — Naming conventions
- [../docs/ACCESSIBILITY.md](../docs/ACCESSIBILITY.md) — Accessibility guidelines

---

**Version:** 1.0 | **Last Updated:** March 2026
