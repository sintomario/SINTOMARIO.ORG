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

## Ejecución
```bash
# Build completo
python motor/sintomario_motor.py --output ./public

# Dry run para validar
python motor/sintomario_motor.py --dry-run --verbose
```

## Deploy
El deploy es automático via GitHub Actions al hacer push a la rama main.
