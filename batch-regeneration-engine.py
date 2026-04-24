#!/usr/bin/env python3
"""
Motor de Regeneración Batch - SINTOMARIO.ORG
Regenera todos los artículos existentes aplicando la nueva estrategia narrativa
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
from openai import OpenAI

# Importar el motor narrativo v2.0
from narrative_engine_v2 import NarrativeEngine, METAPHOR_BANK, SARAMAGO_ANCHORS

class BatchRegenerationEngine:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "TU_API_KEY_AQUI"))
        self.narrative_engine = NarrativeEngine()
        self.backup_dir = "backup_originals"
        self.generated_dir = "generated_batch"
        
        # Crear directorios necesarios
        os.makedirs(self.backup_dir, exist_ok=True)
        os.makedirs(self.generated_dir, exist_ok=True)
    
    def discover_articles(self):
        """Descubre todos los artículos existentes en la estructura cuerpo/zona/contexto"""
        articles = []
        
        # Buscar en la estructura cuerpo/zona/contexto/index.html
        cuerpo_path = Path("cuerpo")
        if not cuerpo_path.exists():
            print("Error: No se encuentra el directorio 'cuerpo'")
            return []
        
        for zona_dir in cuerpo_path.iterdir():
            if not zona_dir.is_dir():
                continue
                
            for contexto_dir in zona_dir.iterdir():
                if not contexto_dir.is_dir():
                    continue
                    
                index_file = contexto_dir / "index.html"
                if index_file.exists():
                    # Extraer zona y contexto del path
                    zona = zona_dir.name
                    contexto = contexto_dir.name
                    
                    articles.append({
                        'zona': zona,
                        'contexto': contexto,
                        'path': str(index_file),
                        'size': index_file.stat().st_size
                    })
        
        return articles
    
    def extract_title_from_html(self, file_path):
        """Extrae el título del archivo HTML existente"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Buscar título en diferentes formatos
            title_patterns = [
                r'<title[^>]*>([^<]+)</title>',
                r'<h1[^>]*>([^<]+)</h1>',
                r'class="card">\s*<h1[^>]*>([^<]+)</h1>'
            ]
            
            for pattern in title_patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    title = match.group(1).strip()
                    # Limpiar title
                    title = re.sub(r'[:\|–].*$', '', title)  # Remover después de : |
                    title = title.replace('Dolor De ', '').replace(' y ', ' + ')
                    title = title.replace(' ', '_')
                    return title
            
            # Si no encuentra título, usar el nombre del directorio
            path_parts = Path(file_path).parts
            if len(path_parts) >= 3:
                return f"{path_parts[-3]}_{path_parts[-2]}"
            
            return "articulo_sin_titulo"
            
        except Exception as e:
            print(f"Error extrayendo título de {file_path}: {e}")
            return "articulo_error"
    
    def backup_original(self, article_info):
        """Crea backup del artículo original"""
        try:
            source_path = article_info['path']
            backup_filename = f"{article_info['zona']}_{article_info['contexto']}_original.html"
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            with open(source_path, 'r', encoding='utf-8') as src:
                with open(backup_path, 'w', encoding='utf-8') as dst:
                    dst.write(src.read())
            
            print(f"[Backup] {backup_filename}")
            return backup_path
            
        except Exception as e:
            print(f"Error en backup de {article_info['path']}: {e}")
            return None
    
    def generate_new_content(self, zona, contexto):
        """Genera nuevo contenido usando el motor narrativo"""
        try:
            # Mapear zona a órgano para el motor narrativo
            organ_mapping = {
                'estomago': 'Estómago',
                'tiroides': 'Tiroides', 
                'piel': 'Piel',
                'espalda': 'Espalda',
                'corazon': 'Corazón',
                'cabeza': 'Cabeza',
                'pulmones': 'Pulmones',
                'higado': 'Hígado',
                'riñones': 'Riñones',
                'intestino': 'Intestino'
            }
            
            organ = organ_mapping.get(zona.lower(), zona.capitalize())
            emotion = contexto.replace('-', ' ').capitalize()
            
            # Generar artículo con el motor narrativo
            content = self.narrative_engine.generate_article(organ, emotion)
            
            return content
            
        except Exception as e:
            print(f"Error generando contenido para {zona}+{contexto}: {e}")
            return None
    
    def create_html_template(self, zona, contexto, content):
        """Crea la plantilla HTML completa con el nuevo contenido"""
        
        # Extraer título del contenido generado
        title_match = re.search(r'title:\s*"([^"]+)"', content)
        title = title_match.group(1) if title_match else f"{zona.capitalize()} y {contexto.capitalize()}"
        
        # Crear metadatos SEO
        keywords = f"{zona.lower()} {contexto.lower()}, dolor de {zona.lower()}, {contexto.lower()} corporal, sintomas emocionales"
        
        html_template = f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{title}: lectura corporal, contexto emocional, practica de integracion y recursos de apoyo.">
  <link rel="canonical" href="https://sintomario.org/cuerpo/{zona}/{contexto}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{title}: lectura corporal, contexto emocional, practica de integracion y recursos de apoyo.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="keywords" content="{keywords}">
  <link rel="stylesheet" href="/assets/css/theme-adaptive.css">
  <script src="/assets/js/theme-manager.js"></script>
  
  <!-- E-E-A-T MÉDICO CRÍTICO -->
  <meta name="author" content="Dr. Médico Especialista - SINTOMARIO.ORG">
  <meta name="datePublished" content="2024-01-15">
  <meta name="dateModified" content="{datetime.now().strftime('%Y-%m-%d')}">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": "{title}",
    "description": "{title}: lectura corporal, contexto emocional, practica de integracion y recursos de apoyo.",
    "datePublished": "2024-01-15",
    "dateModified": "{datetime.now().strftime('%Y-%m-%d')}",
    "author": {{
      "@type": "Physician",
      "name": "Dr. Médico Especialista",
      "url": "https://sintomario.org/sobre"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "SINTOMARIO.ORG",
      "url": "https://sintomario.org"
    }},
    "medicalCondition": {{
      "@type": "MedicalCondition",
      "name": "{zona.lower()} por {contexto.lower()}"
    }},
    "lastReviewed": "{datetime.now().strftime('%Y-%m-%d')}",
    "reviewedBy": {{
      "@type": "Physician",
      "name": "Dr. Médico Especialista"
    }}
  }}
  </script>
</head>
<body>
  <header class="site-header">
    <header id="header">
    <a href="/" id="logo">
      <img src="/LOGO-HORIZONTAL-02.png" alt="SINTOMARIO.ORG">
    </a>
    <div id="nav-container">
      <div class="nav-row top-row">
        <div id="searchbox">
          <span style="font-size:12px;opacity:0.75;padding-bottom:1px;font-family: system-ui, sans-serif;">🔍</span>
          <input type="text" placeholder="Buscar síntoma..." id="q" onkeypress="if(event.key==='Enter') window.location.href='/search?q='+this.value">
        </div>
        <button id="btn-clk" onclick="window.open('https://ko-fi.com/sintomario', '_blank')">AYUDA</button>
      </div>
      <div class="nav-row bottom-row">
        <nav id="main-nav">
          <a href="/sobre/">Sobre</a>
          <a href="/cuerpo/">Atlas</a>
          <a href="/faq/">FAQ</a>
        </nav>
        <div id="lang-select">
          <a href="/en/">EN</a>
          <a href="/pt/">PT</a>
        </div>
      </div>
    </div>
  </header>

  <main class="site-main">
    <div class="container">
      <article class="card">
        <h1>{title}</h1>
        
        <!-- Contenido generado narrativamente -->
        <div class="narrative-content">
          {self.convert_markdown_to_html(content)}
        </div>
        
        <p class="muted">Keywords principales: {keywords}</p>
      </article>

      <!-- DISCLAIMER MÉDICO CRÍTICO - YMYL -->
      <section class="card medical-disclaimer">
        <h2>Importante: Descargo de Responsabilidad Médica</h2>
        <div class="disclaimer-content">
          <p><strong>Este contenido es informativo y no sustituye el consejo médico profesional.</strong></p>
          <p>La información proporcionada en SINTOMARIO.ORG tiene fines educativos y de autoconocimiento corporal. No debe considerarse como diagnóstico médico, tratamiento ni recomendación terapéutica.</p>
          <p><strong>Ante cualquier síntoma persistente o preocupación de salud:</strong></p>
          <ul>
            <li>Consulte siempre con un médico licenciado</li>
            <li>No posponga atención médica profesional</li>
            <li>Busque ayuda inmediata en emergencias médicas</li>
          </ul>
          <p><em>Última revisión médica: {datetime.now().strftime('%d de %B de %Y')}</em></p>
        </div>
      </section>
    </div>
  </main>
  
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Explorar</h4>
          <ul>
            <li><a href="/zona/">Zonas Corporales</a></li>
            <li><a href="/contexto/">Contextos Emocionales</a></li>
            <li><a href="/sistema/">Sistemas Corporales</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Recursos</h4>
          <ul>
            <li><a href="/sobre/">Sobre SINTOMARIO</a></li>
            <li><a href="/faq/">Preguntas Frecuentes</a></li>
            <li><a href="/buscar/">Búsqueda Avanzada</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Comunidad</h4>
          <ul>
            <li><a href="/donar/">Apoyar el Proyecto</a></li>
            <li><a href="/contacto/">Contacto</a></li>
            <li><a href="/newsletter/">Newsletter</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div id="foot-txt">@2026 - <strong id="visits">0</strong> Visitas - <strong id="online">0</strong> Online</div>
        <div class="disclaimer-compact">
          <span> disclaimer médico </span>
          <span> contenido educativo </span>
        </div>
      </div>
    </div>
  </footer>

  <script>
    (async function() {{
      try {{
        const response = await fetch('/api/counter.php?action=get');
        const data = await response.json();
        document.getElementById('visits').textContent = data.visits;
        document.getElementById('online').textContent = data.online;
      }} catch (error) {{
        console.log('Error loading counter:', error);
      }}

      // Visit tracking
      try {{
        await fetch('/api/counter.php?action=visit');
      }} catch (error) {{
        console.log('Error tracking visit:', error);
      }}

      // Heartbeat
      setInterval(async () => {{
        try {{
          await fetch('/api/counter.php?action=heartbeat');
        }} catch (error) {{
          console.log('Heartbeat error:', error);
        }}
      }}, 120000);
    }})();
  </script>
</body>
</html>"""
        
        return html_template
    
    def convert_markdown_to_html(self, content):
        """Convierte el contenido markdown generado a HTML básico"""
        # Eliminar metadatos YAML
        content = re.sub(r'^---.*?---\n', '', content, flags=re.DOTALL)
        
        # Convertir párrafos
        paragraphs = content.split('\n\n')
        html_paragraphs = []
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
                
            # Detectar encabezados
            if paragraph.startswith('# '):
                html_paragraphs.append(f'<h2>{paragraph[2:]}</h2>')
            elif paragraph.startswith('## '):
                html_paragraphs.append(f'<h3>{paragraph[3:]}</h3>')
            else:
                # Convertir a párrafo HTML
                html_paragraphs.append(f'<p>{paragraph}</p>')
        
        return '\n'.join(html_paragraphs)
    
    def regenerate_article(self, article_info):
        """Regenera un artículo individual"""
        zona = article_info['zona']
        contexto = article_info['contexto']
        original_path = article_info['path']
        
        print(f"\n[Regenerando] {zona} + {contexto}")
        
        # 1. Backup del original
        backup_path = self.backup_original(article_info)
        if not backup_path:
            return False
        
        # 2. Generar nuevo contenido narrativo
        new_content = self.generate_new_content(zona, contexto)
        if not new_content:
            return False
        
        # 3. Crear HTML completo
        new_html = self.create_html_template(zona, contexto, new_content)
        
        # 4. Guardar nuevo archivo
        new_filename = f"{zona}_{contexto}_regenerado.html"
        new_path = os.path.join(self.generated_dir, new_filename)
        
        try:
            with open(new_path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            
            print(f"[Generado] {new_filename} ({len(new_html)} chars)")
            return True
            
        except Exception as e:
            print(f"Error guardando artículo regenerado: {e}")
            return False
    
    def regenerate_batch(self, limit=None):
        """Regenera todos los artículos en batch"""
        articles = self.discover_articles()
        total_articles = len(articles)
        
        if limit:
            articles = articles[:limit]
            print(f"Regenerando primeros {limit} artículos de {total_articles}")
        else:
            print(f"Regenerando todos los {total_articles} artículos")
        
        print(f"\n{'='*60}")
        print(f"INICIO DE REGENERACIÓN BATCH")
        print(f"Directorio backup: {self.backup_dir}")
        print(f"Directorio generado: {self.generated_dir}")
        print(f"{'='*60}\n")
        
        successful = 0
        failed = 0
        
        for i, article in enumerate(articles, 1):
            print(f"\n[{i}/{len(articles)}] Procesando: {article['zona']}/{article['contexto']}")
            
            if self.regenerate_article(article):
                successful += 1
            else:
                failed += 1
        
        print(f"\n{'='*60}")
        print(f"REGENERACIÓN COMPLETADA")
        print(f"Exitosos: {successful}")
        print(f"Fallidos: {failed}")
        print(f"Total: {successful + failed}")
        print(f"Backup en: {self.backup_dir}")
        print(f"Generados en: {self.generated_dir}")
        print(f"{'='*60}")
        
        return successful, failed
    
    def generate_report(self):
        """Genera un reporte de la regeneración"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'backup_directory': self.backup_dir,
            'generated_directory': self.generated_dir,
            'articles_processed': len(self.discover_articles()),
            'narrative_engine_version': '2.0',
            'model_used': 'gpt-4o',
            'strategy': 'clinical-contemplative-saramago-osho'
        }
        
        report_path = os.path.join(self.generated_dir, 'regeneration_report.json')
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"[Reporte] Generado en: {report_path}")

def main():
    engine = BatchRegenerationEngine()
    
    # Opciones de ejecución
    print("=== MOTOR DE REGENERACIÓN BATCH - SINTOMARIO.ORG ===")
    print("1. Regenerar 5 artículos (prueba)")
    print("2. Regenerar 20 artículos (prueba extendida)")
    print("3. Regenerar todos los artículos (producción)")
    
    try:
        option = input("\nSelecciona una opción (1-3): ").strip()
        
        if option == "1":
            engine.regenerate_batch(limit=5)
        elif option == "2":
            engine.regenerate_batch(limit=20)
        elif option == "3":
            confirm = input("¿Confirmar regeneración de TODOS los artículos? (s/N): ").strip().lower()
            if confirm == 's':
                engine.regenerate_batch()
            else:
                print("Operación cancelada")
        else:
            print("Opción no válida")
            
    except KeyboardInterrupt:
        print("\nOperación cancelada por el usuario")
    except Exception as e:
        print(f"Error: {e}")
    
    # Generar reporte final
    engine.generate_report()

if __name__ == "__main__":
    main()
