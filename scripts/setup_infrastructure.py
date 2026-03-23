#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Configurador de Secrets y DNS
Utiliza los tokens configurados para automatizar la infraestructura.
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime

class SecretsManager:
    """Gestiona secrets y configuración de infraestructura."""
    
    def __init__(self):
        self.github_token = os.getenv('PAT_TOKEN') or os.getenv('GITHUB_TOKEN')
        self.cloudflare_token = os.getenv('CLOUDFLARE_API_TOKEN')
        self.cloudflare_zone_id = os.getenv('CLOUDFLARE_ZONE_ID')
        self.cloudflare_account_id = os.getenv('CLOUDFLARE_ACCOUNT_ID')
        
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
    
    def verify_github_access(self) -> bool:
        """Verifica acceso a GitHub API."""
        if not self.github_token:
            print("❌ GitHub token no encontrado")
            return False
        
        try:
            headers = {
                'Authorization': f'token {self.github_token}',
                'Accept': 'application/vnd.github.v3+json'
            }
            
            response = requests.get(
                'https://api.github.com/user',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Acceso GitHub verificado: {user_data['login']}")
                return True
            else:
                print(f"❌ Error GitHub API: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error verificando GitHub: {str(e)}")
            return False
    
    def verify_cloudflare_access(self) -> bool:
        """Verifica acceso a Cloudflare API."""
        if not self.cloudflare_token:
            print("❌ Cloudflare token no encontrado")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                zone_data = response.json()
                print(f"✅ Acceso Cloudflare verificado: {zone_data['result']['name']}")
                return True
            else:
                print(f"❌ Error Cloudflare API: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error verificando Cloudflare: {str(e)}")
            return False
    
    def configure_cloudflare_dns(self) -> bool:
        """Configura registros DNS en Cloudflare."""
        if not all([self.cloudflare_token, self.cloudflare_zone_id]):
            print("❌ Credenciales Cloudflare incompletas")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
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
                    f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}/dns_records',
                    headers=headers,
                    json=dns_record,
                    timeout=10
                )
                
                if response.status_code == 200:
                    print(f"✅ Registro A {i+1}/4 configurado: {ip}")
                else:
                    print(f"❌ Error configurando A {i+1}: {response.text}")
            
            # Configurar CNAME para www
            cname_record = {
                'type': 'CNAME',
                'name': 'www',
                'content': self.config['cname_target'],
                'ttl': 3600,
                'proxied': True
            }
            
            response = requests.post(
                f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}/dns_records',
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
    
    def update_github_secrets(self) -> bool:
        """Actualiza secrets en GitHub repository."""
        if not self.github_token:
            print("❌ GitHub token no disponible")
            return False
        
        try:
            headers = {
                'Authorization': f'token {self.github_token}',
                'Accept': 'application/vnd.github.v3+json'
            }
            
            # Lista de secrets a configurar
            secrets_to_update = {
                'AMAZON_TAG': 'sintomario-20',
                'DOMAIN_NAME': self.config['domain'],
                'CLOUDFLARE_ZONE_ID': self.cloudflare_zone_id,
                'CLOUDFLARE_ACCOUNT_ID': self.cloudflare_account_id
            }
            
            for secret_name, secret_value in secrets_to_update.items():
                # Verificar si el secret ya existe
                response = requests.get(
                    f'https://api.github.com/repos/sintomario/SINTOMARIO.ORG/actions/secrets/{secret_name}',
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    # Actualizar secret existente
                    secret_data = response.json()
                    update_response = requests.put(
                        f'https://api.github.com/repos/sintomario/SINTOMARIO.ORG/actions/secrets/{secret_name}',
                        headers=headers,
                        json={
                            'key_id': secret_data['key_id'],
                            'encrypted_value': secret_value
                        },
                        timeout=10
                    )
                    
                    if update_response.status_code == 204:
                        print(f"✅ Secret actualizado: {secret_name}")
                    else:
                        print(f"❌ Error actualizando {secret_name}: {update_response.text}")
                else:
                    # Crear nuevo secret
                    create_response = requests.put(
                        f'https://api.github.com/repos/sintomario/SINTOMARIO.ORG/actions/secrets/{secret_name}',
                        headers=headers,
                        json={
                            'encrypted_value': secret_value
                        },
                        timeout=10
                    )
                    
                    if create_response.status_code == 201:
                        print(f"✅ Secret creado: {secret_name}")
                    else:
                        print(f"❌ Error creando {secret_name}: {create_response.text}")
            
            return True
            
        except Exception as e:
            print(f"❌ Error actualizando secrets: {str(e)}")
            return False
    
    def generate_cname_file(self) -> bool:
        """Genera archivo CNAME para GitHub Pages."""
        try:
            cname_content = self.config['cname_target']
            cname_file = Path('public/CNAME')
            
            cname_file.parent.mkdir(exist_ok=True)
            with open(cname_file, 'w') as f:
                f.write(cname_content)
            
            print(f"✅ Archivo CNAME generado: {cname_content}")
            return True
            
        except Exception as e:
            print(f"❌ Error generando CNAME: {str(e)}")
            return False
    
    def verify_ssl_configuration(self) -> bool:
        """Verifica configuración SSL/TLS."""
        if not self.cloudflare_token:
            print("❌ Cloudflare token no disponible")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.cloudflare_token}',
                'Content-Type': 'application/json'
            }
            
            # Obtener configuración SSL/TLS
            response = requests.get(
                f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}/ssl/verification',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                ssl_data = response.json()
                print(f"✅ Estado SSL: {ssl_data['result']['status']}")
                return True
            else:
                print(f"❌ Error verificando SSL: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error verificando SSL: {str(e)}")
            return False
    
    def run_full_configuration(self) -> dict:
        """Ejecuta configuración completa de infraestructura."""
        print("🚀 SINTOMARIO.ORG - Configurador de Infraestructura")
        print("Configurando secrets y DNS automatizados")
        print("=" * 60)
        
        results = {
            'github_access': False,
            'cloudflare_access': False,
            'dns_configured': False,
            'secrets_updated': False,
            'cname_generated': False,
            'ssl_verified': False,
            'timestamp': datetime.now().isoformat()
        }
        
        # 1. Verificar acceso GitHub
        print("\n[1/6] Verificando acceso GitHub...")
        results['github_access'] = self.verify_github_access()
        
        # 2. Verificar acceso Cloudflare
        print("\n[2/6] Verificando acceso Cloudflare...")
        results['cloudflare_access'] = self.verify_cloudflare_access()
        
        # 3. Configurar DNS en Cloudflare
        if results['cloudflare_access']:
            print("\n[3/6] Configurando DNS Cloudflare...")
            results['dns_configured'] = self.configure_cloudflare_dns()
        
        # 4. Actualizar secrets en GitHub
        if results['github_access']:
            print("\n[4/6] Actualizando secrets GitHub...")
            results['secrets_updated'] = self.update_github_secrets()
        
        # 5. Generar archivo CNAME
        print("\n[5/6] Generando archivo CNAME...")
        results['cname_generated'] = self.generate_cname_file()
        
        # 6. Verificar SSL/TLS
        if results['cloudflare_access']:
            print("\n[6/6] Verificando SSL/TLS...")
            results['ssl_verified'] = self.verify_ssl_configuration()
        
        # Generar reporte
        success_count = sum(results.values())
        total_checks = len(results) - 1  # Excluir timestamp
        
        print(f"\n📊 RESULTADOS DE CONFIGURACIÓN:")
        print(f"   ✅ Exitosos: {success_count}/{total_checks}")
        print(f"   📈 Tasa de éxito: {(success_count/total_checks)*100:.1f}%")
        
        # Estado final
        if success_count == total_checks:
            print(f"\n🌟 EXCELENTE - Infraestructura completamente configurada")
        elif success_count >= total_checks * 0.8:
            print(f"\n✅ BUENO - Infraestructura mayormente configurada")
        elif success_count >= total_checks * 0.6:
            print(f"\n⚠️ REGULAR - Infraestructura parcialmente configurada")
        else:
            print(f"\n❌ CRÍTICO - Infraestructura requiere configuración urgente")
        
        # Guardar reporte
        report_file = Path("reports/infrastructure-config.json")
        report_file.parent.mkdir(exist_ok=True)
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Reporte guardado: {report_file}")
        
        return results

def main():
    """Función principal."""
    print("🔐 SINTOMARIO.ORG - Gestor de Secrets y Configuración")
    print("Configuración automatizada de infraestructura crítica")
    print("=" * 60)
    
    # Verificar variables de entorno
    required_vars = ['PAT_TOKEN', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ZONE_ID', 'CLOUDFLARE_ACCOUNT_ID']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variables de entorno faltantes:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📋 Para configurar:")
        print("   export PAT_TOKEN='ghp_...'")
        print("   export CLOUDFLARE_API_TOKEN='...'")
        print("   export CLOUDFLARE_ZONE_ID='...'")
        print("   export CLOUDFLARE_ACCOUNT_ID='...'")
        return
    
    # Ejecutar configuración
    manager = SecretsManager()
    results = manager.run_full_configuration()
    
    # Próximos pasos
    print(f"\n🚀 PRÓXIMOS PASOS:")
    
    if results['dns_configured']:
        print("   1. Esperar propagación DNS (24-48 horas)")
        print("   2. Verificar dominio en navegador")
    
    if results['cname_generated']:
        print("   3. Hacer commit y push a GitHub")
        print("   4. Verificar deploy automático")
    
    if results['secrets_updated']:
        print("   5. Ejecutar build con secrets configurados")
        print("   6. Verificar GitHub Actions")
    
    print("\n🌐 Una vez configurado:")
    print("   - Visita: https://sintomario.org")
    print("   - Testea: https://www.sintomario.org")
    print("   - Verifica: Certificado SSL válido")
    print("   - Monitorea: GitHub Actions status")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
