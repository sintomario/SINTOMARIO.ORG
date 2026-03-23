#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Sistema de Validación SEO
Valida la calidad SEO de todos los nodos generados.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass

@dataclass
class SEOValidationResult:
    """Resultado de validación SEO."""
    url: str
    title_length: int
    description_length: int
    has_canonical: bool
    has_schema: bool
    has_og_tags: bool
    word_count: int
    is_indexable: bool
    issues: List[str]
    score: int  # 0-100

class SEOValidator:
    """Validador SEO para nodos SINTOMARIO."""
    
    def __init__(self, public_dir: str = "public"):
        self.public_dir = Path(public_dir)
        self.results: List[SEOValidationResult] = []
        
    def validate_all_nodes(self) -> List[SEOValidationResult]:
        """Validar todos los nodos HTML generados."""
        print("🔍 Validando SEO de nodos...")
        
        # Encontrar todos los index.html en el directorio público
        html_files = list(self.public_dir.rglob("index.html"))
        
        for html_file in html_files:
            # Ignorar el index.html raíz por ahora
            if html_file.parent == self.public_dir:
                continue
                
            result = self._validate_node(html_file)
            self.results.append(result)
        
        return self.results
    
    def _validate_node(self, html_file: Path) -> SEOValidationResult:
        """Validar un nodo HTML individual."""
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        url = self._extract_url(html_file)
        issues = []
        
        # Validar title
        title = self._extract_title(content)
        title_length = len(title) if title else 0
        if title_length > 60:
            issues.append(f"Title demasiado largo ({title_length} > 60)")
        elif title_length < 30:
            issues.append(f"Title demasiado corto ({title_length} < 30)")
        
        # Validar meta description
        description = self._extract_meta_description(content)
        desc_length = len(description) if description else 0
        if desc_length > 155:
            issues.append(f"Description demasiado larga ({desc_length} > 155)")
        elif desc_length < 70:
            issues.append(f"Description demasiado corta ({desc_length} < 70)")
        
        # Validar canonical
        has_canonical = 'rel="canonical"' in content
        if not has_canonical:
            issues.append("Falta URL canónica")
        
        # Validar schema JSON-LD
        has_schema = 'application/ld+json' in content
        if not has_schema:
            issues.append("Falta schema JSON-LD")
        
        # Validar Open Graph
        has_og = 'property="og:' in content
        if not has_og:
            issues.append("Faltan tags Open Graph")
        
        # Validar Twitter Card
        has_twitter = 'name="twitter:' in content
        if not has_twitter:
            issues.append("Faltan Twitter Card tags")
        
        # Contar palabras del contenido
        word_count = self._count_words(content)
        is_indexable = word_count >= 50
        
        if word_count < 50:
            issues.append(f"Word count muy bajo ({word_count} < 50)")
        
        # Calcular score
        score = self._calculate_score(
            title_length, desc_length, has_canonical, 
            has_schema, has_og, has_twitter, word_count
        )
        
        return SEOValidationResult(
            url=url,
            title_length=title_length,
            description_length=desc_length,
            has_canonical=has_canonical,
            has_schema=has_schema,
            has_og_tags=has_og,
            word_count=word_count,
            is_indexable=is_indexable,
            issues=issues,
            score=score
        )
    
    def _extract_url(self, html_file: Path) -> str:
        """Extraer URL canónica del archivo."""
        rel_path = html_file.parent.relative_to(self.public_dir)
        return f"https://sintomario.org/{rel_path.as_posix()}/"
    
    def _extract_title(self, content: str) -> str:
        """Extraer title tag."""
        match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        return match.group(1) if match else ""
    
    def _extract_meta_description(self, content: str) -> str:
        """Extraer meta description."""
        match = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]*)"', content, re.IGNORECASE)
        if not match:
            match = re.search(r'<meta[^>]*content="([^"]*)"[^>]*name="description"', content, re.IGNORECASE)
        return match.group(1) if match else ""
    
    def _count_words(self, content: str) -> int:
        """Contar palabras en el contenido."""
        # Eliminar HTML tags
        text = re.sub(r'<[^>]+>', '', content)
        # Eliminar scripts y styles
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
        # Contar palabras
        words = re.findall(r'\b\w+\b', text)
        return len(words)
    
    def _calculate_score(self, title_len: int, desc_len: int, 
                         has_canonical: bool, has_schema: bool,
                         has_og: bool, has_twitter: bool, word_count: int) -> int:
        """Calcular score SEO (0-100)."""
        score = 0
        
        # Title (20 puntos)
        if 30 <= title_len <= 60:
            score += 20
        elif title_len > 0:
            score += 10
        
        # Description (20 puntos)
        if 70 <= desc_len <= 155:
            score += 20
        elif desc_len > 0:
            score += 10
        
        # Canonical (15 puntos)
        if has_canonical:
            score += 15
        
        # Schema (20 puntos)
        if has_schema:
            score += 20
        
        # Social tags (15 puntos)
        if has_og and has_twitter:
            score += 15
        elif has_og or has_twitter:
            score += 8
        
        # Content (10 puntos)
        if word_count >= 100:
            score += 10
        elif word_count >= 50:
            score += 5
        
        return score
    
    def generate_report(self, output_path: str = "reports/seo-validation-report.json"):
        """Generar reporte de validación."""
        if not self.results:
            self.validate_all_nodes()
        
        # Estadísticas
        total = len(self.results)
        indexable = sum(1 for r in self.results if r.is_indexable)
        avg_score = sum(r.score for r in self.results) / total if total > 0 else 0
        
        # Problemas comunes
        all_issues = []
        for r in self.results:
            all_issues.extend(r.issues)
        
        issue_counts = {}
        for issue in all_issues:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
        
        # Top 10 problemas
        top_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        report = {
            "summary": {
                "total_nodes": total,
                "indexable_nodes": indexable,
                "non_indexable": total - indexable,
                "average_score": round(avg_score, 2),
                "pass_rate": round((indexable / total * 100), 2) if total > 0 else 0
            },
            "score_distribution": {
                "excellent (90-100)": sum(1 for r in self.results if 90 <= r.score <= 100),
                "good (70-89)": sum(1 for r in self.results if 70 <= r.score < 90),
                "fair (50-69)": sum(1 for r in self.results if 50 <= r.score < 70),
                "poor (0-49)": sum(1 for r in self.results if r.score < 50)
            },
            "top_issues": [
                {"issue": issue, "count": count, "percentage": round(count/total*100, 2)}
                for issue, count in top_issues
            ],
            "nodes_with_issues": [
                {
                    "url": r.url,
                    "score": r.score,
                    "issues": r.issues,
                    "word_count": r.word_count
                }
                for r in self.results if r.issues
            ],
            "perfect_nodes": [
                {"url": r.url, "score": r.score}
                for r in self.results if not r.issues and r.score >= 90
            ]
        }
        
        # Guardar reporte
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Reporte SEO guardado en: {output_path}")
        
        # Imprimir resumen
        print(f"\n📊 RESUMEN DE VALIDACIÓN SEO")
        print(f"   Total nodos: {total}")
        print(f"   Nodos indexables: {indexable} ({report['summary']['pass_rate']}%)")
        print(f"   Score promedio: {report['summary']['average_score']}/100")
        print(f"   Nodos perfectos: {len(report['perfect_nodes'])}")
        print(f"   Nodos con issues: {len(report['nodes_with_issues'])}")
        
        if top_issues:
            print(f"\n⚠️  Problemas más comunes:")
            for issue, count in top_issues[:5]:
                print(f"   - {issue}: {count} nodos")
        
        return report

def main():
    """Función principal."""
    import argparse
    
    parser = argparse.ArgumentParser(description="SINTOMARIO.ORG — Validador SEO")
    parser.add_argument("--public-dir", default="./public", help="Directorio público")
    parser.add_argument("--output", default="./reports/seo-validation-report.json", help="Ruta del reporte")
    parser.add_argument("--verbose", action="store_true", help="Mostrar detalles de cada nodo")
    
    args = parser.parse_args()
    
    validator = SEOValidator(public_dir=args.public_dir)
    
    # Validar todos los nodos
    results = validator.validate_all_nodes()
    
    if args.verbose:
        print("\n📋 Detalles de validación:")
        for result in results[:10]:  # Mostrar primeros 10
            print(f"\n{result.url}")
            print(f"  Score: {result.score}/100")
            print(f"  Title: {result.title_length} chars")
            print(f"  Desc: {result.description_length} chars")
            print(f"  Words: {result.word_count}")
            if result.issues:
                print(f"  Issues: {', '.join(result.issues)}")
    
    # Generar reporte
    validator.generate_report(output_path=args.output)

if __name__ == "__main__":
    main()
