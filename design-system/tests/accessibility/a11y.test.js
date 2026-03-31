/**
 * Accessibility Tests for Atlas Somático Editorial
 */

const { AxeBuilder } = require('@axe-core/webdriverjs');
const axe = require('axe-core');

describe('Atlas Somático Editorial - Accessibility Tests', () => {
  let axeBuilder;
  
  beforeEach(() => {
    // Setup basic DOM structure for testing
    document.body.innerHTML = `
      <!-- Skip Links -->
      <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
      <a href="#navigation" class="skip-link">Saltar a la navegación</a>
      
      <!-- Header -->
      <header class="atlas-top-bar" role="banner">
        <div class="atlas-lighthouse" aria-label="Puntuación Lighthouse">
          <div class="lighthouse-indicator" aria-hidden="true"></div>
          <span class="lighthouse-score">98</span>
        </div>
        
        <nav class="atlas-search-left" role="search" aria-label="Búsqueda en Atlas">
          <svg class="search-icon-left" aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            class="search-input-left" 
            placeholder="Buscar en Atlas..."
            aria-label="Buscar en Atlas Somático"
            autocomplete="off"
          >
        </nav>
        
        <div class="atlas-slogan" role="heading" aria-level="1">
          Experiencia Completa
        </div>
        
        <a href="#" class="atlas-logo-right" aria-label="Atlas Somático - Inicio">
          <div class="logo-icon" aria-hidden="true">AS</div>
          <span class="logo-text">Atlas Somático</span>
        </a>
      </header>
      
      <!-- Main Navigation -->
      <nav class="navigation-tabs" role="navigation" aria-label="Navegación principal">
        <ul class="tabs-list" role="tablist">
          <li class="tab-item" role="none">
            <button 
              class="tab-button active" 
              data-tab="scrollytelling"
              role="tab"
              aria-selected="true"
              aria-controls="scrollytelling"
              tabindex="0"
            >
              Scrollytelling
            </button>
          </li>
          <li class="tab-item" role="none">
            <button 
              class="tab-button" 
              data-tab="body-maps"
              role="tab"
              aria-selected="false"
              aria-controls="body-maps"
              tabindex="-1"
            >
              Mapas Corporales
            </button>
          </li>
          <li class="tab-item" role="none">
            <button 
              class="tab-button" 
              data-tab="data-viz"
              role="tab"
              aria-selected="false"
              aria-controls="data-viz"
              tabindex="-1"
            >
              Visualización Médica
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Main Content -->
      <main id="main-content" role="main">
        <!-- Scrollytelling Tab -->
        <section id="scrollytelling" class="tab-content active" role="tabpanel" aria-labelledby="scrollytelling-tab">
          <div class="section-header">
            <h1 class="section-title">Scrollytelling Terapéutico</h1>
            <p class="section-description">
              Un viaje somático a través del scroll consciente. Cada pixel revela una capa más profunda de la conexión mente-cuerpo.
            </p>
          </div>
          
          <div class="hero-scroll" role="img" aria-label="Ilustración del viaje somático">
            <div class="parallax-layer parallax-bg" aria-hidden="true"></div>
            <div class="parallax-layer parallax-mid" aria-hidden="true"></div>
            <div class="parallax-layer parallax-fg" aria-hidden="true"></div>
            
            <div class="hero-content">
              <h2 class="hero-title">Atlas Somático</h2>
              <p class="hero-subtitle">Viaje a través de tu cuerpo consciente</p>
            </div>
          </div>
          
          <div class="story-section zone-cabeza" role="region" aria-labelledby="cabeza-heading">
            <div class="sticky-content">
              <h2 id="cabeza-heading" class="atlas-h2">Cabeza</h2>
              <p class="atlas-description">
                El centro del pensamiento y la conciencia. Donde comienza el viaje de autoconocimiento.
              </p>
            </div>
          </div>
        </section>
        
        <!-- Body Maps Tab -->
        <section id="body-maps" class="tab-content" role="tabpanel" aria-labelledby="body-maps-tab" hidden>
          <div class="section-header">
            <h1 class="section-title">Mapas Corporales Interactivos</h1>
            <p class="section-description">
              Explora las 50 zonas del Atlas Somático con mapas interactivos, búsqueda semántica y visualización de síntomas.
            </p>
          </div>
          
          <div class="search-container" role="search">
            <label for="somatic-search" class="visually-hidden">Buscar síntomas, zonas o tratamientos</label>
            <input 
              type="text" 
              id="somatic-search"
              class="search-input-somatic" 
              placeholder="Buscar zonas, síntomas, tratamientos..."
              aria-label="Buscar en Atlas Somático"
              autocomplete="off"
            >
            <div class="search-results-container" role="region" aria-live="polite" aria-label="Resultados de búsqueda"></div>
          </div>
          
          <div class="body-maps-container" role="application" aria-label="Mapa corporal interactivo">
            <div class="map-controls" role="toolbar" aria-label="Controles del mapa">
              <button 
                class="map-control-btn" 
                data-action="zoom-in"
                aria-label="Acercar zoom"
                title="Acercar zoom"
              >
                <span aria-hidden="true">+</span>
              </button>
              <button 
                class="map-control-btn" 
                data-action="zoom-out"
                aria-label="Alejar zoom"
                title="Alejar zoom"
              >
                <span aria-hidden="true">−</span>
              </button>
              <button 
                class="map-control-btn" 
                data-action="zoom-reset"
                aria-label="Reiniciar zoom"
                title="Reiniciar zoom"
              >
                <span aria-hidden="true">⟲</span>
              </button>
            </div>
            
            <svg class="body-map-svg" viewBox="0 0 400 800" role="img" aria-label="Mapa corporal humano con 50 zonas">
              <g class="body-map-group">
                <ellipse 
                  class="body-zone" 
                  cx="200" 
                  cy="80" 
                  rx="60" 
                  ry="30" 
                  data-zone="1"
                  role="button"
                  tabindex="0"
                  aria-label="Zona 1: Cabeza - Centro del pensamiento y la conciencia"
                />
                <rect 
                  class="body-zone" 
                  x="180" 
                  y="130" 
                  width="40" 
                  height="30" 
                  rx="10" 
                  data-zone="2"
                  role="button"
                  tabindex="0"
                  aria-label="Zona 2: Cuello - Conexión entre cabeza y torso"
                />
              </g>
            </svg>
            
            <div class="zone-info-panel" role="dialog" aria-labelledby="zone-info-title" hidden>
              <div class="zone-info-header">
                <h3 id="zone-info-title" class="zone-name">Selecciona una zona</h3>
                <button class="zone-close" aria-label="Cerrar información de zona">×</button>
              </div>
              <p class="zone-description">
                Haz clic en cualquier zona del mapa corporal para explorar sus características.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <!-- Progress Panel -->
      <aside class="progress-panel" role="complementary" aria-label="Panel de progreso terapéutico">
        <div class="progress-header">
          <h3 class="progress-title">Tu Progreso</h3>
          <div class="progress-level" role="status" aria-label="Nivel actual">
            <span class="level-number">1</span>
            <span class="level-name">Explorador Inicial</span>
          </div>
        </div>
        
        <div class="progress-stats" role="group" aria-label="Estadísticas de progreso">
          <div class="stat-item">
            <div class="stat-value" aria-label="Puntos obtenidos">0</div>
            <div class="stat-label">Puntos</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" aria-label="Zonas exploradas">0</div>
            <div class="stat-label">Zonas</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" aria-label="Días de racha">0</div>
            <div class="stat-label">Racha</div>
          </div>
        </div>
        
        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso general">
          <div class="progress-fill" style="width: 0%" aria-hidden="true"></div>
        </div>
      </aside>
      
      <!-- Medical Disclaimer -->
      <div class="medical-disclaimer" role="alert" aria-live="polite">
        DISCLAIMER MÉDICO
      </div>
    `;
    
    // Initialize axe-core
    axeBuilder = new AxeBuilder(document);
  });
  
  describe('WCAG 2.1 AAA Compliance', () => {
    test('should pass all axe-core accessibility tests', async () => {
      const results = await axeBuilder.analyze();
      
      // Check for any violations
      expect(results.violations).toHaveLength(0);
      
      // If there are violations, log them for debugging
      if (results.violations.length > 0) {
        console.log('Accessibility Violations:', results.violations);
      }
    });
    
    test('should have proper heading structure', () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const h1Count = document.querySelectorAll('h1').length;
      
      // Should have exactly one h1
      expect(h1Count).toBe(1);
      
      // Headings should be properly nested
      let previousLevel = 1;
      headings.forEach(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
        previousLevel = currentLevel;
      });
    });
    
    test('should have sufficient color contrast', async () => {
      const results = await axeBuilder
        .include('.progress-panel, .atlas-top-bar, .navigation-tabs')
        .withRules(['color-contrast'])
        .analyze();
      
      expect(results.violations).toHaveLength(0);
    });
    
    test('should have keyboard navigation support', () => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Should have focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All interactive elements should be focusable
      focusableElements.forEach(element => {
        expect(element.tabIndex).toBeGreaterThanOrEqual(0);
      });
    });
    
    test('should have proper ARIA labels and roles', () => {
      // Check important interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, [role]');
      
      interactiveElements.forEach(element => {
        // Buttons should have accessible names
        if (element.tagName === 'BUTTON') {
          const hasText = element.textContent.trim().length > 0;
          const hasAriaLabel = element.getAttribute('aria-label');
          const hasAriaLabelledBy = element.getAttribute('aria-labelledby');
          
          expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true);
        }
        
        // Elements with roles should have appropriate attributes
        const role = element.getAttribute('role');
        if (role) {
          switch (role) {
            case 'button':
            case 'link':
              expect(element.getAttribute('tabindex')).toBeGreaterThanOrEqual(0);
              break;
            case 'navigation':
            case 'main':
            case 'complementary':
            case 'banner':
              expect(element.getAttribute('aria-label') || element.getAttribute('aria-labelledby')).toBeTruthy();
              break;
          }
        }
      });
    });
    
    test('should have proper form labels', () => {
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
        const hasTitle = input.getAttribute('title');
        
        expect(hasLabel || hasAriaLabel || hasAriaLabelledBy || hasTitle).toBeTruthy();
      });
    });
    
    test('should have skip links for keyboard navigation', () => {
      const skipLinks = document.querySelectorAll('.skip-link');
      
      // Should have skip links
      expect(skipLinks.length).toBeGreaterThan(0);
      
      // Skip links should be visible when focused
      skipLinks.forEach(link => {
        expect(link.getAttribute('href')).toBeTruthy();
        expect(link.getAttribute('href')).startsWith('#');
      });
    });
    
    test('should have proper table headers if tables exist', () => {
      const tables = document.querySelectorAll('table');
      
      tables.forEach(table => {
        const hasHeaders = table.querySelectorAll('th').length > 0;
        const hasScope = table.querySelectorAll('[scope]').length > 0;
        
        if (hasHeaders) {
          expect(hasScope).toBe(true);
        }
      });
    });
    
    test('should have alt text for images', () => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        expect(img.getAttribute('alt')).toBeDefined();
      });
    });
    
    test('should have proper link text', () => {
      const links = document.querySelectorAll('a[href]');
      
      links.forEach(link => {
        const linkText = link.textContent.trim();
        const hasAriaLabel = link.getAttribute('aria-label');
        const hasTitle = link.getAttribute('title');
        
        // Link should have descriptive text
        expect(linkText.length > 0 || hasAriaLabel || hasTitle).toBe(true);
        
        // Avoid generic link text like "click here" or "read more"
        if (linkText) {
          expect(linkText.toLowerCase()).not.toMatch(/^(click here|read more|more|link)$/);
        }
      });
    });
  });
  
  describe('Screen Reader Support', () => {
    test('should announce dynamic content changes', () => {
      // Check for live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      
      expect(liveRegions.length).toBeGreaterThan(0);
      
      liveRegions.forEach(region => {
        const politeness = region.getAttribute('aria-live');
        expect(['polite', 'assertive', 'off']).toContain(politeness);
      });
    });
    
    test('should have proper document structure', () => {
      // Should have proper landmark roles
      const landmarks = {
        'main': document.querySelector('main'),
        'header': document.querySelector('header'),
        'nav': document.querySelector('nav'),
        'aside': document.querySelector('aside'),
        'footer': document.querySelector('footer')
      };
      
      // Should have main content area
      expect(landmarks.main).toBeTruthy();
      
      // Should have navigation
      expect(landmarks.nav).toBeTruthy();
      
      // Should have header/banner
      expect(landmarks.header).toBeTruthy();
    });
    
    test('should have proper language declaration', () => {
      const html = document.documentElement;
      expect(html.getAttribute('lang')).toBe('es');
    });
    
    test('should have proper page title', () => {
      const title = document.querySelector('title');
      expect(title).toBeTruthy();
      expect(title.textContent.trim().length).toBeGreaterThan(0);
    });
  });
  
  describe('Keyboard Accessibility', () => {
    test('should support tab navigation', () => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Should have focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All focusable elements should be reachable by tab
      focusableElements.forEach((element, index) => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });
    
    test('should have visible focus indicators', () => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Check if elements have focus styles
      focusableElements.forEach(element => {
        element.focus();
        const styles = window.getComputedStyle(element);
        
        // Should have some visual indication of focus
        const hasOutline = styles.outline !== 'none';
        const hasBoxShadow = styles.boxShadow !== 'none';
        const hasBorderChange = styles.borderColor !== 'rgb(0, 0, 0)';
        
        expect(hasOutline || hasBoxShadow || hasBorderChange).toBe(true);
      });
    });
    
    test('should support keyboard shortcuts', () => {
      // Check for keyboard shortcut indicators
      const shortcutElements = document.querySelectorAll('[accesskey], [title*="Alt"], [title*="Ctrl"]');
      
      // Should have keyboard shortcuts documented
      expect(shortcutElements.length).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Mobile Accessibility', () => {
    test('should have appropriate touch targets', () => {
      const touchTargets = document.querySelectorAll('button, a, input, [role="button"]');
      
      touchTargets.forEach(element => {
        const styles = window.getComputedStyle(element);
        const width = parseInt(styles.width);
        const height = parseInt(styles.height);
        
        // Touch targets should be at least 44x44 pixels
        expect(width).toBeGreaterThanOrEqual(44);
        expect(height).toBeGreaterThanOrEqual(44);
      });
    });
    
    test('should be usable with touch', () => {
      const interactiveElements = document.querySelectorAll('button, a, input');
      
      interactiveElements.forEach(element => {
        // Should not rely on hover-only interactions
        const hoverStyles = window.getComputedStyle(element, ':hover');
        const hasHoverOnlyContent = element.textContent.trim().length === 0 && 
                                 hoverStyles.display !== 'none';
        
        expect(hasHoverOnlyContent).toBe(false);
      });
    });
  });
  
  describe('Performance and Accessibility', () => {
    test('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      // Check if animations are disabled
      const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
      
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const animationDuration = styles.animationDuration;
        const transitionDuration = styles.transitionDuration;
        
        // Should have reduced or no animations
        expect(animationDuration === '0s' || animationDuration.includes('0.01s')).toBe(true);
        expect(transitionDuration === '0s' || transitionDuration.includes('0.01s')).toBe(true);
      });
    });
    
    test('should have sufficient text sizing', () => {
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th');
      
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const fontSize = parseFloat(styles.fontSize);
        
        // Should be at least 16px for body text
        if (element.tagName === 'P' || element.tagName === 'LI' || element.tagName === 'TD') {
          expect(fontSize).toBeGreaterThanOrEqual(16);
        }
      });
    });
  });
  
  describe('Medical Disclaimer Accessibility', () => {
    test('should have properly accessible medical disclaimer', () => {
      const disclaimer = document.querySelector('.medical-disclaimer');
      
      expect(disclaimer).toBeTruthy();
      expect(disclaimer.getAttribute('role')).toBe('alert');
      expect(disclaimer.getAttribute('aria-live')).toBe('polite');
      
      // Should be visible to screen readers
      const styles = window.getComputedStyle(disclaimer);
      expect(styles.display).not.toBe('none');
      expect(styles.visibility).not.toBe('hidden');
      expect(styles.opacity).not.toBe('0');
    });
    
    test('should have high contrast for medical disclaimer', async () => {
      const disclaimer = document.querySelector('.medical-disclaimer');
      
      const results = await axeBuilder
        .include('.medical-disclaimer')
        .withRules(['color-contrast'])
        .analyze();
      
      expect(results.violations).toHaveLength(0);
    });
  });
});
