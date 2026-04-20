// SINTOMARIO.ORG - FAANG-Level Search Controller
// Orquesta Web Worker con UI sin jank

class FAANGSearch {
  constructor() {
    this.worker = null;
    this.isSearching = false;
    this.searchCache = new Map();
    this.debounceTimeout = null;
    this.init();
  }
  
  async init() {
    // Create Web Worker
    this.worker = new Worker('/assets/js/search-worker.js');
    
    // Setup worker communication
    this.worker.onmessage = (e) => {
      this.handleWorkerMessage(e.data);
    };
    
    // Load search data in worker
    this.postMessage({
      type: 'LOAD_DATA',
      data: { url: '/search-index-ultra-normalized.json' }
    });
    
    // Setup search input
    this.setupSearchInput();
    
    // Setup skeleton screens
    this.setupSkeletonScreens();
    
    console.log('FAANG Search initialized with Web Worker');
  }
  
  postMessage(message) {
    if (this.worker) {
      this.worker.postMessage(message);
    }
  }
  
  handleWorkerMessage(data) {
    switch (data.type) {
      case 'DATA_LOADED':
        if (data.success) {
          console.log('FAANG: Search data loaded in worker');
        } else {
          console.error('FAANG: Failed to load search data', data.error);
        }
        break;
        
      case 'SEARCH_RESULTS':
        this.displayResults(data.results, data.query, data.timestamp);
        this.hideSkeleton();
        this.isSearching = false;
        break;
        
      case 'STATS':
        console.log('FAANG: Worker stats', data.stats);
        break;
    }
  }
  
  setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    // Dynamic debounce based on device performance
    const baseDebounce = this.getOptimalDebounce();
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      // Clear previous timeout
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      
      // Hide results if query too short
      if (query.length < 2) {
        searchResults.innerHTML = '';
        this.hideSkeleton();
        return;
      }
      
      // Check cache first
      if (this.searchCache.has(query)) {
        const cached = this.searchCache.get(query);
        this.displayResults(cached.results, cached.query, cached.timestamp);
        return;
      }
      
      // Show skeleton for better perceived performance
      this.showSkeleton();
      
      // Debounced search with dynamic timing
      this.debounceTimeout = setTimeout(() => {
        this.performSearch(query);
      }, baseDebounce);
    });
    
    // Voice search support
    this.setupVoiceSearch(searchInput);
    
    // Keyboard navigation
    this.setupKeyboardNavigation(searchResults);
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.innerHTML = '';
        this.hideSkeleton();
      }
    });
  }
  
  getOptimalDebounce() {
    // Adaptive debounce based on device performance
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection ? connection.effectiveType : '4g';
    
    const debounceMap = {
      'slow-2g': 500,
      '2g': 400,
      '3g': 300,
      '4g': 200,
      '5g': 150
    };
    
    return debounceMap[effectiveType] || 200;
  }
  
  setupVoiceSearch(searchInput) {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return; // No speech support
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Create voice button
    const voiceButton = document.createElement('button');
    voiceButton.innerHTML = '🎤';
    voiceButton.className = 'search-voice-button';
    voiceButton.title = 'Buscar por voz';
    voiceButton.style.cssText = `
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 8px;
      margin-left: 8px;
      opacity: 0.7;
      transition: opacity 0.2s;
    `;
    
    voiceButton.addEventListener('mouseenter', () => {
      voiceButton.style.opacity = '1';
    });
    
    voiceButton.addEventListener('mouseleave', () => {
      voiceButton.style.opacity = '0.7';
    });
    
    voiceButton.addEventListener('click', () => {
      if (this.isSearching) return;
      
      voiceButton.innerHTML = '🔴';
      recognition.start();
    });
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event('input'));
      voiceButton.innerHTML = '🎤';
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      voiceButton.innerHTML = '🎤';
    };
    
    recognition.onend = () => {
      voiceButton.innerHTML = '🎤';
    };
    
    // Insert voice button
    searchInput.parentNode.insertBefore(voiceButton, searchInput.nextSibling);
  }
  
  setupSkeletonScreens() {
    const style = document.createElement('style');
    style.textContent = `
      .search-skeleton {
        display: none;
        padding: 1rem;
      }
      
      .skeleton-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        animation: skeleton-loading 1.5s infinite ease-in-out;
      }
      
      .skeleton-avatar {
        width: 40px;
        height: 40px;
        background: #e0e0e0;
        border-radius: 50%;
        margin-right: 1rem;
      }
      
      .skeleton-content {
        flex: 1;
      }
      
      .skeleton-title {
        height: 16px;
        background: #e0e0e0;
        border-radius: 4px;
        margin-bottom: 8px;
        width: 60%;
      }
      
      .skeleton-text {
        height: 12px;
        background: #e0e0e0;
        border-radius: 4px;
        width: 40%;
      }
      
      @keyframes skeleton-loading {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
      
      .search-voice-button:hover {
        transform: scale(1.1);
      }
      
      .search-result {
        transition: all 0.2s ease;
      }
      
      .search-result:hover {
        background: #f8f9fa;
        transform: translateX(4px);
      }
      
      .search-result-score {
        font-size: 0.8rem;
        color: #666;
        margin-left: 8px;
      }
      
      .search-result-stemmed {
        font-size: 0.75rem;
        color: #999;
        font-style: italic;
        margin-left: 4px;
      }
    `;
    document.head.appendChild(style);
  }
  
  showSkeleton() {
    let searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    searchResults.innerHTML = `
      <div class="search-skeleton">
        ${Array(3).fill('').map(() => `
          <div class="skeleton-item">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-text"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  hideSkeleton() {
    const skeleton = document.querySelector('.search-skeleton');
    if (skeleton) {
      skeleton.style.display = 'none';
    }
  }
  
  performSearch(query) {
    if (this.isSearching) return;
    
    this.isSearching = true;
    this.postMessage({
      type: 'SEARCH',
      data: { query }
    });
  }
  
  displayResults(results, query, timestamp) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    // Cache results
    this.searchCache.set(query, { results, query, timestamp });
    
    // Limit cache size
    if (this.searchCache.size > 100) {
      const firstKey = this.searchCache.keys().next().value;
      this.searchCache.delete(firstKey);
    }
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>No se encontraron resultados para "<strong>${query}</strong>"</p>
          <p>Intenta con otros términos como: ansiedad, dolor cabeza, estrés</p>
          <div class="search-telemetry">
            <small>¿No encontraste lo que buscabas? 
              <a href="#" onclick="window.logMissingTerm('${query}')" style="color: #007bff;">
                Ayúdanos a mejorar
              </a>
            </small>
          </div>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.map((result, index) => {
      const scoreClass = result.score >= 100 ? 'score-exact' : 
                       result.score >= 75 ? 'score-high' : 'score-medium';
      
      const matchTypeIcon = {
        'entity_exact': '🎯',
        'context_exact': '🎯',
        'entity_fuzzy': '🔍',
        'context_fuzzy': '🔍',
        'entity_phonetic': '🔊',
        'context_phonetic': '🔊'
      };
      
      const stemmedIndicator = result.stemmed ? 
        `<span class="search-result-stemmed">(stemmed)</span>` : '';
      
      return `
        <div class="search-result" data-index="${index}" tabindex="0" role="option">
          <div class="search-result-content">
            <h3 class="search-result-title">
              <a href="/cuerpo/${result.slug}/index.html" class="search-result-link">
                ${result.title}
              </a>
              ${stemmedIndicator}
            </h3>
            <div class="search-result-meta">
              <span class="search-result-entity">${result.entity_name}</span>
              <span class="search-result-context">${result.context_name}</span>
              <span class="search-result-type">${matchTypeIcon[result.match_type]}</span>
              <span class="search-result-score ${scoreClass}">${result.score}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
    this.setupKeyboardNavigation(searchResults);
  }
  
  setupKeyboardNavigation(searchResults) {
    let currentIndex = -1;
    
    const updateActiveResult = (index) => {
      const results = searchResults.querySelectorAll('.search-result');
      results.forEach((result, i) => {
        if (i === index) {
          result.classList.add('search-result-active');
          result.setAttribute('aria-selected', 'true');
        } else {
          result.classList.remove('search-result-active');
          result.setAttribute('aria-selected', 'false');
        }
      });
    };
    
    const handleKeydown = (e) => {
      const results = searchResults.querySelectorAll('.search-result');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, results.length - 1);
          updateActiveResult(currentIndex);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, -1);
          updateActiveResult(currentIndex);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (currentIndex >= 0 && results[currentIndex]) {
            const link = results[currentIndex].querySelector('.search-result-link');
            if (link) link.click();
          }
          break;
          
        case 'Escape':
          searchResults.innerHTML = '';
          this.hideSkeleton();
          currentIndex = -1;
          break;
      }
    };
    
    // Remove existing listener
    searchResults.removeEventListener('keydown', handleKeydown);
    // Add new listener
    searchResults.addEventListener('keydown', handleKeydown);
  }
  
  // Public method for telemetry
  logMissingTerm(term) {
    if (!window.logSearchTelemetry) return;
    
    window.logSearchTelemetry({
      type: 'missing_term',
      term: term,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      language: navigator.language
    });
  }
  
  // Get worker stats
  getStats() {
    this.postMessage({ type: 'GET_STATS' });
  }
  
  // Destroy
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }
}

// Global function for telemetry
window.logSearchTelemetry = function(data) {
  // Send to analytics without cookies
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    navigator.sendBeacon('/api/search-telemetry', blob);
  } else {
    fetch('/api/search-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true
    });
  }
};

// Auto-initialize when DOM is ready
(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.faangSearch = new FAANGSearch();
    });
  } else {
    window.faangSearch = new FAANGSearch();
  }
})();
