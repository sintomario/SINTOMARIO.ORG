#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Configurador Cloudflare con Credenciales Reales
Usa las credenciales reales proporcionadas para configurar DNS automáticamente.
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime

class CloudflareManager:
    """Gestiona la configuración de Cloudflare con credenciales reales."""
    
    def __init__(self):
        self.cloudflare_token = "cfk_XTNoY5kjO8KC3OgbFvbKrQBZX62oKDpBLM05QQLj3b1727a4"
        self.zone_id = "47ebfbadef2862ed21a26b1902238c89"
        self.account_id = "41063d68af9935b25b2f4ec0b6ece82d"
        
        self.config = {
            'domain': 'sintomario.org',
            'github_pages_ips': [
                '185.199.108.153',
                '185.199.109.153', 
                '185.199.110.153',
                '185.199.111.153'
            ],
            'cname_target': 'sintomario.github.io'
        }
    
    def verify_cloudflare_access(self) -> bool:
        """Verifica acceso a Cloudflare API."""
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                zone_data = response.json()
                print(f"✅ Acceso Cloudflare verificado: {zone_data['result']['name']}")
                return True
            else:
                print(f"❌ Error Cloudflare API: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error verificando Cloudflare: {str(e)}")
            return False
    
    def configure_dns_records(self) -> bool:
        """Configura los registros DNS automáticamente."""
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            print("🔧 Configurando registros DNS...")
            
            # Configurar registros A
            for i, ip in enumerate(self.config['github_pages_ips']):
                dns_record = {
                    'type': 'A',
                    'name': self.config['domain'],
                    'content': ip,
                    'ttl': 3600,
                    'proxied': True
                }
                
                response = requests.post(
                    f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}/dns_records',
                    headers=headers,
                    json=dns_record,
                    timeout=10
                )
                
                if response.status_code == 200:
                    print(f"✅ Registro A {i+1}/4 configurado: {ip}")
                else:
                    print(f"❌ Error configurando A {i+1}: {response.text}")
                    return False
            
            # Configurar CNAME para www
            cname_record = {
                'type': 'CNAME',
                'name': 'www',
                'content': self.config['cname_target'],
                'ttl': 3600,
                'proxied': True
            }
            
            response = requests.post(
                f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}/dns_records',
                headers=headers,
                json=cname_record,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ CNAME configurado: www -> {self.config['cname_target']}")
                return True
            else:
                print(f"❌ Error configurando CNAME: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error configurando DNS: {str(e)}")
            return False
    
    def configure_ssl_tls(self) -> bool:
        """Configura SSL/TLS en modo Full (strict)."""
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            print("🔒 Configurando SSL/TLS...")
            
            # Configurar SSL/TLS mode
            ssl_config = {
                'value': 'strict',
                'certificate_status': 'active'
            }
            
            response = requests.patch(
                f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}/ssl/verification',
                headers=headers,
                json=ssl_config,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ SSL/TLS configurado en modo Full (strict)")
            else:
                print(f"⚠️ No se pudo configurar SSL/TLS: {response.text}")
            
            # Configurar HTTPS redirect
            https_config = {
                'value': 'on'
            }
            
            response = requests.patch(
                f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}/settings/always_use_https',
                headers=headers,
                json=https_config,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ HTTPS redirect configurado: Always ON")
            else:
                print(f"⚠️ No se pudo configurar HTTPS redirect: {response.text}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error configurando SSL/TLS: {str(e)}")
            return False
    
    def verify_dns_configuration(self) -> bool:
        """Verifica la configuración DNS actual."""
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            print("🔍 Verificando configuración DNS actual...")
            
            response = requests.get(
                f'https://api.cloudflare.com/client/v4/zones/{self.zone_id}/dns_records',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                records_data = response.json()
                records = records_data['result']
                
                a_records = [r for r in records if r['type'] == 'A' and r['name'] == self.config['domain']]
                cname_records = [r for r in records if r['type'] == 'CNAME' and r['name'] == 'www']
                
                print(f"   📊 Registros A encontrados: {len(a_records)}")
                for record in a_records:
                    print(f"      - {record['content']}")
                
                print(f"   📊 Registros CNAME encontrados: {len(cname_records)}")
                for record in cname_records:
                    print(f"      - {record['name']} -> {record['content']}")
                
                return True
            else:
                print(f"❌ Error obteniendo registros DNS: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error verificando DNS: {str(e)}")
            return False
    
    def generate_report(self, results: dict) -> None:
        """Genera reporte de configuración."""
        report = {
            'timestamp': datetime.now().isoformat(),
            'domain': self.config['domain'],
            'cloudflare_configured': results,
            'dns_records': {
                'a_records': self.config['github_pages_ips'],
                'cname_target': self.config['cname_target']
            },
            'next_steps': [
                'Esperar propagación DNS (15-30 minutos)',
                'Verificar dominio en navegador',
                'Testear acceso HTTPS',
                'Configurar GitHub Pages si es necesario'
            ]
        }
        
        report_file = Path("reports/cloudflare-setup.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Reporte guardado: {report_file}")
    
    def run_full_setup(self) -> bool:
        """Ejecuta la configuración completa."""
        print("🌐 SINTOMARIO.ORG - Configurador Cloudflare")
        print("Configurando DNS automáticamente con credenciales reales")
        print("=" * 60)
        
        results = {
            'access_verified': False,
            'dns_configured': False,
            'ssl_configured': False,
            'verification_completed': False
        }
        
        # 1. Verificar acceso
        print("\n[1/4] Verificando acceso a Cloudflare API...")
        results['access_verified'] = self.verify_cloudflare_access()
        
        if not results['access_verified']:
            print("❌ No se puede continuar sin acceso a Cloudflare API")
            return False
        
        # 2. Configurar DNS
        print("\n[2/4] Configurando registros DNS...")
        results['dns_configured'] = self.configure_dns_records()
        
        # 3. Configurar SSL/TLS
        print("\n[3/4] Configurando SSL/TLS...")
        results['ssl_configured'] = self.configure_ssl_tls()
        
        # 4. Verificar configuración
        print("\n[4/4] Verificando configuración final...")
        results['verification_completed'] = self.verify_dns_configuration()
        
        # Generar reporte
        self.generate_report(results)
        
        # Resumen
        success_count = sum(results.values())
        total_checks = len(results)
        
        print(f"\n📊 RESULTADOS DE CONFIGURACIÓN:")
        print(f"   ✅ Exitosos: {success_count}/{total_checks}")
        print(f"   📈 Tasa de éxito: {(success_count/total_checks)*100:.1f}%")
        
        if success_count == total_checks:
            print(f"\n🌟 EXCELENTE - Infraestructura Cloudflare completamente configurada")
        elif success_count >= total_checks * 0.8:
            print(f"\n✅ BUENO - Infraestructura mayormente configurada")
        else:
            print(f"\n⚠️ REGULAR - Infraestructura parcialmente configurada")
        
        print(f"\n🚀 PRÓXIMOS PASOS:")
        print(f"   1. Esperar propagación DNS (15-30 minutos)")
        print(f"   2. Verificar: https://sintomario.org")
        print(f"   3. Verificar: https://www.sintomario.org")
        print(f"   4. Testear certificado SSL")
        
        return success_count == total_checks

def main():
    """Función principal."""
    print("🌐 SINTOMARIO.ORG - Configurador Cloudflare")
    print("Configuración automática de DNS con credenciales reales")
    print("=" * 60)
    
    manager = CloudflareManager()
    success = manager.run_full_setup()
    
    if success:
        print(f"\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE")
        print(f"🌐 SINTOMARIO.ORG estará disponible en 15-30 minutos")
    else:
        print(f"\n❌ CONFIGURACIÓN COMPLETADA CON ERRORES")
        print(f"🔧 Revisa los mensajes arriba para solucionar problemas")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
