#!/bin/bash
# SINTOMARIO.ORG — Script Maestro de Build (Unix/Linux/Mac)
# PIPELINE OFICIAL - Modo Estricto: falla ante errores, warnings, placeholders, assets faltantes
# v5.0 — Marzo 2026

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Importar detector de Python
source "$(dirname "$0")/scripts/python_detector.py"

echo "============================================"
echo " SINTOMARIO.ORG — Build System STRICT"
echo " v5.0 — Marzo 2026"
echo "============================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Función para manejar errores
error_exit() {
    echo -e "${RED}[ERROR]${NC} $1"
    ERRORS=$((ERRORS + 1))
    exit 1
}

# Función para manejar warnings (en modo estricto, los warnings también fallan)
strict_warning() {
    echo -e "${YELLOW}[STRICT]${NC} $1"
    ERRORS=$((ERRORS + 1))
    exit 1
}

# Detectar comando de Python
PYTHON_CMD=$(python3 -c "import sys; print('python3' if sys.platform != 'win32' else 'python')" 2>/dev/null || echo "python3")

echo "🐍 Usando Python: $PYTHON_CMD"

# Verificar entorno virtual
if [ -d ".venv" ]; then
    echo -e "${GREEN}[OK]${NC} Entorno virtual detectado"
else
    strict_warning "No se detectó entorno virtual - Requerido para build reproducible"
fi

# Verificar config.json existe
if [ ! -f "config.json" ]; then
    strict_warning "config.json no encontrado - Requerido para configuración unificada"
fi

echo ""
echo "[1/9] Limpiando directorio public..."
if [ -d "public" ]; then
    rm -rf public
    echo -e "${GREEN}      ✓${NC} Directorio public eliminado"
fi
mkdir -p public
echo -e "${GREEN}      ✓${NC} Directorio public creado"

echo ""
echo "[2/9] Verificando archivos críticos..."
REQUIRED_FILES=(
    "motor/sintomario_motor.py"
    "corpus/entidades.json"
    "corpus/contextos.json"
    "corpus/perspectivas.json"
    "corpus/productos.json"
    "templates/lectura.html"
    "templates/base.html"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        strict_warning "Archivo crítico faltante: $file"
    fi
done
echo -e "${GREEN}      ✓${NC} Todos los archivos críticos presentes"

echo ""
echo "[3/9] Generando corpus principal..."
$PYTHON_CMD motor/sintomario_motor.py --output ./public --verbose
if [ $? -ne 0 ]; then
    error_exit "Fallo en generación de corpus principal"
fi
echo -e "${GREEN}      ✓${NC} Corpus generado"

echo ""
echo "[4/9] Generando home y páginas estáticas..."
$PYTHON_CMD motor/generate_static_pages.py --output ./public
if [ $? -ne 0 ]; then
    strict_warning "Fallo en generación de páginas estáticas (home, sobre, etc.)"
fi
echo -e "${GREEN}      ✓${NC} Páginas estáticas generadas"

echo ""
echo "[5/9] Generando hubs de navegación..."
if $PYTHON_CMD scripts/generate_hubs.py --output ./public --all; then
    echo -e "${GREEN}      ✓${NC} Hubs generados correctamente"
else
    strict_warning "Fallo en generación de hubs"
fi

echo ""
echo "[6/9] Validando SEO estricto..."
if $PYTHON_CMD scripts/validate_seo.py --public-dir ./public --strict; then
    echo -e "${GREEN}      ✓${NC} Validación SEO completada"
else
    strict_warning "Validación SEO encontró errores críticos"
fi

echo ""
echo "[7/9] Verificando output sin placeholders..."
PLACEHOLDER_COUNT=$(grep -r "{{.*}}" public/ 2>/dev/null | wc -l || echo "0")
if [ "$PLACEHOLDER_COUNT" -gt 0 ]; then
    strict_warning "Se encontraron $PLACEHOLDER_COUNT placeholders sin resolver en el output"
fi
echo -e "${GREEN}      ✓${NC} Sin placeholders sin resolver"

echo ""
echo "[8/9] Verificando archivos críticos de output..."
CRITICAL_OUTPUT=(
    "public/index.html"
    "public/sitemap.xml"
    "public/robots.txt"
    "public/sobre/index.html"
)

for file in "${CRITICAL_OUTPUT[@]}"; do
    if [ ! -f "$file" ]; then
        strict_warning "Archivo de output crítico faltante: $file"
    fi
done
echo -e "${GREEN}      ✓${NC} Todos los archivos de output críticos presentes"

echo ""
echo "[9/9] Verificando canonical URLs..."
CANONICAL_MISSING=$(grep -L "canonical" public/*/index.html 2>/dev/null | wc -l || echo "0")
if [ "$CANONICAL_MISSING" -gt 0 ]; then
    strict_warning "$CANONICAL_MISSING páginas sin canonical URL"
fi
echo -e "${GREEN}      ✓${NC} Canonical URLs presentes"

# Contar archivos generados
HTML_COUNT=$(find public -name "*.html" | wc -l)
JSON_COUNT=$(find public -name "*.json" | wc -l)

echo ""
echo "============================================"
echo " BUILD COMPLETADO - MODO STRICT"
echo "============================================"
echo ""
echo "Archivos generados:"
echo "  - HTML: $HTML_COUNT"
echo "  - JSON: $JSON_COUNT"
echo ""
echo "Validaciones:"
echo "  - Archivos críticos: ✓"
echo "  - Sin placeholders: ✓"
echo "  - SEO validado: ✓"
echo "  - Canonical presente: ✓"
echo ""
echo "Errores: $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ BUILD EXITOSO${NC}"
    exit 0
else
    echo -e "${RED}❌ BUILD FALLIDO${NC}"
    exit 1
fi
