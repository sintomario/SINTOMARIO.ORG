/**
 * Atlas Somático Editorial - Search Somatic Engine
 * Motor de búsqueda semántica con fuzzy search para contenido somático
 */

class AtlasSearchSomatic {
  constructor() {
    this.isInitialized = false;
    this.searchIndex = null;
    this.searchHistory = [];
    this.currentQuery = '';
    this.searchResults = [];
    this.isSearching = false;
    this.searchTimeout = null;
    
    // Configuración de búsqueda
    this.config = {
      minQueryLength: 2,
      maxResults: 20,
      fuzzyThreshold: 0.6,
      searchDelay: 300,
      highlightTag: 'mark',
      resultTypes: ['zones', 'symptoms', 'treatments', 'articles', 'techniques'],
      semanticWeight: 0.3,
      fuzzyWeight: 0.4,
      exactWeight: 0.3
    };
    
    // Diccionario somático para búsqueda semántica
    this.somaticDictionary = {
      // Sinónimos y términos relacionados
      'dolor': ['malestar', 'molestia', 'dolorimiento', 'sufrimiento', 'ardor', 'punzada'],
      'tensión': ['estrés', 'presión', 'rigidez', 'contracción', 'nerviosismo', 'ansiedad'],
      'relajación': ['calma', 'paz', 'tranquilidad', 'serenidad', 'descanso', 'alivio'],
      'cabeza': ['cráneo', 'frente', 'sienes', 'nuca', 'cuero cabelludo', 'cerebro'],
      'cuello': ['cervical', 'garganta', 'nuca', 'traquea', 'laringe'],
      'hombros': ['omóplatos', 'escápulas', 'articulación', 'deltoides'],
      'espalda': ['columna', 'vertebras', 'dorsal', 'lumbar', 'zona dorsal'],
      'pecho': ['tórax', 'esternón', 'corazón', 'pulmones', 'torácico'],
      'abdomen': ['vientre', 'estómago', 'panza', 'barriga', 'zona abdominal'],
      'piernas': ['muslos', 'rodillas', 'pantorrillas', 'tobillos', 'pies'],
      'emociones': ['sentimientos', 'estados anímicos', 'afectos', 'sensaciones'],
      'terapia': ['tratamiento', 'sanación', 'curación', 'recuperación', 'intervención'],
      'meditación': ['mindfulness', 'atención plena', 'contemplación', 'relajación profunda'],
      'respiración': ['aliento', 'inspiración', 'espiración', 'prana', 'ki']
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Inicializar índice de búsqueda
      await this.initializeSearchIndex();
      
      // Configurar UI de búsqueda
      this.setupSearchUI();
      
      // Cargar historial de búsqueda
      this.loadSearchHistory();
      
      // Configurar atajos de teclado
      this.setupKeyboardShortcuts();
      
      this.isInitialized = true;
      console.log('🔍 Atlas Search Somatic Engine - Inicializado');
      
    } catch (error) {
      console.error('Error al inicializar Search Somatic Engine:', error);
    }
  }
  
  async initializeSearchIndex() {
    // Datos de búsqueda somática
    const searchData = {
      zones: [
        { id: 1, name: 'Cabeza', keywords: ['cefalea', 'migraña', 'estrés', 'tensión', 'presión'], description: 'Zona superior del cuerpo relacionada con pensamiento y conciencia' },
        { id: 2, name: 'Cuello', keywords: ['rigidez', 'dolor cervical', 'tensión', 'nerviosismo'], description: 'Conexión entre cabeza y cuerpo, centro de comunicación' },
        { id: 3, name: 'Hombros', keywords: ['carga', 'estrés', 'tensión muscular', 'dolor'], description: 'Donde cargamos el peso emocional y físico' },
        { id: 4, name: 'Pecho', keywords: ['corazón', 'emociones', 'amor', 'tristeza', 'alegría'], description: 'Centro emocional y respiratorio' },
        { id: 5, name: 'Abdomen', keywords: ['digestión', 'emociones', 'intuición', 'ansiedad'], description: 'Centro del poder y la intuición' },
        { id: 6, name: 'Pelvis', keywords: ['raíz', 'fundamento', 'sexualidad', 'creatividad'], description: 'Base de nuestra estabilidad y energía vital' },
        { id: 7, name: 'Piernas', keywords: ['movimiento', 'progreso', 'estabilidad', 'caminar'], description: 'Soporte del cuerpo y dirección en la vida' },
        { id: 8, name: 'Pies', keywords: ['tierra', 'conexión', 'equilibrio', 'raíz'], description: 'Nuestra conexión con la tierra y el presente' }
      ],
      
      symptoms: [
        { id: 's1', name: 'Dolor de cabeza', keywords: ['cefalea', 'migraña', 'tensión', 'estrés'], zone: 1, severity: 'moderate' },
        { id: 's2', name: 'Rigidez cervical', keywords: ['cuello', 'rigidez', 'dolor', 'tensión'], zone: 2, severity: 'mild' },
        { id: 's3', name: 'Dolor de hombros', keywords: ['hombros', 'carga', 'tensión', 'dolor muscular'], zone: 3, severity: 'moderate' },
        { id: 's4', name: 'Opresión torácica', keywords: ['pecho', 'corazón', 'ansiedad', 'opresión'], zone: 4, severity: 'severe' },
        { id: 's5', name: 'Dolor abdominal', keywords: ['abdomen', 'digestión', 'dolor', 'hinchazón'], zone: 5, severity: 'moderate' },
        { id: 's6', name: 'Tensión pélvica', keywords: ['pelvis', 'tensión', 'rigidez', 'dolor'], zone: 6, severity: 'mild' },
        { id: 's7', name: 'Dolor lumbar', keywords: ['espalda', 'lumbar', 'dolor', 'rigidez'], zone: 6, severity: 'moderate' },
        { id: 's8', name: 'Dolor de rodillas', keywords: ['rodillas', 'dolor articular', 'inflamación'], zone: 7, severity: 'moderate' }
      ],
      
      treatments: [
        { id: 't1', name: 'Respiración consciente', keywords: ['respiración', 'relajación', 'estrés', 'ansiedad'], zones: [1, 2, 4], duration: '5-10 min' },
        { id: 't2', name: 'Estiramientos suaves', keywords: ['estiramiento', 'flexibilidad', 'tensión', 'músculos'], zones: [2, 3, 6], duration: '10-15 min' },
        { id: 't3', name: 'Meditación guiada', keywords: ['meditación', 'mindfulness', 'calma', 'paz mental'], zones: [1, 4], duration: '15-20 min' },
        { id: 't4', name: 'Masaje terapéutico', keywords: ['masaje', 'dolor', 'tensión', 'circulación'], zones: [3, 5, 6], duration: '20-30 min' },
        { id: 't5', name: 'Acupresión', keywords: ['presión', 'puntos', 'energía', 'dolor'], zones: [1, 7, 8], duration: '5-15 min' },
        { id: 't6', name: 'Yoga terapéutico', keywords: ['yoga', 'flexibilidad', 'equilibrio', 'respiración'], zones: [2, 3, 5, 6], duration: '30-45 min' },
        { id: 't7', name: 'Visualización', keywords: ['imaginación', 'sanación', 'relajación', 'mente'], zones: [1, 4], duration: '10-15 min' },
        { id: 't8', name: 'Baño caliente', keywords: ['calor', 'relajación', 'músculos', 'estrés'], zones: [3, 5, 6, 7], duration: '15-20 min' }
      ],
      
      articles: [
        { id: 'a1', title: 'Conexión mente-cuerpo', keywords: ['mente', 'cuerpo', 'conexión', 'somático'], category: 'educación' },
        { id: 'a2', title: 'Técnicas de respiración', keywords: ['respiración', 'técnica', 'estrés', 'ansiedad'], category: 'práctica' },
        { id: 'a3', title: 'El lenguaje del cuerpo', keywords: ['cuerpo', 'lenguaje', 'síntomas', 'emociones'], category: 'educación' },
        { id: 'a4', title: 'Sanación emocional', keywords: ['emociones', 'sanación', 'liberación', 'terapia'], category: 'terapia' },
        { id: 'a5', title: 'Mindfulness corporal', keywords: ['mindfulness', 'cuerpo', 'atención', 'presente'], category: 'práctica' },
        { id: 'a6', title: 'Ejercicios de relajación', keywords: ['relajación', 'ejercicios', 'estrés', 'tensión'], category: 'práctica' },
        { id: 'a7', title: 'Dolor crónico y emociones', keywords: ['dolor', 'crónico', 'emociones', 'estrés'], category: 'terapia' },
        { id: 'a8', title: 'Energía corporal', keywords: ['energía', 'cuerpo', 'chakras', 'flujo'], category: 'espiritual' }
      ],
      
      techniques: [
        { id: 'te1', name: 'Escaneo corporal', keywords: ['escaneo', 'cuerpo', 'atención', 'relajación'], type: 'meditación' },
        { id: 'te2', name: 'Relajación progresiva', keywords: ['relajación', 'músculos', 'tensión', 'liberación'], type: 'técnica' },
        { id: 'te3', name: 'Visualización sanadora', keywords: ['visualización', 'sanación', 'imaginación', 'energía'], type: 'visualización' },
        { id: 'te4', name: 'Escucha activa corporal', keywords: ['escucha', 'cuerpo', 'sensaciones', 'atención'], type: 'mindfulness' },
        { id: 'te5', name: 'Movimiento consciente', keywords: ['movimiento', 'consciente', 'cuerpo', 'expresión'], type: 'ejercicio' },
        { id: 'te6', name: 'Escritura somática', keywords: ['escritura', 'somático', 'emociones', 'expresión'], type: 'terapia' },
        { id: 'te7', name: 'Diálogo corporal', keywords: ['diálogo', 'cuerpo', 'comunicación', 'intuición'], type: 'terapia' },
        { id: 'te8', name: 'Danza somática', keywords: ['danza', 'cuerpo', 'expresión', 'liberación'], type: 'movimiento' }
      ]
    };
    
    // Crear índice invertido para búsqueda rápida
    this.searchIndex = this.createInvertedIndex(searchData);
  }
  
  createInvertedIndex(data) {
    const index = new Map();
    
    // Procesar cada tipo de contenido
    Object.entries(data).forEach(([type, items]) => {
      items.forEach(item => {
        // Extraer palabras clave
        const keywords = this.extractKeywords(item);
        
        // Agregar al índice
        keywords.forEach(keyword => {
          if (!index.has(keyword)) {
            index.set(keyword, []);
          }
          index.get(keyword).push({
            type,
            item,
            relevance: this.calculateRelevance(keyword, item)
          });
        });
      });
    });
    
    return index;
  }
  
  extractKeywords(item) {
    const keywords = new Set();
    
    // Extraer del nombre/título
    const title = item.name || item.title || '';
    title.split(/\s+/).forEach(word => {
      keywords.add(word.toLowerCase().trim());
    });
    
    // Extraer palabras clave explícitas
    if (item.keywords) {
      item.keywords.forEach(keyword => {
        keywords.add(keyword.toLowerCase());
        // Agregar sinónimos
        const synonyms = this.somaticDictionary[keyword];
        if (synonyms) {
          synonyms.forEach(synonym => keywords.add(synonym));
        }
      });
    }
    
    // Extraer de la descripción
    if (item.description) {
      item.description.split(/\s+/).forEach(word => {
        if (word.length > 3) {
          keywords.add(word.toLowerCase().trim());
        }
      });
    }
    
    return Array.from(keywords);
  }
  
  calculateRelevance(keyword, item) {
    let relevance = 0;
    
    // Relevancia por coincidencia exacta
    if (item.name && item.name.toLowerCase().includes(keyword)) {
      relevance += this.config.exactWeight;
    }
    
    // Relevancia por palabras clave
    if (item.keywords && item.keywords.includes(keyword)) {
      relevance += this.config.fuzzyWeight;
    }
    
    // Relevancia por descripción
    if (item.description && item.description.toLowerCase().includes(keyword)) {
      relevance += this.config.semanticWeight;
    }
    
    return relevance;
  }
  
  setupSearchUI() {
    // Input de búsqueda
    const searchInput = document.querySelector('.search-input-somatic');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value);
      });
      
      searchInput.addEventListener('keydown', (e) => {
        this.handleSearchKeydown(e);
      });
    }
    
    // Botón de búsqueda
    const searchButton = document.querySelector('.search-button-somatic');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        this.performSearch();
      });
    }
    
    // Contenedor de resultados
    this.resultsContainer = document.querySelector('.search-results-container');
    this.setupResultsContainer();
  }
  
  setupResultsContainer() {
    if (!this.resultsContainer) return;
    
    // Event delegation para resultados
    this.resultsContainer.addEventListener('click', (e) => {
      const resultItem = e.target.closest('.search-result-item');
      if (resultItem) {
        this.handleResultClick(resultItem);
      }
    });
  }
  
  handleSearchInput(query) {
    this.currentQuery = query.trim();
    
    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Si la consulta es muy corta, limpiar resultados
    if (this.currentQuery.length < this.config.minQueryLength) {
      this.clearResults();
      return;
    }
    
    // Realizar búsqueda con delay
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, this.config.searchDelay);
  }
  
  handleSearchKeydown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.performSearch();
        break;
      case 'Escape':
        this.clearSearch();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.navigateResults('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.navigateResults('up');
        break;
    }
  }
  
  async performSearch() {
    if (!this.currentQuery || this.currentQuery.length < this.config.minQueryLength) {
      this.clearResults();
      return;
    }
    
    this.isSearching = true;
    this.showSearchingState();
    
    try {
      // Realizar búsqueda
      const results = await this.search(this.currentQuery);
      this.searchResults = results;
      
      // Mostrar resultados
      this.displayResults(results);
      
      // Guardar en historial
      this.addToSearchHistory(this.currentQuery);
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      this.showErrorState();
    } finally {
      this.isSearching = false;
      this.hideSearchingState();
    }
  }
  
  async search(query) {
    const results = [];
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Buscar cada palabra
    queryWords.forEach(queryWord => {
      // Búsqueda exacta
      const exactMatches = this.searchIndex.get(queryWord) || [];
      results.push(...exactMatches);
      
      // Búsqueda difusa
      const fuzzyMatches = this.fuzzySearch(queryWord);
      results.push(...fuzzyMatches);
      
      // Búsqueda semántica
      const semanticMatches = this.semanticSearch(queryWord);
      results.push(...semanticMatches);
    });
    
    // Eliminar duplicados y ordenar por relevancia
    const uniqueResults = this.deduplicateResults(results);
    const sortedResults = this.sortResultsByRelevance(uniqueResults);
    
    // Limitar número de resultados
    return sortedResults.slice(0, this.config.maxResults);
  }
  
  fuzzySearch(query) {
    const results = [];
    const threshold = this.config.fuzzyThreshold;
    
    for (const [keyword, items] of this.searchIndex) {
      const similarity = this.calculateSimilarity(query, keyword);
      if (similarity >= threshold) {
        results.push(...items.map(item => ({
          ...item,
          fuzzyScore: similarity
        })));
      }
    }
    
    return results;
  }
  
  semanticSearch(query) {
    const results = [];
    
    // Buscar en diccionario somático
    for (const [term, synonyms] of Object.entries(this.somaticDictionary)) {
      if (term === query || synonyms.includes(query)) {
        // Encontrar todos los términos relacionados
        const relatedTerms = [term, ...synonyms];
        
        relatedTerms.forEach(relatedTerm => {
          const matches = this.searchIndex.get(relatedTerm) || [];
          results.push(...matches.map(item => ({
            ...item,
            semanticScore: 0.8
          })));
        });
      }
    }
    
    return results;
  }
  
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
  
  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = `${result.type}-${result.item.id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
  
  sortResultsByRelevance(results) {
    return results.sort((a, b) => {
      const scoreA = this.calculateTotalScore(a);
      const scoreB = this.calculateTotalScore(b);
      return scoreB - scoreA;
    });
  }
  
  calculateTotalScore(result) {
    let score = 0;
    
    // Relevancia base
    score += result.relevance || 0;
    
    // Puntuación difusa
    if (result.fuzzyScore) {
      score += result.fuzzyScore * 0.5;
    }
    
    // Puntuación semántica
    if (result.semanticScore) {
      score += result.semanticScore * 0.7;
    }
    
    // Bonus por tipo de contenido
    const typeBonus = {
      'zones': 1.0,
      'symptoms': 0.9,
      'treatments': 0.8,
      'articles': 0.7,
      'techniques': 0.6
    };
    
    score *= typeBonus[result.type] || 0.5;
    
    return score;
  }
  
  displayResults(results) {
    if (!this.resultsContainer) return;
    
    if (results.length === 0) {
      this.showNoResults();
      return;
    }
    
    // Agrupar resultados por tipo
    const groupedResults = this.groupResultsByType(results);
    
    // Generar HTML
    let html = '';
    
    Object.entries(groupedResults).forEach(([type, typeResults]) => {
      html += this.renderResultGroup(type, typeResults);
    });
    
    this.resultsContainer.innerHTML = html;
    this.resultsContainer.classList.add('visible');
  }
  
  groupResultsByType(results) {
    const groups = {};
    
    results.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });
    
    return groups;
  }
  
  renderResultGroup(type, results) {
    const typeLabels = {
      'zones': 'Zonas Corporales',
      'symptoms': 'Síntomas',
      'treatments': 'Tratamientos',
      'articles': 'Artículos',
      'techniques': 'Técnicas'
    };
    
    let html = `
      <div class="search-result-group">
        <h3 class="result-group-title">${typeLabels[type] || type}</h3>
        <div class="result-group-items">
    `;
    
    results.forEach(result => {
      html += this.renderResultItem(result);
    });
    
    html += `
        </div>
      </div>
    `;
    
    return html;
  }
  
  renderResultItem(result) {
    const item = result.item;
    const highlightedTitle = this.highlightText(item.name || item.title || '', this.currentQuery);
    const highlightedDescription = this.highlightText(item.description || '', this.currentQuery);
    
    return `
      <div class="search-result-item" data-type="${result.type}" data-id="${item.id}">
        <div class="result-item-header">
          <h4 class="result-item-title">${highlightedTitle}</h4>
          <span class="result-item-type">${result.type}</span>
        </div>
        ${highlightedDescription ? `<p class="result-item-description">${highlightedDescription}</p>` : ''}
        ${item.zone ? `<span class="result-item-zone">Zona: ${item.zone}</span>` : ''}
        ${item.duration ? `<span class="result-item-duration">Duración: ${item.duration}</span>` : ''}
        ${item.severity ? `<span class="result-item-severity severity-${item.severity}">Severidad: ${item.severity}</span>` : ''}
      </div>
    `;
  }
  
  highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<${this.config.highlightTag}>$1</${this.config.highlightTag}>`);
  }
  
  handleResultClick(resultItem) {
    const type = resultItem.dataset.type;
    const id = resultItem.dataset.id;
    
    // Disparar evento de selección
    this.dispatchEvent('resultSelected', { type, id, resultItem });
    
    // Acción según el tipo
    switch (type) {
      case 'zones':
        this.navigateToZone(id);
        break;
      case 'symptoms':
        this.showSymptomDetails(id);
        break;
      case 'treatments':
        this.showTreatmentDetails(id);
        break;
      case 'articles':
        this.navigateToArticle(id);
        break;
      case 'techniques':
        this.showTechniqueDetails(id);
        break;
    }
    
    // Limpiar búsqueda
    this.clearSearch();
  }
  
  navigateResults(direction) {
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    if (items.length === 0) return;
    
    const currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
    let newIndex;
    
    if (direction === 'down') {
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }
    
    // Actualizar selección
    items.forEach(item => item.classList.remove('selected'));
    items[newIndex].classList.add('selected');
    items[newIndex].scrollIntoView({ block: 'nearest' });
  }
  
  navigateToZone(zoneId) {
    if (window.AtlasBodyMaps) {
      window.AtlasBodyMaps.selectZone(parseInt(zoneId));
    }
  }
  
  showSymptomDetails(symptomId) {
    console.log('Mostrar detalles del síntoma:', symptomId);
    // Implementar lógica para mostrar detalles
  }
  
  showTreatmentDetails(treatmentId) {
    console.log('Mostrar detalles del tratamiento:', treatmentId);
    // Implementar lógica para mostrar detalles
  }
  
  navigateToArticle(articleId) {
    console.log('Navegar al artículo:', articleId);
    // Implementar lógica de navegación
  }
  
  showTechniqueDetails(techniqueId) {
    console.log('Mostrar detalles de la técnica:', techniqueId);
    // Implementar lógica para mostrar detalles
  }
  
  showSearchingState() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = `
        <div class="search-state searching">
          <div class="search-spinner"></div>
          <p>Buscando...</p>
        </div>
      `;
      this.resultsContainer.classList.add('visible');
    }
  }
  
  hideSearchingState() {
    // El estado se oculta cuando se muestran los resultados
  }
  
  showNoResults() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = `
        <div class="search-state no-results">
          <p>No se encontraron resultados para "${this.currentQuery}"</p>
          <p>Sugerencias:</p>
          <ul>
            <li>Verifica la ortografía</li>
            <li>Usa términos más generales</li>
            <li>Intenta con sinónimos</li>
          </ul>
        </div>
      `;
      this.resultsContainer.classList.add('visible');
    }
  }
  
  showErrorState() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = `
        <div class="search-state error">
          <p>Error al realizar la búsqueda</p>
          <p>Por favor, intenta nuevamente</p>
        </div>
      `;
      this.resultsContainer.classList.add('visible');
    }
  }
  
  clearResults() {
    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = '';
      this.resultsContainer.classList.remove('visible');
    }
    this.searchResults = [];
  }
  
  clearSearch() {
    const searchInput = document.querySelector('.search-input-somatic');
    if (searchInput) {
      searchInput.value = '';
    }
    this.currentQuery = '';
    this.clearResults();
  }
  
  addToSearchHistory(query) {
    // Eliminar si ya existe
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    
    // Agregar al principio
    this.searchHistory.unshift(query);
    
    // Limitar historial
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10);
    }
    
    // Guardar
    this.saveSearchHistory();
  }
  
  saveSearchHistory() {
    try {
      localStorage.setItem('atlas-search-history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('No se pudo guardar el historial de búsqueda:', error);
    }
  }
  
  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('atlas-search-history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('No se pudo cargar el historial de búsqueda:', error);
    }
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K para focus en búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input-somatic');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape para limpiar búsqueda
      if (e.key === 'Escape' && this.currentQuery) {
        this.clearSearch();
      }
    });
  }
  
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(`atlasSearch:${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }
  
  // Métodos públicos
  getSearchHistory() {
    return [...this.searchHistory];
  }
  
  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem('atlas-search-history');
  }
  
  getCurrentResults() {
    return [...this.searchResults];
  }
  
  isCurrentlySearching() {
    return this.isSearching;
  }
  
  destroy() {
    // Limpiar timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Limpiar event listeners
    const searchInput = document.querySelector('.search-input-somatic');
    if (searchInput) {
      searchInput.removeEventListener('input', this.handleSearchInput);
      searchInput.removeEventListener('keydown', this.handleSearchKeydown);
    }
    
    this.isInitialized = false;
    console.log('🔍 Atlas Search Somatic Engine - Detenido');
  }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
  window.AtlasSearchSomatic = new AtlasSearchSomatic();
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtlasSearchSomatic;
}
