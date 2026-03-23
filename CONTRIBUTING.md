# Contributing to SINTOMARIO.ORG

Gracias por tu interés en contribuir a SINTOMARIO.ORG. Este documento describe cómo puedes participar en el proyecto.

## 🎯 **Tipos de Contribuciones**

### **Contenido**
- Nuevas entidades médicas para el corpus
- Contextos semánticos adicionales
- Perspectivas teóricas complementarias
- Mejoras en word count y calidad

### **Código**
- Mejoras en el motor de generación
- Optimizaciones de rendimiento
- Nuevos scripts de análisis
- Fixes de bugs y seguridad

### **Documentación**
- Mejoras en esta guía
- Traducciones a otros idiomas
- Ejemplos de uso
- Casos de estudio

### **Diseño**
- Mejoras en el CSS/HTML
- Nuevos templates
- Optimizaciones móviles
- Accesibilidad WCAG

## 🚀 **Proceso de Contribución**

### **1. Fork el Repositorio**
```bash
# Fork en GitHub UI
git clone https://github.com/TU_USERNAME/SINTOMARIO.ORG.git
cd SINTOMARIO.ORG
```

### **2. Setup del Entorno**
```bash
# Crear entorno virtual
python -m venv .venv
source .venv/bin/activate  # Unix/Mac
# o
.venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Configurar variables
cp .env.example .env
# Editar .env según necesites
```

### **3. Crear Rama**
```bash
git checkout -b feature/tu-contribucion
```

### **4. Hacer Cambios**
- Sigue las convenciones del código existente
- Agrega tests si aplica
- Actualiza documentación
- Verifica que el build funcione

### **5. Validar Cambios**
```bash
# Correr build completo
./build.sh  # Unix/Mac
# o
build.bat     # Windows

# Validar SEO
python scripts/validate_seo.py --public-dir ./public

# Correr tests (si existen)
pytest
```

### **6. Commit y Push**
```bash
git add .
git commit -m "feat: agregar tu contribución"

# Formato recomendado para commits:
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: actualización de documentación
# style: cambios de formato
# refactor: refactorización
# test: agregar/modificar tests
# chore: tareas de mantenimiento

git push origin feature/tu-contribucion
```

### **7. Pull Request**
- Crea PR desde GitHub UI
- Describe claramente los cambios
- Agrega screenshots si aplica
- Espera revisión y merge

## 📋 **Guías de Estilo**

### **Python**
- Seguir PEP 8
- Usar type hints cuando sea posible
- Nombres de funciones en snake_case
- Constantes en UPPER_CASE
- Docstrings para funciones públicas

### **JSON**
- 2 espacios para indentación
- Sin trailing commas
- Keys en snake_case
- Orden alfabético de propiedades

### **Markdown**
- Headers con # ## ### 
- Lists con -
- Code blocks con ```python
- Links en formato [texto](url)
- Sin HTML inline

### **Commits**
- Máximo 50 caracteres para el título
- Descripción detallada si es necesario
- Referenciar issues con #número

## 🏗️ **Estructura del Proyecto**

```
SINTOMARIO.ORG/
├── motor/              # Motor Python (no modificar sin revisión)
├── corpus/             # Datos de contenido (modificar con cuidado)
│   ├── entidades.json   # Entidades médicas
│   ├── contextos.json  # Contextos semánticos
│   ├── perspectivas.json # Perspectivas teóricas
│   └── productos.json  # Productos Amazon
├── templates/          # Templates HTML (mejoras bienvenidas)
├── css/              # Estilos (mejoras bienvenidas)
├── scripts/           # Scripts auxiliares (contribuciones abiertas)
└── docs/             # Documentación extendida
```

## ⚠️ **Consideraciones Especiales**

### **Contenido Médico**
- Todas las adiciones deben ser verificables
- Incluir fuentes cuando sea posible
- Mantener tono neutral e informativo
- No hacer diagnósticos ni recomendaciones médicas

### **Amazon Associates**
- Solo productos relevantes al síntoma/contexto
- Respetar disclosure requirements
- No hacer claims médicos sobre productos

### **SEO**
- Keywords naturales, no stuffing
- Meta descriptions únicas y descriptivas
- Alt text descriptivo para imágenes
- URLs canónicas correctas

## 🐛 **Reportar Issues**

### **Bugs**
- Usar template de bug report
- Incluir pasos para reproducir
- Especificar entorno (OS, Python version)
- Agregar logs si aplica

### **Feature Requests**
- Describir el problema a resolver
- Proponer solución si tienes ideas
- Considerar impacto en el proyecto general
- Evaluar complejidad de implementación

### **Contenido Issues**
- Especificar entidad/contexto afectado
- Explicar por qué el contenido es incorrecto
- Proponer corrección con fuentes
- Considerar impacto en otros nodos

## 🔄 **Proceso de Revisión**

### **Criterios de Evaluación**
1. **Calidad del código**: sigue estándares del proyecto
2. **Funcionalidad**: el build completo funciona
3. **Impacto**: beneficia al proyecto sin romper existente
4. **Documentación**: cambios bien documentados
5. **Tests**: includes pruebas cuando aplica

### **Tiempo de Respuesta**
- **Críticos**: 24-48 horas
- **Altos**: 3-5 días
- **Normales**: 1-2 semanas
- **Bajos**: cuando sea posible

## 📜 **Licencia**

Al contribuir, aceptas que tus cambios se publiquen bajo la misma licencia MIT del proyecto.

## 🤝 **Comunidad**

### **Canales de Comunicación**
- **Issues**: Para reportes y discusiones técnicas
- **Discussions**: Para preguntas generales
- **PRs**: Para contribuciones específicas

### **Conducta**
- Ser respetuoso y constructivo
- Aceptar feedback positivo y negativo
- Focalizar en lo que es mejor para el proyecto
- Ayudar a otros contribuyentes

## 🎉 **Reconocimiento**

Las contribuciones significativas serán reconocidas en:
- **README.md**: sección de contribuidores
- **CHANGELOG.md**: listado de cambios
- **Contexto del proyecto**: mención especial

---

Gracias por contribuir a hacer de SINTOMARIO.ORG un mejor recurso para la comprensión holística de los síntomas.
