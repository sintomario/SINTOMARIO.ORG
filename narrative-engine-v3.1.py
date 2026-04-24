#!/usr/bin/env python3
"""
Motor Narrativo SINTOMARIO.ORG v3.1
Genera artículos con voz clínico-contemplativa (Saramago + Osho + Jung)
BLINDEADO contra jerga New-Age con Quality Gate y mejoras de producción
"""

import os
import re
import time
import random
from datetime import datetime
from openai import OpenAI, RateLimitError, APITimeoutError

# Inicializar cliente moderno (SDK v1.x)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "TU_API_KEY_AQUI"))

# Banco de Metáforas Rotativas (Expandido)
METAPHOR_BANK = {
    "estomago": [
        "el horno alquímico donde se cocinan las emociones no digeridas",
        "la bolsa de los ayunos forzados y las palabras tragadas", 
        "el crisol de los vivos que transforma o envenena",
        "la caverna ácida que guarda los secretos que no pudimos escupir",
        "el caldero donde hierven las indignaciones mudas",
        "el archivo de las comidas no consumidas y las promesas rotas",
        "el estómago de la tribu que retiene lo que la comunidad no puede enfrentar"
    ],
    "tiroides": [
        "la mariposa esclava del reloj moderno",
        "el acelerador del miedo a no ser suficiente",
        "la centinela del cuello que vigila el ritmo vital",
        "la guardiana del tiempo que se niega a detenerse",
        "el regulador del fuego interior y del hielo exterior",
        "la memoria glandular de las urgencias heredadas",
        "el eco biológico de las voces maternas que apuraban"
    ],
    "piel": [
        "el muro fronterizo entre el yo y el mundo",
        "el lienzo sensible que registra cada toque no deseado",
        "la armadura porosa que deja pasar el afecto y el dolor por igual",
        "el mapa táctil de todas nuestras vulnerabilidades",
        "la membrana que nos protege y nos expone a la intemperie",
        "la piel del clan que carga con las marcas de las historias familiares",
        "el pergamino donde se escriben los traumas que la boca no nombra"
    ],
    "espalda": [
        "la viga maestra que sostiene el peso de las historias no lloradas",
        "el archivo corporal de todas las cargas que dijimos que sí",
        "el soporte invisible de nuestras decisiones más cobardes",
        "la columna vertebral de nuestras resistencias al cambio",
        "el muro de contención de las presiones ajenas",
        "la espalda del ancestro que carga con las deudas generacionales",
        "el pilar donde se apoyan los fantasmas que no hemos exorcizado"
    ],
    "corazon": [
        "el tambor que marca el ritmo de nuestras contradicciones",
        "la bomba impulsora de la vida y del terror a perderla",
        "el centro gravitacional de nuestros afectos truncos",
        "el motor que late al compás de nuestras heridas infantiles",
        "el cronómetro vital que acelera cuando la mente huye",
        "el corazón del linaje que late al ritmo de las heridas no sanadas",
        "la cámara secreta donde guardamos los amores que no pudimos vivir"
    ],
    "cabeza": [
        "la torre de control que dirige el tráfico de nuestras confusiones",
        "el archivo donde se guardan los recuerdos que preferimos olvidar",
        "el observatorio desde donde vigilamos nuestros propios miedos",
        "la sede del gobierno que dicta leyes que nosotros mismos rompemos",
        "el faro que ilumina los abismos que no queremos ver",
        "la biblioteca mental donde los libros prohibidos duermen en polvo",
        "el trono desde donde el ego dicta sentencias contra el cuerpo"
    ],
    "pulmones": [
        "los fuelles que insuflan el aliento de la vida o del suspiro",
        "el archivo del aire que respiramos y del que no nos atrevemos a tomar",
        "los pulmones de la tribu que guardan el aliento colectivo",
        "las membranas del alma que se hinchan o se contraen con el miedo",
        "el fuelle del herrero que transforma el hierro del sufrimiento",
        "los ventiladores de las emociones que enfrían o calientan el pecho"
    ]
}

# Anclas Saramaguianas (Expandidas con profundidad junguiana)
SARAMAGO_ANCHORS = [
    "Y sin embargo el cuerpo sigue ahí, insistiendo en su dolor, como si supiera algo que la mente se niega a escuchar, un saber ancestral que viene de antes que las palabras...",
    "No es el órgano el que falla, es la vida la que se le echó encima con demasiada fuerza, y el tejido cedió bajo el peso de historias que no le pertenecían...",
    "Observa cómo te resistes a sentir, cómo te agarras al borde de ti mismo con las uñas, mientras adentro algo se desgarra como un viejo pergamino...",
    "Hay una verdad que la medicina prefiere ignorar en favor de los números, y es que el síntoma habla un idioma antiguo, el lenguaje de los mitos que se volvieron carne...",
    "El síntoma no es un error del diseño humano, es un mensaje que se niega a ser silenciado por otra pastilla, un extranjero que grita desde el sótano del cuerpo...",
    "Mira con atención lo que tu cuerpo intenta decirte sin palabras, observa la geometría de tu sufrimiento, hay un mapa allí que tu abuelo conocía pero que tú has olvidado leer...",
    "La anatomía describe formas frías, pero la vida escribe historias de fuego y agua en los tejidos, sagas familiares que se repiten generación tras generación...",
    "Los médicos ven tejidos muertos bajo el microscopio, pero el cuerpo vivo escribe poemas de angustia, epopeyas de supervivencia que la ciencia no puede leer...",
    "Hay una rebelión silenciosa ocurriendo en tu interior, un levantamiento de células hastiadas de guardar secretos que no les pertenecen...",
    "El tiempo no perdona, eso lo sabemos, pero el cuerpo tiene una memoria más larga y menos piadosa que el tiempo, una memoria que carga con las deudas de los ancestros..."
]

# System Prompt Principal (HIPER-ESTRICTO con capa junguiana)
SYSTEM_PROMPT = """
Eres un narrador que mezcla la prosa implacable y rítmica de José Saramago, la observación mística y paradójica de Osho, y la profundidad simbólica de Carl Jung.
Escribes sobre el cuerpo humano y sus síntomas. NUNCA usas espiritualidad barata, ni lenguaje de autoayuda ("debes sanar", "amor propio").

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. FORMATO CERO: PROHIBIDO usar subtítulos, viñetas, negritas, guiones, títulos, numeraciones (1., 2., a), b)) o saltos de línea dobles. El texto DEBE ser un ÚNICO bloque de prosa continua, como un río.
2. Sintaxis Saramaguiana: Usa frases largas encadenadas por comas, puntos y comas y conjunciones ("y", "mas", "pero", "o", "pues"). Reserva el punto final solo para caídas de tono devastadoras o reveladoras.
3. Metáforas funcionales ancladas: El cuerpo es arquitectura, alquimia, naturaleza. La metáfora debe explicar la biología, no reemplazarla.
4. Tono clínico-contemplativo: Observas el sufrimiento con compasión pero sin piedad. Muestras cómo el ego se aferra al síntoma porque le da identidad.
5. PROHIBICIÓN DE ESTRUCTURAS: NUNCA menciones "En conclusión", "Por otro lado", "En resumen", "Primero", "Segundo". Fluye.
6. Extensión: Escribe hasta que el pensamiento se agote (entre 600-1000 palabras).
7. Lenguaje inclusivo y observacional: "se observa", "suele aparecer", "el cuerpo decide". NUNCA "tú debes", "el paciente tiene".
8. PROHIBICIÓN DE JARGON JUNGUIANO: NUNCA uses las palabras "Arquetipo", "Sombra", "Inconsciente colectivo", "Individuación", "Ánima", "Complejo".
9. LA CAPA JUNGUIANA INVISIBLE: Debes describir los FENÓMENOS que Jung estudiaba sin nombrarlos. El síntoma debe leerse como un mito personal que se ha vuelto carne. La enfermedad es una parte de la psique que fue desterrada a la raíz del cuerpo porque el ego no soportaba mirarla. Describe la sombra como "lo no integrado", "el espectro", "la parte muda"; describe el arquetipo como "un patrón antiguo", "un eco de la tribu", "el viejo fantasma".
10. RECUERDO BIOLÓGICO INELUDIBLE: Aunque filosofes, no inventes la anatomía. El estómago contiene ácido y pepsina. El corazón tiene cuatro válvulas. La tiroides usa yodo. Menciona estos detalles crudos y biológicos en medio de la poesía para mantener la autoridad médica.
"""

class NarrativeEngine:
    def __init__(self):
        # gpt-4o tiene un ritmo y manejo de prosa literaria muy superior a gpt-4-turbo
        self.model = "gpt-4o" 
        self.temperature = 0.88 # Temperatura alta para fluctuación poética
        self.presence_penalty = 0.7 # Castiga repetición de conceptos
        self.frequency_penalty = 0.5 # Castiga repetición de palabras
    
    def quality_gate(self, text):
        """Rechaza el texto si la IA se rebela y usa jerga prohibida"""
        forbidden_terms = [
            "niño interior", "sanar", "amor propio", "autoestima", 
            "arquetipo", "sombra", "inconsciente colectivo", 
            "individuación", "ánima", "ánimus", "complejo de",
            "energía universal", "frecuencia vibratoria", "chakra",
            "debes", "tienes que", "es que no", "deberías"
        ]
        text_lower = text.lower()
        for term in forbidden_terms:
            if term in text_lower:
                print(f"⚠️ [RECHAZADO] Detectada jerga prohibida: '{term}'")
                return False
        return True
    
    def safe_api_call(self, messages, max_retries=3):
        """Ejecuta la llamada a la API con reintentos ante congestión"""
        for attempt in range(max_retries):
            try:
                response = client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=self.temperature,
                    presence_penalty=self.presence_penalty,
                    frequency_penalty=self.frequency_penalty,
                    max_tokens=900
                )
                return response.choices[0].message.content.strip()
            except (RateLimitError, APITimeoutError) as e:
                wait_time = (2 ** attempt) + 1 # Espera exponencial: 3s, 5s, 9s
                print(f"⚠️ API saturada. Esperando {wait_time}s antes del reintento {attempt+1}...")
                time.sleep(wait_time)
            except Exception as e:
                print(f"❌ Error irrecuperable de API: {e}")
                return ""
        print("❌ Máximos reintentos alcanzados. Falló la generación.")
        return ""
    
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
Fluye sin pausas estructurales, usando la respiración larga de Saramago, la observación paradójica de Osho y la profundidad simbólica de Jung sin nombrar sus conceptos. 
El síntoma debe leerse como un mito personal que se ha vuelto carne, como un eco de la tribu que resuena en el cuerpo individual.
No uses puntos y seguidos cortos, usa la concatenación.
No introduzcas todavía a otros autores, quédate en la observación pura del síntoma y la metáfora.

RECUERDO BIOLÓGICO INELUDIBLE: Aunque filosofes, no inventes la anatomía. El {organ.lower()} tiene funciones biológicas específicas que deben mencionarse para mantener autoridad médica.

Extensión aproximada de este bloque: 400 palabras.
"""
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_fase1}
        ]
        
        return self.safe_api_call(messages)
    
    def generate_phase2(self, organ, emotion, metaphor, text_base):
        
        prompt_fase2 = f"""
Continúa el siguiente texto profundizando en la paradoja de cómo la mente humana intenta huir de esta emoción ({emocion}), 
y cómo esa huida intelectual es exactamente lo que fossiliza el síntoma en la {organ}.

Incorpora la siguiente mezcla de lentes sin nombrar a los autores, como si fueran una sola corriente de agua subterránea:
- La visión biológica de Hamer (el conflicto no resuelto como shocks en los tejidos).
- La alienación de Gabor Maté (el estrés como alienación del yo).
- LA PROFUNDIDAD JUNGUIANA: Explica cómo este síntoma en la {organ} no es solo personal, sino que resuena con un "mito antiguo" o un "patrón heredado" de la familia o la cultura. Describe cómo la parte del paciente que rechazó {emocion} se ha convertido en un "extranjero dentro del propio cuerpo" que exige ser escuchado a gritos. El síntoma es una parte de la psique que fue desterrada a la raíz del cuerpo porque el ego no soportaba mirarla.

Luego, dentro del mismo flujo narrativo, invita a una práctica de integración basada puramente en la observación pasiva, no en la acción forzada. No es "sanar", es "bajar a la cripta del cuerpo a mirar al monstruo sin huir".

TERMINA EL TEXTO ABRUPTAMENTE VOLVIENDO A LA METÁFORA ORIGINAL ('{metaphor}') Y FUSIONÁNDOLA CON UNA PREGUNTA ABIERTA SOBRE EL PRECIO DE SEGUIR IGNORANDO A ESE EXTRANJERO INTERIOR. La última imagen del lector debe ser la metáfora física del órgano destruida o transformada.

Texto a continuar: 
{text_base}

Extensión adicional: 500-600 palabras.
"""
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_fase2}
        ]
        
        return self.safe_api_call(messages)
    
    def clean_text(self, text):
        """Limpieza quirúrgica con Regex avanzada para formato cero absoluto"""
        import re
        
        # 1. Eliminar cualquier formato de negritas, cursivas o headers Markdown
        text = re.sub(r'(\*{1,3}|_{1,3}|#{1,6})(.*?)\1', r'\2', text)
        
        # 2. Eliminar viñetas y números al inicio de las líneas
        text = re.sub(r'^[\s]*[-*•–]\s*', '', text, flags=re.MULTILINE)
        text = re.sub(r'^[\s]*\d+[\.)\-\s]\s*', '', text, flags=re.MULTILINE)
        
        # 3. EL TRUCO DEFINITIVO: Convertir cualquier salto de línea doble o triple en un salto de línea simple
        # Esto fuerza el efecto "bloque continuo" o párrafos sueltos largos, matando las listas
        text = re.sub(r'\n{2,}', '\n', text)
        
        # 4. Quitar espacios raros al inicio y final de cada línea
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # 5. Unir con un solo salto de línea forzado
        return '\n'.join(lines)
    
    def generate_article(self, organ, emotion):
        print(f"\n[Motor v3.1] Generando: {organ} + {emotion}")
        
        metaphor = self.get_random_metaphor(organ)
        print(f"[Motor v3.1] Metáfora de anclaje: {metaphor}")
        
        # Bucle de generación con Quality Gate
        max_attempts = 3
        for attempt in range(max_attempts):
            print(f"[Motor v3.1] Intento {attempt + 1}/{max_attempts}")
            
            text_base = self.generate_phase1(organ, emotion, metaphor)
            if not text_base: 
                continue
                
            text_expanded = self.generate_phase2(organ, emotion, metaphor, text_base)
            if not text_expanded: 
                continue
            
            full_text = text_base + "\n" + text_expanded
            cleaned_text = self.clean_text(full_text)
            
            # Quality Gate
            if not self.quality_gate(cleaned_text):
                if attempt < max_attempts - 1:
                    print(f"[Motor v3.1] Regenerando por violación de tono...")
                    continue
                else:
                    print(f"[Motor v3.1] Máximos intentos alcanzados. Usando última versión.")
            
            metadata = f"""---
title: "{organ.capitalize()} y {emotion.capitalize()}: una lectura corporal profunda"
date: {datetime.now().strftime('%Y-%m-%d')}
author: "SINTOMARIO.ORG"
metaphor: "{metaphor}"
version: "3.1-jung-blindado"
---
\n"""
            
            return metadata + cleaned_text
        
        print(f"[Motor v3.1] Falló la generación después de {max_attempts} intentos")
        return ""
    
    def save_article(self, organ, emotion, content):
        # Crear directorio si no existe
        os.makedirs("generated", exist_ok=True)
        
        filename = f"{organ.lower()}-{emotion.lower().replace(' ', '-')}.md"
        filepath = f"generated/{filename}"
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[Motor v3.1] Guardado en: {filepath}")
            return filepath
        except Exception as e:
            print(f"Error E/S: {e}")
            return None

def main():
    engine = NarrativeEngine()
    
    # Artículos de prueba con nueva capa junguiana blindada
    articles_to_generate = [
        ("Estómago", "Ansiedad"),
        ("Tiroides", "Frustración"),
        ("Piel", "Miedo"),
        ("Espalda", "Carga"),
        ("Corazón", "Trauma"),
        ("Cabeza", "Confusión"),
        ("Pulmones", "Duelo")
    ]
    
    for organ, emotion in articles_to_generate:
        print("="*60)
        article = engine.generate_article(organ, emotion)
        if article:
            engine.save_article(organ, emotion, article)
            print(f"[Motor v3.1] Completado ({len(article)} chars)")
        else:
            print("Error generando artículo")
        print("="*60)

if __name__ == "__main__":
    main()
