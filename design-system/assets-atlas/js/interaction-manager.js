/**
 * Atlas Somático Editorial - Interaction Manager
 * Gestor de interacciones con micro-animaciones orgánicas y accesibilidad WCAG 2.1 AAA
 */

class AtlasInteractionManager {
    constructor() {
        this.interactions = {
            buttons: new Map(),
            cards: new Map(),
            forms: new Map(),
            navigation: new Map(),
            modals: new Map()
        };
        
        this.config = {
            enableAnimations: true,
            enableHaptics: false,
            enableSound: false,
            reducedMotion: false,
            touchOptimized: false
        };
        
        this.breakpoints = {
            mobile: 320,
            tablet: 768,
            desktop: 1024,
            wide: 1440
        };
        
        this.performance = {
            frameRate: 60,
            debounceDelay: 150,
            throttleDelay: 16
        };
        
        this.init();
    }
    
    init() {
        this.detectCapabilities();
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        
        // Emitir evento de inicialización
        document.dispatchEvent(new CustomEvent('interactionManagerInitialized', {
            detail: { manager: this }
        }));
    }
    
    detectCapabilities() {
        // Detectar capacidades del dispositivo
        this.config.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.config.touchOptimized = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.config.enableAnimations = !this.config.reducedMotion;
        
        // Detectar soporte de haptics
        this.config.enableHaptics = 'vibrate' in navigator;
        
        // Detectar viewport actual
        this.updateViewportInfo();
    }
    
    setupEventListeners() {
        // Eventos globales
        document.addEventListener('click', this.handleGlobalClick.bind(this), true);
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this), true);
        document.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), this.performance.throttleDelay));
        document.addEventListener('resize', this.debounce(this.handleResize.bind(this), this.performance.debounceDelay));
        
        // Eventos táctiles
        if (this.config.touchOptimized) {
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        }
        
        // Eventos de tema
        document.addEventListener('themeChanged', this.handleThemeChange.bind(this));
        document.addEventListener('fontSizeChanged', this.handleFontSizeChange.bind(this));
        document.addEventListener('spacingChanged', this.handleSpacingChange.bind(this));
    }
    
    initializeComponents() {
        // Inicializar botones
        this.initializeButtons();
        
        // Inicializar cards
        this.initializeCards();
        
        // Inicializar formularios
        this.initializeForms();
        
        // Inicializar navegación
        this.initializeNavigation();
        
        // Inicializar modales
        this.initializeModals();
    }
    
    initializeButtons() {
        const buttons = document.querySelectorAll('.btn, [role="button"]');
        
        buttons.forEach(button => {
            const buttonConfig = {
                element: button,
                originalText: button.textContent,
                isLoading: false,
                isDisabled: button.disabled
            };
            
            // Eventos del botón
            button.addEventListener('mouseenter', () => this.handleButtonHover(buttonConfig, true));
            button.addEventListener('mouseleave', () => this.handleButtonHover(buttonConfig, false));
            button.addEventListener('mousedown', () => this.handleButtonDown(buttonConfig));
            button.addEventListener('mouseup', () => this.handleButtonUp(buttonConfig));
            button.addEventListener('click', (e) => this.handleButtonClick(buttonConfig, e));
            
            // Accesibilidad
            button.addEventListener('focus', () => this.handleButtonFocus(buttonConfig, true));
            button.addEventListener('blur', () => this.handleButtonFocus(buttonConfig, false));
            
            // Touch events
            if (this.config.touchOptimized) {
                button.addEventListener('touchstart', () => this.handleButtonTouchStart(buttonConfig));
                button.addEventListener('touchend', () => this.handleButtonTouchEnd(buttonConfig));
            }
            
            this.interactions.buttons.set(button, buttonConfig);
        });
    }
    
    initializeCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const cardConfig = {
                element: card,
                isExpanded: false,
                originalTransform: card.style.transform || ''
            };
            
            // Eventos del card
            card.addEventListener('mouseenter', () => this.handleCardHover(cardConfig, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(cardConfig, false));
            card.addEventListener('click', () => this.handleCardClick(cardConfig));
            
            // Focus para accesibilidad
            card.addEventListener('focusin', () => this.handleCardFocus(cardConfig, true));
            card.addEventListener('focusout', () => this.handleCardFocus(cardConfig, false));
            
            this.interactions.cards.set(card, cardConfig);
        });
    }
    
    initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const formConfig = {
                element: form,
                isValid: false,
                isSubmitting: false,
                fields: new Map()
            };
            
            // Eventos del formulario
            form.addEventListener('submit', (e) => this.handleFormSubmit(formConfig, e));
            form.addEventListener('reset', () => this.handleFormReset(formConfig));
            
            // Inicializar campos
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => this.initializeFormField(formConfig, input));
            
            this.interactions.forms.set(form, formConfig);
        });
    }
    
    initializeFormField(formConfig, input) {
        const fieldConfig = {
            element: input,
            isValid: input.checkValidity(),
            isDirty: false,
            originalValue: input.value
        };
        
        // Eventos del campo
        input.addEventListener('focus', () => this.handleFieldFocus(fieldConfig, true));
        input.addEventListener('blur', () => this.handleFieldFocus(fieldConfig, false));
        input.addEventListener('input', () => this.handleFieldInput(fieldConfig));
        input.addEventListener('change', () => this.handleFieldChange(fieldConfig));
        
        // Validación en tiempo real
        input.addEventListener('invalid', (e) => this.handleFieldInvalid(fieldConfig, e));
        
        formConfig.fields.set(input, fieldConfig);
    }
    
    initializeNavigation() {
        const nav = document.querySelector('.therapeutic-navigation');
        if (!nav) return;
        
        const navConfig = {
            element: nav,
            isOpen: false,
            currentActiveItem: null
        };
        
        // Menu móvil
        const mobileToggle = document.querySelector('.mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu(navConfig));
        }
        
        // Items de navegación
        const navItems = nav.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigationClick(navConfig, item, e));
            item.addEventListener('mouseenter', () => this.handleNavHover(navConfig, item, true));
            item.addEventListener('mouseleave', () => this.handleNavHover(navConfig, item, false));
        });
        
        this.interactions.navigation.set(nav, navConfig);
    }
    
    initializeModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        
        modals.forEach(modal => {
            const modalConfig = {
                element: modal,
                isOpen: modal.classList.contains('active'),
                trigger: null,
                content: modal.querySelector('.modal')
            };
            
            // Buscar trigger
            const triggerId = modal.getAttribute('data-trigger');
            if (triggerId) {
                const trigger = document.getElementById(triggerId);
                if (trigger) {
                    trigger.addEventListener('click', () => this.openModal(modalConfig));
                    modalConfig.trigger = trigger;
                }
            }
            
            // Cerrar modal
            const closeButtons = modal.querySelectorAll('.modal-close');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => this.closeModal(modalConfig));
            });
            
            // Cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalConfig);
                }
            });
            
            // Tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalConfig.isOpen) {
                    this.closeModal(modalConfig);
                }
            });
            
            this.interactions.modals.set(modal, modalConfig);
        });
    }
    
    setupAccessibility() {
        // Skip links
        const skipLinks = document.querySelectorAll('.skip-link, .seo-skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA live regions
        this.setupAriaLiveRegions();
    }
    
    setupFocusManagement() {
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', (e) => {
            lastFocusedElement = e.target;
            
            // Agregar clase para estilos de focus
            document.body.setAttribute('data-focus-active', 'true');
            
            // Scroll suave al elemento si está fuera de vista
            this.scrollIntoViewIfNeeded(e.target);
        }, true);
        
        document.addEventListener('focusout', () => {
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    document.body.removeAttribute('data-focus-active');
                }
            }, 10);
        }, true);
        
        // Trap focus dentro de modales
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    this.trapFocus(e, activeModal);
                }
            }
        });
    }
    
    trapFocus(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    setupAriaLiveRegions() {
        // Crear regiones ARIA live si no existen
        if (!document.getElementById('aria-live-polite')) {
            const politeRegion = document.createElement('div');
            politeRegion.id = 'aria-live-polite';
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.className = 'sr-only';
            document.body.appendChild(politeRegion);
        }
        
        if (!document.getElementById('aria-live-assertive')) {
            const assertiveRegion = document.createElement('div');
            assertiveRegion.id = 'aria-live-assertive';
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.className = 'sr-only';
            document.body.appendChild(assertiveRegion);
        }
    }
    
    setupPerformanceOptimizations() {
        // Intersection Observer para lazy loading
        this.setupIntersectionObserver();
        
        // Resize Observer para responsive optimizations
        this.setupResizeObserver();
        
        // RequestAnimationFrame para animaciones suaves
        this.setupRAF();
    }
    
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleElementVisible(entry.target);
                    } else {
                        this.handleElementHidden(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            // Observar elementos animados
            document.querySelectorAll('.card, .btn').forEach(el => {
                this.intersectionObserver.observe(el);
            });
        }
    }
    
    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    this.handleElementResize(entry.target, entry.contentRect);
                });
            });
            
            // Observar contenedores importantes
            document.querySelectorAll('.atlas-container, .modal').forEach(el => {
                this.resizeObserver.observe(el);
            });
        }
    }
    
    setupRAF() {
        this.rafCallbacks = new Map();
        
        this.scheduleRAF = (callback, id) => {
            if (this.rafCallbacks.has(id)) {
                cancelAnimationFrame(this.rafCallbacks.get(id));
            }
            
            const rafId = requestAnimationFrame(() => {
                callback();
                this.rafCallbacks.delete(id);
            });
            
            this.rafCallbacks.set(id, rafId);
        };
    }
    
    // Manejadores de eventos
    handleButtonHover(config, isHovering) {
        if (!this.config.enableAnimations) return;
        
        if (isHovering) {
            config.element.classList.add('hover');
            this.animateButtonHover(config);
        } else {
            config.element.classList.remove('hover');
        }
    }
    
    handleButtonDown(config) {
        config.element.classList.add('active');
        if (this.config.enableHaptics) {
            navigator.vibrate(10);
        }
    }
    
    handleButtonUp(config) {
        config.element.classList.remove('active');
    }
    
    handleButtonClick(config, event) {
        if (config.isDisabled || config.isLoading) {
            event.preventDefault();
            return;
        }
        
        // Feedback visual
        this.createClickFeedback(event.pageX, event.pageY);
        
        // Emitir evento personalizado
        document.dispatchEvent(new CustomEvent('buttonClicked', {
            detail: { button: config.element, config }
        }));
    }
    
    handleButtonFocus(config, isFocused) {
        if (isFocused) {
            config.element.classList.add('focused');
        } else {
            config.element.classList.remove('focused');
        }
    }
    
    handleButtonTouchStart(config) {
        config.element.classList.add('touch-active');
    }
    
    handleButtonTouchEnd(config) {
        setTimeout(() => {
            config.element.classList.remove('touch-active');
        }, 150);
    }
    
    animateButtonHover(config) {
        this.scheduleRAF(() => {
            config.element.style.transform = 'translateY(-1px) scale(1.02)';
        }, `button-hover-${config.element.tagName}-${Date.now()}`);
    }
    
    handleCardHover(config, isHovering) {
        if (!this.config.enableAnimations) return;
        
        if (isHovering) {
            config.element.classList.add('hover');
            this.animateCardHover(config);
        } else {
            config.element.classList.remove('hover');
            this.resetCardTransform(config);
        }
    }
    
    handleCardClick(config) {
        // Toggle expanded state
        config.isExpanded = !config.isExpanded;
        config.element.classList.toggle('expanded', config.isExpanded);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('cardClicked', {
            detail: { card: config.element, config, expanded: config.isExpanded }
        }));
    }
    
    handleCardFocus(config, isFocused) {
        if (isFocused) {
            config.element.classList.add('focused');
        } else {
            config.element.classList.remove('focused');
        }
    }
    
    animateCardHover(config) {
        this.scheduleRAF(() => {
            config.element.style.transform = 'translateY(-2px) scale(1.02)';
            config.element.style.boxShadow = 'var(--shadow-lg)';
        }, `card-hover-${config.element.tagName}-${Date.now()}`);
    }
    
    resetCardTransform(config) {
        this.scheduleRAF(() => {
            config.element.style.transform = config.originalTransform;
            config.element.style.boxShadow = 'var(--shadow-sm)';
        }, `card-reset-${config.element.tagName}-${Date.now()}`);
    }
    
    handleFieldFocus(config, isFocused) {
        if (isFocused) {
            config.element.classList.add('focused');
            this.animateFieldFocus(config);
        } else {
            config.element.classList.remove('focused');
            this.validateField(config);
        }
    }
    
    handleFieldInput(config) {
        config.isDirty = true;
        this.validateField(config);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('fieldInput', {
            detail: { field: config.element, config }
        }));
    }
    
    handleFieldChange(config) {
        this.validateField(config);
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('fieldChanged', {
            detail: { field: config.element, config }
        }));
    }
    
    handleFieldInvalid(config, event) {
        event.preventDefault();
        config.element.classList.add('error');
        this.showFieldError(config, event.validationMessage);
    }
    
    animateFieldFocus(config) {
        this.scheduleRAF(() => {
            config.element.style.transform = 'scale(1.02)';
            config.element.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }, `field-focus-${config.element.tagName}-${Date.now()}`);
    }
    
    validateField(config) {
        const isValid = config.element.checkValidity();
        config.isValid = isValid;
        
        if (isValid) {
            config.element.classList.remove('error');
            config.element.classList.add('valid');
            this.hideFieldError(config);
        } else if (config.isDirty) {
            config.element.classList.add('error');
            config.element.classList.remove('valid');
            this.showFieldError(config, config.element.validationMessage);
        }
    }
    
    showFieldError(config, message) {
        let errorElement = config.element.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            config.element.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    hideFieldError(config) {
        const errorElement = config.element.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    handleFormSubmit(config, event) {
        if (config.isSubmitting) {
            event.preventDefault();
            return;
        }
        
        // Validar todos los campos
        let isValid = true;
        config.fields.forEach(fieldConfig => {
            this.validateField(fieldConfig);
            if (!fieldConfig.isValid) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            event.preventDefault();
            this.showFormError(config, 'Por favor, corrige los errores en el formulario');
            return;
        }
        
        config.isSubmitting = true;
        config.element.classList.add('submitting');
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('formSubmit', {
            detail: { form: config.element, config }
        }));
    }
    
    handleFormReset(config) {
        config.fields.forEach(fieldConfig => {
            fieldConfig.isDirty = false;
            fieldConfig.isValid = fieldConfig.element.checkValidity();
            fieldConfig.element.classList.remove('error', 'valid', 'focused');
            this.hideFieldError(fieldConfig);
        });
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('formReset', {
            detail: { form: config.element, config }
        }));
    }
    
    showFormError(config, message) {
        const existingError = config.element.querySelector('.form-error');
        if (existingError) return;
        
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger';
        errorElement.innerHTML = `
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
                <div class="alert-message">${message}</div>
            </div>
        `;
        
        config.element.insertBefore(errorElement, config.element.firstChild);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }
    
    handleNavigationClick(navConfig, item, event) {
        // Actualizar item activo
        if (navConfig.currentActiveItem) {
            navConfig.currentActiveItem.classList.remove('active');
        }
        
        navConfig.currentActiveItem = item;
        item.classList.add('active');
        
        // Cerrar menú móvil
        if (this.isMobile()) {
            this.closeMobileMenu(navConfig);
        }
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('navigationClick', {
            detail: { item, navConfig }
        }));
    }
    
    handleNavHover(navConfig, item, isHovering) {
        if (isHovering) {
            item.classList.add('hover');
        } else {
            item.classList.remove('hover');
        }
    }
    
    toggleMobileMenu(navConfig) {
        navConfig.isOpen = !navConfig.isOpen;
        
        if (navConfig.isOpen) {
            navConfig.element.classList.add('mobile-open');
            document.body.classList.add('mobile-menu-open');
        } else {
            navConfig.element.classList.remove('mobile-open');
            document.body.classList.remove('mobile-menu-open');
        }
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('mobileMenuToggle', {
            detail: { isOpen: navConfig.isOpen, navConfig }
        }));
    }
    
    closeMobileMenu(navConfig) {
        if (navConfig.isOpen) {
            this.toggleMobileMenu(navConfig);
        }
    }
    
    openModal(modalConfig) {
        modalConfig.isOpen = true;
        modalConfig.element.classList.add('active');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Focus al primer elemento enfocable
        const firstFocusable = modalConfig.element.querySelector('button, [href], input, select, textarea');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('modalOpen', {
            detail: { modal: modalConfig.element, config: modalConfig }
        }));
    }
    
    closeModal(modalConfig) {
        modalConfig.isOpen = false;
        modalConfig.element.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Return focus al trigger
        if (modalConfig.trigger) {
            modalConfig.trigger.focus();
        }
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('modalClose', {
            detail: { modal: modalConfig.element, config: modalConfig }
        }));
    }
    
    handleGlobalClick(event) {
        // Click feedback visual
        if (this.config.enableAnimations) {
            this.createClickFeedback(event.pageX, event.pageY);
        }
    }
    
    handleGlobalKeydown(event) {
        // Atajos de teclado
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '/':
                    event.preventDefault();
                    this.focusSearchInput();
                    break;
                case 'k':
                    event.preventDefault();
                    this.focusSearchInput();
                    break;
            }
        }
    }
    
    handleScroll() {
        // Optimizaciones durante scroll
        document.body.classList.add('scrolling');
        
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    }
    
    handleResize() {
        this.updateViewportInfo();
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('viewportResize', {
            detail: { manager: this }
        }));
    }
    
    handleTouchStart(event) {
        // Feedback táctil
        if (this.config.enableHaptics) {
            navigator.vibrate(5);
        }
    }
    
    handleTouchEnd(event) {
        // Limpiar estados táctiles
        document.querySelectorAll('.touch-active').forEach(el => {
            el.classList.remove('touch-active');
        });
    }
    
    handleThemeChange(event) {
        // Actualizar interacciones según tema
        this.updateInteractionsForTheme(event.detail.theme);
    }
    
    handleFontSizeChange(event) {
        // Ajustar interacciones según tamaño de fuente
        this.updateInteractionsForFontSize(event.detail.size);
    }
    
    handleSpacingChange(event) {
        // Ajustar interacciones según espaciado
        this.updateInteractionsForSpacing(event.detail.spacing);
    }
    
    handleElementVisible(element) {
        element.classList.add('visible');
        
        // Lazy loading de imágenes si es necesario
        if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
        }
    }
    
    handleElementHidden(element) {
        element.classList.remove('visible');
    }
    
    handleElementResize(element, rect) {
        // Optimizaciones responsive
        if (rect.width < this.breakpoints.tablet) {
            element.classList.add('mobile-layout');
        } else {
            element.classList.remove('mobile-layout');
        }
    }
    
    // Utilidades
    createClickFeedback(x, y) {
        const feedback = document.createElement('div');
        feedback.className = 'click-feedback';
        feedback.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            border: 2px solid rgba(59, 130, 246, 0.6);
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%) scale(0);
            transition: all 0.3s ease-out;
        `;
        
        document.body.appendChild(feedback);
        
        // Animación
        requestAnimationFrame(() => {
            feedback.style.transform = 'translate(-50%, -50%) scale(1)';
            feedback.style.opacity = '0';
        });
        
        // Limpiar
        setTimeout(() => {
            feedback.remove();
        }, 300);
    }
    
    focusSearchInput() {
        const searchInput = document.querySelector('input[type="search"], .search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    scrollIntoViewIfNeeded(element) {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                           rect.bottom <= window.innerHeight && 
                           rect.right <= window.innerWidth;
        
        if (!isInViewport) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    updateViewportInfo() {
        const width = window.innerWidth;
        let viewport = 'mobile';
        
        if (width >= this.breakpoints.wide) {
            viewport = 'wide';
        } else if (width >= this.breakpoints.desktop) {
            viewport = 'desktop';
        } else if (width >= this.breakpoints.tablet) {
            viewport = 'tablet';
        }
        
        this.currentViewport = viewport;
        document.body.setAttribute('data-viewport', viewport);
    }
    
    updateInteractionsForTheme(theme) {
        // Ajustar colores de interacciones según tema
        const isDark = theme === 'dark' || (theme === 'auto' && this.getSystemPreference() === 'dark');
        document.body.setAttribute('data-dark-theme', isDark);
    }
    
    updateInteractionsForFontSize(size) {
        // Ajustar tamaños de interacciones según fuente
        const scale = size / 16;
        document.body.style.setProperty('--interaction-scale', scale);
    }
    
    updateInteractionsForSpacing(spacing) {
        // Ajustar espaciado de interacciones
        const multipliers = { compact: 0.75, normal: 1, generous: 1.25 };
        document.body.style.setProperty('--interaction-spacing', multipliers[spacing] || 1);
    }
    
    isMobile() {
        return this.currentViewport === 'mobile' || this.config.touchOptimized;
    }
    
    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Utilidades de performance
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }
    
    // API pública
    setButtonLoading(buttonElement, isLoading) {
        const config = this.interactions.buttons.get(buttonElement);
        if (config) {
            config.isLoading = isLoading;
            buttonElement.classList.toggle('loading', isLoading);
            buttonElement.disabled = isLoading;
        }
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.innerHTML = `
            <span class="alert-icon">${this.getNotificationIcon(type)}</span>
            <div class="alert-content">
                <div class="alert-message">${message}</div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto-remover
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.atlasInteractionManager = new AtlasInteractionManager();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtlasInteractionManager;
}
