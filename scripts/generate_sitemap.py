#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Generador de Sitemap
Genera sitemap.xml consistente desde los archivos HTML reales
"""

import json
from datetime import datetime
from pathlib import Path

class SitemapGenerator:
    def __init__(self, public_dir="public", config_path="config.json"):
        """Inicializar generador"""
        self.public_dir = Path(public_dir)
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
        
        self.base_url = self.config["seo"]["base_url"]
        self.sitemap_urls = []
    
    def _collect_urls(self):
        """Colectar todas las URLs desde archivos HTML"""
        html_files = list(self.public_dir.rglob("index.html"))
        
        for html_file in html_files:
            relative_path = html_file.relative_to(self.public_dir)
            
            # Convertir path a URL
            if str(relative_path) == "index.html":
                url = "/"
            else:
                # Convertir \ a / y remover index.html
                path_parts = list(relative_path.parts[:-1])  # Excluir index.html
                url = "/" + "/".join(path_parts) + "/"
            
            # Determinar prioridad y frecuencia de cambio
            priority = self._get_priority(url)
            changefreq = self._get_changefreq(url)
            
            self.sitemap_urls.append({
                "loc": f"{self.base_url}{url.rstrip('/')}",
                "lastmod": datetime.now().isoformat(),
                "changefreq": changefreq,
                "priority": priority
            })
    
    def _get_priority(self, url: str) -> float:
        """Determinar prioridad basada en tipo de página"""
        if url == "/":
            return 1.0
        elif url in ["/sobre/", "/metodologia/", "/afiliados/"]:
            return 0.8
        elif url.startswith("/zona/") or url.startswith("/contexto/"):
            return 0.7
        elif url.startswith("/autores/"):
            return 0.6
        else:
            return 0.5
    
    def _get_changefreq(self, url: str) -> str:
        """Determinar frecuencia de cambio"""
        if url == "/":
            return "daily"
        elif url.startswith("/zona/") or url.startswith("/contexto/"):
            return "weekly"
        else:
            return "monthly"
    
    def _generate_xml(self) -> str:
        """Generar XML del sitemap"""
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        
        # Ordenar URLs por prioridad descendente
        sorted_urls = sorted(self.sitemap_urls, key=lambda x: (-x["priority"], x["loc"]))
        
        for url_data in sorted_urls:
            xml_lines.extend([
                '  <url>',
                f'    <loc>{url_data["loc"]}</loc>',
                f'    <lastmod>{url_data["lastmod"]}</lastmod>',
                f'    <changefreq>{url_data["changefreq"]}</changefreq>',
                f'    <priority>{url_data["priority"]:.1f}</priority>',
                '  </url>'
            ])
        
        xml_lines.append('</urlset>')
        
        return '\n'.join(xml_lines)
    
    def generate_sitemap(self):
        """Generar y guardar sitemap.xml"""
        print("🗺️ SINTOMARIO.ORG - Generador de Sitemap")
        print("=" * 50)
        
        # Colectar URLs
        self._collect_urls()
        print(f"📄 URLs encontradas: {len(self.sitemap_urls)}")
        
        # Generar XML
        xml_content = self._generate_xml()
        
        # Guardar sitemap
        sitemap_path = self.public_dir / "sitemap.xml"
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        
        print(f"✅ Sitemap guardado: {sitemap_path.relative_to(self.public_dir)}")
        
        # Estadísticas
        stats = {
            "total_urls": len(self.sitemap_urls),
            "priority_1_0": len([u for u in self.sitemap_urls if u["priority"] == 1.0]),
            "priority_0_8": len([u for u in self.sitemap_urls if u["priority"] == 0.8]),
            "priority_0_7": len([u for u in self.sitemap_urls if u["priority"] == 0.7]),
            "priority_0_6": len([u for u in self.sitemap_urls if u["priority"] == 0.6]),
            "priority_0_5": len([u for u in self.sitemap_urls if u["priority"] == 0.5])
        }
        
        print("\n📊 Estadísticas:")
        for priority, count in stats.items():
            if priority.startswith("priority"):
                print(f"  {priority}: {count} URLs")
        
        return stats


def main():
    """Función principal"""
    generator = SitemapGenerator()
    generator.generate_sitemap()


if __name__ == "__main__":
    main()
