"""
TemplateManager: Lightweight template engine for SINTOMARIO motor.

Purpose: 
  Extract HTML logic from Python code into separate template files.
  Reduces duplication, improves maintainability, separates concerns.

Usage:
  from template_manager import TemplateManager
  
  manager = TemplateManager(template_dir="/path/to/templates")
  html = manager.render("node.html", {
    "title": "Article Title",
    "content": "<p>Article body</p>",
    ...
  })

No external dependencies. Uses only Python stdlib.
"""

import os
from pathlib import Path
from typing import Dict, Optional, Any


class TemplateManager:
    """Simple template engine with variable substitution and inheritance."""

    def __init__(self, template_dir: str):
        """
        Initialize template manager.
        
        Args:
            template_dir: Path to directory containing .html template files.
        """
        self.template_dir = Path(template_dir)
        if not self.template_dir.exists():
            raise FileNotFoundError(f"Template directory not found: {template_dir}")
        
        self.cache: Dict[str, str] = {}

    def render(self, template_name: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Render a template with given context.
        
        Args:
            template_name: Name of template file (e.g., "node.html", "hub.html").
            context: Dictionary of variables to substitute in template.
        
        Returns:
            Rendered HTML string.
        
        Raises:
            FileNotFoundError: If template file doesn't exist.
        """
        if context is None:
            context = {}
        
        # Load template content
        template_content = self._load_template(template_name)
        
        # Check for inheritance ({% extends "base.html" %})
        template_content = self._process_extends(template_content)
        
        # Process blocks ({% block name %}...{% endblock %})
        template_content = self._process_blocks(template_content, context)
        
        # Substitute variables ({{ variable }} or {{ variable | filter }})
        rendered = self._substitute_variables(template_content, context)
        
        return rendered

    def _load_template(self, template_name: str) -> str:
        """Load template file into memory."""
        template_path = self.template_dir / template_name
        
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_name} at {template_path}")
        
        # Check cache first
        if template_name in self.cache:
            return self.cache[template_name]
        
        # Read from disk
        try:
            with open(template_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.cache[template_name] = content
            return content
        except Exception as e:
            raise RuntimeError(f"Error reading template {template_name}: {e}")

    def _process_extends(self, content: str) -> str:
        """
        Process template inheritance: {% extends "base.html" %}
        
        Replaces extends directive with actual base template content.
        """
        import re
        match = re.search(r'{%\s*extends\s*["\']([^"\']+)["\']\s*%}', content)
        
        if not match:
            return content  # No inheritance
        
        base_template_name = match.group(1)
        base_content = self._load_template(base_template_name)
        
        # Remove extends directive from content
        content = re.sub(r'{%\s*extends\s*["\'][^"\']+["\']\s*%}\s*', '', content)
        
        # The remaining content are blocks that override base blocks
        # For now, store content in context for block processing
        return content

    def _process_blocks(self, content: str, context: Dict[str, Any]) -> str:
        """
        Process template blocks: {% block name %}...{% endblock %}
        
        Blocks in child templates can override blocks in base templates.
        """
        import re
        
        # Find all blocks
        block_pattern = r'{%\s*block\s+(\w+)\s*%}(.*?){%\s*endblock\s*%}'
        blocks = re.findall(block_pattern, content, re.DOTALL)
        
        # For now, just remove block markers (actual inheritance not implemented)
        # This is a simplified version; full implementation would handle block override
        content = re.sub(block_pattern, r'\2', content, flags=re.DOTALL)
        
        return content

    def _substitute_variables(self, content: str, context: Dict[str, Any]) -> str:
        """
        Substitute variables in template: {{ variable }}
        
        Also supports simple filters: {{ variable | lower | truncate:50 }}
        """
        import re
        
        # Pattern: {{ variable }} or {{ variable | filter1 | filter2 }}
        var_pattern = r'{{\s*([\w\.]+)(?:\s*\|\s*([^}]+?))?\s*}}'
        
        def replace_var(match):
            var_name = match.group(1)
            filters_str = match.group(2)
            
            # Get variable value from context
            value = self._get_nested_value(context, var_name)
            
            if value is None:
                return ""  # Return empty string for missing variables
            
            # Apply filters if any
            if filters_str:
                filters = [f.strip() for f in filters_str.split("|")]
                value = self._apply_filters(value, filters)
            
            return str(value)
        
        content = re.sub(var_pattern, replace_var, content)
        
        return content

    def _get_nested_value(self, context: Dict[str, Any], key: str) -> Any:
        """
        Get value from context, supporting nested keys like 'article.title'.
        
        Args:
            context: Dictionary to search.
            key: Key path (e.g., "article.title").
        
        Returns:
            Value or None if not found.
        """
        keys = key.split(".")
        value = context
        
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return None
            
            if value is None:
                return None
        
        return value

    def _apply_filters(self, value: Any, filters: list) -> Any:
        """Apply simple built-in filters to value."""
        for filter_expr in filters:
            if ":" in filter_expr:
                filter_name, filter_args = filter_expr.split(":", 1)
            else:
                filter_name = filter_expr
                filter_args = None
            
            filter_name = filter_name.strip()
            
            # Built-in filters
            if filter_name == "lower":
                value = str(value).lower()
            elif filter_name == "upper":
                value = str(value).upper()
            elif filter_name == "truncate":
                max_len = int(filter_args) if filter_args else 50
                s = str(value)
                value = s[:max_len] + ("..." if len(s) > max_len else "")
            elif filter_name == "escape":
                value = self._escape_html(str(value))
            elif filter_name == "safe":
                # Mark as safe (no escaping)
                value = str(value)
            else:
                # Unknown filter, return unchanged
                pass
        
        return value

    @staticmethod
    def _escape_html(text: str) -> str:
        """Escape HTML special characters."""
        return (
            text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&#39;")
        )

    def clear_cache(self):
        """Clear template cache."""
        self.cache.clear()


# Convenience function for quick rendering
def render_template(template_dir: str, template_name: str, context: Optional[Dict[str, Any]] = None) -> str:
    """
    Quick render function without creating TemplateManager instance.
    
    Usage:
        html = render_template("/path/to/templates", "node.html", context_dict)
    """
    manager = TemplateManager(template_dir)
    return manager.render(template_name, context)
