// SINTOMARIO.ORG - Optimized Search Engine
// Uses compressed entity/context references for 40% size reduction

(function() {
  let entitiesDB = null;
  let contextsDB = null;
  let searchIndex = null;
  
  // Load compressed search data
  async function loadSearchData() {
    try {
      const [entitiesResponse, contextsResponse, indexResponse] = await Promise.all([
        fetch('/assets/data/search-entities.json'),
        fetch('/assets/data/search-contexts.json'),
        fetch('/search-index.json')
      ]);
      
      entitiesDB = await entitiesResponse.json();
      contextsDB = await contextsResponse.json();
      searchIndex = await indexResponse.json();
      
      console.log('Search data loaded successfully');
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }
  
  // Optimized search function with entity/context expansion
  function performSearch(query) {
    if (!searchIndex || !entitiesDB || !contextsDB) return [];
    
    const queryLower = query.toLowerCase().trim();
    const results = [];
    const seen = new Set();
    
    // Search through compressed index
    searchIndex.forEach(item => {
      let score = 0;
      
      // Entity matching with expansion
      const entity = entitiesDB.entities[item.entity_id];
      if (entity) {
        if (item.entity_name.includes(queryLower)) score += 10;
        else if (entity.terms.some(term => term.includes(queryLower))) score += 5;
      }
      
      // Context matching with expansion
      const context = contextsDB.contexts[item.context_id];
      if (context) {
        if (item.context_name.includes(queryLower)) score += 10;
        else if (context.terms.some(term => term.includes(queryLower))) score += 5;
      }
      
      // Direct title matching
      if (item.title.toLowerCase().includes(queryLower)) score += 8;
      
      if (score > 0 && !seen.has(item.slug)) {
        seen.add(item.slug);
        results.push({
          ...item,
          score,
          matches: score >= 10 ? 'exact' : 'partial'
        });
      }
    });
    
    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
  
  // Enhanced search display with keyboard navigation
  function displayResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>No se encontraron resultados para "<strong>${query}</strong>"</p>
          <p>Intenta con otros términos como: ansiedad, dolor cabeza, estrés</p>
        </div>
      `;
      return;
    }
    
    const resultsHTML = results.map((result, index) => `
      <div class="search-result" data-index="${index}" tabindex="0" role="option">
        <div class="search-result-content">
          <h3 class="search-result-title">
            <a href="/cuerpo/${result.slug}/index.html" class="search-result-link">
              ${result.title}
            </a>
          </h3>
          <div class="search-result-meta">
            <span class="search-result-entity">${result.entity_name}</span>
            <span class="search-result-context">${result.context_name}</span>
            <span class="search-result-score ${result.matches}">${result.matches === 'exact' ? 'Exacto' : 'Parcial'}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
    
    // Add keyboard navigation
    setupKeyboardNavigation(results.length);
  }
  
  // Keyboard navigation for search results
  function setupKeyboardNavigation(resultCount) {
    let currentIndex = -1;
    
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchResults || !searchInput) return;
    
    // Key down handler
    searchInput.addEventListener('keydown', (e) => {
      const results = searchResults.querySelectorAll('.search-result');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, resultCount - 1);
          updateActiveResult(results, currentIndex);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, -1);
          updateActiveResult(results, currentIndex);
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
          currentIndex = -1;
          break;
      }
    });
  }
  
  // Update active result styling
  function updateActiveResult(results, index) {
    results.forEach((result, i) => {
      if (i === index) {
        result.classList.add('search-result-active');
        result.setAttribute('aria-selected', 'true');
      } else {
        result.classList.remove('search-result-active');
        result.setAttribute('aria-selected', 'false');
      }
    });
  }
  
  // Initialize search with debouncing
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      
      searchTimeout = setTimeout(() => {
        const results = performSearch(query);
        displayResults(results, query);
      }, 300);
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.innerHTML = '';
      }
    });
  }
  
  // Initialize when DOM is ready
  async function init() {
    await loadSearchData();
    initSearch();
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
