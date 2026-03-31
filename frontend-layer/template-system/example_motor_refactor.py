"""
example_motor_refactor.py

Example of how to refactor sintomario_motor.py to use TemplateManager
instead of inline f-strings.

BEFORE (current approach):
```python
def _build_node(self, ...):
    html = f"""<!doctype html>
    <html lang='es'>
    <head>
      <title>{title}</title>
      ...
    </head>
    <body>
      <h1>{title}</h1>
      {content}
    </body>
    </html>"""
    return html
```

AFTER (template-based approach):
```python
def _build_node(self, ...):
    context = {...}
    return self.template_manager.render("node.html", context)
```

This example shows refactored methods.
"""

from template_manager import TemplateManager
from pathlib import Path
import json


class RefactoredMotor:
    """Example of motor refactored to use templates."""

    def __init__(self, template_dir: str, output_dir: str):
        self.template_manager = TemplateManager(template_dir)
        self.output_dir = Path(output_dir)

    def build_node(self, node_data: dict, corpus_context: dict) -> str:
        """
        Build individual article node.
        
        Args:
            node_data: {id, title, content, date, author, ...}
            corpus_context: {breadcrumbs, related_articles, faq_items, ...}
        
        Returns:
            HTML string ready to write.
        """
        # Prepare context dictionary
        context = {
            "page_title": node_data.get("title", "Sin título"),
            "page_description": node_data.get("excerpt", "")[:160],
            "page_url": f"https://sintomario.org{node_data.get('slug', '/')}",
            "breadcrumbs": corpus_context.get("breadcrumbs", []),
            "article_title": node_data.get("title"),
            "article_eyebrow": node_data.get("category"),
            "article_body": node_data.get("content"),  # Already HTML from motor
            "article_date": node_data.get("date"),
            "article_author": node_data.get("author"),
            "article_word_count": self._count_words(node_data.get("content", "")),
            "related_articles": corpus_context.get("related_articles", []),
            "faq_items": corpus_context.get("faq_items", []),
            "affiliate_block": corpus_context.get("affiliate_html", ""),
            "show_toc": True,
            "schema_json": self._build_schema(node_data),
            "robots_noindex": False,
        }
        
        # Render template
        html = self.template_manager.render("node.html", context)
        return html

    def build_hub(self, hub_data: dict, corpus_context: dict) -> str:
        """
        Build entity or context hub page.
        
        Args:
            hub_data: {id, title, description, items, ...}
            corpus_context: {breadcrumbs, ...}
        
        Returns:
            HTML string ready to write.
        """
        context = {
            "page_title": hub_data.get("title", "Hub"),
            "page_description": hub_data.get("description", ""),
            "page_url": f"https://sintomario.org{hub_data.get('slug', '/')}",
            "breadcrumbs": corpus_context.get("breadcrumbs", []),
            "hub_title": hub_data.get("title"),
            "hub_eyebrow": hub_data.get("type", ""),
            "hub_description": hub_data.get("description"),
            "hub_items": hub_data.get("items", []),
            "related_zones": corpus_context.get("related_zones", []),
            "schema_json": self._build_schema(hub_data),
            "robots_noindex": False,
        }
        
        html = self.template_manager.render("hub.html", context)
        return html

    def build_static_page(self, page_data: dict) -> str:
        """
        Build static page (About, FAQ, etc).
        
        Args:
            page_data: {title, content, sidebar, ...}
        
        Returns:
            HTML string ready to write.
        """
        context = {
            "page_title": page_data.get("title", "Página"),
            "page_description": page_data.get("description", ""),
            "page_url": f"https://sintomario.org{page_data.get('slug', '/')}",
            "heading": page_data.get("title"),
            "content": page_data.get("content"),
            "sidebar_content": page_data.get("sidebar"),
            "robots_noindex": page_data.get("noindex", False),
        }
        
        html = self.template_manager.render("simple.html", context)
        return html

    def _count_words(self, html: str) -> int:
        """Extract text from HTML and count words."""
        import re
        text = re.sub(r"<[^>]+>", " ", html)  # Remove tags
        words = len(text.split())
        return words

    def _build_schema(self, data: dict) -> str:
        """Build JSON-LD schema.org markup."""
        schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": data.get("title", ""),
            "description": data.get("excerpt", ""),
            "datePublished": data.get("date", ""),
            "author": {
                "@type": "Person",
                "name": data.get("author", "SINTOMARIO"),
            },
        }
        return json.dumps(schema, ensure_ascii=False)


# Example usage:
if __name__ == "__main__":
    # Initialize motor with templates
    template_dir = "/path/to/templates"  # frontend-layer/template-system/templates/
    output_dir = "/path/to/output"
    
    motor = RefactoredMotor(template_dir, output_dir)
    
    # Example: Build a node
    node = {
        "id": "node-123",
        "title": "Ansiedad en el Pecho",
        "excerpt": "Cómo se manifiesta la ansiedad corporalmente en el pecho...",
        "content": "<h2>Síntomas</h2><p>...</p>",
        "date": "2026-03-24",
        "author": "SINTOMARIO",
        "category": "Síntoma",
        "slug": "/cuerpo/pecho/ansiedad",
    }
    
    context = {
        "breadcrumbs": [
            {"url": "/", "label": "Inicio"},
            {"url": "/cuerpo", "label": "Cuerpo"},
            {"url": "/cuerpo/pecho", "label": "Pecho"},
        ],
        "related_articles": [
            {
                "url": "/cuerpo/pecho/taquicardia",
                "title": "Taquicardia",
                "excerpt": "Ritmo acelerado del corazón...",
            },
        ],
        "faq_items": [
            {
                "question": "¿Es peligrosa la ansiedad?",
                "answer": "<p>No, pero es incómoda...</p>",
            },
        ],
        "affiliate_html": "<aside>...</aside>",
    }
    
    html = motor.build_node(node, context)
    print(html)
    
    # Write to file
    output_path = Path(output_dir) / "cuerpo" / "pecho" / "ansiedad" / "index.html"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
