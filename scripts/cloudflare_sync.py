#!/usr/bin/env python3
"""
SINTOMARIO.ORG - Cloudflare DNS Sync
Automatización de configuración DNS via API de Cloudflare
"""

import json
import os
import sys
import requests
from pathlib import Path
from typing import Dict, List, Optional

class CloudflareSync:
    def __init__(self, config_path: str = "config/cloudflare.json"):
        """Inicializar con configuración local"""
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.api_token = os.getenv("CLOUDFLARE_API_TOKEN")
        self.zone_id = self.config.get("zone_id")
        
        if not self.api_token:
            print("❌ ERROR: CLOUDFLARE_API_TOKEN no está en variables de entorno")
            sys.exit(1)
            
        if not self.zone_id:
            print("❌ ERROR: zone_id no encontrado en config/cloudflare.json")
            sys.exit(1)
    
    def _load_config(self) -> Dict:
        """Cargar configuración desde archivo JSON"""
        if not self.config_path.exists():
            print(f"❌ ERROR: Archivo de configuración no encontrado: {self.config_path}")
            sys.exit(1)
            
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ ERROR: JSON inválido en {self.config_path}: {e}")
            sys.exit(1)
    
    def _api_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Hacer request a API de Cloudflare"""
        url = f"https://api.cloudflare.com/client/v4{endpoint}"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data)
            elif method == "PATCH":
                response = requests.patch(url, headers=headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                raise ValueError(f"Método HTTP no soportado: {method}")
                
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"❌ ERROR API: {e}")
            sys.exit(1)
    
    def list_dns_records(self) -> List[Dict]:
        """Listar todos los registros DNS actuales"""
        print("📋 Consultando registros DNS actuales...")
        response = self._api_request("GET", f"/zones/{self.zone_id}/dns_records")
        return response.get("result", [])
    
    def get_dns_record(self, record_type: str, name: str) -> Optional[Dict]:
        """Obtener un registro DNS específico"""
        records = self.list_dns_records()
        for record in records:
            if record["type"] == record_type and record["name"] == name:
                return record
        return None
    
    def create_dns_record(self, record: Dict) -> Dict:
        """Crear un nuevo registro DNS"""
        print(f"➕ Creando registro {record['type']} {record['name']} -> {record['content']}")
        response = self._api_request("POST", f"/zones/{self.zone_id}/dns_records", record)
        return response.get("result", {})
    
    def update_dns_record(self, record_id: str, record: Dict) -> Dict:
        """Actualizar un registro DNS existente"""
        print(f"🔄 Actualizando registro {record['type']} {record['name']} -> {record['content']}")
        response = self._api_request("PUT", f"/zones/{self.zone_id}/dns_records/{record_id}", record)
        return response.get("result", {})
    
    def delete_dns_record(self, record_id: str, record: Dict) -> bool:
        """Eliminar un registro DNS"""
        record_type = record.get("type", "unknown")
        record_name = record.get("name", "unknown")
        print(f"🗑️ Eliminando registro {record_type} {record_name}")
        try:
            self._api_request("DELETE", f"/zones/{self.zone_id}/dns_records/{record_id}")
            return True
        except:
            return False
    
    def sync_records(self) -> bool:
        """Sincronizar registros DNS con la configuración deseada"""
        print(f"🌐 Sincronizando DNS para {self.config['zone_name']}")
        
        desired_records = self.config.get("records", [])
        current_records = self.list_dns_records()
        
        success = True
        changes_made = False
        
        # Crear mapa de registros actuales para búsqueda rápida
        current_map = {}
        for record in current_records:
            key = f"{record['type']}:{record['name']}"
            current_map[key] = record
        
        # Procesar cada registro deseado
        for desired in desired_records:
            key = f"{desired['type']}:{desired['name']}"
            
            if key in current_map:
                # El registro existe, verificar si necesita actualización
                current = current_map[key]
                if self._records_differ(current, desired):
                    self.update_dns_record(current["id"], desired)
                    changes_made = True
                # Marcar como procesado
                del current_map[key]
            else:
                # El registro no existe, crearlo
                self.create_dns_record(desired)
                changes_made = True
        
        # Eliminar registros sobrantes (excepto TXT de verificación si existe)
        for key, record in current_map.items():
            # No eliminar automáticamente registros TXT de verificación
            if record["type"] == "TXT" and "github-pages-challenge" in record["name"]:
                print(f"⚠️ Manteniendo registro de verificación: {record['name']}")
                continue
                
            print(f"⚠️ Registro sobrante detectado: {record['type']} {record['name']}")
            if not self.delete_dns_record(record["id"], record):
                success = False
        
        if changes_made:
            print("✅ Cambios DNS aplicados. Esperando propagación...")
            print("⏱️ La propagación puede tomar 5-30 minutos")
        else:
            print("✅ DNS ya está sincronizado")
            
        return success
    
    def _records_differ(self, current: Dict, desired: Dict) -> bool:
        """Verificar si dos registros DNS son diferentes"""
        # Campos importantes para comparar
        fields_to_check = ["content", "ttl", "proxied"]
        
        for field in fields_to_check:
            if current.get(field) != desired.get(field):
                return True
        return False
    
    def verify_ssl_mode(self) -> bool:
        """Verificar y configurar modo SSL/TLS"""
        desired_mode = self.config.get("ssl_mode", "full")
        print(f"🔒 Verificando modo SSL/TLS: {desired_mode}")
        
        try:
            # Obtener configuración SSL actual
            response = self._api_request("GET", f"/zones/{self.zone_id}/ssl/verification")
            current_settings = self._api_request("GET", f"/zones/{self.zone_id}/settings/ssl")
            
            if current_settings.get("result", {}).get("value") != desired_mode:
                print(f"🔄 Actualizando modo SSL a: {desired_mode}")
                self._api_request("PATCH", f"/zones/{self.zone_id}/settings/ssl", {
                    "value": desired_mode
                })
                return True
            else:
                print("✅ Modo SSL ya está configurado correctamente")
                return True
                
        except Exception as e:
            print(f"⚠️ No se pudo verificar/configurar SSL: {e}")
            return False
    
    def generate_report(self, changes_made: bool) -> Dict:
        """Generar reporte de sincronización"""
        from datetime import datetime
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "zone_name": self.config["zone_name"],
            "zone_id": self.zone_id,
            "changes_made": changes_made,
            "records_synced": len(self.config.get("records", [])),
            "ssl_mode": self.config.get("ssl_mode"),
            "status": "success" if changes_made else "no_changes"
        }
        
        # Guardar reporte
        reports_dir = Path("reports")
        reports_dir.mkdir(exist_ok=True)
        
        with open(reports_dir / "cloudflare-sync.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report
    
    def check(self) -> None:
        """Modo de verificación - solo mostrar estado actual"""
        print("🔍 MODO VERIFICACIÓN")
        print(f"📂 Zona: {self.config['zone_name']} ({self.zone_id})")
        
        current_records = self.list_dns_records()
        desired_records = self.config.get("records", [])
        
        print("\n📋 Registros DNS actuales:")
        for record in current_records:
            proxied_status = "🟠" if record.get("proxied") else "⚪"
            print(f"  {record['type']:4} {record['name']:20} -> {record['content']:30} {proxied_status}")
        
        print(f"\n📋 Registros deseados: {len(desired_records)}")
        for record in desired_records:
            print(f"  {record['type']:4} {record['name']:20} -> {record['content']:30}")
        
        # Verificar diferencias
        print("\n🔍 Análisis de diferencias:")
        differences_found = False
        
        current_map = {f"{r['type']}:{r['name']}": r for r in current_records}
        for desired in desired_records:
            key = f"{desired['type']}:{desired['name']}"
            if key not in current_map:
                print(f"  ➕ FALTA: {desired['type']} {desired['name']}")
                differences_found = True
            elif self._records_differ(current_map[key], desired):
                print(f"  🔄 DIFERENTE: {desired['type']} {desired['name']}")
                differences_found = True
        
        if not differences_found:
            print("  ✅ DNS está sincronizado")
    
    def apply(self) -> None:
        """Modo de aplicación - sincronizar cambios"""
        print("🚀 MODO APLICACIÓN")
        
        changes_made = self.sync_records()
        self.verify_ssl_mode()
        
        report = self.generate_report(changes_made)
        
        print(f"\n📊 Reporte guardado en: reports/cloudflare-sync.json")
        print(f"🌐 Visitar: https://dash.cloudflare.com/{self.config['zone_name']}/dns")


def main():
    """Función principal"""
    if len(sys.argv) != 2 or sys.argv[1] not in ["check", "apply"]:
        print("Uso: python scripts/cloudflare_sync.py [check|apply]")
        print("  check  - Verificar estado actual sin hacer cambios")
        print("  apply  - Aplicar sincronización de DNS")
        sys.exit(1)
    
    command = sys.argv[1]
    sync = CloudflareSync()
    
    if command == "check":
        sync.check()
    elif command == "apply":
        sync.apply()


if __name__ == "__main__":
    main()
