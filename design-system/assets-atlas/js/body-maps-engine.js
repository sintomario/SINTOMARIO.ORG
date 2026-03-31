/**
 * Atlas Somático Editorial - Body Maps Engine
 * Motor interactivo para mapas corporales con 50 zonas
 */

class AtlasBodyMaps {
  constructor() {
    this.isInitialized = false;
    this.currentZone = null;
    this.exploredZones = new Set();
    this.bodyMapData = null;
    this.svgElement = null;
    this.infoPanel = null;
    this.detailView = null;
    this.currentView = 'front'; // front, back, side
    this.interactionMode = 'explore'; // explore, pain, tension, relaxation
    this.zoomLevel = 1;
    this.panOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    
    // Configuración
    this.config = {
      maxZoom: 3,
      minZoom: 0.5,
      zoomStep: 0.1,
      animationDuration: 300,
      touchSensitivity: 0.5,
      highlightDuration: 2000
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Cargar datos del mapa corporal
      await this.loadBodyMapData();
      
      // Inicializar SVG
      this.initializeSVG();
      
      // Configurar interacciones
      this.setupInteractions();
      
      // Configurar controles
      this.setupControls();
      
      // Configurar panel de información
      this.setupInfoPanel();
      
      // Configurar vista detallada
      this.setupDetailView();
      
      // Cargar progreso guardado
      this.loadProgress();
      
      this.isInitialized = true;
      console.log('🗺️ Atlas Body Maps Engine - Inicializado');
      
    } catch (error) {
      console.error('Error al inicializar Body Maps Engine:', error);
    }
  }
  
  async loadBodyMapData() {
    // Datos de las 50 zonas corporales
    this.bodyMapData = {
      zones: [
        // Cabeza y Cara (1-8)
        { id: 1, name: 'Frente', element: '#zone-frente', system: 'nervioso', symptoms: ['cefalea', 'tensión', 'estrés'] },
        { id: 2, name: 'Sienes', element: '#zone-sienes', system: 'nervioso', symptoms: ['migraña', 'presión'] },
        { id: 3, name: 'Ojos', element: '#zone-ojos', system: 'visual', symptoms: ['fatiga visual', 'sequedad'] },
        { id: 4, name: 'Nariz', element: '#zone-nariz', system: 'respiratorio', symptoms: ['congestión', 'alergias'] },
        { id: 5, name: 'Mejillas', element: '#zone-mejillas', system: 'circulatorio', symptoms: ['enrojecimiento', 'sensibilidad'] },
        { id: 6, name: 'Boca', element: '#zone-boca', system: 'digestivo', symptoms: ['tensión mandibular', 'bruxismo'] },
        { id: 7, name: 'Mentón', element: '#zone-menton', system: 'esquelético', symptoms: ['dolor mandibular', 'tensión'] },
        { id: 8, name: 'Orejas', element: '#zone-orejas', system: 'auditivo', symptoms: ['tinnitus', 'sensibilidad'] },
        
        // Cuello y Garganta (9-12)
        { id: 9, name: 'Nuca', element: '#zone-nuca', system: 'nervioso', symptoms: ['rigidez', 'dolor cervical'] },
        { id: 10, name: 'Garganta', element: '#zone-garganta', system: 'respiratorio', symptoms: ['dolor garganta', 'afonía'] },
        { id: 11, name: 'Laringe', element: '#zone-laringe', system: 'respiratorio', symptoms: ['ronquera', 'tos'] },
        { id: 12, name: 'Traquea', element: '#zone-traquea', system: 'respiratorio', symptoms: ['irritación', 'tos seca'] },
        
        // Hombros y Brazos (13-20)
        { id: 13, name: 'Hombro Derecho', element: '#zone-hombro-derecho', system: 'muscular', symptoms: ['dolor hombro', 'limitación'] },
        { id: 14, name: 'Hombro Izquierdo', element: '#zone-hombro-izquierdo', system: 'muscular', symptoms: ['dolor hombro', 'limitación'] },
        { id: 15, name: 'Bíceps Derecho', element: '#zone-biceps-derecho', system: 'muscular', symptoms: ['tensión', 'dolor'] },
        { id: 16, name: 'Bíceps Izquierdo', element: '#zone-biceps-izquierdo', system: 'muscular', symptoms: ['tensión', 'dolor'] },
        { id: 17, name: 'Tríceps Derecho', element: '#zone-triceps-derecho', system: 'muscular', symptoms: ['debilidad', 'dolor'] },
        { id: 18, name: 'Tríceps Izquierdo', element: '#zone-triceps-izquierdo', system: 'muscular', symptoms: ['debilidad', 'dolor'] },
        { id: 19, name: 'Codo Derecho', element: '#zone-codo-derecho', system: 'articular', symptoms: ['dolor codo', 'rigidez'] },
        { id: 20, name: 'Codo Izquierdo', element: '#zone-codo-izquierdo', system: 'articular', symptoms: ['dolor codo', 'rigidez'] },
        
        // Antebrazos y Manos (21-28)
        { id: 21, name: 'Antebrazo Derecho', element: '#zone-antebrazo-derecho', system: 'muscular', symptoms: ['tensión', 'calambres'] },
        { id: 22, name: 'Antebrazo Izquierdo', element: '#zone-antebrazo-izquierdo', system: 'muscular', symptoms: ['tensión', 'calambres'] },
        { id: 23, name: 'Muñeca Derecha', element: '#zone-muneca-derecha', system: 'articular', symptoms: ['dolor muñeca', 'túnel carpiano'] },
        { id: 24, name: 'Muñeca Izquierda', element: '#zone-muneca-izquierda', system: 'articular', symptoms: ['dolor muñeca', 'túnel carpiano'] },
        { id: 25, name: 'Mano Derecha', element: '#zone-mano-derecha', system: 'nervioso', symptoms: ['hormigueo', 'debilidad'] },
        { id: 26, name: 'Mano Izquierda', element: '#zone-mano-izquierda', system: 'nervioso', symptoms: ['hormigueo', 'debilidad'] },
        { id: 27, name: 'Dedos Derechos', element: '#zone-dedos-derechos', system: 'nervioso', symptoms: ['rigidez', 'dolor'] },
        { id: 28, name: 'Dedos Izquierdos', element: '#zone-dedos-izquierdos', system: 'nervioso', symptoms: ['rigidez', 'dolor'] },
        
        // Tórax y Espalda Alta (29-35)
        { id: 29, name: 'Esternón', element: '#zone-esternon', system: 'esquelético', symptoms: ['dolor pecho', 'presión'] },
        { id: 30, name: 'Corazón', element: '#zone-corazon', system: 'cardiovascular', symptoms: ['palpitaciones', 'opresión'] },
        { id: 31, name: 'Pulmones', element: '#zone-pulmones', system: 'respiratorio', symptoms: ['dificultad respirar', 'opresión'] },
        { id: 32, name: 'Columna Dorsal', element: '#zone-columna-dorsal', system: 'esquelético', symptoms: ['dolor espalda', 'rigidez'] },
        { id: 33, name: 'Escápula Derecha', element: '#zone-escapula-derecha', system: 'muscular', symptoms: ['dolor espalda', 'limitación'] },
        { id: 34, name: 'Escápula Izquierda', element: '#zone-escapula-izquierda', system: 'muscular', symptoms: ['dolor espalda', 'limitación'] },
        { id: 35, name: 'Pecho', element: '#zone-pecho', system: 'muscular', symptoms: ['tensión', 'dolor muscular'] },
        
        // Abdomen y Espalda Media (36-42)
        { id: 36, name: 'Abdomen Superior', element: '#zone-abdomen-superior', system: 'digestivo', symptoms: ['distensión', 'dolor'] },
        { id: 37, name: 'Abdomen Inferior', element: '#zone-abdomen-inferior', system: 'digestivo', symptoms: ['dolor', 'hinchazón'] },
        { id: 38, name: 'Estómago', element: '#zone-estomago', system: 'digestivo', symptoms: ['acidez', 'indigestión'] },
        { id: 39, name: 'Hígado', element: '#zone-higado', system: 'digestivo', symptoms: ['dolor costado', 'pesadez'] },
        { id: 40, name: 'Vesícula Biliar', element: '#zone-vesicula', system: 'digestivo', symptoms: ['dolor costado', 'digestión'] },
        { id: 41, name: 'Bazo', element: '#zone-bazo', system: 'linfático', symptoms: ['dolor costado', 'fatiga'] },
        { id: 42, name: 'Páncreas', element: '#zone-pancreas', system: 'digestivo', symptoms: ['dolor abdominal', 'digestión'] },
        
        // Pelvis y Cadera (43-47)
        { id: 43, name: 'Pelvis', element: '#zone-pelvis', system: 'esquelético', symptoms: ['dolor pelvis', 'rigidez'] },
        { id: 44, name: 'Cadera Derecha', element: '#zone-cadera-derecha', system: 'articular', symptoms: ['dolor cadera', 'limitación'] },
        { id: 45, name: 'Cadera Izquierda', element: '#zone-cadera-izquierda', system: 'articular', symptoms: ['dolor cadera', 'limitación'] },
        { id: 46, name: 'Sacro', element: '#zone-sacro', system: 'esquelético', symptoms: ['dolor lumbar', 'rigidez'] },
        { id: 47, name: 'Coxxis', element: '#zone-coxis', system: 'esquelético', symptoms: ['dolor coxis', 'sensibilidad'] },
        
        // Piernas y Pies (48-50)
        { id: 48, name: 'Muslos', element: '#zone-muslos', system: 'muscular', symptoms: ['dolor muscular', 'debilidad'] },
        { id: 49, name: 'Rodillas', element: '#zone-rodillas', system: 'articular', symptoms: ['dolor rodillas', 'inflamación'] },
        { id: 50, name: 'Pies', element: '#zone-pies', system: 'nervioso', symptoms: ['dolor pies', 'hormigueo'] }
      ],
      
      // Puntos de acupresión
      pressurePoints: [
        { id: 'p1', name: 'Yintang', element: '#point-yintang', zone: 1, benefit: 'calma mental' },
        { id: 'p2', name: 'Taiyang', element: '#point-taiyang', zone: 2, benefit: 'alivia migrañas' },
        { id: 'p3', name: 'Hegu', element: '#point-hegu', zone: 25, benefit: 'alivia dolor' },
        { id: 'p4', name: 'Zusanli', element: '#point-zusanli', zone: 50, benefit: 'energía' }
      ],
      
      // Conexiones somáticas
      connections: [
        { from: 1, to: 9, type: 'nervioso', strength: 0.8 },
        { from: 9, to: 13, type: 'muscular', strength: 0.6 },
        { from: 13, to: 29, type: 'circulatorio', strength: 0.7 },
        { from: 29, to: 36, type: 'digestivo', strength: 0.5 },
        { from: 36, to: 43, type: 'esquelético', strength: 0.8 },
        { from: 43, to: 48, type: 'nervioso', strength: 0.6 }
      ]
    };
  }
  
  initializeSVG() {
    this.svgElement = document.querySelector('.body-map-svg');
    if (!this.svgElement) {
      throw new Error('No se encontró el elemento SVG del mapa corporal');
    }
    
    // Crear estructura SVG básica si no existe
    if (this.svgElement.children.length === 0) {
      this.createBasicSVG();
    }
    
    // Configurar viewBox para zoom
    this.svgElement.setAttribute('viewBox', '0 0 400 800');
    this.svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  
  createBasicSVG() {
    // Crear estructura SVG básica con 50 zonas
    const svgContent = `
      <g class="body-map-group">
        <!-- Zonas corporales simplificadas -->
        <ellipse class="body-zone" id="zone-frente" cx="200" cy="80" rx="60" ry="30" data-zone="1"/>
        <ellipse class="body-zone" id="zone-sienes" cx="170" cy="70" rx="15" ry="20" data-zone="2"/>
        <ellipse class="body-zone" id="zone-sienes" cx="230" cy="70" rx="15" ry="20" data-zone="2"/>
        <circle class="body-zone" id="zone-ojos" cx="180" cy="80" r="8" data-zone="3"/>
        <circle class="body-zone" id="zone-ojos" cx="220" cy="80" r="8" data-zone="3"/>
        <ellipse class="body-zone" id="zone-nariz" cx="200" cy="90" rx="8" ry="15" data-zone="4"/>
        <ellipse class="body-zone" id="zone-mejillas" cx="170" cy="90" rx="20" ry="15" data-zone="5"/>
        <ellipse class="body-zone" id="zone-mejillas" cx="230" cy="90" rx="20" ry="15" data-zone="5"/>
        <ellipse class="body-zone" id="zone-boca" cx="200" cy="105" rx="25" ry="8" data-zone="6"/>
        <ellipse class="body-zone" id="zone-menton" cx="200" cy="120" rx="20" ry="10" data-zone="7"/>
        <circle class="body-zone" id="zone-orejas" cx="150" cy="85" r="12" data-zone="8"/>
        <circle class="body-zone" id="zone-orejas" cx="250" cy="85" r="12" data-zone="8"/>
        
        <!-- Cuello -->
        <rect class="body-zone" id="zone-nuca" x="180" y="130" width="40" height="30" rx="10" data-zone="9"/>
        
        <!-- Torso -->
        <ellipse class="body-zone" id="zone-pecho" cx="200" cy="200" rx="80" ry="60" data-zone="35"/>
        <ellipse class="body-zone" id="zone-corazon" cx="200" cy="190" rx="30" ry="25" data-zone="30"/>
        <ellipse class="body-zone" id="zone-pulmones" cx="200" cy="200" rx="60" ry="40" data-zone="31"/>
        
        <!-- Brazos -->
        <ellipse class="body-zone" id="zone-hombro-derecho" cx="130" cy="170" rx="25" ry="20" data-zone="13"/>
        <ellipse class="body-zone" id="zone-hombro-izquierdo" cx="270" cy="170" rx="25" ry="20" data-zone="14"/>
        <rect class="body-zone" id="zone-biceps-derecho" x="100" y="190" width="30" height="80" rx="15" data-zone="15"/>
        <rect class="body-zone" id="zone-biceps-izquierdo" x="270" y="190" width="30" height="80" rx="15" data-zone="16"/>
        
        <!-- Abdomen -->
        <ellipse class="body-zone" id="zone-abdomen-superior" cx="200" cy="280" rx="70" ry="40" data-zone="36"/>
        <ellipse class="body-zone" id="zone-abdomen-inferior" cx="200" cy="340" rx="60" ry="35" data-zone="37"/>
        
        <!-- Pelvis -->
        <ellipse class="body-zone" id="zone-pelvis" cx="200" cy="400" rx="80" ry="40" data-zone="43"/>
        
        <!-- Piernas -->
        <rect class="body-zone" id="zone-muslos" x="160" y="430" width="30" height="120" rx="15" data-zone="48"/>
        <rect class="body-zone" id="zone-muslos" x="210" y="430" width="30" height="120" rx="15" data-zone="48"/>
        <circle class="body-zone" id="zone-rodillas" cx="175" cy="560" r="20" data-zone="49"/>
        <circle class="body-zone" id="zone-rodillas" cx="225" cy="560" r="20" data-zone="49"/>
        <ellipse class="body-zone" id="zone-pies" cx="175" cy="650" rx="25" ry="15" data-zone="50"/>
        <ellipse class="body-zone" id="zone-pies" cx="225" cy="650" rx="25" ry="15" data-zone="50"/>
        
        <!-- Puntos de acupresión -->
        <circle class="pressure-point" id="point-yintang" cx="200" cy="75" r="4" data-point="p1"/>
        <circle class="pressure-point" id="point-taiyang" cx="170" cy="70" r="4" data-point="p2"/>
        <circle class="pressure-point" id="point-hegu" cx="115" cy="190" r="4" data-point="p3"/>
        <circle class="pressure-point" id="point-zusanli" cx="175" cy="600" r="4" data-point="p4"/>
      </g>
    `;
    
    this.svgElement.innerHTML = svgContent;
  }
  
  setupInteractions() {
    // Interacciones con zonas corporales
    this.svgElement.addEventListener('click', (e) => {
      const zone = e.target.closest('.body-zone');
      if (zone) {
        const zoneId = parseInt(zone.dataset.zone);
        this.selectZone(zoneId);
      }
    });
    
    // Hover effects
    this.svgElement.addEventListener('mouseover', (e) => {
      const zone = e.target.closest('.body-zone');
      if (zone) {
        const zoneId = parseInt(zone.dataset.zone);
        this.highlightZone(zoneId);
      }
    });
    
    this.svgElement.addEventListener('mouseout', (e) => {
      const zone = e.target.closest('.body-zone');
      if (zone) {
        this.clearHighlight();
      }
    });
    
    // Interacciones con puntos de acupresión
    this.svgElement.addEventListener('click', (e) => {
      const point = e.target.closest('.pressure-point');
      if (point) {
        const pointId = point.dataset.point;
        this.selectPressurePoint(pointId);
      }
    });
    
    // Zoom con rueda del mouse
    this.svgElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -this.config.zoomStep : this.config.zoomStep;
      this.zoom(delta);
    });
    
    // Pan con drag
    this.svgElement.addEventListener('mousedown', (e) => {
      this.startDrag(e);
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.drag(e);
      }
    });
    
    document.addEventListener('mouseup', () => {
      this.endDrag();
    });
    
    // Touch events para mobile
    this.svgElement.addEventListener('touchstart', (e) => {
      this.startTouch(e);
    });
    
    this.svgElement.addEventListener('touchmove', (e) => {
      this.moveTouch(e);
    });
    
    this.svgElement.addEventListener('touchend', () => {
      this.endTouch();
    });
  }
  
  setupControls() {
    // Botones de control
    document.querySelectorAll('.map-control-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleControlAction(action);
      });
    });
    
    // Controles de zoom
    document.getElementById('zoom-in')?.addEventListener('click', () => {
      this.zoom(this.config.zoomStep);
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
      this.zoom(-this.config.zoomStep);
    });
    
    document.getElementById('zoom-reset')?.addEventListener('click', () => {
      this.resetZoom();
    });
    
    // Controles de vista
    document.getElementById('view-front')?.addEventListener('click', () => {
      this.changeView('front');
    });
    
    document.getElementById('view-back')?.addEventListener('click', () => {
      this.changeView('back');
    });
    
    document.getElementById('view-side')?.addEventListener('click', () => {
      this.changeView('side');
    });
    
    // Controles de modo de interacción
    document.getElementById('mode-explore')?.addEventListener('click', () => {
      this.setInteractionMode('explore');
    });
    
    document.getElementById('mode-pain')?.addEventListener('click', () => {
      this.setInteractionMode('pain');
    });
    
    document.getElementById('mode-tension')?.addEventListener('click', () => {
      this.setInteractionMode('tension');
    });
    
    document.getElementById('mode-relaxation')?.addEventListener('click', () => {
      this.setInteractionMode('relaxation');
    });
  }
  
  setupInfoPanel() {
    this.infoPanel = document.querySelector('.zone-info-panel');
    if (!this.infoPanel) return;
    
    // Botón de cerrar
    const closeBtn = this.infoPanel.querySelector('.zone-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideInfoPanel();
      });
    }
    
    // Botones de acción
    this.infoPanel.querySelectorAll('.zone-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleZoneAction(action);
      });
    });
  }
  
  setupDetailView() {
    this.detailView = document.querySelector('.zone-detail-view');
    if (!this.detailView) return;
    
    // Botón de cerrar
    const closeBtn = this.detailView.querySelector('.detail-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideDetailView();
      });
    }
    
    // Cerrar con click fuera
    this.detailView.addEventListener('click', (e) => {
      if (e.target === this.detailView) {
        this.hideDetailView();
      }
    });
  }
  
  selectZone(zoneId) {
    const zone = this.bodyMapData.zones.find(z => z.id === zoneId);
    if (!zone) return;
    
    this.currentZone = zone;
    this.exploredZones.add(zoneId);
    
    // Actualizar estado visual
    this.updateZoneVisual(zoneId, 'active');
    
    // Mostrar información
    this.showZoneInfo(zone);
    
    // Guardar progreso
    this.saveProgress();
    
    // Evento personalizado
    this.dispatchEvent('zoneSelected', { zone });
  }
  
  highlightZone(zoneId) {
    const zoneElement = document.querySelector(`[data-zone="${zoneId}"]`);
    if (zoneElement) {
      zoneElement.classList.add('highlighted');
    }
  }
  
  clearHighlight() {
    document.querySelectorAll('.body-zone.highlighted').forEach(zone => {
      zone.classList.remove('highlighted');
    });
  }
  
  updateZoneVisual(zoneId, state) {
    const zoneElement = document.querySelector(`[data-zone="${zoneId}"]`);
    if (!zoneElement) return;
    
    // Remover estados anteriores
    zoneElement.classList.remove('active', 'explored', 'highlighted', 'pain', 'tension', 'relaxation');
    
    // Agregar nuevo estado
    switch (state) {
      case 'active':
        zoneElement.classList.add('active');
        break;
      case 'explored':
        zoneElement.classList.add('explored');
        break;
      case 'pain':
        zoneElement.classList.add('pain');
        break;
      case 'tension':
        zoneElement.classList.add('tension');
        break;
      case 'relaxation':
        zoneElement.classList.add('relaxation');
        break;
    }
  }
  
  showZoneInfo(zone) {
    if (!this.infoPanel) return;
    
    // Actualizar contenido
    const nameElement = this.infoPanel.querySelector('.zone-name');
    const descriptionElement = this.infoPanel.querySelector('.zone-description');
    const symptomsList = this.infoPanel.querySelector('.symptom-list');
    
    if (nameElement) nameElement.textContent = zone.name;
    if (descriptionElement) {
      descriptionElement.textContent = `Zona ${zone.id} del sistema ${zone.system}. Explora los síntomas y tratamientos disponibles.`;
    }
    
    if (symptomsList) {
      symptomsList.innerHTML = '';
      zone.symptoms.forEach(symptom => {
        const tag = document.createElement('span');
        tag.className = 'symptom-tag';
        tag.textContent = symptom;
        symptomsList.appendChild(tag);
      });
    }
    
    // Mostrar panel
    this.infoPanel.classList.add('visible');
  }
  
  hideInfoPanel() {
    if (this.infoPanel) {
      this.infoPanel.classList.remove('visible');
    }
  }
  
  showDetailView(zone) {
    if (!this.detailView) return;
    
    // Actualizar contenido detallado
    const titleElement = this.detailView.querySelector('.detail-title');
    if (titleElement) titleElement.textContent = zone.name;
    
    // Mostrar vista detallada
    this.detailView.classList.add('active');
  }
  
  hideDetailView() {
    if (this.detailView) {
      this.detailView.classList.remove('active');
    }
  }
  
  zoom(delta) {
    const newZoom = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, this.zoomLevel + delta));
    if (newZoom !== this.zoomLevel) {
      this.zoomLevel = newZoom;
      this.updateZoom();
    }
  }
  
  updateZoom() {
    const group = this.svgElement.querySelector('.body-map-group');
    if (group) {
      group.setAttribute('transform', `scale(${this.zoomLevel}) translate(${this.panOffset.x}, ${this.panOffset.y})`);
    }
  }
  
  resetZoom() {
    this.zoomLevel = 1;
    this.panOffset = { x: 0, y: 0 };
    this.updateZoom();
  }
  
  startDrag(e) {
    this.isDragging = true;
    this.dragStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
    this.svgElement.style.cursor = 'grabbing';
  }
  
  drag(e) {
    if (!this.isDragging) return;
    
    this.panOffset = {
      x: e.clientX - this.dragStart.x,
      y: e.clientY - this.dragStart.y
    };
    this.updateZoom();
  }
  
  endDrag() {
    this.isDragging = false;
    this.svgElement.style.cursor = 'grab';
  }
  
  startTouch(e) {
    if (e.touches.length === 1) {
      this.isDragging = true;
      this.dragStart = { x: e.touches[0].clientX - this.panOffset.x, y: e.touches[0].clientY - this.panOffset.y };
    }
  }
  
  moveTouch(e) {
    if (e.touches.length === 1 && this.isDragging) {
      e.preventDefault();
      this.panOffset = {
        x: e.touches[0].clientX - this.dragStart.x,
        y: e.touches[0].clientY - this.dragStart.y
      };
      this.updateZoom();
    }
  }
  
  endTouch() {
    this.isDragging = false;
  }
  
  changeView(view) {
    this.currentView = view;
    // Aquí iría la lógica para cambiar la vista del mapa corporal
    console.log('Cambiando a vista:', view);
  }
  
  setInteractionMode(mode) {
    this.interactionMode = mode;
    
    // Actualizar botones
    document.querySelectorAll('.map-control-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-action="mode-${mode}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
    
    // Actualizar colores de zonas según el modo
    this.updateZoneColors(mode);
  }
  
  updateZoneColors(mode) {
    document.querySelectorAll('.body-zone').forEach(zone => {
      zone.classList.remove('pain', 'tension', 'relaxation');
      
      if (mode === 'pain' && Math.random() > 0.7) {
        zone.classList.add('pain');
      } else if (mode === 'tension' && Math.random() > 0.6) {
        zone.classList.add('tension');
      } else if (mode === 'relaxation' && Math.random() > 0.8) {
        zone.classList.add('relaxation');
      }
    });
  }
  
  handleControlAction(action) {
    switch (action) {
      case 'zoom-in':
        this.zoom(this.config.zoomStep);
        break;
      case 'zoom-out':
        this.zoom(-this.config.zoomStep);
        break;
      case 'zoom-reset':
        this.resetZoom();
        break;
      case 'view-front':
        this.changeView('front');
        break;
      case 'view-back':
        this.changeView('back');
        break;
      case 'view-side':
        this.changeView('side');
        break;
      case 'mode-explore':
        this.setInteractionMode('explore');
        break;
      case 'mode-pain':
        this.setInteractionMode('pain');
        break;
      case 'mode-tension':
        this.setInteractionMode('tension');
        break;
      case 'mode-relaxation':
        this.setInteractionMode('relaxation');
        break;
    }
  }
  
  handleZoneAction(action) {
    if (!this.currentZone) return;
    
    switch (action) {
      case 'explore':
        this.showDetailView(this.currentZone);
        break;
      case 'add-symptom':
        this.addSymptom(this.currentZone);
        break;
      case 'treatment':
        this.showTreatment(this.currentZone);
        break;
    }
  }
  
  selectPressurePoint(pointId) {
    const point = this.bodyMapData.pressurePoints.find(p => p.id === pointId);
    if (!point) return;
    
    // Actualizar estado visual
    const pointElement = document.querySelector(`[data-point="${pointId}"]`);
    if (pointElement) {
      pointElement.classList.add('active');
      setTimeout(() => {
        pointElement.classList.remove('active');
      }, this.config.highlightDuration);
    }
    
    // Mostrar información del punto
    console.log('Punto de acupresión seleccionado:', point);
  }
  
  saveProgress() {
    try {
      const progress = {
        exploredZones: Array.from(this.exploredZones),
        currentZone: this.currentZone?.id,
        timestamp: Date.now()
      };
      localStorage.setItem('atlas-body-maps-progress', JSON.stringify(progress));
    } catch (error) {
      console.warn('No se pudo guardar el progreso:', error);
    }
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('atlas-body-maps-progress');
      if (saved) {
        const progress = JSON.parse(saved);
        this.exploredZones = new Set(progress.exploredZones);
        
        // Restaurar estado visual
        this.exploredZones.forEach(zoneId => {
          this.updateZoneVisual(zoneId, 'explored');
        });
      }
    } catch (error) {
      console.warn('No se pudo cargar el progreso:', error);
    }
  }
  
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`atlasBodyMaps:${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }
  
  // Métodos públicos
  getExploredZones() {
    return Array.from(this.exploredZones);
  }
  
  getZoneStats() {
    return {
      total: this.bodyMapData.zones.length,
      explored: this.exploredZones.size,
      percentage: (this.exploredZones.size / this.bodyMapData.zones.length) * 100
    };
  }
  
  resetExploration() {
    this.exploredZones.clear();
    document.querySelectorAll('.body-zone').forEach(zone => {
      zone.classList.remove('explored', 'active', 'pain', 'tension', 'relaxation');
    });
    localStorage.removeItem('atlas-body-maps-progress');
  }
  
  destroy() {
    // Limpiar event listeners
    this.svgElement.removeEventListener('click', this.selectZone);
    this.svgElement.removeEventListener('mouseover', this.highlightZone);
    this.svgElement.removeEventListener('mouseout', this.clearHighlight);
    
    this.isInitialized = false;
    console.log('🗺️ Atlas Body Maps Engine - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AtlasBodyMaps = new AtlasBodyMaps();
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasBodyMaps;
}
