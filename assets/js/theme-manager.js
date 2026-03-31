// SINTOMARIO.ORG - Theme Adaptativo Controller
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'auto';
    this.init();
  }

  init() {
    // Aplicar theme inicial
    this.applyTheme(this.currentTheme);
    
    // Crear botón de toggle
    this.createThemeToggle();
    
    // Escuchar cambios del sistema
    this.watchSystemChanges();
    
    // Guardar preferencia
    this.saveTheme();
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('sintomario-theme');
    } catch (e) {
      return null;
    }
  }

  saveTheme() {
    try {
      localStorage.setItem('sintomario-theme', this.currentTheme);
    } catch (e) {
      // Silently fail if storage is unavailable
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.updateToggleButton();
  }

  createThemeToggle() {
    // Prevent duplicate buttons
    if (document.querySelector('.theme-toggle')) return;
    
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Cambiar tema');
    button.setAttribute('aria-live', 'polite');
    button.innerHTML = this.getThemeIcon();
    
    button.addEventListener('click', () => {
      this.cycleTheme();
    });
    
    document.body.appendChild(button);
  }

  cycleTheme() {
    const themes = ['auto', 'day', 'night'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.applyTheme(nextTheme);
    this.saveTheme();
  }

  getThemeIcon() {
    const icons = {
      'auto': { emoji: '🌓', label: 'Auto' },
      'day': { emoji: '☀️', label: 'Día' },
      'night': { emoji: '🌙', label: 'Noche' }
    };
    const theme = icons[this.currentTheme] || icons['auto'];
    return `<span aria-label="Tema: ${theme.label}">${theme.emoji}</span>`;
  }

  updateToggleButton() {
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.innerHTML = this.getThemeIcon();
      button.setAttribute('title', `Tema actual: ${this.currentTheme}`);
    }
  }

  watchSystemChanges() {
    // Detectar cambios en preferencia del sistema
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto'); // Reaplicar para actualizar
      }
    });

    // Opcional: Detección por hora del día
    this.scheduleTimeBasedAdjustment();
  }

  scheduleTimeBasedAdjustment() {
    const checkTime = () => {
      if (this.currentTheme === 'auto') {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour > 20;
        
        // Forzar actualización si el sistema no coincide con hora local
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (isNight !== systemPrefersDark) {
          // Aplicar theme basado en hora local
          const timeBasedTheme = isNight ? 'night' : 'day';
          document.documentElement.setAttribute('data-theme', timeBasedTheme);
        }
      }
    };

    // Revisar cada hora
    setInterval(checkTime, 60 * 60 * 1000);
    
    // Revisar inmediatamente
    checkTime();
  }

  // Método para acceso programático
  setTheme(theme) {
    if (['auto', 'day', 'night'].includes(theme)) {
      this.applyTheme(theme);
      this.saveTheme();
    }
  }

  // Obtener información actual del theme
  getThemeInfo() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    
    return {
      current: this.currentTheme,
      system: systemPrefersDark ? 'dark' : 'light',
      time: isNight ? 'night' : 'day',
      effective: this.getEffectiveTheme()
    };
  }

  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 20;
      
      // Prioritize time-based override when it differs from system
      if (isNight || systemPrefersDark) return 'night';
      return 'day';
    }
    
    return this.currentTheme;
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}

// Exportar para uso global
window.SINTOMARIO = window.SINTOMARIO || {};
window.SINTOMARIO.ThemeManager = ThemeManager;
