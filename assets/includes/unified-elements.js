// SINTOMARIO.ORG - Unified Elements System (Optimized)
// Automatically loads common CSS, counter, affiliate, FAQ, and optimized search systems

(function() {
  // Load common CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/common.css';
  document.head.appendChild(cssLink);
  
  // Load optimized search engine
  const searchScript = document.createElement('script');
  searchScript.src = '/assets/js/search-normalized.js';
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
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureCounterElements);
  } else {
    ensureCounterElements();
  }
})();
