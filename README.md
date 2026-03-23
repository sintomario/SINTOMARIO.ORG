# SINTOMARIO.ORG

Plataforma holística de información optimizada para SEO que responde búsquedas de síntomas con artículos de profundidad real.

## Stack Técnico
- **Motor**: Python 3.11
- **Hosting**: GitHub Pages
- **DNS**: Cloudflare
- **Dominio**: sintomario.org

## Estructura del Proyecto
- `corpus/` - JSON de entidades, contextos y productos
- `motor/` - Motor Python generador
- `templates/` - Templates HTML
- `public/` - Output generado (no versionado)
- `reports/` - Reportes de build
- `logs/` - Logs del motor

## Instalación
```bash
# Clonar repositorio
git clone https://github.com/sintomario/SINTOMARIO.ORG
cd SINTOMARIO.ORG

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

## Ejecución Completa (Build Total)

### Windows
```batch
# Ejecutar build completo
build.bat
```

### Unix/Linux/Mac
```bash
# Hacer ejecutable y ejecutar
chmod +x build.sh
./build.sh
```

### Pipeline Manual
```bash
# 1. Generar corpus principal (400 nodos)
python motor/sintomario_motor.py --output ./public --verbose

# 2. Generar hubs de navegación
python scripts/generate_hubs.py --output ./public --all

# 3. Generar páginas de autores enriquecidas
python scripts/enrich_perspectives.py --generate-pages

# 4. Validar SEO
python scripts/validate_seo.py --public-dir ./public

# 5. Generar reporte ejecutivo
python scripts/generate_report.py --output ./reports/executive-summary.json --print
```

---

## Scripts Disponibles

| Script | Descripción | Uso |
|--------|-------------|-----|
| `build.bat` / `build.sh` | Build completo automático | `build.bat` o `./build.sh` |
| `motor/sintomario_motor.py` | Genera corpus principal | `python motor/sintomario_motor.py --verbose` |
| `scripts/generate_hubs.py` | Genera hubs de navegación | `python scripts/generate_hubs.py --all` |
| `scripts/enrich_perspectives.py` | Enriquece perspectivas | `python scripts/enrich_perspectives.py --all` |
| `scripts/validate_seo.py` | Valida calidad SEO | `python scripts/validate_seo.py` |
| `scripts/generate_report.py` | Genera reportes | `python scripts/generate_report.py --print` |
| `scripts/setup_search.py` | Configura Pagefind | `python scripts/setup_search.py --all` |

---
```bash
# Build completo
python motor/sintomario_motor.py --output ./public

# Dry run para validar
python motor/sintomario_motor.py --dry-run --verbose
