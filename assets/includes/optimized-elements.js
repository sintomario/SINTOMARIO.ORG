// SINTOMARIO.ORG - Optimized Elements System
// Replaces unified-elements.js with performance optimizations

(function() {
  // Load optimized CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = '/assets/css/common.css';
  document.head.appendChild(cssLink);
  
  // Load web components for centralized header/footer
  const webComponentsScript = document.createElement('script');
  webComponentsScript.src = '/assets/js/web-components.js';
  document.head.appendChild(webComponentsScript);
  
  // Load optimized search engine
  const searchScript = document.createElement('script');
  searchScript.src = '/assets/js/search-optimized.js';
  document.head.appendChild(searchScript);
  
  // Load unified counter
  const counterScript = document.createElement('script');
  counterScript.src = '/assets/js/unified-counter.js';
  document.head.appendChild(counterScript);
  
  // Load affiliate generator
  const affiliateScript = document.createElement('script');
  affiliateScript.src = '/assets/js/affiliate-generator.js';
  document.head.appendChild(affiliateScript);
  
  // Load FAQ replacer with caching
  const faqScript = document.createElement('script');
  faqScript.src = '/assets/js/faq-replacer.js';
  document.head.appendChild(faqScript);
  
  // Performance monitoring
  function trackPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime, 'ms');
              }
              if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime, 'ms');
              }
            });
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        }
      });
    }
  }
  
  // Initialize performance tracking
  trackPerformance();
  
  // Service Worker registration for offline support
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }
  
  // Initialize service worker
  registerServiceWorker();
})();
