#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Sistema de Índices 5D (5X XXXXX)
Sistema de indexación multidimensional para 10,000+ artículos con 2000+ palabras.
Implementa asociaciones n-dimensionales ams-risomáticas.
"""

import hashlib
import random
import math
from typing import Dict, List, Any, Tuple, Set
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Index5D:
    """Índice 5-dimensional para artículos."""
    primary: str      # SINTO-XXXXX (5 dígitos)
    dimensions: Dict[str, int]  # Coordenadas dimensionales
    connections: Set[str]  # Conexiones a otros índices
    ams_risoma: str   # Código AMS-Risomático
    entropy: float     # Entropía para diversidad
    timestamp: str    # Timestamp de generación

class Index5DSystem:
    """Sistema de indexación 5D con asociaciones multidimensionales."""
    
    def __init__(self):
        self.dimensions = [
            "territorio",      # 0-4 (cuerpo, mente, espiritu, social, ambiental)
            "sistema",        # 0-9 (organicos, energeticos, emocionales, etc.)
            "profundidad",     # 0-9 (superficial a profundo)
            "frecuencia",      # 0-9 (raro a comun)
            "complejidad"      # 0-9 (simple a complejo)
        ]
        
        self.ams_risoma_matrix = self._generate_ams_risoma_matrix()
        self.index_registry: Dict[str, Index5D] = {}
        self.connection_graph: Dict[str, Set[str]] = {}
        
    def _generate_ams_risoma_matrix(self) -> Dict[str, str]:
        """Generar matriz AMS-Risomática de asociaciones."""
        # AMS = Asociación Multidimensional Semántica
        # Risoma = Red de Índices Semánticos Orgánicos Matemáticos
        
        # Códigos base AMS-Risomáticos
        base_codes = {
            "A": "Anatómico", "M": "Metafísico", "S": "Simbólico",
            "R": "Relacional", "I": "Intuitivo", "S": "Sistémico",
            "O": "Ontológico", "M": "Mítico", "A": "Arquetípico"
        }
        
        # Matriz de combinaciones (9x9 = 81 posibles)
        matrix = {}
        combinations = ["AMS", "RIS", "OMA", "SOM", "ARI", "MAS", "ISO", "RAM", "SMA"]
        
        for i, combo in enumerate(combinations):
            for j in range(1, 10):
                code = f"{combo}-{j:02d}"
                matrix[code] = f"{combo[:3]}-{j:02d}: {self._get_ams_description(combo, j)}"
        
        return matrix
    
    def _get_ams_description(self, combo: str, number: int) -> str:
        """Obtener descripción de código AMS-Risomático."""
        descriptions = {
            "AMS": f"Asociación Mente-Somatización nivel {number}",
            "RIS": f"Red Interconexión Simbólica nivel {number}",
            "OMA": f"Ontología Matemática Arquetípica nivel {number}",
            "SOM": f"Sistema Orgánico Matemático nivel {number}",
            "ARI": f"Arquetipo Relacional Intuitivo nivel {number}",
            "MAS": f"Matriz Afectiva Simbólica nivel {number}",
            "ISO": f"Índice Simbólico Ontológico nivel {number}",
            "RAM": f"Red Afectiva Matemática nivel {number}",
            "SMA": f"Sistema Matemático Arquetípico nivel {number}"
        }
        return descriptions.get(combo, f"Código AMS-Risomático {combo}-{number:02d}")
    
    def generate_index_5d(self, 
                          territory: int, 
                          system: int, 
                          depth: int, 
                          frequency: int, 
                          complexity: int,
                          seed: str = None) -> Index5D:
        """Generar índice 5D con entropía controlada."""
        
        # Validar rangos
        territory = max(0, min(4, territory))
        system = max(0, min(9, system))
        depth = max(0, min(9, depth))
        frequency = max(0, min(9, frequency))
        complexity = max(0, min(9, complexity))
        
        # Generar seed para reproducibilidad
        if seed is None:
            seed = f"{territory}{system}{depth}{frequency}{complexity}"
        
        # Calcular índice primario con hash
        hash_obj = hashlib.sha256(seed.encode())
        hash_int = int(hash_obj.hexdigest(), 16)
        
        # Mapear a 5 dígitos (00000-99999)
        primary_num = hash_int % 100000
        primary = f"SINTO-{primary_num:05d}"
        
        # Calcular entropía para diversidad
        entropy = self._calculate_entropy([territory, system, depth, frequency, complexity])
        
        # Seleccionar código AMS-Risomático basado en dimensionalidad
        ams_code = self._select_ams_risoma(territory, system, depth, complexity)
        
        # Generar coordenadas dimensionales
        dimensions = {
            "territorio": territory,
            "sistema": system,
            "profundidad": depth,
            "frecuencia": frequency,
            "complejidad": complexity
        }
        
        # Generar conexiones iniciales
        connections = self._generate_connections(primary_num, dimensions)
        
        return Index5D(
            primary=primary,
            dimensions=dimensions,
            connections=connections,
            ams_risoma=ams_code,
            entropy=entropy,
            timestamp=datetime.now().isoformat()
        )
    
    def _calculate_entropy(self, values: List[int]) -> float:
        """Calcular entropía de Shannon para diversidad."""
        # Normalizar valores a probabilidades
        total = sum(values)
        if total == 0:
            return 0.0
        
        probabilities = [v/total for v in values if v > 0]
        entropy = -sum(p * math.log2(p) for p in probabilities)
        return round(entropy, 4)
    
    def _select_ams_risoma(self, territory: int, system: int, depth: int, complexity: int) -> str:
        """Seleccionar código AMS-Risomático basado en dimensionalidad."""
        # Mapeo de dimensionalidad a códigos AMS
        territory_map = ["AMS", "RIS", "OMA", "SOM", "ARI"]
        system_map = ["MAS", "ISO", "RAM", "SMA", "AMS", "RIS", "OMA", "SOM", "ARI", "MAS"]
        
        base_code = territory_map[territory]
        modifier = (system + depth + complexity) % 9 + 1
        
        return f"{base_code}-{modifier:02d}"
    
    def _generate_connections(self, primary_num: int, dimensions: Dict[str, int]) -> Set[str]:
        """Generar conexiones multidimensionales."""
        connections = set()
        
        # Conexiones por dimensionalidad cercana
        for dim, value in dimensions.items():
            # Conectar con valores ±1 en cada dimensión
            for delta in [-1, 1]:
                new_value = value + delta
                if 0 <= new_value <= 9:  # Validar rango
                    # Generar hash para conexión
                    conn_seed = f"{primary_num}{dim}{new_value}"
                    conn_hash = hashlib.sha256(conn_seed.encode())
                    conn_num = int(conn_hash.hexdigest(), 16) % 100000
                    connections.add(f"SINTO-{conn_num:05d}")
        
        # Conexiones AMS-Risomáticas
        ams_connections = self._generate_ams_connections(dimensions)
        connections.update(ams_connections)
        
        return connections
    
    def _generate_ams_connections(self, dimensions: Dict[str, int]) -> Set[str]:
        """Generar conexiones basadas en AMS-Risoma."""
        connections = set()
        
        # Conexiones basadas en patrones AMS
        territory = dimensions["territorio"]
        complexity = dimensions["complejidad"]
        depth = dimensions["profundidad"]
        
        # Patrones de conexión AMS
        if territory == 0 and complexity >= 7:  # Cuerpo + Alta complejidad
            # Conectar con códigos AMS de alto nivel
            for i in range(7, 10):
                conn_seed = f"AMS-{i:02d}-{territory}{complexity}"
                conn_hash = hashlib.sha256(conn_seed.encode())
                conn_num = int(conn_hash.hexdigest(), 16) % 100000
                connections.add(f"SINTO-{conn_num:05d}")
        
        elif territory == 1 and depth >= 6:  # Mente + Profundidad
            # Conectar con códigos RIS de mediana profundidad
            for i in range(4, 8):
                conn_seed = f"RIS-{i:02d}-{territory}{depth}"
                conn_hash = hashlib.sha256(conn_seed.encode())
                conn_num = int(conn_hash.hexdigest(), 16) % 100000
                connections.add(f"SINTO-{conn_num:05d}")
        
        return connections
    
    def generate_corpus_indices(self, 
                             territories: List[str], 
                             systems: List[str], 
                             contexts: List[str]) -> Dict[str, Index5D]:
        """Generar índices para corpus expandido."""
        indices = {}
        
        # Mapeo de territories a dimensiones
        territory_map = {
            "cuerpo": 0, "mente": 1, "espiritu": 2, "social": 3, "ambiental": 4
        }
        
        # Mapeo de sistemas a dimensiones
        system_map = {
            "digestivo": 0, "respiratorio": 1, "nervioso": 2, "cardiovascular": 3,
            "muscular": 4, "esqueletico": 5, "endocrino": 6, "renal": 7,
            "hepatico": 8, "visual": 9, "auditivo": 0, "inmunologico": 1,
            "reproductivo": 2, "linfatico": 3, "tegumentario": 4
        }
        
        # Generar índices para todas las combinaciones
        for territory in territories:
            for system in systems:
                for context in contexts:
                    # Calcular dimensionalidad
                    territory_dim = territory_map.get(territory, 0)
                    system_dim = system_map.get(system, 0)
                    
                    # Profundidad basada en contexto
                    depth = hash(context) % 10
                    
                    # Frecuencia basada en popularidad estimada
                    frequency = self._estimate_frequency(territory, system, context)
                    
                    # Complejidad basada en dimensionalidad combinada
                    complexity = min(9, territory_dim + system_dim + depth)
                    
                    # Generar seed única
                    seed = f"{territory}-{system}-{context}"
                    
                    # Generar índice
                    index = self.generate_index_5d(
                        territory=territory_dim,
                        system=system_dim,
                        depth=depth,
                        frequency=frequency,
                        complexity=complexity,
                        seed=seed
                    )
                    
                    # Guardar con clave compuesta
                    key = f"{territory}/{system}/{context}"
                    indices[key] = index
        
        return indices
    
    def _estimate_frequency(self, territory: str, system: str, context: str) -> int:
        """Estimar frecuencia de búsqueda (0-9)."""
        # Frecuencias base por territorio
        territory_freq = {
            "cuerpo": 8, "mente": 7, "espiritu": 3, "social": 5, "ambiental": 2
        }
        
        # Frecuencias base por sistema
        system_freq = {
            "digestivo": 7, "respiratorio": 6, "nervioso": 9, "cardiovascular": 8,
            "muscular": 7, "esqueletico": 5, "endocrino": 6, "renal": 4,
            "hepatico": 5, "visual": 7, "auditivo": 5
        }
        
        # Frecuencias base por contexto
        context_freq = {
            "ansiedad": 9, "estrés": 9, "bloqueo": 8, "frustracion": 7,
            "tristeza": 8, "ira": 7, "miedo": 8, "culpa": 6,
            "verguenza": 5, "soledad": 6, "inseguridad": 7, "agotamiento": 7,
            "confusion": 6, "desesperanza": 4, "resentimiento": 5, "celos": 4,
            "impotencia": 5, "traicion": 3, "apego": 6, "dependencia": 5
        }
        
        # Calcular frecuencia combinada
        base_freq = (
            territory_freq.get(territory, 5) +
            system_freq.get(system, 5) +
            context_freq.get(context, 5)
        ) / 3
        
        return min(9, max(1, int(base_freq)))
    
    def get_related_indices(self, primary_index: str, max_connections: int = 10) -> List[str]:
        """Obtener índices relacionados por dimensionalidad."""
        if primary_index not in self.index_registry:
            return []
        
        index = self.index_registry[primary_index]
        
        # Ordenar conexiones por similitud dimensional
        related = list(index.connections)
        
        # Calcular similitud dimensional si es necesario
        related_with_similarity = []
        for related_index in related:
            if related_index in self.index_registry:
                similarity = self._calculate_dimensional_similarity(index, self.index_registry[related_index])
                related_with_similarity.append((related_index, similarity))
        
        # Ordenar por similitud y limitar
        related_with_similarity.sort(key=lambda x: x[1], reverse=True)
        
        return [idx for idx, _ in related_with_similarity[:max_connections]]
    
    def _calculate_dimensional_similarity(self, index1: Index5D, index2: Index5D) -> float:
        """Calcular similitud entre dos índices dimensionales."""
        similarity = 0
        for dim in self.dimensions:
            diff = abs(index1.dimensions.get(dim, 0) - index2.dimensions.get(dim, 0))
            similarity += (9 - diff) / 9  # Normalizar a 0-1
        
        return similarity / len(self.dimensions)
    
    def export_index_registry(self, output_path: str = "corpus/indices_5d.json"):
        """Exportar registro de índices a JSON."""
        import json
        
        # Convertir a formato serializable
        export_data = {
            "metadata": {
                "system": "SINTOMARIO.ORG Index5D",
                "version": "5.0",
                "description": "Sistema de indexación 5D con asociaciones AMS-Risomáticas",
                "generated_at": datetime.now().isoformat(),
                "total_indices": len(self.index_registry)
            },
            "dimensions": self.dimensions,
            "ams_risoma_matrix": self.ams_risoma_matrix,
            "indices": {}
        }
        
        # Convertir índices a formato JSON
        for key, index in self.index_registry.items():
            export_data["indices"][key] = {
                "primary": index.primary,
                "dimensions": index.dimensions,
                "connections": list(index.connections),
                "ams_risoma": index.ams_risoma,
                "entropy": index.entropy,
                "timestamp": index.timestamp
            }
        
        # Guardar
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Registro de índices 5D exportado: {output_path}")
        return export_data

def main():
    """Función principal para demostración."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Sistema de Índices 5D")
    parser.add_argument("--generate", action="store_true", help="Generar índices de ejemplo")
    parser.add_argument("--export", action="store_true", help="Exportar registro de índices")
    parser.add_argument("--test", action="store_true", help="Probar sistema de índices")
    
    args = parser.parse_args()
    
    system = Index5DSystem()
    
    if args.generate or args.test:
        print("🔢 Generando índices 5D de ejemplo...")
        
        # Generar índices de ejemplo
        example_indices = [
            system.generate_index_5d(0, 2, 5, 8, 7, "cuerpo-nervioso-ansiedad"),
            system.generate_index_5d(1, 4, 7, 6, 8, "mente-muscular-frustracion"),
            system.generate_index_5d(2, 6, 9, 3, 9, "espiritu-endocrino-tristeza"),
            system.generate_index_5d(3, 1, 4, 7, 5, "social-respiratorio-miedo"),
            system.generate_index_5d(4, 8, 2, 4, 6, "ambiental-hepatico-culpa")
        ]
        
        for idx in example_indices:
            system.index_registry[idx.primary] = idx
            print(f"   {idx.primary} - AMS: {idx.ams_risoma} - Entropía: {idx.entropy}")
            print(f"   Dimensiones: {idx.dimensions}")
            print(f"   Conexiones: {len(idx.connections)}")
            print()
    
    if args.export:
        # Generar corpus expandido de ejemplo
        territories = ["cuerpo", "mente", "espiritu", "social", "ambiental"]
        systems = ["digestivo", "respiratorio", "nervioso", "cardiovascular", "muscular"]
        contexts = ["ansiedad", "estrés", "bloqueo", "frustracion", "tristeza"]
        
        indices = system.generate_corpus_indices(territories, systems, contexts)
        system.index_registry.update(indices)
        
        # Exportar
        system.export_index_registry()
    
    if not any([args.generate, args.export, args.test]):
        print("🔢 Sistema de Índices 5D - SINTOMARIO.ORG")
        print("   --generate  : Generar índices de ejemplo")
        print("   --export    : Exportar registro completo")
        print("   --test      : Probar sistema")

if __name__ == "__main__":
    main()
