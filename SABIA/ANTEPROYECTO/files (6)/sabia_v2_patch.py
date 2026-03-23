"""
SABIA.INFO — Parche del motor v2.0
Añade al script original (sabia_v2.py):
  1. GLOSARIO_CLINICO — diccionario zona → términos clínicos pertinentes
  2. inyectar_tecnicismo() — inserta 1 término en la lectura libre
  3. validate_tone() — rechaza lenguaje clínico frío o místico explícito
  4. anti_repeticion_maximas() — garantiza no-repetición en ventana de 6

INSTRUCCIONES DE USO:
  Copiar las secciones marcadas con ▶▶▶ al sabia_v2.py original,
  justo después de la definición de GUIAS_SABIA (~línea 406).
"""

import hashlib

# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ SECCIÓN 1: GLOSARIO_CLINICO
# Insertar después de GUIAS_SABIA
# Regla: 1 término por lectura · máx 3 por zona · pertinente = nombra exactamente
# lo que el cuerpo hace · formato en lectura: "(término_clínico)"
# ══════════════════════════════════════════════════════════════════════════════

GLOSARIO_CLINICO = {
    "cabeza": [
        ("cefalea tensional",     "la presión que genera la tensión acumulada"),
        ("neurastenia",           "el agotamiento nervioso sin causa orgánica"),
        ("vértigo posicional",    "la desorientación que acompaña los cambios bruscos"),
    ],
    "garganta": [
        ("disfagia funcional",    "la dificultad para tragar lo que no puede decirse"),
        ("disfonía psicógena",    "la pérdida de voz sin lesión física"),
        ("xerostomía",            "la sequedad que aparece cuando las palabras se secan"),
    ],
    "pecho": [
        ("dolor precordial funcional", "la opresión sin causa cardiaca identificable"),
        ("taquicardia situacional",    "la aceleración del ritmo ante lo que amenaza"),
        ("bradicardia emocional",      "el latido que se ralentiza cuando el entusiasmo se apaga"),
    ],
    "hombro": [
        ("mialgia tensional",     "la contractura que guarda lo que no se soltó"),
        ("cervicobraquialgia",    "el dolor que viaja desde el cuello hasta el brazo"),
        ("capsulitis adhesiva",   "la articulación que se fue cerrando poco a poco"),
    ],
    "espalda-alta": [
        ("dorsalgia miofascial",  "la tensión que se instala entre los omóplatos"),
        ("disnea funcional",      "la respiración que se vuelve difícil sin causa pulmonar"),
        ("síndrome interescapular","el bloqueo crónico entre las escápulas"),
    ],
    "espalda-baja": [
        ("lumbago miofascial",    "el dolor lumbar que guarda lo que ya no puede cargarse"),
        ("radiculopatía lumbar",  "el nervio que habla cuando la presión llega al límite"),
        ("contractura paravertebral", "los músculos que se niegan a soltar la guardia"),
    ],
    "estomago": [
        ("dispepsia funcional",   "la digestión difícil de lo que no puede asimilarse"),
        ("gastritis funcional",   "la inflamación sin bacteria que busca otra causa"),
        ("reflujo gastroesofágico","lo que el estómago devuelve cuando no puede contener"),
    ],
    "higado": [
        ("hepatalgia funcional",  "el dolor en el costado que no aparece en las analíticas"),
        ("colestasis funcional",  "la bilis que no fluye cuando la rabia no encuentra salida"),
        ("síndrome de qi hepático estancado", "el bloqueo del flujo vital en el hígado"),
    ],
    "intestino": [
        ("síndrome de intestino irritable", "el colon que traduce en espasmo lo que no se suelta"),
        ("discinesia intestinal", "el movimiento irregular que refleja el caos interior"),
        ("distensión abdominal funcional", "la hinchazón que no tiene explicación orgánica"),
    ],
    "cadera": [
        ("coxartrosis inicial",   "el desgaste articular que empieza antes de notarse"),
        ("trocanteritis",         "la inflamación del lateral de la cadera"),
        ("sacroileítis funcional","la articulación sacroilíaca que pide atención"),
    ],
    "rodilla": [
        ("condromalacia rotuliana","el desgaste del cartílago que acompaña la rigidez"),
        ("gonalgia funcional",    "el dolor en la rodilla sin lesión estructural evidente"),
        ("pinzamiento femorotibial","el espacio que se reduce cuando algo pide paso"),
    ],
    "pies": [
        ("fascitis plantar",      "la inflamación de la planta que pide apoyo"),
        ("acrocianosis funcional","los pies fríos que reflejan una circulación emocional trabada"),
        ("neuropatía distal",     "el entumecimiento que empieza en los extremos"),
    ],
    "piel": [
        ("dermatitis atópica",    "la piel que reacciona a lo que el mundo le provoca"),
        ("urticaria crónica espontánea", "las ronchas que aparecen sin alérgeno identificable"),
        ("vitiligo",              "las zonas donde la piel pierde su identidad de color"),
    ],
    "tiroides": [
        ("hipotiroidismo subclínico","la glándula que trabaja despacio antes de que se note"),
        ("tiroiditis autoinmune", "el sistema que se ataca a sí mismo en el ritmo"),
        ("bocio nodular",         "el nódulo que crece donde la voz no puede"),
    ],
    "vientre": [
        ("dismenorrea primaria",  "el dolor menstrual que lleva la cuenta de lo no dicho"),
        ("metrorragia funcional", "el ciclo irregular que responde a un ritmo interno roto"),
        ("síndrome de congestión pélvica","la tensión crónica que se instala en el centro"),
    ],
}

# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ SECCIÓN 2: FUNCIÓN inyectar_tecnicismo()
# Insertar después de GLOSARIO_CLINICO
# ══════════════════════════════════════════════════════════════════════════════

def inyectar_tecnicismo(lectura: str, zona_id: str, seed: str) -> str:
    """
    Inserta 1 término clínico del glosario en el párrafo 2 o 3 de la lectura libre.
    
    Reglas editoriales:
      - Solo 1 término por lectura (nunca más)
      - Siempre entre paréntesis, en cursiva en el HTML final
      - Después de la descripción emocional, nunca antes
      - Selección determinista por hash (reproducible)
      - Si la zona no tiene glosario, retorna la lectura sin cambios
    
    Formato resultado:
      "...la tensión acumulada (mialgia tensional) tiene raíces más profundas..."
    """
    terminos = GLOSARIO_CLINICO.get(zona_id)
    if not terminos:
        return lectura
    
    # Selección determinista
    idx = int(hashlib.md5((seed + zona_id).encode()).hexdigest(), 16) % len(terminos)
    termino, descripcion = terminos[idx]
    
    # Encontrar el párrafo 2 (índice 1) para insertar
    parrafos = [p.strip() for p in lectura.split("\n\n") if p.strip()]
    if len(parrafos) < 2:
        return lectura
    
    # Insertar en el párrafo objetivo (2 o 3 según longitud)
    target_idx = 1 if len(parrafos) >= 2 else 0
    parrafo_target = parrafos[target_idx]
    
    # Buscar punto de inserción: después de la primera oración completa
    # Insertar antes del último 20% del párrafo para que fluya naturalmente
    oraciones = parrafo_target.split(". ")
    if len(oraciones) >= 2:
        # Insertar en la segunda oración
        primera = oraciones[0]
        resto = ". ".join(oraciones[1:])
        # Añadir el tecnicismo como aclaración parentética
        parrafos[target_idx] = (
            f"{primera} "
            f"({termino}) "
            f"{resto}"
        )
    else:
        # Párrafo sin punto: añadir al final
        parrafos[target_idx] = f"{parrafo_target} ({termino})"
    
    return "\n\n".join(parrafos)


# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ SECCIÓN 3: FUNCIÓN validate_tone()
# Insertar después de inyectar_tecnicismo()
# ══════════════════════════════════════════════════════════════════════════════

# Palabras que desnaturalizan la voz SabiaSavia
PALABRAS_PROHIBIDAS_CLINICAS = [
    "diagnóstico", "diagnóstico diferencial", "tratamiento", "prescripción",
    "prescribir", "medicamento", "fármaco", "dosis", "patología grave",
    "enfermedad crónica grave", "consulta urgente", "emergencia médica",
    "curación garantizada", "sana completamente", "elimina el dolor",
]

PALABRAS_PROHIBIDAS_MISTICAS = [
    "chakra", "aura", "energía cósmica", "vibración universal", "karma",
    "alma inmortal", "espíritu guía", "arcángel", "ley de atracción",
    "manifestar", "universo te escucha", "magia", "brujería", "hechizo",
    "cristal que cura", "piedra que sana",
]

def validate_tone(lectura: str) -> tuple[bool, list[str]]:
    """
    Valida que la lectura no contenga:
      - Lenguaje clínico frío (diagnósticos, tratamientos, prescripciones)
      - Lenguaje místico explícito (chakras, aura, energía cósmica)
    
    Retorna: (es_válida: bool, palabras_encontradas: list)
    Si no es válida, el motor debe regenerar con seed+1.
    """
    lectura_lower = lectura.lower()
    encontradas = []
    
    for palabra in PALABRAS_PROHIBIDAS_CLINICAS:
        if palabra.lower() in lectura_lower:
            encontradas.append(f"[CLÍNICO] {palabra}")
    
    for palabra in PALABRAS_PROHIBIDAS_MISTICAS:
        if palabra.lower() in lectura_lower:
            encontradas.append(f"[MÍSTICO] {palabra}")
    
    return len(encontradas) == 0, encontradas


# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ SECCIÓN 4: FUNCIÓN anti_repeticion_maximas()
# Insertar después de validate_tone()
# ══════════════════════════════════════════════════════════════════════════════

# Registro de máximas usadas por zona (se limpia entre runs, persiste en sesión)
_maximas_usadas: dict[str, set] = {}

def anti_repeticion_maximas(zona_id: str, maxima_key: str, maximas_disponibles: list) -> str:
    """
    Garantiza que la misma máxima Sun Tzu no se repita en las 6 lecturas de una zona.
    
    Uso:
        maxima = anti_repeticion_maximas("hombro", cid, SUNTZU_POR_ZONA["hombro"])
    
    Si la clave ya fue usada en esta zona, selecciona la siguiente disponible.
    """
    if zona_id not in _maximas_usadas:
        _maximas_usadas[zona_id] = set()
    
    usadas = _maximas_usadas[zona_id]
    disponibles = [m for m in maximas_disponibles if m not in usadas]
    
    if not disponibles:
        # Resetear si se agotaron (ciclo completo)
        _maximas_usadas[zona_id] = set()
        disponibles = maximas_disponibles
    
    # Seleccionar la primera disponible
    seleccionada = disponibles[0]
    _maximas_usadas[zona_id].add(seleccionada)
    return seleccionada


# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ SECCIÓN 5: MODIFICACIÓN DE generar()
# Reemplazar en la función generar() existente las líneas:
#
#   lectura_base = "\n\n".join([m1, m2, m3, m4, m5, m6])
#
# Por las siguientes líneas:
# ══════════════════════════════════════════════════════════════════════════════

def _generar_lectura_con_tecnicismo(m1, m2, m3, m4, m5, m6, zona_id, cid):
    """
    Construye la lectura completa con tecnicismo inyectado y validación de tono.
    Reintenta hasta 3 veces con seeds alternativos si falla la validación.
    """
    lectura_base = "\n\n".join([m1, m2, m3, m4, m5, m6])
    
    # Intentar inyección con hasta 3 seeds
    for intento in range(3):
        seed_actual = cid + str(intento)
        lectura_con_tecnicismo = inyectar_tecnicismo(lectura_base, zona_id, seed_actual)
        
        # Validar tono
        es_valida, encontradas = validate_tone(lectura_con_tecnicismo)
        
        if es_valida:
            return lectura_con_tecnicismo, seed_actual, intento
        else:
            # Log de rechazo para auditoría editorial
            print(f"  ⚠️  Tono rechazado en {cid} (intento {intento+1}): {encontradas}")
    
    # Si todos los intentos fallan, retornar sin tecnicismo (seguro)
    print(f"  ✓  {cid}: usando lectura sin tecnicismo (todos los intentos fallaron validación)")
    return lectura_base, cid, -1


# ══════════════════════════════════════════════════════════════════════════════
# ▶▶▶ EJEMPLO DE INTEGRACIÓN EN generar()
# Sustituir la línea "lectura_base = ..." en la función generar() por:
# ══════════════════════════════════════════════════════════════════════════════

EJEMPLO_INTEGRACION = '''
    # ANTES (línea ~552 del original):
    # lectura_base = "\\n\\n".join([m1, m2, m3, m4, m5, m6])
    
    # DESPUÉS (reemplazar con):
    lectura_base, seed_usado, intentos = _generar_lectura_con_tecnicismo(
        m1, m2, m3, m4, m5, m6, zona_id, cid
    )
    
    # Añadir al dict retornado:
    # "tecnicismo_seed": seed_usado,
    # "tecnicismo_intentos": intentos,
'''


# ══════════════════════════════════════════════════════════════════════════════
# TEST RÁPIDO — ejecutar con: python3 sabia_v2_patch.py
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("SABIA v2 — Test del parche de tecnicismos")
    print("=" * 60)
    
    # Test 1: inyección de tecnicismo
    lectura_test = (
        "La espalda baja es el lugar donde van las cosas que cargamos para otros.\n\n"
        "Lo que el cuerpo está guardando tiene que ver con desvalorización sostenida. "
        "Eso también tiene un nombre.\n\n"
        "Desde la biodescodificación, este patrón señala un conflicto que el sistema "
        "nervioso aprendió a sostener porque en algún momento fue la respuesta más "
        "inteligente disponible."
    )
    
    resultado = inyectar_tecnicismo(lectura_test, "espalda-baja", "espalda-baja-carga")
    print("\n▶ Test inyección de tecnicismo (espalda-baja):")
    print(f"  Párrafo 2 original: '{lectura_test.split(chr(10)+chr(10))[1][:60]}...'")
    print(f"  Párrafo 2 con term: '{resultado.split(chr(10)+chr(10))[1][:80]}...'")
    
    # Test 2: validación de tono
    lectura_ok = "El cuerpo guarda lo que la mente no puede procesar. La tensión tiene raíces."
    lectura_mal = "Este diagnóstico requiere tratamiento y prescripción médica urgente."
    lectura_mistica = "Tus chakras están bloqueados por energía cósmica negativa."
    
    print("\n▶ Test validación de tono:")
    ok, _ = validate_tone(lectura_ok)
    print(f"  Lectura neutra:  {'✓ VÁLIDA' if ok else '✗ RECHAZADA'}")
    ok, enc = validate_tone(lectura_mal)
    print(f"  Lenguaje clínico:{'✓ VÁLIDA' if ok else f'✗ RECHAZADA — {enc}'}")
    ok, enc = validate_tone(lectura_mistica)
    print(f"  Lenguaje místico:{'✓ VÁLIDA' if ok else f'✗ RECHAZADA — {enc}'}")
    
    # Test 3: anti-repetición de máximas
    print("\n▶ Test anti-repetición de máximas:")
    maximas_hombro = ["máxima-A", "máxima-B", "máxima-C", "máxima-D", "máxima-E", "máxima-F"]
    for i, ctx in enumerate(["carga", "soledad", "conflicto", "cambio", "bloqueo", "culpa"]):
        m = anti_repeticion_maximas("hombro", f"hombro-{ctx}", maximas_hombro)
        print(f"  hombro-{ctx}: {m}")
    
    # Test 4: verificar cobertura del glosario
    print("\n▶ Cobertura del GLOSARIO_CLINICO:")
    zonas = ["cabeza","garganta","pecho","hombro","espalda-alta","espalda-baja",
             "estomago","higado","intestino","cadera","rodilla","pies","piel","tiroides","vientre"]
    for z in zonas:
        t = GLOSARIO_CLINICO.get(z, [])
        print(f"  {z:20s}: {len(t)} términos — {[x[0] for x in t]}")
    
    print("\n" + "=" * 60)
    print("✓ Parche listo para integrar en sabia_v2.py")
    print("=" * 60)
