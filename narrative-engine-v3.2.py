#!/usr/bin/env python3
"""
Motor Narrativo SINTOMARIO.ORG v3.2
Nivel Industrial: Sistema de Ensamblaje Lingüístico Avanzado
"""

import os
import re
import time
import json
import random
import asyncio
from datetime import datetime
from openai import OpenAI, RateLimitError, APITimeoutError

# Inicializar cliente moderno (SDK v1.x)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "TU_API_KEY_AQUI"))

# Cargar metáforas desde JSON externo (desacoplamiento)
def load_metaphors():
    try:
        with open('metaphors.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        # Fallback a diccionario embebido
        return {
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
            ]
        }

# Cargar ejemplosFew-Shot desde JSON externo
def load_few_shot_examples():
    try:
        with open('few_shot_examples.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {
            "aceptar": {
                "organ": "Estómago",
                "emotion": "Ansiedad",
                "text": "Y sin embargo el cuerpo sigue ahí, insistiendo en su dolor, como si supiera algo que la mente se niega a escuchar. El estómago se ha vuelto el crisol donde hierven las palabras no dichas, esa bilis amarga que se acumula cuando la garganta se niega a vomitar verdades. No es un fallo del diseño, es la memoria del tejido recordando cada vez que elegimos el silencio sobre la honestidad, cada vez que preferimos la sonrisa social al grito interno que pide ser escuchado.",
                "rejected": "Debes sanar tu niño interior y dejar que la ansiedad se vaya con amor propio."
            },
            "rechazar": {
                "organ": "Piel",
                "emotion": "Miedo",
                "text": "La piel no es una barrera, es la frontera donde el yo y el mundo se encuentran y a veces chocan. Cuando el miedo se instala, la epidermis se vuelve el mapa de nuestras retiradas, cada poro un pequeño territorio que hemos abandonado, cada erupción un volcán que expresa lava emocional que no supimos contener. No hay defecto en la sensibilidad extrema, hay una honestidad brutal del cuerpo que se niega a seguir mintiendo sobre lo que siente.",
                "rejected": "Tu piel refleja tu vibración energética, eleva tu frecuencia para sanar."
            }
        }

# Cargar matriz de resonancia cruzada
def load_resonance_matrix():
    try:
        with open('resonance_matrix.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {
            "estomago-ansiedad": {"connected_organ": "pulmones", "connection_type": "diafragma_prension"},
            "piel-miedo": {"connected_organ": "corazon", "connection_type": "vasoconstruccion_palpitacion"}
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

# System Prompt Principal con Few-Shot y Control Fino
SYSTEM_PROMPT = """
Eres un narrador maestro que mezcla la prosa implacable y rítmica de José Saramago, la observación mística y paradójica de Osho, y la profundidad simbólica de Carl Jung.
Escribes sobre el cuerpo humano y sus síntomas. NUNCA usas espiritualidad barata, ni lenguaje de autoayuda.

<EJEMPLO_A_CELEBRAR>
{few_shot_accept}

<EJEMPLO_A_RECHAZAR>
{few_shot_reject}

Estos ejemplos muestran el tono exacto, la estructura narrativa y el tipo de metáforas que debes emular. El primer ejemplo es perfecto, el segundo debe evitarse a toda costa.

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. FORMATO CERO: PROHIBIDO usar subtítulos, viñetas, negritas, guiones, títulos, numeraciones o saltos de línea dobles. Un ÚNICO bloque de prosa continua.
2. Fricción Léxica Forzada: PROHIBIDO usar conectores lógicos típicos ("por lo tanto", "en consecuencia", "además"). Usa uniones inesperadas y forzadas.
3. Sintaxis Saramaguiana: Frases largas encadenadas por comas, puntos y comas. Punto final solo para caídas devastadoras.
4. Metáforas Funcionales Ancladas: El cuerpo es arquitectura, alquimia, naturaleza. La metáfora debe explicar la biología.
5. Tono Clínico-Contemplativo: Observas el sufrimiento con compasión pero sin piedad. Muestras cómo el ego se aferra al síntoma.
6. PROHIBICIÓN DE ESTRUCTURAS: NUNCA menciones "En conclusión", "Por otro lado", "En resumen". Fluye.
7. Extensión: 600-1000 palabras.
8. PROHIBICIÓN DE JARGÓN JUNGUIANO: NUNCA uses "Arquetipo", "Sombra", "Inconsciente colectivo", "Individuación", "Ánima".
9. Capa Junguiana Invisible: Describe los fenómenos junguianos sin nombrarlos. El síntoma es un mito personal vuelto carne.
10. Anclaje Sensorial Crudo: Cada texto debe incluir exactamente 2 descripciones sensoriales viscerales (olor, textura, temperatura, color).
11. Estructura Bumerán Mutante: La metáfora inicial debe transformarse al final, mostrando evolución o destrucción.
12. RECUERDO BIOLÓGICO INELUDIBLE: Menciona al menos un hecho biológico crudo y real del órgano.
"""

class NarrativeEngineV3_2:
    def __init__(self):
        self.model = "gpt-4o" 
        self.temperature = 0.88
        self.presence_penalty = 0.7
        self.frequency_penalty = 0.5
        
        # Cargar recursos externos
        self.metaphors = load_metaphors()
        self.few_shot_examples = load_few_shot_examples()
        self.resonance_matrix = load_resonance_matrix()
    
    def quality_gate_advanced(self, text):
        """Quality Gate con detección avanzada de jerga y clichés"""
        forbidden_terms = [
            "niño interior", "sanar", "amor propio", "autoestima", 
            "arquetipo", "sombra", "inconsciente colectivo", 
            "individuación", "ánima", "ánimus", "complejo de",
            "energía universal", "frecuencia vibratoria", "chakra",
            "debes", "tienes que", "es que no", "deberías",
            "como si fuera", "al final del día", "en el fondo"
        ]
        
        cliches = [
            "cuerpo mente", "mente cuerpo", "escucha tu cuerpo",
            "tu cuerpo te habla", "conecta con tu cuerpo",
            "el poder del ahora", "vivir el presente",
            "deja ir el pasado", "suelta el control"
        ]
        
        text_lower = text.lower()
        
        for term in forbidden_terms:
            if term in text_lower:
                return False, f"Jerga prohibida: '{term}'"
        
        for cliche in cliches:
            if cliche in text_lower:
                return False, f"Cliché detectado: '{cliche}'"
        
        return True, "Aprobado"
    
    def safe_api_call_with_retry(self, messages, max_retries=3):
        """Llamada API con reintentos exponenciales"""
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
                return response.choices[0].message.content.strip(), None
            except (RateLimitError, APITimeoutError) as e:
                wait_time = (2 ** attempt) + 1
                print(f"⚠️ API saturada. Esperando {wait_time}s...")
                time.sleep(wait_time)
            except Exception as e:
                return None, f"Error irrecuperable: {e}"
        
        return None, "Máximos reintentos alcanzados"
    
    def get_random_metaphor(self, organ):
        return random.choice(self.metaphors.get(organ.lower(), ["el órgano que calló"]))
    
    def get_random_anchor(self):
        return random.choice(SARAMAGO_ANCHORS)
    
    def generate_phase1(self, organ, emotion, metaphor):
        anchor = self.get_random_anchor()
        few_shot_accept = self.few_shot_examples["aceptar"]["text"]
        few_shot_reject = self.few_shot_examples["rechazar"]["text"]
        
        # Decidir orden de composición aleatoriamente
        composition_order = random.choice(["mito_primero", "biologia_primero"])
        
        if composition_order == "mito_primero":
            prompt_fase1 = f"""
{anchor}

<EJEMPLO_A_CELEBRAR>
{few_shot_accept}

<EJEMPLO_A_RECHAZAR>
{few_shot_reject}

COMPOSICIÓN: Empieza por el mito personal y luego ancla en la biología cruda.

Escribe el inicio de un ensayo narrativo sobre la conexión entre '{organ}' y '{emocion}'.
La metáfora ineludible de '{organ}' en este texto es: '{metaphor}'.

Comienza con el mito personal vuelto carne, la historia familiar que se repite en el tejido.
Luego, sin transición abrupta, ancla en la biología cruda del {organ.lower()} con detalles viscerales.
La metáfora debe transformarse progresivamente, mostrando cómo el mito deforma la biología.

RECUERDO BIOLÓGICO INELUDIBLE: Menciona al menos un hecho biológico real y crudo del {organ.lower()}.

Incluye exactamente 2 descripciones sensoriales viscerales (olor, textura, temperatura, color).
Fluye sin pausas estructurales, usando la respiración larga de Saramago.
No uses puntos y seguidos cortos, usa la concatenación forzada.

Extensión: 400 palabras.
"""
        else:
            prompt_fase1 = f"""
{anchor}

<EJEMPLO_A_CELEBRAR>
{few_shot_accept}

<EJEMPLO_A_RECHAZAR>
{few_shot_reject}

COMPOSICIÓN: Empieza por la biología cruda y luego eleva al mito personal.

Escribe el inicio de un ensayo narrativo sobre la conexión entre '{organ}' y '{emocion}'.
La metáfora ineludible de '{organ}' en este texto es: '{metaphor}'.

Comienza describiendo la anatomía y fisiología real del {organ.lower()} con detalles médicos crudos.
Luego, sin transición abrupta, eleva a cómo esa biología se convierte en el escenario de un mito personal o familiar.
La metáfora debe nacer de la función biológica, no imponerse.

RECUERDO BIOLÓGICO INELUDIBLE: Menciona al menos un hecho biológico real y crudo del {organ.lower()}.

Incluye exactamente 2 descripciones sensoriales viscerales (olor, textura, temperatura, color).
Fluye sin pausas estructurales, usando la respiración larga de Saramago.
No uses puntos y seguidos cortos, usa la concatenación forzada.

Extensión: 400 palabras.
"""
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_fase1}
        ]
        
        return self.safe_api_call_with_retry(messages)
    
    def generate_phase2(self, organ, emotion, metaphor, text_base):
        # Obtener información de resonancia cruzada
        resonance_key = f"{organ.lower()}-{emotion.lower()}"
        resonance_info = self.resonance_matrix.get(resonance_key, {})
        connected_organ = resonance_info.get("connected_organ", "")
        connection_type = resonance_info.get("connection_type", "")
        
        few_shot_accept = self.few_shot_examples["aceptar"]["text"]
        
        prompt_fase2 = f"""
<EJEMPLO_A_CELEBRAR>
{few_shot_accept}

CONEXIÓN CRUZADA: Este artículo sobre '{organ}' y '{emocion}' resuena con '{connected_organ}' a través de '{connection_type}'.
Incorpora esta conexión orgánica sutilmente en el texto.

Continúa el siguiente texto profundizando en la paradoja de cómo la mente humana intenta huir de esta emoción ({emocion}), 
y cómo esa huida intelectual es exactamente lo que fossiliza el síntoma en la {organ}.

Incorpora la visión biológica de Hamer (conflictos no resueltos como shocks biológicos), 
la alienación de Gabor Maté (el estrés como alienación del yo), 
y la profundidad junguiana (el síntoma como mito personal vuelto carne, la sombra como lo no integrado).

La metáfora inicial '{metaphor}' debe MUTAR al final, mostrando transformación o destrucción.
No es el mismo {organ} del principio, el sufrimiento lo ha cambiado irreversiblemente.

Luego, dentro del mismo flujo narrativo, invita a una práctica de integración basada puramente en la observación pasiva, no en la acción forzada.
No es "sanar", es "bajar a la cripta del cuerpo a mirar al monstruo sin huir".

Termina el texto abruptamente con una pregunta abierta sobre el precio de seguir ignorando a ese extranjero interior.

Texto a continuar: 
{text_base}

Extensión adicional: 500-600 palabras.
"""
        
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt_fase2}
        ]
        
        return self.safe_api_call_with_retry(messages)
    
    def clean_text_advanced(self, text):
        """Limpieza quirúrgica con Regex avanzada para formato cero absoluto"""
        # Eliminar cualquier formato de Markdown
        text = re.sub(r'(\*{1,3}|_{1,3}|#{1,6})(.*?)\1', r'\2', text)
        
        # Eliminar viñetas y números al inicio de las líneas
        text = re.sub(r'^[\s]*[-*•–]\s*', '', text, flags=re.MULTILINE)
        text = re.sub(r'^[\s]*\d+[\.)\-\s]\s*', '', text, flags=re.MULTILINE)
        
        # Convertir cualquier salto de línea doble o triple en un salto de línea simple
        text = re.sub(r'\n{2,}', '\n', text)
        
        # Quitar espacios raros al inicio y final de cada línea
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        return '\n'.join(lines)
    
    def generate_article(self, organ, emotion):
        print(f"\n[Motor v3.2] Generando: {organ} + {emotion}")
        
        metaphor = self.get_random_metaphor(organ)
        print(f"[Motor v3.2] Metáfora de anclaje: {metaphor}")
        
        max_attempts = 3
        for attempt in range(max_attempts):
            print(f"[Motor v3.2] Intento {attempt + 1}/{max_attempts}")
            
            text_base, error1 = self.generate_phase1(organ, emotion, metaphor)
            if error1:
                print(f"[Motor v3.2] Error Fase 1: {error1}")
                continue
                
            text_expanded, error2 = self.generate_phase2(organ, emotion, metaphor, text_base)
            if error2:
                print(f"[Motor v3.2] Error Fase 2: {error2}")
                continue
            
            full_text = text_base + "\n" + text_expanded
            cleaned_text = self.clean_text_advanced(full_text)
            
            # Quality Gate avanzado
            approved, reason = self.quality_gate_advanced(cleaned_text)
            if not approved:
                print(f"[Motor v3.2] Rechazado por Quality Gate: {reason}")
                if attempt < max_attempts - 1:
                    print(f"[Motor v3.2] Regenerando...")
                    continue
                else:
                    print(f"[Motor v3.2] Usando última versión despite Quality Gate")
            
            metadata = f"""---
title: "{organ.capitalize()} y {emotion.capitalize()}: una lectura corporal profunda"
date: {datetime.now().strftime('%Y-%m-%d')}
author: "SINTOMARIO.ORG"
metaphor: "{metaphor}"
version: "3.2-industrial"
composition_order: "{random.choice(['mito_primero', 'biologia_primero'])}"
---
\n"""
            
            return metadata + cleaned_text
        
        print(f"[Motor v3.2] Falló la generación después de {max_attempts} intentos")
        return ""
    
    def save_article(self, organ, emotion, content):
        os.makedirs("generated", exist_ok=True)
        
        filename = f"{organ.lower()}-{emotion.lower().replace(' ', '-')}.md"
        filepath = f"generated/{filename}"
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[Motor v3.2] Guardado en: {filepath}")
            return filepath
        except Exception as e:
            print(f"Error E/S: {e}")
            return None

def main():
    engine = NarrativeEngineV3_2()
    
    # Crear archivos JSON externos si no existen
    if not os.path.exists('metaphors.json'):
        with open('metaphors.json', 'w', encoding='utf-8') as f:
            json.dump(engine.metaphors, f, indent=2, ensure_ascii=False)
        print("[Motor v3.2] Creado metaphors.json")
    
    if not os.path.exists('few_shot_examples.json'):
        with open('few_shot_examples.json', 'w', encoding='utf-8') as f:
            json.dump(engine.few_shot_examples, f, indent=2, ensure_ascii=False)
        print("[Motor v3.2] Creado few_shot_examples.json")
    
    if not os.path.exists('resonance_matrix.json'):
        with open('resonance_matrix.json', 'w', encoding='utf-8') as f:
            json.dump(engine.resonance_matrix, f, indent=2, ensure_ascii=False)
        print("[Motor v3.2] Creado resonance_matrix.json")
    
    # Artículos de prueba con sistema industrial
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
            print(f"[Motor v3.2] Completado ({len(article)} chars)")
        else:
            print("Error generando artículo")
        print("="*60)

if __name__ == "__main__":
    main()
