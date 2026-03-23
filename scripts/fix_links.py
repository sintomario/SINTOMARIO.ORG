#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Corregidor de Enlaces Rotos
Elimina o corrige enlaces internos que no existen
"""

import re
from pathlib import Path

class BrokenLinksFixer:
    def __init__(self, public_dir="public"):
        """Inicializar corregidor"""
        self.public_dir = Path(public_dir)
        self.fixed_count = 0
        self.error_count = 0
        
        # Mapeo de URLs incorrectas a correctas
        self.url_mapping = {
            "/cuerpo/": "/zona/",
            "/emociones/": "/contexto/",
            "/autores/": "/autores/",
            "/cuerpo/cabeza/dolor-de-cabeza/": "/zona/cabeza/",
            "/cuerpo/garganta/dolor-de-garganta/": "/zona/garganta/",
            "/cuerpo/estomago/dolor-estomacal/": "/zona/estomago/",
            "/cuerpo/corazon/dolor-pecho/": "/zona/corazon/",
            "/cuerpo/espalda/dolor-espalda/": "/zona/espalda/"
        }
    
    def _get_existing_paths(self) -> set:
        """Obtener todas las rutas que existen en public/"""
        existing_paths = set()
        
        for item in self.public_dir.rglob("index.html"):
            relative_path = item.relative_to(self.public_dir)
            if relative_path.name == "index.html":
                path = "/" + str(relative_path.parent).replace("\\", "/")
                if path != "/":
                    path = path.rstrip("/") + "/"
                existing_paths.add(path)
        
        return existing_paths
    
    def _fix_html_file(self, file_path: Path, existing_paths: set) -> bool:
        """Corrige enlaces en un archivo HTML"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as f:
                    content = f.read()
                content = content.encode('utf-8', errors='ignore').decode('utf-8')
            except Exception as e:
                self.error_count += 1
                print(f"❌ Error encoding en {file_path}: {e}")
                return False
        
        original_content = content
        
        # Corregir enlaces usando mapeo
        for wrong_url, correct_url in self.url_mapping.items():
            pattern = f'href=["\']?{re.escape(wrong_url)}["\']?'
            content = re.sub(pattern, f'href="{correct_url}"', content)
        
        # Eliminar enlaces a /buscar/ que no existe
        search_pattern = r'href=["\']?/buscar/["\']?'
        content = re.sub(search_pattern, '#', content)
        
        # Eliminar enlaces a /cuerpo/{zona}/{contexto}/ que no existen
        cuerpo_contexto_pattern = r'href=["\']?/cuerpo/([^/]+)/([^/]+)/["\']?'
        
        def replace_cuerpo_contexto(match):
            zona = match.group(1)
            contexto = match.group(2)
            # Convertir a formato correcto: /zona/{zona}/
            return f'href="/zona/{zona}/"'
        
        content = re.sub(cuerpo_contexto_pattern, replace_cuerpo_contexto, content)
        
        # Eliminar cualquier enlace a rutas que no existen
        link_pattern = r'href=["\']?(/[^"\']*)["\']?'
        
        def replace_nonexistent(match):
            url = match.group(1)
            if url not in existing_paths:
                return '#'
            return match.group(0)
        
        content = re.sub(link_pattern, replace_nonexistent, content)
        
        # Guardar si hubo cambios
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.fixed_count += 1
            print(f"✅ Corregido: {file_path.relative_to(self.public_dir)}")
            return True
        
        return False
    
    def fix_all_broken_links(self):
        """Corrige enlaces rotos en todos los archivos HTML"""
        print("🔧 SINTOMARIO.ORG - Corrección de Enlaces Rotos")
        print("=" * 50)
        
        # Obtener rutas existentes
        existing_paths = self._get_existing_paths()
        print(f"📁 Rutas existentes encontradas: {len(existing_paths)}")
        
        # Procesar todos los archivos HTML
        html_files = list(self.public_dir.rglob("*.html"))
        print(f"📄 Archivos HTML a procesar: {len(html_files)}")
        
        for html_file in html_files:
            self._fix_html_file(html_file, existing_paths)
        
        print("=" * 50)
        print(f"✅ Corregidos: {self.fixed_count} archivos")
        print(f"❌ Errores: {self.error_count} archivos")
        print(f"📊 Total procesados: {len(html_files)} archivos")


def main():
    """Función principal"""
    fixer = BrokenLinksFixer()
    fixer.fix_all_broken_links()


if __name__ == "__main__":
    main()
