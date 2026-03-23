#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Motor con Amazon API Integration
Versión mejorada del motor que integra Amazon Product Advertising API 5.0
para actualización automática de precios y productos.
"""

import json
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

# Importar motor original
from motor.sintomario_motor import SintomarioMotor
from scripts.amazon_api_manager import AmazonProductManager

class EnhancedSintomarioMotor(SintomarioMotor):
    """Motor SINTOMARIO mejorado con Amazon API integration."""
    
    def __init__(self, config_file: str = "corpus/config.json"):
        super().__init__(config_file)
        self.amazon_manager = AmazonProductManager()
        
    def generate_with_amazon_updates(self, output_dir: str = "public", update_products: bool = True) -> Dict[str, Any]:
        """Generar el corpus con actualizaciones automáticas de Amazon."""
        print("🚀 Iniciando generación mejorada con Amazon API...")
        
        # 1. Actualizar productos de Amazon si se solicita
        if update_products:
            print("\n📦 Actualizando productos de Amazon...")
            amazon_report = self.amazon_manager.update_all_products()
            print(f"   ✅ {amazon_report['disponibles']} productos disponibles")
            print(f"   ❌ {amazon_report['no_disponibles']} productos no disponibles")
        
        # 2. Generar corpus normal
        print("\n📚 Generando corpus principal...")
        build_report = self.generar_todo(output_dir)
        
        # 3. Generar reporte de salud de afiliados
        print("\n🏥 Generando reporte de salud de afiliados...")
        health_report = self.amazon_manager.generate_affiliate_health_report()
        
        # 4. Generar reporte combinado
        combined_report = {
            "build_info": build_report,
            "amazon_updates": amazon_report if update_products else None,
            "affiliate_health": health_report,
            "generated_at": datetime.now().isoformat(),
            "system_version": "5.1-Amazon-API"
        }
        
        # Guardar reporte combinado
        report_file = Path("reports/enhanced-build-report.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(combined_report, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Generación mejorada completada")
        print(f"   📊 Reporte guardado: {report_file}")
        
        return combined_report
    
    def generate_amazon_enhanced_node(self, 
                                    entidad: str, 
                                    contexto: str, 
                                    output_dir: str = "public") -> Dict[str, Any]:
        """Genera un nodo con productos optimizados de Amazon."""
        
        # Obtener productos base del corpus
        productos_base = self._get_products_for_node(entidad, contexto)
        
        # Actualizar cada producto con API de Amazon
        productos_actualizados = []
        for producto in productos_base:
            amazon_info = self.amazon_manager.api.get_product_info(producto['asin'])
            
            if amazon_info and amazon_info.is_available:
                producto_actualizado = {
                    'asin': producto['asin'],
                    'titulo': amazon_info.title,
                    'precio': amazon_info.price,
                    'moneda': amazon_info.currency,
                    'url_afiliado': amazon_info.url,
                    'imagen_url': amazon_info.image_url,
                    'rating': amazon_info.rating,
                    'total_reviews': amazon_info.total_reviews,
                    'disponibilidad': amazon_info.availability,
                    'relevancia': producto.get('relevancia', 'alta'),
                    'actualizado_en': amazon_info.last_updated
                }
                productos_actualizados.append(producto_actualizado)
            else:
                # Buscar reemplazo automáticamente
                keywords = f"{entidad} {contexto} salud bienestar"
                reemplazos = self.amazon_manager.find_replacement_products(
                    producto['asin'], keywords, 3
                )
                
                if reemplazos:
                    mejor_reemplazo = reemplazos[0]
                    producto_actualizado = {
                        'asin': mejor_reemplazo.asin,
                        'titulo': mejor_reemplazo.title,
                        'precio': mejor_reemplazo.price,
                        'moneda': mejor_reemplazo.currency,
                        'url_afiliado': mejor_reemplazo.url,
                        'imagen_url': mejor_reemplazo.image_url,
                        'rating': mejor_reemplazo.rating,
                        'total_reviews': mejor_reemplazo.total_reviews,
                        'disponibilidad': mejor_reemplazo.availability,
                        'relevancia': producto.get('relevancia', 'media'),
                        'actualizado_en': mejor_reemplazo.last_updated,
                        'es_reemplazo': True,
                        'original_asin': producto['asin']
                    }
                    productos_actualizados.append(producto_actualizado)
        
        # Generar nodo con productos actualizados
        node_data = self._generate_node_data(entidad, contexto, productos_actualizados)
        
        return node_data
    
    def _get_products_for_node(self, entidad: str, contexto: str) -> List[Dict[str, Any]]:
        """Obtener productos base para un nodo."""
        # Lógica para seleccionar productos relevantes
        # Basado en entidad, contexto y categorías
        
        productos = []
        
        # Cargar todos los productos
        with open('corpus/productos.json', 'r', encoding='utf-8') as f:
            all_products = json.load(f)['productos']
        
        # Seleccionar productos relevantes (lógica simplificada)
        categoria_map = {
            'cabeza': 'salud-mental',
            'corazón': 'salud-cardiovascular',
            'estómago': 'digestion',
            'músculos': 'fitness-recuperacion',
            'piel': 'piel-cuidado'
        }
        
        categoria = categoria_map.get(entidad, 'bienestar-general')
        
        # Filtrar por categoría y disponibilidad
        relevant_products = [
            p for p in all_products 
            if categoria in p.get('categorias', []) and p.get('disponible', True)
        ]
        
        # Seleccionar top 3 por rating
        relevant_products.sort(key=lambda x: x.get('rating', 0), reverse=True)
        
        return relevant_products[:3]

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Motor Mejorado con Amazon API")
    parser.add_argument("--generate", action="store_true", help="Generar corpus con Amazon updates")
    parser.add_argument("--output", default="public", help="Directorio de salida")
    parser.add_argument("--no-update", action="store_true", help="No actualizar productos de Amazon")
    parser.add_argument("--node", help="Generar nodo específico (formato: entidad-contexto)")
    parser.add_argument("--check-amazon", action="store_true", help="Verificar estado de productos Amazon")
    
    args = parser.parse_args()
    
    motor = EnhancedSintomarioMotor()
    
    if args.generate:
        motor.generate_with_amazon_updates(
            output_dir=args.output,
            update_products=not args.no_update
        )
    
    elif args.node:
        if '-' in args.node:
            entidad, contexto = args.node.split('-', 1)
            node_data = motor.generate_amazon_enhanced_node(entidad, contexto)
            print(f"✅ Nodo generado: {entidad}/{contexto}")
            print(f"   📦 Productos: {len(node_data['productos'])}")
        else:
            print("Formato de nodo incorrecto. Usa: entidad-contexto")
    
    elif args.check_amazon:
        health_report = motor.amazon_manager.generate_affiliate_health_report()
        print("\n🏥 ESTADO DE PRODUCTOS AMAZON")
        print(f"   📦 Total: {health_report['total_productos']}")
        print(f"   ✅ Disponibles: {health_report['productos_disponibles']} ({health_report['tasa_disponibilidad']}%)")
        print(f"   ⚠️ Problemas: {health_report['productos_con_problemas']}")
        
        if health_report['productos_con_problemas'] > 0:
            print("\n📋 Productos con problemas:")
            for problem in health_report['detalles_problemas']:
                print(f"   ❌ {problem['asin']} - {problem['titulo']}")
                print(f"      Problema: {problem['problema']}")
    
    else:
        print("🚀 Motor SINTOMARIO Mejorado v5.1")
        print("   --generate     : Generar corpus con Amazon updates")
        print("   --node         : Generar nodo específico")
        print("   --check-amazon : Verificar estado productos")
        print("   --no-update    : No actualizar productos Amazon")
        print("   --output       : Directorio de salida")

if __name__ == "__main__":
    main()
