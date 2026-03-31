# Atlas Somático Editorial - Design System

## Estructura de Carpetas

```
atlas-somatico-editorial/
├── design-system/
│   ├── tokens/
│   │   ├── colors.json          # Paleta Atlas completa
│   │   ├── typography.json      # Sistema tipográfico
│   │   ├── spacing.json         # Espaciado respiratorio
│   │   └── components.json      # Variables de UI
│   ├── components/
│   │   ├── buttons/             # Botones terapéuticos
│   │   ├── cards/               # Cards somáticos
│   │   ├── forms/               # Formularios de conexión
│   │   └── layout/              # Layout Atlas
│   └── patterns/
│       ├── navigation/          # Navegación cartográfica
│       ├── body-maps/           # Mapas corporales
│       └── data-viz/            # Visualización de datos
├── templates-atlas/
│   ├── base.html               # Template base con disclaimer
│   ├── homepage.html            # Portal principal
│   ├── zone.html               # Página de zona somática
│   ├── article.html            # Artículo terapéutico
│   ├── hub.html                # Hub de categorías
│   └── search.html             # Búsqueda avanzada
├── assets-atlas/
│   ├── css/
│   │   ├── main.css            # CSS principal
│   │   ├── components.css      # Componentes
│   │   └── utilities.css       # Utilidades
│   ├── js/
│   │   ├── theme-manager.js    # Gestión de temas
│   │   ├── interaction-manager.js # Interacciones
│   │   └── search-manager.js   # Búsqueda somática
│   └── images/
│       ├── body-maps/          # Mapas corporales
│       ├── icons/              # Iconos terapéuticos
│       └── patterns/           # Patrones visuales
└── integration/
    ├── build/                  # Scripts de build
    ├── deploy/                 # Deploy automation
    └── validation/             # WCAG validation
```

## Principio Fundamental: Disclaimer Médico Inamovible

El disclaimer médico es la prioridad absoluta del sistema:
- **Posición**: 10px fijos del bottom
- **Color**: Amarillo mostaza (#f59e0b)
- **Texto**: Rojo (#ef4444), 6px, MAYÚSCULAS
- **Ancho**: 100% viewport, pegado a banda inferior
- **Regla**: NUNCA puede ser movido o tapado
- **Consecuencia**: Si no existe, todo se descalifica
