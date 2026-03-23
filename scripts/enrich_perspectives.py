#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Sistema de Enriquecimiento de Perspectivas
Genera contenido enriquecido para las perspectivas de autores.
"""

import json
from pathlib import Path
from typing import Dict, Any

class PerspectiveEnricher:
    """Enriquecedor de perspectivas de autores."""
    
    def __init__(self, corpus_dir: str = "corpus"):
        self.corpus_dir = Path(corpus_dir)
        
    def enrich_all_perspectives(self) -> Dict[str, Any]:
        """Generar perspectivas enriquecidas completas."""
        
        enriched = {
            "sintomario": {
                "nombre": "Visión SINTOMARIO",
                "autor": "Editorial SINTOMARIO",
                "descripcion_corta": "Visión integrativa holística",
                "filosofia": """
                Desde la visión SINTOMARIO, cada síntoma es una forma de comunicación inteligente del cuerpo. 
                No existe el 'error' orgánico, solo mensajes que no hemos aprendido a escuchar. El cuerpo 
                no traiciona: informa. Cada molestia física es una invitación a prestar atención a 
                dimensiones de nuestra vida que hemos ignorado, negado o suprimido.
                """,
                "principios": [
                    "El cuerpo y la mente son inseparables",
                    "Los síntomas tienen significado y propósito",
                    "La sanación requiere escucha, no solo tratamiento",
                    "Cada persona tiene su propia verdad corporal"
                ],
                "metodo": """
                El método SINTOMARIO propone 6 capas de exploración:
                1. Reconocimiento del síntoma sin juicio
                2. Contextualización en el sistema orgánico
                3. Exploración de perspectivas terapéuticas
                4. Identificación de la emoción subyacente
                5. Práctica de integración consciente
                6. Recursos para el proceso de sanación
                """,
                "template_nodo": """
                Desde la visión integrativa de SINTOMARIO, {termino} representa una comunicación 
                específica del sistema {sistema}. Este síntoma emerge típicamente cuando hay 
                {contexto_emocional} no procesado, señalando que {herida_emocional} requiere 
                atención consciente.
                
                El cuerpo, en su sabiduría, manifesta {termino} como una forma de hacer visible 
                lo invisible: patrones emocionales y mentales que operan en la sombra de nuestra 
                conciencia. No es un fallo del sistema, sino una estrategia de supervivencia 
                emocional que ha dejado de ser necesaria pero permanece activa.
                
                La invitación es escuchar sin miedo, comprender sin juzgar, y actuar desde la 
                compasión hacia uno mismo.
                """
            },
            
            "louise_hay": {
                "nombre": "Louise Hay",
                "autor": "Louise L. Hay",
                "obra_principal": "Puedes Sanar Tu Vida (1984)",
                "descripcion_corta": "Causas mentales de las enfermedades físicas",
                "filosofia": """
                Louise Hay propone que los pensamientos crean nuestra realidad, incluyendo 
                nuestra salud física. Las enfermedades y síntomas no son eventos aleatorios 
                sino la manifestación física de patrones mentales y emocionales disfuncionales. 
                Cambiar los pensamientos — especialmente mediante afirmaciones positivas — 
                puede sanar el cuerpo.
                """,
                "principios": [
                    "Los pensamientos crean la realidad física",
                    "Cada enfermedad tiene una causa mental específica",
                    "Las afirmaciones pueden reprogramar patrones negativos",
                    "El amor propio es la base de toda sanación",
                    "El perdón libera energía bloqueada"
                ],
                "metodo": """
                El método de Louise Hay consiste en:
                1. Identificar el síntoma o condición física
                2. Buscar su correspondencia mental en su 'lista'
                3. Reconocer el patrón de pensamiento subyacente
                4. Practicar la afirmación opuesta correspondiente
                5. Trabajar el perdón hacia uno mismo y otros
                6. Cultivar el amor propio como medicina primaria
                """,
                "biografia_corta": """
                Louise Hay (1926-2017) fue una escritora y conferencista estadounidense pionera 
                en el campo de la sanación mental-emocional-física. Su propia experiencia de 
                sanación de cáncer mediante cambios profundos en sus patrones mentales la llevó 
                a desarrollar una metodología que ha ayudado a millones.
                """,
                "template_nodo": """
                Según Louise Hay, {termino} en el sistema {sistema} está directamente conectado 
                con el patrón mental de {patron_mental}. Esta creación física emerge cuando 
                mantenemos pensamientos repetitivos de {tipo_pensamiento}.
                
                La causa mental probable es: '{causal_louise}'
                
                El nuevo modelo de pensamiento sugerido es: '{afirmacion_louise}'
                
                Practica esta afirmación diariamente, especialmente al despertar y antes de 
                dormir. Visualiza tu {sistema} funcionando perfectamente, lleno de luz y salud. 
                Recuerda: el cuerpo obedece a la mente. Cambia tus pensamientos y tu cuerpo 
                seguirá.
                """
            },
            
            "hamer": {
                "nombre": "Dr. Ryke Geerd Hamer",
                "autor": "Dr. Ryke Geerd Hamer",
                "obra_principal": "Verma's Vermachtnis (1991)",
                "descripcion_corta": "Nueva Medicina Germánica",
                "filosofia": """
                La Nueva Medicina Germánica (NGM) del Dr. Hamer propone que las enfermedades 
                físicas son el resultado de conflictos biológicos específicos — shocks 
                emocionales que el organismo no pudo procesar. Cada síntoma tiene una causa 
                biológica precisa, un sentido biológico, y sigue leyes biológicas universales.
                La sanación ocurre cuando el conflicto subyacente se resuelve.
                """,
                "principios": [
                    "Las enfermedades tienen sentido biológico, no son errores",
                    "Cada conflicto biológico produce síntomas específicos",
                    "El shock emocional es el origen de todo proceso patológico",
                    "Existen fases de conflicto activo y fases de sanación",
                    "El cerebro controla todos los procesos mediante los llamados 'anillos de Hamer'"
                ],
                "metodo": """
                El método de la NGM:
                1. Identificar el conflicto biológico específico (DHS - Dirhamerische Scher)
                2. Localizar el foco cerebral en el llamado 'anillo de Hamer'
                3. Comprender el sentido biológico del síntoma
                4. Resolver el conflicto subyacente
                5. Acompañar la fase de sanación (puede intensificarse temporalmente)
                """,
                "biografia_corta": """
                El Dr. Ryke Geerd Hamer (1935-2017) fue un médico alemán que desarrolló la 
                Nueva Medicina Germánica tras la muerte de su hijo y su propio diagnóstico 
                de cáncer. Su trabajo ha sido controvertido pero ha influido profundamente 
                en la comprensión psicosomática de la salud.
                """,
                "leyes_biologicas": [
                    "Primera Ley: La Iron Rule of Cancer - todo proceso patológico tiene origen en DHS",
                    "Segunda Ley: Las dos fases - activa y de sanación",
                    "Tercera Ley: El ontogenéticamente sistema de sustancia",
                    "Cuarta Ley: El microorganismo no causa, coopera"
                ],
                "template_nodo": """
                Desde la Nueva Medicina Germánica, {termino} en {sistema} corresponde al 
                conflicto biológico de {conflicto_hamer}.
                
                El DHS (Dirhamerische Scher) típico implica: {descripcion_dhs}
                
                Fase de conflicto activo:
                - El organismo se adapta al conflicto
                - El síntoma puede no ser perceptible o ser funcional
                - El foco cerebral muestra el anillo de Hamer correspondiente
                
                Fase de sanación (tras resolver el conflicto):
                - El síntoma se manifiesta plenamente
                - El edema en el foco cerebral se reabsorbe
                - Es necesario acompañar el proceso sin miedo
                
                Resolución: {resolucion_hamer}
                """
            },
            
            "mate": {
                "nombre": "Dr. Gabor Maté",
                "autor": "Dr. Gabor Maté",
                "obra_principal": "Cuando el Cuerpo Dice No (2003)",
                "descripcion_corta": "Trauma, estrés y enfermedad",
                "filosofia": """
                Gabor Maté propone que el trauma y el estrés crónico son factores determinantes 
                en la mayoría de las enfermedades físicas. La supresión de emociones 
                'negativas' — especialmente la ira y el instinto de defensa — y la compulsión 
                a complacer a otros debilitan el sistema inmune y causan enfermedades. La 
                autenticidad emocional es clave para la salud.
                """,
                "principios": [
                    "El trauma no es el evento, sino la respuesta interna",
                    "El estrés crónico suprime la inmunidad y sanación",
                    "La ira reprimida es tóxica para el organismo",
                    "Los 'buenos' que se niegan a sí mismos enferman",
                    "La autenticidad emocional previene y sana"
                ],
                "metodo": """
                El enfoque de Gabor Maté:
                1. Identificar patrones de supresión emocional crónicos
                2. Reconocer el trauma temprano y sus adaptaciones
                3. Permitir la expresión de emociones 'inaceptables'
                4. Desarrollar límites saludables (decir 'no')
                5. Cultivar autenticidad sobre complacencia
                6. Trabajar con el cuerpo somáticamente
                """,
                "biografia_corta": """
                El Dr. Gabor Maté es un médico canadiense de origen húngaro, especializado 
                en medicina de adicciones y salud mental. Su trabajo pionero en el Downtown 
                Eastside de Vancouver y sus investigaciones sobre ADHD, trauma y enfermedad 
                lo han convertido en una voz influyente sobre la conexión mente-cuerpo.
                """,
                "conceptos_clave": [
                    "Trauma: no lo que te sucede, sino lo que ocurre dentro",
                    "Estrés crónico: la respuesta de lucha-huida constantemente activada",
                    "Compulsión a complacer: negación de necesidades propias",
                    "Autenticidad vs. Aceptación: el dilema del niño traumatizado",
                    "Somatica: el cuerpo guarda el score"
                ],
                "template_nodo": """
                Según Gabor Maté, {termino} en {sistema} puede estar profundamente conectado 
                con patrones de supresión emocional crónica.
                
                Preguntas de exploración:
                - ¿Cuándo comenzó este síntoma? ¿Qué estaba ocurriendo en tu vida?
                - ¿Qué emociones has tenido que suprimir repetidamente?
                - ¿Hay ira que no te has sentido con derecho a expresar?
                - ¿Te sientes obligado a complacer a otros a costa de ti mismo?
                - ¿Puedes identificar eventos traumáticos tempranos en tu historia?
                
                El cuerpo no miente. {termino} puede ser la manifestación física de 
                {emocion_somaticizada} que has cargado durante años. La buena noticia es que 
                al volver a conectar con tu autenticidad emocional, el cuerpo puede sanar.
                
                No es culpa tuya: son adaptaciones de supervivencia que ya no necesitas.
                """
            }
        }
        
        return enriched
    
    def save_enriched_perspectives(self, output_path: str = "corpus/perspectivas_enriquecidas.json"):
        """Guardar perspectivas enriquecidas en archivo JSON."""
        enriched = self.enrich_all_perspectives()
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(enriched, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Perspectivas enriquecidas guardadas en: {output_path}")
        return output_path
    
    def generate_author_pages(self, output_dir: str = "public/autores"):
        """Generar páginas dedicadas para cada autor."""
        enriched = self.enrich_all_perspectives()
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        for key, data in enriched.items():
            slug = key.replace("_", "-")
            html = self._template_autor(data)
            
            file_path = output_path / f"{slug}.html"
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"✓ Página de autor generada: {file_path}")
    
    def _template_autor(self, data: Dict) -> str:
        """Template HTML para página de autor."""
        nombre = data.get("nombre", "")
        obra = data.get("obra_principal", "")
        filosofia = data.get("filosofia", "")
        principios = data.get("principios", [])
        metodo = data.get("metodo", "")
        biografia = data.get("biografia_corta", "")
        
        principios_html = "\n".join([f"<li>{p}</li>" for p in principios])
        
        return f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{nombre} | SINTOMARIO</title>
    <meta name="description" content="Conoce la visión de {nombre} sobre la conexión mente-cuerpo. {obra}">
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
                <a href="/contexto/">Contextos</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="page-header">
            <span class="meta-label">Perspectiva</span>
            <h1>{nombre}</h1>
            {f'<p class="obra">{obra}</p>' if obra else ''}
        </div>

        <section class="filosofia">
            <h2>Filosofía</h2>
            <p>{filosofia}</p>
        </section>

        <section class="principios">
            <h2>Principios Fundamentales</h2>
            <ul>
                {principios_html}
            </ul>
        </section>

        <section class="metodo">
            <h2>Metodología</h2>
            <p>{metodo}</p>
        </section>

        {f'<section class="biografia"><h2>Sobre el Autor</h2><p>{biografia}</p></section>' if biografia else ''}

        <section class="cta">
            <h2>Explorar lecturas con esta perspectiva</h2>
            <a href="/" class="btn-primary">Ver corpus completo</a>
        </section>
    </main>

    <footer class="footer">
        <p><strong>SINTOMARIO.ORG</strong> — El diccionario del síntoma</p>
    </footer>
</body>
</html>'''

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Enriquecimiento de Perspectivas")
    parser.add_argument("--save-json", action="store_true", help="Guardar perspectivas en JSON")
    parser.add_argument("--generate-pages", action="store_true", help="Generar páginas de autores")
    parser.add_argument("--all", action="store_true", help="Ejecutar todas las acciones")
    
    args = parser.parse_args()
    
    enricher = PerspectiveEnricher()
    
    if args.all or args.save_json:
        enricher.save_enriched_perspectives()
    
    if args.all or args.generate_pages:
        enricher.generate_author_pages()
    
    if not any([args.save_json, args.generate_pages, args.all]):
        # Modo por defecto
        print("Generando perspectivas enriquecidas...")
        enricher.save_enriched_perspectives()
        enricher.generate_author_pages()
        print("✅ Enriquecimiento completado")

if __name__ == "__main__":
    main()
