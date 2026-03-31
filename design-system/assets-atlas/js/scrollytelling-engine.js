/**
 * Atlas Somático Editorial - Scrollytelling Engine
 * Motor minimalista y sintético para experiencia terapéutica de scroll
 */

class AtlasScrollytelling {
  constructor() {
    this.isInitialized = false;
    this.scrollProgress = 0;
    this.scrollVelocity = 0;
    this.scrollDirection = 1;
    this.breathingPhase = 0;
    this.currentZone = 1;
    this.journeyDepth = 0;
    this.lastScrollY = 0;
    this.lastTimestamp = 0;
    this.zones = [];
    this.sections = [];
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    // Configuración terapéutica
    this.config = {
      breathingCycle: 4000, // 4 segundos por ciclo respiratorio
      zoneThreshold: 0.125, // 8 zonas = 100% / 8
      velocitySmoothing: 0.1,
      revealThreshold: 0.1,
      parallaxIntensity: 0.5,
      reducedMotion: false
    };
    
    this.init();
  }
  
  init() {
    // Detectar preferencia de movimiento reducido
    this.config.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Inicializar zonas somáticas
    this.initializeZones();
    
    // Configurar observadores
    this.setupIntersectionObserver();
    this.setupScrollListener();
    this.setupResizeListener();
    
    // Inicializar motor de respiración
    this.startBreathingEngine();
    
    // Cargar progreso guardado
    this.loadProgress();
    
    this.isInitialized = true;
    console.log('🧘 Atlas Scrollytelling Engine - Inicializado');
  }
  
  initializeZones() {
    this.zones = [
      { id: 1, name: 'Cabeza', element: '.zone-cabeza', progress: 0 },
      { id: 2, name: 'Cuello', element: '.zone-cuello', progress: 0.125 },
      { id: 3, name: 'Hombros', element: '.zone-hombros', progress: 0.25 },
      { id: 4, name: 'Pecho', element: '.zone-pecho', progress: 0.375 },
      { id: 5, name: 'Abdomen', element: '.zone-abdomen', progress: 0.5 },
      { id: 6, name: 'Pelvis', element: '.zone-pelvis', progress: 0.625 },
      { id: 7, name: 'Muslos', element: '.zone-muslos', progress: 0.75 },
      { id: 8, name: 'Piernas', element: '.zone-piernas', progress: 0.875 }
    ];
  }
  
  setupIntersectionObserver() {
    // Observer para secciones narrativas
    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.revealContent(entry.target);
        }
      });
    }, {
      threshold: this.config.revealThreshold,
      rootMargin: '0px 0px -10% 0px'
    });
    
    // Observer para elementos de revelación
    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const content = entry.target.querySelector('.reveal-content');
        const overlay = entry.target.querySelector('.reveal-overlay');
        
        if (entry.isIntersecting) {
          if (content) content.classList.add('revealed');
          if (overlay) overlay.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px'
    });
    
    // Observar elementos
    document.querySelectorAll('.story-section').forEach(section => {
      this.sectionObserver.observe(section);
    });
    
    document.querySelectorAll('.reveal-container').forEach(container => {
      this.revealObserver.observe(container);
    });
  }
  
  setupScrollListener() {
    let ticking = false;
    
    const updateScroll = () => {
      this.updateScrollProgress();
      this.updateScrollVelocity();
      this.updateScrollDirection();
      this.updateCurrentZone();
      this.updateCSSVariables();
      this.updateProgressIndicators();
      this.saveProgress();
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
      
      this.handleScrollState();
    }, { passive: true });
  }
  
  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.updateScrollProgress();
      this.updateCSSVariables();
    });
  }
  
  updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    this.scrollProgress = Math.min(100, Math.max(0, (scrolled / documentHeight) * 100));
    this.journeyDepth = this.scrollProgress / 100;
  }
  
  updateScrollVelocity() {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const deltaY = currentScrollY - this.lastScrollY;
    const deltaTime = currentTime - this.lastTimestamp;
    
    if (deltaTime > 0) {
      const instantVelocity = Math.abs(deltaY / deltaTime);
      this.scrollVelocity = this.scrollVelocity * (1 - this.config.velocitySmoothing) + 
                           instantVelocity * this.config.velocitySmoothing;
    }
    
    this.lastScrollY = currentScrollY;
    this.lastTimestamp = currentTime;
  }
  
  updateScrollDirection() {
    const currentScrollY = window.scrollY;
    this.scrollDirection = currentScrollY > this.lastScrollY ? 1 : -1;
  }
  
  updateCurrentZone() {
    const zoneIndex = Math.floor(this.journeyDepth / this.config.zoneThreshold);
    this.currentZone = Math.min(this.zones.length, Math.max(1, zoneIndex + 1));
  }
  
  updateCSSVariables() {
    const root = document.documentElement;
    
    // Variables principales de scrollytelling
    root.style.setProperty('--scroll-progress', this.scrollProgress);
    root.style.setProperty('--scroll-velocity', this.scrollVelocity);
    root.style.setProperty('--scroll-direction', this.scrollDirection);
    root.style.setProperty('--breathing-phase', this.breathingPhase);
    root.style.setProperty('--somatic-zone', this.currentZone);
    root.style.setProperty('--journey-depth', this.journeyDepth);
    
    // Variables de parallax
    if (!this.config.reducedMotion) {
      const parallaxOffset = this.scrollProgress * this.config.parallaxIntensity;
      root.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
    }
    
    // Variables de revelación
    const revealOpacity = Math.min(1, this.scrollProgress * 2);
    root.style.setProperty('--reveal-opacity', revealOpacity);
  }
  
  updateProgressIndicators() {
    // Actualizar indicadores de zona
    document.querySelectorAll('.progress-zone').forEach((indicator, index) => {
      indicator.classList.remove('active', 'completed');
      
      if (index < this.currentZone - 1) {
        indicator.classList.add('completed');
      } else if (index === this.currentZone - 1) {
        indicator.classList.add('active');
      }
    });
    
    // Actualizar navegación por capítulos
    document.querySelectorAll('.chapter-nav-item').forEach((item, index) => {
      item.classList.toggle('active', index === Math.floor(this.journeyDepth * 8));
    });
    
    // Actualizar barra de progreso
    const journeyProgressBar = document.querySelector('.journey-progress');
    if (journeyProgressBar) {
      journeyProgressBar.style.transform = `scaleX(${this.journeyDepth})`;
    }
  }
  
  revealContent(section) {
    const revealElements = section.querySelectorAll('.reveal-content');
    revealElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('revealed');
      }, index * 100);
    });
  }
  
  startBreathingEngine() {
    if (this.config.reducedMotion) return;
    
    const breathe = () => {
      this.breathingPhase = (this.breathingPhase + 0.025) % 1;
      document.documentElement.style.setProperty('--breathing-phase', this.breathingPhase);
      
      requestAnimationFrame(breathe);
    };
    
    requestAnimationFrame(breathe);
  }
  
  handleScrollState() {
    this.isScrolling = true;
    
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
      document.body.classList.remove('scrolling');
    }, 150);
    
    document.body.classList.add('scrolling');
  }
  
  saveProgress() {
    try {
      const progress = {
        scrollProgress: this.scrollProgress,
        currentZone: this.currentZone,
        journeyDepth: this.journeyDepth,
        timestamp: Date.now()
      };
      localStorage.setItem('atlas-scrollytelling-progress', JSON.stringify(progress));
    } catch (error) {
      console.warn('No se pudo guardar el progreso:', error);
    }
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('atlas-scrollytelling-progress');
      if (saved) {
        const progress = JSON.parse(saved);
        
        // Restaurar progreso si es reciente (menos de 24 horas)
        const hoursElapsed = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
        if (hoursElapsed < 24) {
          window.scrollTo(0, (progress.journeyDepth * (document.documentElement.scrollHeight - window.innerHeight)));
          
          // Mostrar opción de continuar
          this.showContinueOption(progress);
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar el progreso:', error);
    }
  }
  
  showContinueOption(progress) {
    const continueBanner = document.createElement('div');
    continueBanner.className = 'continue-banner';
    continueBanner.innerHTML = `
      <div class="continue-content">
        <p>Continuar tu viaje desde la zona ${this.zones[progress.currentZone - 1]?.name || 'inicial'}</p>
        <button class="continue-cta">Continuar</button>
        <button class="restart-cta">Reiniciar</button>
      </div>
    `;
    
    document.body.appendChild(continueBanner);
    
    continueBanner.querySelector('.continue-cta').addEventListener('click', () => {
      continueBanner.remove();
    });
    
    continueBanner.querySelector('.restart-cta').addEventListener('click', () => {
      window.scrollTo(0, 0);
      continueBanner.remove();
      localStorage.removeItem('atlas-scrollytelling-progress');
    });
  }
  
  // Métodos públicos para control externo
  scrollToZone(zoneId) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      const targetScroll = zone.progress * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }
  
  scrollToProgress(progress) {
    const targetScroll = (progress / 100) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }
  
  getCurrentZone() {
    return this.zones[this.currentZone - 1] || this.zones[0];
  }
  
  getJourneyStats() {
    return {
      progress: this.scrollProgress,
      currentZone: this.currentZone,
      journeyDepth: this.journeyDepth,
      velocity: this.scrollVelocity,
      zonesCompleted: this.currentZone - 1,
      zonesRemaining: this.zones.length - this.currentZone
    };
  }
  
  // Método de destrucción
  destroy() {
    if (this.sectionObserver) this.sectionObserver.disconnect();
    if (this.revealObserver) this.revealObserver.disconnect();
    
    window.removeEventListener('scroll', this.updateScrollProgress);
    window.removeEventListener('resize', this.updateScrollProgress);
    
    clearTimeout(this.scrollTimeout);
    
    this.isInitialized = false;
    console.log('🧘 Atlas Scrollytelling Engine - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AtlasScrollytelling = new AtlasScrollytelling();
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasScrollytelling;
}
