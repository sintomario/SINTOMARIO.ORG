// SINTOMARIO.ORG - Unified Elements Loader
// Auto-injects header, footer, and counter functionality

(function() {
  // Inject unified CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/common.css';
  document.head.appendChild(cssLink);
  
  // Inject unified counter
  const counterScript = document.createElement('script');
  counterScript.src = '/assets/js/unified-counter.js';
  document.head.appendChild(counterScript);
  
  // Auto-detect and setup counter elements if they don't exist
  function setupCounterElements() {
    const footer = document.querySelector('footer') || document.querySelector('.site-footer');
    if (footer && !document.getElementById('visits')) {
      // Add counter elements to footer
      const counterDiv = document.createElement('div');
      counterDiv.innerHTML = '@2026 - <strong id="visits">0</strong> Visitas &bull; <strong id="online">0</strong> Online';
      counterDiv.style.cssText = 'margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.65);';
      footer.appendChild(counterDiv);
    }
  }
  
  // Setup when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCounterElements);
  } else {
    setupCounterElements();
  }
})();
