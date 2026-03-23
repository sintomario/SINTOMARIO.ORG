#!/usr/bin/env python3
import os
import re
from pathlib import Path
from datetime import datetime

def rebuild_sitemap(public_dir="public", base_url="https://sintomario.org"):
    public_path = Path(public_dir)
    print(f"🔍 Reconstruyendo sitemap desde {public_path}...")
    
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Homepage
    sitemap_content += '  <url>\n'
    sitemap_content += f'    <loc>{base_url}</loc>\n'
    sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
    sitemap_content += '    <changefreq>weekly</changefreq>\n'
    sitemap_content += '    <priority>1.0</priority>\n'
    sitemap_content += '  </url>\n'
    
    processed_urls = set()
    
    # Caminar por el directorio public
    for root, dirs, files in os.walk(public_path):
        if "index.html" in files:
            rel_path = Path(root).relative_to(public_path)
            if rel_path == Path("."):
                continue
                
            path_posix = rel_path.as_posix()
            
            # Ignorar admin
            if "admin" in path_posix.lower():
                continue
                
            # Evitar duplicados (por ejemplo si hay index.html en carpeta y el archivo original)
            url = f"{base_url}/{path_posix}"
            if url not in processed_urls:
                sitemap_content += '  <url>\n'
                sitemap_content += f'    <loc>{url}</loc>\n'
                sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
                sitemap_content += '    <changefreq>monthly</changefreq>\n'
                sitemap_content += '    <priority>0.6</priority>\n'
                sitemap_content += '  </url>\n'
                processed_urls.add(url)
    
    sitemap_content += '</urlset>\n'
    
    sitemap_path = public_path / "sitemap.xml"
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print(f"✅ Sitemap reconstruido con {len(processed_urls) + 1} URLs.")

if __name__ == "__main__":
    rebuild_sitemap()
