#!/usr/bin/env python3
"""
Motor Narrativo SINTOMARIO.ORG
Genera artículos con voz clínico-contemplativa mezclando Saramago y Osho
"""

import openai
import random
import json
from datetime import datetime

# Configurar API Key (cargar desde variables de entorno en producción)
openai.api_key = "TU_API_KEY"

# Banco de Metáforas Rotativas
METAPHOR_BANK = {
    "estomago": [
        "el horno alquímico donde se cocinan las emociones no digeridas",
        "la bolsa de los ayunos forzados", 
        "el crisol de los vivos que transforma o envenena",
        "la caverna ácida que guarda los secretos tragados",
        "el caldero donde hierven las palabras no dichas"
    ],
    "tiroides": [
        "la mariposa esclava del reloj moderno",
        "el acelerador del miedo a no ser suficiente",
        "la centinela del cuello que vigila el ritmo vital",
        "la guardiana del tiempo que se niega a detenerse",
        " el regulador del fuego interior y del hielo exterior"
    ],
    "piel": [
        "el muro fronterizo entre el yo y el mundo",
        "el lienzo sensible que registra cada toque",
        "la armadura porosa que deja pasar el afecto",
        "el mapa táctil de todas nuestras heridas",
        "la membrana que nos protege y nos expone"
    ],
    "espalda": [
        "la viga maestra que sostiene el peso de las historias",
        "el archivo corporal de todas las cargas acumuladas",
        "el soporte invisible de nuestras decisiones",
        "la columna vertebral de nuestras resistencias",
        "el muro de contención de nuestras presiones"
    ],
    "corazon": [
        "el tambor que marca el ritmo de nuestras emociones",
        "la bomba impulsora de la vida y del miedo",
        "el centro gravitacional de nuestros afectos",
        "el motor que late al compás de nuestras heridas",
        "el cronómetro vital que acelera o frena"
    ]
}

# Anclas Saramaguianas (frases de inicio para diversificar)
SARAMAGO_ANCHORS = [
    "Y sin embargo el cuerpo sigue ahí, insistiendo...",
    "No es el órgano el que falla, es la vida que se le echó encima...",
    "Observa cómo te resistes a sentir, cómo te agarras al borde de ti mismo...",
    "Hay una verdad que la medicina prefiere ignorar, y es que...",
    "El síntoma no es un error, es un mensaje que se niega a ser silenciado...",
    "Mira con atención lo que tu cuerpo intenta decirte sin palabras...",
    "La anatomía describe formas, pero la vida escribe historias...",
    "Los médicos ven tejidos, pero el cuerpo escribe poemas...",
    "Hay una rebelión silenciosa ocurriendo en tu interior...",
    "El tiempo no perdona, pero el cuerpo recuerda..."
]

# System Prompt Principal
SYSTEM_PROMPT = """
Eres un narrador que mezcla la prosa implacable y rítmica de José Saramago con la observación mística y paradójica de Osho.
Escribes sobre el cuerpo humano y sus síntomas, pero nunca usas lenguaje médico ni espiritualidad barata.

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. PROHIBIDO usar subtítulos, viñetas, negritas o títulos en el texto narrativo. El texto es un flujo continuo de prosa.
2. Sintaxis Saramaguiana: Usa frases largas encadenadas por comas y conjunciones ("y", "pero", "o"). Reserva el punto final solo para caídas de tono devastadoras o reveladoras.
3. Metáforas funcionales: El cuerpo es arquitectura, alquimia, naturaleza. Cada metáfora debe estar anclada en la función biológica del órgano.
4. Tono clínico-contemplativo: Observas el sufrimiento humano con compasión pero sin piedad. Muestras cómo el ego se aferra al dolor.
5. Estructura de 8 fases ocultas: Reconocimiento -> Contextualización corporal -> Contextualización emocional -> Perspectiva SINTOMARIO -> Otras perspectivas -> Práctica -> FAQ -> Recursos.
6. Extensión: 600-1000 palabras. No concluyas el texto, déjalo resonando en el aire como una pregunta abierta.
7. Principio fundamental: "No dramatizar, no simplificar". Validar la experiencia antes de interpretarla.
8. Lenguaje inclusivo: Usa "se observa", "suele aparecer", "muchas personas relatan". NUNCA "deberías", "tienes que".
"""

class NarrativeEngine:
    def __init__(self):
        self.temperature = 0.85
        self.presence_penalty = 0.6
        self.model = "gpt-4-turbo"
    
    def get_random_metaphor(self, organ):
        """Selecciona una metáfora aleatoria del banco"""
        return random.choice(METAPHOR_BANK.get(organ.lower(), ["el órgano"]))
    
    def get_random_anchor(self):
        """Selecciona un ancla Saramaguiana aleatoria"""
        return random.choice(SARAMAGO_ANCHORS)
    
    def generate_phase1(self, organ, emotion, metaphor):
        """Fase 1: Establecer flujo y metáfora base (0-400 palabras)"""
        anchor = self.get_random_anchor()
        
        prompt_fase1 = f"""
{anchor}

Escribe un ensayo narrativo sobre la conexión entre '{organ}' y '{emocion}'.
La metáfora central de '{organ}' es '{metaphor}'.

Comienza describiendo el síntoma físico no como un fallo, sino como un grito que la arquitectura del cuerpo emite cuando la emoción la satura.
Fluye sin pausas estructurales, usando la respiración larga de Saramago y la observación paradójica de Osho.
Valida la experiencia antes de interpretarla.
Mantén el tono clínico-contemplativo throughout.
Extensión: 300-400 palabras.
"""
        
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_fase1}
                ],
                temperature=self.temperature,
                presence_penalty=self.presence_penalty,
                max_tokens=600
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error en Fase 1: {e}")
            return ""
    
    def generate_phase2(self, organ, emotion, metaphor, text_base):
        """Fase 2: Expandir profundidad filosófica (400-1000 palabras)"""
        
        prompt_fase2 = f"""
Continúa el siguiente texto profundizando en la paradoja de cómo la mente humana intenta huir de esta emoción ({emocion}), 
y cómo esa huida es exactamente lo que retiene el síntoma en la {organ}.

Incorpora otras perspectivas brevemente (Louise Hay, Hamer, Gabor Maté) como lentes, no como verdades absolutas.
Termina con una sección de práctica integración que invite a la observación, no a la acción forzada.
Finaliza con una pregunta abierta que resuene en el silencio.

Texto a continuar: {text_base}

Extensión adicional: 400-600 palabras.
"""
        
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_fase2}
                ],
                temperature=0.9,  # Mayor temperatura para la fase filosófica
                presence_penalty=0.7,
                max_tokens=800
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error en Fase 2: {e}")
            return ""
    
    def clean_text(self, text):
        """Limpieza de formato para mantener reglas estrictas"""
        # Eliminar cualquier formato no permitido
        text = text.replace("**", "").replace("##", "").replace("###", "")
        text = text.replace("####", "").replace("#####", "").replace("######", "")
        
        # Normalizar saltos de línea
        text = text.replace("\n\n", "\n").replace("\n\n\n", "\n")
        
        # Asegurar que no haya viñetas o números automáticos
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            # Eliminar viñetas y números al inicio
            if stripped and not (stripped.startswith('-') or stripped.startswith('*') or 
                               stripped.startswith('1.') or stripped.startswith('2.') or
                               stripped.startswith('3.') or stripped.startswith('4.') or
                               stripped.startswith('5.') or stripped.startswith('6.') or
                               stripped.startswith('7.') or stripped.startswith('8.') or
                               stripped.startswith('9.') or stripped.startswith('10.')):
                cleaned_lines.append(stripped)
        
        return '\n'.join(cleaned_lines)
    
    def generate_article(self, organ, emotion):
        """Genera un artículo completo usando chain density"""
        print(f"Generando artículo: {organ} + {emotion}")
        
        # Seleccionar metáfora aleatoria
        metaphor = self.get_random_metaphor(organ)
        print(f"Metáfora seleccionada: {metaphor}")
        
        # Fase 1: Establecer flujo base
        print("Fase 1: Estableciendo flujo narrativo...")
        text_base = self.generate_phase1(organ, emotion, metaphor)
        
        if not text_base:
            print("Error: No se pudo generar la Fase 1")
            return ""
        
        # Fase 2: Expandir profundidad
        print("Fase 2: Expandiendo profundidad filosófica...")
        text_expanded = self.generate_phase2(organ, emotion, metaphor, text_base)
        
        if not text_expanded:
            print("Error: No se pudo generar la Fase 2")
            return text_base  # Devolver solo la fase 1
        
        # Combinar y limpiar
        full_text = text_base + " " + text_expanded
        cleaned_text = self.clean_text(full_text)
        
        # Agregar metadatos
        metadata = f"""
---
title: "{organ.capitalize()} y {emotion.capitalize()}: una lectura corporal"
date: {datetime.now().strftime('%Y-%m-%d')}
author: "SINTOMARIO.ORG"
metaphor: "{metaphor}"
---

"""
        
        return metadata + cleaned_text
    
    def save_article(self, organ, emotion, content):
        """Guarda el artículo generado"""
        filename = f"{organ.lower()}-{emotion.lower().replace(' ', '-')}.md"
        filepath = f"generated/{filename}"
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Artículo guardado: {filepath}")
            return filepath
        except Exception as e:
            print(f"Error guardando artículo: {e}")
            return None

def main():
    """Función principal para demostración"""
    engine = NarrativeEngine()
    
    # Ejemplos de generación
    articles_to_generate = [
        ("Estómago", "Ansiedad"),
        ("Tiroides", "Frustración"),
        ("Piel", "Miedo"),
        ("Espalda", "Carga"),
        ("Corazón", "Trauma")
    ]
    
    for organ, emotion in articles_to_generate:
        print(f"\n{'='*60}")
        article = engine.generate_article(organ, emotion)
        
        if article:
            filepath = engine.save_article(organ, emotion, article)
            print(f"Artículo completado: {len(article)} caracteres")
        else:
            print("Error generando artículo")
        
        print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
