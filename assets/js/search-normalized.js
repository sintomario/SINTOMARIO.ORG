// SINTOMARIO.ORG - Normalized Search Engine
// Optimized for 60% size reduction and O(1) lookup performance

(function() {
  let searchData = null;
  let entitiesIndex = null;
  let contextsIndex = null;
  let nodesIndex = null;
  
  // Build inverted index for O(1) term lookup
  function buildInvertedIndex() {
    entitiesIndex = new Map();
    contextsIndex = new Map();
    nodesIndex = new Map();
    
    // Build entity index
    Object.entries(searchData.entities).forEach(([entityId, entity]) => {
      entity.terms.forEach(term => {
        const termLower = term.toLowerCase();
        if (!entitiesIndex.has(termLower)) {
          entitiesIndex.set(termLower, []);
        }
        entitiesIndex.get(termLower).push({
          id: entityId,
          name: entity.name,
          type: 'entity'
        });
      });
    });
    
    // Build context index
    Object.entries(searchData.contexts).forEach(([contextId, context]) => {
      context.terms.forEach(term => {
        const termLower = term.toLowerCase();
        if (!contextsIndex.has(termLower)) {
          contextsIndex.set(termLower, []);
        }
        contextsIndex.get(termLower).push({
          id: contextId,
          name: context.name,
          type: 'context'
        });
      });
    });
    
    // Build node index for quick lookup
    searchData.nodes.forEach(node => {
      nodesIndex.set(node.s, node);
    });
    
    console.log('Inverted index built:', {
      entities: entitiesIndex.size,
      contexts: contextsIndex.size,
      nodes: nodesIndex.size
    });
  }
  
  // Load normalized search data
  async function loadSearchData() {
    try {
      const response = await fetch('/search-index-normalized.json');
      searchData = await response.json();
      buildInvertedIndex();
      console.log('Normalized search data loaded successfully');
    } catch (error) {
      console.error('Error loading normalized search data:', error);
      // Fallback to original search
      window.location.href = '/search.js';
    }
  }
  
  // Optimized search with O(1) lookup
  function performOptimizedSearch(query) {
    if (!searchData || !entitiesIndex || !contextsIndex) return [];
    
    const tokens = query.toLowerCase().trim().split(/\s+/);
    const scores = new Map(); // slug -> score

    tokens.forEach(token => {
      // 1. Matches exactos en Entidades (O(1))
      (entitiesIndex.get(token) || []).forEach(match => {
        searchData.nodes.filter(n => n.e === match.id).forEach(n => {
          scores.set(n.s, (scores.get(n.s) || 0) + 15);
        });
      });

      // 2. Matches exactos en Contextos (O(1))
      (contextsIndex.get(token) || []).forEach(match => {
        searchData.nodes.filter(n => n.c === match.id).forEach(n => {
          scores.set(n.s, (scores.get(n.s) || 0) + 15);
        });
      });

      // 3. Búsqueda difusa (Fuzzy) si no hay suficientes resultados o para mayor cobertura
      for (const [term, entities] of entitiesIndex) {
        if (term.includes(token) && term !== token) {
          entities.forEach(e => searchData.nodes.filter(n => n.e === e.id).forEach(n => {
            scores.set(n.s, (scores.get(n.s) || 0) + 5);
          }));
        }
      }
    });
    
    return Array.from(scores.entries())
      .map(([slug, score]) => {
        const node = nodesIndex.get(slug);
        // Determinar tipo de match predominante para la UI
        const matchType = tokens.some(t => searchData.entities[node.e].terms.includes(t)) ? 'entity' : 'context';
        const matchTypePartial = tokens.some(t => searchData.entities[node.e].terms.some(term => term.includes(t))) ? 'partial_entity' : 'partial_context';
        
        const entityName = searchData.entities[node.e].name;
        const contextName = searchData.contexts[node.c].name;
        return {
          slug: node.s,
          title: `${entityName} y ${contextName}`,
          entity_name: entityName,
          context_name: contextName,
          score: score,
          match_type: matchType,
          matches: score >= 15 ? 'exact' : 'partial'
        };
      })
      .sort((a, b) => b.score - a.score).slice(0, 15);
  }
  
  // Enhanced search display with match type indicators
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
    
    const resultsHTML = results.map((result, index) => {
      const matchTypeIcon = {
        'entity': ' anatomía',
        'context': ' emoción',
        'partial_entity': ' anatomía',
        'partial_context': ' emoción'
      };
      
      const matchTypeClass = result.match_type === 'entity' ? 'match-entity' : 'match-context';
      
      return `
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
              <span class="search-result-type ${matchTypeClass}">${matchTypeIcon[result.match_type]}</span>
              <span class="search-result-score ${result.matches}">${result.matches === 'exact' ? 'Exacto' : 'Parcial'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
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
        const results = performOptimizedSearch(query);
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
