#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Script de Build con Amazon API
Build completo que integra actualizaciones automáticas de Amazon.
"""

import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime

def check_amazon_credentials():
    """Verificar si las credenciales de Amazon están configuradas."""
    required_vars = [
        'AMAZON_ACCESS_KEY_ID',
        'AMAZON_SECRET_ACCESS_KEY',
        'AMAZON_TAG'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Faltan credenciales de Amazon:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📋 Para configurar:")
        print("1. Ve a: https://afiliados.amazon.es/assoc_credentials/home")
        print("2. Obtén tus credenciales de API")
        print("3. Copia .env.amazon a .env y completa los valores")
        return False
    
    print("✅ Credenciales de Amazon configuradas")
    return True

def run_command(command_args: list, cwd: str = None) -> bool:
    """Ejecutar comando y verificar resultado de forma segura."""
    try:
        # Validar que command_args es una lista y no está vacía
        if not isinstance(command_args, list) or not command_args:
            print("❌ Error: command_args debe ser una lista no vacía")
            return False
        
        # Validar que no haya caracteres peligrosos
        dangerous_chars = ['|', '&', ';', '$', '`', '(', ')', '<', '>', '|']
        for arg in command_args:
            if any(char in str(arg) for char in dangerous_chars):
                print(f"❌ Error: Caracteres peligrosos detectados en: {arg}")
                return False
        
        result = subprocess.run(
            command_args, 
            cwd=cwd or ".",
            capture_output=True, 
            text=True,
            timeout=300,  # 5 minutos timeout
            check=False  # Manejamos return code manualmente
        )
        
        if result.returncode != 0:
            print(f"❌ Error en comando: {' '.join(command_args)}")
            print(f"   Error: {result.stderr}")
            return False
        
        return True
    
    except subprocess.TimeoutExpired:
        print(f"⏰ Timeout en comando: {' '.join(command_args)}")
        return False
    except Exception as e:
        print(f"❌ Error ejecutando comando: {' '.join(command_args)}")
        print(f"   Exception: {str(e)}")
        return False

def main():
    """Build principal con Amazon API integration."""
    print("=" * 60)
    print(" SINTOMARIO.ORG — Build System con Amazon API v5.1")
    print(" Marzo 2026")
    print("=" * 60)
    print()
    
    # Verificar credenciales de Amazon
    amazon_available = check_amazon_credentials()
    
    if not amazon_available:
        print("\n⚠️  El build continuará sin actualizaciones de Amazon")
        print("   Para activar: configura las credenciales en .env")
        use_amazon = False
    else:
        use_amazon = True
        print("📦 Se usarán actualizaciones automáticas de Amazon")
    
    print()
    
    # 1. Limpiar directorio public
    print("[1/7] Limpiando directorio public...")
    if Path("public").exists():
        import shutil
        shutil.rmtree("public")
        print("   ✓ Directorio public eliminado")
    
    Path("public").mkdir(exist_ok=True)
    print("   ✓ Directorio public creado")
    
    # 2. Actualizar productos de Amazon (si está disponible)
    if use_amazon:
        print()
        print("[2/7] Actualizando productos de Amazon...")
        if run_command("python scripts/amazon_api_manager.py --update"):
            print("   ✓ Productos actualizados")
        else:
            print("   ⚠️ Error actualizando productos, continuando con cache")
    
    # 3. Generar corpus con motor mejorado
    print()
    print("[3/7] Generando corpus principal...")
    if use_amazon:
        if run_command("python motor/enhanced_motor.py --generate --output ./public"):
            print("   ✓ Corpus generado con Amazon updates")
        else:
            print("   ⚠️ Error con motor mejorado, usando motor estándar")
            if run_command("python motor/sintomario_motor.py --output ./public --verbose"):
                print("   ✓ Corpus generado con motor estándar")
            else:
                print("   ❌ Error generando corpus")
                sys.exit(1)
    else:
        if run_command("python motor/sintomario_motor.py --output ./public --verbose"):
            print("   ✓ Corpus generado con motor estándar")
        else:
            print("   ❌ Error generando corpus")
            sys.exit(1)
    
    # 4. Generar hubs de navegación
    print()
    print("[4/7] Generando hubs de navegación...")
    if run_command("python scripts/generate_hubs.py --output ./public --all"):
        print("   ✓ Hubs generados")
    else:
        print("   ⚠️ Error generando hubs")
    
    # 5. Generar páginas de autores
    print()
    print("[5/7] Generando páginas de autores...")
    if run_command("python scripts/enrich_perspectives.py --generate-pages"):
        print("   ✓ Páginas de autores generadas")
    else:
        print("   ⚠️ Error generando páginas de autores")
    
    # 6. Validar SEO
    print()
    print("[6/7] Validando SEO...")
    if run_command("python scripts/validate_seo.py --public-dir ./public"):
        print("   ✓ SEO validado")
    else:
        print("   ⚠️ Error en validación SEO")
    
    # 7. Generar reporte ejecutivo
    print()
    print("[7/7] Generando reporte ejecutivo...")
    if run_command("python scripts/generate_report.py --output ./reports/executive-summary.json --print"):
        print("   ✓ Reporte ejecutivo generado")
    else:
        print("   ⚠️ Error generando reporte")
    
    # 8. Configurar búsqueda (opcional)
    print()
    print("[8/8] Configurando búsqueda Pagefind (opcional)...")
    print("   Nota: Requiere Node.js y npm instalados")
    print("   Ejecuta manualmente: python scripts/setup_search.py --all")
    
    # Verificación final
    print()
    print("=" * 60)
    print(" BUILD COMPLETADO CON AMAZON API")
    print("=" * 60)
    print()
    
    # Verificar archivos críticos
    critical_files = [
        "public/sitemap.xml",
        "public/robots.txt",
        "public/CNAME",
        "public/index.html"
    ]
    
    missing_files = []
    for file_path in critical_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Archivos críticos faltantes:")
        for file_path in missing_files:
            print(f"   - {file_path}")
    else:
        print("✅ Todos los archivos críticos generados")
    
    # Estado de Amazon
    if use_amazon:
        print()
        print("📦 ESTADO AMAZON:")
        if run_command("python scripts/amazon_api_manager.py --check"):
            print("   ✅ Productos Amazon verificados")
        else:
            print("   ⚠️ Error verificando productos")
    
    print()
    print("📊 ESTADÍSTICAS FINALES:")
    
    # Contar archivos generados
    html_files = len(list(Path("public").rglob("*.html")))
    json_files = len(list(Path("public").rglob("*.json")))
    
    print(f"   📄 Archivos HTML: {html_files}")
    print(f"   📋 Archivos JSON: {json_files}")
    
    # Tamaño total
    total_size = sum(f.stat().st_size for f in Path("public").rglob("*") if f.is_file())
    size_mb = total_size / (1024 * 1024)
    print(f"   💾 Tamaño total: {size_mb:.2f} MB")
    
    print()
    print("🚀 PRÓXIMOS PASOS:")
    print("   1. Revisar reporte: reports/executive-summary.json")
    if use_amazon:
        print("   2. Verificar productos: reports/affiliate-health.json")
    print("   3. Hacer commit: git add . && git commit -m \"build: actualización con Amazon\"")
    print("   4. Hacer push: git push origin main")
    print("   5. GitHub Actions deployará automáticamente")
    
    if not use_amazon:
        print()
        print("📋 PARA ACTIVAR AMAZON:")
        print("   1. Ve a: https://afiliados.amazon.es/assoc_credentials/home")
        print("   2. Obtén tus credenciales de API")
        print("   3. Copia .env.amazon a .env")
        print("   4. Completa AMAZON_ACCESS_KEY_ID y AMAZON_SECRET_ACCESS_KEY")
        print("   5. Vuelve a ejecutar el build")
    
    print()
    print("🌐 CONFIGURACIÓN DNS:")
    print("   - Ve a Cloudflare Dashboard")
    print("   - Configura 4 registros A apuntando a GitHub Pages")
    print("   - Espera propagación DNS (24-48 horas)")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    main()
