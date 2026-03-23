#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Generador de páginas Hub
Genera páginas índice para zonas y contextos (navegación por territorios).
"""

import json
import sys
from pathlib import Path
from typing import List, Dict, Any

# Añadir el directorio scripts al path para importar el helper
sys.path.append(str(Path(__file__).parent))
from metadata_helper import MetadataHelper

class HubGenerator:
    """Generador de páginas hub para navegación por territorios."""
    
    def __init__(self, corpus_dir: str = "corpus", output_dir: str = "public"):
        self.corpus_dir = Path(corpus_dir)
        self.output_dir = Path(output_dir)
        self.metadata = MetadataHelper("config.json")
        
    def load_corpus(self) -> Dict[str, Any]:
        """Cargar datos del corpus."""
        data = {}
        
        with open(self.corpus_dir / "entidades.json", 'r', encoding='utf-8') as f:
            data["entidades"] = json.load(f)
        
        with open(self.corpus_dir / "contextos.json", 'r', encoding='utf-8') as f:
            data["contextos"] = json.load(f)
            
        return data
    
    def generar_hub_zonas(self) -> bool:
        """Generar página hub de zonas corporales."""
        data = self.load_corpus()
        entidades = data["entidades"]
        
        html = self._template_hub_zonas(entidades)
        
        output_path = self.output_dir / "zona" / "index.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✓ Generado hub de zonas: {output_path}")
        return True
    
    def generar_hub_contextos(self) -> bool:
        """Generar página hub de contextos emocionales."""
        data = self.load_corpus()
        contextos = data["contextos"]
        
        html = self._template_hub_contextos(contextos)
        
        output_path = self.output_dir / "contexto" / "index.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✓ Generado hub de contextos: {output_path}")
        return True
    
    def generar_pagina_por_zona(self, entidad: Dict) -> bool:
        """Generar página índice para una zona específica."""
        data = self.load_corpus()
        contextos = data["contextos"]
        
        html = self._template_zona_detalle(entidad, contextos)
        
    def _slugify(self, text: str) -> str:
        """Slugificar texto de forma consistente con el motor."""
        import re
        text = text.lower()
        text = re.sub(r'[áàäâ]', 'a', text)
        text = re.sub(r'[éèëê]', 'e', text)
        text = re.sub(r'[íìïî]', 'i', text)
        text = re.sub(r'[óòöô]', 'o', text)
        text = re.sub(r'[úùüû]', 'u', text)
        text = re.sub(r'[ñ]', 'n', text)
        text = re.sub(r'[^a-z0-9-]', '-', text)
        text = re.sub(r'-+', '-', text)
        return text.strip('-')

    def generar_pagina_por_zona(self, entidad: Dict) -> bool:
        """Generar página índice para una zona específica."""
        data = self.load_corpus()
        contextos = data["contextos"]
        
        html = self._template_zona_detalle(entidad, contextos)
        
        slug = self._slugify(entidad.get("nombre", ""))
        output_path = self.output_dir / "zona" / slug / "index.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✓ Generada página de zona: {entidad['nombre']}")
        return True
    
    def generar_pagina_por_contexto(self, contexto: Dict) -> bool:
        """Generar página índice para un contexto específico."""
        data = self.load_corpus()
        entidades = data["entidades"]
        
        html = self._template_contexto_detalle(contexto, entidades)
        
        slug = self._slugify(contexto.get("nombre", ""))
        output_path = self.output_dir / "contexto" / slug / "index.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✓ Generada página de contexto: {contexto['nombre']}")
        return True
    
    def _template_hub_zonas(self, entidades: List[Dict]) -> str:
        """Template para hub de zonas."""
        
        zona_cards = ""
        for entidad in entidades:
            nombre = entidad.get("nombre", "")
            sistema = entidad.get("sistema", "")
            descripcion = entidad.get("descripcion", "")[:100] + "..."
            color = self._get_color_sistema(sistema)
            
            slug = nombre.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
            
            zona_cards += f'''
            <div class="hub-card" style="border-color: {color}">
                <div class="hub-card-header" style="background: {color}20">
                    <h3>{nombre}</h3>
                    <span class="hub-tag" style="background: {color}">{sistema}</span>
                </div>
                <p class="hub-card-desc">{descripcion}</p>
                <a href="/zona/{slug}" class="hub-card-link" style="color: {color}">Explorar lecturas →</a>
            </div>
            '''
        
        
        metadata_html = self.metadata.generate_head_metadata(
            title="Zonas Corporales",
            description="Explora las 20 zonas corporales de SINTOMARIO. Cada zona contiene 20 lecturas sobre diferentes contextos emocionales.",
            path="/zona",
            page_type="WebPage"
        )
        
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
{metadata_html}
    <link rel="stylesheet" href="/css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Mono&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">SINTOMARIO</a>
            <nav class="nav">
                <a href="/">Inicio</a>
                <a href="/zona/" class="active">Zonas</a>
                <a href="/contexto/">Contextos</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="page-header">
            <span class="meta-label">Territorio</span>
            <h1>Zonas Corporales</h1>
            <p class="lead">Explora las {len(entidades)} zonas del cuerpo. Cada zona contiene 20 lecturas sobre diferentes contextos emocionales.</p>
        </div>

        <div class="hub-grid">
            {zona_cards}
        </div>

        <div class="hub-navigation">
            <p>También puedes explorar por <a href="/contexto">contextos emocionales</a>.</p>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p><strong>SINTOMARIO.ORG</strong> — El diccionario del síntoma</p>
            <div class="footer-links">
                <a href="/sobre">Sobre</a>
                <a href="/faq">FAQ</a>
                <a href="/metodologia">Metodología</a>
            </div>
        </div>
    </footer>

    <style>
        .hub-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }}

        .hub-card {{
            background: var(--color-background-card, white);
            border: 2px solid;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }}

        .hub-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }}

        .hub-card-header {{
            padding: 1.25rem;
            border-bottom: 1px solid var(--border-subtle, #e0e0e0);
        }}

        .hub-card-header h3 {{
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }}

        .hub-tag {{
            display: inline-block;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .hub-card-desc {{
            padding: 1rem 1.25rem;
            margin: 0;
            color: var(--color-text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
        }}

        .hub-card-link {{
            display: block;
            padding: 1rem 1.25rem;
            text-decoration: none;
            font-weight: 600;
            border-top: 1px solid var(--border-subtle, #e0e0e0);
        }}

        .hub-navigation {{
            text-align: center;
            margin: 3rem 0;
            padding: 2rem;
            background: var(--color-background-elevated, #f5f5f5);
            border-radius: 12px;
        }}

        .hub-navigation a {{
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 600;
        }}
    </style>

    <script>
        const theme = localStorage.getItem('theme') || 'dark';
        if (theme === 'dark') {{
            document.documentElement.classList.add('theme-dark');
        }}
    </script>
</body>
</html>'''
    
    def _template_hub_contextos(self, contextos: List[Dict]) -> str:
        """Template para hub de contextos."""
        
        contexto_cards = ""
        for ctx in contextos:
            nombre = ctx.get("nombre", "")
            herida = ctx.get("herida_emocional", "")
            descripcion = ctx.get("descripcion", "")[:100] + "..."
            # Mapear intensidad string a color
            intensidad_str = ctx.get("intensidad", "media")
            color_map = {
                "baja": "#4caf50",
                "moderada": "#8bc34a", 
                "media": "#ffc107",
                "alta": "#ff9800",
                "extrema": "#f44336"
            }
            color = color_map.get(intensidad_str, "#ffc107")
            
            slug = nombre.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
            
            contexto_cards += f'''
            <div class="hub-card" style="border-color: {color}">
                <div class="hub-card-header" style="background: {color}20">
                    <h3>{nombre}</h3>
                    <span class="hub-tag" style="background: {color}">Intensidad: {intensidad_str}</span>
                </div>
                <p class="hub-card-herida"><strong>Herida:</strong> {herida}</p>
                <p class="hub-card-desc">{descripcion}</p>
                <a href="/contexto/{slug}" class="hub-card-link" style="color: {color}">Explorar lecturas →</a>
            </div>
            '''
        
        
        metadata_html = self.metadata.generate_head_metadata(
            title="Contextos Emocionales",
            description="Explora los 20 contextos emocionales de SINTOMARIO. Cada contexto contiene 20 lecturas sobre diferentes zonas corporales.",
            path="/contexto",
            page_type="WebPage"
        )

        return f'''<!DOCTYPE html>
<html lang="es">
<head>
{metadata_html}
    <link rel="stylesheet" href="/css/main.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Mono&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <a href="/" class="logo">SINTOMARIO</a>
            <nav class="nav">
                <a href="/">Inicio</a>
                <a href="/zona/">Zonas</a>
                <a href="/contexto/" class="active">Contextos</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="page-header">
            <span class="meta-label">Emociones</span>
            <h1>Contextos Emocionales</h1>
            <p class="lead">Explora los {len(contextos)} contextos emocionales. Cada contexto contiene 20 lecturas sobre diferentes zonas corporales.</p>
        </div>

        <div class="hub-grid">
            {contexto_cards}
        </div>

        <div class="hub-navigation">
            <p>También puedes explorar por <a href="/zona">zonas corporales</a>.</p>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p><strong>SINTOMARIO.ORG</strong> — El diccionario del síntoma</p>
            <div class="footer-links">
                <a href="/sobre">Sobre</a>
                <a href="/faq">FAQ</a>
                <a href="/metodologia">Metodología</a>
            </div>
        </div>
    </footer>

    <style>
        .hub-card-herida {{
            padding: 0.5rem 1.25rem;
            margin: 0;
            font-size: 0.9rem;
            color: var(--color-text-secondary);
            background: var(--color-background-elevated, #f8f8f8);
        }}
        
        .hub-card-herida strong {{
            color: var(--color-text-primary);
        }}

        /* Reuse styles from zona hub */
        .hub-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }}

        .hub-card {{
            background: var(--color-background-card, white);
            border: 2px solid;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }}

        .hub-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }}

        .hub-card-header {{
            padding: 1.25rem;
            border-bottom: 1px solid var(--border-subtle, #e0e0e0);
        }}

        .hub-card-header h3 {{
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }}

        .hub-tag {{
            display: inline-block;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }}

        .hub-card-desc {{
            padding: 1rem 1.25rem;
            margin: 0;
            color: var(--color-text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
        }}

        .hub-card-link {{
            display: block;
            padding: 1rem 1.25rem;
            text-decoration: none;
            font-weight: 600;
            border-top: 1px solid var(--border-subtle, #e0e0e0);
        }}

        .hub-navigation {{
            text-align: center;
            margin: 3rem 0;
            padding: 2rem;
            background: var(--color-background-elevated, #f5f5f5);
            border-radius: 12px;
        }}

        .hub-navigation a {{
            color: var(--color-accent);
            text-decoration: none;
            font-weight: 600;
        }}
    </style>

    <script>
        const theme = localStorage.getItem('theme') || 'dark';
        if (theme === 'dark') {{
            document.documentElement.classList.add('theme-dark');
        }}
    </script>
</body>
</html>'''
    
    def _template_zona_detalle(self, entidad: Dict, contextos: List[Dict]) -> str:
        """Template para página de zona específica."""
        # Implementation for individual zona pages
        nombre = entidad.get("nombre", "")
        sistema = entidad.get("sistema", "")
        slug_base = nombre.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
        
        lecturas_list = ""
        for ctx in contextos:
            nombre_ctx = ctx.get("nombre", "")
            ctx_slug = nombre_ctx.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ü", "u").replace("ñ", "n")
            herida = ctx.get("herida_emocional", "")
            lecturas_list += f'''
            <div class="lectura-item">
                <a href="/cuerpo/{slug_base}/{ctx_slug}" class="lectura-link">
                    <span class="lectura-title">{nombre} + {ctx.get("nombre", "")}</span>
                    <span class="lectura-meta">Herida: {herida}</span>
                </a>
            </div>
            '''
            
        metadata_html = self.metadata.generate_head_metadata(
            title=f"{nombre} - Zona Corporal",
            description=f"Explora las lecturas de {nombre} con diferentes contextos emocionales.",
            path=f"/zona/{slug_base}",
            page_type="WebPage"
        )
        
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
{metadata_html}
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <header class="header">
        <a href="/" class="logo">SINTOMARIO</a>
    </header>
    <main class="container">
        <h1>{nombre}</h1>
        <p class="meta">Sistema: {sistema}</p>
        <div class="lecturas-list">
            {lecturas_list}
        </div>
        <a href="/zona">← Volver a zonas</a>
    </main>
</body>
</html>'''
    
    def _template_contexto_detalle(self, contexto: Dict, entidades: List[Dict]) -> str:
        """Template para página de contexto específico."""
        # Implementation for individual contexto pages
        nombre = contexto.get("nombre", "")
        herida = contexto.get("herida_emocional", "")
        
        slug_base = nombre.lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ü", "u").replace("ñ", "n")
        
        lecturas_list = ""
        for ent in entidades:
            ent_slug = ent.get("nombre", "").lower().replace(" ", "-").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
            sistema = ent.get("sistema", "")
            lecturas_list += f'''
            <div class="lectura-item">
                <a href="/cuerpo/{ent_slug}/{slug_base}" class="lectura-link">
                    <span class="lectura-title">{ent.get("nombre", "")} + {nombre}</span>
                    <span class="lectura-meta">Sistema: {sistema}</span>
                </a>
            </div>
            '''
            
        metadata_html = self.metadata.generate_head_metadata(
            title=f"{nombre} - Contexto Emocional",
            description=f"Explora las lecturas de {nombre} en diferentes zonas corporales.",
            path=f"/contexto/{slug_base}",
            page_type="WebPage"
        )
        
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
{metadata_html}
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <header class="header">
        <a href="/" class="logo">SINTOMARIO</a>
    </header>
    <main class="container">
        <h1>{nombre}</h1>
        <p class="meta">Herida emocional: {herida}</p>
        <div class="lecturas-list">
            {lecturas_list}
        </div>
        <a href="/contexto">← Volver a contextos</a>
    </main>
</body>
</html>'''
    
    def _get_color_sistema(self, sistema: str) -> str:
        """Obtener color para el sistema orgánico."""
        colores = {
            "digestivo": "#2d7d32",
            "respiratorio": "#1976d2",
            "nervioso": "#ff8f00",
            "cardiovascular": "#d32f2f",
            "muscular": "#7b1fa2",
            "esqueletico": "#5d4037",
            "endocrino": "#00897b",
            "linfatico": "#303f9f",
            "reproductivo": "#c2185b",
            "urinario": "#0288d1",
            "hepatico": "#689f38",
            "renal": "#00796b",
            "pancreatico": "#f57c00",
            "biliar": "#fbc02d",
            "inmunologico": "#6a1b9a",
            "tegumentario": "#e65100",
            "visual": "#1565c0",
            "auditivo": "#00695c"
        }
        return colores.get(sistema.lower(), "#2d7d32")

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Generador de páginas Hub")
    parser.add_argument("--output", default="./public", help="Directorio de salida")
    parser.add_argument("--corpus", default="./corpus", help="Directorio del corpus")
    parser.add_argument("--all", action="store_true", help="Generar todos los hubs")
    parser.add_argument("--zonas", action="store_true", help="Generar hub de zonas")
    parser.add_argument("--contextos", action="store_true", help="Generar hub de contextos")
    parser.add_argument("--detalle", action="store_true", help="Generar páginas de detalle")
    
    args = parser.parse_args()
    
    generator = HubGenerator(corpus_dir=args.corpus, output_dir=args.output)
    data = generator.load_corpus()
    
    if args.all or args.zonas:
        generator.generar_hub_zonas()
    
    if args.all or args.contextos:
        generator.generar_hub_contextos()
    
    if args.all or args.detalle:
        for entidad in data["entidades"]:
            generator.generar_pagina_por_zona(entidad)
        for contexto in data["contextos"]:
            generator.generar_pagina_por_contexto(contexto)
    
    if not any([args.all, args.zonas, args.contextos, args.detalle]):
        # Modo por defecto: generar hubs principales
        print("Generando hubs principales...")
        generator.generar_hub_zonas()
        generator.generar_hub_contextos()
        print("✅ Hubs generados exitosamente")

if __name__ == "__main__":
    main()
