// SINTOMARIO.ORG - FAANG-Level Search Web Worker
// Elimina jank en UI procesando búsqueda en hilo separado

// Spanish stemming rules (Porter Stemmer adaptation)
const stemmer = {
  // Spanish stop words
  stopWords: new Set([
    'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un',
    'con', 'para', 'como', 'las', 'una', 'unos', 'unos', 'mi', 'mis', 'tu', 'tus',
    'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'este', 'esta',
    'estos', 'estas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'al', 'lo', 'le',
    'da', 'das', 'dio', 'dieron', 'he', 'ha', 'han', 'había', 'habían', 'habremos',
    'habrá', 'habrán', 'habiendo', 'habido', 'habría', 'habrían', 'habe', 'habes',
    'hemos', 'habéis', 'han', 'has', 'habéis', 'hayan', 'habéis', 'había', 'habías',
    'habíamos', 'habíais', 'habían', 'habré', 'habrás', 'habremos', 'habréis',
    'habrán', 'habría', 'habrías', 'habríamos', 'habríais', 'habrían', 'habiendo',
    'habido', 'habida', 'habidos', 'habidas', 'habiendo', 'habed', 'habedora',
    'habedores', 'habedora', 'habedoras', 'habedores', 'habed', 'habed', 'habed',
    'habed', 'habed', 'habed', 'habed', 'habed', 'habed', 'habed', 'habed'
  ]),
  
  // Spanish suffix patterns
  suffixes: [
    { suffix: 'aciones', replacement: 'ar' },
    { suffix: 'imientos', replacement: 'ir' },
    { suffix: 'amientos', replacement: 'ar' },
    { suffix: 'imientos', replacement: 'ir' },
    { suffix: 'mientos', replacement: 'ir' },
    { suffix: 'ciones', replacement: 'ar' },
    { suffix: 'adores', replacement: 'ar' },
    { suffix: 'edoras', replacement: 'ar' },
    { suffix: 'antes', replacement: 'ar' },
    { suffix: 'mente', replacement: 'ar' },
    { suffix: 'idad', replacement: 'ar' },
    { suffix: 'idades', replacement: 'ar' },
    { suffix: 'ivo', replacement: 'ar' },
    { suffix: 'iva', replacement: 'ar' },
    { suffix: 'ivos', replacement: 'ar' },
    { suffix: 'ivas', replacement: 'ar' },
    { suffix: 'ación', replacement: 'ar' },
    { suffix: 'iendo', replacement: 'ir' },
    { suffix: 'iendo', replacement: 'ir' },
    { suffix: 'ando', replacement: 'ar' },
    { suffix: 'ando', replacement: 'ar' },
    { suffix: 'ar', replacement: 'ar' },
    { suffix: 'er', replacement: 'er' },
    { suffix: 'ir', replacement: 'ir' },
    { suffix: 'os', replacement: 'o' },
    { suffix: 'as', replacement: 'a' },
    { suffix: 'es', replacement: 'e' }
  ],
  
  stem: function(word) {
    if (word.length < 3) return word;
    word = word.toLowerCase();
    
    // Remove accents
    word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Check stop words
    if (this.stopWords.has(word)) return '';
    
    // Apply stemming rules
    for (const rule of this.suffixes) {
      if (word.endsWith(rule.suffix)) {
        return word.slice(0, -rule.suffix.length) + rule.replacement;
      }
    }
    
    return word;
  }
};

let searchData = null;
let entitiesIndex = null;
let contextsIndex = null;
let nodesIndex = null;

// Build optimized index in worker
function buildIndex() {
  entitiesIndex = new Map();
  contextsIndex = new Map();
  nodesIndex = new Map();
  
  // Build entity index with stemmed terms
  Object.entries(searchData.entities).forEach(([entityId, terms]) => {
    terms.forEach(term => {
      const stemmed = stemmer.stem(term);
      if (stemmed) {
        const termLower = stemmed.toLowerCase();
        if (!entitiesIndex.has(termLower)) {
          entitiesIndex.set(termLower, []);
        }
        entitiesIndex.get(termLower).push({
          id: entityId,
          type: 'entity',
          original: term,
          stemmed: stemmed
        });
      }
    });
  });
  
  // Build context index with stemmed terms
  Object.entries(searchData.contexts).forEach(([contextId, terms]) => {
    terms.forEach(term => {
      const stemmed = stemmer.stem(term);
      if (stemmed) {
        const termLower = stemmed.toLowerCase();
        if (!contextsIndex.has(termLower)) {
          contextsIndex.set(termLower, []);
        }
        contextsIndex.get(termLower).push({
          id: contextId,
          type: 'context',
          original: term,
          stemmed: stemmed
        });
      }
    });
  });
  
  // Build node index for O(1) lookup
  searchData.nodes.forEach(node => {
    nodesIndex.set(node.s, node);
  });
  
  console.log('Worker: FAANG-level index built', {
    entities: entitiesIndex.size,
    contexts: contextsIndex.size,
    nodes: nodesIndex.size
  });
}

// Ultra-optimized search with stemming
function performSearch(query) {
  if (!searchData || !entitiesIndex || !contextsIndex) return [];
  
  const queryLower = query.toLowerCase().trim();
  const tokens = queryLower
    .split(/\s+/)
    .map(token => stemmer.stem(token))
    .filter(token => token.length > 1); // Filter out empty tokens
  
  const results = [];
  const seen = new Set();
  
  // Exact stemmed matches (highest score)
  tokens.forEach(token => {
    const entityMatches = entitiesIndex.get(token) || [];
    const contextMatches = contextsIndex.get(token) || [];
    
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
              context_name: searchData.contexts[node.c][0],
              stemmed: true
            });
          }
        });
    });
    
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
              context_name: searchData.contexts[node.c][0],
              stemmed: true
            });
          }
        });
    });
  });
  
  // Sort by score and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

// Generate title dynamically
function generateTitle(entityId, contextId) {
  const entityTerms = searchData.entities[entityId];
  const contextTerms = searchData.contexts[contextId];
  const entityName = entityTerms ? entityTerms[0] : entityId;
  const contextName = contextTerms ? contextTerms[0] : contextId;
  return `${entityName} y ${contextName}`;
}

// Worker message handler
self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'LOAD_DATA':
      try {
        const response = await fetch(data.url);
        searchData = await response.json();
        buildIndex();
        self.postMessage({ type: 'DATA_LOADED', success: true });
      } catch (error) {
        self.postMessage({ type: 'DATA_LOADED', success: false, error: error.message });
      }
      break;
      
    case 'SEARCH':
      const results = performSearch(data.query);
      self.postMessage({ 
        type: 'SEARCH_RESULTS', 
        results: results,
        query: data.query,
        timestamp: Date.now()
      });
      break;
      
    case 'GET_STATS':
      self.postMessage({
        type: 'STATS',
        stats: {
          entities: entitiesIndex ? entitiesIndex.size : 0,
          contexts: contextsIndex ? contextsIndex.size : 0,
          nodes: nodesIndex ? nodesIndex.size : 0,
          loaded: !!searchData
        }
      });
      break;
      
    default:
      console.warn('Worker: Unknown message type', type);
  }
};
