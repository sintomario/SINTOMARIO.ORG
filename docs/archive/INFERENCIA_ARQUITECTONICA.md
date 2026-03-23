# SINTOMARIO.ORG - Hipótesis Arquitectónica Inferida

*Documento de trabajo - Inferencia desde artefactos parciales del repositorio*  
*Última actualización: 23 de marzo de 2026*  
*Estado: HIPÓTESIS - Requiere validación contra código fuente real*

---

## 🎯 **Propósito del Documento**

Este documento es un **borrador arquitectónico** construido desde la evidencia parcial disponible en el repositorio. **No es documentación verificada** del sistema actual, sino una **hipótesis de trabajo** sobre cómo podría estar estructurado el proyecto basado en:

- README.md y archivos de documentación
- Estructura de carpetas visible
- Configuraciones JSON y variables de entorno
- Build scripts y workflows de GitHub Actions
- Patrones de nomenclatura y convenciones detectadas

**ADVERTENCIA**: Este documento contiene **inferencias no verificadas**. Usar únicamente como marco de trabajo para exploración y validación posterior contra el código fuente real.

---

## 🏗️ **Hipótesis de Arquitectura General**

### **Flujo Principal Inferido**
```
corpus/ (datos JSON) → motor/ (Python) → templates/ (HTML) → public/ (sitio estático)
```

El sistema parecería ser un **generador estático** que transforma datos estructurados en un sitio web completo mediante un pipeline automatizado.

### **Componentes Principales Hipotéticos**

#### **Módulo 1: Motor de Generación (`motor/`)**
- **Archivo principal**: `sintomario_motor.py`
- **Función inferida**: Orquestar todo el pipeline de generación
- **Entrada**: Archivos JSON del corpus + configuración
- **Salida**: HTML renderizado en `public/`
- **Características hipotéticas**:
  - Loop principal de 400 iteraciones (20 entidades × 20 contextos)
  - Sistema de índices SINTO-XXXXX para cada nodo
  - Generación de metadatos SEO y schemas JSON-LD
  - Integración con productos de Amazon Associates

#### **Módulo 2: Corpus de Datos (`corpus/`)**
- **Entidades**: 20 zonas corporales (`cabeza`, `garganta`, etc.)
- **Contextos**: 20 estados emocionales (`bloqueo`, `ansiedad`, etc.)
- **Perspectivas**: 4 visiones teóricas (Sintomario, Louise Hay, Hamer, Gabor Maté)
- **Productos**: Catálogo de Amazon con ASINs y afiliación

#### **Módulo 3: Templates HTML (`templates/`)**
- **Base**: Layout común con metadatos y estructura
- **Lectura**: Template principal para cada nodo individual
- **Componentes**: Homepage, about, FAQ, admin (local)

#### **Módulo 4: Sistema de Diseño (`css/`)**
- **Fuentes**: Google Fonts (Cormorant, Source Serif, DM Mono)
- **Modos**: Claro/oscuro con detección automática
- **Paletas**: 20 combinaciones semánticas por sistema corporal

---

## 🔍 **Análisis Inferencial por Componente**

### **Motor Python - Hipótesis de Implementación**

#### **Funciones Principales (Inferidas)**
```python
# Probables funciones principales (no verificadas)
def load_configuration()      # Cargar config.json y .env
def load_corpus()            # Leer archivos JSON del corpus  
def calculate_sinto_index()  # Generar índices SINTO-XXXXX
def build_node()             # Construir diccionario de cada nodo
def render_template()         # Aplicar template a datos del nodo
def generate_sitemap()        # Crear sitemap.xml
def generate_robots()        # Crear robots.txt
```

#### **Variables Globales (Inferidas)**
```python
# Probables constantes del sistema
OUTPUT_DIR = "./public"
CORPUS_DIR = "./corpus" 
TEMPLATES_DIR = "./templates"
CSS_DIR = "./css"
INDEX_BASE = 100
INDEX_MULTIPLIER = 20
DOMAIN = "https://sintomario.org"
```

#### **Sistema de Índices (Hipótesis)**
- **Fórmula inferida**: `SINTO-{sistema:03d}{contexto:02d}{perspectiva:01d}`
- **Rango hipotético**: SINTO-0100 a SINTO-0499
- **Ejemplo**: Cabeza + Bloqueo + Sintomario = SINTO-0100

### **Corpus JSON - Hipótesis de Estructura**

#### **Entidades (Inferido)**
```json
{
  "id": "cabeza",
  "nombre": "Cabeza", 
  "aliases": ["dolor de cabeza", "jaqueca", "migraña"],
  "sistema": "nervioso",
  "color": "#verde_claro"
}
```

#### **Contextos (Inferido)**
```json
{
  "id": "bloqueo", 
  "nombre": "Bloqueo Emocional",
  "herida": "miedo al cambio",
  "descripcion": "Estado de resistencia emocional"
}
```

#### **Productos Amazon (Inferido)**
```json
{
  "asin": "B08XYZ123",
  "nombre": "Producto Ejemplo",
  "url": "https://amazon.com/dp/B08XYZ123?tag=sintomario-20",
  "relevancia": ["cabeza", "bloqueo", "ansiedad"]
}
```

### **Templates HTML - Hipótesis de Variables**

#### **Variables del Template (Inferidas)**
```html
{{ SINTO_INDEX }}           <!-- Índice SINTO-XXXXX -->
{{ entidad.nombre }}          <!-- Nombre de la entidad -->
{{ contexto.nombre }}         <!-- Nombre del contexto -->
{{ contenido.reconocimiento }} <!-- Capa de reconocimiento -->
{{ contenido.contextualizacion }} <!-- Capa de contextualización -->
{{ perspectiva.texto }}     <!-- Texto de la perspectiva -->
```

### **Sistema de Diseño - Hipótesis de Arquitectura**

#### **Variables CSS (Inferidas)**
```css
:root {
  --fuente-titulos: "Cormorant Garamond", serif;
  --fuente-cuerpo: "Source Serif 4", serif;  
  --fuente-mono: "DM Mono", monospace;
  --ancho-lectura: 65ch;
  --color-fondo-claro: #FAF8F4;
  --color-fondo-oscuro: #141210;
}
```

#### **Paletas Semánticas (Inferidas)**
```css
[data-sistema="digestivo"] { --color-primario: #2d5016; }
[data-sistema="nervioso"] { --color-primario: #2563eb; }
[data-sistema="respiratorio"] { --color-primario: #0891b2; }
```

---

## 🔗 **Hipótesis de Integración Histórica**

### **Relación SABIA → SINTOMARIO (Inferida)**
El proyecto parece derivar de un sistema anterior llamado "SABIA" con:

#### **Nivel 1: Herencia Directa**
- Motor base posiblemente derivado de `sabia_v2.py`
- Sistema de diseño heredado
- Vocabulario y tokens compartidos

#### **Nivel 2: Adaptación Específica**  
- Configuración renombrada: `sabia.config.json`
- Templates adaptados para dominio médico
- Corpus específico de síntomas corporales

#### **Nivel 3: Arquitectura Estratégica (Propuesta)**
- Separar infraestructura compartida (SABIA-core)
- Crear paquete pip reutilizable
- Sistema de índices con rangos reservados

---

## ⚠️ **Limitaciones del Análisis**

### **Información No Disponible**
- **Código fuente real** del motor principal
- **Contenido exacto** de los archivos JSON del corpus
- **Implementación real** de templates y variables
- **Integración efectiva** entre componentes

### **Inferencias No Verificadas**
- Número exacto de funciones y variables del motor
- Fórmula real de cálculo de índices SINTO
- Implementación específica de perspectivas y contenido
- Estado actual de la integración SABIA→SINTOMARIO

### **Posibles Inconsistencias**
- El repo podría tener múltiples generadores o estar en transición
- Algunos archivos referenciados podrían no existir aún
- La configuración podría estar parcialmente desactualizada

---

## 🎯 **Usos Recomendados del Documento**

### **Como Marco de Trabajo**
1. **Validación**: Usar como checklist para explorar el código real
2. **Planificación**: Identificar gaps entre hipótesis y realidad
3. **Priorización**: Decidir qué inferencias confirmar primero
4. **Documentación**: Actualizar este documento con findings

### **Como Base para Discusión**
1. **Revisión**: Analizar cada sección con el equipo
2. **Crítica**: Identificar inferencias incorrectas o peligrosas
3. **Refinamiento**: Mejorar hipótesis con nueva evidencia
4. **Consenso**: Acordar dirección arquitectónica

### **Como Documento Vivo**
1. **Actualización**: Marcar confirmaciones y refutaciones
2. **Versionado**: Guardar snapshots del pensamiento arquitectónico
3. **Aprendizaje**: Capturar lecciones aprendidas sobre el sistema real
4. **Evolución**: Transformar hipótesis en especificaciones verificadas

---

## 📋 **Próximos Pasos Sugeridos**

### **Inmediato (Validación)**
1. **Acceder al código fuente** real del motor
2. **Examinar estructura** exacta de archivos JSON
3. **Verificar implementación** de templates y variables
4. **Confirmar o refutar** hipótesis principales

### **Corto Plazo (Síntesis)**
1. **Actualizar este documento** con findings verificadas
2. **Crear especificaciones** basadas en realidad del sistema
3. **Separar hipótesis confirmadas** de especulaciones
4. **Establecer baseline** arquitectónico verificable

### **Mediano Plazo (Evolución)**
1. **Transformar en documentación** técnica oficial
2. **Usar como base** para nuevas arquitecturas
3. **Aplicar aprendizaje** a futuros proyectos
4. **Compartir conocimientos** con el equipo

---

## 📊 **Matriz de Confianza de Información**

| Componente | Fuente | Confianza | Verificación Requerida |
|------------|----------|------------|----------------------|
| **Estructura de carpetas** | Repo real | Alta | ✅ Confirmada |
| **Scripts de build** | Repo real | Alta | ✅ Confirmada |
| **Configuración JSON** | Repo real | Alta | ✅ Confirmada |
| **Motor Python** | Inferencia | Media | 🔍 Requiere código |
| **Corpus JSON** | Inferencia | Media | 🔍 Requiere examen |
| **Templates HTML** | Inferencia | Media | 🔍 Requiere revisión |
| **Integración SABIA** | Inferencia | Baja | ❓ Especulativo |
| **Métricas exactas** | Inferencia | Baja | ❓ No verificable |

---

## ⚖️ **Consideraciones Éticas**

### **Uso Responsable**
- Este documento debe presentarse siempre como **hipótesis de trabajo**
- No debe usarse para tomar decisiones técnicas sin validación
- Las inferencias deben marcarse claramente como no verificadas
- El equipo debe ser informado del estado especulativo

### **Transparencia Intelectual**
- Distinguir claramente entre evidencia directa e inferencia
- Documentar el razonamiento detrás de cada inferencia
- Mantener registro de cambios y evolución del pensamiento
- Estar preparado para refutar hipótesis con nueva evidencia

---

**Conclusión**: Este documento representa el mejor entendimiento posible del sistema basado en información parcial. Su valor está en ser un **marco de trabajo estructurado** para la exploración y validación subsiguiente, no en ser una verdad definitiva sobre la arquitectura actual.

---

*Este documento debe considerarse BORRADOR DE TRABAJO y no documentación oficial del proyecto.*
