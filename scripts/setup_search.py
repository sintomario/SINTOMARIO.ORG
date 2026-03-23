#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Integración de búsqueda estática con Pagefind
Genera índice de búsqueda para los nodos del corpus.
"""

import json
import subprocess
import sys
from pathlib import Path

def install_pagefind():
    """Instalar Pagefind si no está disponible."""
    try:
        subprocess.run(["npx", "pagefind", "--version"], check=True, capture_output=True)
        print("✓ Pagefind ya está instalado")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚡ Instalando Pagefind...")
        subprocess.run(["npm", "install", "-g", "pagefind"], check=True)
        print("✓ Pagefind instalado")

def generate_search_index(public_dir: str = "./public"):
    """Generar índice de búsqueda con Pagefind."""
    public_path = Path(public_dir)
    
    if not public_path.exists():
        print(f"❌ Directorio {public_dir} no existe")
        return False
    
    print(f"\n🔍 Generando índice de búsqueda en {public_dir}...")
    
    try:
        # Ejecutar Pagefind
        result = subprocess.run(
            ["npx", "pagefind", "--site", public_dir, "--verbose"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Índice de búsqueda generado exitosamente")
            print(result.stdout)
            return True
        else:
            print(f"❌ Error generando índice: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error ejecutando Pagefind: {e}")
        return False

def create_search_ui(public_dir: str = "./public"):
    """Crear UI de búsqueda para integrar en templates."""
    
    search_html = '''
<!-- Pagefind Search UI -->
<div id="search" class="pagefind-search"></div>
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ 
            element: "#search",
            showImages: false,
            showEmptyFilters: false,
            translations: {
                placeholder: "Buscar síntomas, emociones, sistemas...",
                clear_search: "Limpiar",
                load_more: "Cargar más resultados",
                search_label: "Buscar en SINTOMARIO",
                filters_label: "Filtros",
                zero_results: "No se encontraron resultados para [SEARCH_TERM]",
                many_results: "[COUNT] resultados encontrados",
                one_result: "1 resultado encontrado",
                alt_search: "También buscando resultados sin [SEARCH_TERM]",
                search_suggestion: "Buscando resultados para [SEARCH_TERM]"
            }
        });
    });
</script>
<style>
    .pagefind-search {
        max-width: 600px;
        margin: 2rem auto;
    }
    .pagefind-ui__search-input {
        font-family: var(--font-ui) !important;
        border: 2px solid var(--border-default) !important;
        border-radius: 8px !important;
        padding: 0.75rem 1rem !important;
    }
    .pagefind-ui__search-input:focus {
        border-color: var(--color-accent) !important;
        outline: none !important;
    }
    .pagefind-ui__result {
        border-bottom: 1px solid var(--border-subtle) !important;
        padding: 1rem 0 !important;
    }
    .pagefind-ui__result-title {
        font-family: var(--font-display) !important;
        font-weight: 600 !important;
    }
    .pagefind-ui__result-excerpt {
        font-family: var(--font-body) !important;
    }
</style>
'''
    
    search_path = Path(public_dir) / "search-widget.html"
    with open(search_path, 'w', encoding='utf-8') as f:
        f.write(search_html)
    
    print(f"✅ UI de búsqueda creada en {search_path}")
    return True

def create_search_page(public_dir: str = "./public"):
    """Crear página de búsqueda dedicada."""
    
    search_page = '''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Búsqueda | SINTOMARIO</title>
    <meta name="description" content="Busca síntomas, emociones y sistemas orgánicos en SINTOMARIO. Explora las conexiones mente-cuerpo.">
    <link rel="stylesheet" href="/css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Mono&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">SINTOMARIO</a>
            <nav class="nav">
                <a href="/">Inicio</a>
                <a href="/sobre">Sobre</a>
                <a href="/faq">FAQ</a>
            </nav>
        </div>
    </header>

    <main class="container search-page">
        <h1>Busca en el corpus</h1>
        <p class="lead">Encuentra síntomas, emociones, sistemas orgánicos y sus conexiones.</p>
        
        <div id="search" class="pagefind-search"></div>
    </main>

    <footer class="footer">
        <p>SINTOMARIO.ORG — El diccionario del síntoma</p>
        <p class="disclaimer">Contenido informativo. No reemplaza consulta médica profesional.</p>
    </footer>

    <link href="/pagefind/pagefind-ui.css" rel="stylesheet">
    <script src="/pagefind/pagefind-ui.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', (event) => {
            new PagefindUI({ 
                element: "#search",
                showImages: false,
                showEmptyFilters: false,
                translations: {
                    placeholder: "Buscar síntomas, emociones, sistemas...",
                    clear_search: "Limpiar",
                    load_more: "Cargar más resultados",
                    search_label: "Buscar en SINTOMARIO",
                    filters_label: "Filtros",
                    zero_results: "No se encontraron resultados para [SEARCH_TERM]",
                    many_results: "[COUNT] resultados encontrados",
                    one_result: "1 resultado encontrado",
                    alt_search: "También buscando resultados sin [SEARCH_TERM]",
                    search_suggestion: "Buscando resultados para [SEARCH_TERM]"
                }
            });
        });
    </script>
</body>
</html>'''
    
    search_page_path = Path(public_dir) / "buscar" / "index.html"
    search_page_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(search_page_path, 'w', encoding='utf-8') as f:
        f.write(search_page)
    
    print(f"✅ Página de búsqueda creada en {search_page_path}")
    return True

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Sistema de búsqueda")
    parser.add_argument("--install", action="store_true", help="Instalar Pagefind")
    parser.add_argument("--index", action="store_true", help="Generar índice de búsqueda")
    parser.add_argument("--ui", action="store_true", help="Crear UI de búsqueda")
    parser.add_argument("--page", action="store_true", help="Crear página de búsqueda")
    parser.add_argument("--all", action="store_true", help="Ejecutar todo el pipeline")
    parser.add_argument("--public-dir", default="./public", help="Directorio público")
    
    args = parser.parse_args()
    
    if args.install or args.all:
        install_pagefind()
    
    if args.index or args.all:
        generate_search_index(args.public_dir)
    
    if args.ui or args.all:
        create_search_ui(args.public_dir)
    
    if args.page or args.all:
        create_search_page(args.public_dir)
    
    if not any([args.install, args.index, args.ui, args.page, args.all]):
        # Modo por defecto: instalar y generar todo
        print("🚀 Inicializando sistema de búsqueda completo...")
        install_pagefind()
        generate_search_index(args.public_dir)
        create_search_ui(args.public_dir)
        create_search_page(args.public_dir)
        print("\n✅ Sistema de búsqueda completamente configurado")

if __name__ == "__main__":
    main()
