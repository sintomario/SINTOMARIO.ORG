#!/bin/bash
# SINTOMARIO.ORG — Script Maestro de Build (Unix/Linux/Mac)
# Ejecuta todo el pipeline de generación completo

set -e  # Exit on error

# Importar detector de Python
source "$(dirname "$0")/scripts/python_detector.py"

echo "============================================"
echo " SINTOMARIO.ORG — Build System"
echo " v4.0 — Marzo 2026"
echo "============================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Detectar comando de Python
PYTHON_CMD=$(python3 -c "import sys; print('python3' if sys.platform != 'win32' else 'python')" 2>/dev/null || echo "python3")

echo "🐍 Usando Python: $PYTHON_CMD"

# Verificar entorno virtual
if [ -d ".venv" ]; then
    echo -e "${GREEN}[OK]${NC} Entorno virtual detectado"
else
    echo -e "${YELLOW}[WARN]${NC} No se detectó entorno virtual"
fi

echo ""
echo "[1/8] Limpiando directorio public..."
if [ -d "public" ]; then
    rm -rf public
    echo -e "${GREEN}      ✓${NC} Directorio public eliminado"
fi
mkdir -p public
echo -e "${GREEN}      ✓${NC} Directorio public creado"

echo ""
echo "[2/8] Generando corpus principal..."
$PYTHON_CMD motor/sintomario_motor.py --output ./public --verbose
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR]${NC} Fallo en generación de corpus"
    exit 1
fi

echo ""
echo "[3/8] Generando hubs de navegación..."
if $PYTHON_CMD scripts/generate_hubs.py --output ./public --all; then
    echo -e "${GREEN}      ✓${NC} Hubs generados correctamente"
else
    echo -e "${YELLOW}[WARN]${NC} Algunos hubs pueden no haberse generado correctamente"
    echo "      Revisar logs para detalles específicos"
fi

echo ""
echo "[4/8] Generando páginas de autores..."
if $PYTHON_CMD scripts/enrich_perspectives.py --generate-pages; then
    echo -e "${GREEN}      ✓${NC} Páginas de autores generadas correctamente"
else
    echo -e "${YELLOW}[WARN]${NC} Algunas páginas de autores pueden no haberse generado"
    echo "      Revisar logs para detalles específicos"
fi

echo ""
echo "[5/8] Validando SEO..."
if $PYTHON_CMD scripts/validate_seo.py --public-dir ./public; then
    echo -e "${GREEN}      ✓${NC} Validación SEO completada"
else
    echo -e "${YELLOW}[WARN]${NC} Validación SEO encontró problemas"
    echo "      Revisar reports/seo-validation-report.json para detalles"
fi

echo ""
echo "[6/8] Generando reporte ejecutivo..."
if $PYTHON_CMD scripts/generate_report.py --output ./reports/executive-summary.json; then
    echo -e "${GREEN}      ✓${NC} Reporte ejecutivo generado"
else
    echo -e "${YELLOW}[WARN]${NC} No se pudo generar reporte ejecutivo"
    echo "      Revisar logs para detalles específicos"
fi

echo ""
echo "[7/8] Configurando búsqueda Pagefind (opcional)..."
echo "      Nota: Requiere Node.js y npm instalados"
echo "      Ejecuta manualmente: $PYTHON_CMD scripts/setup_search.py --all"

echo ""
echo "[8/8] Verificando estructura..."
if [ -f "public/sitemap.xml" ]; then
    echo -e "${GREEN}      ✓${NC} Sitemap generado"
else
    echo -e "${YELLOW}[WARN]${NC} Sitemap no encontrado"
fi

if [ -f "public/robots.txt" ]; then
    echo -e "${GREEN}      ✓${NC} robots.txt generado"
else
    echo -e "${YELLOW}[WARN]${NC} robots.txt no encontrado"
fi

# Contar archivos generados
HTML_COUNT=$(find public -name "*.html" | wc -l)
JSON_COUNT=$(find public -name "*.json" | wc -l)

echo ""
echo "============================================"
echo " BUILD COMPLETADO"
echo "============================================"
echo ""
echo "Archivos generados:"
echo "  - HTML: $HTML_COUNT"
echo "  - JSON: $JSON_COUNT"
echo ""
echo "Próximos pasos:"
echo "  1. Revisar reporte: reports/executive-summary.json"
echo "  2. Verificar SEO: reports/seo-validation-report.json"
echo "  3. Hacer commit: git add . && git commit -m 'build: actualización'"
echo "  4. Hacer push: git push origin main"
echo "  5. GitHub Actions deployará automáticamente"
echo ""
echo "Para configurar DNS:"
echo "  - Ve a Cloudflare Dashboard"
echo "  - Configura 4 registros A apuntando a GitHub Pages"
echo "  - Espera propagación DNS (24-48 horas)"
echo ""
