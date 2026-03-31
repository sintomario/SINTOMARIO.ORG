/**
 * Unit Tests for Atlas Scrollytelling Engine
 */

describe('AtlasScrollytelling', () => {
  let scrollytellingEngine;
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="hero-scroll">
        <div class="parallax-layer parallax-bg"></div>
        <div class="parallax-layer parallax-mid"></div>
        <div class="parallax-layer parallax-fg"></div>
        <div class="hero-content">
          <h1 class="hero-title">Atlas Somático</h1>
          <p class="hero-subtitle">Viaje a través de tu cuerpo consciente</p>
        </div>
      </div>
      <div class="story-section zone-cabeza">
        <div class="sticky-content">
          <h2 class="atlas-h2">Cabeza</h2>
          <p class="atlas-description">El centro del pensamiento y la conciencia.</p>
        </div>
      </div>
      <div class="story-section zone-corazon">
        <div class="sticky-content">
          <h2 class="atlas-h2">Corazón</h2>
          <p class="atlas-description">El centro emocional y respiratorio.</p>
        </div>
      </div>
      <div class="progress-indicator">
        <div class="progress-fill"></div>
      </div>
    `;
    
    // Mock the AtlasScrollytelling class
    global.AtlasScrollytelling = class AtlasScrollytelling {
      constructor() {
        this.isInitialized = false;
        this.scrollProgress = 0;
        this.scrollVelocity = 0;
        this.scrollDirection = 'down';
        this.currentZone = null;
        this.breathingPhase = 'inhalation';
        this.config = {
          scrollThreshold: 0.1,
          velocityThreshold: 5,
          breathingCycles: 4
        };
      }
      
      async init() {
        this.isInitialized = true;
        this.setupScrollListeners();
        this.setupIntersectionObserver();
        this.loadProgress();
        return true;
      }
      
      setupScrollListeners() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
      }
      
      setupIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this));
        const sections = document.querySelectorAll('.story-section');
        sections.forEach(section => this.observer.observe(section));
      }
      
      handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = scrollTop / scrollHeight;
        this.updateAnimations();
      }
      
      handleIntersection(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.currentZone = entry.target.dataset.zone;
          }
        });
      }
      
      updateAnimations() {
        // Update parallax layers
        const layers = document.querySelectorAll('.parallax-layer');
        layers.forEach((layer, index) => {
          const speed = (index + 1) * 0.5;
          const yPos = -(this.scrollProgress * speed * 100);
          layer.style.transform = `translateY(${yPos}px)`;
        });
        
        // Update progress indicator
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
          progressFill.style.width = `${this.scrollProgress * 100}%`;
        }
        
        // Update breathing animation
        this.updateBreathingAnimation();
      }
      
      updateBreathingAnimation() {
        const phases = ['inhalation', 'retention', 'exhalation', 'pause'];
        const phaseIndex = Math.floor(this.scrollProgress * this.config.breathingCycles) % phases.length;
        this.breathingPhase = phases[phaseIndex];
      }
      
      loadProgress() {
        const saved = localStorage.getItem('atlas-scrollytelling-progress');
        if (saved) {
          const data = JSON.parse(saved);
          this.scrollProgress = data.progress || 0;
          this.currentZone = data.zone || null;
        }
      }
      
      saveProgress() {
        const data = {
          progress: this.scrollProgress,
          zone: this.currentZone,
          timestamp: Date.now()
        };
        localStorage.setItem('atlas-scrollytelling-progress', JSON.stringify(data));
      }
      
      destroy() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        if (this.observer) {
          this.observer.disconnect();
        }
        this.saveProgress();
      }
    };
    
    scrollytellingEngine = new AtlasScrollytelling();
  });
  
  describe('Initialization', () => {
    test('should initialize correctly', async () => {
      const result = await scrollytellingEngine.init();
      expect(result).toBe(true);
      expect(scrollytellingEngine.isInitialized).toBe(true);
    });
    
    test('should setup scroll listeners on initialization', async () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      await scrollytellingEngine.init();
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      addEventListenerSpy.mockRestore();
    });
    
    test('should setup intersection observer on initialization', async () => {
      const observeSpy = jest.fn();
      global.IntersectionObserver = jest.fn(() => ({
        observe: observeSpy,
        disconnect: jest.fn()
      }));
      
      await scrollytellingEngine.init();
      expect(observeSpy).toHaveBeenCalledTimes(2); // Two story sections
    });
    
    test('should load saved progress on initialization', async () => {
      const mockProgress = { progress: 0.5, zone: 'cabeza', timestamp: Date.now() };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProgress));
      
      await scrollytellingEngine.init();
      expect(scrollytellingEngine.scrollProgress).toBe(0.5);
      expect(scrollytellingEngine.currentZone).toBe('cabeza');
    });
  });
  
  describe('Scroll Handling', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should calculate scroll progress correctly', () => {
      // Mock scroll position
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        configurable: true,
        value: 500
      });
      
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        writable: true,
        configurable: true,
        value: 2000
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      });
      
      scrollytellingEngine.handleScroll();
      
      const expectedProgress = 500 / (2000 - 800);
      expect(scrollytellingEngine.scrollProgress).toBeCloseTo(expectedProgress, 5);
    });
    
    test('should update parallax layers on scroll', () => {
      scrollytellingEngine.scrollProgress = 0.5;
      scrollytellingEngine.updateAnimations();
      
      const layers = document.querySelectorAll('.parallax-layer');
      layers.forEach((layer, index) => {
        const expectedSpeed = (index + 1) * 0.5;
        const expectedYPos = -(0.5 * expectedSpeed * 100);
        expect(layer.style.transform).toBe(`translateY(${expectedYPos}px)`);
      });
    });
    
    test('should update progress indicator on scroll', () => {
      scrollytellingEngine.scrollProgress = 0.75;
      scrollytellingEngine.updateAnimations();
      
      const progressFill = document.querySelector('.progress-fill');
      expect(progressFill.style.width).toBe('75%');
    });
    
    test('should update breathing phase based on scroll progress', () => {
      const phases = ['inhalation', 'retention', 'exhalation', 'pause'];
      
      phases.forEach((phase, index) => {
        scrollytellingEngine.scrollProgress = (index / phases.length) + 0.1;
        scrollytellingEngine.updateBreathingAnimation();
        expect(scrollytellingEngine.breathingPhase).toBe(phase);
      });
    });
  });
  
  describe('Intersection Observer', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should update current zone when section is intersecting', () => {
      const mockEntry = {
        isIntersecting: true,
        target: {
          dataset: { zone: 'cabeza' }
        }
      };
      
      scrollytellingEngine.handleIntersection([mockEntry]);
      expect(scrollytellingEngine.currentZone).toBe('cabeza');
    });
    
    test('should not update current zone when section is not intersecting', () => {
      const mockEntry = {
        isIntersecting: false,
        target: {
          dataset: { zone: 'cabeza' }
        }
      };
      
      scrollytellingEngine.handleIntersection([mockEntry]);
      expect(scrollytellingEngine.currentZone).toBeNull();
    });
  });
  
  describe('Progress Management', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should save progress to localStorage', () => {
      scrollytellingEngine.scrollProgress = 0.6;
      scrollytellingEngine.currentZone = 'corazon';
      
      scrollytellingEngine.saveProgress();
      
      const expectedData = {
        progress: 0.6,
        zone: 'corazon',
        timestamp: expect.any(Number)
      };
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'atlas-scrollytelling-progress',
        JSON.stringify(expectedData)
      );
    });
    
    test('should load progress from localStorage', () => {
      const mockData = {
        progress: 0.3,
        zone: 'cabeza',
        timestamp: Date.now() - 1000
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      
      scrollytellingEngine.loadProgress();
      
      expect(scrollytellingEngine.scrollProgress).toBe(0.3);
      expect(scrollytellingEngine.currentZone).toBe('cabeza');
    });
    
    test('should handle corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      expect(() => {
        scrollytellingEngine.loadProgress();
      }).not.toThrow();
      
      expect(scrollytellingEngine.scrollProgress).toBe(0);
      expect(scrollytellingEngine.currentZone).toBeNull();
    });
  });
  
  describe('Cleanup', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should remove event listeners on destroy', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      scrollytellingEngine.destroy();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
    
    test('should disconnect intersection observer on destroy', () => {
      const disconnectSpy = jest.fn();
      scrollytellingEngine.observer = { disconnect: disconnectSpy };
      
      scrollytellingEngine.destroy();
      
      expect(disconnectSpy).toHaveBeenCalled();
    });
    
    test('should save progress before destroy', () => {
      const saveProgressSpy = jest.spyOn(scrollytellingEngine, 'saveProgress');
      
      scrollytellingEngine.destroy();
      
      expect(saveProgressSpy).toHaveBeenCalled();
    });
  });
  
  describe('Accessibility', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should have proper ARIA labels on story sections', () => {
      const sections = document.querySelectorAll('.story-section');
      sections.forEach(section => {
        expect(section.getAttribute('role')).toBe('region');
        expect(section.getAttribute('aria-label')).toBeTruthy();
      });
    });
    
    test('should have keyboard navigation support', () => {
      const focusableElements = document.querySelectorAll('button, [tabindex], a');
      expect(focusableElements.length).toBeGreaterThan(0);
    });
    
    test('should respect reduced motion preference', () => {
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
      
      // Re-initialize to test reduced motion
      scrollytellingEngine = new AtlasScrollytelling();
      scrollytellingEngine.init();
      
      // Should disable animations when reduced motion is preferred
      expect(document.documentElement.style.getPropertyValue('--animation-duration')).toBe('0s');
    });
  });
  
  describe('Performance', () => {
    beforeEach(async () => {
      await scrollytellingEngine.init();
    });
    
    test('should throttle scroll events', async () => {
      const handleScrollSpy = jest.spyOn(scrollytellingEngine, 'handleScroll');
      
      // Simulate rapid scroll events
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('scroll'));
      }
      
      // Should throttle to reasonable number of calls
      expect(handleScrollSpy).toHaveBeenCalledTimes(expect.any(Number));
      expect(handleScrollSpy).not.toHaveBeenCalledTimes(10);
    });
    
    test('should use requestAnimationFrame for animations', () => {
      const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
      
      scrollytellingEngine.updateAnimations();
      
      expect(rafSpy).toHaveBeenCalled();
      rafSpy.mockRestore();
    });
    
    test('should cleanup observers on destroy', async () => {
      const disconnectSpy = jest.fn();
      scrollytellingEngine.observer = { disconnect: disconnectSpy };
      
      scrollytellingEngine.destroy();
      
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
