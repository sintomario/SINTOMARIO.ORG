/**
 * Atlas Somático Editorial - Data Visualization Medical
 * Sistema de visualización de datos médicos con charts interactivos
 */

class AtlasDataVizMedical {
  constructor() {
    this.isInitialized = false;
    this.charts = new Map();
    this.datasets = new Map();
    this.currentTheme = 'light';
    this.animationEnabled = true;
    this.interactiveMode = true;
    
    // Configuración de visualización
    this.config = {
      defaultChartType: 'line',
      animationDuration: 750,
      easingFunction: 'easeInOutQuart',
      responsiveBreakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024
      },
      colorPalettes: {
        therapeutic: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
        emotional: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#64748b'],
        physical: ['#10b981', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
        neutral: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc']
      },
      chartDefaults: {
        padding: { top: 20, right: 30, bottom: 40, left: 50 },
        gridOpacity: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        strokeWidth: 2,
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      }
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Inicializar datasets médicos
      await this.initializeMedicalDatasets();
      
      // Configurar contenedores de charts
      this.setupChartContainers();
      
      // Configurar interacciones
      this.setupInteractions();
      
      // Configurar temas
      this.setupThemeSupport();
      
      // Configurar responsividad
      this.setupResponsiveness();
      
      this.isInitialized = true;
      console.log('📊 Atlas Data Visualization Medical - Inicializado');
      
    } catch (error) {
      console.error('Error al inicializar Data Viz Medical:', error);
    }
  }
  
  async initializeMedicalDatasets() {
    // Dataset de síntomas por zona
    this.datasets.set('symptomsByZone', {
      type: 'radar',
      data: {
        labels: ['Cabeza', 'Cuello', 'Hombros', 'Pecho', 'Abdomen', 'Pelvis', 'Piernas', 'Pies'],
        datasets: [
          {
            label: 'Dolor',
            data: [65, 45, 70, 55, 40, 35, 50, 30],
            borderColor: this.config.colorPalettes.therapeutic[0],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          },
          {
            label: 'Tensión',
            data: [45, 60, 80, 50, 55, 45, 40, 25],
            borderColor: this.config.colorPalettes.therapeutic[2],
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true
          },
          {
            label: 'Ansiedad',
            data: [55, 40, 35, 60, 70, 50, 30, 20],
            borderColor: this.config.colorPalettes.therapeutic[3],
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Síntomas por Zona Corporal'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
    
    // Dataset de progreso terapéutico
    this.datasets.set('therapeuticProgress', {
      type: 'line',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6', 'Semana 7', 'Semana 8'],
        datasets: [
          {
            label: 'Zonas Exploradas',
            data: [5, 8, 12, 15, 18, 22, 25, 28],
            borderColor: this.config.colorPalettes.therapeutic[0],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Tratamientos Completados',
            data: [2, 4, 6, 8, 11, 14, 17, 20],
            borderColor: this.config.colorPalettes.therapeutic[1],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Nivel de Conciencia',
            data: [20, 35, 45, 55, 65, 72, 78, 85],
            borderColor: this.config.colorPalettes.therapeutic[3],
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Progreso Terapéutico'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Dataset de distribución emocional
    this.datasets.set('emotionalDistribution', {
      type: 'doughnut',
      data: {
        labels: ['Calma', 'Alegría', 'Ansiedad', 'Tristeza', 'Enojo', 'Miedo'],
        datasets: [{
          data: [35, 25, 15, 10, 8, 7],
          backgroundColor: this.config.colorPalettes.emotional,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Distribución Emocional'
          }
        }
      }
    });
    
    // Dataset de frecuencia de síntomas
    this.datasets.set('symptomsFrequency', {
      type: 'bar',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            label: 'Dolor de Cabeza',
            data: [12, 19, 8, 15, 22, 18, 10],
            backgroundColor: this.config.colorPalettes.physical[0],
          },
          {
            label: 'Tensión Muscular',
            data: [15, 12, 18, 14, 8, 6, 4],
            backgroundColor: this.config.colorPalettes.physical[1],
          },
          {
            label: 'Ansiedad',
            data: [8, 11, 14, 9, 12, 16, 8],
            backgroundColor: this.config.colorPalettes.physical[2],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Frecuencia de Síntomas Semanal'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    // Dataset de correlación mente-cuerpo
    this.datasets.set('mindBodyCorrelation', {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Correlación Mente-Cuerpo',
          data: [
            {x: 20, y: 35}, {x: 30, y: 45}, {x: 40, y: 55}, {x: 50, y: 62},
            {x: 60, y: 70}, {x: 70, y: 78}, {x: 80, y: 85}, {x: 90, y: 92}
          ],
          backgroundColor: this.config.colorPalettes.therapeutic[0],
          borderColor: this.config.colorPalettes.therapeutic[0],
          pointRadius: 8,
          pointHoverRadius: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Correlación Mente-Cuerpo'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Nivel de Estrés Mental'
            },
            min: 0,
            max: 100
          },
          y: {
            title: {
              display: true,
              text: 'Síntomas Físicos'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
    
    // Dataset de heatmap de actividad corporal
    this.datasets.set('bodyHeatmap', {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Actividad Corporal',
          data: [
            {x: 1, y: 1, r: 15}, {x: 2, y: 1, r: 12}, {x: 3, y: 1, r: 8},
            {x: 1, y: 2, r: 10}, {x: 2, y: 2, r: 20}, {x: 3, y: 2, r: 18},
            {x: 1, y: 3, r: 6}, {x: 2, y: 3, r: 14}, {x: 3, y: 3, r: 22}
          ],
          backgroundColor: this.config.colorPalettes.therapeutic.map(color => color + '80'),
          borderColor: this.config.colorPalettes.therapeutic
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Mapa de Calor Corporal'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Región Corporal'
            },
            min: 0,
            max: 4
          },
          y: {
            title: {
              display: true,
              text: 'Intensidad'
            },
            min: 0,
            max: 4
          }
        }
      }
    });
  }
  
  setupChartContainers() {
    // Configurar contenedores para cada tipo de chart
    this.createChartContainer('symptoms-radar', 'Síntomas por Zona', 'radar');
    this.createChartContainer('progress-line', 'Progreso Terapéutico', 'line');
    this.createChartContainer('emotional-doughnut', 'Distribución Emocional', 'doughnut');
    this.createChartContainer('frequency-bar', 'Frecuencia de Síntomas', 'bar');
    this.createChartContainer('correlation-scatter', 'Correlación Mente-Cuerpo', 'scatter');
    this.createChartContainer('heatmap-bubble', 'Mapa de Calor Corporal', 'bubble');
  }
  
  createChartContainer(id, title, type) {
    // Verificar si el contenedor ya existe
    if (document.getElementById(id)) return;
    
    const container = document.createElement('div');
    container.className = 'chart-container';
    container.id = id;
    container.innerHTML = `
      <div class="chart-header">
        <h3 class="chart-title">${title}</h3>
        <div class="chart-controls">
          <button class="chart-control-btn" data-action="refresh" title="Actualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <button class="chart-control-btn" data-action="download" title="Descargar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="chart-control-btn" data-action="fullscreen" title="Pantalla completa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="chart-canvas-container">
        <canvas id="${id}-canvas"></canvas>
      </div>
      <div class="chart-loading" style="display: none;">
        <div class="loading-spinner"></div>
        <p>Cargando visualización...</p>
      </div>
    `;
    
    // Agregar al DOM
    const chartsSection = document.querySelector('.charts-section') || document.body;
    chartsSection.appendChild(container);
    
    // Configurar event listeners para controles
    this.setupChartControls(container);
  }
  
  setupChartControls(container) {
    const controls = container.querySelectorAll('.chart-control-btn');
    
    controls.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const chartId = container.id;
        
        switch (action) {
          case 'refresh':
            this.refreshChart(chartId);
            break;
          case 'download':
            this.downloadChart(chartId);
            break;
          case 'fullscreen':
            this.toggleFullscreen(chartId);
            break;
        }
      });
    });
  }
  
  setupInteractions() {
    // Configurar tooltips personalizados
    this.setupCustomTooltips();
    
    // Configurar zoom y pan
    this.setupZoomPan();
    
    // Configurar selección de datos
    this.setupDataSelection();
    
    // Configurar filtrado
    this.setupDataFiltering();
  }
  
  setupCustomTooltips() {
    // Configuración de tooltips personalizados para charts médicos
    Chart.defaults.plugins.tooltip = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          
          if (context.parsed.y !== null) {
            label += context.parsed.y + '%';
          } else if (context.parsed !== null) {
            label += context.parsed + '%';
          }
          
          return label;
        },
        afterLabel: function(context) {
          // Agregar información médica contextual
          const medicalInfo = this.getMedicalContext(context);
          return medicalInfo ? medicalInfo : '';
        }.bind(this)
      }
    };
  }
  
  getMedicalContext(context) {
    // Proporcionar contexto médico adicional
    const contexts = {
      'Dolor': 'Considera consulta médica si persiste',
      'Tensión': 'Técnicas de relajación recomendadas',
      'Ansiedad': 'Ejercicios de respiración pueden ayudar',
      'Calma': 'Buen estado emocional',
      'Alegría': 'Estado emocional positivo'
    };
    
    const label = context.dataset.label;
    return contexts[label] || '';
  }
  
  setupZoomPan() {
    // Configurar zoom y pan para charts complejos
    Chart.defaults.plugins.zoom = {
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.1
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      },
      pan: {
        enabled: true,
        mode: 'xy'
      }
    };
  }
  
  setupDataSelection() {
    // Configurar selección de datos points
    Chart.defaults.plugins.selection = {
      selection: {
        mode: 'x',
        onSelectionComplete: ({ chart, selection }) => {
          this.handleDataSelection(chart, selection);
        }
      }
    };
  }
  
  setupDataFiltering() {
    // Configurar controles de filtrado
    const filterControls = document.querySelectorAll('.chart-filter');
    
    filterControls.forEach(control => {
      control.addEventListener('change', (e) => {
        const filterType = e.target.dataset.filter;
        const filterValue = e.target.value;
        this.applyChartFilter(filterType, filterValue);
      });
    });
  }
  
  setupThemeSupport() {
    // Escuchar cambios de tema
    document.addEventListener('atlasTheme:themeChanged', (e) => {
      this.currentTheme = e.detail.theme;
      this.updateChartsTheme();
    });
    
    // Escuchar cambios de animaciones
    document.addEventListener('atlasTheme:animationsChanged', (e) => {
      this.animationEnabled = e.detail.enabled;
      this.updateChartsAnimations();
    });
  }
  
  setupResponsiveness() {
    // Configurar manejo de resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    
    // Configurar orientación
    window.addEventListener('orientationchange', () => {
      this.handleOrientationChange();
    });
  }
  
  createChart(containerId, datasetKey) {
    const canvas = document.getElementById(`${containerId}-canvas`);
    if (!canvas) return null;
    
    const dataset = this.datasets.get(datasetKey);
    if (!dataset) return null;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar opciones específicas del tema
    const options = this.applyThemeToOptions(dataset.options);
    
    const chart = new Chart(ctx, {
      type: dataset.type,
      data: dataset.data,
      options: options
    });
    
    this.charts.set(containerId, chart);
    
    // Agregar event listeners personalizados
    this.setupChartEvents(chart, containerId);
    
    return chart;
  }
  
  applyThemeToOptions(options) {
    const themeColors = this.getThemeColors();
    
    // Aplicar colores del tema a las opciones
    if (options.plugins?.legend) {
      options.plugins.legend.labels = {
        ...options.plugins.legend.labels,
        color: themeColors.text,
        font: {
          ...options.plugins.legend.labels.font,
          family: this.config.chartDefaults.fontFamily
        }
      };
    }
    
    if (options.plugins?.title) {
      options.plugins.title.color = themeColors.text;
      options.plugins.title.font = {
        ...options.plugins.title.font,
        family: this.config.chartDefaults.fontFamily
      };
    }
    
    if (options.scales) {
      Object.keys(options.scales).forEach(scaleKey => {
        const scale = options.scales[scaleKey];
        scale.ticks = {
          ...scale.ticks,
          color: themeColors.text,
          font: {
            ...scale.ticks.font,
            family: this.config.chartDefaults.fontFamily
          }
        };
        
        if (scale.title) {
          scale.title.color = themeColors.text;
          scale.title.font = {
            ...scale.title.font,
            family: this.config.chartDefaults.fontFamily
          };
        }
        
        if (scale.grid) {
          scale.grid.color = themeColors.grid;
          scale.grid.borderColor = themeColors.border;
        }
      });
    }
    
    return options;
  }
  
  getThemeColors() {
    const themes = {
      light: {
        text: '#1e293b',
        grid: 'rgba(0, 0, 0, 0.1)',
        border: '#e2e8f0'
      },
      dark: {
        text: '#f8fafc',
        grid: 'rgba(255, 255, 255, 0.1)',
        border: '#475569'
      },
      highContrast: {
        text: '#ffffff',
        grid: 'rgba(255, 255, 255, 0.2)',
        border: '#ffffff'
      },
      therapeutic: {
        text: '#14532d',
        grid: 'rgba(34, 197, 94, 0.1)',
        border: '#bbf7d0'
      }
    };
    
    return themes[this.currentTheme] || themes.light;
  }
  
  setupChartEvents(chart, containerId) {
    // Evento de click en el chart
    chart.canvas.addEventListener('click', (e) => {
      const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
      
      if (points.length) {
        const firstPoint = points[0];
        const datasetIndex = firstPoint.datasetIndex;
        const index = firstPoint.index;
        const dataset = chart.data.datasets[datasetIndex];
        const value = dataset.data[index];
        
        this.handleChartClick(containerId, datasetIndex, index, value, e);
      }
    });
    
    // Evento de hover
    chart.canvas.addEventListener('mousemove', (e) => {
      const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
      
      if (points.length) {
        chart.canvas.style.cursor = 'pointer';
      } else {
        chart.canvas.style.cursor = 'default';
      }
    });
  }
  
  handleChartClick(containerId, datasetIndex, index, value, event) {
    // Manejar clicks en charts para mostrar información detallada
    const chart = this.charts.get(containerId);
    const dataset = chart.data.datasets[datasetIndex];
    const label = chart.data.labels[index];
    
    // Mostrar modal con información detallada
    this.showDataDetailModal({
      containerId,
      dataset: dataset.label,
      label: label,
      value: value,
      event: event
    });
  }
  
  showDataDetailModal(data) {
    // Crear modal para mostrar información detallada
    const modal = document.createElement('div');
    modal.className = 'data-detail-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Detalle de Datos Médicos</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="data-item">
            <label>Dataset:</label>
            <span>${data.dataset}</span>
          </div>
          <div class="data-item">
            <label>Categoría:</label>
            <span>${data.label}</span>
          </div>
          <div class="data-item">
            <label>Valor:</label>
            <span>${data.value}%</span>
          </div>
          <div class="data-item">
            <label>Recomendación:</label>
            <span>${this.getMedicalRecommendation(data.dataset, data.value)}</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Mostrar modal con animación
    setTimeout(() => {
      modal.classList.add('visible');
    }, 100);
  }
  
  getMedicalRecommendation(dataset, value) {
    const recommendations = {
      'Dolor': value > 70 ? 'Consulta médica recomendada' : 'Monitorear y aplicar técnicas de relajación',
      'Tensión': value > 60 ? 'Ejercicios de estiramiento y respiración' : 'Mantener rutina de ejercicios',
      'Ansiedad': value > 50 ? 'Técnicas de mindfulness y meditación' : 'Prácticas de relajación diarias',
      'Calma': value > 80 ? 'Excelente estado, mantener prácticas' : 'Continuar con técnicas de bienestar',
      'Alegría': value > 70 ? 'Estado emocional positivo' : 'Explorar actividades que generen alegría'
    };
    
    return recommendations[dataset] || 'Continuar monitoreo y autoconocimiento';
  }
  
  refreshChart(containerId) {
    const chart = this.charts.get(containerId);
    if (!chart) return;
    
    // Mostrar loading
    this.showChartLoading(containerId);
    
    // Simular actualización de datos
    setTimeout(() => {
      this.updateChartData(containerId);
      this.hideChartLoading(containerId);
    }, 1000);
  }
  
  updateChartData(containerId) {
    const chart = this.charts.get(containerId);
    if (!chart) return;
    
    // Actualizar datos con valores aleatorios para demostración
    chart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(value => {
        const variation = (Math.random() - 0.5) * 20;
        return Math.max(0, Math.min(100, value + variation));
      });
    });
    
    chart.update('active');
  }
  
  downloadChart(containerId) {
    const chart = this.charts.get(containerId);
    if (!chart) return;
    
    // Crear link de descarga
    const link = document.createElement('a');
    link.download = `${containerId}-chart-${Date.now()}.png`;
    link.href = chart.toBase64Image();
    link.click();
  }
  
  toggleFullscreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error al entrar en pantalla completa:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  showChartLoading(containerId) {
    const loading = document.querySelector(`#${containerId} .chart-loading`);
    const canvas = document.querySelector(`#${containerId} canvas`);
    
    if (loading) loading.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
  }
  
  hideChartLoading(containerId) {
    const loading = document.querySelector(`#${containerId} .chart-loading`);
    const canvas = document.querySelector(`#${containerId} canvas`);
    
    if (loading) loading.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
  }
  
  updateChartsTheme() {
    this.charts.forEach((chart, containerId) => {
      const datasetKey = this.getDatasetKeyByContainer(containerId);
      const dataset = this.datasets.get(datasetKey);
      
      if (dataset) {
        chart.options = this.applyThemeToOptions(dataset.options);
        chart.update();
      }
    });
  }
  
  updateChartsAnimations() {
    this.charts.forEach(chart => {
      chart.options.animation = {
        duration: this.animationEnabled ? this.config.animationDuration : 0,
        easing: this.config.easingFunction
      };
      chart.update();
    });
  }
  
  getDatasetKeyByContainer(containerId) {
    const mapping = {
      'symptoms-radar': 'symptomsByZone',
      'progress-line': 'therapeuticProgress',
      'emotional-doughnut': 'emotionalDistribution',
      'frequency-bar': 'symptomsFrequency',
      'correlation-scatter': 'mindBodyCorrelation',
      'heatmap-bubble': 'bodyHeatmap'
    };
    
    return mapping[containerId];
  }
  
  applyChartFilter(filterType, filterValue) {
    // Aplicar filtros a todos los charts
    this.charts.forEach(chart => {
      this.filterChartData(chart, filterType, filterValue);
    });
  }
  
  filterChartData(chart, filterType, filterValue) {
    // Implementar lógica de filtrado
    switch (filterType) {
      case 'timeRange':
        this.filterByTimeRange(chart, filterValue);
        break;
      case 'zone':
        this.filterByZone(chart, filterValue);
        break;
      case 'symptomType':
        this.filterBySymptomType(chart, filterValue);
        break;
    }
    
    chart.update();
  }
  
  filterByTimeRange(chart, range) {
    // Implementar filtrado por rango de tiempo
    // Esto es un ejemplo simplificado
    const labels = chart.data.labels;
    const filteredLabels = labels.slice(-parseInt(range));
    
    chart.data.labels = filteredLabels;
    
    chart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.slice(-parseInt(range));
    });
  }
  
  filterByZone(chart, zone) {
    // Implementar filtrado por zona corporal
    // Esto es un ejemplo simplificado
    if (chart.data.labels.includes(zone)) {
      const index = chart.data.labels.indexOf(zone);
      chart.data.labels = [zone];
      
      chart.data.datasets.forEach(dataset => {
        dataset.data = [dataset.data[index]];
      });
    }
  }
  
  filterBySymptomType(chart, type) {
    // Implementar filtrado por tipo de síntoma
    // Esto es un ejemplo simplificado
    const datasetIndex = chart.data.datasets.findIndex(ds => ds.label === type);
    
    if (datasetIndex !== -1) {
      chart.data.datasets = [chart.data.datasets[datasetIndex]];
    }
  }
  
  handleResize() {
    // Manejar cambios de tamaño de ventana
    this.charts.forEach(chart => {
      chart.resize();
    });
  }
  
  handleOrientationChange() {
    // Manejar cambios de orientación
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }
  
  handleDataSelection(chart, selection) {
    // Manejar selección de datos
    console.log('Data selection:', selection);
    
    // Actualizar charts basados en la selección
    this.updateChartsBasedOnSelection(selection);
  }
  
  updateChartsBasedOnSelection(selection) {
    // Implementar lógica para actualizar charts basados en selección
    this.charts.forEach(chart => {
      // Aplicar filtros basados en la selección
      chart.update();
    });
  }
  
  // Métodos públicos
  initializeAllCharts() {
    // Inicializar todos los charts
    this.createChart('symptoms-radar', 'symptomsByZone');
    this.createChart('progress-line', 'therapeuticProgress');
    this.createChart('emotional-doughnut', 'emotionalDistribution');
    this.createChart('frequency-bar', 'symptomsFrequency');
    this.createChart('correlation-scatter', 'mindBodyCorrelation');
    this.createChart('heatmap-bubble', 'bodyHeatmap');
  }
  
  getChart(containerId) {
    return this.charts.get(containerId);
  }
  
  getAllCharts() {
    return Array.from(this.charts.values());
  }
  
  updateDataset(datasetKey, newData) {
    const dataset = this.datasets.get(datasetKey);
    if (dataset) {
      dataset.data = newData;
      
      // Actualizar charts que usan este dataset
      this.charts.forEach((chart, containerId) => {
        if (this.getDatasetKeyByContainer(containerId) === datasetKey) {
          chart.data = newData;
          chart.update();
        }
      });
    }
  }
  
  exportAllCharts() {
    // Exportar todos los charts como imágenes
    this.charts.forEach((chart, containerId) => {
      this.downloadChart(containerId);
    });
  }
  
  destroy() {
    // Destruir todos los charts
    this.charts.forEach(chart => {
      chart.destroy();
    });
    
    this.charts.clear();
    this.datasets.clear();
    
    this.isInitialized = false;
    console.log('📊 Atlas Data Visualization Medical - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si Chart.js está disponible
  if (typeof Chart !== 'undefined') {
    window.AtlasDataVizMedical = new AtlasDataVizMedical();
    window.AtlasDataVizMedical.initializeAllCharts();
  } else {
    console.warn('Chart.js no está disponible. Las visualizaciones médicas no se pueden inicializar.');
  }
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasDataVizMedical;
}
