#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Motor Expandido 5D v5.0
Integra sistema de índices 5D con generación de contenido de 2000+ palabras
para producir 10,000+ artículos con asociaciones n-dimensionales AMS-Risomáticas.
"""

import json
import random
from pathlib import Path
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from datetime import datetime

# Importar sistemas existentes
from index_5d_system import Index5DSystem, Index5D
from content_generator_5d import ContentGenerator5D

class ExpandedMotor5D:
    """Motor expandido 5D para generación masiva de contenido."""
    
    def __init__(self):
        self.index_system = Index5DSystem()
        self.content_generator = ContentGenerator5D()
        self.expanded_corpus = self._load_expanded_corpus_data()
        
    def _load_expanded_corpus_data(self) -> Dict[str, Any]:
        """Cargar datos expandidos del corpus para 10,000+ artículos."""
        return {
            "entidades_expandidas": [
                # Sistema digestivo (15)
                "esófago", "estómago", "duodeno", "yeyuno", "íleon", "colon", "recto", "hígado", "vesícula biliar", 
                "páncreas", "boca", "lengua", "dientes", "encías", "glándulas salivales",
                
                # Sistema respiratorio (10)
                "nariz", "senos paranasales", "faringe", "laringe", "tráquea", "bronquios", "pulmones", "pleura", "diafragma", "alvéolos",
                
                # Sistema cardiovascular (12)
                "corazón", "arterias", "venas", "capilares", "sangre", "aorta", "vena cava", "arterias coronarias", 
                "válvulas cardíacas", "pericardio", "miocardio", "sistema linfático",
                
                # Sistema nervioso (20)
                "cerebro", "cerebelo", "tronco encefálico", "médula espinal", "nervios craneales", "nervios espinales",
                "ganglios nerviosos", "nervio vago", "nervio ciático", "nervio trigémino", "nervio facial", "nervio óptico",
                "sistema nervioso autónomo", "sistema límbico", "corteza cerebral", "hipocampo", "amígdala", 
                "tálamo", "hipotálamo", "glándula pituitaria",
                
                # Sistema musculoesquelético (25)
                "huesos", "músculos", "tendones", "ligamentos", "articulaciones", "columna vertebral", "cráneo",
                "costillas", "esternón", "pelvis", "fémur", "tibia", "peroné", "húmero", "radio", "cúbito",
                "columna cervical", "columna dorsal", "columna lumbar", "sacro", "cóccix", "hombros", "codos",
                "muñecas", "manos", "rodillas", "tobillos", "pies",
                
                # Sistema endocrino (10)
                "tiroides", "paratiroides", "suprarrenales", "páncreas endocrino", "glándulas pituitaria", 
                "hipotálamo", "glándula pineal", "ovarios", "testículos", "timo",
                
                # Sistema urinario (8)
                "riñones", "uréteres", "vejiga urinaria", "uretra", "glomérulos", "túbulos renales", 
                "pelvis renal", "meato urinario",
                
                # Sistema reproductivo (10)
                "útero", "ovarios", "trompas de falopio", "vagina", "vulva", "pene", "testículos", 
                "próstata", "vesículas seminales", "conductos deferentes",
                
                # Sistema tegumentario (10)
                "piel", "pelo", "uñas", "glándulas sudoríparas", "glándulas sebáceas", "epidermis", 
                "dermis", "hipodermis", "melanocitos", "vasos sanguíneos cutáneos",
                
                # Sistema sensorial (10)
                "ojos", "oídos", "nariz", "lengua", "piel", "retina", "córnea", "cristalino", 
                "cóclea", "vestíbulo"
            ],
            
            "contextos_expandidos": [
                # Emociones básicas (10)
                "ansiedad", "estrés", "miedo", "tristeza", "ira", "alegría", "amor", "culpa", "vergüenza", "orgullo",
                
                # Estados emocionales complejos (20)
                "bloqueo", "frustración", "resentimiento", "celos", "envidia", "soledad", "aislamiento", 
                "abandono", "rechazo", "crítica", "perfeccionismo", "control", "dependencia", "codependencia",
                "apego", "desapego", "confusión", "duda", "incertidumbre", "indecisión",
                
                # Traumas y experiencias (15)
                "trauma", "abuso", "negligencia", "pérdida", "duelo", "separación", "divorcio", 
                "enfermedad", "accidente", "cirugía", "fracaso", "humillación", "traición", "engaño", "violencia",
                
                # Estrésores laborales (15)
                "estrés laboral", "burnout", "agotamiento", "presión", "deadlines", "conflictos laborales",
                "acoso laboral", "mobbing", "despido", "cambio de trabajo", "promoción", "responsabilidad",
                "competencia", "crítica profesional", "éxito profesional",
                
                # Estrésores relacionales (15)
                "conflicto familiar", "problemas de pareja", "crisis matrimonial", "infidelidad", 
                "problemas parentales", "crisis adolescente", "enfermedad familiar", "carga de cuidado",
                "conflictos con amigos", "aislamiento social", "soledad", "rechazo social", "bullying",
                "presión social", "expectativas sociales",
                
                # Estados existenciales (15)
                "crisis existencial", "búsqueda de sentido", "propósito vital", "crisis de identidad",
                "transición vital", "envejecimiento", "mortalidad", "trascendencia", "espiritualidad",
                "crisis de fe", "transformación personal", "crecimiento personal", "autoconocimiento",
                "autorealización", "plenitud",
                
                # Estados físicos-emocionales (10)
                "agotamiento físico", "fatiga crónica", "dolor crónico", "enfermedad crónica",
                "convalecencia", "recuperación", "rehabilitación", "discapacidad", "limitación física",
                "salud frágil"
            ],
            
            "especialidades_medicas": [
                "medicina general", "medicina interna", "neurologia", "psiquiatría", "psicología",
                "endocrinologia", "inmunologia", "reumatologia", "gastroenterologia", "neumonologia",
                "cardiologia", "medicina deportiva", "medicina del dolor", "medicina funcional",
                "medicina integrativa", "psicologia_somatica", "medicina_tradicional", "naturopatía",
                "homeopatía", "acupuntura", "osteopatía", "quiromasaje", "terapia fisica",
                "terapia ocupacional", "nutrición", "psicoterapia", "psicoanálisis", "terapia cognitiva"
            ]
        }
    
    def generate_expanded_corpus(self, 
                                output_dir: str = "public_expanded",
                                target_articles: int = 10000,
                                words_per_article: int = 2000) -> Dict[str, Any]:
        """Generar corpus expandido de 10,000+ artículos."""
        
        print(f"🚀 Iniciando generación de corpus expandido 5D")
        print(f"   📊 Objetivo: {target_articles:,} artículos")
        print(f"   📝 Palabras por artículo: {words_per_article:,}")
        print(f"   🎯 Total palabras objetivo: {target_articles * words_per_article:,}")
        print()
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Generar combinaciones de entidades y contextos
        entidades = self.expanded_corpus["entidades_expandidas"]
        contextos = self.expanded_corpus["contextos_expandidos"]
        especialidades = self.expanded_corpus["especialidades_medicas"]
        
        generated_articles = []
        index_registry = {}
        
        # Calcular combinaciones necesarias
        total_combinations = len(entidades) * len(contextos)
        combinations_per_entity = max(1, min(len(contextos), target_articles // len(entidades)))
        
        print(f"   📈 Entidades disponibles: {len(entidades)}")
        print(f"   🎭 Contextos disponibles: {len(contextos)}")
        print(f"   🏥 Especialidades disponibles: {len(especialidades)}")
        print(f"   🔢 Combinaciones posibles: {total_combinations:,}")
        print(f"   📋 Combinaciones por entidad: {combinations_per_entity}")
        print()
        
        article_count = 0
        
        # Generar artículos por entidad
        for entity_idx, entidad in enumerate(entidades):
            if article_count >= target_articles:
                break
                
            print(f"   📚 Procesando entidad {entity_idx + 1}/{len(entidades)}: {entidad}")
            
            # Seleccionar contextos para esta entidad
            entity_contextos = random.sample(contextos, 
                                           min(combinations_per_entity, len(contextos)))
            
            for contexto in entity_contextos:
                if article_count >= target_articles:
                    break
                
                # Generar índice 5D
                territory = self._get_territory_for_entity(entidad)
                system = self._get_system_for_entity(entidad)
                depth = hash(contexto) % 10
                frequency = self._estimate_frequency(entidad, contexto)
                complexity = min(9, territory + system + depth)
                
                index_5d = self.index_system.generate_index_5d(
                    territory=territory,
                    system=system,
                    depth=depth,
                    frequency=frequency,
                    complexity=complexity,
                    seed=f"{entidad}-{contexto}"
                )
                
                # Seleccionar especialidades para este artículo
                num_specialties = random.randint(3, 6)
                article_specialties = random.sample(especialidades, num_specialties)
                
                # Generar contenido expandido
                content_data = self.content_generator.generate_expanded_content(
                    sintoma=self._get_sintoma_for_entity(entidad),
                    sistema=entidad,
                    contexto_emocional=contexto,
                    specialties=article_specialties,
                    target_words=words_per_article
                )
                
                # Crear estructura del artículo
                article = {
                    "index_5d": {
                        "primary": index_5d.primary,
                        "dimensions": index_5d.dimensions,
                        "ams_risoma": index_5d.ams_risoma,
                        "entropy": index_5d.entropy,
                        "connections": list(index_5d.connections)
                    },
                    "metadata": {
                        "entidad": entidad,
                        "contexto": contexto,
                        "especialidades": article_specialties,
                        "word_count": content_data["word_count"],
                        "generated_at": content_data["generated_at"],
                        "territory": territory,
                        "system": system,
                        "depth": depth,
                        "frequency": frequency,
                        "complexity": complexity
                    },
                    "content": content_data["content"],
                    "sections": content_data["sections"]
                }
                
                # Guardar artículo individual
                article_filename = f"{index_5d.primary.replace('SINTO-', '')}.json"
                article_path = output_path / "articles" / article_filename
                article_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(article_path, 'w', encoding='utf-8') as f:
                    json.dump(article, f, indent=2, ensure_ascii=False)
                
                generated_articles.append(article)
                index_registry[index_5d.primary] = index_5d
                article_count += 1
                
                # Progreso
                if article_count % 100 == 0:
                    progress = (article_count / target_articles) * 100
                    print(f"      ✅ {article_count:,}/{target_articles:,} artículos ({progress:.1f}%)")
        
        # Generar índice maestro
        master_index = {
            "metadata": {
                "system": "SINTOMARIO.ORG Expanded 5D v5.0",
                "generated_at": datetime.now().isoformat(),
                "total_articles": len(generated_articles),
                "target_articles": target_articles,
                "words_per_article": words_per_article,
                "total_words": sum(a["metadata"]["word_count"] for a in generated_articles),
                "entities_used": len(set(a["metadata"]["entidad"] for a in generated_articles)),
                "contexts_used": len(set(a["metadata"]["contexto"] for a in generated_articles)),
                "specialties_used": len(set(s for a in generated_articles for s in a["metadata"]["especialidades"]))
            },
            "statistics": {
                "territory_distribution": self._calculate_distribution(generated_articles, "territory"),
                "system_distribution": self._calculate_distribution(generated_articles, "system"),
                "depth_distribution": self._calculate_distribution(generated_articles, "depth"),
                "frequency_distribution": self._calculate_distribution(generated_articles, "frequency"),
                "complexity_distribution": self._calculate_distribution(generated_articles, "complexity"),
                "ams_risoma_distribution": self._calculate_ams_distribution(generated_articles),
                "word_count_stats": self._calculate_word_stats(generated_articles)
            },
            "articles_index": [
                {
                    "index": article["index_5d"]["primary"],
                    "entidad": article["metadata"]["entidad"],
                    "contexto": article["metadata"]["contexto"],
                    "word_count": article["metadata"]["word_count"],
                    "ams_risoma": article["index_5d"]["ams_risoma"],
                    "territory": article["metadata"]["territory"],
                    "complexity": article["metadata"]["complexity"]
                }
                for article in generated_articles
            ]
        }
        
        # Guardar índice maestro
        with open(output_path / "master_index.json", 'w', encoding='utf-8') as f:
            json.dump(master_index, f, indent=2, ensure_ascii=False)
        
        # Exportar registro de índices 5D
        self.index_system.index_registry = index_registry
        self.index_system.export_index_registry(str(output_path / "indices_5d.json"))
        
        # Resumen final
        total_words = master_index["metadata"]["total_words"]
        avg_words = total_words / len(generated_articles) if generated_articles else 0
        
        print()
        print("🎉 GENERACIÓN COMPLETADA")
        print("=" * 60)
        print(f"   📚 Artículos generados: {len(generated_articles):,}")
        print(f"   📝 Total palabras: {total_words:,}")
        print(f"   📊 Promedio palabras/artículo: {avg_words:.0f}")
        print(f"   🎯 Porcentaje del objetivo: {(len(generated_articles)/target_articles)*100:.1f}%")
        print(f"   📁 Directorio de salida: {output_path}")
        print(f"   📋 Índice maestro: {output_path}/master_index.json")
        print(f"   🔢 Índices 5D: {output_path}/indices_5d.json")
        print(f"   📂 Artículos: {output_path}/articles/")
        print("=" * 60)
        
        return master_index
    
    def _get_territory_for_entity(self, entidad: str) -> int:
        """Mapear entidad a territorio (0-4)."""
        territory_map = {
            # Sistema digestivo -> cuerpo (0)
            "esófago": 0, "estómago": 0, "duodeno": 0, "yeyuno": 0, "íleon": 0, "colon": 0, "recto": 0,
            "hígado": 0, "vesícula biliar": 0, "páncreas": 0, "boca": 0, "lengua": 0, "dientes": 0,
            "encías": 0, "glándulas salivales": 0,
            
            # Sistema cardiovascular -> cuerpo (0)
            "corazón": 0, "arterias": 0, "venas": 0, "capilares": 0, "sangre": 0, "aorta": 0,
            "vena cava": 0, "arterias coronarias": 0, "válvulas cardíacas": 0, "pericardio": 0,
            "miocardio": 0, "sistema linfático": 0,
            
            # Sistema musculoesquelético -> cuerpo (0)
            "huesos": 0, "músculos": 0, "tendones": 0, "ligamentos": 0, "articulaciones": 0,
            "columna vertebral": 0, "cráneo": 0, "costillas": 0, "esternón": 0, "pelvis": 0,
            "fémur": 0, "tibia": 0, "peroné": 0, "húmero": 0, "radio": 0, "cúbito": 0,
            "columna cervical": 0, "columna dorsal": 0, "columna lumbar": 0, "sacro": 0,
            "cóccix": 0, "hombros": 0, "codos": 0, "muñecas": 0, "manos": 0, "rodillas": 0,
            "tobillos": 0, "pies": 0,
            
            # Sistema respiratorio -> cuerpo (0)
            "nariz": 0, "senos paranasales": 0, "faringe": 0, "laringe": 0, "tráquea": 0,
            "bronquios": 0, "pulmones": 0, "pleura": 0, "diafragma": 0, "alvéolos": 0,
            
            # Sistema urinario -> cuerpo (0)
            "riñones": 0, "uréteres": 0, "vejiga urinaria": 0, "uretra": 0, "glomérulos": 0,
            "túbulos renales": 0, "pelvis renal": 0, "meato urinario": 0,
            
            # Sistema reproductivo -> cuerpo (0)
            "útero": 0, "ovarios": 0, "trompas de falopio": 0, "vagina": 0, "vulva": 0, "pene": 0,
            "testículos": 0, "próstata": 0, "vesículas seminales": 0, "conductos deferentes": 0,
            
            # Sistema tegumentario -> cuerpo (0)
            "piel": 0, "pelo": 0, "uñas": 0, "glándulas sudoríparas": 0, "glándulas sebáceas": 0,
            "epidermis": 0, "dermis": 0, "hipodermis": 0, "melanocitos": 0, "vasos sanguíneos cutáneos": 0,
            
            # Sistema sensorial -> cuerpo (0)
            "ojos": 0, "oídos": 0, "nariz": 0, "lengua": 0, "piel": 0, "retina": 0, "córnea": 0,
            "cristalino": 0, "cóclea": 0, "vestíbulo": 0,
            
            # Sistema nervioso -> mente (1)
            "cerebro": 1, "cerebelo": 1, "tronco encefálico": 1, "médula espinal": 1,
            "nervios craneales": 1, "nervios espinales": 1, "ganglios nerviosos": 1,
            "nervio vago": 1, "nervio ciático": 1, "nervio trigémino": 1, "nervio facial": 1,
            "nervio óptico": 1, "sistema nervioso autónomo": 1, "sistema límbico": 1,
            "corteza cerebral": 1, "hipocampo": 1, "amígdala": 1, "tálamo": 1, "hipotálamo": 1,
            "glándula pituitaria": 1,
            
            # Sistema endocrino -> espiritu (2)
            "tiroides": 2, "paratiroides": 2, "suprarrenales": 2, "páncreas endocrino": 2,
            "glándulas pituitaria": 2, "hipotálamo": 2, "glándula pineal": 2, "ovarios": 2,
            "testículos": 2, "timo": 2
        }
        
        return territory_map.get(entidad, random.randint(0, 4))
    
    def _get_system_for_entity(self, entidad: str) -> int:
        """Mapear entidad a sistema (0-9)."""
        system_map = {
            # Digestivo
            "esófago": 0, "estómago": 0, "duodeno": 0, "yeyuno": 0, "íleon": 0, "colon": 0, "recto": 0,
            "hígado": 1, "vesícula biliar": 1, "páncreas": 2, "boca": 3, "lengua": 3, "dientes": 3,
            "encías": 3, "glándulas salivales": 3,
            
            # Respiratorio
            "nariz": 4, "senos paranasales": 4, "faringe": 5, "laringe": 5, "tráquea": 5,
            "bronquios": 5, "pulmones": 6, "pleura": 6, "diafragma": 6, "alvéolos": 6,
            
            # Cardiovascular
            "corazón": 7, "arterias": 7, "venas": 7, "capilares": 7, "sangre": 7, "aorta": 7,
            "vena cava": 7, "arterias coronarias": 7, "válvulas cardíacas": 7, "pericardio": 7,
            "miocardio": 7, "sistema linfático": 8,
            
            # Nervioso
            "cerebro": 9, "cerebelo": 9, "tronco encefálico": 9, "médula espinal": 9,
            "nervios craneales": 9, "nervios espinales": 9, "ganglios nerviosos": 9,
            "nervio vago": 9, "nervio ciático": 9, "nervio trigémino": 9, "nervio facial": 9,
            "nervio óptico": 9, "sistema nervioso autónomo": 9, "sistema límbico": 9,
            "corteza cerebral": 9, "hipocampo": 9, "amígdala": 9, "tálamo": 9, "hipotálamo": 9,
            "glándula pituitaria": 9,
            
            # Musculoesquelético
            "huesos": 0, "músculos": 1, "tendones": 1, "ligamentos": 1, "articulaciones": 1,
            "columna vertebral": 2, "cráneo": 2, "costillas": 2, "esternón": 2, "pelvis": 2,
            "fémur": 3, "tibia": 3, "peroné": 3, "húmero": 3, "radio": 3, "cúbito": 3,
            "columna cervical": 2, "columna dorsal": 2, "columna lumbar": 2, "sacro": 2,
            "cóccix": 2, "hombros": 1, "codos": 1, "muñecas": 1, "manos": 1, "rodillas": 1,
            "tobillos": 1, "pies": 1,
            
            # Endocrino
            "tiroides": 4, "paratiroides": 4, "suprarrenales": 5, "páncreas endocrino": 2,
            "glándulas pituitaria": 6, "hipotálamo": 6, "glándula pineal": 7, "ovarios": 8,
            "testículos": 8, "timo": 9,
            
            # Urinario
            "riñones": 0, "uréteres": 0, "vejiga urinaria": 0, "uretra": 0, "glomérulos": 0,
            "túbulos renales": 0, "pelvis renal": 0, "meato urinario": 0,
            
            # Reproductivo
            "útero": 1, "ovarios": 2, "trompas de falopio": 2, "vagina": 3, "vulva": 3, "pene": 4,
            "testículos": 5, "próstata": 5, "vesículas seminales": 5, "conductos deferentes": 5,
            
            # Tegumentario
            "piel": 0, "pelo": 0, "uñas": 0, "glándulas sudoríparas": 1, "glándulas sebáceas": 1,
            "epidermis": 0, "dermis": 0, "hipodermis": 0, "melanocitos": 0, "vasos sanguíneos cutáneos": 2,
            
            # Sensorial
            "ojos": 3, "oídos": 4, "nariz": 5, "lengua": 6, "piel": 0, "retina": 3, "córnea": 3,
            "cristalino": 3, "cóclea": 4, "vestíbulo": 4
        }
        
        return system_map.get(entidad, random.randint(0, 9))
    
    def _get_sintoma_for_entity(self, entidad: str) -> str:
        """Generar síntoma específico para entidad."""
        sintomas_map = {
            "cabeza": "cefalea tensional", "cerebro": "dificultad de concentración", "corazón": "palpitaciones",
            "estómago": "gastritis", "hígado": "dolor hepático", "pulmones": "disnea", "columna vertebral": "dolor lumbar",
            "músculos": "tensión muscular", "piel": "erupciones cutáneas", "ojos": "fatiga visual"
        }
        
        return sintomas_map.get(entidad, f"sintoma en {entidad}")
    
    def _estimate_frequency(self, entidad: str, contexto: str) -> int:
        """Estimar frecuencia de búsqueda (0-9)."""
        # Frecuencias base por entidad
        entity_freq = {
            "cabeza": 9, "cerebro": 8, "corazón": 9, "estómago": 8, "hígado": 6, "pulmones": 7,
            "columna vertebral": 9, "músculos": 8, "piel": 7, "ojos": 6
        }
        
        # Frecuencias base por contexto
        context_freq = {
            "ansiedad": 9, "estrés": 9, "dolor": 9, "miedo": 8, "tristeza": 8, "ira": 7,
            "burnout": 7, "trauma": 6, "crisis": 6, "fatiga": 7, "cansancio": 7
        }
        
        base_freq = entity_freq.get(entidad, 5) + context_freq.get(contexto.split()[0], 5)
        return min(9, max(1, base_freq // 2))
    
    def _calculate_distribution(self, articles: List[Dict], field: str) -> Dict[int, int]:
        """Calcular distribución de valores."""
        distribution = {}
        for article in articles:
            value = article["metadata"].get(field, 0)
            distribution[value] = distribution.get(value, 0) + 1
        return distribution
    
    def _calculate_ams_distribution(self, articles: List[Dict]) -> Dict[str, int]:
        """Calcular distribución AMS-Risomática."""
        distribution = {}
        for article in articles:
            ams = article["index_5d"].get("ams_risoma", "")
            prefix = ams.split("-")[0] if "-" in ams else ams
            distribution[prefix] = distribution.get(prefix, 0) + 1
        return distribution
    
    def _calculate_word_stats(self, articles: List[Dict]) -> Dict[str, float]:
        """Calcular estadísticas de palabras."""
        word_counts = [a["metadata"]["word_count"] for a in articles]
        if not word_counts:
            return {}
        
        return {
            "min": min(word_counts),
            "max": max(word_counts),
            "avg": sum(word_counts) / len(word_counts),
            "median": sorted(word_counts)[len(word_counts) // 2]
        }

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Motor Expandido 5D v5.0")
    parser.add_argument("--generate", action="store_true", help="Generar corpus expandido")
    parser.add_argument("--articles", type=int, default=10000, help="Número de artículos objetivo")
    parser.add_argument("--words", type=int, default=2000, help="Palabras por artículo")
    parser.add_argument("--output", default="public_expanded", help="Directorio de salida")
    
    args = parser.parse_args()
    
    if args.generate:
        motor = ExpandedMotor5D()
        motor.generate_expanded_corpus(
            output_dir=args.output,
            target_articles=args.articles,
            words_per_article=args.words
        )
    else:
        print("🚀 Motor Expandido 5D v5.0 - SINTOMARIO.ORG")
        print("   --generate : Generar corpus expandido")
        print("   --articles : Número de artículos (default: 10000)")
        print("   --words    : Palabras por artículo (default: 2000)")
        print("   --output   : Directorio de salida (default: public_expanded)")

if __name__ == "__main__":
    main()
