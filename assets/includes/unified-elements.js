// SINTOMARIO.ORG - Unified Elements System
// Automatically loads common CSS, counter, affiliate system, and ensures consistent UI

(function() {
  // Load unified CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/common.css';
  document.head.appendChild(cssLink);
  
  // Load unified counter
  const counterScript = document.createElement('script');
  counterScript.src = '/assets/js/unified-counter.js';
  document.head.appendChild(counterScript);
  
  // Load affiliate generator
  const affiliateScript = document.createElement('script');
  affiliateScript.src = '/assets/js/affiliate-generator.js';
  document.head.appendChild(affiliateScript);
  
  // Load FAQ replacer
  const faqScript = document.createElement('script');
  faqScript.src = '/assets/js/faq-replacer.js';
  document.head.appendChild(faqScript);
  
  // Ensure footer counter elements exist
  function ensureCounterElements() {
    const footer = document.querySelector('.site-footer, footer');
    if (!footer) return;
    
    // Find or create counter section
    let counterSection = footer.querySelector('.footer-section:has(#visits)');
    if (!counterSection) {
      // Find the last footer section or create a new one
      const sections = footer.querySelectorAll('.footer-section');
      const lastSection = sections[sections.length - 1];
      
      if (lastSection) {
        counterSection = lastSection;
      } else {
        counterSection = document.createElement('div');
        counterSection.className = 'footer-section';
        footer.querySelector('.footer-content, footer').appendChild(counterSection);
      }
      
      // Add counter title and elements
      counterSection.innerHTML = `
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
