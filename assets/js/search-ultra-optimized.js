// SINTOMARIO.ORG - Ultra-Optimized Search Engine
// World-Class performance with ultra-normalized data structure

(function() {
  let searchData = null;
  let entitiesIndex = null;
  let contextsIndex = null;
  let nodesIndex = null;
  
  // Build ultra-optimized inverted index
  function buildUltraOptimizedIndex() {
    entitiesIndex = new Map();
    contextsIndex = new Map();
    nodesIndex = new Map();
    
    // Build entity index with term frequency
    Object.entries(searchData.entities).forEach(([entityId, terms]) => {
      terms.forEach(term => {
        const termLower = term.toLowerCase();
        if (!entitiesIndex.has(termLower)) {
          entitiesIndex.set(termLower, []);
        }
        entitiesIndex.get(termLower).push({
          id: entityId,
          type: 'entity',
          frequency: 1 // Could be enhanced with actual frequency
        });
      });
    });
    
    // Build context index with term frequency
    Object.entries(searchData.contexts).forEach(([contextId, terms]) => {
      terms.forEach(term => {
        const termLower = term.toLowerCase();
        if (!contextsIndex.has(termLower)) {
          contextsIndex.set(termLower, []);
        }
        contextsIndex.get(termLower).push({
          id: contextId,
          type: 'context',
          frequency: 1
        });
      });
    });
    
    // Build node index for O(1) lookup
    searchData.nodes.forEach(node => {
      nodesIndex.set(node.s, node);
    });
    
    console.log('Ultra-optimized index built:', {
      entities: entitiesIndex.size,
      contexts: contextsIndex.size,
      nodes: nodesIndex.size
    });
  }
  
  // Load ultra-normalized search data
  async function loadUltraOptimizedData() {
    try {
      const response = await fetch('/search-index-ultra-normalized.json');
      searchData = await response.json();
      buildUltraOptimizedIndex();
      console.log('Ultra-optimized search data loaded successfully');
    } catch (error) {
      console.error('Error loading ultra-optimized data:', error);
      // Fallback to normalized search
      window.location.href = '/assets/js/search-normalized.js';
    }
  }
  
  // Generate title dynamically to save bytes
  function generateTitle(entityId, contextId) {
    const entityTerms = searchData.entities[entityId];
    const contextTerms = searchData.contexts[contextId];
    const entityName = entityTerms ? entityTerms[0] : entityId;
    const contextName = contextTerms ? contextTerms[0] : contextId;
    return `${entityName} y ${contextName}`;
  }
  
  // Ultra-optimized search with advanced scoring
  function performUltraOptimizedSearch(query) {
    if (!searchData || !entitiesIndex || !contextsIndex) return [];
    
    const queryLower = query.toLowerCase().trim();
    const results = [];
    const seen = new Set();
    
    // Exact entity matches (highest score)
    const entityMatches = entitiesIndex.get(queryLower) || [];
    entityMatches.forEach(entity => {
      searchData.nodes
        .filter(node => node.e === entity.id)
        .forEach(node => {
          const key = `${node.s}-entity-exact`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              slug: node.s,
              entity_id: node.e,
              context_id: node.c,
              title: generateTitle(node.e, node.c),
              score: 100,
              matches: 'exact',
              match_type: 'entity_exact',
              entity_name: searchData.entities[node.e][0],
              context_name: searchData.contexts[node.c][0]
            });
          }
        });
    });
    
    // Exact context matches (highest score)
    const contextMatches = contextsIndex.get(queryLower) || [];
    contextMatches.forEach(context => {
      searchData.nodes
        .filter(node => node.c === context.id)
        .forEach(node => {
          const key = `${node.s}-context-exact`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              slug: node.s,
              entity_id: node.e,
              context_id: node.c,
              title: generateTitle(node.e, node.c),
              score: 100,
              matches: 'exact',
              match_type: 'context_exact',
              entity_name: searchData.entities[node.e][0],
              context_name: searchData.contexts[node.c][0]
            });
          }
        });
    });
    
    // Partial matches with fuzzy scoring
    if (results.length < 10) {
      // Entity partial matches
      for (const [term, entities] of entitiesIndex) {
        if (term.includes(queryLower) && term !== queryLower) {
          entities.forEach(entity => {
            searchData.nodes
              .filter(node => node.e === entity.id)
              .forEach(node => {
                const key = `${node.s}-entity-partial`;
                if (!seen.has(key)) {
                  seen.add(key);
                  const similarity = calculateSimilarity(queryLower, term);
                  results.push({
                    slug: node.s,
                    entity_id: node.e,
                    context_id: node.c,
                    title: generateTitle(node.e, node.c),
                    score: Math.round(similarity * 50),
                    matches: 'partial',
                    match_type: 'entity_partial',
                    entity_name: searchData.entities[node.e][0],
                    context_name: searchData.contexts[node.c][0]
                  });
                }
              });
          });
        }
      }
      
      // Context partial matches
      for (const [term, contexts] of contextsIndex) {
        if (term.includes(queryLower) && term !== queryLower) {
          contexts.forEach(context => {
            searchData.nodes
              .filter(node => node.c === context.id)
              .forEach(node => {
                const key = `${node.s}-context-partial`;
                if (!seen.has(key)) {
                  seen.add(key);
                  const similarity = calculateSimilarity(queryLower, term);
                  results.push({
                    slug: node.s,
                    entity_id: node.e,
                    context_id: node.c,
                    title: generateTitle(node.e, node.c),
                    score: Math.round(similarity * 50),
                    matches: 'partial',
                    match_type: 'context_partial',
                    entity_name: searchData.entities[node.e][0],
                    context_name: searchData.contexts[node.c][0]
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
  
  // Calculate similarity between two strings
  function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  // Calculate Levenshtein distance
  function levenshteinDistance(str1, str2) {
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
  
  // Enhanced search display with match indicators
  function displayUltraOptimizedResults(results, query) {
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
      const scoreClass = result.score >= 100 ? 'score-exact' : 
                       result.score >= 50 ? 'score-high' : 'score-medium';
      
      const matchTypeIcon = {
        'entity_exact': '🎯',
        'context_exact': '🎯',
        'entity_partial': '🔍',
        'context_partial': '🔍'
      };
      
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
              <span class="search-result-type">${matchTypeIcon[result.match_type]}</span>
              <span class="search-result-score ${scoreClass}">${result.score}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
    
    // Add keyboard navigation
    setupUltraOptimizedKeyboardNavigation(results.length);
  }
  
  // Ultra-optimized keyboard navigation
  function setupUltraOptimizedKeyboardNavigation(resultCount) {
    let currentIndex = -1;
    
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchResults || !searchInput) return;
    
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
  
  // Initialize ultra-optimized search with debouncing
  function initUltraOptimizedSearch() {
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
        const results = performUltraOptimizedSearch(query);
        displayUltraOptimizedResults(results, query);
      }, 200); // Faster response for ultra-optimized
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
    await loadUltraOptimizedData();
    initUltraOptimizedSearch();
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
