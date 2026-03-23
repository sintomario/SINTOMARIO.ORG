#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Motor de Fixes Automáticos
Implementa correcciones automáticas para los issues detectados en auditoría.
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

class SintomarioAutoFixer:
    """Motor de fixes automáticos para SINTOMARIO.ORG."""
    
    def __init__(self, public_dir: str = "public"):
        self.public_dir = Path(public_dir)
        self.fixes_applied = []
        self.fixes_failed = []
        self.stats = {
            'files_processed': 0,
            'fixes_applied': 0,
            'fixes_failed': 0
        }
    
    def fix_seo_titles(self, content: str, url: str) -> str:
        """Fix automático para titles SEO."""
        # Extraer entidad y contexto de URL
        url_parts = url.replace('https://sintomario.org/', '').replace('.html', '').split('-')
        if len(url_parts) >= 2:
            entidad = url_parts[0].replace('_', ' ').title()
            contexto = url_parts[1].replace('_', ' ').title()
            
            # Generar title optimizado
            new_title = f"{entidad} por {contexto} | SINTOMARIO.ORG"
            
            # Reemplazar title existente
            title_pattern = r'<title[^>]*>[^<]+</title>'
            new_title_tag = f'<title>{new_title}</title>'
            
            if re.search(title_pattern, content):
                content = re.sub(title_pattern, new_title_tag, content)
                self.fixes_applied.append({
                    'file': url,
                    'type': 'seo_title',
                    'old': 'Title inválido',
                    'new': new_title
                })
                return content
        
        return content
    
    def fix_seo_descriptions(self, content: str, url: str) -> str:
        """Fix automático para meta descriptions."""
        # Extraer entidad y contexto
        url_parts = url.replace('https://sintomario.org/', '').replace('.html', '').split('-')
        if len(url_parts) >= 2:
            entidad = url_parts[0].replace('_', ' ').lower()
            contexto = url_parts[1].replace('_', ' ').lower()
            
            # Generar description optimizada
            new_description = f"Explora cómo {contexto} se manifiesta en {entidad}. Enfoque holístico para comprensión integral del síntoma y bienestar."
            
            # Reemplazar o añadir meta description
            desc_pattern = r'<meta[^>]*name=["\']description["\'][^>]*content=["\'][^"\']*["\']'
            new_desc_tag = f'<meta name="description" content="{new_description}">'
            
            if re.search(desc_pattern, content, re.IGNORECASE):
                content = re.sub(desc_pattern, new_desc_tag, content, flags=re.IGNORECASE)
                self.fixes_applied.append({
                    'file': url,
                    'type': 'seo_description',
                    'old': 'Description inválida',
                    'new': new_description
                })
            else:
                # Añadir en head si no existe
                head_pattern = r'(<head[^>]*>)'
                if re.search(head_pattern, content):
                    content = re.sub(head_pattern, f'\\1{new_desc_tag}\n', content)
                    self.fixes_applied.append({
                        'file': url,
                        'type': 'seo_description_added',
                        'old': 'Sin description',
                        'new': new_description
                    })
        
        return content
    
    def fix_schema_org(self, content: str, url: str) -> str:
        """Fix automático para Schema.org JSON-LD."""
        # Extraer información de la página
        url_parts = url.replace('https://sintomario.org/', '').replace('.html', '').split('-')
        if len(url_parts) >= 2:
            entidad = url_parts[0].replace('_', ' ').title()
            contexto = url_parts[1].replace('_', ' ').title()
            
            # Generar schema
            schema_data = {
                "@context": "https://schema.org",
                "@type": "MedicalWebPage",
                "name": f"{entidad} por {contexto}",
                "description": f"Exploración holística de {entidad.lower()} en contexto de {contexto.lower()}",
                "url": url,
                "datePublished": "2026-03-23",
                "dateModified": datetime.now().strftime("%Y-%m-%d"),
                "author": {
                    "@type": "Organization",
                    "name": "SINTOMARIO.ORG",
                    "url": "https://sintomario.org"
                },
                "medicalAudience": "Patient",
                "about": "Síntomas y salud holística",
                "mainContentOfPage": {
                    "@type": "WebPageElement",
                    "cssSelector": ".main-content"
                }
            }
            
            schema_json = json.dumps(schema_data, indent=2, ensure_ascii=False)
            schema_tag = f'<script type="application/ld+json">\n{schema_json}\n</script>'
            
            # Buscar schema existente
            existing_schema = re.search(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>([^<]+)</script>', content, re.IGNORECASE)
            
            if existing_schema:
                # Reemplazar schema existente
                content = re.sub(
                    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>[^<]+</script>',
                    schema_tag,
                    content,
                    flags=re.IGNORECASE | re.DOTALL
                )
                self.fixes_applied.append({
                    'file': url,
                    'type': 'schema_updated',
                    'old': 'Schema inválido',
                    'new': 'Schema MedicalWebPage válido'
                })
            else:
                # Añadir schema en head
                head_pattern = r'(</head>)'
                if re.search(head_pattern, content):
                    content = re.sub(head_pattern, f'{schema_tag}\\n\\1', content)
                    self.fixes_applied.append({
                        'file': url,
                        'type': 'schema_added',
                        'old': 'Sin schema',
                        'new': 'Schema MedicalWebPage añadido'
                    })
        
        return content
    
    def fix_canonical_urls(self, content: str, url: str) -> str:
        """Fix automático para URLs canónicas."""
        # Buscar canonical existente
        canonical_pattern = r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'][^"\']*["\']'
        existing_canonical = re.search(canonical_pattern, content, re.IGNORECASE)
        
        new_canonical = f'<link rel="canonical" href="{url}">'
        
        if existing_canonical:
            # Reemplazar canonical existente
            content = re.sub(canonical_pattern, new_canonical, content, flags=re.IGNORECASE)
            self.fixes_applied.append({
                'file': url,
                'type': 'canonical_fixed',
                'old': 'Canonical inválida',
                'new': url
            })
        else:
            # Añadir canonical en head
            head_pattern = r'(</head>)'
            if re.search(head_pattern, content):
                content = re.sub(head_pattern, f'{new_canonical}\\n\\1', content)
                self.fixes_applied.append({
                    'file': url,
                    'type': 'canonical_added',
                    'old': 'Sin canonical',
                    'new': url
                })
        
        return content
    
    def fix_alt_text(self, content: str, url: str) -> str:
        """Fix automático para alt text en imágenes."""
        # Encontrar imágenes sin alt
        img_pattern = r'<img([^>]*?)>'
        imgs_without_alt = []
        
        def add_alt_to_img(match):
            img_attrs = match.group(1)
            
            # Si ya tiene alt, no modificar
            if 'alt=' in img_attrs.lower():
                return match.group(0)
            
            # Extraer src para generar alt descriptivo
            src_match = re.search(r'src=["\']([^"\']+)["\']', img_attrs)
            if src_match:
                src = src_match.group(1)
                # Generar alt basado en filename
                filename = Path(src).stem
                alt_text = filename.replace('-', ' ').replace('_', ' ').title()
                
                # Añadir alt al img
                new_img = match.group(0).replace('>', f' alt="{alt_text}">')
                
                self.fixes_applied.append({
                    'file': url,
                    'type': 'alt_added',
                    'old': f'Imagen sin alt: {src}',
                    'new': f'Alt añadido: {alt_text}'
                })
                
                return new_img
            
            return match.group(0)
        
        # Procesar todas las imágenes
        content = re.sub(img_pattern, add_alt_to_img, content)
        
        return content
    
    def fix_lazy_loading(self, content: str, url: str) -> str:
        """Fix automático para lazy loading en imágenes."""
        # Añadir loading="lazy" a imágenes que no lo tienen
        img_pattern = r'<img([^>]*?)>'
        
        def add_lazy_loading(match):
            img_attrs = match.group(1)
            
            # Si ya tiene loading, no modificar
            if 'loading=' in img_attrs.lower():
                return match.group(0)
            
            # Añadir loading="lazy"
            new_img = match.group(0).replace('>', ' loading="lazy">')
            
            self.fixes_applied.append({
                'file': url,
                'type': 'lazy_loading_added',
                'old': 'Imagen sin lazy loading',
                'new': 'Loading="lazy" añadido'
            })
            
            return new_img
        
        content = re.sub(img_pattern, add_lazy_loading, content)
        
        return content
    
    def fix_skip_links(self, content: str, url: str) -> str:
        """Fix automático para skip links."""
        # Buscar si ya existe skip link
        skip_link_pattern = r'<a[^>]*href=["\']#main["\'][^>]*>.*saltar.*</a>'
        if re.search(skip_link_pattern, content, re.IGNORECASE):
            return content
        
        # Añadir skip link después de <body>
        body_pattern = r'(<body[^>]*>)'
        skip_link = '<a href="#main" class="skip-link">Saltar al contenido principal</a>'
        
        if re.search(body_pattern, content):
            content = re.sub(body_pattern, f'\\1{skip_link}\\n', content)
            self.fixes_applied.append({
                'file': url,
                'type': 'skip_link_added',
                'old': 'Sin skip link',
                'new': 'Skip link añadido'
            })
        
        return content
    
    def fix_lang_attribute(self, content: str, url: str) -> str:
        """Fix automático para lang attribute."""
        # Buscar lang existente
        lang_pattern = r'<html[^>]*lang=["\'][^"\']*["\']'
        existing_lang = re.search(lang_pattern, content, re.IGNORECASE)
        
        if existing_lang:
            # Actualizar lang existente
            content = re.sub(lang_pattern, '<html lang="es"', content, flags=re.IGNORECASE)
            self.fixes_applied.append({
                'file': url,
                'type': 'lang_fixed',
                'old': 'Lang inválido',
                'new': 'lang="es"'
            })
        else:
            # Añadir lang a html
            html_pattern = r'<html'
            if re.search(html_pattern, content):
                content = re.sub(html_pattern, '<html lang="es"', content)
                self.fixes_applied.append({
                    'file': url,
                    'type': 'lang_added',
                    'old': 'Sin lang',
                    'new': 'lang="es" añadido'
                })
        
        return content
    
    def fix_ymyl_disclaimer(self, content: str, url: str) -> str:
        """Fix automático para YMYL disclaimer."""
        # Buscar si ya existe disclaimer
        disclaimer_pattern = r'(disclaimer|aviso|importante).*?(médico|profesional|salud)'
        if re.search(disclaimer_pattern, content, re.IGNORECASE):
            return content
        
        # Añadir disclaimer al final del contenido principal
        disclaimer = '''
<div class="ymyl-disclaimer">
    <h3>Importante</h3>
    <p>La información proporcionada en SINTOMARIO.ORG tiene fines educativos y no debe reemplazar el consejo médico profesional. Si experimentas síntomas severos, consulta con un profesional de la salud calificado.</p>
    <p>Recursos oficiales: <a href="https://www.who.int" target="_blank" rel="noopener">Organización Mundial de la Salud</a> | <a href="https://www.nih.gov" target="_blank" rel="noopener">National Institutes of Health</a></p>
</div>
        '''
        
        # Buscar final del contenido principal
        main_content_pattern = r'(</main>|</div[^>]*class=["\'][^"\']*main[^"\']*["\'][^>]*>)'
        if re.search(main_content_pattern, content):
            content = re.sub(main_content_pattern, f'{disclaimer}\\n\\1', content)
            self.fixes_applied.append({
                'file': url,
                'type': 'ymyl_disclaimer_added',
                'old': 'Sin YMYL disclaimer',
                'new': 'Disclaimer YMYL añadido'
            })
        
        return content
    
    def fix_affiliate_disclosure(self, content: str, url: str) -> str:
        """Fix automático para affiliate disclosure."""
        # Buscar si ya existe disclosure
        disclosure_pattern = r'(afiliado|affiliate|comisión|ganancia)'
        if re.search(disclosure_pattern, content, re.IGNORECASE):
            return content
        
        # Añadir disclosure antes del primer enlace de afiliado
        disclosure = '''
<div class="affiliate-disclosure">
    <p><strong>Divulgación de afiliados:</strong> SINTOMARIO.ORG participa en el programa de afiliados de Amazon. Si compras a través de nuestros enlaces, podemos ganar una comisión sin costo adicional para ti.</p>
</div>
        '''
        
        # Buscar primer enlace de Amazon
        amazon_link_pattern = r'(<a[^>]*href=["\'][^"\']*amazon[^"\']*["\'][^>]*>)'
        if re.search(amazon_link_pattern, content):
            content = re.sub(amazon_link_pattern, f'{disclaimer}\\n\\1', content, count=1)
            self.fixes_applied.append({
                'file': url,
                'type': 'affiliate_disclosure_added',
                'old': 'Sin affiliate disclosure',
                'new': 'Disclosure de afiliados añadido'
            })
        
        return content
    
    def fix_viewport_meta(self, content: str, url: str) -> str:
        """Fix automático para viewport meta tag."""
        # Buscar si ya existe viewport
        viewport_pattern = r'<meta[^>]*name=["\']viewport["\'][^>]*content=["\'][^"\']*["\']'
        if re.search(viewport_pattern, content, re.IGNORECASE):
            return content
        
        # Añadir viewport meta en head
        head_pattern = r'(</head>)'
        viewport_tag = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        
        if re.search(head_pattern, content):
            content = re.sub(head_pattern, f'{viewport_tag}\\n\\1', content)
            self.fixes_applied.append({
                'file': url,
                'type': 'viewport_added',
                'old': 'Sin viewport',
                'new': 'Viewport responsive añadido'
            })
        
        return content
    
    def process_html_file(self, file_path: Path) -> bool:
        """Procesa un archivo HTML aplicando fixes automáticos."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            url = f"https://sintomario.org/{file_path.relative_to(self.public_dir)}"
            
            # Aplicar fixes en orden
            content = self.fix_seo_titles(content, url)
            content = self.fix_seo_descriptions(content, url)
            content = self.fix_schema_org(content, url)
            content = self.fix_canonical_urls(content, url)
            content = self.fix_alt_text(content, url)
            content = self.fix_lazy_loading(content, url)
            content = self.fix_skip_links(content, url)
            content = self.fix_lang_attribute(content, url)
            content = self.fix_ymyl_disclaimer(content, url)
            content = self.fix_affiliate_disclosure(content, url)
            content = self.fix_viewport_meta(content, url)
            
            # Guardar cambios si hubo modificaciones
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                self.stats['fixes_applied'] += len([f for f in self.fixes_applied if f['file'] == url])
                return True
            
            return False
            
        except Exception as e:
            self.fixes_failed.append({
                'file': str(file_path),
                'error': str(e)
            })
            self.stats['fixes_failed'] += 1
            return False
    
    def run_auto_fixes(self) -> Dict[str, Any]:
        """Ejecuta todos los fixes automáticos."""
        print("🔧 Iniciando fixes automáticos...")
        
        # Encontrar todos los archivos HTML
        html_files = list(self.public_dir.rglob("*.html"))
        print(f"   📄 Procesando {len(html_files)} archivos HTML...")
        
        # Procesar cada archivo
        files_modified = 0
        for html_file in html_files:
            self.stats['files_processed'] += 1
            if self.process_html_file(html_file):
                files_modified += 1
        
        # Generar reporte
        report = {
            'timestamp': datetime.now().isoformat(),
            'stats': self.stats,
            'files_modified': files_modified,
            'fixes_applied': self.fixes_applied,
            'fixes_failed': self.fixes_failed
        }
        
        return report
    
    def generate_summary_report(self, report: Dict[str, Any]) -> None:
        """Genera reporte resumen de fixes aplicados."""
        print(f"\n📊 RESUMEN DE FIXES APLICADOS")
        print(f"   📄 Archivos procesados: {report['stats']['files_processed']}")
        print(f"   🔧 Archivos modificados: {report['files_modified']}")
        print(f"   ✅ Fixes aplicados: {report['stats']['fixes_applied']}")
        print(f"   ❌ Fixes fallidos: {report['stats']['fixes_failed']}")
        
        # Resumen por tipo de fix
        fix_types = {}
        for fix in report['fixes_applied']:
            fix_type = fix['type']
            fix_types[fix_type] = fix_types.get(fix_type, 0) + 1
        
        print(f"\n🔧 FIXES POR TIPO:")
        for fix_type, count in sorted(fix_types.items()):
            print(f"   {fix_type}: {count}")
        
        # Mostrar errores si hay
        if report['fixes_failed']:
            print(f"\n❌ ERRORES:")
            for error in report['fixes_failed']:
                print(f"   {error['file']}: {error['error']}")
        
        # Guardar reporte
        report_file = Path("reports/auto-fixes-report.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Reporte completo guardado: {report_file}")

def main():
    """Función principal."""
    print("🚀 SINTOMARIO.ORG - Motor de Fixes Automáticos")
    print("Aplicando correcciones automáticas basadas en auditoría")
    print("=" * 70)
    
    fixer = SintomarioAutoFixer()
    
    # Ejecutar fixes automáticos
    report = fixer.run_auto_fixes()
    
    # Generar reporte
    fixer.generate_summary_report(report)
    
    # Verificación post-fixes
    print(f"\n🔍 EJECUTANDO VERIFICACIÓN POST-FIXES...")
    
    # Ejecutar auditoría nuevamente para verificar mejoras
    import sys
    sys.path.append('.')
    from polishing_optimizer import SintomarioPolisher
    
    polisher = SintomarioPolisher()
    post_fix_audit = polisher.run_full_audit()
    
    print(f"\n📈 COMPARACIÓN DE SCORES:")
    print(f"   Score anterior: 70.9/100")
    print(f"   Score actual: {post_fix_audit['overall_score']:.1f}/100")
    print(f"   Mejora: {post_fix_audit['overall_score'] - 70.9:+.1f} puntos")
    
    if post_fix_audit['overall_score'] >= 85:
        print(f"\n🌟 EXCELENTE - Sistema significativamente mejorado")
    elif post_fix_audit['overall_score'] >= 80:
        print(f"\n✅ BUENO - Sistema notablemente mejorado")
    elif post_fix_audit['overall_score'] >= 75:
        print(f"\n⚠️ MEJORADO - Sistema con mejoras notables")
    else:
        print(f"\n❌ NECESITA MÁS TRABAJO - Requiere fixes adicionales")
    
    print("=" * 70)

if __name__ == "__main__":
    main()
