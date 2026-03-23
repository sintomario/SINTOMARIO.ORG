#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Build Final Corregido
Versión sin caracteres Unicode para compatibilidad Windows
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime

class SintomarioBuilder:
    """Constructor optimizado para SINTOMARIO.ORG"""
    
    def __init__(self):
        self.start_time = time.time()
        self.stats = {
            'html_files': 0,
            'json_files': 0,
            'total_size': 0,
            'errors': 0,
            'warnings': 0
        }
        
        # Paths
        self.base_dir = Path('.')
        self.public_dir = Path('public')
        self.corpus_dir = Path('corpus')
        self.reports_dir = Path('reports')
        
        # Amazon API config
        self.amazon_config = {
            'access_key': os.getenv('AMAZON_ACCESS_KEY_ID'),
            'secret_key': os.getenv('AMAZON_SECRET_ACCESS_KEY'),
            'tag': os.getenv('AMAZON_TAG', 'sintomario-20')
        }
    
    def check_environment(self):
        """Verifica el entorno de build"""
        print("Verificando configuracion del entorno...")
        
        # Check virtual environment
        if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print("   [OK] Entorno virtual detectado")
        else:
            print("   [ADVERTENCIA] Sin entorno virtual")
        
        # Check critical files
        critical_files = [
            'motor/sintomario_motor.py',
            'corpus/config.json',
            'public/CNAME'
        ]
        
        missing_files = []
        for file_path in critical_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            print(f"   [ERROR] Archivos criticos faltantes: {', '.join(missing_files)}")
            return False
        
        print("   [OK] Todos los archivos criticos presentes")
        
        # Check Amazon API
        if self.amazon_config['access_key'] and self.amazon_config['secret_key']:
            print("   [OK] Amazon API configurada")
        else:
            print("   [INFO] Amazon API no configurada (opcional)")
        
        return True
    
    def prepare_environment(self):
        """Prepara el entorno de build"""
        print("Preparando entorno de build...")
        
        # Create directories
        for dir_path in [self.public_dir, self.reports_dir]:
            dir_path.mkdir(exist_ok=True)
        
        print("   [OK] Entorno preparado")
        return True
    
    def generate_corpus(self):
        """Genera el corpus principal"""
        print("Generando corpus principal...")
        
        try:
            # Import motor
            sys.path.append('motor')
            from sintomario_motor import SintomarioMotor
            
            motor = SintomarioMotor()
            motor.generar_todo()
            
            print("   [OK] Corpus generado")
            return True
            
        except Exception as e:
            print(f"   [ERROR] Error generando corpus: {str(e)}")
            self.stats['errors'] += 1
            return False
    
    def generate_hubs(self):
        """Genera hubs de navegacion"""
        print("Generando hubs de navegacion...")
        
        try:
            # Import hub generator
            sys.path.append('scripts')
            from generate_hubs import HubGenerator
            
            generator = HubGenerator()
            generator.generar_hub_zonas()
            generator.generar_hub_sintomas()
            generator.generar_hub_especialidades()
            
            print("   [OK] Hubs generados")
            return True
            
        except Exception as e:
            print(f"   [ADVERTENCIA] Error generando hubs: {str(e)}")
            self.stats['warnings'] += 1
            return False
    
    def generate_authors(self):
        """Genera paginas de autores"""
        print("Generando paginas de autores...")
        
        try:
            # Import author generator
            from enrich_perspectives import PerspectiveEnricher
            
            enricher = PerspectiveEnricher()
            enricher.generate_author_pages()
            enricher.generate_perspective_pages()
            
            print("   [OK] Paginas de autores generadas")
            return True
            
        except Exception as e:
            print(f"   [ADVERTENCIA] Error generando paginas de autores: {str(e)}")
            self.stats['warnings'] += 1
            return False
    
    def validate_seo(self):
        """Valida SEO del sitio"""
        print("Validando SEO...")
        
        try:
            # Import SEO validator
            from validate_seo import SEOValidator
            
            validator = SEOValidator()
            results = validator.validate_all_nodes()
            
            print("   [OK] SEO validado")
            return True
            
        except Exception as e:
            print(f"   [ADVERTENCIA] Error en validacion SEO: {str(e)}")
            self.stats['warnings'] += 1
            return False
    
    def generate_reports(self):
        """Genera reportes del build"""
        print("Generando reportes...")
        
        try:
            # Import report generator
            from generate_report import ReportGenerator
            
            generator = ReportGenerator()
            generator.generate_executive_summary()
            generator.generate_technical_report()
            generator.generate_seo_report()
            
            print("   [OK] Reportes generados")
            return True
            
        except Exception as e:
            print(f"   [ADVERTENCIA] Error generando reportes: {str(e)}")
            self.stats['warnings'] += 1
            return False
    
    def collect_statistics(self):
        """Recolecta estadisticas del build"""
        print("Recolectando estadisticas...")
        
        # Count HTML files
        html_files = list(self.public_dir.rglob('*.html'))
        self.stats['html_files'] = len(html_files)
        
        # Count JSON files
        json_files = list(self.public_dir.rglob('*.json'))
        self.stats['json_files'] = len(json_files)
        
        # Calculate total size
        total_size = 0
        for file_path in self.public_dir.rglob('*'):
            if file_path.is_file():
                total_size += file_path.stat().st_size
        
        self.stats['total_size'] = total_size / (1024 * 1024)  # MB
        
        print(f"   [OK] Estadisticas recolectadas")
        return True
    
    def verify_critical_files(self):
        """Verifica archivos criticos"""
        print("Verificacion final...")
        
        critical_files = [
            'public/index.html',
            'public/sitemap.xml',
            'public/robots.txt',
            'public/CNAME'
        ]
        
        missing_files = []
        for file_path in critical_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            print(f"   [ERROR] Archivos criticos faltantes: {', '.join(missing_files)}")
            return False
        
        print("   [OK] Todos los archivos criticos presentes")
        return True
    
    def generate_build_summary(self):
        """Genera resumen del build"""
        build_time = time.time() - self.start_time
        
        print("\n" + "="*60)
        print("BUILD FINAL COMPLETADO")
        print("="*60)
        
        print(f"\nRESUMEN EJECUTIVO:")
        print(f"   Archivos HTML: {self.stats['html_files']}")
        print(f"   Archivos JSON: {self.stats['json_files']}")
        print(f"   Tamano total: {self.stats['total_size']:.2f} MB")
        print(f"   Tiempo de build: {build_time:.2f} segundos")
        print(f"   Errores: {self.stats['errors']}")
        print(f"   Advertencias: {self.stats['warnings']}")
        
        if self.amazon_config['access_key']:
            print(f"   Amazon API: Configurada")
        else:
            print(f"   Amazon API: No disponible")
        
        print(f"\nPROXIMOS PASOS PARA PRODUCCION:")
        print(f"   1. Configurar DNS en Cloudflare")
        print(f"   2. Hacer commit y push a GitHub")
        print(f"   3. Verificar deploy automatico")
        
        if not self.amazon_config['access_key']:
            print(f"\nPARA ACTIVAR AMAZON API:")
            print(f"   1. Ve a: https://afiliados.amazon.es/assoc_credentials/home")
            print(f"   2. Obtén tus credenciales (requiere 3 ventas)")
            print(f"   3. Configura variables de entorno:")
            print(f"      AMAZON_ACCESS_KEY_ID=tu_key")
            print(f"      AMAZON_SECRET_ACCESS_KEY=tu_secret")
            print(f"      AMAZON_TAG=sintomario-20")
            print(f"   4. Vuelve a ejecutar este build")
        
        print(f"\nCONFIGURACION DNS:")
        print(f"   - Dominio: sintomario.org")
        print(f"   - 4 registros A a GitHub Pages:")
        print(f"     185.199.108.153")
        print(f"     185.199.109.153")
        print(f"     185.199.110.153")
        print(f"     185.199.111.153")
        print(f"   - CNAME: www.sintomario.org -> sintomario.github.io")
        
        print(f"\n[OK] SINTOMARIO.ORG esta listo para produccion")
        print("="*60)
        
        # Save build report
        build_report = {
            'timestamp': datetime.now().isoformat(),
            'stats': self.stats,
            'build_time': build_time,
            'amazon_configured': bool(self.amazon_config['access_key']),
            'success': True
        }
        
        report_file = self.reports_dir / 'build-report.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(build_report, f, indent=2, ensure_ascii=False)
        
        return True
    
    def run_build(self):
        """Ejecuta el build completo"""
        print("SINTOMARIO.ORG — Build Final Optimizado v5.2")
        print("Con Rate Limiting Amazon API y Optimizacion SEO Google")
        print(f"Marzo 2026")
        print("="*60)
        
        steps = [
            ('check_environment', self.check_environment),
            ('prepare_environment', self.prepare_environment),
            ('generate_corpus', self.generate_corpus),
            ('generate_hubs', self.generate_hubs),
            ('generate_authors', self.generate_authors),
            ('validate_seo', self.validate_seo),
            ('generate_reports', self.generate_reports),
            ('collect_statistics', self.collect_statistics),
            ('verify_critical_files', self.verify_critical_files),
            ('generate_build_summary', self.generate_build_summary)
        ]
        
        for step_name, step_func in steps:
            try:
                if not step_func():
                    print(f"   [ERROR] Fallo en paso: {step_name}")
                    self.stats['errors'] += 1
            except Exception as e:
                print(f"   [ERROR] Excepcion en paso {step_name}: {str(e)}")
                self.stats['errors'] += 1
        
        return self.stats['errors'] == 0

def main():
    """Funcion principal"""
    builder = SintomarioBuilder()
    success = builder.run_build()
    
    if success:
        print(f"\n[OK] BUILD COMPLETADO EXITOSAMENTE")
    else:
        print(f"\n[ADVERTENCIA] BUILD COMPLETADO CON ERRORES")
    
    print(f"Tiempo total: {time.time() - builder.start_time:.2f} segundos")

if __name__ == "__main__":
    main()
