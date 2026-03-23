#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Corregidor de Metadata HTML
Aplica metadata consistente a todas las páginas HTML
"""

import json
import re
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
        from datetime import datetime
        
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

class MetadataFixer:
    def __init__(self, public_dir="public"):
        """Inicializar corregidor"""
        self.public_dir = Path(public_dir)
        self.helper = MetadataHelper()
        self.config = self._load_config()
        self.fixed_count = 0
        self.error_count = 0
    
    def _load_config(self):
        """Cargar configuración"""
        with open("config.json", "r", encoding="utf-8") as f:
            return json.load(f)
    
    def _extract_page_info(self, html_content: str, file_path: Path) -> dict:
        """Extraer información de la página desde HTML"""
        # Extraer título existente
        title_match = re.search(r'<title>([^<]+)</title>', html_content)
        existing_title = title_match.group(1) if title_match else ""
        
        # Extraer descripción existente
        desc_match = re.search(r'<meta name="description" content="([^"]+)"', html_content)
        existing_desc = desc_match.group(1) if desc_match else ""
        
        # Determinar tipo de página desde path
        relative_path = file_path.relative_to(self.public_dir)
        path_str = "/" + str(relative_path.parent) if relative_path.parent != Path(".") else "/"
        
        if "zona" in path_str:
            page_type = "WebPage"
            # Extraer nombre de zona del título o path
            zona_name = relative_path.parent.name.replace("-", " ").title()
            title = f"{zona_name} - Zona Corporal"
            description = f"Explora el significado holístico de {zona_name.lower()}. Lectura simbólica y contexto emocional desde múltiples perspectivas."
        elif "contexto" in path_str:
            page_type = "WebPage"
            contexto_name = relative_path.parent.name.replace("-", " ").title()
            title = f"{contexto_name} - Contexto Emocional"
            description = f"Comprende el {contexto_name.lower()} como patrón emocional. Su manifestación corporal y significado simbólico."
        elif "autores" in path_str:
            page_type = "WebPage"
            author_name = relative_path.stem.replace("-", " ").title()
            title = f"{author_name} - Perspectiva Teórica"
            description = f"Explora la perspectiva de {author_name} sobre la conexión mente-cuerpo y el significado de los síntomas."
        elif path_str in ["/sobre/", "/metodologia/", "/afiliados/"]:
            page_type = "WebPage"
            page_name = path_str.strip("/").title()
            title = f"{page_name} - {self.config['project']['name']}"
            description = self.config["seo"]["default_description"]
        else:
            page_type = "WebPage"
            title = existing_title or f"Página - {self.config['project']['name']}"
            description = existing_desc or self.config["seo"]["default_description"]
        
        return {
            "title": title,
            "description": description,
            "path": path_str,
            "page_type": page_type
        }
    
    def _apply_metadata_to_html(self, html_content: str, page_info: dict) -> str:
        """Aplica metadata al HTML"""
        # Generar metadata completa
        metadata_html = self.helper.generate_head_metadata(
            title=page_info["title"],
            description=page_info["description"],
            path=page_info["path"],
            page_type=page_info["page_type"]
        )
        
        # Reemplazar sección head
        head_pattern = r'<head>.*?</head>'
        new_head = f"<head>\n{metadata_html}\n</head>"
        
        if re.search(head_pattern, html_content, re.DOTALL):
            html_fixed = re.sub(head_pattern, new_head, html_content, flags=re.DOTALL)
        else:
            # Si no encuentra head, insertar después de <html>
            html_fixed = html_content.replace("<html>", f"<html>\n{new_head}")
        
        return html_fixed
    
    def _remove_broken_search_links(self, html_content: str) -> str:
        """Elimina enlaces a /buscar/ que no existe"""
        # Eliminar enlaces a buscar
        search_link_pattern = r'href=["\']?/buscar/["\']?'
        html_fixed = re.sub(search_link_pattern, '#', html_content)
        
        # Eliminar elementos de navegación de búsqueda
        search_nav_pattern = r'<[^>]*buscar[^>]*>.*?</[^>]*>'
        html_fixed = re.sub(search_nav_pattern, '', html_content, flags=re.DOTALL)
        
        return html_fixed
    
    def _fix_double_slashes(self, html_content: str) -> str:
        """Corrige slashes dobles en URLs"""
        # Corregir slashes dobles en enlaces
        double_slash_pattern = r'href=["\']?https://sintomario\.org/([^"\']*)\\\\'
        html_fixed = re.sub(double_slash_pattern, r'href="https://sintomario.org/\1', html_content)
        
        return html_fixed
    
    def fix_html_file(self, file_path: Path) -> bool:
        """Corrige un archivo HTML específico"""
        try:
            # Leer archivo con encoding robusto
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
            except UnicodeDecodeError:
                # Si falla UTF-8, intentar con latin-1 y convertir a UTF-8
                with open(file_path, 'r', encoding='latin-1') as f:
                    html_content = f.read()
                html_content = html_content.encode('utf-8', errors='ignore').decode('utf-8')
            
            # Extraer información de página
            page_info = self._extract_page_info(html_content, file_path)
            
            # Aplicar correcciones
            html_fixed = self._apply_metadata_to_html(html_content, page_info)
            html_fixed = self._remove_broken_search_links(html_fixed)
            html_fixed = self._fix_double_slashes(html_fixed)
            
            # Guardar archivo corregido
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_fixed)
            
            self.fixed_count += 1
            print(f"✅ Corregido: {file_path.relative_to(self.public_dir)}")
            return True
            
        except Exception as e:
            self.error_count += 1
            print(f"❌ Error en {file_path}: {e}")
            return False
    
    def fix_all_html_files(self):
        """Corrige todos los archivos HTML"""
        print("🔧 SINTOMARIO.ORG - Corrección de Metadata HTML")
        print("=" * 50)
        
        html_files = list(self.public_dir.rglob("*.html"))
        print(f"📄 Encontrados {len(html_files)} archivos HTML")
        
        for html_file in html_files:
            self.fix_html_file(html_file)
        
        print("=" * 50)
        print(f"✅ Corregidos: {self.fixed_count} archivos")
        print(f"❌ Errores: {self.error_count} archivos")
        print(f"📊 Total procesados: {len(html_files)} archivos")


def main():
    """Función principal"""
    fixer = MetadataFixer()
    fixer.fix_all_html_files()


if __name__ == "__main__":
    main()
