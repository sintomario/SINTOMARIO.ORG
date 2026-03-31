/**
 * Persuasion Engine - Motor de Persuasión Basado en Chase Hughes
 * Implementación de Micro-Compliance y PCP Model para SINTOMARIO
 */

class PersuasionEngine {
    constructor(options = {}) {
        this.options = {
            sistema: options.sistema || 'desconocido',
            sintoma: options.sintoma || 'general',
            zona: options.zona || 'cuerpo',
            complianceLevel: options.complianceLevel || 0,
            voiceProfile: options.voiceProfile || {
                tone: 'wise_guide',
                empthy_level: 'high',
                pragmatism_level: 'functional',
                authority_level: 'expert_companion'
            },
            ...options
        };
        
        this.userJourney = [];
        this.microCompliance = {
            level: this.options.complianceLevel,
            actions: [],
            timestamps: []
        };
        
        this.pcpModel = {
            permission: null,
            context: null,
            proposal: null
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializePCP();
        this.trackUserBehavior();
        this.injectProgressiveCTAs();
        this.adaptContentToUser();
    }
    
    setupEventListeners() {
        // Track micro-compliance actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('micro-cta') || 
                e.target.closest('.micro-cta')) {
                this.handleMicroCompliance(e.target);
            }
            
            if (e.target.classList.contains('cta-button') ||
                e.target.closest('.cta-button')) {
                this.handleMacroCTA(e.target);
            }
        });
        
        // Track scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScrollEngagement();
            }, 150);
        });
        
        // Track time on page
        this.startTimeOnPage = Date.now();
        window.addEventListener('beforeunload', () => {
            this.trackTimeOnPage();
        });
    }
    
    initializePCP() {
        // Inicializar fases del PCP Model
        this.pcpModel.permission = document.querySelector('.pcp-permission-phase');
        this.pcpModel.context = document.querySelector('.pcp-context-phase');
        this.pcpModel.proposal = document.querySelector('.pcp-proposal-phase');
        
        // Observar visibilidad para activar CTAs
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handlePhaseVisibility(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        // Observar cada fase del PCP
        Object.values(this.pcpModel).forEach(phase => {
            if (phase) observer.observe(phase);
        });
    }
    
    handlePhaseVisibility(phase) {
        const phaseType = phase.className.split('-')[1];
        
        // Activar CTAs específicos de la fase
        const ctas = phase.querySelectorAll('.micro-cta');
        ctas.forEach(cta => {
            cta.classList.add('visible');
            cta.style.opacity = '1';
            cta.style.transform = 'translateY(0)';
        });
        
        // Actualizar journey del usuario
        this.updateUserJourney('phase_view', {
            phase: phaseType,
            timestamp: Date.now(),
            scroll_depth: window.scrollY
        });
    }
    
    handleMicroCompliance(element) {
        const ctaElement = element.closest('.micro-cta');
        const complianceType = ctaElement.dataset.compliance;
        const action = ctaElement.querySelector('.suggestion-text a')?.textContent || 'unknown';
        
        // Incrementar nivel de compliance
        this.microCompliance.level++;
        this.microCompliance.actions.push({
            type: complianceType,
            action: action,
            timestamp: Date.now(),
            element: ctaElement.className
        });
        
        // Actualizar UI
        this.updateComplianceUI();
        
        // Actualizar journey
        this.updateUserJourney('micro_compliance', {
            level: this.microCompliance.level,
            type: complianceType,
            action: action
        });
        
        // Mostrar siguiente CTA progresivo
        this.showNextProgressiveCTA();
        
        console.log(`🧠 Micro-compliance: Level ${this.microCompliance.level} - ${action}`);
    }
    
    handleMacroCTA(element) {
        const ctaElement = element.closest('.cta-button');
        const action = ctaElement.textContent.trim();
        
        this.updateUserJourney('macro_cta', {
            action: action,
            compliance_level: this.microCompliance.level,
            timestamp: Date.now()
        });
        
        console.log(`🎯 Macro CTA: ${action} (Compliance Level: ${this.microCompliance.level})`);
    }
    
    trackScrollEngagement() {
        const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        this.updateUserJourney('scroll_engagement', {
            depth: Math.round(scrollDepth),
            timestamp: Date.now()
        });
        
        // Activar CTAs basados en scroll
        if (scrollDepth > 25 && this.microCompliance.level >= 1) {
            this.revealHiddenCTAs();
        }
    }
    
    trackTimeOnPage() {
        const timeOnPage = Date.now() - this.startTimeOnPage;
        
        this.updateUserJourney('time_on_page', {
            duration: timeOnPage,
            compliance_level: this.microCompliance.level
        });
    }
    
    updateUserJourney(action, data) {
        this.userJourney.push({
            action: action,
            data: data,
            timestamp: Date.now()
        });
        
        // Persistir en localStorage para análisis
        try {
            localStorage.setItem('sintomario_journey', JSON.stringify(this.userJourney));
        } catch (e) {
            console.warn('No se pudo guardar journey en localStorage:', e);
        }
    }
    
    updateComplianceUI() {
        // Actualizar indicadores visuales de compliance
        const complianceIndicator = document.querySelector('.compliance-indicator');
        if (complianceIndicator) {
            complianceIndicator.textContent = `Nivel: ${this.microCompliance.level}`;
            complianceIndicator.style.transform = `scale(${1 + (this.microCompliance.level * 0.1)})`;
        }
        
        // Actualizar clases en body para estilos condicionales
        document.body.className = document.body.className.replace(/compliance-level-\d+/g, '');
        document.body.classList.add(`compliance-level-${this.microCompliance.level}`);
    }
    
    showNextProgressiveCTA() {
        const thresholds = {
            1: 'exploratory',
            3: 'educational',
            5: 'therapeutic',
            10: 'transformational'
        };
        
        Object.entries(thresholds).forEach(([threshold, type]) => {
            if (this.microCompliance.level >= parseInt(threshold)) {
                const ctaContainer = document.querySelector(`.cta-${type}`);
                if (ctaContainer && !ctaContainer.classList.contains('revealed')) {
                    ctaContainer.classList.add('revealed');
                    ctaContainer.style.opacity = '1';
                    ctaContainer.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    revealHiddenCTAs() {
        const hiddenCTAs = document.querySelectorAll('.micro-cta.hidden');
        hiddenCTAs.forEach(cta => {
            setTimeout(() => {
                cta.classList.remove('hidden');
                cta.classList.add('revealing');
            }, Math.random() * 2000); // Random delay para naturalidad
        });
    }
    
    injectProgressiveCTAs() {
        // Inyectar CTAs contextuales basados en el contenido
        const contentSections = document.querySelectorAll('.therapeutic-content section');
        
        contentSections.forEach((section, index) => {
            if (index > 0 && Math.random() > 0.6) { // 40% de probabilidad
                const cta = this.createContextualCTA(section, index);
                section.appendChild(cta);
            }
        });
    }
    
    createContextualCTA(section, index) {
        const cta = document.createElement('div');
        cta.className = 'micro-cta contextual';
        cta.dataset.compliance = 'contextual';
        cta.innerHTML = `
            <small class="suggestion-text">
                Si esto resuena contigo, 
                <a href="#next-section" class="subtle-link">continúa explorando</a>
            </small>
        `;
        
        return cta;
    }
    
    adaptContentToUser() {
        // Personalizar contenido basado en el perfil de usuario
        const userPreferences = this.analyzeUserPreferences();
        this.highlightRelevantContent(userPreferences);
        this.adjustVoiceTone(userPreferences);
    }
    
    analyzeUserPreferences() {
        const journey = this.userJourney;
        const preferences = {
            engagement_level: 'low',
            content_preference: 'educational',
            interaction_style: 'passive'
        };
        
        // Analizar patrones de comportamiento
        const scrollActions = journey.filter(j => j.action === 'scroll_engagement');
        const microCompliance = journey.filter(j => j.action === 'micro_compliance');
        
        if (scrollActions.length > 5) preferences.engagement_level = 'high';
        if (microCompliance.length > 3) preferences.interaction_style = 'active';
        
        // Determinar preferencia de contenido
        const phases = journey.map(j => j.data?.phase).filter(Boolean);
        if (phases.includes('proposal')) preferences.content_preference = 'practical';
        if (phases.includes('context')) preferences.content_preference = 'educational';
        
        return preferences;
    }
    
    highlightRelevantContent(preferences) {
        if (preferences.content_preference === 'practical') {
            // Resaltar secciones prácticas
            document.querySelectorAll('.proposal-content').forEach(el => {
                el.classList.add('highlighted');
            });
        }
        
        if (preferences.interaction_style === 'active') {
            // Mostrar más CTAs
            document.querySelectorAll('.micro-cta.hidden').forEach(el => {
                el.classList.remove('hidden');
            });
        }
    }
    
    adjustVoiceTone(preferences) {
        const voiceElements = document.querySelectorAll('.guide-voice');
        
        voiceElements.forEach(el => {
            if (preferences.engagement_level === 'high') {
                el.textContent = el.textContent.replace('Entiendo', 'Comprendo profundamente');
            }
        });
    }
    
    // Métodos públicos para análisis
    getComplianceLevel() {
        return this.microCompliance.level;
    }
    
    getUserJourney() {
        return this.userJourney;
    }
    
    getEngagementMetrics() {
        const journey = this.userJourney;
        return {
            total_actions: journey.length,
            micro_compliance: journey.filter(j => j.action === 'micro_compliance').length,
            macro_ctas: journey.filter(j => j.action === 'macro_cta').length,
            scroll_events: journey.filter(j => j.action === 'scroll_engagement').length,
            compliance_level: this.microCompliance.level,
            engagement_duration: Date.now() - this.startTimeOnPage
        };
    }
    
    // Exportar datos para análisis
    exportAnalytics() {
        return {
            session_id: this.generateSessionId(),
            user_journey: this.userJourney,
            compliance_metrics: this.microCompliance,
            engagement_metrics: this.getEngagementMetrics(),
            content_context: {
                sistema: this.options.sistema,
                sintoma: this.options.sintoma,
                zona: this.options.zona
            },
            timestamp: new Date().toISOString()
        };
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Inicialización automática si existe en el DOM
if (typeof window !== 'undefined') {
    window.PersuasionEngine = PersuasionEngine;
    
    // Auto-inicialización para nodos con data-persuasion
    document.addEventListener('DOMContentLoaded', function() {
        const persuasionNodes = document.querySelectorAll('[data-persuasion="true"]');
        persuasionNodes.forEach(node => {
            // Configuración por defecto para auto-inicialización
            const config = {
                sistema: node.dataset.sistema || 'general',
                sintoma: node.dataset.sintoma || 'desconocido',
                zona: node.dataset.zona || 'cuerpo',
                complianceLevel: parseInt(node.dataset.complianceLevel) || 0
            };
            
            new PersuasionEngine(config);
        });
    });
}

export default PersuasionEngine;
