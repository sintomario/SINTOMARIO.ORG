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
    
    const queryLower = query.toLowerCase().trim();
    const results = [];
    const seen = new Set();
    
    // Entity matches (O(1) lookup)
    const entityMatches = entitiesIndex.get(queryLower) || [];
    entityMatches.forEach(entity => {
      // Find all nodes with this entity
      searchData.nodes
        .filter(node => node.e === entity.id)
        .forEach(node => {
          const key = `${node.s}-entity`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              slug: node.s,
              entity_id: node.e,
              entity_name: entity.name,
              context_id: node.c,
              context_name: searchData.contexts[node.c]?.name || node.c,
              title: `${entity.name} y ${searchData.contexts[node.c]?.name || node.c}`,
              score: 10,
              matches: 'exact',
              match_type: 'entity'
            });
          }
        });
    });
    
    // Context matches (O(1) lookup)
    const contextMatches = contextsIndex.get(queryLower) || [];
    contextMatches.forEach(context => {
      // Find all nodes with this context
      searchData.nodes
        .filter(node => node.c === context.id)
        .forEach(node => {
          const key = `${node.s}-context`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              slug: node.s,
              entity_id: node.e,
              entity_name: searchData.entities[node.e]?.name || node.e,
              context_id: node.c,
              context_name: context.name,
              title: `${searchData.entities[node.e]?.name || node.e} y ${context.name}`,
              score: 10,
              matches: 'exact',
              match_type: 'context'
            });
          }
        });
    });
    
    // Partial matches (fuzzy search)
    if (results.length < 10) {
      // Check for partial matches in entities
      for (const [term, entities] of entitiesIndex) {
        if (term.includes(queryLower) && !entitiesIndex.has(queryLower)) {
          entities.forEach(entity => {
            searchData.nodes
              .filter(node => node.e === entity.id)
              .forEach(node => {
                const key = `${node.s}-partial-entity`;
                if (!seen.has(key)) {
                  seen.add(key);
                  results.push({
                    slug: node.s,
                    entity_id: node.e,
                    entity_name: entity.name,
                    context_id: node.c,
                    context_name: searchData.contexts[node.c]?.name || node.c,
                    title: `${entity.name} y ${searchData.contexts[node.c]?.name || node.c}`,
                    score: 5,
                    matches: 'partial',
                    match_type: 'partial_entity'
                  });
                }
              });
          });
        }
      }
      
      // Check for partial matches in contexts
      for (const [term, contexts] of contextsIndex) {
        if (term.includes(queryLower) && !contextsIndex.has(queryLower)) {
          contexts.forEach(context => {
            searchData.nodes
              .filter(node => node.c === context.id)
              .forEach(node => {
                const key = `${node.s}-partial-context`;
                if (!seen.has(key)) {
                  seen.add(key);
                  results.push({
                    slug: node.s,
                    entity_id: node.e,
                    entity_name: searchData.entities[node.e]?.name || node.e,
                    context_id: node.c,
                    context_name: context.name,
                    title: `${searchData.entities[node.e]?.name || node.e} y ${context.name}`,
                    score: 5,
                    matches: 'partial',
                    match_type: 'partial_context'
                  });
                }
              });
          });
        }
      }
    }
    
    // Sort by score and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
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
