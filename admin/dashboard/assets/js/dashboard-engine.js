/**
 * Dashboard Engine - Motor principal para el sistema de gestión visual
 * Coordina todos los componentes del dashboard y editor de nodos
 */

class DashboardEngine {
    constructor() {
        this.version = '3.2';
        this.modules = new Map();
        this.metrics = new Map();
        this.config = new Map();
        this.eventListeners = new Map();
        this.websocket = null;
        this.updateInterval = null;
        
        this.init();
    }
    
    async init() {
        console.log(`Dashboard Engine v${this.version} initializing...`);
        
        // Load configuration
        await this.loadConfiguration();
        
        // Initialize modules
        this.initModules();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start metrics collection
        this.startMetricsCollection();
        
        // Initialize WebSocket connection
        this.initWebSocket();
        
        // Setup auto-save
        this.setupAutoSave();
        
        console.log('Dashboard Engine initialized successfully');
    }
    
    async loadConfiguration() {
        try {
            // Load from localStorage
            const localConfig = localStorage.getItem('sintomario-dashboard-config');
            if (localConfig) {
                const config = JSON.parse(localConfig);
                this.config = new Map(Object.entries(config));
            }
            
            // Load from API
            const response = await fetch('/api/dashboard/config');
            if (response.ok) {
                const apiConfig = await response.json();
                Object.entries(apiConfig).forEach(([key, value]) => {
                    if (!this.config.has(key)) {
                        this.config.set(key, value);
                    }
                });
            }
            
            console.log('Configuration loaded:', this.config);
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }
    
    initModules() {
        // Initialize Variable Manager
        this.modules.set('variableManager', new VariableManager(this));
        
        // Initialize Metrics Collector
        this.modules.set('metricsCollector', new MetricsCollector(this));
        
        // Initialize Module Manager
        this.modules.set('moduleManager', new ModuleManager(this));
        
        // Initialize Notification System
        this.modules.set('notificationSystem', new NotificationSystem(this));
        
        // Initialize Config Manager
        this.modules.set('configManager', new ConfigManager(this));
        
        console.log('Modules initialized:', Array.from(this.modules.keys()));
    }
    
    setupEventListeners() {
        // Global error handling
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
        
        // Variable change events
        document.addEventListener('variableChange', (e) => {
            this.handleVariableChange(e.detail.name, e.detail.value);
        });
        
        // Module status events
        document.addEventListener('moduleStatusChange', (e) => {
            this.handleModuleStatusChange(e.detail.module, e.detail.status);
        });
        
        // Configuration change events
        document.addEventListener('configChange', (e) => {
            this.handleConfigChange(e.detail.section, e.detail.data);
        });
        
        console.log('Event listeners setup complete');
    }
    
    startMetricsCollection() {
        // Collect metrics every 5 seconds
        this.updateInterval = setInterval(() => {
            this.collectMetrics();
        }, 5000);
        
        // Initial collection
        this.collectMetrics();
    }
    
    async collectMetrics() {
        try {
            const metrics = {
                timestamp: Date.now(),
                pcpEngine: await this.collectPCPMetrics(),
                templates: await this.collectTemplateMetrics(),
                i18n: await this.collectI18nMetrics(),
                system: await this.collectSystemMetrics(),
                user: await this.collectUserMetrics()
            };
            
            this.metrics.set('current', metrics);
            
            // Update UI
            this.updateMetricsDisplay(metrics);
            
            // Store historical data
            this.storeHistoricalMetrics(metrics);
            
        } catch (error) {
            console.error('Error collecting metrics:', error);
        }
    }
    
    async collectPCPMetrics() {
        const moduleManager = this.modules.get('moduleManager');
        const pcpModule = moduleManager.getModule('persuasion-engine');
        
        return {
            status: pcpModule?.status || 'unknown',
            version: pcpModule?.version || '2.1',
            uptime: pcpModule?.uptime || 0,
            conversions: pcpModule?.conversions || 0,
            complianceLevel: pcpModule?.complianceLevel || 0,
            trustLevel: pcpModule?.trustLevel || 0
        };
    }
    
    async collectTemplateMetrics() {
        const response = await fetch('/api/templates/metrics');
        const data = await response.json();
        
        return {
            status: 'active',
            totalNodes: data.totalNodes || 2500,
            renderedNodes: data.renderedNodes || 2487,
            errors: data.errors || 0,
            averageRenderTime: data.averageRenderTime || 0,
            cacheHitRate: data.cacheHitRate || 0
        };
    }
    
    async collectI18nMetrics() {
        const response = await fetch('/api/i18n/metrics');
        const data = await response.json();
        
        return {
            status: 'active',
            languages: data.languages || 5,
            translations: data.translations || 1250,
            lastSync: data.lastSync || null,
            cacheHitRate: data.cacheHitRate || 0
        };
    }
    
    async collectSystemMetrics() {
        return {
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null,
            timing: performance.timing ? {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            } : null,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null
        };
    }
    
    async collectUserMetrics() {
        // Simulated user metrics - in real implementation, this would come from analytics
        return {
            activeUsers: Math.floor(Math.random() * 100) + 1200,
            sessionDuration: Math.floor(Math.random() * 300) + 180,
            bounceRate: Math.random() * 0.3 + 0.1,
            conversionRate: Math.random() * 0.05 + 0.02
        };
    }
    
    updateMetricsDisplay(metrics) {
        // Update PCP Engine metrics
        this.updateMetricCard('pcp-conversions', metrics.pcpEngine.conversions);
        this.updateMetricCard('pcp-trust', metrics.pcpEngine.trustLevel);
        this.updateMetricCard('pcp-guilt', 100 - metrics.pcpEngine.complianceLevel);
        
        // Update Template metrics
        this.updateMetricCard('template-nodes', metrics.templates.renderedNodes);
        this.updateMetricCard('template-errors', metrics.templates.errors);
        
        // Update I18n metrics
        this.updateMetricCard('i18n-languages', metrics.i18n.languages);
        
        // Update User metrics
        this.updateMetricCard('user-active', metrics.user.activeUsers);
        this.updateMetricCard('user-conversion', (metrics.user.conversionRate * 100).toFixed(1));
        
        // Update flow diagram
        this.updateFlowDiagram(metrics);
        
        // Update module status indicators
        this.updateModuleStatus(metrics);
    }
    
    updateMetricCard(id, value) {
        const element = document.querySelector(`[data-metric="${id}"]`);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateFlowDiagram(metrics) {
        const flowPhases = document.querySelectorAll('.flow-phase');
        const userMetrics = metrics.user;
        
        // Simulate user flow through PCP phases
        const perceptionUsers = userMetrics.activeUsers;
        const contextUsers = Math.floor(perceptionUsers * 0.71); // 71% advance to context
        const permissionUsers = Math.floor(contextUsers * 0.47); // 47% advance to permission
        
        const phaseData = [
            { phase: 'perception', users: perceptionUsers },
            { phase: 'context', users: contextUsers },
            { phase: 'permission', users: permissionUsers }
        ];
        
        flowPhases.forEach((phaseElement, index) => {
            const phaseName = phaseElement.dataset.phase;
            const phaseDataItem = phaseData.find(p => p.phase === phaseName);
            
            if (phaseDataItem) {
                const metricsElement = phaseElement.querySelector('.phase-metrics');
                if (metricsElement) {
                    metricsElement.textContent = `${phaseDataItem.users} usuarios`;
                }
            }
        });
    }
    
    updateModuleStatus(metrics) {
        const moduleStatuses = {
            'persuasion-engine': metrics.pcpEngine.status,
            'templates': metrics.templates.status,
            'i18n': metrics.i18n.status
        };
        
        Object.entries(moduleStatuses).forEach(([moduleId, status]) => {
            const moduleElement = document.querySelector(`[data-module="${moduleId}"]`);
            if (moduleElement) {
                const statusDot = moduleElement.querySelector('.module-status');
                if (statusDot) {
                    statusDot.className = `module-status ${status}`;
                }
            }
        });
    }
    
    storeHistoricalMetrics(metrics) {
        const historical = this.metrics.get('historical') || [];
        historical.push(metrics);
        
        // Keep only last 100 entries
        if (historical.length > 100) {
            historical.shift();
        }
        
        this.metrics.set('historical', historical);
    }
    
    initWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/dashboard`;
            
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.sendHeartbeat();
            };
            
            this.websocket.onmessage = (event) => {
                this.handleWebSocketMessage(JSON.parse(event.data));
            };
            
            this.websocket.onclose = () => {
                console.log('WebSocket disconnected');
                // Attempt to reconnect after 5 seconds
                setTimeout(() => this.initWebSocket(), 5000);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }
    
    sendHeartbeat() {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                type: 'heartbeat',
                timestamp: Date.now()
            }));
        }
        
        // Send heartbeat every 30 seconds
        setTimeout(() => this.sendHeartbeat(), 30000);
    }
    
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'metrics_update':
                this.handleMetricsUpdate(message.data);
                break;
            case 'module_status':
                this.handleModuleStatusUpdate(message.data);
                break;
            case 'config_update':
                this.handleConfigUpdate(message.data);
                break;
            case 'notification':
                this.handleNotification(message.data);
                break;
            default:
                console.log('Unknown WebSocket message type:', message.type);
        }
    }
    
    handleMetricsUpdate(data) {
        this.metrics.set('current', data);
        this.updateMetricsDisplay(data);
    }
    
    handleModuleStatusUpdate(data) {
        const moduleManager = this.modules.get('moduleManager');
        if (moduleManager) {
            moduleManager.updateModuleStatus(data.moduleId, data.status);
        }
    }
    
    handleConfigUpdate(data) {
        this.config.set(data.section, data.data);
        this.saveConfiguration();
    }
    
    handleNotification(data) {
        const notificationSystem = this.modules.get('notificationSystem');
        if (notificationSystem) {
            notificationSystem.show(data.message, data.type);
        }
    }
    
    handleVariableChange(name, value) {
        const variableManager = this.modules.get('variableManager');
        if (variableManager) {
            variableManager.updateVariable(name, value);
        }
        
        // Broadcast change via WebSocket
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                type: 'variable_change',
                data: { name, value }
            }));
        }
    }
    
    handleModuleStatusChange(moduleId, status) {
        const moduleManager = this.modules.get('moduleManager');
        if (moduleManager) {
            moduleManager.updateModuleStatus(moduleId, status);
        }
    }
    
    handleConfigChange(section, data) {
        this.config.set(section, data);
        this.saveConfiguration();
        
        // Broadcast change via WebSocket
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                type: 'config_change',
                data: { section, data }
            }));
        }
    }
    
    handleError(error) {
        console.error('Dashboard Engine Error:', error);
        
        const notificationSystem = this.modules.get('notificationSystem');
        if (notificationSystem) {
            notificationSystem.show(`Error: ${error.message}`, 'error');
        }
    }
    
    setupAutoSave() {
        // Auto-save configuration every 30 seconds
        setInterval(() => {
            this.saveConfiguration();
        }, 30000);
    }
    
    saveConfiguration() {
        try {
            const config = Object.fromEntries(this.config);
            localStorage.setItem('sintomario-dashboard-config', JSON.stringify(config));
            
            // Send to API
            fetch('/api/dashboard/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Configuration saved:', data);
            })
            .catch(error => {
                console.error('Error saving configuration:', error);
            });
            
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }
    
    getModule(moduleName) {
        return this.modules.get(moduleName);
    }
    
    getMetrics() {
        return this.metrics.get('current');
    }
    
    getHistoricalMetrics() {
        return this.metrics.get('historical') || [];
    }
    
    getConfig(section) {
        return section ? this.config.get(section) : Object.fromEntries(this.config);
    }
    
    setConfig(section, data) {
        this.config.set(section, data);
        this.handleConfigChange(section, data);
    }
    
    destroy() {
        // Clear intervals
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Close WebSocket
        if (this.websocket) {
            this.websocket.close();
        }
        
        // Destroy modules
        this.modules.forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        
        console.log('Dashboard Engine destroyed');
    }
}

/**
 * Variable Manager - Gestiona variables CSS dinámicas
 */
class VariableManager {
    constructor(engine) {
        this.engine = engine;
        this.variables = new Map();
        this.observers = [];
    }
    
    updateVariable(name, value) {
        this.variables.set(name, value);
        
        // Update CSS variable
        document.documentElement.style.setProperty(`--${name}`, value);
        
        // Notify observers
        this.notifyObservers(name, value);
        
        console.log(`Variable updated: ${name} = ${value}`);
    }
    
    addObserver(callback) {
        this.observers.push(callback);
    }
    
    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers(name, value) {
        this.observers.forEach(callback => {
            callback(name, value);
        });
    }
}

/**
 * Metrics Collector - Recolecta y procesa métricas del sistema
 */
class MetricsCollector {
    constructor(engine) {
        this.engine = engine;
        this.metricsBuffer = [];
        this.batchSize = 10;
    }
    
    collectMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now()
        };
        
        this.metricsBuffer.push(metric);
        
        if (this.metricsBuffer.length >= this.batchSize) {
            this.flushMetrics();
        }
    }
    
    flushMetrics() {
        if (this.metricsBuffer.length === 0) return;
        
        fetch('/api/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.metricsBuffer)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Metrics flushed:', data);
        })
        .catch(error => {
            console.error('Error flushing metrics:', error);
        });
        
        this.metricsBuffer = [];
    }
}

/**
 * Module Manager - Gestiona el estado de los módulos del sistema
 */
class ModuleManager {
    constructor(engine) {
        this.engine = engine;
        this.modules = new Map();
        this.loadModules();
    }
    
    async loadModules() {
        try {
            const response = await fetch('/api/modules');
            const modules = await response.json();
            
            modules.forEach(module => {
                this.modules.set(module.id, module);
            });
            
            console.log('Modules loaded:', this.modules);
        } catch (error) {
            console.error('Error loading modules:', error);
        }
    }
    
    getModule(moduleId) {
        return this.modules.get(moduleId);
    }
    
    updateModuleStatus(moduleId, status) {
        const module = this.modules.get(moduleId);
        if (module) {
            module.status = status;
            module.lastUpdated = Date.now();
            
            // Broadcast update
            document.dispatchEvent(new CustomEvent('moduleStatusChange', {
                detail: { module: moduleId, status }
            }));
        }
    }
}

/**
 * Notification System - Sistema de notificaciones del dashboard
 */
class NotificationSystem {
    constructor(engine) {
        this.engine = engine;
        this.notifications = [];
        this.maxNotifications = 5;
    }
    
    show(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration,
            timestamp: Date.now()
        };
        
        this.notifications.push(notification);
        
        // Limit number of notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }
        
        this.renderNotification(notification);
        
        // Auto-remove
        setTimeout(() => {
            this.remove(notification.id);
        }, duration);
    }
    
    renderNotification(notification) {
        const element = document.createElement('div');
        element.className = `notification ${notification.type}`;
        element.dataset.notificationId = notification.id;
        element.textContent = notification.message;
        
        document.body.appendChild(element);
        
        // Animate in
        setTimeout(() => {
            element.classList.add('show');
        }, 10);
    }
    
    remove(notificationId) {
        const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
        if (element) {
            element.classList.add('hide');
            setTimeout(() => {
                element.remove();
            }, 300);
        }
        
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }
}

/**
 * Config Manager - Gestiona la configuración del sistema
 */
class ConfigManager {
    constructor(engine) {
        this.engine = engine;
        this.config = new Map();
        this.loadConfig();
    }
    
    async loadConfig() {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            
            Object.entries(config).forEach(([key, value]) => {
                this.config.set(key, value);
            });
            
            console.log('Config loaded:', this.config);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    }
    
    get(section) {
        return this.config.get(section);
    }
    
    set(section, value) {
        this.config.set(section, value);
        
        // Broadcast change
        document.dispatchEvent(new CustomEvent('configChange', {
            detail: { section, data: value }
        }));
    }
    
    async save() {
        try {
            const config = Object.fromEntries(this.config);
            
            const response = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });
            
            const result = await response.json();
            console.log('Config saved:', result);
            
            return result;
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    }
}

// Initialize Dashboard Engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardEngine = new DashboardEngine();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboardEngine) {
        window.dashboardEngine.destroy();
    }
});
