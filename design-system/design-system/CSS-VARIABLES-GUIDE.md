# 🎨 **Guía Completa de Variables CSS - Atlas Somático Editorial**

## 📚 **Fundamentos de Variables CSS**

Las variables CSS, formalmente conocidas como **propiedades personalizadas (Custom Properties)**, son entidades que permiten almacenar valores específicos (como colores, tamaños o fuentes) para ser reutilizados en toda una hoja de estilos.

### **🔧 Sintaxis Básica**

Para definir y usar una variable, se siguen dos pasos fundamentales:

#### **1. Declaración**
Se utiliza el prefijo `--` seguido del nombre de la variable:

```css
/* Declaración global (usualmente en :root) */
:root {
  --color-principal: #3498db;
  --espaciado: 15px;
  --fuente-principal: 'Inter', sans-serif;
}
```

#### **2. Uso**
Se invoca mediante la función `var()`:

```css
/* Uso de las variables */
.boton {
  background-color: var(--color-principal);
  padding: var(--espaciado);
  font-family: var(--fuente-principal);
}
```

### **🎯 Alcance (Scope)**

El lugar donde declares la variable determina su visibilidad:

#### **Global (:root)**
```css
:root {
  --color-azul-confianza: #3b82f6;
  --espaciado-md: 16px;
}

/* Disponible en todo el documento */
.header {
  background: var(--color-azul-confianza);
}
.card {
  padding: var(--espaciado-md);
}
```

#### **Local**
```css
.card-terapeutico {
  --color-local: #22c55e;
  --espaciado-local: 24px;
}

/* Solo disponible para .card-terapeutico y sus descendientes */
.card-terapeutico .titulo {
  color: var(--color-local);
  margin-bottom: var(--espaciado-local);
}

/* Esto NO funcionará */
.otro-elemento {
  color: var(--color-local); /* Variable no definida aquí */
}
```

## 🌈 **Variables en Atlas Somático Editorial**

### **🎨 Paleta de Colores Terapéutica**

```css
:root {
  /* Azules Confianza */
  --color-blue-trust-50: #eff6ff;
  --color-blue-trust-100: #dbeafe;
  --color-blue-trust-200: #bfdbfe;
  --color-blue-trust-300: #93c5fd;
  --color-blue-trust-400: #60a5fa;
  --color-blue-trust-500: #3b82f6;  /* Principal */
  --color-blue-trust-600: #2563eb;
  --color-blue-trust-700: #1d4ed8;
  --color-blue-trust-800: #1e40af;
  --color-blue-trust-900: #1e3a8a;

  /* Verde Vitalidad */
  --color-green-vitality-50: #f0fdf4;
  --color-green-vitality-100: #dcfce7;
  --color-green-vitality-200: #bbf7d0;
  --color-green-vitality-300: #86efac;
  --color-green-vitality-400: #4ade80;
  --color-green-vitality-500: #22c55e;  /* Principal */
  --color-green-vitality-600: #16a34a;
  --color-green-vitality-700: #15803d;
  --color-green-vitality-800: #166534;
  --color-green-vitality-900: #14532d;

  /* Dorado Iluminación */
  --color-golden-illumination-50: #fffbeb;
  --color-golden-illumination-100: #fef3c7;
  --color-golden-illumination-200: #fde68a;
  --color-golden-illumination-300: #fcd34d;
  --color-golden-illumination-400: #fbbf24;
  --color-golden-illumination-500: #f59e0b;  /* Principal */
  --color-golden-illumination-600: #d97706;
  --color-golden-illumination-700: #b45309;
  --color-golden-illumination-800: #92400e;
  --color-golden-illumination-900: #78350f;

  /* Colores Somáticos Emocionales */
  --color-amber-alert: #f59e0b;
  --color-red-attention: #ef4444;
  --color-purple-transformation: #8b5cf6;
  --color-teal-clarity: #14b8a6;

  /* Neutrales Serenos */
  --color-white: #ffffff;
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;
  --color-black: #000000;
}
```

### **📝 Tipografía Compasiva**

```css
:root {
  /* Familias de Fuente */
  --font-heading: 'Inter Display', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-accent: 'Playfair Display', Georgia, serif;
  --font-technical: 'JetBrains Mono', 'Fira Code', monospace;

  /* Escala Fluida */
  --text-xs: clamp(0.75rem, 1vw, 0.875rem);
  --text-sm: clamp(0.875rem, 1.5vw, 1rem);
  --text-base: clamp(1rem, 2vw, 1.125rem);
  --text-lg: clamp(1.125rem, 2vw, 1.25rem);
  --text-xl: clamp(1.25rem, 2.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 3vw, 2rem);
  --text-3xl: clamp(1.75rem, 4vw, 2.5rem);
  --text-4xl: clamp(2rem, 5vw, 3rem);
  --text-5xl: clamp(2.5rem, 6vw, 4rem);

  /* Pesos de Fuente */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Altura de Línea */
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Espaciado de Letras */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

### **📏 Espaciado Respiratorio**

```css
:root {
  /* Sistema Base 8px */
  --space-micro: 2px;
  --space-tiny: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-5xl: 128px;

  /* Espaciado Terapéutico */
  --space-breathing-inhale: 24px;
  --space-breathing-exhale: 32px;
  --space-breathing-hold: 48px;

  /* Multiplicadores de Escala */
  --spacing-multiplier: 1;
  --interaction-scale: 1;
}
```

## 🎯 **Ventajas Principales**

### **1. Mantenibilidad**
Cambiar un valor en un solo lugar actualiza todas sus apariciones automáticamente:

```css
:root {
  --color-primary: #3b82f6;
}

/* Usado en múltiples lugares */
.btn-primary { background: var(--color-primary); }
.card-header { border-color: var(--color-primary); }
.link-primary { color: var(--color-primary); }

/* Cambiar el color primario en un solo lugar */
:root {
  --color-primary: #2563eb; /* Actualiza automáticamente */
}
```

### **2. Legibilidad**
Permite usar nombres semánticos en lugar de códigos hexadecimales complejos:

```css
/* Sin variables */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

/* Con variables semánticas */
.error-message {
  background: var(--color-red-50);
  border: 1px solid var(--color-red-200);
  color: var(--color-red-600);
}
```

### **3. Dinamismo con JavaScript**
A diferencia de las variables de preprocesadores como Sass, las variables CSS pueden leerse y modificarse en tiempo de ejecución:

```javascript
// Leer una variable
const rootElement = document.documentElement;
const primaryColor = getComputedStyle(rootElement)
  .getPropertyValue('--color-blue-trust-500').trim();

// Modificar una variable
rootElement.style.setProperty('--color-blue-trust-500', '#2563eb');

// Toggle de tema
function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  
  if (isDark) {
    rootElement.style.setProperty('--color-bg-primary', '#0f172a');
    rootElement.style.setProperty('--color-text-primary', '#f8fafc');
  } else {
    rootElement.style.setProperty('--color-bg-primary', '#ffffff');
    rootElement.style.setProperty('--color-text-primary', '#0f172a');
  }
}
```

### **4. Valores de Respaldo (Fallbacks)**
Puedes definir un valor por defecto si la variable no está disponible:

```css
.button {
  /* Si --color-primary no existe, usa #3b82f6 */
  background: var(--color-primary, #3b82f6);
  
  /* Fallback encadenado */
  color: var(--color-text-primary, var(--color-gray-900, #000000));
  
  /* Fallback con función */
  padding: var(--spacing-md, clamp(1rem, 2vw, 1.25rem));
}
```

## ⚠️ **Limitaciones Importantes**

### **1. Media Queries**
Actualmente, las variables CSS no funcionan directamente dentro de la definición de una media query:

```css
/* ❌ Esto NO funciona */
@media (max-width: var(--breakpoint-md)) {
  .container {
    padding: var(--space-sm);
  }
}

/* ✅ Solución alternativa */
:root {
  --breakpoint-md: 768px;
}

@media (max-width: 768px) {
  .container {
    padding: var(--space-sm);
  }
}
```

### **2. Sensibilidad a Mayúsculas**
Los nombres distinguen entre mayúsculas y minúsculas:

```css
:root {
  --mi-color: #3b82f6;
  --Mi-Color: #22c55e;  /* Variable completamente diferente */
}

.button {
  background: var(--mi-color);    /* #3b82f6 */
  border-color: var(--Mi-Color);  /* #22c55e */
}
```

## 🌙 **Ejemplo Práctico: Modo Oscuro**

### **Implementación Completa**

```css
:root {
  /* Variables de tema claro */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
  --color-shadow: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Variables de tema oscuro */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
  --color-shadow: rgba(0, 0, 0, 0.3);
}

/* Aplicación de variables */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px var(--color-shadow);
}

.text-secondary {
  color: var(--color-text-secondary);
}
```

### **JavaScript para Toggle de Tema**

```javascript
// Theme Manager para Atlas Somático
class AtlasThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('atlas-theme') || 'light';
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }
  
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem('atlas-theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
  
  setupEventListeners() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Inicializar
const atlasTheme = new AtlasThemeManager();
```

## 🎨 **Variables para Componentes Terapéuticos**

### **Buttons - Acción Compasiva**

```css
:root {
  /* Variables de botones */
  --btn-padding-sm: var(--space-xs) var(--space-sm);
  --btn-padding-md: var(--space-sm) var(--space-md);
  --btn-padding-lg: var(--space-md) var(--space-lg);
  
  --btn-radius-sm: var(--radius-sm);
  --btn-radius-md: var(--radius-md);
  --btn-radius-lg: var(--radius-lg);
  
  --btn-transition: all var(--transition-normal);
  
  /* Estados de botones */
  --btn-primary-bg: var(--color-blue-trust-500);
  --btn-primary-hover: var(--color-blue-trust-600);
  --btn-primary-active: var(--color-blue-trust-700);
  --btn-primary-text: var(--color-white);
  
  --btn-secondary-bg: transparent;
  --btn-secondary-border: var(--color-blue-trust-500);
  --btn-secondary-hover: var(--color-blue-trust-50);
  --btn-secondary-text: var(--color-blue-trust-600);
}

.btn {
  padding: var(--btn-padding-md);
  border-radius: var(--btn-radius-md);
  transition: var(--btn-transition);
  font-family: var(--font-body);
  font-weight: var(--font-weight-medium);
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
}

.btn-primary:hover {
  background: var(--btn-primary-hover);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--btn-primary-active);
  transform: translateY(0);
}
```

### **Cards - Contenido Terapéutico**

```css
:root {
  /* Variables de cards */
  --card-padding: var(--space-lg);
  --card-radius: var(--radius-lg);
  --card-shadow: var(--shadow-sm);
  --card-border: 1px solid var(--color-gray-200);
  
  /* Variantes de cards */
  --card-featured-bg: var(--color-blue-trust-50);
  --card-featured-border: 2px solid var(--color-blue-trust-200);
  --card-featured-accent: var(--color-blue-trust-500);
  
  --card-therapeutic-bg: var(--color-green-vitality-50);
  --card-therapeutic-border: 2px solid var(--color-green-vitality-200);
  --card-therapeutic-accent: var(--color-green-vitality-500);
}

.card {
  background: var(--color-white);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);
  transition: var(--transition-normal);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-featured {
  background: var(--card-featured-bg);
  border: var(--card-featured-border);
  border-left: 4px solid var(--card-featured-accent);
}

.card-therapeutic {
  background: var(--card-therapeutic-bg);
  border: var(--card-therapeutic-border);
  border-left: 4px solid var(--card-therapeutic-accent);
}
```

## 🔧 **Best Practices para Atlas Somático**

### **1. Nomenclatura Consistente**
```css
:root {
  /* ✅ Buena nomenclatura */
  --color-blue-trust-500: #3b82f6;
  --space-md: 16px;
  --font-heading: 'Inter Display';
  
  /* ❌ Evitar */
  --azul: #3b82f6;
  --espacio: 16px;
  --fuente1: 'Inter Display';
}
```

### **2. Agrupación Lógica**
```css
:root {
  /* === COLORES === */
  --color-blue-trust-50: #eff6ff;
  --color-blue-trust-500: #3b82f6;
  --color-green-vitality-500: #22c55e;
  
  /* === ESPACIADO === */
  --space-xs: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* === TIPOGRAFÍA === */
  --font-heading: 'Inter Display';
  --font-body: 'Inter';
  --text-base: 1rem;
}
```

### **3. Valores de Respaldo**
```css
.component {
  /* Siempre proporcionar fallbacks */
  color: var(--color-text-primary, #0f172a);
  padding: var(--space-md, 1rem);
  font-family: var(--font-body, system-ui, sans-serif);
}
```

### **4. Performance con Variables**
```css
/* ✅ Eficiente: Variables en :root */
:root {
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;
}

/* Usar variables en lugar de repetir valores */
.btn { transition: var(--transition-normal); }
.card { transition: var(--transition-normal); }
.modal { transition: var(--transition-slow); }
```

## 📱 **Variables Responsive**

### **Breakpoints Fluidos**

```css
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Variables que cambian con viewport */
@media (max-width: 768px) {
  :root {
    --container-padding: var(--space-md);
    --font-size-base: 0.875rem;
    --space-section: var(--space-2xl);
  }
}

@media (min-width: 769px) {
  :root {
    --container-padding: var(--space-lg);
    --font-size-base: 1rem;
    --space-section: var(--space-3xl);
  }
}
```

## 🎯 **Conclusión**

Las variables CSS son fundamentales para el **Atlas Somático Editorial** porque:

1. **Consistencia Visual**: Mantienen coherencia en todo el sistema terapéutico
2. **Mantenimiento Escalable**: Facilitan actualizaciones de 2500+ artículos
3. **Accesibilidad Dinámica**: Permiten ajustes en tiempo real para WCAG 2.1 AAA
4. **Tematización Flexible**: Esencial para modo claro/oscuro y personalización
5. **Performance Optimizada**: Reducen repetición y mejoran mantenimiento

El sistema de variables del Atlas está diseñado para **escalabilidad**, **mantenimiento** y **accesibilidad** total, asegurando una experiencia terapéutica consistente y profesional.

---

**Guía Completa de Variables CSS** - Atlas Somático Editorial  
*Versión 1.0.0 - 25 de Marzo 2026*
