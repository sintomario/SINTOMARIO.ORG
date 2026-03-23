#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Cloudflare DNS Verification
Verificación de estado DNS y configuración de dominio
"""

import json
import os
import sys
import requests
import dns.resolver
from pathlib import Path
from typing import Dict, List, Optional

class CloudflareVerify:
    def __init__(self):
        """Inicializar verificador de DNS"""
        self.zone_name = "sintomario.org"
        self.expected_records = [
            {"type": "A", "name": "@", "expected": ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"]},
            {"type": "CNAME", "name": "www", "expected": ["sintomario.github.io"]},
            {"type": "TXT", "name": "_github-pages-challenge-sintomario", "expected": ["916cadce3fd23817bdc5ce2093a251"]}
        ]
    
    def resolve_dns_record(self, record_type: str, name: str) -> List[str]:
        """Resolver un registro DNS usando DNS estándar"""
        try:
            if name == "@":
                full_name = self.zone_name
            else:
                full_name = f"{name}.{self.zone_name}"
            
            if record_type == "TXT":
                answers = dns.resolver.resolve(full_name, "TXT")
                return [str(answer).strip('"') for answer in answers]
            else:
                answers = dns.resolver.resolve(full_name, record_type)
                return [str(answer) for answer in answers]
                
        except Exception as e:
            print(f"❌ Error resolviendo {record_type} {name}: {e}")
            return []
    
    def verify_record(self, record_type: str, name: str, expected: List[str]) -> bool:
        """Verificar un registro DNS específico"""
        print(f"🔍 Verificando {record_type} {name}...")
        
        actual = self.resolve_dns_record(record_type, name)
        
        if not actual:
            print(f"  ❌ No se encontró registro {record_type} {name}")
            return False
        
        # Verificar si alguno de los valores esperados coincide
        for exp_val in expected:
            if exp_val in actual:
                print(f"  ✅ {record_type} {name} -> {exp_val}")
                return True
        
        print(f"  ❌ {record_type} {name} -> {actual} (esperado: {expected})")
        return False
    
    def check_https_access(self) -> bool:
        """Verificar acceso HTTPS al sitio"""
        print("🔒 Verificando acceso HTTPS...")
        
        try:
            response = requests.get("https://sintomario.org", timeout=10)
            if response.status_code == 200:
                print("  ✅ HTTPS accesible (status 200)")
                return True
            else:
                print(f"  ❌ HTTPS devuelve status {response.status_code}")
                return False
        except Exception as e:
            print(f"  ❌ Error accediendo HTTPS: {e}")
            return False
    
    def check_ssl_certificate(self) -> bool:
        """Verificar certificado SSL"""
        print("🔐 Verificando certificado SSL...")
        
        try:
            import ssl
            import socket
            
            context = ssl.create_default_context()
            with socket.create_connection((self.zone_name, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=self.zone_name) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Verificar dominio en certificado
                    if self.zone_name in cert.get("subject", []):
                        print("  ✅ Certificado válido para el dominio")
                        return True
                    else:
                        print("  ❌ Certificado no coincide con el dominio")
                        return False
                        
        except Exception as e:
            print(f"  ❌ Error verificando SSL: {e}")
            return False
    
    def check_github_pages_status(self) -> bool:
        """Verificar estado de GitHub Pages"""
        print("📄 Verificando estado de GitHub Pages...")
        
        try:
            response = requests.get("https://api.github.com/repos/sintomario/SINTOMARIO.ORG/pages", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get("status", "unknown")
                url = data.get("html_url", "unknown")
                
                print(f"  📄 Status: {status}")
                print(f"  🌐 URL: {url}")
                
                if status == "built":
                    print("  ✅ GitHub Pages está construido y accesible")
                    return True
                else:
                    print(f"  ⚠️ GitHub Pages status: {status}")
                    return False
            else:
                print(f"  ❌ Error consultando API de GitHub: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"  ❌ Error verificando GitHub Pages: {e}")
            return False
    
    def generate_verification_report(self) -> Dict:
        """Generar reporte completo de verificación"""
        from datetime import datetime
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "zone_name": self.zone_name,
            "dns_records": {},
            "https_access": False,
            "ssl_certificate": False,
            "github_pages_status": "unknown",
            "overall_status": "unknown"
        }
        
        # Verificar cada registro DNS
        all_dns_ok = True
        for record in self.expected_records:
            record_type = record["type"]
            record_name = record["name"]
            expected = record["expected"]
            
            is_ok = self.verify_record(record_type, record_name, expected)
            report["dns_records"][f"{record_type}_{record_name}"] = {
                "expected": expected,
                "actual": self.resolve_dns_record(record_type, record_name),
                "status": "ok" if is_ok else "error"
            }
            
            if not is_ok:
                all_dns_ok = False
        
        # Verificar acceso HTTPS
        https_ok = self.check_https_access()
        report["https_access"] = https_ok
        
        # Verificar certificado SSL
        ssl_ok = self.check_ssl_certificate()
        report["ssl_certificate"] = ssl_ok
        
        # Verificar estado de GitHub Pages
        github_ok = self.check_github_pages_status()
        report["github_pages_status"] = github_ok
        
        # Determinar estado general
        if all_dns_ok and https_ok and ssl_ok and github_ok:
            report["overall_status"] = "ready"
        elif all_dns_ok:
            report["overall_status"] = "dns_ready"
        else:
            report["overall_status"] = "needs_fixes"
        
        # Guardar reporte
        reports_dir = Path("reports")
        reports_dir.mkdir(exist_ok=True)
        
        with open(reports_dir / "dns-verification.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report
    
    def run_verification(self) -> None:
        """Ejecutar verificación completa"""
        print("🔍 SINTOMARIO.ORG - Verificación DNS Completa")
        print("=" * 50)
        
        report = self.generate_verification_report()
        
        print("\n" + "=" * 50)
        print("📊 RESUMEN DE VERIFICACIÓN")
        print("=" * 50)
        
        status_emoji = {
            "ready": "✅ LISTO PARA PRODUCCIÓN",
            "dns_ready": "⏳ DNS LISTO (esperando propagación)",
            "needs_fixes": "❌ REQUIERE CORRECCIONES",
            "unknown": "❓ ESTADO DESCONOCIDO"
        }
        
        print(f"🎯 Estado general: {status_emoji.get(report['overall_status'], '❓')} {report['overall_status'].upper()}")
        
        # Recomendaciones
        print("\n📋 RECOMENDACIONES:")
        if report["overall_status"] == "ready":
            print("  ✅ Todo está configurado correctamente")
            print("  🌐 El sitio debería ser accesible en https://sintomario.org")
        elif report["overall_status"] == "dns_ready":
            print("  ⏱️ Esperar 5-30 minutos para propagación DNS completa")
            print("  🔄 Ejecutar verificación nuevamente en unos minutos")
        else:
            print("  🔧 Revisar configuración DNS en Cloudflare Dashboard")
            print("  📋 Verificar que todos los registros estén presentes")
            print("  🔒 Asegurar que SSL/TLS esté en modo Full (Strict)")
        
        print(f"\n📄 Reporte completo guardado en: reports/dns-verification.json")


def main():
    """Función principal"""
    verifier = CloudflareVerify()
    verifier.run_verification()


if __name__ == "__main__":
    main()
