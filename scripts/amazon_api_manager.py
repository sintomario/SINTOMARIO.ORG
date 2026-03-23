#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Amazon Product Advertising API 5.0 Integration
Implementa actualización automática de precios y detección de productos descatalogados.
"""

import os
import json
import time
import hashlib
import hmac
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

@dataclass
class AmazonProduct:
    """Producto de Amazon con datos actualizados."""
    asin: str
    title: str
    price: float
    currency: str
    availability: str
    url: str
    image_url: str
    rating: float
    total_reviews: int
    last_updated: str
    is_available: bool

class AmazonAPI5:
    """Cliente para Amazon Product Advertising API 5.0."""
    
    def __init__(self):
        self.access_key = os.getenv('AMAZON_ACCESS_KEY_ID')
        self.secret_key = os.getenv('AMAZON_SECRET_ACCESS_KEY')
        self.tag = os.getenv('AMAZON_TAG', 'sintomario-20')
        self.region = os.getenv('AMAZON_REGION', 'es-east-1')
        self.locale = os.getenv('AMAZON_LOCALE', 'es')
        self.base_url = f"https://webservices.amazon.{self.locale}/paapi5"
        
        # Cache para evitar rate limiting
        self.cache = {}
        self.cache_ttl = 3600  # 1 hora
        
    def _sign_request(self, method: str, uri: str, params: Dict[str, str]) -> Dict[str, str]:
        """Generar firma para la petición API."""
        # Timestamp y formato canonical
        timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
        params['AWS4-Amz-Algorithm'] = 'AWS4-HMAC-SHA256'
        params['AWS4-Amz-Credential'] = f"{self.access_key}/{timestamp[:8]}/{self.region}/ProductAdvertisingAPI/aws4_request"
        params['AWS4-Amz-Date'] = timestamp
        params['AWS4-Amz-Expires'] = '300'  # 5 minutos
        
        # Canonical request
        canonical_query_string = '&'.join(f"{k}={v}" for k, v in sorted(params.items()))
        canonical_headers = f"host:webservices.amazon.{self.locale}\n"
        signed_headers = "host"
        payload_hash = hashlib.sha256(''.encode()).hexdigest()
        
        canonical_request = f"{method}\n{uri}\n{canonical_query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
        
        # String to sign
        algorithm = 'AWS4-HMAC-SHA256'
        date_stamp = timestamp[:8]
        credential_scope = f"{date_stamp}/{self.region}/ProductAdvertisingAPI/aws4_request"
        string_to_sign = f"{algorithm}\n{timestamp}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode()).hexdigest()}"
        
        # Signature
        def sign(key: bytes, msg: str) -> bytes:
            return hmac.new(key, msg.encode(), hashlib.sha256).digest()
        
        k_date = sign(f"AWS4{self.secret_key}".encode(), date_stamp)
        k_region = sign(k_date, self.region)
        k_service = sign(k_region, "ProductAdvertisingAPI")
        k_signing = sign(k_service, "aws4_request")
        
        signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()
        
        params['X-Amz-Signature'] = signature
        return params
    
    def get_product_info(self, asin: str) -> Optional[AmazonProduct]:
        """Obtener información actualizada de un producto."""
        # Verificar cache
        cache_key = f"product_{asin}"
        if cache_key in self.cache:
            cached_data, cached_time = self.cache[cache_key]
            if time.time() - cached_time < self.cache_ttl:
                return cached_data
        
        try:
            # Parámetros de la petición
            params = {
                'PartnerTag': self.tag,
                'PartnerType': 'Associates',
                'Marketplace': f"www.amazon.{self.locale}",
                'ASINs': asin,
                'Resources': 'Images.Primary.Medium,ItemInfo.Title,ItemInfo.Features,ItemInfo.ProductInfo,Offers.Summaries,HighestPrice,LowestPrice,Reviews.Summary',
                'Condition': 'New'
            }
            
            # Generar firma
            signed_params = self._sign_request('GET', '/paapi5/getitems', params)
            
            # Hacer petición
            response = requests.get(f"{self.base_url}/getitems", params=signed_params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'Errors' in data:
                print(f"Error API para ASIN {asin}: {data['Errors'][0]['Message']}")
                return None
            
            # Extraer información del producto
            item = data['ItemsResult']['Items'][0]
            
            product = AmazonProduct(
                asin=asin,
                title=item.get('ItemInfo', {}).get('Title', {}).get('DisplayValue', 'Producto no disponible'),
                price=self._extract_price(item),
                currency=item.get('Offers', {}).get('Summaries', [{}])[0].get('HighestPrice', {}).get('Currency', 'EUR'),
                availability=self._extract_availability(item),
                url=self._build_affiliate_url(asin),
                image_url=self._extract_image_url(item),
                rating=self._extract_rating(item),
                total_reviews=self._extract_review_count(item),
                last_updated=datetime.now().isoformat(),
                is_available=self._is_available(item)
            )
            
            # Guardar en cache
            self.cache[cache_key] = (product, time.time())
            
            return product
            
        except Exception as e:
            print(f"Error obteniendo producto {asin}: {str(e)}")
            return None
    
    def _extract_price(self, item: Dict) -> float:
        """Extraer precio del producto."""
        try:
            offers = item.get('Offers', {}).get('Summaries', [])
            if offers and offers[0].get('HighestPrice'):
                return float(offers[0]['HighestPrice']['Amount'])
            return 0.0
        except:
            return 0.0
    
    def _extract_availability(self, item: Dict) -> str:
        """Extraer disponibilidad del producto."""
        try:
            offers = item.get('Offers', {}).get('Summaries', [])
            if offers and offers[0].get('Availability'):
                return offers[0]['Availability']['Message']
            return "No disponible"
        except:
            return "Desconocido"
    
    def _extract_image_url(self, item: Dict) -> str:
        """Extraer URL de imagen."""
        try:
            return item.get('Images', {}).get('Primary', {}).get('Medium', {}).get('URL', '')
        except:
            return ''
    
    def _extract_rating(self, item: Dict) -> float:
        """Extraer rating del producto."""
        try:
            reviews = item.get('Reviews', {}).get('Summary', {})
            return float(reviews.get('Rating', 0))
        except:
            return 0.0
    
    def _extract_review_count(self, item: Dict) -> int:
        """Extraer número de reviews."""
        try:
            reviews = item.get('Reviews', {}).get('Summary', {})
            return int(reviews.get('ReviewCount', 0))
        except:
            return 0
    
    def _is_available(self, item: Dict) -> bool:
        """Verificar si el producto está disponible."""
        availability = self._extract_availability(item).lower()
        return 'disponible' in availability and 'no' not in availability
    
    def _build_affiliate_url(self, asin: str) -> str:
        """Construir URL de afiliado."""
        return f"https://www.amazon.{self.locale}/dp/{asin}?tag={self.tag}"
    
    def search_products(self, keywords: str, max_results: int = 10) -> List[AmazonProduct]:
        """Buscar productos por keywords."""
        try:
            params = {
                'PartnerTag': self.tag,
                'PartnerType': 'Associates',
                'Marketplace': f"www.amazon.{self.locale}",
                'Keywords': keywords,
                'Resources': 'Images.Primary.Medium,ItemInfo.Title,ItemInfo.Features,ItemInfo.ProductInfo,Offers.Summaries,HighestPrice,LowestPrice,Reviews.Summary',
                'Condition': 'New',
                'ItemCount': str(max_results)
            }
            
            # Generar firma
            signed_params = self._sign_request('GET', '/paapi5/searchitems', params)
            
            # Hacer petición
            response = requests.get(f"{self.base_url}/searchitems", params=signed_params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'Errors' in data:
                print(f"Error en búsqueda: {data['Errors'][0]['Message']}")
                return []
            
            products = []
            for item in data.get('SearchResult', {}).get('Items', []):
                product = AmazonProduct(
                    asin=item.get('ASIN', ''),
                    title=item.get('ItemInfo', {}).get('Title', {}).get('DisplayValue', ''),
                    price=self._extract_price(item),
                    currency=item.get('Offers', {}).get('Summaries', [{}])[0].get('HighestPrice', {}).get('Currency', 'EUR'),
                    availability=self._extract_availability(item),
                    url=self._build_affiliate_url(item.get('ASIN', '')),
                    image_url=self._extract_image_url(item),
                    rating=self._extract_rating(item),
                    total_reviews=self._extract_review_count(item),
                    last_updated=datetime.now().isoformat(),
                    is_available=self._is_available(item)
                )
                products.append(product)
            
            return products
            
        except Exception as e:
            print(f"Error en búsqueda: {str(e)}")
            return []

class AmazonProductManager:
    """Gestiona productos de Amazon para SINTOMARIO.ORG."""
    
    def __init__(self, corpus_dir: str = "corpus"):
        self.api = AmazonAPI5()
        self.corpus_dir = Path(corpus_dir)
        self.products_file = self.corpus_dir / "productos.json"
        
    def update_all_products(self) -> Dict[str, Any]:
        """Actualizar información de todos los productos."""
        print("🔄 Actualizando productos de Amazon...")
        
        # Cargar productos existentes
        with open(self.products_file, 'r', encoding='utf-8') as f:
            products_data = json.load(f)
        
        updated_products = []
        unavailable_products = []
        errors = []
        
        for product in products_data['productos']:
            print(f"   📦 Actualizando {product['asin']} - {product['titulo']}")
            
            # Obtener información actualizada
            amazon_product = self.api.get_product_info(product['asin'])
            
            if amazon_product:
                # Actualizar producto con datos frescos
                updated_product = {
                    'asin': product['asin'],
                    'titulo': amazon_product.title,
                    'precio': amazon_product.price,
                    'moneda': amazon_product.currency,
                    'disponibilidad': amazon_product.availability,
                    'url_afiliado': amazon_product.url,
                    'imagen_url': amazon_product.image_url,
                    'rating': amazon_product.rating,
                    'total_reviews': amazon_product.total_reviews,
                    'actualizado_en': amazon_product.last_updated,
                    'disponible': amazon_product.is_available,
                    'categorias': product.get('categorias', []),
                    'descripcion': product.get('descripcion', '')
                }
                
                if amazon_product.is_available:
                    updated_products.append(updated_product)
                    print(f"      ✅ Actualizado - €{amazon_product.price}")
                else:
                    unavailable_products.append(updated_product)
                    print(f"      ❌ No disponible")
            else:
                errors.append(product['asin'])
                print(f"      ⚠️ Error de API")
        
        # Guardar productos actualizados
        backup_file = self.products_file.with_suffix('.json.backup')
        self.products_file.rename(backup_file)
        
        products_data['productos'] = updated_products
        products_data['no_disponibles'] = unavailable_products
        products_data['errores'] = errors
        products_data['ultima_actualizacion'] = datetime.now().isoformat()
        
        with open(self.products_file, 'w', encoding='utf-8') as f:
            json.dump(products_data, f, indent=2, ensure_ascii=False)
        
        # Generar reporte
        report = {
            'total_productos': len(products_data['productos']),
            'disponibles': len(updated_products),
            'no_disponibles': len(unavailable_products),
            'errores': len(errors),
            'ultima_actualizacion': products_data['ultima_actualizacion']
        }
        
        print(f"\n✅ Actualización completada:")
        print(f"   📦 Total productos: {report['total_productos']}")
        print(f"   ✅ Disponibles: {report['disponibles']}")
        print(f"   ❌ No disponibles: {report['no_disponibles']}")
        print(f"   ⚠️ Errores: {report['errores']}")
        
        return report
    
    def find_replacement_products(self, unavailable_asin: str, keywords: str, max_results: int = 5) -> List[AmazonProduct]:
        """Encontrar productos de reemplazo para productos no disponibles."""
        print(f"🔍 Buscando reemplazos para {unavailable_asin}...")
        
        products = self.api.search_products(keywords, max_results)
        
        # Filtrar productos disponibles y con buen rating
        available_products = [
            p for p in products 
            if p.is_available and p.rating >= 3.0 and p.price > 0
        ]
        
        # Ordenar por rating y precio
        available_products.sort(key=lambda x: (x.rating, -x.price), reverse=True)
        
        print(f"   📦 Encontrados {len(available_products)} reemplazos potenciales")
        
        return available_products[:3]  # Top 3 reemplazos
    
    def generate_affiliate_health_report(self) -> Dict[str, Any]:
        """Generar reporte de salud de afiliados."""
        with open(self.products_file, 'r', encoding='utf-8') as f:
            products_data = json.load(f)
        
        total_products = len(products_data['productos'])
        available_products = sum(1 for p in products_data['productos'] if p.get('disponible', True))
        
        # Calcular métricas
        availability_rate = (available_products / total_products * 100) if total_products > 0 else 0
        
        # Productos con problemas
        problem_products = [
            p for p in products_data['productos'] 
            if not p.get('disponible', True) or p.get('precio', 0) == 0
        ]
        
        report = {
            'fecha_generacion': datetime.now().isoformat(),
            'total_productos': total_products,
            'productos_disponibles': available_products,
            'tasa_disponibilidad': round(availability_rate, 2),
            'productos_con_problemas': len(problem_products),
            'detalles_problemas': [
                {
                    'asin': p['asin'],
                    'titulo': p['titulo'],
                    'problema': 'No disponible' if not p.get('disponible', True) else 'Precio inválido'
                }
                for p in problem_products
            ],
            'ultima_actualizacion': products_data.get('ultima_actualizacion', 'Nunca')
        }
        
        # Guardar reporte
        report_file = Path('reports/affiliate-health.json')
        report_file.parent.mkdir(exists_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Amazon API 5.0 Manager")
    parser.add_argument("--update", action="store_true", help="Actualizar todos los productos")
    parser.add_argument("--check", action="store_true", help="Generar reporte de salud")
    parser.add_argument("--search", help="Buscar productos por keywords")
    parser.add_argument("--replace", help="Buscar reemplazos para ASIN no disponible")
    parser.add_argument("--keywords", help="Keywords para búsqueda de reemplazos")
    
    args = parser.parse_args()
    
    manager = AmazonProductManager()
    
    if args.update:
        manager.update_all_products()
    
    elif args.check:
        report = manager.generate_affiliate_health_report()
        print("\n📊 REPORTE DE SALUD DE AFILIADOS")
        print(f"   📦 Total productos: {report['total_productos']}")
        print(f"   ✅ Disponibles: {report['productos_disponibles']} ({report['tasa_disponibilidad']}%)")
        print(f"   ⚠️ Con problemas: {report['productos_con_problemas']}")
        print(f"   🕐 Última actualización: {report['ultima_actualizacion']}")
    
    elif args.search:
        products = manager.api.search_products(args.search, 5)
        print(f"\n🔍 Resultados para '{args.search}':")
        for i, p in enumerate(products, 1):
            print(f"   {i}. {p.title}")
            print(f"      ASIN: {p.asin}")
            print(f"      Precio: €{p.price}")
            print(f"      Rating: {p.rating}/5 ({p.total_reviews} reviews)")
            print(f"      Disponible: {p.is_available}")
    
    elif args.replace and args.keywords:
        replacements = manager.find_replacement_products(args.replace, args.keywords)
        print(f"\n🔄 Reemplazos para {args.replace}:")
        for i, p in enumerate(replacements, 1):
            print(f"   {i}. {p.title}")
            print(f"      ASIN: {p.asin}")
            print(f"      Precio: €{p.price}")
            print(f"      Rating: {p.rating}/5")
    
    else:
        print("🛒 Amazon API 5.0 Manager - SINTOMARIO.ORG")
        print("   --update    : Actualizar todos los productos")
        print("   --check     : Generar reporte de salud")
        print("   --search    : Buscar productos")
        print("   --replace   : Buscar reemplazos (requiere --keywords)")

if __name__ == "__main__":
    main()
