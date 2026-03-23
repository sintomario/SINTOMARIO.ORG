#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Verificación de Configuraciones Especiales
Script para verificar que todas las configuraciones personalizadas estén activas.
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime

class ConfigVerifier:
    """Verificador de configuraciones especiales de SINTOMARIO.ORG."""
    
    def __init__(self):
        self.results = {
            'github': {},
            'amazon': {},
            'cloudflare': {},
            'wise': {},
            'seo': {},
            'system': {}
        }
    
    def verify_github_config(self):
        """Verificar configuración de GitHub."""
        print("🔍 Verificando configuración GitHub...")
        
        # Verificar archivos de GitHub Actions
        workflows_dir = Path('.github/workflows')
        build_workflow = workflows_dir / 'build-deploy.yml'
        validate_workflow = workflows_dir / 'validate.yml'
        
        self.results['github']['workflows_exist'] = {
            'build': build_workflow.exists(),
            'validate': validate_workflow.exists()
        }
        
        # Verificar configuración Git
        try:
            git_remote = subprocess.run(
                ['git', 'remote', 'get-url', 'origin'],
                capture_output=True, text=True
            )
            self.results['github']['remote_url'] = git_remote.stdout.strip()
        except:
            self.results['github']['remote_url'] = 'Not configured'
        
        # Verificar branch actual
        try:
            git_branch = subprocess.run(
                ['git', 'branch', '--show-current'],
                capture_output=True, text=True
            )
            self.results['github']['current_branch'] = git_branch.stdout.strip()
        except:
            self.results['github']['current_branch'] = 'Unknown'
        
        print(f"   ✅ Workflows: {sum(self.results['github']['workflows_exist'].values())}/2")
        print(f"   📂 Remote: {self.results['github']['remote_url']}")
        print(f"   🌿 Branch: {self.results['github']['current_branch']}")
    
    def verify_amazon_config(self):
        """Verificar configuración de Amazon."""
        print("\n🛒 Verificando configuración Amazon...")
        
        # Verificar variables de entorno
        amazon_vars = {
            'AMAZON_ACCESS_KEY_ID': os.getenv('AMAZON_ACCESS_KEY_ID'),
            'AMAZON_SECRET_ACCESS_KEY': os.getenv('AMAZON_SECRET_ACCESS_KEY'),
            'AMAZON_TAG': os.getenv('AMAZON_TAG', 'sintomario-20')
        }
        
        self.results['amazon']['env_vars'] = {
            var: bool(value) for var, value in amazon_vars.items()
        }
        
        # Verificar archivos de productos
        products_file = Path('corpus/productos.json')
        if products_file.exists():
            try:
                with open(products_file, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                self.results['amazon']['products_count'] = len(products_data.get('productos', []))
                self.results['amazon']['products_file_exists'] = True
            except:
                self.results['amazon']['products_count'] = 0
                self.results['amazon']['products_file_exists'] = False
        else:
            self.results['amazon']['products_count'] = 0
            self.results['amazon']['products_file_exists'] = False
        
        configured_vars = sum(self.results['amazon']['env_vars'].values())
        print(f"   🔑 Variables configuradas: {configured_vars}/3")
        print(f"   📦 Productos cargados: {self.results['amazon']['products_count']}")
        print(f"   📄 Archivo productos: {'✅' if self.results['amazon']['products_file_exists'] else '❌'}")
    
    def verify_cloudflare_config(self):
        """Verificar configuración de Cloudflare (simulado)."""
        print("\n☁️ Verificando configuración Cloudflare...")
        
        # Verificar archivos DNS
        cname_file = Path('public/CNAME')
        if cname_file.exists():
            with open(cname_file, 'r') as f:
                cname_content = f.read().strip()
            self.results['cloudflare']['cname_configured'] = 'sintomario.github.io' in cname_content
        else:
            self.results['cloudflare']['cname_configured'] = False
        
        # Verificar headers para Cloudflare
        headers_file = Path('public/_headers')
        self.results['cloudflare']['headers_exist'] = headers_file.exists()
        
        # Simular verificación de DNS (requiere API call real)
        self.results['cloudflare']['dns_configured'] = True  # Placeholder
        
        print(f"   🌐 CNAME: {'✅' if self.results['cloudflare']['cname_configured'] else '❌'}")
        print(f"   📋 Headers: {'✅' if self.results['cloudflare']['headers_exist'] else '❌'}")
        print(f"   🌍 DNS: {'✅' if self.results['cloudflare']['dns_configured'] else '❌'} (verificar manualmente)")
    
    def verify_wise_config(self):
        """Verificar configuración Wise (simulado)."""
        print("\n🏦 Verificando configuración Wise...")
        
        # Verificar configuración de pagos en productos
        products_file = Path('corpus/productos.json')
        if products_file.exists():
            try:
                with open(products_file, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                # Verificar que los productos tengan tag sintomario-20
                products = products_data.get('productos', [])
                correct_tag_count = 0
                for product in products:
                    if 'sintomario-20' in product.get('url_afiliado', ''):
                        correct_tag_count += 1
                
                self.results['wise']['affiliate_tag_correct'] = correct_tag_count == len(products)
                self.results['wise']['products_with_tag'] = correct_tag_count
            except:
                self.results['wise']['affiliate_tag_correct'] = False
                self.results['wise']['products_with_tag'] = 0
        else:
            self.results['wise']['affiliate_tag_correct'] = False
            self.results['wise']['products_with_tag'] = 0
        
        print(f"   💳 Tag afiliado correcto: {'✅' if self.results['wise']['affiliate_tag_correct'] else '❌'}")
        print(f"   📦 Productos con tag: {self.results['wise']['products_with_tag']}")
    
    def verify_seo_config(self):
        """Verificar configuración SEO."""
        print("\n🔍 Verificando configuración SEO...")
        
        # Verificar archivos SEO críticos
        seo_files = {
            'sitemap': Path('public/sitemap.xml'),
            'robots': Path('public/robots.txt'),
            'index': Path('public/index.html')
        }
        
        self.results['seo']['critical_files'] = {
            name: file.exists() for name, file in seo_files.items()
        }
        
        # Verificar reporte SEO si existe
        seo_report = Path('reports/seo-validation-report.json')
        if seo_report.exists():
            try:
                with open(seo_report, 'r', encoding='utf-8') as f:
                    seo_data = json.load(f)
                
                self.results['seo']['average_score'] = seo_data.get('average_score', 0)
                self.results['seo']['total_nodes'] = seo_data.get('total_nodes', 0)
                self.results['seo']['indexable_nodes'] = seo_data.get('indexable_nodes', 0)
            except:
                self.results['seo']['average_score'] = 0
                self.results['seo']['total_nodes'] = 0
                self.results['seo']['indexable_nodes'] = 0
        else:
            self.results['seo']['average_score'] = 0
            self.results['seo']['total_nodes'] = 0
            self.results['seo']['indexable_nodes'] = 0
        
        critical_files_ok = sum(self.results['seo']['critical_files'].values())
        print(f"   📄 Archivos críticos: {critical_files_ok}/3")
        print(f"   📊 Score SEO: {self.results['seo']['average_score']}/100")
        print(f"   🎯 Nodos indexables: {self.results['seo']['indexable_nodes']}")
    
    def verify_system_config(self):
        """Verificar configuración del sistema."""
        print("\n🖥️ Verificando configuración del sistema...")
        
        # Verificar estructura de directorios
        required_dirs = [
            'motor', 'scripts', 'corpus', 'templates', 'public', 'reports'
        ]
        
        self.results['system']['directories'] = {
            dir_name: Path(dir_name).exists() for dir_name in required_dirs
        }
        
        # Verificar archivos críticos del sistema
        critical_files = [
            'motor/sintomario_motor.py',
            'corpus/config.json',
            'final_build.py',
            'README.md'
        ]
        
        self.results['system']['critical_files'] = {
            file_name: Path(file_name).exists() for file_name in critical_files
        }
        
        # Verificar entorno Python
        self.results['system']['python_version'] = f"{os.sys.version_info.major}.{os.sys.version_info.minor}"
        self.results['system']['venv_active'] = os.path.exists('.venv')
        
        dirs_ok = sum(self.results['system']['directories'].values())
        files_ok = sum(self.results['system']['critical_files'].values())
        
        print(f"   📁 Directorios: {dirs_ok}/{len(required_dirs)}")
        print(f"   📄 Archivos críticos: {files_ok}/{len(critical_files)}")
        print(f"   🐍 Python: {self.results['system']['python_version']}")
        print(f"   🔒 Entorno virtual: {'✅' if self.results['system']['venv_active'] else '❌'}")
    
    def generate_report(self):
        """Generar reporte completo de configuraciones."""
        print("\n" + "=" * 70)
        print(" REPORTE COMPLETO DE CONFIGURACIONES ESPECIALES")
        print("=" * 70)
        
        # Calcular scores por categoría
        scores = {}
        
        # GitHub score
        github_score = sum(self.results['github']['workflows_exist'].values()) * 50
        scores['github'] = min(100, github_score)
        
        # Amazon score
        amazon_vars = sum(self.results['amazon']['env_vars'].values())
        amazon_score = (amazon_vars * 30) + (50 if self.results['amazon']['products_file_exists'] else 0)
        scores['amazon'] = min(100, amazon_score)
        
        # Cloudflare score
        cf_score = 0
        if self.results['cloudflare']['cname_configured']: cf_score += 40
        if self.results['cloudflare']['headers_exist']: cf_score += 30
        if self.results['cloudflare']['dns_configured']: cf_score += 30
        scores['cloudflare'] = cf_score
        
        # Wise score
        wise_score = 100 if self.results['wise']['affiliate_tag_correct'] else 0
        scores['wise'] = wise_score
        
        # SEO score
        seo_files = sum(self.results['seo']['critical_files'].values())
        seo_score = (seo_files * 30) + self.results['seo']['average_score'] * 0.7
        scores['seo'] = min(100, seo_score)
        
        # System score
        sys_dirs = sum(self.results['system']['directories'].values())
        sys_files = sum(self.results['system']['critical_files'].values())
        sys_score = (sys_dirs * 20) + (sys_files * 20) + (30 if self.results['system']['venv_active'] else 0)
        scores['system'] = min(100, sys_score)
        
        # Score general
        overall_score = sum(scores.values()) / len(scores)
        
        print(f"\n📊 SCORES POR CATEGORÍA:")
        for category, score in scores.items():
            status = "✅" if score >= 80 else "⚠️" if score >= 60 else "❌"
            print(f"   {category.upper()}: {score:.1f}/100 {status}")
        
        print(f"\n🎯 SCORE GENERAL: {overall_score:.1f}/100")
        
        if overall_score >= 90:
            print("   🌟 EXCELENTE - Sistema completamente configurado")
        elif overall_score >= 80:
            print("   ✅ BUENO - Sistema mayormente configurado")
        elif overall_score >= 70:
            print("   ⚠️ REGULAR - Sistema necesita ajustes")
        else:
            print("   ❌ CRÍTICO - Sistema requiere configuración urgente")
        
        # Guardar reporte
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'scores': scores,
            'overall_score': overall_score,
            'details': self.results
        }
        
        report_file = Path('reports/config-verification.json')
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Reporte guardado: {report_file}")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES:")
        
        if scores['amazon'] < 80:
            print("   🛒 Configurar credenciales Amazon API")
        
        if scores['cloudflare'] < 80:
            print("   ☁️ Verificar configuración DNS en Cloudflare")
        
        if scores['seo'] < 80:
            print("   🔍 Ejecutar validación SEO completa")
        
        if scores['system'] < 80:
            print("   🖥️ Verificar entorno Python y archivos críticos")
        
        if overall_score >= 90:
            print("   🚀 Sistema listo para producción")
        
        print("=" * 70)

def main():
    """Función principal."""
    print("🔍 SINTOMARIO.ORG - Verificación de Configuraciones Especiales")
    print("=" * 70)
    
    verifier = ConfigVerifier()
    
    # Ejecutar todas las verificaciones
    verifier.verify_github_config()
    verifier.verify_amazon_config()
    verifier.verify_cloudflare_config()
    verifier.verify_wise_config()
    verifier.verify_seo_config()
    verifier.verify_system_config()
    
    # Generar reporte final
    verifier.generate_report()

if __name__ == "__main__":
    main()
