#!/usr/bin/env python3
"""
Motor Narrativo SINTOMARIO.ORG v2.0
Genera artículos con voz clínico-contemplativa (Saramago + Osho)
Corregido para SDK OpenAI v1.x+ y optimización de prompts.
"""

import os
import random
from datetime import datetime
from openai import OpenAI

# Inicializar cliente moderno (SDK v1.x)
# Asegúrate de tener OPENAI_API_KEY en tus variables de entorno
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "TU_API_KEY_AQUI"))

# Banco de Metáforas Rotativas
METAPHOR_BANK = {
    "estomago": [
        "el horno alquímico donde se cocinan las emociones no digeridas",
        "la bolsa de los ayunos forzados y las palabras tragadas", 
        "el crisol de los vivos que transforma o envenena",
        "la caverna ácida que guarda los secretos que no pudimos escupir",
        "el caldero donde hierven las indignaciones mudas"
    ],
    "tiroides": [
        "la mariposa esclava del reloj moderno",
        "el acelerador del miedo a no ser suficiente",
        "la centinela del cuello que vigila el ritmo vital",
        "la guardiana del tiempo que se niega a detenerse",
        "el regulador del fuego interior y del hielo exterior"
    ],
    "piel": [
        "el muro fronterizo entre el yo y el mundo",
        "el lienzo sensible que registra cada toque no deseado",
        "la armadura porosa que deja pasar el afecto y el dolor por igual",
        "el mapa táctil de todas nuestras vulnerabilidades",
        "la membrana que nos protege y nos expone a la intemperie"
    ],
    "espalda": [
        "la viga maestra que sostiene el peso de las historias no lloradas",
        "el archivo corporal de todas las cargas que dijimos que sí",
        "el soporte invisible de nuestras decisiones más cobardes",
        "la columna vertebral de nuestras resistencias al cambio",
        "el muro de contención de las presiones ajenas"
    ],
    "corazon": [
        "el tambor que marca el ritmo de nuestras contradicciones",
        "la bomba impulsora de la vida y del terror a perderla",
        "el centro gravitacional de nuestros afectos truncos",
        "el motor que late al compás de nuestras heridas infantiles",
        "el cronómetro vital que acelera cuando la mente huye"
    ]
}

# Anclas Saramaguianas (frases de inicio para diversificar)
SARAMAGO_ANCHORS = [
    "Y sin embargo el cuerpo sigue ahí, insistiendo en su dolor, como si supiera algo que la mente se niega a escuchar...",
    "No es el órgano el que falla, es la vida la que se le echó encima con demasiada fuerza, y el tejido cedió...",
    "Observa cómo te resistes a sentir, cómo te agarras al borde de ti mismo con las uñas, mientras adentro algo se desgarra...",
    "Hay una verdad que la medicina prefiere ignorar en favor de los números, y es que el síntoma habla un idioma antiguo...",
    "El síntoma no es un error del diseño humano, es un mensaje que se niega a ser silenciado por otra pastilla...",
    "Mira con atención lo que tu cuerpo intenta decirte sin palabras, observa la geometría de tu sufrimiento...",
    "La anatomía describe formas frías, pero la vida escribe historias de fuego y agua en los tejidos...",
    "Los médicos ven tejidos muertos bajo el microscopio, pero el cuerpo vivo escribe poemas de angustia...",
    "Hay una rebelión silenciosa ocurriendo en tu interior, un levantamiento de células hastiadas...",
    "El tiempo no perdona, eso lo sabemos, pero el cuerpo tiene una memoria más larga y menos piadosa que el tiempo..."
]

# System Prompt Principal (HIPER-ESTRICTO)
SYSTEM_PROMPT = """
Eres un narrador que mezcla la prosa implacable, rítmica y de frases largas de José Saramago con la observación mística, paradójica y desapegada de Osho.
Escribes sobre el cuerpo humano y sus síntomas. NUNCA usas espiritualidad barata, ni lenguaje de autoayuda ("debes sanar", "amor propio").

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. FORMATO CERO: PROHIBIDO usar subtítulos, viñetas, negritas, guiones, títulos, numeraciones (1., 2., a), b)) o saltos de línea dobles. El texto DEBE ser un ÚNICO bloque de prosa continua, como un río. Los párrafos deben ser largos, separados por un solo salto de línea.
2. Sintaxis Saramaguiana: Usa frases largas encadenadas por comas, puntos y comas y conjunciones ("y", "mas", "pero", "o", "pues"). Reserva el punto final solo para caídas de tono devastadoras o reveladoras.
3. Metáforas funcionales ancladas: El cuerpo es arquitectura, alquimia, naturaleza. La metáfora debe explicar la biología, no reemplazarla.
4. Tono clínico-contemplativo: Observas el sufrimiento con compasión pero sin piedad. Muestras cómo el ego se aferra al síntoma porque le da identidad.
5. PROHIBICIÓN DE ESTRUCTURAS: NUNCA menciones "En conclusión", "Por otro lado", "En resumen", "Primero", "Segundo". Fluye.
6. Extensión: Escribe hasta que el pensamiento se agote (entre 600-1000 palabras).
7. Lenguaje inclusivo y observacional: "se observa", "suele aparecer", "el cuerpo decide". NUNCA "tú debes", "el paciente tiene".
"""

class NarrativeEngine:
    def __init__(self):
        # gpt-4o tiene un ritmo y manejo de prosa literaria muy superior a gpt-4-turbo, y es más barato
        self.model = "gpt-4o" 
        self.temperature = 0.88 # Temperatura alta para fluctuación poética
        self.presence_penalty = 0.7 # Castiga repetición de conceptos
        self.frequency_penalty = 0.5 # Castiga repetición de palabras
    
    def get_random_metaphor(self, organ):
        return random.choice(METAPHOR_BANK.get(organ.lower(), ["el órgano que calló"]))
    
    def get_random_anchor(self):
        return random.choice(SARAMAGO_ANCHORS)
    
    def generate_phase1(self, organ, emotion, metaphor):
        anchor = self.get_random_anchor()
        
        prompt_fase1 = f"""
{anchor}

Escribe el inicio de un ensayo narrativo continuo sobre la conexión entre '{organ}' y '{emocion}'.
La metáfora ineludible de '{organ}' en este texto es: '{metaphor}'.

Comienza describiendo el síntoma físico no como un fallo mecánico, sino como un grito de la arquitectura del cuerpo cuando la emoción la satura. 
Fluye sin pausas estructurales, usando la respiración larga de Saramago y la observación paradójica de Osho. No uses puntos y seguidos cortos, usa la concatenación.
No introduzcas todavía a otros autores, quédate en la observación pura del síntoma y la metáfora.
Extensión aproximada de este bloque: 400 palabras.
"""
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_fase1}
                ],
                temperature=self.temperature,
                presence_penalty=self.presence_penalty,
                frequency_penalty=self.frequency_penalty,
                max_tokens=700
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error en Fase 1: {e}")
            return ""
    
    def generate_phase2(self, organ, emotion, metaphor, text_base):
        # EL CAMBIO MÁS IMPORTANTE AQUÍ: Eliminamos la petición de "sección", "FAQ" o "Práctica"
        # porque la IA inevitablemente intentará formatearlo como lista, rompiendo la regla 1.
        
        prompt_fase2 = f"""
Continúa el siguiente texto profundizando en la paradoja de cómo la mente humana intenta huir de esta emoción ({emocion}), 
y cómo esa huida intelectual es exactamente lo que fossiliza el síntoma en la {organ}.

Entrelaza sutilmente, sin nombrarlos de manera académica, conceptos de Louise Hay (el pensamiento como creador de materia), 
Ryke Geerd Hamer (el conflicto no resuelto como shocks biológicos) o Gabor Maté (el estrés como alienación del yo). 
Que parezca una sola corriente de pensamiento, no una lista de autores.

Luego, dentro del mismo flujo narrativo, invita a una práctica de integración basada puramente en la observación pasiva, no en la acción forzada.
Termina el texto abruptamente con una pregunta abierta que resuene en el silencio, sin dar respuestas ni conclusiones felices.

Texto a continuar: 
{text_base}

Extensión adicional: 500-600 palabras.
"""
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_fase2}
                ],
                temperature=0.9, # Más alfa en la fase filosófica
                presence_penalty=0.7,
                frequency_penalty=0.6,
                max_tokens=900
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error en Fase 2: {e}")
            return ""
    
    def clean_text(self, text):
        """Limpieza quirúrgica para mantener reglas estrictas de formato cero"""
        # Eliminar formatos Markdown típicos
        text = text.replace("**", "").replace("##", "").replace("###", "")
        text = text.replace("####", "").replace("*", "").replace("_", "")
        
        # Normalizar saltos de línea (forzar un solo salto, nunca dobles que creen párrafos cortos)
        text = text.replace("\r\n", "\n").replace("\n\n\n", "\n\n")
        
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue # Ignorar líneas vacías
                
            # Patrón Regex improvisado para matar viñetas y números automáticos
            if (stripped.startswith('-') or stripped.startswith('*') or 
                stripped.startswith('•') or stripped.startswith('–') or
                (len(stripped) > 1 and stripped[0].isdigit() and stripped[1] in '.)-')):
                # Si es una viñeta, le quitamos el prefijo y lo unimos al flujo
                cleaned_lines.append(stripped.lstrip('-*•–0123456789.).) ').strip())
            else:
                cleaned_lines.append(stripped)
        
        # Unir con un solo salto de línea forzado
        return '\n'.join(cleaned_lines)
    
    def generate_article(self, organ, emotion):
        print(f"\n[Motor] Generando: {organ} + {emotion}")
        
        metaphor = self.get_random_metaphor(organ)
        print(f"[Motor] Metáfora de anclaje: {metaphor}")
        
        text_base = self.generate_phase1(organ, emotion, metaphor)
        if not text_base: return ""
        
        text_expanded = self.generate_phase2(organ, emotion, metaphor, text_base)
        if not text_expanded: return text_base 
        
        full_text = text_base + "\n" + text_expanded
        cleaned_text = self.clean_text(full_text)
        
        metadata = f"""---
title: "{organ.capitalize()} y {emotion.capitalize()}: una lectura corporal"
date: {datetime.now().strftime('%Y-%m-%d')}
author: "SINTOMARIO.ORG"
metaphor: "{metaphor}"
---
\n"""
        
        return metadata + cleaned_text
    
    def save_article(self, organ, emotion, content):
        # Crear directorio si no existe
        os.makedirs("generated", exist_ok=True)
        
        filename = f"{organ.lower()}-{emotion.lower().replace(' ', '-')}.md"
        filepath = f"generated/{filename}"
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[Motor] Guardado en: {filepath}")
            return filepath
        except Exception as e:
            print(f"Error E/S: {e}")
            return None

def main():
    engine = NarrativeEngine()
    
    articles_to_generate = [
        ("Estómago", "Ansiedad"),
        ("Tiroides", "Frustración"),
        ("Piel", "Miedo"),
        ("Espalda", "Carga"),
        ("Corazón", "Trauma")
    ]
    
    for organ, emotion in articles_to_generate:
        print("="*50)
        article = engine.generate_article(organ, emotion)
        if article:
            engine.save_article(organ, emotion, article)
            print(f"[Motor] Completado ({len(article)} chars)")
        print("="*50)

if __name__ == "__main__":
    main()
