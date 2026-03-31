/**
 * Atlas Somático Editorial - Theme Manager
 * Gestor de temas con SEO optimization y accesibilidad WCAG 2.1 AAA
 */

class AtlasThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Claro Terapéutico',
                colors: {
                    'color-gray-50': '#f8fafc',
                    'color-gray-100': '#f1f5f9',
                    'color-gray-200': '#e2e8f0',
                    'color-gray-300': '#cbd5e1',
                    'color-gray-400': '#94a3b8',
                    'color-gray-500': '#64748b',
                    'color-gray-600': '#475569',
                    'color-gray-700': '#334155',
                    'color-gray-800': '#1e293b',
                    'color-gray-900': '#0f172a',
                    'color-white': '#ffffff',
                    'color-black': '#000000'
                }
            },
            dark: {
                name: 'Oscuro Sereno',
                colors: {
                    'color-gray-50': '#0f172a',
                    'color-gray-100': '#1e293b',
                    'color-gray-200': '#334155',
                    'color-gray-300': '#475569',
                    'color-gray-400': '#64748b',
                    'color-gray-500': '#94a3b8',
                    'color-gray-600': '#cbd5e1',
                    'color-gray-700': '#e2e8f0',
                    'color-gray-800': '#f1f5f9',
                    'color-gray-900': '#f8fafc',
                    'color-white': '#000000',
                    'color-black': '#ffffff'
                }
            },
            auto: {
                name: 'Adaptativo',
                colors: null // Usa preferencias del sistema
            }
        };
        
        this.currentTheme = this.getStoredTheme() || 'auto';
        this.systemPreference = this.getSystemPreference();
        this.breakpoints = {
            mobile: 320,
            tablet: 768,
            desktop: 1024,
            wide: 1440
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.setupMediaQueries();
        this.setupPerformanceOptimizations();
        this.setupSEOEnhancements();
        
        // Emitir evento para otros componentes
        document.dispatchEvent(new CustomEvent('themeInitialized', {
            detail: { theme: this.currentTheme, manager: this }
        }));
    }
    
    setupEventListeners() {
        // Toggle de tema
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Selector de tema
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }
        
        // Cambios en preferencias del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
        
        // Cambios de tamaño de fuente
        const fontSizeSlider = document.getElementById('font-size-slider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.setFontSize(e.target.value);
            });
        }
        
        // Cambios de espaciado
        const spacingSelector = document.getElementById('spacing-selector');
        if (spacingSelector) {
            spacingSelector.addEventListener('change', (e) => {
                this.setSpacing(e.target.value);
            });
        }
        
        // Toggle de animaciones
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                this.setAnimations(e.target.checked);
            });
        }
    }
    
    setupMediaQueries() {
        // Media queries para responsive design
        this.mediaQueries = {
            mobile: window.matchMedia(`(max-width: ${this.breakpoints.tablet - 1}px)`),
            tablet: window.matchMedia(`(min-width: ${this.breakpoints.tablet}px) and (max-width: ${this.breakpoints.desktop - 1}px)`),
            desktop: window.matchMedia(`(min-width: ${this.breakpoints.desktop}px) and (max-width: ${this.breakpoints.wide - 1}px)`),
            wide: window.matchMedia(`(min-width: ${this.breakpoints.wide}px)`)
        };
        
        // Escuchar cambios de viewport
        Object.values(this.mediaQueries).forEach(query => {
            query.addEventListener('change', () => this.handleViewportChange());
        });
        
        this.handleViewportChange();
    }
    
    setupPerformanceOptimizations() {
        // Preload de temas para mejor performance
        this.preloadThemes();
        
        // Optimizar transiciones según preferencias del usuario
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.setAttribute('data-reduced-motion', 'true');
        }
        
        // Optimizar para dispositivos móviles
        if (this.isMobile()) {
            document.body.setAttribute('data-mobile', 'true');
        }
    }
    
    setupSEOEnhancements() {
        // Schema.org para tema
        this.updateStructuredData();
        
        // Meta tags para tema
        this.updateMetaTags();
        
        // Clases SEO para crawlers
        document.body.setAttribute('data-theme-manager', 'active');
        document.body.setAttribute('data-accessibility', 'wcag-21-aaa');
    }
    
    getStoredTheme() {
        return localStorage.getItem('atlas-theme') || 'auto';
    }
    
    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    setTheme(theme) {
        if (!this.themes[theme]) {
            console.warn(`Theme "${theme}" not found`);
            return;
        }
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.storeTheme(theme);
        
        // Emitir evento de cambio
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme, manager: this }
        }));
    }
    
    applyTheme(theme) {
        const themeConfig = this.themes[theme];
        let actualTheme = theme;
        
        if (theme === 'auto') {
            actualTheme = this.systemPreference;
        }
        
        // Aplicar colores al root
        if (themeConfig && themeConfig.colors) {
            const root = document.documentElement;
            Object.entries(themeConfig.colors).forEach(([property, value]) => {
                root.style.setProperty(`--${property}`, value);
            });
        }
        
        // Actualizar atributos del body
        document.body.setAttribute('data-theme', actualTheme);
        document.body.setAttribute('data-theme-mode', theme);
        
        // Actualizar aria-label para accesibilidad
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const themeName = this.themes[theme].name;
            themeToggle.setAttribute('aria-label', `Tema actual: ${themeName}. Cambiar tema`);
        }
        
        // Actualizar selector si existe
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
    }
    
    toggleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }
    
    storeTheme(theme) {
        localStorage.setItem('atlas-theme', theme);
    }
    
    setFontSize(size) {
        const root = document.documentElement;
        const clampedSize = Math.max(14, Math.min(20, size));
        
        root.style.setProperty('--base-font-size', `${clampedSize}px`);
        localStorage.setItem('atlas-font-size', clampedSize);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('fontSizeChanged', {
            detail: { size: clampedSize, manager: this }
        }));
    }
    
    setSpacing(spacing) {
        const spacingMultipliers = {
            compact: 0.75,
            normal: 1,
            generous: 1.25
        };
        
        const multiplier = spacingMultipliers[spacing] || 1;
        document.body.setAttribute('data-spacing', spacing);
        document.body.style.setProperty('--spacing-multiplier', multiplier);
        localStorage.setItem('atlas-spacing', spacing);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('spacingChanged', {
            detail: { spacing, multiplier, manager: this }
        }));
    }
    
    setAnimations(enabled) {
        if (enabled) {
            document.body.removeAttribute('data-no-animations');
        } else {
            document.body.setAttribute('data-no-animations', 'true');
        }
        
        localStorage.setItem('atlas-animations', enabled);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('animationsChanged', {
            detail: { enabled, manager: this }
        }));
    }
    
    handleViewportChange() {
        let currentViewport = 'mobile';
        
        if (this.mediaQueries.wide.matches) {
            currentViewport = 'wide';
        } else if (this.mediaQueries.desktop.matches) {
            currentViewport = 'desktop';
        } else if (this.mediaQueries.tablet.matches) {
            currentViewport = 'tablet';
        }
        
        document.body.setAttribute('data-viewport', currentViewport);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('viewportChanged', {
            detail: { viewport: currentViewport, manager: this }
        }));
    }
    
    preloadThemes() {
        // Preload de recursos de temas para mejor performance
        Object.keys(this.themes).forEach(theme => {
            if (theme !== 'auto') {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = `/assets-atlas/css/themes/${theme}.css`;
                link.setAttribute('data-theme-preload', theme);
                document.head.appendChild(link);
            }
        });
    }
    
    updateStructuredData() {
        // Actualizar Schema.org para tema
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
            try {
                const data = JSON.parse(script.textContent);
                if (data.about) {
                    data.about.theme = this.currentTheme;
                    data.about.accessibility = 'WCAG 2.1 AAA';
                    script.textContent = JSON.stringify(data, null, 2);
                }
            } catch (e) {
                console.warn('Error updating structured data:', e);
            }
        }
    }
    
    updateMetaTags() {
        // Actualizar meta tags para SEO
        let themeColor = '#3b82f6'; // Default blue trust
        
        if (this.currentTheme === 'dark') {
            themeColor = '#1e293b';
        } else if (this.currentTheme === 'auto' && this.systemPreference === 'dark') {
            themeColor = '#1e293b';
        }
        
        // Actualizar o crear theme-color meta tag
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = themeColor;
        
        // Actualizar meta description si es necesario
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            const currentDesc = description.content;
            const themeName = this.themes[this.currentTheme].name;
            if (!currentDesc.includes(themeName)) {
                description.content = `${currentDesc} - Tema: ${themeName}`;
            }
        }
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getActualTheme() {
        if (this.currentTheme === 'auto') {
            return this.systemPreference;
        }
        return this.currentTheme;
    }
    
    getThemeConfig(theme = null) {
        const actualTheme = theme || this.currentTheme;
        return this.themes[actualTheme];
    }
    
    exportSettings() {
        const settings = {
            theme: this.currentTheme,
            fontSize: localStorage.getItem('atlas-font-size') || '16',
            spacing: localStorage.getItem('atlas-spacing') || 'normal',
            animations: localStorage.getItem('atlas-animations') !== 'false'
        };
        
        return JSON.stringify(settings, null, 2);
    }
    
    importSettings(settingsJson) {
        try {
            const settings = JSON.parse(settingsJson);
            
            if (settings.theme) {
                this.setTheme(settings.theme);
            }
            
            if (settings.fontSize) {
                this.setFontSize(settings.fontSize);
            }
            
            if (settings.spacing) {
                this.setSpacing(settings.spacing);
            }
            
            if (typeof settings.animations === 'boolean') {
                this.setAnimations(settings.animations);
            }
            
            return true;
        } catch (e) {
            console.error('Error importing settings:', e);
            return false;
        }
    }
    
    resetToDefaults() {
        this.setTheme('auto');
        this.setFontSize(16);
        this.setSpacing('normal');
        this.setAnimations(true);
        
        // Limpiar localStorage
        localStorage.removeItem('atlas-theme');
        localStorage.removeItem('atlas-font-size');
        localStorage.removeItem('atlas-spacing');
        localStorage.removeItem('atlas-animations');
    }
}

// Inicializar el theme manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.atlasThemeManager = new AtlasThemeManager();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtlasThemeManager;
}
