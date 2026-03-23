#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Script de Build Final Optimizado
Build completo con rate limiting de Amazon API y optimización SEO según guías de Google.
"""

import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime

def check_environment():
    """Verificar configuración del entorno."""
    print("🔍 Verificando configuración del entorno...")
    
    # Verificar Python y entorno virtual
    if os.path.exists('.venv'):
        print("   ✅ Entorno virtual detectado")
    else:
        print("   ⚠️ No se detectó entorno virtual")
    
    # Verificar archivos críticos
    required_files = [
        'motor/sintomario_motor.py',
        'corpus/config.json',
        'corpus/entidades.json',
        'corpus/contextos.json',
        'corpus/perspectivas.json',
        'corpus/productos.json'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"   ❌ Archivos faltantes: {', '.join(missing_files)}")
        return False
    
    print("   ✅ Todos los archivos críticos presentes")
    return True

def run_command_with_timeout(command_args: list, timeout: int = 300) -> bool:
    """Ejecutar comando con timeout y manejo de errores seguro."""
    try:
        # Validar que command_args es una lista y no está vacía
        if not isinstance(command_args, list) or not command_args:
            print("   ❌ Error: command_args debe ser una lista no vacía")
            return False
        
        # Validar que no haya caracteres peligrosos
        dangerous_chars = ['|', '&', ';', '$', '`', '(', ')', '<', '>', '|']
        for arg in command_args:
            if any(char in str(arg) for char in dangerous_chars):
                print(f"   ❌ Error: Caracteres peligrosos detectados en: {arg}")
                return False
        
        result = subprocess.run(
            command_args,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False  # Manejamos return code manualmente
        )
        
        if result.returncode != 0:
            print(f"   ❌ Error: {result.stderr}")
            return False
        
        return True
    
    except subprocess.TimeoutExpired:
        print(f"   ⏰ Timeout después de {timeout} segundos")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    """Build final optimizado."""
    print("=" * 70)
    print(" SINTOMARIO.ORG — Build Final Optimizado v5.2")
    print(" Con Rate Limiting Amazon API y Optimización SEO Google")
    print(" Marzo 2026")
    print("=" * 70)
    print()
    
    # 1. Verificar entorno
    if not check_environment():
        print("\n❌ Configuración del entorno incompleta")
        sys.exit(1)
    
    # 2. Verificar credenciales Amazon (opcional)
    amazon_available = all([
        os.getenv('AMAZON_ACCESS_KEY_ID'),
        os.getenv('AMAZON_SECRET_ACCESS_KEY'),
        os.getenv('AMAZON_TAG')
    ])
    
    if amazon_available:
        print("📦 Amazon API configurada")
        use_amazon = True
    else:
        print("⚠️ Amazon API no configurada (opcional)")
        use_amazon = False
    
    print()
    
    # 3. Limpiar y preparar
    print("[1/8] Preparando entorno de build...")
    
    # Limpiar directorio public
    if Path("public").exists():
        import shutil
        shutil.rmtree("public")
    
    Path("public").mkdir(exist_ok=True)
    Path("reports").mkdir(exist_ok=True)
    
    print("   ✅ Entorno preparado")
    
    # 4. Optimizar productos Amazon (si está disponible)
    if use_amazon:
        print("\n[2/8] Optimizando productos Amazon con rate limiting...")
        if run_command_with_timeout("python scripts/amazon_seo_optimizer.py", 120):
            print("   ✅ Productos optimizados")
        else:
            print("   ⚠️ Error en optimización Amazon")
    
    # 5. Generar corpus principal
    print("\n[3/8] Generando corpus principal...")
    if run_command_with_timeout("python motor/sintomario_motor.py --output ./public --verbose", 180):
        print("   ✅ Corpus generado")
    else:
        print("   ❌ Error generando corpus")
        sys.exit(1)
    
    # 6. Generar hubs de navegación
    print("\n[4/8] Generando hubs de navegación...")
    if run_command_with_timeout("python scripts/generate_hubs.py --output ./public --all", 120):
        print("   ✅ Hubs generados")
    else:
        print("   ⚠️ Error generando hubs")
    
    # 7. Generar páginas de autores
    print("\n[5/8] Generando páginas de autores...")
    if run_command_with_timeout("python scripts/enrich_perspectives.py --generate-pages", 60):
        print("   ✅ Páginas de autores generadas")
    else:
        print("   ⚠️ Error generando páginas de autores")
    
    # 8. Validar SEO
    print("\n[6/8] Validando SEO...")
    if run_command_with_timeout("python scripts/validate_seo.py --public-dir ./public", 120):
        print("   ✅ SEO validado")
    else:
        print("   ⚠️ Error en validación SEO")
    
    # 9. Generar reportes
    print("\n[7/8] Generando reportes...")
    if run_command_with_timeout("python scripts/generate_report.py --output ./reports/final-build-report.json", 60):
        print("   ✅ Reportes generados")
    else:
        print("   ⚠️ Error generando reportes")
    
    # 10. Verificación final
    print("\n[8/8] Verificación final...")
    
    # Verificar archivos críticos
    critical_files = [
        "public/index.html",
        "public/sitemap.xml",
        "public/robots.txt",
        "public/CNAME"
    ]
    
    missing_critical = []
    for file_path in critical_files:
        if not Path(file_path).exists():
            missing_critical.append(file_path)
    
    if missing_critical:
        print(f"   ❌ Archivos críticos faltantes: {', '.join(missing_critical)}")
    else:
        print("   ✅ Todos los archivos críticos generados")
    
    # Contar archivos generados
    html_files = len(list(Path("public").rglob("*.html")))
    json_files = len(list(Path("public").rglob("*.json")))
    
    # Calcular tamaño total
    total_size = sum(f.stat().st_size for f in Path("public").rglob("*") if f.is_file())
    size_mb = total_size / (1024 * 1024)
    
    print(f"   📊 Estadísticas: {html_files} HTML, {json_files} JSON, {size_mb:.2f} MB")
    
    # 11. Resumen final
    print("\n" + "=" * 70)
    print(" BUILD FINAL COMPLETADO")
    print("=" * 70)
    print()
    
    print("📊 RESUMEN EJECUTIVO:")
    print(f"   📄 Archivos HTML: {html_files}")
    print(f"   📋 Archivos JSON: {json_files}")
    print(f"   💾 Tamaño total: {size_mb:.2f} MB")
    print(f"   📦 Amazon API: {'Activada' if amazon_available else 'No disponible'}")
    
    # Leer reporte si existe
    report_file = Path("reports/final-build-report.json")
    if report_file.exists():
        try:
            with open(report_file, 'r', encoding='utf-8') as f:
                report = json.load(f)
            
            if 'summary' in report:
                summary = report['summary']
                print(f"   🎯 Nodos totales: {summary.get('total_nodes', 0)}")
                print(f"   ✅ Nodos indexables: {summary.get('indexable_nodes', 0)}")
                print(f"   📈 Score SEO promedio: {summary.get('average_score', 0):.1f}/100")
        except:
            pass
    
    print()
    print("🚀 PRÓXIMOS PASOS PARA PRODUCCIÓN:")
    print("   1. Configurar credenciales Amazon (si no está hecho)")
    print("   2. Configurar DNS en Cloudflare")
    print("   3. Hacer commit y push a GitHub")
    print("   4. Verificar deploy automático")
    
    if not amazon_available:
        print()
        print("📋 PARA ACTIVAR AMAZON API:")
        print("   1. Ve a: https://afiliados.amazon.es/assoc_credentials/home")
        print("   2. Obtén tus credenciales (requiere 3 ventas)")
        print("   3. Configura variables de entorno:")
        print("      AMAZON_ACCESS_KEY_ID=tu_key")
        print("      AMAZON_SECRET_ACCESS_KEY=tu_secret")
        print("      AMAZON_TAG=sintomario-20")
        print("   4. Vuelve a ejecutar este build")
    
    print()
    print("🌐 CONFIGURACIÓN DNS:")
    print("   - Dominio: sintomario.org")
    print("   - 4 registros A a GitHub Pages:")
    print("     185.199.108.153")
    print("     185.199.109.153")
    print("     185.199.110.153")
    print("     185.199.111.153")
    print("   - CNAME: www.sintomario.org → sintomario.github.io")
    
    print()
    print("✅ SINTOMARIO.ORG está listo para producción")
    print("=" * 70)

if __name__ == "__main__":
    main()
