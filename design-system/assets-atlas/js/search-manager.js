/**
 * Atlas Somático Editorial - Search Manager
 * Gestor de búsqueda somática con SEO optimization y accesibilidad WCAG 2.1 AAA
 */

class AtlasSearchManager {
    constructor() {
        this.searchIndex = new Map();
        this.searchHistory = [];
        this.currentQuery = '';
        this.isSearching = false;
        this.results = [];
        
        this.config = {
            minQueryLength: 2,
            maxResults: 50,
            searchDelay: 300,
            enableFuzzy: true,
            enableSemantic: true,
            enableAutocomplete: true,
            enableHistory: true
        };
        
        this.weights = {
            title: 3,
            content: 2,
            keywords: 2.5,
            zone: 4,
            symptom: 5,
            emotion: 3.5,
            technique: 3
        };
        
        this.init();
    }
    
    init() {
        this.setupSearchElements();
        this.setupEventListeners();
        this.buildSearchIndex();
        this.loadSearchHistory();
        this.setupAccessibility();
        this.setupSEOEnhancements();
        
        // Emitir evento de inicialización
        document.dispatchEvent(new CustomEvent('searchManagerInitialized', {
            detail: { manager: this }
        }));
    }
    
    setupSearchElements() {
        // Buscar elementos de búsqueda
        this.searchInput = document.querySelector('.search-input, input[type="search"]');
        this.searchButton = document.querySelector('.search-button, .search-toggle');
        this.searchResults = document.querySelector('.search-results');
        this.searchSuggestions = document.querySelector('.search-suggestions');
        
        // Crear elementos si no existen
        if (!this.searchResults) {
            this.createSearchResults();
        }
        
        if (!this.searchSuggestions) {
            this.createSearchSuggestions();
        }
    }
    
    createSearchResults() {
        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.searchResults.setAttribute('role', 'region');
        this.searchResults.setAttribute('aria-label', 'Resultados de búsqueda');
        this.searchResults.setAttribute('aria-live', 'polite');
        this.searchResults.innerHTML = `
            <div class="search-results-header">
                <h3 class="search-results-title">Resultados de Búsqueda</h3>
                <button class="search-results-close" aria-label="Cerrar resultados">×</button>
            </div>
            <div class="search-results-content" role="list"></div>
            <div class="search-results-footer">
                <button class="search-clear-history">Limpiar historial</button>
            </div>
        `;
        
        document.body.appendChild(this.searchResults);
    }
    
    createSearchSuggestions() {
        this.searchSuggestions = document.createElement('div');
        this.searchSuggestions.className = 'search-suggestions';
        this.searchSuggestions.setAttribute('role', 'listbox');
        this.searchSuggestions.setAttribute('aria-label', 'Sugerencias de búsqueda');
        
        document.body.appendChild(this.searchSuggestions);
    }
    
    setupEventListeners() {
        // Input de búsqueda
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(this.handleSearchInput.bind(this), this.config.searchDelay));
            this.searchInput.addEventListener('keydown', this.handleSearchKeydown.bind(this));
            this.searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
            this.searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
        }
        
        // Botón de búsqueda
        if (this.searchButton) {
            this.searchButton.addEventListener('click', this.handleSearchToggle.bind(this));
        }
        
        // Cerrar resultados
        const closeResults = this.searchResults?.querySelector('.search-results-close');
        if (closeResults) {
            closeResults.addEventListener('click', () => this.hideResults());
        }
        
        // Limpiar historial
        const clearHistory = this.searchResults?.querySelector('.search-clear-history');
        if (clearHistory) {
            clearHistory.addEventListener('click', () => this.clearSearchHistory());
        }
        
        // Clic fuera para cerrar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input, .search-results, .search-suggestions, .search-toggle')) {
                this.hideResults();
                this.hideSuggestions();
            }
        });
        
        // Tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults();
                this.hideSuggestions();
                if (this.searchInput) {
                    this.searchInput.blur();
                }
            }
        });
    }
    
    setupAccessibility() {
        // Navegación por teclado en sugerencias
        if (this.searchSuggestions) {
            this.searchSuggestions.addEventListener('keydown', this.handleSuggestionsKeydown.bind(this));
        }
        
        // Navegación por teclado en resultados
        if (this.searchResults) {
            this.searchResults.addEventListener('keydown', this.handleResultsKeydown.bind(this));
        }
        
        // ARIA live regions
        this.setupAriaLiveRegions();
    }
    
    setupAriaLiveRegions() {
        // Crear región para estado de búsqueda
        if (!document.getElementById('search-status')) {
            const statusRegion = document.createElement('div');
            statusRegion.id = 'search-status';
            statusRegion.setAttribute('aria-live', 'polite');
            statusRegion.setAttribute('aria-atomic', 'true');
            statusRegion.className = 'sr-only';
            document.body.appendChild(statusRegion);
        }
        
        // Crear región para resultados
        if (!document.getElementById('search-results-count')) {
            const countRegion = document.createElement('div');
            countRegion.id = 'search-results-count';
            countRegion.setAttribute('aria-live', 'polite');
            countRegion.setAttribute('aria-atomic', 'true');
            countRegion.className = 'sr-only';
            document.body.appendChild(countRegion);
        }
    }
    
    setupSEOEnhancements() {
        // Schema.org para búsqueda
        this.updateSearchSchema();
        
        // Meta tags para búsqueda
        this.updateSearchMetaTags();
        
        // Open Graph para resultados
        this.updateOpenGraphTags();
    }
    
    buildSearchIndex() {
        // Construir índice de búsqueda desde el contenido
        const content = this.extractSearchableContent();
        
        content.forEach(item => {
            const searchableText = this.extractSearchableText(item);
            const keywords = this.extractKeywords(searchableText);
            const semanticData = this.extractSemanticData(item);
            
            this.searchIndex.set(item.id, {
                ...item,
                searchableText,
                keywords,
                semanticData,
                relevanceScore: 0
            });
        });
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('searchIndexBuilt', {
            detail: { itemCount: this.searchIndex.size, manager: this }
        }));
    }
    
    extractSearchableContent() {
        const content = [];
        
        // Extraer artículos
        document.querySelectorAll('article, .article-content').forEach((article, index) => {
            content.push({
                id: `article-${index}`,
                type: 'article',
                title: article.querySelector('h1, h2')?.textContent || '',
                content: article.textContent,
                url: article.querySelector('a')?.href || window.location.href,
                zone: this.extractZone(article),
                symptoms: this.extractSymptoms(article),
                emotions: this.extractEmotions(article),
                techniques: this.extractTechniques(article)
            });
        });
        
        // Extraer zonas corporales
        document.querySelectorAll('.zone-card, .somatic-zone').forEach((zone, index) => {
            content.push({
                id: `zone-${index}`,
                type: 'zone',
                title: zone.querySelector('.zone-title, h3')?.textContent || '',
                content: zone.textContent,
                url: zone.querySelector('a')?.href || '#',
                zoneNumber: zone.dataset.zone || index + 1,
                bodyPart: zone.dataset.bodyPart || ''
            });
        });
        
        // Extraer hubs temáticos
        document.querySelectorAll('.hub-card, .thematic-hub').forEach((hub, index) => {
            content.push({
                id: `hub-${index}`,
                type: 'hub',
                title: hub.querySelector('.hub-title, h3')?.textContent || '',
                content: hub.textContent,
                url: hub.querySelector('a')?.href || '#',
                category: hub.dataset.category || '',
                topics: this.extractTopics(hub)
            });
        });
        
        return content;
    }
    
    extractSearchableText(item) {
        return `${item.title} ${item.content} ${item.zone || ''} ${item.symptoms?.join(' ') || ''} ${item.emotions?.join(' ') || ''}`;
    }
    
    extractKeywords(text) {
        // Extraer palabras clave usando técnicas de NLP básicas
        const words = text.toLowerCase()
            .replace(/[^\w\sáéíóúñü]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        // Contar frecuencia y eliminar duplicados
        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        // Ordenar por frecuencia y devolver top keywords
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([word]) => word);
    }
    
    extractSemanticData(item) {
        return {
            medicalTerms: this.extractMedicalTerms(item.content),
            emotionalTerms: this.extractEmotionalTerms(item.content),
            anatomicalTerms: this.extractAnatomicalTerms(item.content),
            therapeuticTerms: this.extractTherapeuticTerms(item.content)
        };
    }
    
    extractMedicalTerms(text) {
        const medicalTerms = [
            'dolor', 'síntoma', 'diagnóstico', 'tratamiento', 'terapia', 'medicina',
            'salud', 'enfermedad', 'condición', 'crónico', 'agudo', 'prevención'
        ];
        
        return medicalTerms.filter(term => 
            text.toLowerCase().includes(term)
        );
    }
    
    extractEmotionalTerms(text) {
        const emotionalTerms = [
            'ansiedad', 'estrés', 'depresión', 'alegría', 'tristeza', 'ira',
            'miedo', 'calma', 'paz', 'bienestar', 'emoción', 'sentimiento'
        ];
        
        return emotionalTerms.filter(term => 
            text.toLowerCase().includes(term)
        );
    }
    
    extractAnatomicalTerms(text) {
        const anatomicalTerms = [
            'cabeza', 'cuello', 'hombro', 'brazo', 'codo', 'mano', 'dedos',
            'pecho', 'espalda', 'abdomen', 'cadera', 'pierna', 'rodilla', 'pie'
        ];
        
        return anatomicalTerms.filter(term => 
            text.toLowerCase().includes(term)
        );
    }
    
    extractTherapeuticTerms(text) {
        const therapeuticTerms = [
            'meditación', 'respiración', 'estiramiento', 'masaje', 'ejercicio',
            'relajación', 'mindfulness', 'yoga', 'fisioterapia', 'psicoterapia'
        ];
        
        return therapeuticTerms.filter(term => 
            text.toLowerCase().includes(term)
        );
    }
    
    extractZone(element) {
        return element.dataset.zone || element.querySelector('.zone-name')?.textContent || '';
    }
    
    extractSymptoms(element) {
        const symptoms = [];
        element.querySelectorAll('.symptom, .sintoma').forEach(symptom => {
            symptoms.push(symptom.textContent.trim());
        });
        return symptoms;
    }
    
    extractEmotions(element) {
        const emotions = [];
        element.querySelectorAll('.emotion, .emoción').forEach(emotion => {
            emotions.push(emotion.textContent.trim());
        });
        return emotions;
    }
    
    extractTechniques(element) {
        const techniques = [];
        element.querySelectorAll('.technique, .técnica').forEach(technique => {
            techniques.push(technique.textContent.trim());
        });
        return techniques;
    }
    
    extractTopics(element) {
        const topics = [];
        element.querySelectorAll('.topic, .tema').forEach(topic => {
            topics.push(topic.textContent.trim());
        });
        return topics;
    }
    
    handleSearchInput(event) {
        const query = event.target.value.trim();
        this.currentQuery = query;
        
        if (query.length < this.config.minQueryLength) {
            this.hideResults();
            this.hideSuggestions();
            return;
        }
        
        this.performSearch(query);
    }
    
    handleSearchKeydown(event) {
        const suggestions = this.searchSuggestions?.querySelectorAll('.suggestion-item');
        if (!suggestions || suggestions.length === 0) return;
        
        const currentIndex = Array.from(suggestions).findIndex(item => 
            item.classList.contains('selected')
        );
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectSuggestion(Math.min(currentIndex + 1, suggestions.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectSuggestion(Math.max(currentIndex - 1, -1));
                break;
            case 'Enter':
                event.preventDefault();
                if (currentIndex >= 0) {
                    this.applySuggestion(suggestions[currentIndex]);
                } else {
                    this.performSearch(this.currentQuery);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    handleSearchFocus() {
        if (this.currentQuery.length >= this.config.minQueryLength) {
            this.showSuggestions();
        }
    }
    
    handleSearchBlur() {
        // Retrasar para permitir clic en sugerencias
        setTimeout(() => {
            this.hideSuggestions();
        }, 200);
    }
    
    handleSearchToggle() {
        if (this.searchInput) {
            this.searchInput.focus();
            this.searchInput.select();
        }
    }
    
    handleSuggestionsKeydown(event) {
        // Manejar navegación por teclado en sugerencias
        this.handleSearchKeydown(event);
    }
    
    handleResultsKeydown(event) {
        const results = this.searchResults?.querySelectorAll('.result-item');
        if (!results || results.length === 0) return;
        
        const currentIndex = Array.from(results).findIndex(item => 
            item.classList.contains('selected')
        );
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectResult(Math.min(currentIndex + 1, results.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectResult(Math.max(currentIndex - 1, -1));
                break;
            case 'Enter':
                event.preventDefault();
                if (currentIndex >= 0) {
                    this.navigateToResult(results[currentIndex]);
                }
                break;
        }
    }
    
    async performSearch(query) {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.showSearchingState();
        
        // Emitir evento de inicio de búsqueda
        document.dispatchEvent(new CustomEvent('searchStarted', {
            detail: { query, manager: this }
        }));
        
        // Simular búsqueda asíncrona
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            this.results = this.search(query);
            this.displayResults(this.results);
            this.addToSearchHistory(query);
            
            // Actualizar estado para screen readers
            this.updateSearchStatus(query, this.results.length);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        } finally {
            this.isSearching = false;
            this.hideSearchingState();
        }
    }
    
    search(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        
        // Búsqueda exacta
        this.searchIndex.forEach(item => {
            const score = this.calculateRelevanceScore(item, normalizedQuery);
            if (score > 0) {
                results.push({
                    ...item,
                    relevanceScore: score
                });
            }
        });
        
        // Búsqueda difusa si está habilitada
        if (this.config.enableFuzzy) {
            const fuzzyResults = this.fuzzySearch(normalizedQuery);
            fuzzyResults.forEach(result => {
                const existingIndex = results.findIndex(r => r.id === result.id);
                if (existingIndex >= 0) {
                    results[existingIndex].relevanceScore += result.relevanceScore * 0.5;
                } else {
                    results.push(result);
                }
            });
        }
        
        // Ordenar por relevancia y limitar resultados
        return results
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, this.config.maxResults);
    }
    
    calculateRelevanceScore(item, query) {
        let score = 0;
        const searchableText = item.searchableText.toLowerCase();
        
        // Búsqueda exacta en título
        if (item.title.toLowerCase().includes(query)) {
            score += this.weights.title * 2;
        }
        
        // Búsqueda exacta en contenido
        if (searchableText.includes(query)) {
            score += this.weights.content;
        }
        
        // Búsqueda en palabras clave
        item.keywords.forEach(keyword => {
            if (keyword.includes(query)) {
                score += this.weights.keywords;
            }
        });
        
        // Búsqueda en zona
        if (item.zone && item.zone.toLowerCase().includes(query)) {
            score += this.weights.zone;
        }
        
        // Búsqueda en síntomas
        if (item.symptoms) {
            item.symptoms.forEach(symptom => {
                if (symptom.toLowerCase().includes(query)) {
                    score += this.weights.symptom;
                }
            });
        }
        
        // Búsqueda en emociones
        if (item.emotions) {
            item.emotions.forEach(emotion => {
                if (emotion.toLowerCase().includes(query)) {
                    score += this.weights.emotion;
                }
            });
        }
        
        // Búsqueda en técnicas
        if (item.techniques) {
            item.techniques.forEach(technique => {
                if (technique.toLowerCase().includes(query)) {
                    score += this.weights.technique;
                }
            });
        }
        
        // Búsqueda semántica
        if (this.config.enableSemantic) {
            score += this.calculateSemanticScore(item, query);
        }
        
        return score;
    }
    
    calculateSemanticScore(item, query) {
        let score = 0;
        
        // Términos médicos
        item.semanticData.medicalTerms.forEach(term => {
            if (term.includes(query)) {
                score += 2;
            }
        });
        
        // Términos emocionales
        item.semanticData.emotionalTerms.forEach(term => {
            if (term.includes(query)) {
                score += 1.5;
            }
        });
        
        // Términos anatómicos
        item.semanticData.anatomicalTerms.forEach(term => {
            if (term.includes(query)) {
                score += 2.5;
            }
        });
        
        // Términos terapéuticos
        item.semanticData.therapeuticTerms.forEach(term => {
            if (term.includes(query)) {
                score += 1.8;
            }
        });
        
        return score;
    }
    
    fuzzySearch(query) {
        const results = [];
        const queryWords = query.split(' ').filter(word => word.length > 0);
        
        queryWords.forEach(queryWord => {
            this.searchIndex.forEach(item => {
                const searchableWords = item.searchableText.toLowerCase().split(' ');
                
                searchableWords.forEach(word => {
                    const distance = this.levenshteinDistance(queryWord, word);
                    const maxLength = Math.max(queryWord.length, word.length);
                    const similarity = 1 - (distance / maxLength);
                    
                    if (similarity > 0.7) {
                        const existingResult = results.find(r => r.id === item.id);
                        if (existingResult) {
                            existingResult.relevanceScore += similarity * 2;
                        } else {
                            results.push({
                                ...item,
                                relevanceScore: similarity * 2
                            });
                        }
                    }
                });
            });
        });
        
        return results;
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
    
    displayResults(results) {
        if (!this.searchResults) return;
        
        const resultsContent = this.searchResults.querySelector('.search-results-content');
        const resultsTitle = this.searchResults.querySelector('.search-results-title');
        
        // Actualizar título
        resultsTitle.textContent = `Resultados de Búsqueda (${results.length})`;
        
        // Limpiar resultados anteriores
        resultsContent.innerHTML = '';
        
        if (results.length === 0) {
            resultsContent.innerHTML = `
                <div class="search-no-results">
                    <div class="no-results-icon">🔍</div>
                    <h4>No se encontraron resultados</h4>
                    <p>Intenta con otros términos o revisa la ortografía.</p>
                    <div class="search-suggestions-alt">
                        <p>Sugerencias:</p>
                        <ul>
                            <li>Usa términos más generales</li>
                            <li>Revisa la ortografía</li>
                            <li>Busca por zonas corporales</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            results.forEach((result, index) => {
                const resultElement = this.createResultElement(result, index);
                resultsContent.appendChild(resultElement);
            });
        }
        
        // Mostrar resultados
        this.showResults();
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('searchResultsDisplayed', {
            detail: { results, query: this.currentQuery, manager: this }
        }));
    }
    
    createResultElement(result, index) {
        const element = document.createElement('div');
        element.className = 'result-item';
        element.setAttribute('role', 'listitem');
        element.setAttribute('data-result-id', result.id);
        element.setAttribute('data-result-type', result.type);
        element.setAttribute('data-relevance', result.relevanceScore);
        
        const typeIcon = this.getResultTypeIcon(result.type);
        const relevanceClass = this.getRelevanceClass(result.relevanceScore);
        
        element.innerHTML = `
            <div class="result-content ${relevanceClass}">
                <div class="result-type-icon">${typeIcon}</div>
                <div class="result-info">
                    <h4 class="result-title">
                        <a href="${result.url}" class="result-link">${this.highlightQuery(result.title)}</a>
                    </h4>
                    <p class="result-description">${this.highlightQuery(this.getExcerpt(result.content, 150))}</p>
                    <div class="result-meta">
                        <span class="result-type">${this.getResultTypeLabel(result.type)}</span>
                        ${result.zone ? `<span class="result-zone">Zona: ${result.zone}</span>` : ''}
                        <span class="result-relevance">Relevancia: ${Math.round(result.relevanceScore * 10) / 10}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Eventos
        element.addEventListener('click', () => this.navigateToResult(result));
        element.addEventListener('mouseenter', () => this.selectResult(index));
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigateToResult(result);
            }
        });
        
        return element;
    }
    
    getResultTypeIcon(type) {
        const icons = {
            article: '📖',
            zone: '🗺️',
            hub: '🧩',
            technique: '🧘',
            symptom: '⚕️'
        };
        return icons[type] || '📄';
    }
    
    getResultTypeLabel(type) {
        const labels = {
            article: 'Artículo',
            zone: 'Zona Corporal',
            hub: 'Hub Temático',
            technique: 'Técnica',
            symptom: 'Síntoma'
        };
        return labels[type] || 'Contenido';
    }
    
    getRelevanceClass(score) {
        if (score >= 10) return 'high-relevance';
        if (score >= 5) return 'medium-relevance';
        return 'low-relevance';
    }
    
    highlightQuery(text) {
        if (!this.currentQuery) return text;
        
        const regex = new RegExp(`(${this.currentQuery})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    getExcerpt(text, maxLength) {
        if (text.length <= maxLength) return text;
        
        const queryIndex = text.toLowerCase().indexOf(this.currentQuery.toLowerCase());
        if (queryIndex >= 0) {
            const start = Math.max(0, queryIndex - 50);
            const end = Math.min(text.length, queryIndex + this.currentQuery.length + 50);
            let excerpt = text.substring(start, end);
            
            if (start > 0) excerpt = '...' + excerpt;
            if (end < text.length) excerpt = excerpt + '...';
            
            return excerpt;
        }
        
        return text.substring(0, maxLength) + '...';
    }
    
    navigateToResult(result) {
        // Emitir evento de navegación
        document.dispatchEvent(new CustomEvent('searchResultSelected', {
            detail: { result, manager: this }
        }));
        
        // Navegar al resultado
        window.location.href = result.url;
    }
    
    selectResult(index) {
        const results = this.searchResults?.querySelectorAll('.result-item');
        if (!results) return;
        
        // Limpiar selección anterior
        results.forEach(item => item.classList.remove('selected'));
        
        // Seleccionar nuevo
        if (index >= 0 && index < results.length) {
            results[index].classList.add('selected');
            results[index].scrollIntoView({ block: 'nearest' });
        }
    }
    
    showResults() {
        if (this.searchResults) {
            this.searchResults.classList.add('active');
            this.searchResults.setAttribute('aria-hidden', 'false');
        }
    }
    
    hideResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('active');
            this.searchResults.setAttribute('aria-hidden', 'true');
        }
    }
    
    showSuggestions() {
        if (!this.config.enableAutocomplete) return;
        
        const suggestions = this.getSuggestions(this.currentQuery);
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.displaySuggestions(suggestions);
    }
    
    hideSuggestions() {
        if (this.searchSuggestions) {
            this.searchSuggestions.classList.remove('active');
            this.searchSuggestions.innerHTML = '';
        }
    }
    
    getSuggestions(query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();
        
        // Sugerencias del historial
        if (this.config.enableHistory) {
            this.searchHistory.forEach(term => {
                if (term.toLowerCase().startsWith(queryLower)) {
                    suggestions.push({
                        text: term,
                        type: 'history',
                        icon: '🕐'
                    });
                }
            });
        }
        
        // Sugerencias populares
        const popularTerms = [
            'dolor de cabeza', 'estrés', 'ansiedad', 'dolor de espalda',
            'meditación', 'respiración', 'insomnio', 'fatiga', 'relajación'
        ];
        
        popularTerms.forEach(term => {
            if (term.toLowerCase().includes(queryLower)) {
                suggestions.push({
                    text: term,
                    type: 'popular',
                    icon: '🔥'
                });
            }
        });
        
        // Limitar y deduplicar
        return suggestions
            .slice(0, 8)
            .filter((suggestion, index, array) => 
                array.findIndex(s => s.text === suggestion.text) === index
            );
    }
    
    displaySuggestions(suggestions) {
        if (!this.searchSuggestions) return;
        
        this.searchSuggestions.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const element = document.createElement('div');
            element.className = 'suggestion-item';
            element.setAttribute('role', 'option');
            element.setAttribute('data-suggestion-type', suggestion.type);
            element.innerHTML = `
                <span class="suggestion-icon">${suggestion.icon}</span>
                <span class="suggestion-text">${this.highlightQuery(suggestion.text)}</span>
                <span class="suggestion-type">${suggestion.type}</span>
            `;
            
            element.addEventListener('click', () => this.applySuggestion(suggestion));
            element.addEventListener('mouseenter', () => this.selectSuggestion(index));
            
            this.searchSuggestions.appendChild(element);
        });
        
        this.searchSuggestions.classList.add('active');
    }
    
    selectSuggestion(index) {
        const suggestions = this.searchSuggestions?.querySelectorAll('.suggestion-item');
        if (!suggestions) return;
        
        suggestions.forEach(item => item.classList.remove('selected'));
        
        if (index >= 0 && index < suggestions.length) {
            suggestions[index].classList.add('selected');
        }
    }
    
    applySuggestion(suggestion) {
        if (this.searchInput) {
            this.searchInput.value = suggestion.text;
            this.currentQuery = suggestion.text;
            this.hideSuggestions();
            this.performSearch(suggestion.text);
        }
    }
    
    showSearchingState() {
        if (this.searchInput) {
            this.searchInput.classList.add('searching');
            this.searchInput.setAttribute('aria-busy', 'true');
        }
    }
    
    hideSearchingState() {
        if (this.searchInput) {
            this.searchInput.classList.remove('searching');
            this.searchInput.setAttribute('aria-busy', 'false');
        }
    }
    
    showSearchError() {
        if (this.searchResults) {
            const resultsContent = this.searchResults.querySelector('.search-results-content');
            resultsContent.innerHTML = `
                <div class="search-error">
                    <div class="error-icon">⚠️</div>
                    <h4>Error en la búsqueda</h4>
                    <p>Ha ocurrido un error al realizar la búsqueda. Por favor, inténtalo de nuevo.</p>
                </div>
            `;
            this.showResults();
        }
    }
    
    addToSearchHistory(query) {
        if (!this.config.enableHistory) return;
        
        // Eliminar duplicados
        this.searchHistory = this.searchHistory.filter(term => term !== query);
        
        // Agregar al principio
        this.searchHistory.unshift(query);
        
        // Limitar historial
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        // Guardar en localStorage
        this.saveSearchHistory();
    }
    
    loadSearchHistory() {
        if (!this.config.enableHistory) return;
        
        try {
            const saved = localStorage.getItem('atlas-search-history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error loading search history:', error);
            this.searchHistory = [];
        }
    }
    
    saveSearchHistory() {
        if (!this.config.enableHistory) return;
        
        try {
            localStorage.setItem('atlas-search-history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('Error saving search history:', error);
        }
    }
    
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        
        // Mostrar notificación
        if (window.atlasInteractionManager) {
            window.atlasInteractionManager.showNotification('Historial de búsqueda eliminado', 'success');
        }
        
        // Emitir evento
        document.dispatchEvent(new CustomEvent('searchHistoryCleared', {
            detail: { manager: this }
        }));
    }
    
    updateSearchStatus(query, resultCount) {
        const statusElement = document.getElementById('search-status');
        if (statusElement) {
            const message = resultCount > 0 
                ? `Búsqueda "${query}" encontró ${resultCount} resultados`
                : `Búsqueda "${query}" no encontró resultados`;
            statusElement.textContent = message;
        }
        
        const countElement = document.getElementById('search-results-count');
        if (countElement) {
            countElement.textContent = `${resultCount} resultados encontrados`;
        }
    }
    
    updateSearchSchema() {
        // Actualizar Schema.org para búsqueda
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
            try {
                const data = JSON.parse(script.textContent);
                data.mainEntity = {
                    '@type': 'SearchAction',
                    'target': window.location.origin + '/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                };
                script.textContent = JSON.stringify(data, null, 2);
            } catch (e) {
                console.warn('Error updating search schema:', e);
            }
        }
    }
    
    updateSearchMetaTags() {
        // Actualizar meta tags para búsqueda
        let searchMeta = document.querySelector('meta[name="search"]');
        if (!searchMeta) {
            searchMeta = document.createElement('meta');
            searchMeta.name = 'search';
            document.head.appendChild(searchMeta);
        }
        searchMeta.content = window.location.origin + '/search?q=';
    }
    
    updateOpenGraphTags() {
        // Actualizar Open Graph para resultados de búsqueda
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && this.currentQuery) {
            ogTitle.content = `Búsqueda: ${this.currentQuery} - Atlas Somático Editorial`;
        }
    }
    
    // Utilidades
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // API pública
    search(query) {
        this.currentQuery = query;
        return this.performSearch(query);
    }
    
    clearSearch() {
        this.currentQuery = '';
        this.results = [];
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.hideResults();
        this.hideSuggestions();
    }
    
    getSearchHistory() {
        return [...this.searchHistory];
    }
    
    getSearchIndex() {
        return new Map(this.searchIndex);
    }
    
    rebuildIndex() {
        this.searchIndex.clear();
        this.buildSearchIndex();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.atlasSearchManager = new AtlasSearchManager();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtlasSearchManager;
}
