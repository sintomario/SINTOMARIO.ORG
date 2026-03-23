#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Auditor Final Real
Validación binaria y reproducible del estado de producción
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple
import re
from datetime import datetime

class FinalAuditor:
    def __init__(self, public_dir: str = "public"):
        """Inicializar auditor con directorio de output"""
        self.public_dir = Path(public_dir)
        self.config = self._load_config()
        self.errors = []
        self.warnings = []
        self.results = {}
        
    def _load_config(self) -> Dict:
        """Cargar configuración unificada"""
        try:
            with open("config.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Error cargando config.json: {e}")
            sys.exit(1)
    
    def _add_error(self, category: str, message: str, severity: str = "critical"):
        """Agregar error al reporte"""
        self.errors.append({
            "category": category,
            "message": message,
            "severity": severity
        })
    
    def _add_warning(self, category: str, message: str):
        """Agregar warning al reporte"""
        self.warnings.append({
            "category": category,
            "message": message
        })
    
    def check_critical_files(self) -> bool:
        """Verificar archivos críticos existen"""
        print("🔍 Verificando archivos críticos...")
        
        critical_files = [
            "index.html",
            "sitemap.xml", 
            "robots.txt",
            "CNAME"
        ]
        
        all_ok = True
        
        for file_name in critical_files:
            file_path = self.public_dir / file_name
            if file_path.exists():
                print(f"  ✅ {file_name}")
            else:
                self._add_error("critical_files", f"Archivo crítico faltante: {file_name}")
                all_ok = False
        
        return all_ok
    
    def check_html_pages(self) -> bool:
        """Verificar todas las páginas HTML"""
        print("🔍 Verificando páginas HTML...")
        
        html_files = list(self.public_dir.rglob("*.html"))
        all_ok = True
        
        for html_file in html_files:
            relative_path = html_file.relative_to(self.public_dir)
            
            # Leer contenido
            try:
                with open(html_file, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception as e:
                self._add_error("html_pages", f"No se puede leer {relative_path}: {e}")
                all_ok = False
                continue
            
            # Verificar metadata básica
            self._check_html_metadata(content, relative_path)
            
            # Verificar placeholders
            self._check_placeholders(content, relative_path)
            
            # Verificar enlaces rotos
            self._check_broken_links(content, relative_path)
        
        return all_ok
    
    def _check_html_metadata(self, content: str, file_path: Path) -> None:
        """Verificar metadata HTML básica"""
        # Ignorar páginas con noindex explícito para ciertos checks
        is_noindex = 'content="noindex' in content.lower()
        
        checks = {
            "title": r"<title>[^<]{10,60}</title>",
            "description": r'<meta name="description" content="[^"]{30,155}"',
            "canonical": r'<link rel="canonical" href="https://[^"]+"',
            "og_title": r'<meta property="og:title" content="[^"]+"',
            "og_description": r'<meta property="og:description" content="[^"]+"',
            "twitter_card": r'<meta name="twitter:card" content="[^"]+"',
            "schema": r'"@type":\s*"(Article|WebPage|FAQPage)"'
        }
        
        # Si es noindex, solo verificamos título y descripción básica (o nada)
        # Pero para este proyecto, mejor ignoramos admin completamente de este check
        if "admin" in str(file_path).lower():
            return

        for check_name, pattern in checks.items():
            if not re.search(pattern, content, re.IGNORECASE):
                self._add_error("html_metadata", f"Falta {check_name} en {file_path}")
    
    def _check_placeholders(self, content: str, file_path: Path) -> None:
        """Verificar que no queden placeholders sin resolver"""
        placeholder_patterns = [
            r"\{\{\s*[^}]+\s*\}\}",
            r"\{\%\s*[^%]+\s*\%\}",
            r"\{\#\s*[^#]+\s*\#\}"
        ]
        
        for pattern in placeholder_patterns:
            matches = re.findall(pattern, content)
            if matches:
                self._add_error("placeholders", f"Placeholders sin resolver en {file_path}: {len(matches)}")
    
    def _check_broken_links(self, content: str, file_path: Path) -> None:
        """Verificar enlaces internos rotos"""
        # Encontrar enlaces locales
        local_links = re.findall(r'href="(/[^"]*)"', content)
        
        for link in local_links:
            # Ignorar enlaces externos y anchors
            if link.startswith(("http://", "https://", "#", "mailto:", "tel:")):
                continue
                
            # Convertir a path del sistema de archivos
            # Si el enlace no tiene extensión, puede referirse a un directorio con index.html
            base_path = self.public_dir / link.lstrip("/")
            
            # 1. Probar ruta exacta (archivo)
            # 2. Probar ruta como directorio + index.html
            link_path = base_path
            path_with_index = base_path / "index.html"
            
            if not (link_path.exists() or path_with_index.exists()):
                self._add_error("broken_links", f"Enlace roto en {file_path}: {link}")
    
    def check_sitemap_consistency(self) -> bool:
        """Verificar consistencia de sitemap"""
        print("🔍 Verificando consistencia de sitemap...")
        
        sitemap_path = self.public_dir / "sitemap.xml"
        if not sitemap_path.exists():
            self._add_error("sitemap", "sitemap.xml no existe")
            return False
        
        try:
            with open(sitemap_path, "r", encoding="utf-8") as f:
                sitemap_content = f.read()
        except Exception as e:
            self._add_error("sitemap", f"No se puede leer sitemap.xml: {e}")
            return False
        
        # Extraer URLs del sitemap
        sitemap_urls = set(re.findall(r"<loc>(https://[^<]+)</loc>", sitemap_content))
        
        # Encontrar todos los archivos HTML
        html_files = set()
        for html_file in self.public_dir.rglob("*.html"):
            relative_path = html_file.relative_to(self.public_dir)
            
            # Ignorar admin y otros archivos no indexables
            if "admin" in str(relative_path).lower():
                continue
                
            if str(relative_path) != "index.html":
                url_path = f"https://sintomario.org/{relative_path.parent.as_posix()}/{relative_path.stem}"
            else:
                url_path = f"https://sintomario.org/{relative_path.parent.as_posix()}" if relative_path.parent != Path(".") else "https://sintomario.org"
            
            html_files.add(url_path.rstrip("/").replace("/index", ""))
        
        # Comparar
        missing_in_sitemap = html_files - sitemap_urls
        extra_in_sitemap = sitemap_urls - html_files
        
        if missing_in_sitemap:
            self._add_error("sitemap", f"URLs faltantes en sitemap: {missing_in_sitemap}")
        
        if extra_in_sitemap:
            self._add_warning("sitemap", f"URLs extra en sitemap: {extra_in_sitemap}")
        
        return len(missing_in_sitemap) == 0
    
    def check_robots_txt(self) -> bool:
        """Verificar robots.txt"""
        print("🔍 Verificando robots.txt...")
        
        robots_path = self.public_dir / "robots.txt"
        if not robots_path.exists():
            self._add_error("robots", "robots.txt no existe")
            return False
        
        try:
            with open(robots_path, "r", encoding="utf-8") as f:
                robots_content = f.read()
        except Exception as e:
            self._add_error("robots", f"No se puede leer robots.txt: {e}")
            return False
        
        # Verificar contenido básico
        required_content = [
            "User-agent: *",
            "Allow: /",
            "Sitemap: https://sintomario.org/sitemap.xml"
        ]
        
        for required in required_content:
            if required not in robots_content:
                self._add_error("robots", f"Falta en robots.txt: {required}")
        
        return True
    
    def check_admin_noindex(self) -> bool:
        """Verificar que /admin/ tenga noindex"""
        print("🔍 Verificando noindex en /admin/...")
        
        admin_files = list(self.public_dir.glob("**/admin*.html"))
        
        for admin_file in admin_files:
            try:
                with open(admin_file, "r", encoding="utf-8") as f:
                    content = f.read()
                
                if "noindex" not in content:
                    self._add_error("admin_noindex", f"Página admin sin noindex: {admin_file.relative_to(self.public_dir)}")
                
            except Exception as e:
                self._add_error("admin_noindex", f"No se puede verificar {admin_file}: {e}")
        
        return len(admin_files) == 0
    
    def check_search_consistency(self) -> bool:
        """Verificar consistencia de búsqueda"""
        print("🔍 Verificando consistencia de búsqueda...")
        
        search_enabled = self.config.get("features", {}).get("search_enabled", False)
        search_path = self.public_dir / "buscar" / "index.html"
        
        if search_enabled and not search_path.exists():
            self._add_error("search", "Búsqueda habilitada pero /buscar/ no existe")
        
        if not search_enabled and search_path.exists():
            self._add_warning("search", "Búsqueda deshabilitada pero /buscar/ existe")
        
        return True
    
    def check_assets_existence(self) -> bool:
        """Verificar que los assets declarados existan"""
        print("🔍 Verificando existencia de assets...")
        
        # Buscar referencias a CSS y JS
        html_files = list(self.public_dir.rglob("*.html"))
        all_ok = True
        
        for html_file in html_files:
            try:
                with open(html_file, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception:
                continue
            
            # Encontrar assets locales
            css_assets = re.findall(r'href="(/[^"]*\.css)"', content)
            js_assets = re.findall(r'src="(/[^"]*\.js)"', content)
            img_assets = re.findall(r'src="(/[^"]*\.(jpg|jpeg|png|gif|svg|webp))"', content)
            
            all_assets = css_assets + js_assets + img_assets
            
            for asset in all_assets:
                asset_path = self.public_dir / asset.lstrip("/")
                if not asset_path.exists():
                    self._add_error("assets", f"Asset faltante: {asset} (referenciado en {html_file.relative_to(self.public_dir)})")
                    all_ok = False
        
        return all_ok
    
    def check_url_consistency(self) -> bool:
        """Verificar consistencia de política de URLs"""
        print("🔍 Verificando consistencia de URLs...")
        
        # Verificar política de slash final
        base_url = self.config.get("seo", {}).get("base_url", "https://sintomario.org")
        
        # Buscar URLs en el contenido
        html_files = list(self.public_dir.rglob("*.html"))
        inconsistencies = []
        
        for html_file in html_files:
            try:
                with open(html_file, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception:
                continue
            
            # Buscar URLs internas
            internal_urls = re.findall(rf'href="{re.escape(base_url)}([^"]*)"', content)
            
            for url_suffix in internal_urls:
                if url_suffix.endswith("/") and len(url_suffix) > 1:
                    inconsistencies.append(f"{base_url}{url_suffix}")
        
        if inconsistencies:
            self._add_warning("url_consistency", f"Inconsistencias de URL detectadas: {inconsistencies[:5]}")
        
        return True
    
    def run_full_audit(self) -> Dict:
        """Ejecutar auditoría completa"""
        print("🔍 SINTOMARIO.ORG - Auditor Final Real")
        print("=" * 50)
        
        start_time = datetime.now()
        
        # Ejecutar todas las validaciones
        checks = [
            ("critical_files", self.check_critical_files),
            ("html_pages", self.check_html_pages),
            ("sitemap_consistency", self.check_sitemap_consistency),
            ("robots_txt", self.check_robots_txt),
            ("admin_noindex", self.check_admin_noindex),
            ("search_consistency", self.check_search_consistency),
            ("assets_existence", self.check_assets_existence),
            ("url_consistency", self.check_url_consistency)
        ]
        
        results = {}
        critical_errors = 0
        
        for check_name, check_func in checks:
            try:
                results[check_name] = check_func()
                if not results[check_name]:
                    critical_errors += 1
            except Exception as e:
                self._add_error("audit_error", f"Error en {check_name}: {e}")
                results[check_name] = False
                critical_errors += 1
        
        # Generar reporte final
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        report = {
            "timestamp": start_time.isoformat(),
            "duration_seconds": duration,
            "status": "passed" if critical_errors == 0 else "failed",
            "critical_errors": critical_errors,
            "total_errors": len(self.errors),
            "total_warnings": len(self.warnings),
            "checks": results,
            "errors": self.errors,
            "warnings": self.warnings,
            "summary": {
                "html_pages_checked": len(list(self.public_dir.rglob("*.html"))),
                "critical_files_found": len(["index.html", "sitemap.xml", "robots.txt", "CNAME"]) - sum(1 for e in self.errors if e["category"] == "critical_files"),
                "sitemap_urls": len(set(re.findall(r"<loc>(https://[^<]+)</loc>", (self.public_dir / "sitemap.xml").read_text() if (self.public_dir / "sitemap.xml").exists() else ""))),
                "admin_pages": len(list(self.public_dir.glob("**/admin*.html")))
            }
        }
        
        # Guardar reporte
        reports_dir = Path("reports")
        reports_dir.mkdir(exist_ok=True)
        
        with open(reports_dir / "final-audit.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Mostrar resumen
        print("\n" + "=" * 50)
        print("📊 RESULTADO DE AUDITORÍA")
        print("=" * 50)
        
        if critical_errors == 0:
            print("✅ AUDITORÍA APROBADA - Lista para producción")
        else:
            print(f"❌ AUDITORÍA FALLIDA - {critical_errors} errores críticos")
        
        print(f"📄 Reporte guardado: reports/final-audit.json")
        print(f"⏱️ Duración: {duration:.2f} segundos")
        
        return report


def main():
    """Función principal"""
    auditor = FinalAuditor()
    report = auditor.run_full_audit()
    
    # Exit code basado en resultado
    sys.exit(0 if report["status"] == "passed" else 1)


if __name__ == "__main__":
    main()
