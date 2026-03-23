#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Generador de Reportes Ejecutivos
Genera reportes consolidados del estado del proyecto.
"""

import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

class ReportGenerator:
    """Generador de reportes ejecutivos."""
    
    def __init__(self, project_dir: str = "."):
        self.project_dir = Path(project_dir)
        self.report_data = {}
        
    def generate_executive_summary(self) -> Dict[str, Any]:
        """Generar resumen ejecutivo completo."""
        
        print("📊 Generando resumen ejecutivo...")
        
        self.report_data = {
            "timestamp": datetime.now().isoformat(),
            "project": {
                "name": "SINTOMARIO.ORG",
                "version": "4.0",
                "tagline": "El diccionario del síntoma",
                "url": "https://sintomario.org"
            },
            "corpus": self._get_corpus_stats(),
            "generation": self._get_generation_stats(),
            "seo": self._get_seo_stats(),
            "structure": self._get_structure_stats(),
            "performance": self._get_performance_stats(),
            "deployment": self._get_deployment_readiness()
        }
        
        return self.report_data
    
    def _get_corpus_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas del corpus."""
        corpus_dir = self.project_dir / "corpus"
        
        stats = {
            "entidades": 0,
            "contextos": 0,
            "perspectivas": 0,
            "productos": 0,
            "nodos_totales": 0
        }
        
        # Contar entidades
        entidades_file = corpus_dir / "entidades.json"
        if entidades_file.exists():
            with open(entidades_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                stats["entidades"] = len(data)
        
        # Contar contextos
        contextos_file = corpus_dir / "contextos.json"
        if contextos_file.exists():
            with open(contextos_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                stats["contextos"] = len(data)
        
        # Contar perspectivas
        perspectivas_file = corpus_dir / "perspectivas.json"
        if perspectivas_file.exists():
            with open(perspectivas_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                stats["perspectivas"] = len(data)
        
        # Contar productos
        productos_file = corpus_dir / "productos.json"
        if productos_file.exists():
            with open(productos_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                stats["productos"] = len(data)
        
        # Calcular nodos totales
        stats["nodos_totales"] = stats["entidades"] * stats["contextos"]
        
        return stats
    
    def _get_generation_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas de generación."""
        report_file = self.project_dir / "reports" / "build-report.json"
        
        if report_file.exists():
            with open(report_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        return {"status": "no_build_yet"}
    
    def _get_seo_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas SEO."""
        seo_report = self.project_dir / "reports" / "seo-validation-report.json"
        
        if seo_report.exists():
            with open(seo_report, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    "average_score": data.get("summary", {}).get("average_score", 0),
                    "indexable_percentage": data.get("summary", {}).get("pass_rate", 0),
                    "perfect_nodes": len(data.get("perfect_nodes", [])),
                    "nodes_with_issues": len(data.get("nodes_with_issues", [])),
                    "top_issues": data.get("top_issues", [])[:3]
                }
        
        return {"status": "not_validated"}
    
    def _get_structure_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas de estructura."""
        public_dir = self.project_dir / "public"
        
        if not public_dir.exists():
            return {"status": "not_generated"}
        
        # Contar archivos
        html_files = list(public_dir.rglob("*.html"))
        json_files = list(public_dir.rglob("*.json"))
        
        # Contar directorios de nodos
        cuerpo_dir = public_dir / "cuerpo"
        entidades_dirs = list(cuerpo_dir.glob("*/")) if cuerpo_dir.exists() else []
        
        return {
            "total_html_files": len(html_files),
            "total_json_files": len(json_files),
            "entidades_directories": len(entidades_dirs),
            "has_sitemap": (public_dir / "sitemap.xml").exists(),
            "has_robots": (public_dir / "robots.txt").exists(),
            "has_cname": (public_dir / "CNAME").exists(),
            "size_mb": self._get_directory_size(public_dir)
        }
    
    def _get_directory_size(self, directory: Path) -> float:
        """Calcular tamaño de directorio en MB."""
        total_size = 0
        for file in directory.rglob("*"):
            if file.is_file():
                total_size += file.stat().st_size
        return round(total_size / (1024 * 1024), 2)
    
    def _get_performance_stats(self) -> Dict[str, Any]:
        """Obtener estadísticas de rendimiento."""
        # Leer último build report
        report_file = self.project_dir / "reports" / "build-report.json"
        
        if report_file.exists():
            with open(report_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                build_info = data.get("build_info", {})
                return {
                    "last_build_duration": build_info.get("duration_seconds", 0),
                    "last_build_timestamp": build_info.get("timestamp", "unknown"),
                    "motor_version": build_info.get("motor_version", "unknown"),
                    "nodes_per_second": round(
                        data.get("corpus_stats", {}).get("total_nodes", 0) / 
                        max(build_info.get("duration_seconds", 1), 0.1), 2
                    )
                }
        
        return {"status": "no_data"}
    
    def _get_deployment_readiness(self) -> Dict[str, Any]:
        """Evaluar preparación para deployment."""
        checks = {
            "corpus_complete": False,
            "motor_functional": False,
            "templates_ready": False,
            "github_actions": False,
            "build_successful": False,
            "seo_validated": False,
            "all_checks_pass": False
        }
        
        # Verificar corpus
        corpus_files = ["entidades.json", "contextos.json", "perspectivas.json", "productos.json"]
        checks["corpus_complete"] = all(
            (self.project_dir / "corpus" / f).exists() for f in corpus_files
        )
        
        # Verificar motor
        checks["motor_functional"] = (self.project_dir / "motor" / "sintomario_motor.py").exists()
        
        # Verificar templates
        template_files = ["base.html", "lectura.html", "index.html", "sobre.html"]
        checks["templates_ready"] = all(
            (self.project_dir / "templates" / f).exists() for f in template_files
        )
        
        # Verificar GitHub Actions
        checks["github_actions"] = (self.project_dir / ".github" / "workflows" / "build-deploy.yml").exists()
        
        # Verificar build
        checks["build_successful"] = (self.project_dir / "public" / "sitemap.xml").exists()
        
        # Verificar SEO
        checks["seo_validated"] = (self.project_dir / "reports" / "seo-validation-report.json").exists()
        
        # Verificar si todos los checks pasan
        checks["all_checks_pass"] = all(checks.values())
        
        return checks
    
    def save_report(self, output_path: str = "reports/executive-summary.json"):
        """Guardar reporte ejecutivo."""
        if not self.report_data:
            self.generate_executive_summary()
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.report_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Reporte ejecutivo guardado: {output_path}")
        return output_path
    
    def print_summary(self):
        """Imprimir resumen en consola."""
        if not self.report_data:
            self.generate_executive_summary()
        
        data = self.report_data
        
        print("\n" + "="*60)
        print(f"📊 RESUMEN EJECUTIVO: {data['project']['name']}")
        print("="*60)
        
        # Corpus
        corpus = data.get("corpus", {})
        print(f"\n📚 CORPUS:")
        print(f"   Entidades: {corpus.get('entidades', 0)}")
        print(f"   Contextos: {corpus.get('contextos', 0)}")
        print(f"   Perspectivas: {corpus.get('perspectivas', 0)}")
        print(f"   Productos: {corpus.get('productos', 0)}")
        print(f"   Nodos totales: {corpus.get('nodos_totales', 0)}")
        
        # SEO
        seo = data.get("seo", {})
        print(f"\n🔍 SEO:")
        if "average_score" in seo:
            print(f"   Score promedio: {seo['average_score']}/100")
            print(f"   Indexables: {seo.get('indexable_percentage', 0)}%")
            print(f"   Nodos perfectos: {seo.get('perfect_nodes', 0)}")
        
        # Estructura
        structure = data.get("structure", {})
        print(f"\n🏗️  ESTRUCTURA:")
        if "total_html_files" in structure:
            print(f"   Archivos HTML: {structure['total_html_files']}")
            print(f"   Archivos JSON: {structure['total_json_files']}")
            print(f"   Tamaño total: {structure.get('size_mb', 0)} MB")
        
        # Performance
        perf = data.get("performance", {})
        print(f"\n⚡ RENDIMIENTO:")
        if "last_build_duration" in perf:
            print(f"   Último build: {perf['last_build_duration']}s")
            print(f"   Nodos/segundo: {perf.get('nodes_per_second', 0)}")
        
        # Deployment
        deploy = data.get("deployment", {})
        print(f"\n🚀 PREPARACIÓN DEPLOYMENT:")
        
        checks = [
            ("Corpus completo", deploy.get('corpus_complete', False)),
            ("Motor funcional", deploy.get('motor_functional', False)),
            ("Templates listos", deploy.get('templates_ready', False)),
            ("GitHub Actions", deploy.get('github_actions', False)),
            ("Build exitoso", deploy.get('build_successful', False)),
            ("SEO validado", deploy.get('seo_validated', False))
        ]
        
        for name, status in checks:
            icon = "✅" if status else "❌"
            print(f"   {icon} {name}")
        
        all_pass = deploy.get('all_checks_pass', False)
        print(f"\n{'✅ LISTO PARA PRODUCCIÓN' if all_pass else '⚠️  PENDIENTES PARA PRODUCCIÓN'}")
        
        print("="*60)

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Generador de Reportes Ejecutivos")
    parser.add_argument("--output", default="./reports/executive-summary.json", help="Ruta de salida")
    parser.add_argument("--print", action="store_true", help="Imprimir resumen en consola")
    
    args = parser.parse_args()
    
    generator = ReportGenerator()
    
    # Generar reporte
    generator.generate_executive_summary()
    
    # Guardar
    generator.save_report(args.output)
    
    # Imprimir si se solicita
    if args.print:
        generator.print_summary()

if __name__ == "__main__":
    main()
