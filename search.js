// SINTOMARIO Search System
// Indice de busqueda cargado desde search-index.json
let searchIndex = [];
let currentLang = localStorage.getItem('sintomario-lang') || 'es';

// Cargar indice de busqueda
async function loadSearchIndex() {
    try {
        const response = await fetch('/search-index.json');
        searchIndex = await response.json();
        console.log('Indice cargado:', searchIndex.length, 'entradas');
    } catch (e) {
        console.error('Error cargando indice:', e);
    }
}

// Funcion de busqueda
function search(query) {
    if (!query || query.length < 2) return [];
    
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const results = [];
    
    for (const item of searchIndex) {
        const score = calculateScore(q, item);
        if (score > 0) {
            results.push({ ...item, score });
        }
    }
    
    // Ordenar por relevancia
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10); // Top 10 resultados
}

// Calcular score de relevancia
function calculateScore(query, item) {
    let score = 0;
    const terms = item.search_terms.join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Match exacto en titulo
    if (item.title.toLowerCase().includes(query)) score += 10;
    
    // Match en terminos de busqueda
    for (const term of item.search_terms) {
        const t = term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (t === query) score += 8;
        else if (t.startsWith(query)) score += 5;
        else if (t.includes(query)) score += 3;
    }
    
    return score;
}

// Mostrar resultados de busqueda
function showSearchResults(results) {
    let container = document.getElementById('search-results');
    if (!container) {
        container = document.createElement('div');
        container.id = 'search-results';
        container.style.cssText = 'position:fixed;top:calc(var(--bar-h) + var(--head-h));left:0;right:0;background:var(--deep);border-bottom:1px solid rgba(255,255,255,0.1);max-height:400px;overflow-y:auto;z-index:99;padding:16px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
        document.body.appendChild(container);
    }
    
    if (results.length === 0) {
        container.innerHTML = '<div style="color:var(--text-dim);text-align:center;padding:20px;">No se encontraron resultados</div>';
        return;
    }
    
    const langPrefix = currentLang === 'es' ? '' : '/' + currentLang;
    
    let html = '<div style="max-width:800px;margin:0 auto;">';
    html += '<div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.1em;">' + results.length + ' resultados</div>';
    
    for (const r of results) {
        const url = langPrefix + '/cuerpo/' + r.slug + '/index.html';
        html += '<a href="' + url + '" style="display:block;padding:12px 16px;margin:8px 0;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-left:3px solid rgba(140, 5, 72, 0.6);text-decoration:none;color:#fff;transition:all 0.2s;border-radius:2px;">';
        html += '<div style="font-family:EB Garamond,serif;font-size:16px;font-weight:500;margin-bottom:4px;">' + r.title + '</div>';
        html += '<div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em;">' + r.slug + '</div>';
        html += '</a>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Cerrar resultados
function closeSearchResults() {
    const container = document.getElementById('search-results');
    if (container) container.remove();
}

// Inicializar busqueda
function initSearch() {
    const searchInput = document.getElementById('q');
    if (!searchInput) return;
    
    // Cargar indice
    loadSearchIndex();
    
    // Eventos
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            const results = search(query);
            showSearchResults(results);
        } else {
            closeSearchResults();
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearchResults();
            searchInput.blur();
        }
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchbox') && !e.target.closest('#search-results')) {
            closeSearchResults();
        }
    });
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});
