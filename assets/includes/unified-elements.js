// SINTOMARIO.ORG - World-Class Unified Elements System
// Automatically loads ultra-optimized components with automated synchronization

(function() {
  // Load common CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/common.css';
  document.head.appendChild(cssLink);
  
  // Load ultra-optimized search engine
  const searchScript = document.createElement('script');
  searchScript.src = '/assets/js/search-ultra-optimized.js';
  document.head.appendChild(searchScript);
  
  // Load unified counter
  const counterScript = document.createElement('script');
  counterScript.src = '/assets/js/unified-counter.js';
  document.head.appendChild(counterScript);
  
  // Load affiliate generator
  const affiliateScript = document.createElement('script');
  affiliateScript.src = '/assets/js/affiliate-generator.js';
  document.head.appendChild(affiliateScript);
  
  // Load FAQ replacer with expanded responses
  const faqScript = document.createElement('script');
  faqScript.src = '/assets/js/faq-replacer.js';
  document.head.appendChild(faqScript);
  
  // Load dynamic clicker system
  const clickerScript = document.createElement('script');
  clickerScript.src = '/assets/js/clicker-dynamic.js';
  document.head.appendChild(clickerScript);
  
  // Load automated data synchronization (production)
  const syncScript = document.createElement('script');
  syncScript.src = '/assets/js/data-sync-automated.js';
  document.head.appendChild(syncScript);
  
  // Load data validator (development only)
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.search.includes('validate=true')) {
    const validatorScript = document.createElement('script');
    validatorScript.src = '/assets/js/data-validator.js';
    document.head.appendChild(validatorScript);
  }
  
  // Auto-inject counter elements if missing
  function ensureCounterElements() {
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('#visits')) {
      const counterHTML = `
        <div class="counter-display">
          <div class="counter-item">
            <strong id="visits">0</strong>
            <span>Visitas Totales</span>
          </div>
          <div class="counter-item">
            <strong id="online">0</strong>
            <span>Usuarios Online</span>
          </div>
        </div>
        <h4>Contador Global</h4>
        <ul>
          <li><strong id="visits">0</strong> Visitas Totales</li>
          <li><strong id="online">0</strong> Usuarios Online</li>
        </ul>
      `;
      footer.insertAdjacentHTML('beforeend', counterHTML);
    }
  }
  
  // Update FAQ replacer to use expanded responses
  function updateFAQReplacer() {
    if (window.faqReplacer && window.faqReplacer.updateDataSource) {
      window.faqReplacer.updateDataSource('/assets/data/faq-responses-expanded.json');
    }
  }
  
  // Initialize world-class components
  function initializeWorldClassComponents() {
    console.log('🚀 Initializing World-Class Components...');
    
    // Add FOUC prevention styles
    const foucStyles = document.createElement('style');
    foucStyles.textContent = `
      sintomario-header, sintomario-footer, sintomario-disclaimer {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      
      sintomario-header.loaded, 
      sintomario-footer.loaded, 
      sintomario-disclaimer.loaded {
        opacity: 1;
      }
    `;
    document.head.appendChild(foucStyles);
    
    // Mark components as loaded when ready
    setTimeout(() => {
      document.querySelectorAll('sintomario-header, sintomario-footer, sintomario-disclaimer')
        .forEach(el => el.classList.add('loaded'));
    }, 100);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureCounterElements();
      initializeWorldClassComponents();
      setTimeout(updateFAQReplacer, 1000);
    });
  } else {
    ensureCounterElements();
    initializeWorldClassComponents();
    setTimeout(updateFAQReplacer, 1000);
  }
})();
