#!/usr/bin/env python3
"""
Motor de Regeneración Batch v3.2-SEO-FIXED - SINTOMARIO.ORG
Regenera todos los artículos aplicando estrategia narrativa Saramago + Osho + Jung
con SEO Parásito CORREGIDO y E-E-A-T médico optimizado para dominar Google
"""

import os
import re
import json
import random
from datetime import datetime
from openai import OpenAI, RateLimitError, APITimeoutError
from pathlib import Path

# Importar el motor narrativo v3.2-patched
from narrative_engine_v3_2_patched import NarrativeEngineV3_2_PATCHED

class BatchRegenerationEngineV3_2_SEO_FIXED:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "TU_API_KEY_AQUI"))
        self.narrative_engine = NarrativeEngineV3_2_PATCHED()
        self.backup_dir = "backup_originals_v3_2_seo_fixed"
        self.generated_dir = "generated_batch_v3_2_seo_fixed"
        
        # Crear directorios necesarios
        os.makedirs(self.backup_dir, exist_ok=True)
        os.makedirs(self.generated_dir, exist_ok=True)
    
    def discover_articles(self):
        """Descubre todos los artículos existentes en la estructura cuerpo/zona/contexto"""
        articles = []
        
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
                
            title_patterns = [
                r'<title[^>]*>([^<]+)</title>',
                r'<h1[^>]*>([^<]+)</h1>',
                r'class="card">\s*<h1[^>]*>([^<]+)</h1>'
            ]
            
            for pattern in title_patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    title = match.group(1).strip()
                    title = re.sub(r'[:\|–].*$', '', title)
                    title = title.replace('Dolor De ', '').replace(' y ', ' + ')
                    title = title.replace(' ', '_')
                    return title
            
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
            backup_filename = f"{article_info['zona']}_{article_info['contexto']}_original_v3_2_seo_fixed.html"
            backup_path = os.path.join(self.backup_dir, backup_filename)
            
            with open(source_path, 'r', encoding='utf-8') as src:
                with open(backup_path, 'w', encoding='utf-8') as dst:
                    dst.write(src.read())
            
            print(f"[Backup v3.2-SEO-FIXED] {backup_filename}")
            return backup_path
            
        except Exception as e:
            print(f"Error en backup de {article_info['path']}: {e}")
            return None
    
    def generate_new_content(self, zona, contexto):
        """Genera nuevo contenido usando el motor narrativo v3.2-patched"""
        try:
            organ_mapping = {
                'estomago': 'Estómago',
                'tiroides': 'Tiroides', 
                'piel': 'Piel',
                'espalda': 'Espalda',
                'corazon': 'Corazón',
                'cabeza': 'Cabeza',
                'cuerpo': 'Cuerpo',
                'pulmones': 'Pulmones',
                'higado': 'Hígado',
                'riñones': 'Riñones',
                'intestino': 'Intestino',
                'area-reproductiva': 'Área Reproductiva',
                'articulaciones': 'Articulaciones',
                'alergias': 'Alergias',
                'acne': 'Acné'
            }
            
            organ = organ_mapping.get(zona.lower(), zona.capitalize())
            emotion = contexto.replace('-', ' ').capitalize()
            
            content = self.narrative_engine.generate_article(organ, emotion)
            
            return content
            
        except Exception as e:
            print(f"Error generando contenido para {zona}+{contexto}: {e}")
            return None
    
    def create_html_template_seo_optimized(self, zona, contexto, content):
        """Crea la plantilla HTML completa con SEO Parásito CORREGIDO y E-E-A-T médico"""
        
        # Extraer metadatos del contenido generado
        title_match = re.search(r'title:\s*"([^"]+)"', content)
        title = title_match.group(1) if title_match else f"{zona.capitalize()} y {contexto.capitalize()}"
        
        # Construir URL SEO-friendly (Directiva #4)
        url_slug = f"{zona}/{contexto}-sintomas-fisicos"
        
        # Meta Description Bait-and-Switch (Directiva #5)
        meta_description = f"Descubre cómo {contexto.lower()} causa síntomas en {zona.lower()}. Explicación médica de la conexión entre {contexto.lower()} y {zona.lower()}. Guía completa de síntomas físicos y tratamiento."
        
        # Keywords LSI (Directiva #6)
        lsi_keywords = self.generate_lsi_keywords(zona, contexto)
        
        # Extraer la frase más devastadora para Open Graph (Directiva #19)
        devastating_phrase = self.extract_devastating_phrase(content)
        
        # Schema Médico (Directiva #1)
        schema_medical = self.generate_medical_schema(zona, contexto, title)
        
        html_template = f"""<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{meta_description}">
  <link rel="canonical" href="https://sintomario.org/{url_slug}">
  <meta property="og:title" content="{devastating_phrase}">
  <meta property="og:description" content="{meta_description}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="keywords" content="{lsi_keywords}">
  <link rel="stylesheet" href="/assets/css/theme-adaptive.css">
  <script src="/assets/js/theme-manager.js"></script>
  
  <!-- Schema Médico - Directiva #1 -->
  <script type="application/ld+json">
  {schema_medical}
  </script>
  
  <!-- E-E-A-T MÉDICO CRÍTICO -->
  <meta name="author" content="Dr. Médico Especialista - SINTOMARIO.ORG">
  <meta name="datePublished" content="2024-01-15">
  <meta name="dateModified" content="{datetime.now().strftime('%Y-%m-%d')}">
  
  <!-- CSS Anti-Bot para TOC Oculto - ADVERTENCIA 1 CORREGIDA -->
  <style>
    #toc {{
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }}
    
    /* Fragmentación Visual Poética - ADVERTENCIA 2 CORREGIDA */
    .saramago-breath {{
        display: block;
        margin-bottom: 1.2em;
    }}
    
    /* Disclaimer Paranoico */
    .medical-disclaimer-banner {{
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 1rem;
        margin: 2rem 0;
        border-radius: 4px;
    }}
    
    .medical-disclaimer-banner h3 {{
        margin-top: 0;
        color: #856404;
    }}
    
    .clinical-summary {{
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        padding: 1rem;
        margin: 2rem 0;
    }}
    
    .clinical-summary h2 {{
        margin-top: 0;
        color: #007bff;
    }}
    
    .clinical-summary ul {{
        margin-bottom: 0;
    }}
    
    .content-separator {{
        border: none;
        height: 1px;
        background: #dee2e6;
        margin: 2rem 0;
    }}
  </style>
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
        
        <!-- Table of Contents Oculto (Cloaking Ético) - ADVERTENCIA 1 CORREGIDA -->
        <nav id="toc">
          <h2>Contenido</h2>
          <ul>
            <li><a href="#sintomas-principales">Síntomas principales</a></li>
            <li><a href="#conexion-emocional">Conexión emocional</a></li>
            <li><a href="#enfoque-clinico">Enfoque clínico</a></li>
            <li><a href="#tratamiento">Tratamiento</a></li>
          </ul>
        </nav>
        
        <!-- Contenido generado narrativamente con Fragmentación Visual Poética - ADVERTENCIA 2 CORREGIDA -->
        <div class="narrative-content-fragmented">
          {self.convert_markdown_with_poetic_fragmentation(content)}
        </div>
        
        <!-- Resumen Clínico - Directiva #9 -->
        <div class="clinical-summary">
          <h2>Resumen clínico</h2>
          <ul>
            {self.generate_clinical_summary(zona, contexto)}
          </ul>
        </div>
        
        <p class="muted">Keywords principales: {lsi_keywords}</p>
      </article>

      <!-- Disclaimer Paranoico - Directiva #11 -->
      <div class="medical-disclaimer-banner">
        <h3>⚠️ Importante: Información médica</h3>
        <p>Este contenido tiene fines educativos y de autoconocimiento corporal. No sustituye el diagnóstico, tratamiento o consejo profesional.</p>
        <p><strong>Ante cualquier síntoma persistente:</strong></p>
        <ul>
          <li>Consulte siempre con un médico licenciado</li>
          <li>No posponga atención médica profesional</li>
          <li>Busque ayuda inmediata en emergencias médicas</li>
        </ul>
        <p><em>Última revisión: {datetime.now().strftime('%d de %B de %Y')}</em></p>
      </div>
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
          <span> información médica </span>
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

      try {{
        await fetch('/api/counter.php?action=visit');
      }} catch (error) {{
        console.log('Error tracking visit:', error);
      }}

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
    
    def generate_lsi_keywords(self, zona, contexto):
        """Genera Keywords LSI (Directiva #6)"""
        lsi_terms = {
            'estomago': ['motilidad gástrica', 'reflujo gastroesofágico', 'gastritis nerviosa', 'acidez estomacal', 'digestión lenta'],
            'tiroides': ['hipotiroidismo síntomas', 'tiroides acelerada', 'bocio', 'nódulos tiroideos', 'fatiga tiroidea'],
            'piel': ['dermatitis emocional', 'eccema estrés', 'psoriasis psicosomático', 'urticaria nerviosa', 'enrojecimiento facial'],
            'espalda': ['dolor lumbar crónico', 'tensión cervical', 'contracturas musculares', 'dorsalgia emocional', 'rigidez espalda'],
            'corazon': ['palpitaciones ansiedad', 'taquicardia emocional', 'dolor pecho ansiedad', 'arritmia estrés', 'presión alta emocional'],
            'cabeza': ['migraña emocional', 'cefalea tensional', 'dolor cabeza estrés', 'neuralgia occipital', 'presión craneal'],
            'pulmones': ['disnea ansiedad', 'broncoespasmo emocional', 'ahogo emocional', 'dolor pecho ansiedad', 'tos nerviosa']
        }
        
        base_terms = lsi_terms.get(zona.lower(), [f'síntomas {zona.lower()}'])
        
        keywords = base_terms + [
            f'{zona.lower()} {contexto.lower()}',
            f'{contexto.lower()} corporal',
            f'síntomas {contexto.lower()}',
            f'tratamiento {zona.lower()}',
            f'{zona.lower()} psicosomático',
            f'conexión {zona.lower()} {contexto.lower()}'
        ]
        
        return ', '.join(keywords[:10])
    
    def extract_devastating_phrase(self, content):
        """Extrae la frase más devastadora para Open Graph (Directiva #19)"""
        lines = content.split('\n')
        sentences = []
        
        for line in lines:
            # Buscar oraciones que terminan en punto
            for sentence in re.split(r'[.!?]+', line):
                sentence = sentence.strip()
                if len(sentence) > 50 and any(word in sentence.lower() for word in ['sufre', 'dolor', 'miedo', 'sangra', 'destruye', 'quema', 'huye', 'muere']):
                    sentences.append(sentence)
        
        return sentences[-1] if sentences else "Descubre la conexión entre cuerpo y emoción"
    
    def generate_medical_schema(self, zona, contexto, title):
        """Genera Schema médico (Directiva #1)"""
        return f"""{{
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "Article"],
    "headline": "{title}",
    "description": "Análisis detallado de la conexión entre {zona.lower()} y {contexto.lower()} con enfoque médico y perspectiva psicosomática.",
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
        "name": "{zona.capitalize()} por {contexto.capitalize()}",
        "alternateName": ["{zona.lower()} {contexto.lower()}", "conexión {zona.lower()}-{contexto.lower()}"],
        "typicalSymptoms": [
            "dolor en {zona.lower()}",
            "malestar {zona.lower()}",
            "sensación anormal en {zona.lower()}"
        ],
        "possibleTreatment": "Consulta médica especializada para diagnóstico diferencial"
    }},
    "about": {{
        "@type": "MedicalCondition",
        "name": "{zona.lower()} y {contexto.lower()}"
    }},
    "lastReviewed": "{datetime.now().strftime('%Y-%m-%d')}",
    "reviewedBy": {{
        "@type": "Physician",
        "name": "Dr. Médico Especialista"
    }}
}}"""
    
    def generate_clinical_summary(self, zona, contexto):
        """Genera resumen clínico (Directiva #9)"""
        clinical_points = {
            'estomago': [
                '<li>Dolor abdominal o malestar epigástrico</li>',
                '<li>Sensación de plenitud o hinchazón abdominal</li>',
                '<li>Acidez o reflujo gastroesofágico</li>',
                '<li>Alteraciones del tránsito intestinal</li>'
            ],
            'tiroides': [
                '<li>Fatiga persistente sin causa aparente</li>',
                '<li>Cambios en el peso corporal</li>',
                '<li>Alteraciones del ciclo menstrual</li>',
                '<li>Sensación de frío o intolerancia al calor</li>',
                '<li>Depresión o cambios de humor</li>'
            ],
            'piel': [
                '<li>Enrojecimiento o inflamación cutánea</li>',
                '<li>Prurito o sensación de ardor</li>',
                '<li>Erupciones o lesiones en la piel</li>',
                '<li>Reacciones al estrés o factores emocionales</li>',
                '<li>Sequedad o descamación</li>'
            ],
            'espalda': [
                '<li>Dolor lumbar o dorsal crónico</li>',
                '<li>Rigidez muscular o limitación de movimiento</li>',
                '<li>Contracturas musculares persistentes</li>',
                '<li>Sensación de peso o presión en la espalda</li>',
                '<li>Dolor que irradia a extremidades</li>'
            ]
        }
        
        points = clinical_points.get(zona.lower(), ['<li>Síntomas específicos del área afectada</li>'])
        
        return '\n'.join(points[:4])
    
    def convert_markdown_with_poetic_fragmentation(self, content):
        """Convierte Markdown a HTML con fragmentación visual poética CORREGIDA (ADVERTENCIA 2)"""
        # Eliminar metadatos YAML
        content = re.sub(r'^---.*?---\n', '', content, flags=re.DOTALL)
        
        paragraphs = content.split('\n\n')
        html_paragraphs = []
        word_count = 0
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if not paragraph:
                continue
            
            word_count += len(paragraph.split())
            
            # Fragmentación visual poética CORREGIDA: usar <span class="saramago-breath"> en lugar de <hr>
            if ',' in paragraph:
                # Dividir por comas y añadir spans de respiración
                parts = paragraph.split(',')
                if len(parts) > 3:
                    fragmented_parts = []
                    for i, part in enumerate(parts):
                        fragmented_parts.append(part.strip())
                        # Añadir span de respiración cada 3 comas
                        if (i + 1) % 3 == 0 and i < len(parts) - 1:
                            fragmented_parts.append('<span class="saramago-breath"></span>')
                    paragraph = ', '.join(fragmented_parts)
            
            # También fragmentar en puntos y comas
            if ';' in paragraph:
                parts = paragraph.split(';')
                if len(parts) > 2:
                    fragmented_parts = []
                    for i, part in enumerate(parts):
                        fragmented_parts.append(part.strip())
                        if i < len(parts) - 1:
                            fragmented_parts.append(';<span class="saramago-breath"></span>')
                    paragraph = '; '.join(fragmented_parts)
            
            html_paragraphs.append(f'<p>{paragraph}</p>')
            
            # Fragmentar cada 800 caracteres
            if word_count > 800:
                html_paragraphs.append('<hr class="content-separator">')
                word_count = 0
        
        return '\n'.join(html_paragraphs)
    
    def regenerate_article(self, article_info):
        """Regenera un artículo individual con SEO Parásito CORREGIDO"""
        zona = article_info['zona']
        contexto = article_info['contexto']
        original_path = article_info['path']
        
        print(f"\n[Regenerando v3.2-SEO-FIXED] {zona} + {contexto}")
        
        backup_path = self.backup_original(article_info)
        if not backup_path:
            return False
        
        new_content = self.generate_new_content(zona, contexto)
        if not new_content:
            return False
        
        new_html = self.create_html_template_seo_optimized(zona, contexto, new_content)
        
        new_filename = f"{zona}_{contexto}_regenerado_v3_2_seo_fixed.html"
        new_path = os.path.join(self.generated_dir, new_filename)
        
        try:
            with open(new_path, 'w', encoding='utf-8') as f:
                f.write(new_html)
            
            print(f"[Generado v3.2-SEO-FIXED] {new_filename} ({len(new_html)} chars)")
            return True
            
        except Exception as e:
            print(f"Error guardando artículo regenerado: {e}")
            return False
    
    def regenerate_batch_with_drip(self, daily_limit=3):
        """Regenera artículos con protocolo "Goteo de Sangre" (ADVERTENCIA 3 CORREGIDA)"""
        articles = self.discover_articles()
        total_articles = len(articles)
        
        print(f"\n{'='*60}")
        print(f"INICIO DE REGENERACIÓN BATCH v3.2-SEO-FIXED - PROTOCOLO GOTEO DE SANGRE")
        print(f"Total artículos: {total_articles}")
        print(f"Límite diario: {daily_limit} artículos")
        print(f"Directorio backup: {self.backup_dir}")
        print(f"Directorio generado: {self.generated_dir}")
        print(f"Motor narrativo: v3.2-patched con SEO optimizado CORREGIDO")
        print(f"{'='*60}\n")
        
        # Simular protocolo de goteo
        articles_today = articles[:daily_limit]
        articles_pending = articles[daily_limit:]
        
        successful = 0
        failed = 0
        
        print(f"🩸 Goteo de Sangre - Día 1: {len(articles_today)} artículos")
        
        for i, article in enumerate(articles_today, 1):
            print(f"\n[{i}/{len(articles_today)}] Procesando: {article['zona']}/{article['contexto']}")
            
            if self.regenerate_article(article):
                successful += 1
            else:
                failed += 1
        
        print(f"\n{'='*60}")
        print(f"DÍA 1 COMPLETADO - PROTOCOLO GOTEO DE SANGRE")
        print(f"Exitosos: {successful}")
        print(f"Fallidos: {failed}")
        print(f"Pendientes para días siguientes: {len(articles_pending)}")
        print(f"Recomendación: Ejecutar mañana con --daily-limit=5")
        print(f"{'='*60}")
        
        return successful, failed, len(articles_pending)
    
    def regenerate_batch(self, limit=None, daily_limit=None):
        """Regenera todos los artículos en batch con opciones flexibles"""
        articles = self.discover_articles()
        total_articles = len(articles)
        
        if daily_limit:
            return self.regenerate_batch_with_drip(daily_limit)
        
        if limit:
            articles = articles[:limit]
            print(f"Regenerando primeros {limit} artículos de {total_articles}")
        else:
            print(f"Regenerando todos los {total_articles} artículos con SEO Parásito CORREGIDO")
        
        print(f"\n{'='*60}")
        print(f"INICIO DE REGENERACIÓN BATCH v3.2-SEO-FIXED - SARAMAGO + OSHO + JUNG + SEO PARÁSITO CORREGIDO")
        print(f"Directorio backup: {self.backup_dir}")
        print(f"Directorio generado: {self.generated_dir}")
        print(f"Motor narrativo: v3.2-patched con SEO optimizado CORREGIDO")
        print(f"Correcciones aplicadas:")
        print(f"  - ADVERTENCIA 1: TOC con position: absolute (anti-penalización)")
        print(f"  - ADVERTENCIA 2: Fragmentación con <span class='saramago-breath'> (poética)")
        print(f"  - ADVERTENCIA 3: Protocolo Goteo de Sangre (anti-SpamBrain)")
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
        print(f"REGENERACIÓN COMPLETADA v3.2-SEO-FIXED")
        print(f"Exitosos: {successful}")
        print(f"Fallidos: {failed}")
        print(f"Total: {successful + failed}")
        print(f"Backup en: {self.backup_dir}")
        print(f"Generados en: {self.generated_dir}")
        print(f"Estilo: Saramago + Osho + Jung + SEO Parásito CORREGIDO")
        print(f"{'='*60}")
        
        return successful, failed
    
    def generate_report(self):
        """Genera un reporte de la regeneración v3.2-SEO-FIXED"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'backup_directory': self.backup_dir,
            'generated_directory': self.generated_dir,
            'narrative_engine_version': '3.2-patched',
            'model_used': 'gpt-4o',
            'strategy': 'clinical-contemplative-saramago-osho-jung-seo-parasito-fixed',
            'seo_features': [
                'medical_schema',
                'lsi_keywords',
                'meta_description_bait_switch',
                'open_graph_devastating_phrase',
                'table_of_contents_hidden_ethical',
                'clinical_summary',
                'poetic_fragmentation_visual',
                'medical_disclaimer_banner',
                'seo_friendly_urls',
                'entity_salience_markup'
            ],
            'eeat_compliance': 'medical_disclaimer_author_expertise',
            'google_optimization': 'parasite_seo_techniques_fixed',
            'reachability_enhancement': 'structured_data_markup',
            'critical_fixes_applied': [
                'toc_position_absolute_anti_penalty',
                'poetic_fragmentation_span_instead_of_hr',
                'drip_blood_protocol_anti_spambrain'
            ]
        }
        
        report_path = os.path.join(self.generated_dir, 'regeneration_report_v3_2_seo_fixed.json')
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"[Reporte v3.2-SEO-FIXED] Generado en: {report_path}")

def main():
    engine = BatchRegenerationEngineV3_2_SEO_FIXED()
    
    print("=== MOTOR DE REGENERACIÓN BATCH v3.2-SEO-FIXED - SINTOMARIO.ORG ===")
    print("ESTILO: Saramago + Osho + Jung + SEO Parásito CORREGIDO")
    print("CARACTERÍSTICAS: Schema Médico + LSI Keywords + Meta Description Bait-and-Switch")
    print("CORRECCIONES CRÍTICAS:")
    print("  - ADVERTENCIA 1: TOC con position: absolute (anti-penalización)")
    print("  - ADVERTENCIA 2: Fragmentación poética con <span> (no <hr>)")
    print("  - ADVERTENCIA 3: Protocolo Goteo de Sangre (anti-SpamBrain)")
    print("\nOPCIONES:")
    print("1. Goteo de Sangre - Día 1 (3 artículos)")
    print("2. Goteo de Sangre - Día 2 (5 artículos)")
    print("3. Goteo de Sangre - Día 3+ (10 artículos)")
    print("4. Regenerar 5 artículos (prueba SEO)")
    print("5. Regenerar 20 artículos (prueba extendida)")
    print("6. FORZADO: Regenerar todos los artículos (¡PELIGRO DE SPAMBRAIN!)")
    
    try:
        option = input("\nSelecciona una opción (1-6): ").strip()
        
        if option == "1":
            engine.regenerate_batch_with_drip(daily_limit=3)
        elif option == "2":
            engine.regenerate_batch_with_drip(daily_limit=5)
        elif option == "3":
            engine.regenerate_batch_with_drip(daily_limit=10)
        elif option == "4":
            engine.regenerate_batch(limit=5)
        elif option == "5":
            engine.regenerate_batch(limit=20)
        elif option == "6":
            confirm = input("⚠️ ¡PELIGRO! ¿Confirmar regeneración de TODOS los artículos? Esto puede activar SpamBrain. (s/N): ").strip().lower()
            if confirm == 's':
                engine.regenerate_batch()
            else:
                print("Operación cancelada - Decisión sabia")
        else:
            print("Opción no válida")
            
    except KeyboardInterrupt:
        print("\nOperación cancelada por el usuario")
    except Exception as e:
        print(f"Error: {e}")
    
    engine.generate_report()

if __name__ == "__main__":
    main()
