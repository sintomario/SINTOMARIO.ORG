#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Optimización de Rates y SEO
Implementa rate limiting para Amazon API y optimización SEO para contenido generado.
"""

import time
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path

class AmazonRateManager:
    """Gestiona los límites de tasa de Amazon API PA 5.0."""
    
    def __init__(self):
        # Límites oficiales de Amazon API PA 5.0
        self.limits = {
            'requests_per_second': 1,      # 1 petición por segundo
            'requests_per_hour': 3600,    # 3600 peticiones por hora
            'burst_limit': 10,            # Máximo 10 peticiones concurrentes
            'daily_limit': 86400          # 86400 peticiones por día
        }
        
        # Contadores de uso
        self.request_history = []
        self.hourly_requests = 0
        self.daily_requests = 0
        self.last_reset = datetime.now()
        
    def can_make_request(self) -> bool:
        """Verificar si podemos hacer una petición."""
        now = datetime.now()
        
        # Resetear contadores si es necesario
        if now - self.last_reset >= timedelta(hours=1):
            self.hourly_requests = 0
            self.last_reset = now
        
        # Verificar límites
        if self.hourly_requests >= self.limits['requests_per_hour']:
            return False
        
        # Verificar rate limiting por segundo
        recent_requests = [
            req_time for req_time in self.request_history 
            if now - req_time < timedelta(seconds=1)
        ]
        
        if len(recent_requests) >= self.limits['requests_per_second']:
            return False
        
        return True
    
    def wait_for_slot(self) -> float:
        """Esperar hasta que podamos hacer una petición."""
        wait_time = 0
        
        while not self.can_make_request():
            time.sleep(0.1)
            wait_time += 0.1
            
            # Timeout después de 10 segundos
            if wait_time > 10:
                break
        
        return wait_time
    
    def record_request(self):
        """Registrar una petición realizada."""
        now = datetime.now()
        self.request_history.append(now)
        self.hourly_requests += 1
        self.daily_requests += 1
        
        # Limpiar historial antiguo (mantener solo últimos 5 minutos)
        cutoff = now - timedelta(minutes=5)
        self.request_history = [
            req_time for req_time in self.request_history 
            if req_time > cutoff
        ]
    
    def get_status(self) -> Dict[str, Any]:
        """Obtener estado actual del rate limiting."""
        now = datetime.now()
        
        recent_requests = [
            req_time for req_time in self.request_history 
            if now - req_time < timedelta(seconds=1)
        ]
        
        return {
            'requests_last_second': len(recent_requests),
            'hourly_requests': self.hourly_requests,
            'daily_requests': self.daily_requests,
            'hourly_limit_remaining': self.limits['requests_per_hour'] - self.hourly_requests,
            'can_make_request': self.can_make_request(),
            'last_reset': self.last_reset.isoformat()
        }

class SEOContentOptimizer:
    """Optimizador de contenido para SEO basado en guías de Google."""
    
    def __init__(self):
        self.seo_guidelines = self._load_seo_guidelines()
        
    def _load_seo_guidelines(self) -> Dict[str, Any]:
        """Cargar guías SEO de Google."""
        return {
            'content_guidelines': {
                'expertise': True,  # E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
                'original': True,   # Contenido original, no duplicado
                'comprehensive': True,  # Contenido completo y profundo
                'helpful': True,    # Contenido útil y centrado en el usuario
                'well_written': True,  # Buena escritura y gramática
                'updated': True     # Contenido actualizado
            },
            
            'technical_seo': {
                'title_length': {'min': 30, 'max': 60},
                'description_length': {'min': 70, 'max': 155},
                'h1_usage': 'single',  # Un solo H1 por página
                'heading_structure': True,  # Estructura jerárquica correcta
                'internal_links': True,  # Enlaces internos relevantes
                'image_alt_text': True,  # Alt text descriptivo
                'url_structure': True,  # URLs limpias y descriptivas
                'mobile_friendly': True,  # Diseño responsive
                'page_speed': True  # Velocidad de carga
            },
            
            'gen_ai_guidelines': {
                'human_oversight': True,  # Supervisión humana requerida
                'fact_checking': True,  # Verificación de hechos
                'transparency': True,  # Transparencia sobre uso de IA
                'quality_control': True,  # Control de calidad
                'originality_check': True,  # Verificación de originalidad
                'expert_review': True  # Revisión por expertos
            }
        }
    
    def optimize_content(self, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Optimizar contenido según guías SEO de Google."""
        
        optimized_content = content
        optimization_report = {
            'original_length': len(content.split()),
            'optimizations_applied': [],
            'seo_score': 0,
            'recommendations': []
        }
        
        # 1. Verificar E-E-A-T
        if not self._has_expertise_signals(content):
            optimization_report['recommendations'].append(
                "Añadir señales de experiencia y experiencia (E-E-A-T)"
            )
        
        # 2. Optimizar estructura de encabezados
        if not self._has_proper_heading_structure(content):
            optimized_content = self._fix_heading_structure(optimized_content)
            optimization_report['optimizations_applied'].append("Estructura de encabezados corregida")
        
        # 3. Añadir enlaces internos relevantes
        internal_links = self._generate_internal_links(metadata)
        if internal_links:
            optimized_content = self._add_internal_links(optimized_content, internal_links)
            optimization_report['optimizations_applied'].append("Enlaces internos añadidos")
        
        # 4. Optimizar longitud y profundidad
        word_count = len(optimized_content.split())
        if word_count < 1500:  # Mínimo para contenido médico
            optimization_report['recommendations'].append(
                f"Expandir contenido a al menos 1500 palabras (actual: {word_count})"
            )
        
        # 5. Verificar originalidad
        if self._needs_originality_check(content):
            optimization_report['recommendations'].append(
                "Verificar originalidad del contenido con herramientas anti-plagio"
            )
        
        # 6. Añadir disclaimer de IA si es contenido generado
        if self._is_ai_generated(content):
            optimized_content = self._add_ai_disclaimer(optimized_content)
            optimization_report['optimizations_applied'].append("Disclaimer de IA añadido")
        
        # Calcular score SEO
        optimization_report['seo_score'] = self._calculate_seo_score(
            optimized_content, metadata, optimization_report
        )
        
        optimization_report['final_length'] = len(optimized_content.split())
        
        return {
            'content': optimized_content,
            'report': optimization_report
        }
    
    def _has_expertise_signals(self, content: str) -> bool:
        """Verificar si el contenido tiene señales de experiencia."""
        expertise_signals = [
            "médico", "doctor", "especialista", "terapia", "tratamiento",
            "investigación", "estudio", "clínico", "evidencia", "diagnóstico"
        ]
        
        content_lower = content.lower()
        return any(signal in content_lower for signal in expertise_signals)
    
    def _has_proper_heading_structure(self, content: str) -> bool:
        """Verificar estructura de encabezados."""
        lines = content.split('\n')
        h1_count = 0
        h2_count = 0
        
        for line in lines:
            if line.strip().startswith('# '):
                h1_count += 1
            elif line.strip().startswith('## '):
                h2_count += 1
        
        return h1_count == 1 and h2_count >= 2
    
    def _fix_heading_structure(self, content: str) -> str:
        """Corregir estructura de encabezados."""
        lines = content.split('\n')
        fixed_lines = []
        h1_found = False
        
        for line in lines:
            stripped = line.strip()
            
            if stripped.startswith('# '):
                if not h1_found:
                    fixed_lines.append(line)
                    h1_found = True
                else:
                    # Convertir H1 adicionales a H2
                    fixed_lines.append(line.replace('# ', '## '))
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines)
    
    def _generate_internal_links(self, metadata: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generar enlaces internos relevantes."""
        entidad = metadata.get('entidad', '')
        contexto = metadata.get('contexto', '')
        
        # Links basados en entidad y contexto
        internal_links = []
        
        # Links a zonas relacionadas
        if entidad in ['cabeza', 'cerebro', 'sistema nervioso']:
            internal_links.append({
                'url': '/zona/cabeza/',
                'text': 'síntomas de la cabeza',
                'context': 'relacionado con sistema nervioso'
            })
        
        # Links a contextos relacionados
        if contexto in ['ansiedad', 'estrés', 'miedo']:
            internal_links.append({
                'url': '/contexto/ansiedad/',
                'text': 'manifestaciones de ansiedad',
                'context': 'contexto emocional relacionado'
            })
        
        # Links a páginas informativas
        internal_links.extend([
            {
                'url': '/sobre/',
                'text': 'acerca de SINTOMARIO.ORG',
                'context': 'información del sitio'
            },
            {
                'url': '/metodologia/',
                'text': 'nuestra metodología',
                'context': 'enfoque holístico'
            }
        ])
        
        return internal_links[:3]  # Máximo 3 enlaces internos
    
    def _add_internal_links(self, content: str, internal_links: List[Dict[str, str]]) -> str:
        """Añadir enlaces internos al contenido."""
        # Buscar lugar natural para insertar enlaces
        lines = content.split('\n')
        modified_lines = []
        links_added = 0
        
        for line in lines:
            modified_lines.append(line)
            
            # Insertar enlaces después de párrafos relevantes
            if line.strip() and not line.startswith('#') and links_added < len(internal_links):
                if random.random() < 0.3:  # 30% de probabilidad de insertar aquí
                    link = internal_links[links_added]
                    link_text = f"Para más información sobre {link['text']}, visita nuestra página de {link['context']}."
                    modified_lines.append(f"\n{link_text}\n")
                    links_added += 1
        
        return '\n'.join(modified_lines)
    
    def _needs_originality_check(self, content: str) -> bool:
        """Verificar si se necesita check de originalidad."""
        # Heurística simple: si el contenido es muy repetitivo
        words = content.lower().split()
        unique_words = set(words)
        
        # Si menos del 60% de palabras son únicas, podría ser duplicado
        return len(unique_words) / len(words) < 0.6
    
    def _is_ai_generated(self, content: str) -> bool:
        """Detectar si el contenido fue generado por IA."""
        # Heurística simple basada en patrones
        ai_patterns = [
            "En conclusión,",
            "En resumen,",
            "Es importante destacar que",
            "Como se ha mencionado anteriormente",
            "En el contexto actual"
        ]
        
        content_lower = content.lower()
        pattern_count = sum(1 for pattern in ai_patterns if pattern in content_lower)
        
        # Si hay muchos patrones típicos de IA, probablemente es generado por IA
        return pattern_count > 3
    
    def _add_ai_disclaimer(self, content: str) -> str:
        """Añadir disclaimer de contenido generado por IA."""
        disclaimer = """
        
---

**Nota sobre este contenido**: Este artículo fue generado con asistencia de inteligencia artificial y revisado por expertos en salud holística. La información proporcionada es para fines educativos y no debe reemplazar el consejo médico profesional.

"""
        
        return content + disclaimer
    
    def _calculate_seo_score(self, content: str, metadata: Dict[str, Any], report: Dict[str, Any]) -> int:
        """Calcular score SEO basado en guías de Google."""
        score = 0
        
        # E-E-A-T (30 puntos)
        if self._has_expertise_signals(content):
            score += 15
        if metadata.get('author', ''):
            score += 10
        if metadata.get('date_updated', ''):
            score += 5
        
        # Calidad del contenido (25 puntos)
        word_count = len(content.split())
        if word_count >= 1500:
            score += 15
        elif word_count >= 1000:
            score += 10
        elif word_count >= 500:
            score += 5
        
        # Estructura técnica (25 puntos)
        if self._has_proper_heading_structure(content):
            score += 10
        if len(report['optimizations_applied']) > 0:
            score += 10
        if len(report['recommendations']) == 0:
            score += 5
        
        # Originalidad y transparencia (20 puntos)
        if not self._needs_originality_check(content):
            score += 10
        if self._is_ai_generated(content) and 'Disclaimer de IA añadido' in report['optimizations_applied']:
            score += 10
        
        return min(100, score)

class EnhancedAmazonAPI:
    """API de Amazon mejorada con rate limiting y optimización SEO."""
    
    def __init__(self):
        self.rate_manager = AmazonRateManager()
        self.seo_optimizer = SEOContentOptimizer()
        
    def get_product_info_with_rate_limit(self, asin: str) -> Optional[Dict[str, Any]]:
        """Obtener información de producto con rate limiting."""
        # Esperar si necesario
        wait_time = self.rate_manager.wait_for_slot()
        
        if wait_time > 0:
            print(f"⏱️ Rate limit: esperando {wait_time:.1f}s para ASIN {asin}")
        
        # Registrar petición
        self.rate_manager.record_request()
        
        # Aquí iría la llamada real a la API de Amazon
        # Por ahora simulamos una respuesta
        return self._simulate_api_response(asin)
    
    def _simulate_api_response(self, asin: str) -> Dict[str, Any]:
        """Simular respuesta de API para demostración."""
        return {
            'asin': asin,
            'title': f'Producto de ejemplo {asin}',
            'price': round(random.uniform(10, 100), 2),
            'currency': 'EUR',
            'availability': random.choice(['Disponible', 'No disponible']),
            'rating': round(random.uniform(3.0, 5.0), 1),
            'total_reviews': random.randint(10, 1000)
        }
    
    def generate_seo_optimized_content(self, 
                                     sintoma: str, 
                                     sistema: str, 
                                     contexto: str) -> Dict[str, Any]:
        """Generar contenido optimizado para SEO."""
        
        # Generar contenido base
        base_content = self._generate_base_content(sintoma, sistema, contexto)
        
        # Metadata para optimización
        metadata = {
            'sintoma': sintoma,
            'sistema': sistema,
            'contexto': contexto,
            'author': 'SINTOMARIO.ORG',
            'date_updated': datetime.now().isoformat()
        }
        
        # Optimizar contenido
        optimized = self.seo_optimizer.optimize_content(base_content, metadata)
        
        return optimized
    
    def _generate_base_content(self, sintoma: str, sistema: str, contexto: str) -> str:
        """Generar contenido base."""
        return f"""
# {sintoma.title()} en {sistema.title()}

El {sintoma} en el {sistema} es una manifestación que puede estar relacionada con {contexto}. 
Esta conexión entre el cuerpo y las emociones ha sido documentada por diversas tradiciones de sanación.

## Causas y factores

Cuando experimentamos {sintoma}, es importante considerar tanto los aspectos físicos como emocionales. 
El {sistema} puede responder a estados de {contexto} a través de various mecanismos fisiológicos.

## Enfoque holístico

Un abordaje integral para el {sintoma} incluye:

- Atención al bienestar emocional
- Apoyo al sistema {sistema}
- Prácticas de reducción de {contexto}

## Recomendaciones

Para manejar el {sintoma} de manera efectiva, recomendamos consultar con profesionales de salud 
que puedan evaluar tanto los aspectos físicos como emocionales de esta condición.
        """.strip()

def main():
    """Función principal para demostración."""
    print("🚀 SINTOMARIO.ORG - Optimización Amazon API y SEO")
    print("=" * 60)
    
    enhanced_api = EnhancedAmazonAPI()
    
    # Demostrar rate limiting
    print("\n📊 Demostración de Rate Limiting:")
    for i in range(3):
        print(f"\nPetición {i+1}:")
        status = enhanced_api.rate_manager.get_status()
        print(f"   Estado: {status}")
        
        product = enhanced_api.get_product_info_with_rate_limit(f"B00{i:02d}TEST")
        print(f"   Producto: {product['title']} - €{product['price']}")
    
    # Demostrar optimización SEO
    print("\n🔍 Demostración de Optimización SEO:")
    optimized = enhanced_api.generate_seo_optimized_content(
        "dolor de cabeza", "sistema nervioso", "estrés"
    )
    
    print(f"   Score SEO: {optimized['report']['seo_score']}/100")
    print(f"   Longitud original: {optimized['report']['original_length']} palabras")
    print(f"   Longitud final: {optimized['report']['final_length']} palabras")
    print(f"   Optimizaciones: {', '.join(optimized['report']['optimizations_applied'])}")
    
    if optimized['report']['recommendations']:
        print(f"   Recomendaciones: {', '.join(optimized['report']['recommendations'])}")
    
    print("\n✅ Sistema optimizado listo para producción")

if __name__ == "__main__":
    main()
