/**
 * Atlas Somático Editorial - Progress Therapeutic System
 * Sistema de progreso terapéutico con gamificación consciente
 */

class AtlasProgressTherapeutic {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.userProgress = null;
    this.achievements = new Map();
    this.streaks = new Map();
    this.sessions = new Map();
    this.currentSession = null;
    this.notifications = [];
    
    // Configuración del sistema
    this.config = {
      maxLevel: 50,
      pointsPerZone: 10,
      pointsPerTreatment: 5,
      pointsPerSession: 2,
      streakMultiplier: 1.5,
      sessionThreshold: 5, // minutos
      dailyGoal: 3, // zonas exploradas
      weeklyGoal: 15, // zonas exploradas
      notificationDuration: 5000,
      autoSaveInterval: 30000 // 30 segundos
    };
    
    // Niveles de progreso terapéutico
    this.levels = [
      { level: 1, name: 'Explorador Inicial', points: 0, description: 'Comenzando tu viaje somático' },
      { level: 2, name: 'Consciente Corporal', points: 50, description: 'Desarrollando awareness corporal' },
      { level: 3, name: 'Conector Mente-Cuerpo', points: 150, description: 'Estableciendo conexiones profundas' },
      { level: 4, name: 'Navegante Emocional', points: 300, description: 'Navegando el paisaje emocional' },
      { level: 5, name: 'Sanador Interno', points: 500, description: 'Activando tu capacidad de sanación' },
      { level: 6, name: 'Maestro Somático', points: 1000, description: 'Dominando el lenguaje corporal' },
      { level: 7, name: 'Guía Terapéutico', points: 2000, description: 'Guiando a otros en su viaje' },
      { level: 8, name: 'Sabio Corporal', points: 4000, description: 'Sabiduría corporal integrada' },
      { level: 9, name: 'Transformador Cuántico', points: 8000, description: 'Transformación a nivel cuántico' },
      { level: 10, name: 'Atlas Iluminado', points: 16000, description: 'Iluminación somática completa' }
    ];
    
    // Logros terapéuticos
    this.achievementDefinitions = new Map([
      ['first_zone', { 
        id: 'first_zone', 
        name: 'Primer Contacto', 
        description: 'Explorar tu primera zona corporal',
        icon: '🌱',
        points: 10,
        type: 'milestone'
      }],
      ['five_zones', { 
        id: 'five_zones', 
        name: 'Explorador Activo', 
        description: 'Explorar 5 zonas diferentes',
        icon: '🌿',
        points: 25,
        type: 'milestone'
      }],
      ['all_zones', { 
        id: 'all_zones', 
        name: 'Cartógrafo Maestro', 
        description: 'Explorar todas las 50 zonas',
        icon: '🗺️',
        points: 100,
        type: 'legendary'
      }],
      ['first_treatment', { 
        id: 'first_treatment', 
        name: 'Sanador Principiante', 
        description: 'Completar tu primer tratamiento',
        icon: '🌸',
        points: 15,
        type: 'milestone'
      }],
      ['ten_treatments', { 
        id: 'ten_treatments', 
        name: 'Practicante Dedicado', 
        description: 'Completar 10 tratamientos',
        icon: '🌺',
        points: 50,
        type: 'milestone'
      }],
      ['daily_streak_3', { 
        id: 'daily_streak_3', 
        name: 'Consistencia Inicial', 
        description: 'Racha diaria de 3 días',
        icon: '🔥',
        points: 20,
        type: 'streak'
      }],
      ['daily_streak_7', { 
        id: 'daily_streak_7', 
        name: 'Compromiso Semanal', 
        description: 'Racha diaria de 7 días',
        icon: '💫',
        points: 50,
        type: 'streak'
      }],
      ['daily_streak_30', { 
        id: 'daily_streak_30', 
        name: 'Maestro de la Disciplina', 
        description: 'Racha diaria de 30 días',
        icon: '🌟',
        points: 200,
        type: 'legendary'
      }],
      ['week_goal', { 
        id: 'week_goal', 
        name: 'Semana Productiva', 
        description: 'Alcanzar la meta semanal',
        icon: '📅',
        points: 30,
        type: 'goal'
      }],
      ['perfect_week', { 
        id: 'perfect_week', 
        name: 'Semana Perfecta', 
        description: 'Explorar zonas todos los días de la semana',
        icon: '✨',
        points: 100,
        type: 'legendary'
      }],
      ['mindful_master', { 
        id: 'mindful_master', 
        name: 'Maestro Mindfulness', 
        description: 'Completar 30 minutos de práctica consciente',
        icon: '🧘',
        points: 75,
        type: 'mastery'
      }],
      ['emotional_navigator', { 
        id: 'emotional_navigator', 
        name: 'Navegante Emocional', 
        description: 'Explorar todas las zonas emocionales',
        icon: '💭',
        points: 60,
        type: 'mastery'
      }],
      ['pain_specialist', { 
        id: 'pain_specialist', 
        name: 'Especialista en Dolor', 
        description: 'Completar 10 tratamientos de manejo del dolor',
        icon: '🌈',
        points: 40,
        type: 'specialty'
      }]
    ]);
    
    this.init();
  }
  
  async init() {
    try {
      // Inicializar usuario actual
      await this.initializeUser();
      
      // Cargar progreso del usuario
      await this.loadUserProgress();
      
      // Configurar tracking de eventos
      this.setupEventTracking();
      
      // Inicializar sesión actual
      this.initializeCurrentSession();
      
      // Configurar auto-guardado
      this.setupAutoSave();
      
      // Configurar UI de progreso
      this.setupProgressUI();
      
      // Verificar rachas y logros
      this.checkStreaks();
      this.checkAchievements();
      
      this.isInitialized = true;
      console.log('🏆 Atlas Progress Therapeutic - Inicializado');
      
    } catch (error) {
      console.error('Error al inicializar Progress Therapeutic:', error);
    }
  }
  
  async initializeUser() {
    // Generar ID de usuario único si no existe
    let userId = localStorage.getItem('atlas-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('atlas-user-id', userId);
    }
    
    this.currentUser = {
      id: userId,
      createdAt: localStorage.getItem('atlas-user-created') || new Date().toISOString(),
      lastActive: localStorage.getItem('atlas-user-last-active') || new Date().toISOString()
    };
    
    // Actualizar última actividad
    localStorage.setItem('atlas-user-last-active', new Date().toISOString());
  }
  
  async loadUserProgress() {
    try {
      const saved = localStorage.getItem('atlas-user-progress');
      if (saved) {
        this.userProgress = JSON.parse(saved);
      } else {
        // Crear progreso inicial
        this.userProgress = {
          userId: this.currentUser.id,
          level: 1,
          totalPoints: 0,
          exploredZones: new Set(),
          completedTreatments: new Set(),
          sessions: [],
          achievements: new Set(),
          streaks: {
            daily: 0,
            weekly: 0,
            longestDaily: 0,
            longestWeekly: 0
          },
          statistics: {
            totalSessions: 0,
            totalTimeMinutes: 0,
            averageSessionTime: 0,
            favoriteZones: new Map(),
            favoriteTreatments: new Map(),
            explorationRate: 0,
            completionRate: 0
          },
          preferences: {
            notificationsEnabled: true,
            soundEnabled: false,
            vibrationEnabled: false,
            privacyMode: false
          },
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Convertir Sets de vuelta a objetos Set
      if (this.userProgress.exploredZones && Array.isArray(this.userProgress.exploredZones)) {
        this.userProgress.exploredZones = new Set(this.userProgress.exploredZones);
      }
      if (this.userProgress.completedTreatments && Array.isArray(this.userProgress.completedTreatments)) {
        this.userProgress.completedTreatments = new Set(this.userProgress.completedTreatments);
      }
      if (this.userProgress.achievements && Array.isArray(this.userProgress.achievements)) {
        this.userProgress.achievements = new Set(this.userProgress.achievements);
      }
      if (this.userProgress.statistics.favoriteZones && Array.isArray(this.userProgress.statistics.favoriteZones)) {
        this.userProgress.statistics.favoriteZones = new Map(this.userProgress.statistics.favoriteZones);
      }
      if (this.userProgress.statistics.favoriteTreatments && Array.isArray(this.userProgress.statistics.favoriteTreatments)) {
        this.userProgress.statistics.favoriteTreatments = new Map(this.userProgress.statistics.favoriteTreatments);
      }
      
    } catch (error) {
      console.error('Error al cargar progreso del usuario:', error);
      throw error;
    }
  }
  
  setupEventTracking() {
    // Escuchar eventos de otros componentes
    document.addEventListener('atlasBodyMaps:zoneSelected', (e) => {
      this.trackZoneExploration(e.detail.zone.id);
    });
    
    document.addEventListener('atlasBodyMaps:treatmentCompleted', (e) => {
      this.trackTreatmentCompletion(e.detail.treatmentId);
    });
    
    document.addEventListener('atlasSearch:resultSelected', (e) => {
      this.trackSearchInteraction(e.detail.type);
    });
    
    // Escuchar eventos de scrollytelling
    document.addEventListener('atlasScrollytelling:journeyCompleted', () => {
      this.trackJourneyCompletion();
    });
    
    // Escuchar eventos de sesión
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseCurrentSession();
      } else {
        this.resumeCurrentSession();
      }
    });
    
    // Escuchar cierre de página
    window.addEventListener('beforeunload', () => {
      this.endCurrentSession();
    });
  }
  
  initializeCurrentSession() {
    this.currentSession = {
      id: 'session_' + Date.now(),
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      activities: [],
      zonesExplored: new Set(),
      treatmentsCompleted: new Set(),
      searchesPerformed: 0,
      scrollDepth: 0,
      interactions: 0,
      quality: 'active' // active, paused, completed
    };
    
    // Iniciar tracking de tiempo
    this.sessionTimer = setInterval(() => {
      this.updateSessionDuration();
    }, 1000); // Actualizar cada segundo
  }
  
  updateSessionDuration() {
    if (this.currentSession && this.currentSession.quality === 'active') {
      this.currentSession.duration = Math.floor((Date.now() - this.currentSession.startTime) / 1000);
      
      // Verificar umbral de sesión
      if (this.currentSession.duration >= this.config.sessionThreshold * 60) {
        this.trackSessionThreshold();
      }
    }
  }
  
  trackZoneExploration(zoneId) {
    if (!this.userProgress || !this.currentSession) return;
    
    // Agregar a progreso si es nueva
    if (!this.userProgress.exploredZones.has(zoneId)) {
      this.userProgress.exploredZones.add(zoneId);
      this.addPoints(this.config.pointsPerZone, 'zone_exploration', { zoneId });
      
      // Actualizar estadísticas
      const currentCount = this.userProgress.statistics.favoriteZones.get(zoneId) || 0;
      this.userProgress.statistics.favoriteZones.set(zoneId, currentCount + 1);
      
      // Verificar logros
      this.checkZoneAchievements(zoneId);
    }
    
    // Agregar a sesión actual
    this.currentSession.zonesExplored.add(zoneId);
    this.currentSession.activities.push({
      type: 'zone_exploration',
      timestamp: Date.now(),
      data: { zoneId }
    });
    
    this.updateExplorationRate();
    this.saveProgress();
  }
  
  trackTreatmentCompletion(treatmentId) {
    if (!this.userProgress || !this.currentSession) return;
    
    // Agregar a progreso si es nuevo
    if (!this.userProgress.completedTreatments.has(treatmentId)) {
      this.userProgress.completedTreatments.add(treatmentId);
      this.addPoints(this.config.pointsPerTreatment, 'treatment_completion', { treatmentId });
      
      // Actualizar estadísticas
      const currentCount = this.userProgress.statistics.favoriteTreatments.get(treatmentId) || 0;
      this.userProgress.statistics.favoriteTreatments.set(treatmentId, currentCount + 1);
      
      // Verificar logros
      this.checkTreatmentAchievements(treatmentId);
    }
    
    // Agregar a sesión actual
    this.currentSession.treatmentsCompleted.add(treatmentId);
    this.currentSession.activities.push({
      type: 'treatment_completion',
      timestamp: Date.now(),
      data: { treatmentId }
    });
    
    this.updateCompletionRate();
    this.saveProgress();
  }
  
  trackSearchInteraction(searchType) {
    if (!this.currentSession) return;
    
    this.currentSession.searchesPerformed++;
    this.currentSession.activities.push({
      type: 'search_interaction',
      timestamp: Date.now(),
      data: { searchType }
    });
    
    this.saveProgress();
  }
  
  trackJourneyCompletion() {
    if (!this.userProgress || !this.currentSession) return;
    
    this.currentSession.activities.push({
      type: 'journey_completion',
      timestamp: Date.now(),
      data: {}
    });
    
    this.addPoints(20, 'journey_completion', {});
    this.saveProgress();
  }
  
  trackSessionThreshold() {
    if (!this.userProgress) return;
    
    this.addPoints(this.config.pointsPerSession, 'session_threshold', {
      duration: this.currentSession.duration
    });
    
    this.showNotification('¡Sesion productiva!', `Has completado ${this.config.sessionThreshold} minutos de exploración`, 'success');
  }
  
  addPoints(points, source, metadata = {}) {
    if (!this.userProgress) return;
    
    // Aplicar multiplicador de racha
    const multiplier = this.getStreakMultiplier();
    const finalPoints = Math.floor(points * multiplier);
    
    this.userProgress.totalPoints += finalPoints;
    
    // Verificar si subió de nivel
    const previousLevel = this.userProgress.level;
    this.updateLevel();
    
    if (this.userProgress.level > previousLevel) {
      this.showLevelUpNotification(this.userProgress.level);
    }
    
    // Actualizar UI
    this.updateProgressUI();
    
    // Disparar evento
    this.dispatchEvent('pointsAdded', {
      points: finalPoints,
      source,
      multiplier,
      metadata,
      newTotal: this.userProgress.totalPoints,
      newLevel: this.userProgress.level
    });
  }
  
  getStreakMultiplier() {
    if (!this.userProgress) return 1;
    
    const dailyStreak = this.userProgress.streaks.daily;
    if (dailyStreak >= 30) return 2.0;
    if (dailyStreak >= 14) return 1.75;
    if (dailyStreak >= 7) return 1.5;
    if (dailyStreak >= 3) return 1.25;
    
    return 1;
  }
  
  updateLevel() {
    if (!this.userProgress) return;
    
    const currentPoints = this.userProgress.totalPoints;
    let newLevel = 1;
    
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (currentPoints >= this.levels[i].points) {
        newLevel = this.levels[i].level;
        break;
      }
    }
    
    this.userProgress.level = newLevel;
  }
  
  checkZoneAchievements(zoneId) {
    const exploredCount = this.userProgress.exploredZones.size;
    
    // Primer zona
    if (exploredCount === 1) {
      this.unlockAchievement('first_zone');
    }
    
    // 5 zonas
    if (exploredCount === 5) {
      this.unlockAchievement('five_zones');
    }
    
    // Todas las zonas
    if (exploredCount === 50) {
      this.unlockAchievement('all_zones');
    }
  }
  
  checkTreatmentAchievements(treatmentId) {
    const completedCount = this.userProgress.completedTreatments.size;
    
    // Primer tratamiento
    if (completedCount === 1) {
      this.unlockAchievement('first_treatment');
    }
    
    // 10 tratamientos
    if (completedCount === 10) {
      this.unlockAchievement('ten_treatments');
    }
  }
  
  checkStreaks() {
    if (!this.userProgress) return;
    
    const today = new Date().toDateString();
    const lastActive = new Date(this.currentUser.lastActive).toDateString();
    
    // Verificar si es un nuevo día
    if (today !== lastActive) {
      // Verificar si es consecutivo
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastActive === yesterday) {
        // Día consecutivo
        this.userProgress.streaks.daily++;
        this.userProgress.streaks.longestDaily = Math.max(
          this.userProgress.streaks.longestDaily,
          this.userProgress.streaks.daily
        );
      } else {
        // Reiniciar racha
        this.userProgress.streaks.daily = 1;
      }
      
      // Verificar logros de racha
      if (this.userProgress.streaks.daily === 3) {
        this.unlockAchievement('daily_streak_3');
      }
      if (this.userProgress.streaks.daily === 7) {
        this.unlockAchievement('daily_streak_7');
      }
      if (this.userProgress.streaks.daily === 30) {
        this.unlockAchievement('daily_streak_30');
      }
    }
  }
  
  checkAchievements() {
    if (!this.userProgress) return;
    
    // Meta semanal
    const weeklyExplored = this.getWeeklyExploredZones();
    if (weeklyExplored >= this.config.weeklyGoal) {
      this.unlockAchievement('week_goal');
    }
    
    // Semana perfecta
    const dailyActivity = this.getDailyActivityThisWeek();
    if (dailyActivity.every(day => day)) {
      this.unlockAchievement('perfect_week');
    }
  }
  
  unlockAchievement(achievementId) {
    if (!this.userProgress || this.userProgress.achievements.has(achievementId)) return;
    
    const achievement = this.achievementDefinitions.get(achievementId);
    if (!achievement) return;
    
    this.userProgress.achievements.add(achievementId);
    this.achievements.set(achievementId, {
      ...achievement,
      unlockedAt: Date.now()
    });
    
    // Agregar puntos del logro
    this.addPoints(achievement.points, 'achievement', { achievementId });
    
    // Mostrar notificación
    this.showAchievementNotification(achievement);
    
    // Disparar evento
    this.dispatchEvent('achievementUnlocked', { achievement });
    
    this.saveProgress();
  }
  
  getWeeklyExploredZones() {
    // Implementar lógica para obtener zonas exploradas esta semana
    return this.userProgress.exploredZones.size; // Simplificado
  }
  
  getDailyActivityThisWeek() {
    // Implementar lógica para verificar actividad diaria
    return [true, true, true, true, true, true, true]; // Simplificado
  }
  
  updateExplorationRate() {
    if (!this.userProgress) return;
    
    const totalZones = 50;
    const exploredZones = this.userProgress.exploredZones.size;
    this.userProgress.statistics.explorationRate = (exploredZones / totalZones) * 100;
  }
  
  updateCompletionRate() {
    if (!this.userProgress) return;
    
    const totalTreatments = 25; // Asumir 25 tratamientos disponibles
    const completedTreatments = this.userProgress.completedTreatments.size;
    this.userProgress.statistics.completionRate = (completedTreatments / totalTreatments) * 100;
  }
  
  showNotification(title, message, type = 'info') {
    if (!this.userProgress || !this.userProgress.preferences.notificationsEnabled) return;
    
    const notification = {
      id: 'notification_' + Date.now(),
      title,
      message,
      type,
      timestamp: Date.now(),
      duration: this.config.notificationDuration
    };
    
    this.notifications.push(notification);
    this.displayNotification(notification);
    
    // Remover notificación después del tiempo
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, notification.duration);
  }
  
  displayNotification(notification) {
    // Crear elemento de notificación
    const notificationEl = document.createElement('div');
    notificationEl.className = `progress-notification notification-${notification.type}`;
    notificationEl.id = notification.id;
    notificationEl.innerHTML = `
      <div class="notification-content">
        <h4 class="notification-title">${notification.title}</h4>
        <p class="notification-message">${notification.message}</p>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Agregar al contenedor de notificaciones
    let container = document.querySelector('.notifications-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notifications-container';
      document.body.appendChild(container);
    }
    
    container.appendChild(notificationEl);
    
    // Animación de entrada
    setTimeout(() => {
      notificationEl.classList.add('visible');
    }, 100);
  }
  
  removeNotification(notificationId) {
    const notificationEl = document.getElementById(notificationId);
    if (notificationEl) {
      notificationEl.classList.remove('visible');
      setTimeout(() => {
        notificationEl.remove();
      }, 300);
    }
    
    // Remover del array
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }
  
  showLevelUpNotification(newLevel) {
    const level = this.levels.find(l => l.level === newLevel);
    if (level) {
      this.showNotification(
        '¡Nuevo Nivel!',
        `Has alcanzado el nivel ${newLevel}: ${level.name}`,
        'level-up'
      );
    }
  }
  
  showAchievementNotification(achievement) {
    this.showNotification(
      '¡Logro Desbloqueado!',
      `${achievement.icon} ${achievement.name}: ${achievement.description}`,
      'achievement'
    );
  }
  
  setupProgressUI() {
    // Crear UI de progreso si no existe
    this.createProgressUI();
    
    // Actualizar UI con datos actuales
    this.updateProgressUI();
  }
  
  createProgressUI() {
    // Verificar si ya existe
    if (document.querySelector('.progress-panel')) return;
    
    const progressHTML = `
      <div class="progress-panel">
        <div class="progress-header">
          <h3 class="progress-title">Tu Progreso</h3>
          <div class="progress-level">
            <span class="level-number">${this.userProgress?.level || 1}</span>
            <span class="level-name">${this.levels[0].name}</span>
          </div>
        </div>
        
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-value">${this.userProgress?.totalPoints || 0}</div>
            <div class="stat-label">Puntos</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.userProgress?.exploredZones?.size || 0}</div>
            <div class="stat-label">Zonas</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.userProgress?.streaks?.daily || 0}</div>
            <div class="stat-label">Racha</div>
          </div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
        </div>
        
        <div class="achievements-section">
          <h4 class="achievements-title">Logros Recientes</h4>
          <div class="achievements-grid" id="achievements-grid">
            <!-- Logros se agregarán dinámicamente -->
          </div>
        </div>
      </div>
    `;
    
    // Insertar en el DOM
    const container = document.createElement('div');
    container.innerHTML = progressHTML;
    document.body.appendChild(container.firstElementChild);
  }
  
  updateProgressUI() {
    if (!this.userProgress) return;
    
    // Actualizar nivel
    const levelNumber = document.querySelector('.progress-level .level-number');
    const levelName = document.querySelector('.progress-level .level-name');
    if (levelNumber) levelNumber.textContent = this.userProgress.level;
    if (levelName) {
      const level = this.levels.find(l => l.level === this.userProgress.level);
      levelName.textContent = level ? level.name : '';
    }
    
    // Actualizar estadísticas
    const pointsValue = document.querySelector('.progress-stats .stat-item:nth-child(1) .stat-value');
    const zonesValue = document.querySelector('.progress-stats .stat-item:nth-child(2) .stat-value');
    const streakValue = document.querySelector('.progress-stats .stat-item:nth-child(3) .stat-value');
    
    if (pointsValue) pointsValue.textContent = this.userProgress.totalPoints;
    if (zonesValue) zonesValue.textContent = this.userProgress.exploredZones.size;
    if (streakValue) streakValue.textContent = this.userProgress.streaks.daily;
    
    // Actualizar barra de progreso
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${this.getProgressPercentage()}%`;
    }
    
    // Actualizar logros
    this.updateAchievementsUI();
  }
  
  updateAchievementsUI() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    // Obtener logros recientes (últimos 5)
    const recentAchievements = Array.from(this.achievements.values())
      .sort((a, b) => b.unlockedAt - a.unlockedAt)
      .slice(0, 5);
    
    achievementsGrid.innerHTML = recentAchievements.map(achievement => `
      <div class="achievement-item" title="${achievement.description}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-points">+${achievement.points} pts</div>
        </div>
      </div>
    `).join('');
  }
  
  getProgressPercentage() {
    if (!this.userProgress) return 0;
    
    const currentLevel = this.userProgress.level;
    const currentPoints = this.userProgress.totalPoints;
    
    if (currentLevel >= this.levels.length) return 100;
    
    const currentLevelData = this.levels.find(l => l.level === currentLevel);
    const nextLevelData = this.levels.find(l => l.level === currentLevel + 1);
    
    if (!nextLevelData) return 100;
    
    const levelRange = nextLevelData.points - currentLevelData.points;
    const progressInLevel = currentPoints - currentLevelData.points;
    
    return Math.min(100, (progressInLevel / levelRange) * 100);
  }
  
  setupAutoSave() {
    setInterval(() => {
      this.saveProgress();
    }, this.config.autoSaveInterval);
  }
  
  saveProgress() {
    if (!this.userProgress) return;
    
    try {
      // Convertir Sets a Arrays para JSON
      const progressToSave = {
        ...this.userProgress,
        exploredZones: Array.from(this.userProgress.exploredZones),
        completedTreatments: Array.from(this.userProgress.completedTreatments),
        achievements: Array.from(this.userProgress.achievements),
        favoriteZones: Array.from(this.userProgress.statistics.favoriteZones),
        favoriteTreatments: Array.from(this.userProgress.statistics.favoriteTreatments),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('atlas-user-progress', JSON.stringify(progressToSave));
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  }
  
  pauseCurrentSession() {
    if (this.currentSession) {
      this.currentSession.quality = 'paused';
      this.currentSession.activities.push({
        type: 'session_pause',
        timestamp: Date.now(),
        data: {}
      });
    }
  }
  
  resumeCurrentSession() {
    if (this.currentSession) {
      this.currentSession.quality = 'active';
      this.currentSession.activities.push({
        type: 'session_resume',
        timestamp: Date.now(),
        data: {}
      });
    }
  }
  
  endCurrentSession() {
    if (!this.currentSession) return;
    
    this.currentSession.endTime = Date.now();
    this.currentSession.quality = 'completed';
    
    // Agregar a historial de sesiones
    this.userProgress.sessions.push(this.currentSession);
    
    // Actualizar estadísticas
    this.updateSessionStatistics();
    
    // Guardar progreso
    this.saveProgress();
    
    // Limpiar timer
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
    
    this.currentSession = null;
  }
  
  updateSessionStatistics() {
    if (!this.userProgress || !this.currentSession) return;
    
    const sessionDuration = this.currentSession.duration / 60; // Convertir a minutos
    
    this.userProgress.statistics.totalSessions++;
    this.userProgress.statistics.totalTimeMinutes += sessionDuration;
    this.userProgress.statistics.averageSessionTime = 
      this.userProgress.statistics.totalTimeMinutes / this.userProgress.statistics.totalSessions;
  }
  
  // Métodos públicos
  getUserProgress() {
    return { ...this.userProgress };
  }
  
  getAchievements() {
    return Array.from(this.achievements.values());
  }
  
  getCurrentLevel() {
    if (!this.userProgress) return 1;
    return this.userProgress.level;
  }
  
  getTotalPoints() {
    return this.userProgress?.totalPoints || 0;
  }
  
  getExploredZones() {
    return Array.from(this.userProgress?.exploredZones || []);
  }
  
  getStreaks() {
    return { ...this.userProgress?.streaks };
  }
  
  resetProgress() {
    if (!confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      return;
    }
    
    // Reiniciar progreso
    this.userProgress = {
      userId: this.currentUser.id,
      level: 1,
      totalPoints: 0,
      exploredZones: new Set(),
      completedTreatments: new Set(),
      sessions: [],
      achievements: new Set(),
      streaks: {
        daily: 0,
        weekly: 0,
        longestDaily: 0,
        longestWeekly: 0
      },
      statistics: {
        totalSessions: 0,
        totalTimeMinutes: 0,
        averageSessionTime: 0,
        favoriteZones: new Map(),
        favoriteTreatments: new Map(),
        explorationRate: 0,
        completionRate: 0
      },
      preferences: {
        notificationsEnabled: true,
        soundEnabled: false,
        vibrationEnabled: false,
        privacyMode: false
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Limpiar logros
    this.achievements.clear();
    
    // Guardar y actualizar UI
    this.saveProgress();
    this.updateProgressUI();
    
    this.showNotification('Progreso Reiniciado', 'Tu progreso ha sido reiniciado. ¡Comienza un nuevo viaje!', 'info');
  }
  
  exportProgress() {
    const exportData = {
      user: this.currentUser,
      progress: this.userProgress,
      achievements: this.getAchievements(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-progress-${this.currentUser.id}-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`atlasProgress:${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }
  
  destroy() {
    // Finalizar sesión actual
    this.endCurrentSession();
    
    // Limpiar timer
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
    
    this.isInitialized = false;
    console.log('🏆 Atlas Progress Therapeutic - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AtlasProgressTherapeutic = new AtlasProgressTherapeutic();
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasProgressTherapeutic;
}
