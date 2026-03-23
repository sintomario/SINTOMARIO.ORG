#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Helper de Metadata HTML
Genera metadata consistente para todas las páginas
"""

import json
from datetime import datetime
from pathlib import Path

class MetadataHelper:
    def __init__(self, config_path="config.json"):
        """Cargar configuración"""
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
        
        self.base_url = self.config["seo"]["base_url"]
        self.site_name = self.config["project"]["name"]
        self.author = self.config["seo"]["author"]
        self.locale = self.config["seo"]["locale"]
        self.twitter_handle = self.config["seo"]["twitter_handle"]
    
    def generate_canonical(self, path: str) -> str:
        """Generar URL canónica"""
        if path == "/":
            return self.base_url
        return f"{self.base_url}{path.rstrip('/')}/"
    
    def generate_title(self, title: str, path: str) -> str:
        """Genera título optimizado"""
        if len(title) > 55:
            title = title[:52] + "..."
        
        if path == "/":
            return title
        
        return f"{title} | {self.site_name}"
    
    def generate_description(self, description: str) -> str:
        """Genera descripción optimizada"""
        if len(description) > 155:
            description = description[:152] + "..."
        return description
    
    def generate_opengraph(self, title: str, description: str, path: str) -> dict:
        """Genera metadatos Open Graph"""
        return {
            "og:title": title,
            "og:description": description,
            "og:url": self.generate_canonical(path),
            "og:site_name": self.site_name,
            "og:type": "article" if path != "/" else "website",
            "og:locale": self.locale
        }
    
    def generate_twitter_card(self, title: str, description: str) -> dict:
        """Genera metadatos Twitter Card"""
        return {
            "twitter:card": "summary_large_image",
            "twitter:site": self.twitter_handle,
            "twitter:creator": self.twitter_handle,
            "twitter:title": title,
            "twitter:description": description
        }
    
    def generate_schema(self, title: str, description: str, path: str, page_type: str = "WebPage") -> dict:
        """Genera Schema.org JSON-LD"""
        schema = {
            "@context": "https://schema.org",
            "@type": page_type,
            "name": title,
            "description": description,
            "url": self.generate_canonical(path),
            "inLanguage": self.locale,
            "author": {
                "@type": "Organization",
                "name": self.site_name,
                "url": self.base_url
            },
            "publisher": {
                "@type": "Organization",
                "name": self.site_name,
                "url": self.base_url
            }
        }
        
        if page_type == "Article":
            schema["datePublished"] = datetime.now().isoformat()
            schema["dateModified"] = datetime.now().isoformat()
        
        return schema
    
    def generate_head_metadata(self, title: str, description: str, path: str, page_type: str = "WebPage") -> str:
        """Genera HTML head completo con metadata"""
        canonical = self.generate_canonical(path)
        full_title = self.generate_title(title, path)
        full_description = self.generate_description(description)
        
        og_data = self.generate_opengraph(full_title, full_description, path)
        twitter_data = self.generate_twitter_card(full_title, full_description)
        schema_data = self.generate_schema(full_title, full_description, path, page_type)
        
        # Generar HTML
        metadata_html = f"""    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{full_title}</title>
    <meta name="description" content="{full_description}">
    <meta name="author" content="{self.author}">
    <link rel="canonical" href="{canonical}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{og_data['og:title']}">
    <meta property="og:description" content="{og_data['og:description']}">
    <meta property="og:url" content="{og_data['og:url']}">
    <meta property="og:site_name" content="{og_data['og:site_name']}">
    <meta property="og:type" content="{og_data['og:type']}">
    <meta property="og:locale" content="{og_data['og:locale']}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="{twitter_data['twitter:card']}">
    <meta name="twitter:site" content="{twitter_data['twitter:site']}">
    <meta name="twitter:creator" content="{twitter_data['twitter:creator']}">
    <meta name="twitter:title" content="{twitter_data['twitter:title']}">
    <meta name="twitter:description" content="{twitter_data['twitter:description']}">
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
{json.dumps(schema_data, indent=6, ensure_ascii=False)}
    </script>"""
        
        return metadata_html


def main():
    """Función de prueba"""
    helper = MetadataHelper()
    
    # Ejemplo de uso
    metadata = helper.generate_head_metadata(
        title="Cabeza - Bloqueo Emocional",
        description="Explora el significado simbólico del dolor de cabeza como bloqueo emocional. Interpretación holística desde múltiples perspectivas.",
        path="/cuerpo/cabeza/bloqueo/",
        page_type="Article"
    )
    
    print(metadata)


if __name__ == "__main__":
    main()
