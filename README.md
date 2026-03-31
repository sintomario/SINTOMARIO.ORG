# SINTOMARIO.ORG

**Atlas Psicosomático Interactivo** — `sintomario.org`

Cartografía de la relación entre el cuerpo y la experiencia emocional. 63 zonas corporales × 51 contextos emocionales = 3.200+ artículos de referencia.

---

## Estado Actual — Marzo 2026

### Frontend Implementado
- **Homepage CLICKER** — Diseño interactivo con 10 capas PNG, navegación scroll/touch/keyboard
- **8 Hubs de Sistema** — Nervioso, Óseo, Circulatorio, Muscular, Psíquico, Digestivo, Emocional, Perceptual
- **FAQ** — 7 preguntas con tono Saramago/PCP, explicación del Índice Sinto
- **Sobre** — Misión del proyecto (100 palabras), cómo usar, cómo apoyar
- **Atlas** — Navegación por 63 zonas corporales con 51 contextos cada una

### Sistema CLICKER
- **Paleta unificada**: Conic gradient (#1a010c → #670433 → #8c0548)
- **Tipografía**: EB Garamond (títulos) + Inter (cuerpo)
- **Navegación**: Scroll, touch swipe, teclado (flechas)
- **Botones dinámicos**: 7 síntomas por sistema + botón SINTOMARIO (link a hub)
- **Contador de visitas**: localStorage persistente
- **Selector de idioma**: ES/EN/PT (placeholder)
- **Favicon y Logo**: favicon.ico.jpg + LOGO HORIZONTAL-02.png

### Estructura de URLs

```
/                          → Homepage CLICKER
/sobre/                    → Página Sobre (misión, uso, apoyo)
/faq/                      → 7 preguntas frecuentes
/cuerpo/                   → Atlas (listado de zonas)
/cuerpo/sistema/nervioso/  → Hub del sistema nervioso
/cuerpo/sistema/oseo/      → Hub del sistema óseo
/cuerpo/sistema/circulatorio/  → Hub circulatorio
/cuerpo/sistema/muscular/  → Hub muscular
/cuerpo/sistema/psiquico/  → Hub psíquico
/cuerpo/sistema/digestivo/ → Hub digestivo
/cuerpo/sistema/emocional/ → Hub emocional
/cuerpo/sistema/perceptual/ → Hub perceptual
/cuerpo/{zona}/{contexto}/ → Artículo específico
```

### Los 8 Sistemas

| Sistema | Badge | Subtítulo | Zonas Principales |
|---------|-------|-----------|-------------------|
| **Nervioso** | Sistema Nervioso | La red eléctrica de la experiencia | Cerebro, Ojos, Oídos, Nervio Vago, Migraña, Insomnio, Vértigo |
| **Óseo** | Sistema Óseo | La arquitectura de la identidad | Columna, Rodilla, Cadera, Cervicales, Mandíbula, Huesos, Dientes |
| **Circulatorio** | Sistema Circulatorio | El río de la vida emocional | Corazón, Pulmones, Pecho, Presión, Taquicardia, Circulación, Anemia |
| **Muscular** | Sistema Muscular | La armadura del alma | Hombros, Cuello, Lumbar, Mandíbula, Trapecio, Fibromialgia, Contracturas |
| **Psíquico** | Sistema Psíquico | El territorio invisible de la mente | Bucles, Niebla, Ansiedad, Fobias, TOC, Burnout, Disociación |
| **Digestivo** | Sistema Digestivo | El laboratorio de las emociones | Estómago, Colon, Hígado, Reflujo, Intestino, Gastritis, Boca |
| **Emocional** | Sistema Emocional | El océano interior | Llanto, Vacío, Culpa, Vergüenza, Apatía, Soledad, Garganta |
| **Perceptual** | Sistema Perceptual | La frontera entre adentro y afuera | Dermatitis, Acné, Urticaria, Psoriasis, Nariz, Sudoración, Herpes |

### Principios de Contenido

- **Tono**: Saramago — oraciones largas, flujo continuo, densidad poética
- **Modelo PCP**: Permiso → Contexto → Propuesta implícito
- **No futuro**: Lenguaje presente, sin promesas ni estados futuros
- **No anglicismos**: Español puro, sin "rather than" ni similares
- **SINTOMARIO en mayúsculas**: Siempre
- **CTA subliminal**: Compartir = solidaridad, donaciones = aporte voluntario

### Contacto y Apoyo

- **Email**: sintomario@proton.me
- **PayPal**: https://paypal.me/sintomario
- **Wise**: https://wise.com/pay/sintomario
- **Principio**: Todo gratuito, sin barreras, sin "niveles premium"

### Reglas del Proyecto

- ✅ Desarrollo local únicamente
- ❌ Nunca deploy automático en producción
- ❌ Nunca push sin revisión
- ❌ Nunca modificar datos reales del sistema sin backup
- ✅ Validar visualmente cada cambio antes de deploy

---

*Atlas Psicosomático · 2026 · sintomario@proton.me*
