#!/usr/bin/env python3
"""
SINTOMARIO.ORG Motor Generador v4.0
Motor principal para generar el corpus estático de síntomas.
"""

import json
import os
import sys
import time
import hashlib
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# ══════════════════════════════════════════════════════════════════════════════
# SISTEMA DE DISEÑO — Design Tokens integrados
# ══════════════════════════════════════════════════════════════════════════════

DESIGN_TOKENS = {
    "colors": {
        "background": {
            "light": "#FAF8F4",
            "dark": "#141210"
        },
        "text": {
            "primary": "#1a1a1a",
            "secondary": "#666666",
            "muted": "#999999"
        },
        "accent": {
            "digestivo": "#2d7d32",
            "respiratorio": "#1976d2",
            "nervioso": "#ff8f00",
            "cardiovascular": "#d32f2f",
            "muscular": "#7b1fa2",
            "esqueletico": "#5d4037",
            "endocrino": "#00897b",
            "renal": "#00796b",
            "hepatico": "#689f38",
            "visual": "#1565c0",
            "auditivo": "#00695c"
        }
    },
    "typography": {
        "display": "'Cormorant Garamond', serif",
        "body": "'Source Serif 4', Georgia, serif",
        "ui": "'DM Mono', monospace"
    },
    "spacing": {
        "measure": "65ch",
        "barra_flotante": "48px"
    }
}

# ══════════════════════════════════════════════════════════════════════════════
# ÍNDICE MAESTRO DE NUMERACIÓN SINTOMARIO
# Cada URL del sistema tiene un número único de índice permanente
# Formato: SINTO-XXXX (4 dígitos, cero-padded)
# ══════════════════════════════════════════════════════════════════════════════

IDX = {
    # HOME
    "/": 1,
    # ZONAS HUB (001–025)
    "zona/cabeza": 10, "zona/garganta": 11, "zona/pecho": 12,
    "zona/hombro": 13, "zona/espalda-alta": 14, "zona/espalda-baja": 15,
    "zona/estomago": 16, "zona/higado": 17, "zona/intestino": 18,
    "zona/cadera": 19, "zona/rodilla": 20, "zona/pies": 21,
    "zona/piel": 22, "zona/tiroides": 23, "zona/vientre": 24,
    # CONTEXTOS HUB (030–035)
    "contexto/bloqueo": 30, "contexto/frustracion": 31, "contexto/ansiedad": 32,
    "contexto/tristeza": 33, "contexto/ira": 34, "contexto/miedo": 35,
    "contexto/culpa": 36, "contexto/verguenza": 37, "contexto/soledad": 38,
    "contexto/inseguridad": 39, "contexto/estres": 40, "contexto/agotamiento": 41,
    "contexto/confusion": 42, "contexto/desesperanza": 43, "contexto/resentimiento": 44,
    "contexto/celos": 45, "contexto/impotencia": 46, "contexto/traicion": 47,
    "contexto/apego": 48, "contexto/dependencia": 49,
    # LECTURAS (100–999) — se asigna dinámicamente zona*20 + contexto_offset + 100
    # TERAPIAS (1000–1099)
    "terapias/biodescodificacion": 1000, "terapias/eft": 1001,
    "terapias/constelaciones": 1002, "terapias/flores-bach": 1003,
    "terapias/emdr": 1004, "terapias/acupuntura": 1005,
    "terapias/ayurveda": 1006, "terapias/reiki": 1007,
    # AUTORES (1100–1109)
    "autores/louise-hay": 1100, "autores/hamer": 1101, "autores/gabor-mate": 1102,
    # PÁGINAS ESPECIALES (9000–)
    "sobre": 9000, "faq": 9001, "metodologia": 9002, "afiliados": 9003,
}

ZONA_LIST = ["cabeza","garganta","pecho","hombro","espalda-alta","espalda-baja",
             "estomago","higado","intestino","cadera","rodilla","pies",
             "piel","tiroides","vientre"]
CTX_LIST = ["bloqueo","frustracion","ansiedad","tristeza","ira","miedo",
            "culpa","verguenza","soledad","inseguridad","estres","agotamiento",
            "confusion","desesperanza","resentimiento","celos","impotencia",
            "traicion","apego","dependencia"]

def lectura_idx(zona_id: str, contexto_id: str) -> int:
    """Calcular índice único para una lectura de zona + contexto."""
    zi = ZONA_LIST.index(zona_id) if zona_id in ZONA_LIST else 0
    ci = CTX_LIST.index(contexto_id) if contexto_id in CTX_LIST else 0
    return 100 + zi * 20 + ci

@dataclass
class NodoData:
    """Estructura de datos para un nodo del corpus."""
    entidad: Dict[str, Any]
    contexto: Dict[str, Any]
    perspectiva: Dict[str, str]
    productos: List[Dict[str, Any]]
    
class SintomarioMotor:
    """Motor principal de generación del corpus SINTOMARIO."""
    
    def __init__(self, config_path: str = "sabia.config.json"):
        self.config_path = config_path
        self.config = self._load_config()
        self.corpus_dir = Path("corpus")
        self.templates_dir = Path("templates")
        self.output_dir = Path("public")
        self.reports_dir = Path("reports")
        self.logs_dir = Path("logs")
        
        # Asegurar que los directorios existan
        self._ensure_directories()
        
        # Estadísticas del build
        self.stats = {
            "total_nodes": 0,
            "indexable_nodes": 0,
            "ymyl_nodes": 0,
            "errors": 0,
            "build_duration_seconds": 0,
            "build_timestamp": datetime.now().isoformat()
        }
    
    def _ensure_directories(self):
        """Asegurar que los directorios necesarios existan."""
        for directory in [self.output_dir, self.reports_dir, self.logs_dir]:
            directory.mkdir(exist_ok=True, parents=True)
    
    def _load_config(self) -> Dict[str, Any]:
        """Cargar configuración del proyecto."""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Archivo de configuración no encontrado: {self.config_path}")
    
    def _load_corpus_data(self) -> Dict[str, Any]:
        """Cargar todos los datos del corpus."""
        data = {}
        
        # Cargar entidades
        entidades_path = self.corpus_dir / "entidades.json"
        if entidades_path.exists():
            with open(entidades_path, 'r', encoding='utf-8') as f:
                data["entidades"] = json.load(f)
        else:
            raise FileNotFoundError(f"Archivo de entidades no encontrado: {entidades_path}")
        
        # Cargar contextos
        contextos_path = self.corpus_dir / "contextos.json"
        if contextos_path.exists():
            with open(contextos_path, 'r', encoding='utf-8') as f:
                data["contextos"] = json.load(f)
        else:
            raise FileNotFoundError(f"Archivo de contextos no encontrado: {contextos_path}")
        
        # Cargar perspectivas
        perspectivas_path = self.corpus_dir / "perspectivas.json"
        if perspectivas_path.exists():
            with open(perspectivas_path, 'r', encoding='utf-8') as f:
                data["perspectivas"] = json.load(f)
        else:
            data["perspectivas"] = self._get_default_perspectivas()
        
        # Cargar productos
        productos_path = self.corpus_dir / "productos.json"
        if productos_path.exists():
            with open(productos_path, 'r', encoding='utf-8') as f:
                data["productos"] = json.load(f)
        else:
            data["productos"] = self._get_default_productos()
        
        return data
    
    def _get_default_perspectivas(self) -> Dict[str, str]:
        """Perspectivas por defecto si no hay archivo."""
        return {
            "sintomario": "Desde la visión integrativa de SINTOMARIO, este síntoma representa una comunicación del cuerpo que busca ser escuchada y comprendida en su totalidad.",
            "louise": "Según Louise Hay, este síntoma está conectado con patrones mentales y emocionales específicos que pueden ser transformados a través de la conciencia y el amor propio.",
            "hamer": "Desde la Nueva Medicina Germánica del Dr. Hamer, este síntoma corresponde a un conflicto biológico específico que puede identificarse y resolverse.",
            "mate": "Según Gabor Maté, este síntoma puede estar relacionado con experiencias de trauma y estrés crónico que manifiestan en el cuerpo."
        }
    
    def _get_default_productos(self) -> List[Dict[str, Any]]:
        """Productos por defecto si no hay archivo."""
        return [
            {
                "titulo": "El Cuerpo Habla",
                "descripcion": "Libro de referencia sobre simbología de síntomas y enfermedades.",
                "asin": "B07X123ABC",
                "url": "https://amazon.es/dp/B07X123ABC"
            },
            {
                "titulo": "Diario Terapéutico",
                "descripcion": "Cuaderno de trabajo para explorar síntomas y emociones.",
                "asin": "B08Y456DEF",
                "url": "https://amazon.es/dp/B08Y456DEF"
            },
            {
                "titulo": "Kit Aceites Esenciales",
                "descripcion": "Conjunto de aceites esenciales para bienestar emocional.",
                "asin": "B09Z789GHI",
                "url": "https://amazon.es/dp/B09Z789GHI"
            }
        ]
    
    def _slugify(self, text: str) -> str:
        """Convertir texto a slug válido para URLs."""
        import re
        # Eliminar acentos
        text = re.sub(r'[áàäâ]', 'a', text)
        text = re.sub(r'[éèëê]', 'e', text)
        text = re.sub(r'[íìïî]', 'i', text)
        text = re.sub(r'[óòöô]', 'o', text)
        text = re.sub(r'[úùüû]', 'u', text)
        text = re.sub(r'[ñ]', 'n', text)
        
        # Convertir a minúsculas y reemplazar caracteres no válidos
        text = re.sub(r'[^a-z0-9-]', '-', text.lower())
        
        # Eliminar guiones múltiples y guiones al inicio/final
        text = re.sub(r'-+', '-', text)
        text = text.strip('-')
        
        return text
    
    def _contar_palabras_reales(self, texto: str) -> int:
        """Contar palabras reales excluyendo puntuación y markup."""
        import re
        # Eliminar HTML tags y puntuación
        texto_limpio = re.sub(r'<[^>]+>', '', texto)
        texto_limpio = re.sub(r'[^\w\s]', ' ', texto_limpio)
        
        # Contar palabras (secuencias de caracteres alfanuméricos)
        palabras = [p for p in texto_limpio.split() if p.strip()]
        return len(palabras)
    
    def _generar_indice_sintomario(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> str:
        """Generar índice único SINTO-XXXX para el nodo."""
        zona_id = entidad.get("id", "")
        contexto_id = contexto.get("id", "")
        idx_num = lectura_idx(zona_id, contexto_id)
        return f"SINTO-{idx_num:04d}"
    
    def _generar_capa1(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> str:
        """Generar capa de reconocimiento del síntoma."""
        termino = entidad.get("nombre", "")
        descripcion = entidad.get("descripcion", "")
        
        capa1 = f"Cuando experimentas {termino}, tu cuerpo está comunicando algo importante. "
        capa1 += f"{descripcion} "
        
        # Añadir contexto emocional
        emocion = contexto.get("nombre", "")
        emocion_desc = contexto.get("descripcion", "")
        
        capa1 += f"Este síntoma a menudo aparece en momentos de {emocion.lower()}, "
        capa1 += f"cuando {emocion_desc.lower()}. "
        
        capa1 += "No es un error del sistema, sino una invitación a prestar atención a lo que necesita ser escuchado."
        
        return capa1
    
    def _generar_capa2(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> str:
        """Generar capa de contextualización del síntoma."""
        sistema = entidad.get("sistema", "")
        elemento_tcm = entidad.get("tcm_elemento", "")
        
        capa2 = f"Desde la perspectiva de la medicina tradicional china, {sistema} está relacionado con el elemento {elemento_tcm}. "
        
        # Añadir conexión emocional
        herida = contexto.get("herida_emocional", "")
        capa2 += f"La herida emocional subyacente suele estar conectada con {herida.lower()}. "
        
        capa2 += "Esta comprensión nos permite abordar el síntoma desde múltiples niveles: "
        capa2 += "el físico, el emocional, el energético y el espiritual."
        
        return capa2
    
    def _generar_practica(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> List[str]:
        """Generar práctica de integración de 4 pasos."""
        termino = entidad.get("nombre", "")
        sistema = entidad.get("sistema", "")
        
        practica = [
            f"1. Respira conscientemente hacia tu {sistema}, permitiendo que la relajación llegue a esa zona.",
            f"2. Reconoce sin juicio lo que sientes en relación con {termino}. Simplemente observa.",
            f"3. Pregúntate: ¿Qué necesita esta parte de mí para sentirse escuchada y comprendida?",
            f"4. Ofrece a tu cuerpo el gesto de cuidado que surja naturalmente, sin forzar nada."
        ]
        
        return practica
    
    def _generar_faqs(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generar FAQs dinámicas basadas en el nodo."""
        termino = entidad.get("nombre", "")
        sistema = entidad.get("sistema", "")
        
        faqs = [
            {
                "pregunta": f"¿Es normal tener {termino} con frecuencia?",
                "respuesta": f"Sí, {termino} es una experiencia común que muchas personas tienen. Tu cuerpo está comunicando algo importante a través de este síntoma."
            },
            {
                "pregunta": f"¿Qué relación tiene {termino} con el estrés?",
                "respuesta": f"{termino} a menudo se intensifica en períodos de estrés porque el cuerpo y la mente están conectados. El estrés puede manifestarse físicamente en el {sistema}."
            },
            {
                "pregunta": f"¿Cuándo debería buscar ayuda profesional por {termino}?",
                "respuesta": f"Si {termino} es persistente, severo, o interfiere significativamente con tu vida diaria, es recomendable consultar con un profesional de la salud."
            }
        ]
        
        return faqs
    
    def _generar_metadata_seo(self, entidad: Dict[str, Any], contexto: Dict[str, Any]) -> Dict[str, Any]:
        """Generar metadata SEO para el nodo."""
        termino = entidad.get("nombre", "")
        sistema = entidad.get("sistema", "")
        emocion = contexto.get("nombre", "")
        
        # Title tag
        title = f"{termino} - {emocion} | SINTOMARIO"
        if len(title) > 60:
            title = f"{termino} | SINTOMARIO"
        
        # Meta description
        description = f"Comprende {termino} desde múltiples perspectivas. "
        description += f"Explora las conexiones entre {sistema} y {emocion.lower()}. "
        description += f"Guía holística para interpretar y abordar este síntoma."
        
        if len(description) > 155:
            description = f"Comprende {termino} desde múltiples perspectivas. "
            description += f"Conexiones entre {sistema} y {emocion.lower()}. "
            description += f"Guía holística para este síntoma."
        
        # URL canónica
        slug_entidad = self._slugify(termino)
        slug_contexto = self._slugify(emocion)
        slug_territorio = "cuerpo"  # Por ahora, todo en cuerpo
        
        canonical_url = f"https://sintomario.org/{slug_territorio}/{slug_entidad}/{slug_contexto}/"
        
        return {
            "title": title,
            "description": description,
            "canonical_url": canonical_url,
            "slug_entidad": slug_entidad,
            "slug_contexto": slug_contexto,
            "slug_territorio": slug_territorio,
            "meta_robots": "index, follow"
        }
    
    def _generar_schema_json(self, nodo_data: Dict[str, Any], metadata: Dict[str, Any]) -> str:
        """Generar schema JSON-LD para el nodo."""
        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Article",
                    "headline": metadata["title"],
                    "description": metadata["description"],
                    "url": metadata["canonical_url"],
                    "datePublished": datetime.now().strftime("%Y-%m-%d"),
                    "dateModified": datetime.now().strftime("%Y-%m-%d"),
                    "author": {
                        "@type": "Organization",
                        "name": "SINTOMARIO"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "SINTOMARIO.ORG",
                        "url": "https://sintomario.org"
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": metadata["canonical_url"]
                    }
                }
            ]
        }
        
        # Añadir FAQPage si hay FAQs
        if nodo_data.get("faqs"):
            faq_schema = {
                "@type": "FAQPage",
                "mainEntity": []
            }
            
            for faq in nodo_data["faqs"]:
                faq_schema["mainEntity"].append({
                    "@type": "Question",
                    "name": faq["pregunta"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["respuesta"]
                    }
                })
            
            schema["@graph"].append(faq_schema)
        
        # Añadir BreadcrumbList
        schema["@graph"].append({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://sintomario.org/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": metadata["slug_territorio"].capitalize(),
                    "item": f"https://sintomario.org/{metadata['slug_territorio']}/"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": nodo_data["entidad"]["nombre"],
                    "item": f"https://sintomario.org/{metadata['slug_territorio']}/{metadata['slug_entidad']}/"
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": nodo_data["contexto"]["nombre"],
                    "item": metadata["canonical_url"]
                }
            ]
        })
        
        return json.dumps(schema, indent=2, ensure_ascii=False)
    
    def _generar_nodo_html(self, entidad: Dict[str, Any], contexto: Dict[str, Any], 
                          perspectivas: Dict[str, str], productos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generar un nodo completo del corpus."""
        
        # Generar capas de contenido
        capa1 = self._generar_capa1(entidad, contexto)
        capa2 = self._generar_capa2(entidad, contexto)
        practica = self._generar_practica(entidad, contexto)
        faqs = self._generar_faqs(entidad, contexto)
        
        # Generar metadata SEO
        metadata = self._generar_metadata_seo(entidad, contexto)
        
        # Contar palabras
        contenido_total = f"{capa1} {capa2} " + " ".join([p["respuesta"] for p in faqs])
        word_count = self._contar_palabras_reales(contenido_total)
        
        # Determinar si es indexable
        min_word_count = self.config.get("build", {}).get("min_word_count_for_index", 200)
        es_indexable = word_count >= min_word_count
        
        # Generar schema JSON-LD
        nodo_data = {
            "entidad": entidad,
            "contexto": contexto,
            "perspectivas": perspectivas,
            "productos": productos,
            "capa1": capa1,
            "capa2": capa2,
            "practica": practica,
            "faqs": faqs,
            "word_count": word_count,
            "es_indexable": es_indexable
        }
        
        schema_json = self._generar_schema_json(nodo_data, metadata)
        
        # Generar índice único SINTO-XXXX
        sintomario_idx = self._generar_indice_sintomario(entidad, contexto)
        
        # Preparar datos para template
        template_data = {
            "sintomario_indice": sintomario_idx,
            "término_principal": entidad["nombre"],
            "sistema_orgánico": entidad["sistema"],
            "contexto_emocional": contexto["nombre"],
            "capa1_reconocimiento": capa1,
            "capa2_contextualización": capa2,
            "perspectiva_sintomario": perspectivas.get("sintomario", ""),
            "perspectiva_louise": perspectivas.get("louise", ""),
            "perspectiva_hamer": perspectivas.get("hamer", ""),
            "perspectiva_mate": perspectivas.get("mate", ""),
            "practica_paso1": practica[0],
            "practica_paso2": practica[1],
            "practica_paso3": practica[2],
            "practica_paso4": practica[3],
            "faqs_html": self._generar_faqs_html(faqs),
            "producto1_título": productos[0]["titulo"],
            "producto1_descripción": productos[0]["descripcion"],
            "producto1_url": productos[0]["url"],
            "producto2_título": productos[1]["titulo"],
            "producto2_descripción": productos[1]["descripcion"],
            "producto2_url": productos[1]["url"],
            "producto3_título": productos[2]["titulo"],
            "producto3_descripción": productos[2]["descripcion"],
            "producto3_url": productos[2]["url"],
            "title_tag": metadata["title"],
            "meta_description": metadata["description"],
            "canonical_url": metadata["canonical_url"],
            "meta_robots": metadata["meta_robots"],
            "schema_json": schema_json,
            "og_image": f"https://sintomario.org/images/og/{entidad['nombre'].lower().replace(' ', '-')}-{contexto['nombre'].lower().replace(' ', '-')}.jpg",
            "color_acento": self._get_color_sistema(entidad.get("sistema", "")),
            "color_acento_dark": self._get_color_sistema_dark(entidad.get("sistema", ""))
        }
        
        return {
            "data": nodo_data,
            "template_data": template_data,
            "metadata": metadata
        }
    
    def _generar_faqs_html(self, faqs: List[Dict[str, str]]) -> str:
        """Generar HTML para las FAQs."""
        html_parts = []
        for faq in faqs:
            html_parts.append(f'<dt>{faq["pregunta"]}</dt>')
            html_parts.append(f'<dd>{faq["respuesta"]}</dd>')
        return "\n".join(html_parts)
    
    def _get_color_sistema(self, sistema: str) -> str:
        """Obtener color de acento para el sistema orgánico."""
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
    
    def _get_color_sistema_dark(self, sistema: str) -> str:
        """Obtener color de acento para modo oscuro."""
        colores = {
            "digestivo": "#4caf50",
            "respiratorio": "#42a5f5",
            "nervioso": "#ffc107",
            "cardiovascular": "#f44336",
            "muscular": "#9c27b0",
            "esqueletico": "#795548",
            "endocrino": "#009688",
            "linfatico": "#3f51b5",
            "reproductivo": "#e91e63",
            "urinario": "#03a9f4",
            "hepatico": "#8bc34a",
            "renal": "#009688",
            "pancreatico": "#ff9800",
            "biliar": "#ffeb3b",
            "inmunologico": "#9c27b0",
            "tegumentario": "#ff9800",
            "visual": "#2196f3",
            "auditivo": "#009688"
        }
        return colores.get(sistema.lower(), "#4caf50")
    
    def _render_template(self, template_path: str, data: Dict[str, Any]) -> str:
        """Renderizar template con los datos proporcionados."""
        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template_content = f.read()
            
            # Reemplazo simple de variables
            for key, value in data.items():
                placeholder = f"{{{{{key}}}}}"
                template_content = template_content.replace(placeholder, str(value))
            
            return template_content
        except FileNotFoundError:
            raise FileNotFoundError(f"Template no encontrado: {template_path}")
    
    def _crear_directorio_nodo(self, metadata: Dict[str, Any]) -> Path:
        """Crear estructura de directorios para el nodo."""
        base_path = self.output_dir / metadata["slug_territorio"] / metadata["slug_entidad"] / metadata["slug_contexto"]
        base_path.mkdir(parents=True, exist_ok=True)
        return base_path
    
    def generate_corpus(self, dry_run: bool = False, verbose: bool = False) -> bool:
        """Generar el corpus completo."""
        start_time = time.time()
        
        try:
            # Cargar datos del corpus
            corpus_data = self._load_corpus_data()
            
            entidades = corpus_data["entidades"]
            contextos = corpus_data["contextos"]
            perspectivas = corpus_data["perspectivas"]
            productos = corpus_data["productos"]
            
            if verbose:
                print(f"Entidades cargadas: {len(entidades)}")
                print(f"Contextos cargados: {len(contextos)}")
                print(f"Perspectivas cargadas: {len(perspectivas)}")
                print(f"Productos cargados: {len(productos)}")
            
            # Generar combinaciones
            total_combinations = len(entidades) * len(contextos)
            
            if verbose:
                print(f"Generando {total_combinations} nodos...")
            
            for entidad in entidades:
                for contexto in contextos:
                    self.stats["total_nodes"] += 1
                    
                    try:
                        # Generar nodo
                        nodo = self._generar_nodo_html(entidad, contexto, perspectivas, productos)
                        
                        if nodo["data"]["es_indexable"]:
                            self.stats["indexable_nodes"] += 1
                        
                        # Verificar YMYL (Your Money or Your Life)
                        if entidad.get("categoria") in ["salud", "medicina"]:
                            self.stats["ymyl_nodes"] += 1
                        
                        if not dry_run:
                            # Crear directorio
                            dir_path = self._crear_directorio_nodo(nodo["metadata"])
                            
                            # Renderizar y guardar HTML
                            template_path = self.templates_dir / "lectura.html"
                            html_content = self._render_template(str(template_path), nodo["template_data"])
                            
                            output_file = dir_path / "index.html"
                            with open(output_file, 'w', encoding='utf-8') as f:
                                f.write(html_content)
                            
                            # Guardar JSON para referencia
                            json_file = dir_path / "data.json"
                            with open(json_file, 'w', encoding='utf-8') as f:
                                json.dump(nodo["data"], f, indent=2, ensure_ascii=False)
                        
                        if verbose and self.stats["total_nodes"] % 100 == 0:
                            print(f"Procesados: {self.stats['total_nodes']}/{total_combinations}")
                    
                    except Exception as e:
                        self.stats["errors"] += 1
                        print(f"Error generando nodo {entidad.get('nombre')} - {contexto.get('nombre')}: {e}")
                        if verbose:
                            import traceback
                            traceback.print_exc()
            
            # Calcular duración
            self.stats["build_duration_seconds"] = time.time() - start_time
            
            # Generar reporte
            self._generar_reporte()
            
            if not dry_run:
                # Generar archivos estáticos adicionales
                self._generar_archivos_estaticos()
            
            if verbose:
                print(f"\nBuild completado en {self.stats['build_duration_seconds']:.2f} segundos")
                print(f"Total nodos: {self.stats['total_nodes']}")
                print(f"Nodos indexables: {self.stats['indexable_nodes']}")
                print(f"Nodos YMYL: {self.stats['ymyl_nodes']}")
                print(f"Errores: {self.stats['errors']}")
            
            return self.stats["errors"] == 0
            
        except Exception as e:
            print(f"Error crítico en generate_corpus: {e}")
            if verbose:
                import traceback
                traceback.print_exc()
            return False
    
    def _generar_reporte(self):
        """Generar reporte del build."""
        reporte = {
            "build_info": {
                "timestamp": self.stats["build_timestamp"],
                "duration_seconds": self.stats["build_duration_seconds"],
                "motor_version": "4.0"
            },
            "corpus_stats": {
                "total_nodes": self.stats["total_nodes"],
                "indexable_nodes": self.stats["indexable_nodes"],
                "ymyl_nodes": self.stats["ymyl_nodes"],
                "errors": self.stats["errors"]
            },
            "config": self.config
        }
        
        reporte_path = self.reports_dir / "build-report.json"
        with open(reporte_path, 'w', encoding='utf-8') as f:
            json.dump(reporte, f, indent=2, ensure_ascii=False)
    
    def _generar_archivos_estaticos(self):
        """Generar archivos estáticos adicionales."""
        # Generar sitemap
        self._generar_sitemap()
        
        # Generar robots.txt
        self._generar_robots_txt()
        
        # Generar CNAME
        self._generar_cname()
        
        # Generar _headers
        self._generar_headers()
        
        # Copiar páginas estáticas adicionales
        self._generar_paginas_estaticas()
        
        # Copiar CSS
        self._copiar_assets()
    
    def _generar_paginas_estaticas(self):
        """Generar páginas estáticas adicionales (FAQ, Metodología, Afiliados)."""
        paginas = [
            ("faq.html", "faq/index.html"),
            ("metodologia.html", "metodologia/index.html"),
            ("afiliados.html", "afiliados/index.html"),
            ("admin.html", "admin/index.html")
        ]
        
        for template_name, output_path in paginas:
            template_file = self.templates_dir / template_name
            if template_file.exists():
                output_file = self.output_dir / output_path
                output_file.parent.mkdir(parents=True, exist_ok=True)
                
                with open(template_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"[OK] Generada pagina: {output_path}")
    
    def _copiar_assets(self):
        """Copiar assets CSS y otros recursos estáticos."""
        css_source = Path("css/main.css")
        if css_source.exists():
            css_dest = self.output_dir / "css" / "main.css"
            css_dest.parent.mkdir(parents=True, exist_ok=True)
            
            with open(css_source, 'r', encoding='utf-8') as f:
                content = f.read()
            
            with open(css_dest, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("[OK] Copiado CSS")

    def _generar_sitemap(self):
        """Generar sitemap.xml."""
        sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # Añadir homepage
        sitemap_content += '  <url>\n'
        sitemap_content += '    <loc>https://sintomario.org/</loc>\n'
        sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
        sitemap_content += '    <changefreq>weekly</changefreq>\n'
        sitemap_content += '    <priority>1.0</priority>\n'
        sitemap_content += '  </url>\n'
        
        # Añadir páginas administrativas
        paginas_admin = ["sobre", "faq", "metodologia", "afiliados"]
        for pagina in paginas_admin:
            sitemap_content += '  <url>\n'
            sitemap_content += f'    <loc>https://sintomario.org/{pagina}</loc>\n'
            sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
            sitemap_content += '    <changefreq>monthly</changefreq>\n'
            sitemap_content += '    <priority>0.8</priority>\n'
            sitemap_content += '  </url>\n'
        
        # Añadir nodos del corpus (simplificado)
        for root, dirs, files in os.walk(self.output_dir):
            if "index.html" in files and root != str(self.output_dir):
                # Extraer URL del path
                rel_path = Path(root).relative_to(self.output_dir)
                url = f"https://sintomario.org/{rel_path.as_posix()}/"
                
                sitemap_content += '  <url>\n'
                sitemap_content += f'    <loc>{url}</loc>\n'
                sitemap_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
                sitemap_content += '    <changefreq>monthly</changefreq>\n'
                sitemap_content += '    <priority>0.8</priority>\n'
                sitemap_content += '  </url>\n'
        
        sitemap_content += '</urlset>\n'
        
        sitemap_path = self.output_dir / "sitemap.xml"
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
    
    def _generar_robots_txt(self):
        """Generar robots.txt."""
        robots_content = "User-agent: *\n"
        robots_content += "Allow: /\n"
        robots_content += "\n"
        robots_content += "Sitemap: https://sintomario.org/sitemap.xml\n"
        
        robots_path = self.output_dir / "robots.txt"
        with open(robots_path, 'w', encoding='utf-8') as f:
            f.write(robots_content)
    
    def _generar_cname(self):
        """Generar archivo CNAME para GitHub Pages."""
        cname_content = "sintomario.org"
        
        cname_path = self.output_dir / "CNAME"
        with open(cname_path, 'w', encoding='utf-8') as f:
            f.write(cname_content)
    
    def _generar_headers(self):
        """Generar archivo _headers para Netlify/Cloudflare Pages."""
        headers_content = "/*\n"
        headers_content += "  X-Frame-Options: DENY\n"
        headers_content += "  X-Content-Type-Options: nosniff\n"
        headers_content += "  X-XSS-Protection: 1; mode=block\n"
        headers_content += "  Referrer-Policy: strict-origin-when-cross-origin\n"
        headers_content += "  Permissions-Policy: geolocation=(), microphone=(), camera=()\n"
        headers_content += "\n"
        headers_content += "/css/*\n"
        headers_content += "  Cache-Control: public, max-age=31536000, immutable\n"
        headers_content += "\n"
        headers_content += "/js/*\n"
        headers_content += "  Cache-Control: public, max-age=31536000, immutable\n"
        headers_content += "\n"
        headers_content += "/images/*\n"
        headers_content += "  Cache-Control: public, max-age=31536000, immutable\n"
        
        headers_path = self.output_dir / "_headers"
        with open(headers_path, 'w', encoding='utf-8') as f:
            f.write(headers_content)

def main():
    """Función principal."""
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG Motor Generador v4.0")
    parser.add_argument("--output", default="./public", help="Directorio de salida")
    parser.add_argument("--dry-run", action="store_true", help="Ejecutar en modo prueba sin generar archivos")
    parser.add_argument("--verbose", action="store_true", help="Mostrar información detallada")
    parser.add_argument("--config", default="sabia.config.json", help="Archivo de configuración")
    
    args = parser.parse_args()
    
    try:
        motor = SintomarioMotor(args.config)
        motor.output_dir = Path(args.output)
        
        success = motor.generate_corpus(dry_run=args.dry_run, verbose=args.verbose)
        
        if success:
            print("[OK] Build completado exitosamente")
            sys.exit(0)
        else:
            print("[ERROR] Build completado con errores")
            sys.exit(1)
    
    except Exception as e:
        print(f"[ERROR] Error critico: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
