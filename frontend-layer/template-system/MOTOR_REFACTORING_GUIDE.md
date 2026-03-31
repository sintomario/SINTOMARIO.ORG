# Motor Refactoring Guide: TemplateManager Integration

## Overview

This guide walks through integrating **TemplateManager** into `sintomario_motor.py` to eliminate inline HTML f-strings and achieve clean separation between logic (motor) and presentation (Carril A).

## Before & After

### ❌ BEFORE: Inline HTML

```python
def _build_node(self, title, content, ...):
    html = f"""<!doctype html>
    <html lang='es'>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/assets/css/main.css">
      </head>
      <body>
        <h1>{title}</h1>
        <div class="wrap">
          {content}
        </div>
      </body>
    </html>"""
    return html
```

**Problems:**
- HTML structure hardcoded in Python
- Frontend devs can't modify HTML without touching Python logic
- Changes to HTML require code review/testing of motor logic
- Duplication across multiple methods

---

### ✅ AFTER: Template-Based

```python
def _build_node(self, title, content, ...):
    context = {
        "page_title": title,
        "article_body": content,
        # ... other variables
    }
    return self.template_manager.render("node.html", context)
```

**Benefits:**
- HTML lives in separate template files
- Carril A (frontend) can modify HTML without touching motor code
- Clean separation of concerns
- Easy to test: template + context = expected output

---

## Integration Steps

### Step 1: Import & Initialize

**File:** `sintomario_motor.py`

```python
from template_manager import TemplateManager
from pathlib import Path

class SintomarioMotor:
    def __init__(self, ...):
        # ... existing code ...
        
        # ADD THIS:
        template_dir = Path(__file__).parent / "template-system" / "templates"
        self.template_manager = TemplateManager(str(template_dir))
```

**Location:** Add to `__init__` method, after other initialization.

---

### Step 2: Refactor Each Method

#### Method 1: `_write_homepage()`

**BEFORE:**
```python
def _write_homepage(self):
    html = f"""<!doctype html>
    <html>
    <head><title>SINTOMARIO</title></head>
    <body>
      <h1>SINTOMARIO</h1>
      <p>Bienvenido...</p>
      {self.render_zones()}
    </body>
    </html>"""
    Path(self.output_dir / "index.html").write_text(html)
```

**AFTER:**
```python
def _write_homepage(self):
    context = {
        "page_title": "SINTOMARIO - Motor Sintomatológico",
        "page_description": "Explora síntomas, causas y contextos de manera inteligente.",
        "hero_title": "SINTOMARIO",
        "hero_subtitle": "Motor Sintomatológico",
        "zones": self._get_zones_data(),
        "featured_articles": self._get_featured_articles(),
    }
    html = self.template_manager.render("homepage.html", context)
    Path(self.output_dir / "index.html").write_text(html, encoding="utf-8")
```

**Context variables to prepare:**
- `zones`: List of zone objects with {title, slug, count, icon}
- `featured_articles`: Top 5-10 articles for homepage

---

#### Method 2: `_build_node()`

**BEFORE:**
```python
def _build_node(self, node_id):
    node = self.corpus[node_id]
    html = f"""<!doctype html>
    <html><head>
    <title>{node['title']}</title>
    <meta name="description" content="{node['excerpt']}">
    </head>
    <body>
      <h1>{node['title']}</h1>
      <div>{node['content']}</div>
    </body>
    </html>"""
    return html
```

**AFTER:**
```python
def _build_node(self, node_id):
    node = self.corpus[node_id]
    breadcrumbs = self._build_breadcrumbs(node_id)
    related = self._get_related_articles(node_id)
    faq = self._get_node_faq(node_id)
    
    context = {
        "page_title": node.get("title", "Sin título"),
        "page_description": node.get("excerpt", "")[:160],
        "page_url": f"https://sintomario.org{node.get('slug', '/')}",
        "breadcrumbs": breadcrumbs,
        "article_title": node.get("title"),
        "article_eyebrow": node.get("category"),
        "article_body": node.get("content"),
        "article_date": node.get("date"),
        "related_articles": related,
        "faq_items": faq,
        "show_toc": True,
        "schema_json": self._build_schema(node),
    }
    
    html = self.template_manager.render("node.html", context)
    return html
```

**Helper methods to create:**
```python
def _build_breadcrumbs(self, node_id):
    """Return list of {url, label} dicts."""
    node = self.corpus[node_id]
    breadcrumbs = [{"url": "/", "label": "Inicio"}]
    # Add parent zones/categories
    if node.get("parent_id"):
        parent = self.corpus[node["parent_id"]]
        breadcrumbs.append({
            "url": f"/{parent['slug']}",
            "label": parent["title"]
        })
    breadcrumbs.append({"url": node.get("slug"), "label": node["title"]})
    return breadcrumbs

def _get_related_articles(self, node_id, limit=5):
    """Return related articles: list of {url, title, excerpt}."""
    # Implementation depends on your corpus structure
    pass

def _get_node_faq(self, node_id):
    """Return FAQ items for node: list of {question, answer}."""
    pass

def _build_schema(self, node):
    """Return JSON-LD schema.org markup as JSON string."""
    import json
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": node.get("title"),
        "description": node.get("excerpt"),
        "datePublished": node.get("date"),
        "author": {"@type": "Person", "name": "SINTOMARIO"}
    }
    return json.dumps(schema, ensure_ascii=False)
```

---

#### Method 3: `_write_entity_hub()`

**BEFORE:**
```python
def _write_entity_hub(self, entity_id):
    entity = self.entities[entity_id]
    items_html = "".join([
        f"<div class='card'><h3>{item['title']}</h3></div>"
        for item in entity.get("items", [])
    ])
    html = f"""<!doctype html>
    <html><body>
      <h1>{entity['title']}</h1>
      <div class='grid'>{items_html}</div>
    </body></html>"""
    return html
```

**AFTER:**
```python
def _write_entity_hub(self, entity_id):
    entity = self.entities[entity_id]
    
    context = {
        "page_title": entity.get("title"),
        "page_description": entity.get("description", ""),
        "hub_title": entity.get("title"),
        "hub_eyebrow": "Entity Hub",
        "hub_items": [
            {
                "url": f"/{item['slug']}",
                "title": item["title"],
                "excerpt": item.get("excerpt", ""),
                "icon": item.get("icon"),
            }
            for item in entity.get("items", [])
        ],
        "schema_json": self._build_schema(entity),
    }
    
    html = self.template_manager.render("hub.html", context)
    return html
```

---

#### Method 4: `_write_context_hub()`

**Similar pattern to entity hub:**
- Replace f-string with context dict
- Call `self.template_manager.render("hub.html", context)`

---

#### Method 5: Static Pages (About, FAQ, Legal, etc.)

**BEFORE:**
```python
def _write_about():
    html = f"""<!doctype html>
    <html><body>
      <h1>Acerca de SINTOMARIO</h1>
      <p>{ABOUT_CONTENT}</p>
    </body></html>"""
    return html
```

**AFTER:**
```python
def _write_about():
    context = {
        "page_title": "Acerca de SINTOMARIO",
        "page_description": "Quiénes somos y por qué SINTOMARIO existe.",
        "heading": "Acerca de SINTOMARIO",
        "content": ABOUT_CONTENT,
        "sidebar_content": None,  # or include if needed
    }
    html = self.template_manager.render("simple.html", context)
    return html
```

**Do same for:**
- `_write_faq()`
- `_write_legal()`
- `_write_affiliates()`

---

## Step 3: Verify No Template Files Needed Yet

If motor method needs new template, create it following template pattern:

1. **Extends base.html** (if full page):
   ```html
   {% extends "base.html" %}
   {% block content %}
     ... your content ...
   {% endblock %}
   ```

2. **Uses same variables** as examples above (page_title, page_description, etc.)

3. **Uses CSS classes** from `main.css` (wrap, grid-3, card, etc.)

---

## Step 4: Testing Checklist

After refactoring each method:

- [ ] Template file exists and is valid HTML
- [ ] Context dict has all variables used in template
- [ ] Rendered HTML is identical to old f-string output (or acceptable improvement)
- [ ] CSS classes in template match classes in `main.css`
- [ ] No Python errors on render

**Sample test:**
```python
motor = SintomarioMotor(...)
html = motor._build_node("some-node-id")
assert "<h1>" in html
assert "schema.org" in html or "<script" in html
print("✅ Node rendering works")
```

---

## Step 5: Deployment Checklist

- [ ] All motor methods using templates
- [ ] `template-system/templates/` copied to production
- [ ] `template-system/template_manager.py` available on motor startup
- [ ] Motor output identical to before (or improved)
- [ ] CSS `/assets/css/main.css` deployed
- [ ] Carril A can now modify templates independently

---

## Template Files Needed

| Template | Used By | Status |
|----------|---------|--------|
| `base.html` | All pages (inheritance) | ✅ Ready |
| `node.html` | `_build_node()` | ✅ Ready |
| `hub.html` | `_write_entity_hub()`, `_write_context_hub()` | ✅ Ready |
| `simple.html` | Static pages (About, FAQ, Legal, Affiliates) | ✅ Ready |
| `homepage.html` | `_write_homepage()` | 🔄 Need to create |
| `search-results.html` | Search results page | 🔄 Optional |

---

## Common Patterns

### Pattern 1: Conditional Content

**Motor:**
```python
context = {
    "show_toc": len(node["headings"]) > 2,
    "is_published": node["status"] == "published",
}
```

**Template:**
```html
{% if show_toc %}<nav class="toc">...</nav>{% endif %}
{% if is_published %}<p>Publicado</p>{% endif %}
```

### Pattern 2: Filtering Variables

**Motor:**
```python
context = {
    "page_title": node["title"],  # Will be escaped + truncated in template
}
```

**Template:**
```html
<title>{{ page_title | escape | truncate:60 }}</title>
```

### Pattern 3: Safe HTML (unescaped)

**Motor:**
```python
context = {
    "article_body": generate_html_content(node),  # Already safe HTML
}
```

**Template:**
```html
<article class="article-body">
  {{ article_body | safe }}
</article>
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `TemplateNotFound: node.html` | Verify template path: `Path(__file__).parent / "template-system" / "templates"` |
| Variables not appearing in output | Check `{{ variable_name }}` matches context dict key exactly |
| HTML escaped when shouldn't be | Use `{{ variable \| safe }}` filter in template |
| Performance slow | TemplateManager caches loaded templates; clear cache if iterating |
| CSS classes missing | Ensure `main.css` deployed; check class names in template match CSS |

---

## Next Steps After Motor Refactor

1. ✅ Motor methods use templates
2. 🔄 Create component specs (header, footer, TOC, cards, etc.)
3. 🔄 Create JavaScript modules for interactivity
4. 🔄 Run integration validation (10-phase checklist)
5. 🔄 Deploy to SINTOMARIO.ORG

---

**Example Reference:** See `example_motor_refactor.py` for complete working examples.
