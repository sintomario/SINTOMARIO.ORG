/**
 * Atlas Somático Editorial - Enhanced Theme Manager
 * Gestor de temas avanzado con accesibilidad y personalización
 */

class AtlasThemeManagerEnhanced {
  constructor() {
    this.isInitialized = false;
    this.currentTheme = 'auto';
    this.currentFontSize = 'normal';
    this.currentSpacing = 'normal';
    this.animationsEnabled = true;
    this.highContrastEnabled = false;
    this.customThemes = new Map();
    this.systemPreferences = {};
    
    // Configuración de temas
    this.themes = {
      light: {
        name: 'Claro',
        colors: {
          'color-bg-primary': '#ffffff',
          'color-bg-secondary': '#f8fafc',
          'color-bg-tertiary': '#f1f5f9',
          'color-text-primary': '#1e293b',
          'color-text-secondary': '#475569',
          'color-text-tertiary': '#64748b',
          'color-border-primary': '#e2e8f0',
          'color-border-secondary': '#cbd5e1',
          'color-blue-trust-500': '#3b82f6',
          'color-green-vitality-500': '#10b981',
          'color-golden-illumination-500': '#f59e0b',
          'color-purple-transformation-500': '#8b5cf6',
          'color-red-attention': '#ef4444'
        },
        shadows: {
          'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)'
        }
      },
      dark: {
        name: 'Oscuro',
        colors: {
          'color-bg-primary': '#0f172a',
          'color-bg-secondary': '#1e293b',
          'color-bg-tertiary': '#334155',
          'color-text-primary': '#f8fafc',
          'color-text-secondary': '#e2e8f0',
          'color-text-tertiary': '#cbd5e1',
          'color-border-primary': '#475569',
          'color-border-secondary': '#64748b',
          'color-blue-trust-500': '#60a5fa',
          'color-green-vitality-500': '#34d399',
          'color-golden-illumination-500': '#fbbf24',
          'color-purple-transformation-500': '#a78bfa',
          'color-red-attention': '#f87171'
        },
        shadows: {
          'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
          'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
          'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.5)',
          'shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.6)'
        }
      },
      highContrast: {
        name: 'Alto Contraste',
        colors: {
          'color-bg-primary': '#000000',
          'color-bg-secondary': '#1a1a1a',
          'color-bg-tertiary': '#333333',
          'color-text-primary': '#ffffff',
          'color-text-secondary': '#ffffff',
          'color-text-tertiary': '#cccccc',
          'color-border-primary': '#ffffff',
          'color-border-secondary': '#cccccc',
          'color-blue-trust-500': '#00ffff',
          'color-green-vitality-500': '#00ff00',
          'color-golden-illumination-500': '#ffff00',
          'color-purple-transformation-500': '#ff00ff',
          'color-red-attention': '#ff0000'
        },
        shadows: {
          'shadow-sm': 'none',
          'shadow-md': 'none',
          'shadow-lg': 'none',
          'shadow-xl': 'none'
        }
      },
      therapeutic: {
        name: 'Terapéutico',
        colors: {
          'color-bg-primary': '#f0fdf4',
          'color-bg-secondary': '#f7fee7',
          'color-bg-tertiary': '#dcfce7',
          'color-text-primary': '#14532d',
          'color-text-secondary': '#166534',
          'color-text-tertiary': '#15803d',
          'color-border-primary': '#bbf7d0',
          'color-border-secondary': '#86efac',
          'color-blue-trust-500': '#22c55e',
          'color-green-vitality-500': '#16a34a',
          'color-golden-illumination-500': '#84cc16',
          'color-purple-transformation-500': '#10b981',
          'color-red-attention': '#dc2626'
        },
        shadows: {
          'shadow-sm': '0 1px 2px 0 rgb(34 197 94 / 0.1)',
          'shadow-md': '0 4px 6px -1px rgb(34 197 94 / 0.15)',
          'shadow-lg': '0 10px 15px -3px rgb(34 197 94 / 0.2)',
          'shadow-xl': '0 20px 25px -5px rgb(34 197 94 / 0.25)'
        }
      }
    };
    
    // Configuración de tamaños de fuente
    this.fontSizes = {
      small: { scale: 0.875, label: 'Pequeño' },
      normal: { scale: 1, label: 'Normal' },
      large: { scale: 1.125, label: 'Grande' },
      extraLarge: { scale: 1.25, label: 'Extra Grande' }
    };
    
    // Configuración de espaciado
    this.spacingLevels = {
      compact: { scale: 0.75, label: 'Compacto' },
      normal: { scale: 1, label: 'Normal' },
      comfortable: { scale: 1.25, label: 'Confortable' },
      spacious: { scale: 1.5, label: 'Espacioso' }
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Detectar preferencias del sistema
      await this.detectSystemPreferences();
      
      // Cargar configuración guardada
      this.loadSettings();
      
      // Aplicar tema inicial
      this.applyTheme(this.currentTheme);
      
      // Configurar controles UI
      this.setupThemeControls();
      
      // Configurar atajos de teclado
      this.setupKeyboardShortcuts();
      
      // Observar cambios en preferencias del sistema
      this.watchSystemPreferences();
      
      this.isInitialized = true;
      console.log('🎨 Atlas Enhanced Theme Manager - Inicializado');
      
    } catch (error) {
      console.error('Error al inicializar Enhanced Theme Manager:', error);
    }
  }
  
  async detectSystemPreferences() {
    // Detectar preferencia de color
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPreferences.darkMode = darkModeQuery.matches;
      
      // Detectar preferencia de movimiento reducido
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.systemPreferences.reducedMotion = reducedMotionQuery.matches;
      
      // Detectar preferencia de contraste alto
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      this.systemPreferences.highContrast = highContrastQuery.matches;
    }
    
    // Detectar idioma y región
    this.systemPreferences.language = navigator.language || 'es';
    this.systemPreferences.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Detectar tipo de dispositivo
    this.systemPreferences.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.systemPreferences.isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
    this.systemPreferences.isDesktop = !this.systemPreferences.isMobile && !this.systemPreferences.isTablet;
  }
  
  setupThemeControls() {
    // Selector de tema
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
      
      // Actualizar selector con tema actual
      themeSelector.value = this.currentTheme;
    }
    
    // Controles de tamaño de fuente
    const fontSizeControls = document.querySelectorAll('.font-size-control');
    fontSizeControls.forEach(control => {
      control.addEventListener('click', () => {
        const size = control.dataset.size;
        this.setFontSize(size);
      });
    });
    
    // Controles de espaciado
    const spacingControls = document.querySelectorAll('.spacing-control');
    spacingControls.forEach(control => {
      control.addEventListener('click', () => {
        const spacing = control.dataset.spacing;
        this.setSpacing(spacing);
      });
    });
    
    // Control de animaciones
    const animationToggle = document.querySelector('.animation-toggle');
    if (animationToggle) {
      animationToggle.addEventListener('change', (e) => {
        this.setAnimationsEnabled(e.target.checked);
      });
      
      animationToggle.checked = this.animationsEnabled;
    }
    
    // Control de alto contraste
    const highContrastToggle = document.querySelector('.high-contrast-toggle');
    if (highContrastToggle) {
      highContrastToggle.addEventListener('change', (e) => {
        this.setHighContrast(e.target.checked);
      });
      
      highContrastToggle.checked = this.highContrastEnabled;
    }
    
    // Botones de reset
    const resetButtons = document.querySelectorAll('.theme-reset');
    resetButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.resetToDefaults();
      });
    });
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + T: Ciclar temas
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.cycleTheme();
      }
      
      // Ctrl/Cmd + Shift + F: Ciclar tamaños de fuente
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        this.cycleFontSize();
      }
      
      // Ctrl/Cmd + Shift + S: Ciclar espaciado
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        this.cycleSpacing();
      }
      
      // Ctrl/Cmd + Shift + A: Toggle animaciones
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        this.setAnimationsEnabled(!this.animationsEnabled);
      }
      
      // Ctrl/Cmd + Shift + H: Toggle alto contraste
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        this.setHighContrast(!this.highContrastEnabled);
      }
    });
  }
  
  watchSystemPreferences() {
    if (window.matchMedia) {
      // Observar cambios en modo oscuro
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        this.systemPreferences.darkMode = e.matches;
        if (this.currentTheme === 'auto') {
          this.applyTheme('auto');
        }
      });
      
      // Observar cambios en movimiento reducido
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotionQuery.addEventListener('change', (e) => {
        this.systemPreferences.reducedMotion = e.matches;
        if (e.matches) {
          this.setAnimationsEnabled(false);
        }
      });
      
      // Observar cambios en contraste alto
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      highContrastQuery.addEventListener('change', (e) => {
        this.systemPreferences.highContrast = e.matches;
        if (e.matches) {
          this.setHighContrast(true);
        }
      });
    }
  }
  
  setTheme(theme) {
    if (!this.themes[theme]) {
      console.warn(`Tema "${theme}" no encontrado`);
      return;
    }
    
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveSettings();
    this.dispatchEvent('themeChanged', { theme });
  }
  
  applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remover clases de tema anteriores
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast', 'theme-therapeutic');
    
    if (theme === 'auto') {
      // Aplicar tema automático según preferencia del sistema
      const autoTheme = this.systemPreferences.darkMode ? 'dark' : 'light';
      this.applyThemeColors(autoTheme);
      body.classList.add(`theme-${autoTheme}`);
    } else {
      // Aplicar tema específico
      this.applyThemeColors(theme);
      body.classList.add(`theme-${theme}`);
    }
    
    // Aplicar configuración de alto contraste
    if (this.highContrastEnabled) {
      this.applyHighContrast();
    }
    
    // Aplicar configuración de animaciones
    this.applyAnimationSettings();
    
    // Actualizar controles UI
    this.updateThemeControls();
  }
  
  applyThemeColors(theme) {
    const root = document.documentElement;
    const themeConfig = this.themes[theme];
    
    if (!themeConfig) return;
    
    // Aplicar colores
    Object.entries(themeConfig.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Aplicar sombras
    Object.entries(themeConfig.shadows).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
  
  applyHighContrast() {
    const root = document.documentElement;
    const highContrastTheme = this.themes.highContrast;
    
    if (highContrastTheme && this.highContrastEnabled) {
      Object.entries(highContrastTheme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      document.body.classList.add('theme-high-contrast');
    } else {
      // Restaurar colores del tema actual
      this.applyTheme(this.currentTheme);
    }
  }
  
  applyAnimationSettings() {
    const root = document.documentElement;
    
    if (!this.animationsEnabled || this.systemPreferences.reducedMotion) {
      root.style.setProperty('--transition-fast', '0s');
      root.style.setProperty('--transition-normal', '0s');
      root.style.setProperty('--transition-slow', '0s');
      document.body.classList.add('reduced-motion');
    } else {
      root.style.setProperty('--transition-fast', '0.15s ease-in-out');
      root.style.setProperty('--transition-normal', '0.3s ease-in-out');
      root.style.setProperty('--transition-slow', '0.5s ease-in-out');
      document.body.classList.remove('reduced-motion');
    }
  }
  
  setFontSize(size) {
    if (!this.fontSizes[size]) {
      console.warn(`Tamaño de fuente "${size}" no encontrado`);
      return;
    }
    
    this.currentFontSize = size;
    const scale = this.fontSizes[size].scale;
    
    // Aplicar escala a todas las fuentes
    const root = document.documentElement;
    root.style.setProperty('--font-scale', scale);
    
    // Actualizar clases
    document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    document.body.classList.add(`font-${size}`);
    
    this.saveSettings();
    this.updateFontSizeControls();
    this.dispatchEvent('fontSizeChanged', { size, scale });
  }
  
  setSpacing(spacing) {
    if (!this.spacingLevels[spacing]) {
      console.warn(`Nivel de espaciado "${spacing}" no encontrado`);
      return;
    }
    
    this.currentSpacing = spacing;
    const scale = this.spacingLevels[spacing].scale;
    
    // Aplicar escala a todo el espaciado
    const root = document.documentElement;
    root.style.setProperty('--spacing-scale', scale);
    
    // Actualizar clases
    document.body.classList.remove('spacing-compact', 'spacing-normal', 'spacing-comfortable', 'spacing-spacious');
    document.body.classList.add(`spacing-${spacing}`);
    
    this.saveSettings();
    this.updateSpacingControls();
    this.dispatchEvent('spacingChanged', { spacing, scale });
  }
  
  setAnimationsEnabled(enabled) {
    this.animationsEnabled = enabled;
    this.applyAnimationSettings();
    this.saveSettings();
    this.updateAnimationControls();
    this.dispatchEvent('animationsChanged', { enabled });
  }
  
  setHighContrast(enabled) {
    this.highContrastEnabled = enabled;
    this.applyHighContrast();
    this.saveSettings();
    this.updateHighContrastControls();
    this.dispatchEvent('highContrastChanged', { enabled });
  }
  
  cycleTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.setTheme(nextTheme);
  }
  
  cycleFontSize() {
    const sizes = Object.keys(this.fontSizes);
    const currentIndex = sizes.indexOf(this.currentFontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    
    this.setFontSize(nextSize);
  }
  
  cycleSpacing() {
    const spacings = Object.keys(this.spacingLevels);
    const currentIndex = spacings.indexOf(this.currentSpacing);
    const nextIndex = (currentIndex + 1) % spacings.length;
    const nextSpacing = spacings[nextIndex];
    
    this.setSpacing(nextSpacing);
  }
  
  addCustomTheme(name, config) {
    this.customThemes.set(name, config);
    this.themes[name] = config;
    this.saveSettings();
    this.dispatchEvent('customThemeAdded', { name, config });
  }
  
  removeCustomTheme(name) {
    if (this.customThemes.has(name)) {
      this.customThemes.delete(name);
      delete this.themes[name];
      
      // Si el tema eliminado estaba activo, cambiar a 'auto'
      if (this.currentTheme === name) {
        this.setTheme('auto');
      }
      
      this.saveSettings();
      this.dispatchEvent('customThemeRemoved', { name });
    }
  }
  
  updateThemeControls() {
    const themeSelector = document.querySelector('.theme-selector');
    if (themeSelector) {
      themeSelector.value = this.currentTheme;
      
      // Actualizar opciones si hay temas personalizados
      this.updateThemeSelectorOptions();
    }
  }
  
  updateThemeSelectorOptions() {
    const themeSelector = document.querySelector('.theme-selector');
    if (!themeSelector) return;
    
    // Guardar selección actual
    const currentValue = themeSelector.value;
    
    // Limpiar opciones
    themeSelector.innerHTML = '';
    
    // Agregar opciones estándar
    Object.entries(this.themes).forEach(([key, theme]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = theme.name;
      themeSelector.appendChild(option);
    });
    
    // Restaurar selección
    themeSelector.value = currentValue;
  }
  
  updateFontSizeControls() {
    document.querySelectorAll('.font-size-control').forEach(control => {
      control.classList.toggle('active', control.dataset.size === this.currentFontSize);
    });
  }
  
  updateSpacingControls() {
    document.querySelectorAll('.spacing-control').forEach(control => {
      control.classList.toggle('active', control.dataset.spacing === this.currentSpacing);
    });
  }
  
  updateAnimationControls() {
    const animationToggle = document.querySelector('.animation-toggle');
    if (animationToggle) {
      animationToggle.checked = this.animationsEnabled;
    }
  }
  
  updateHighContrastControls() {
    const highContrastToggle = document.querySelector('.high-contrast-toggle');
    if (highContrastToggle) {
      highContrastToggle.checked = this.highContrastEnabled;
    }
  }
  
  saveSettings() {
    try {
      const settings = {
        theme: this.currentTheme,
        fontSize: this.currentFontSize,
        spacing: this.currentSpacing,
        animationsEnabled: this.animationsEnabled,
        highContrastEnabled: this.highContrastEnabled,
        customThemes: Array.from(this.customThemes.entries()),
        timestamp: Date.now()
      };
      
      localStorage.setItem('atlas-theme-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('No se pudo guardar la configuración del tema:', error);
    }
  }
  
  loadSettings() {
    try {
      const saved = localStorage.getItem('atlas-theme-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        
        // Cargar configuración guardada
        this.currentTheme = settings.theme || 'auto';
        this.currentFontSize = settings.fontSize || 'normal';
        this.currentSpacing = settings.spacing || 'normal';
        this.animationsEnabled = settings.animationsEnabled !== false;
        this.highContrastEnabled = settings.highContrastEnabled || false;
        
        // Cargar temas personalizados
        if (settings.customThemes) {
          settings.customThemes.forEach(([name, config]) => {
            this.customThemes.set(name, config);
            this.themes[name] = config;
          });
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar la configuración del tema:', error);
    }
  }
  
  resetToDefaults() {
    this.currentTheme = 'auto';
    this.currentFontSize = 'normal';
    this.currentSpacing = 'normal';
    this.animationsEnabled = true;
    this.highContrastEnabled = false;
    
    // Eliminar temas personalizados
    this.customThemes.clear();
    
    // Restaurar temas estándar
    this.themes = {
      light: this.themes.light,
      dark: this.themes.dark,
      highContrast: this.themes.highContrast,
      therapeutic: this.themes.therapeutic
    };
    
    // Aplicar configuración por defecto
    this.applyTheme(this.currentTheme);
    this.setFontSize(this.currentFontSize);
    this.setSpacing(this.currentSpacing);
    this.setAnimationsEnabled(this.animationsEnabled);
    this.setHighContrast(this.highContrastEnabled);
    
    // Guardar configuración
    this.saveSettings();
    
    this.dispatchEvent('settingsReset');
  }
  
  exportSettings() {
    const settings = {
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      spacing: this.currentSpacing,
      animationsEnabled: this.animationsEnabled,
      highContrastEnabled: this.highContrastEnabled,
      customThemes: Array.from(this.customThemes.entries()),
      systemPreferences: this.systemPreferences,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-theme-settings-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    this.dispatchEvent('settingsExported', { settings });
  }
  
  async importSettings(file) {
    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      // Validar configuración
      if (settings.version && settings.theme) {
        // Aplicar configuración importada
        this.currentTheme = settings.theme;
        this.currentFontSize = settings.fontSize || 'normal';
        this.currentSpacing = settings.spacing || 'normal';
        this.animationsEnabled = settings.animationsEnabled !== false;
        this.highContrastEnabled = settings.highContrastEnabled || false;
        
        // Importar temas personalizados
        if (settings.customThemes) {
          settings.customThemes.forEach(([name, config]) => {
            this.customThemes.set(name, config);
            this.themes[name] = config;
          });
        }
        
        // Aplicar configuración
        this.applyTheme(this.currentTheme);
        this.setFontSize(this.currentFontSize);
        this.setSpacing(this.currentSpacing);
        this.setAnimationsEnabled(this.animationsEnabled);
        this.setHighContrast(this.highContrastEnabled);
        
        // Guardar configuración
        this.saveSettings();
        
        this.dispatchEvent('settingsImported', { settings });
      } else {
        throw new Error('Formato de configuración inválido');
      }
    } catch (error) {
      console.error('Error al importar configuración:', error);
      this.dispatchEvent('settingsImportError', { error });
    }
  }
  
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  getAvailableThemes() {
    return Object.keys(this.themes);
  }
  
  getCustomThemes() {
    return Array.from(this.customThemes.keys());
  }
  
  getSystemPreferences() {
    return { ...this.systemPreferences };
  }
  
  getCurrentSettings() {
    return {
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      spacing: this.currentSpacing,
      animationsEnabled: this.animationsEnabled,
      highContrastEnabled: this.highContrastEnabled,
      customThemes: this.getCustomThemes()
    };
  }
  
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`atlasTheme:${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }
  
  destroy() {
    // Limpiar event listeners
    if (window.matchMedia) {
      const queries = [
        '(prefers-color-scheme: dark)',
        '(prefers-reduced-motion: reduce)',
        '(prefers-contrast: high)'
      ];
      
      queries.forEach(query => {
        const mediaQuery = window.matchMedia(query);
        mediaQuery.removeEventListener('change', () => {});
      });
    }
    
    this.isInitialized = false;
    console.log('🎨 Atlas Enhanced Theme Manager - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AtlasThemeManagerEnhanced = new AtlasThemeManagerEnhanced();
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasThemeManagerEnhanced;
}
