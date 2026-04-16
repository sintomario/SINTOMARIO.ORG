// SINTOMARIO.ORG - Affiliate Product Generator
// Replaces generic search links with real ASIN products

(function() {
  // Load product database
  let productsDB = null;
  
  // Load products from JSON
  async function loadProducts() {
    try {
      const response = await fetch('/assets/data/affiliate-products.json');
      productsDB = await response.json();
    } catch (error) {
      console.error('Error loading affiliate products:', error);
      productsDB = {};
    }
  }
  
  // Generate affiliate link with ASIN
  function generateAffiliateLink(asin) {
    const affiliateTag = 'sintomario-20'; // Replace with actual Amazon affiliate tag
    return `https://www.amazon.com/dp/${asin}/?tag=${affiliateTag}`;
  }
  
  // Get product by category and type
  function getProduct(category, type) {
    if (!productsDB || !productsDB[category] || !productsDB[category][type]) {
      return null;
    }
    return productsDB[category][type];
  }
  
  // Replace generic product links with real ASIN products
  function replaceProductLinks() {
    const productElements = document.querySelectorAll('.product');
    
    productElements.forEach(product => {
      const badge = product.querySelector('.badge');
      const title = product.querySelector('h3');
      const link = product.querySelector('a');
      
      if (!badge || !title || !link) return;
      
      const badgeText = badge.textContent.toLowerCase();
      const titleText = title.textContent.toLowerCase();
      
      // Determine category and type based on badge and title
      let category = null;
      let type = null;
      
      // Map badge text to category
      if (badgeText.includes('practica')) category = 'practica';
      else if (badgeText.includes('herramienta')) category = 'herramienta';
      else if (badgeText.includes('libro')) category = 'libro';
      else if (badgeText.includes('suplemento')) category = 'suplemento';
      else if (badgeText.includes('descanso')) category = 'descanso';
      else if (badgeText.includes('respiracion')) category = 'respiracion';
      
      // Map title text to type
      if (titleText.includes('journal')) type = 'journal';
      else if (titleText.includes('meditacion') || titleText.includes('meditation')) type = 'meditation';
      else if (titleText.includes('body') || titleText.includes('cuerpo')) type = 'body';
      else if (titleText.includes('breathing') || titleText.includes('respiracion')) type = 'breathing';
      else if (titleText.includes('acupres')) type = 'acupressure';
      else if (titleText.includes('somatic') || titleText.includes('somático')) type = 'somatic';
      else if (titleText.includes('emotion') || titleText.includes('emocion')) type = 'emotions';
      else if (titleText.includes('identidad') || titleText.includes('identity')) type = 'identity';
      else if (titleText.includes('magnesio') || titleText.includes('magnesium')) type = 'magnesium';
      else if (titleText.includes('probiotico') || titleText.includes('probiotic')) type = 'probiotic';
      else if (titleText.includes('ashwagandha')) type = 'ashwagandha';
      else if (titleText.includes('sleep') || titleText.includes('sueño')) type = 'sleep';
      else if (titleText.includes('aromatherapy') || titleText.includes('aromaterapia')) type = 'aromatherapy';
      else if (titleText.includes('eye') || titleText.includes('ojo')) type = 'eye';
      else if (titleText.includes('device') || titleText.includes('dispositivo')) type = 'device';
      else if (titleText.includes('guide') || titleText.includes('guía')) type = 'guide';
      else if (titleText.includes('app') || titleText.includes('aplicación')) type = 'app';
      
      // Fallback to default types if no match
      if (!type && category) {
        if (category === 'practica') type = 'journal';
        else if (category === 'herramienta') type = 'breathing';
        else if (category === 'libro') type = 'somatic';
        else if (category === 'suplemento') type = 'magnesium';
        else if (category === 'descanso') type = 'sleep';
        else if (category === 'respiracion') type = 'device';
      }
      
      // Get product from database
      const product = getProduct(category, type);
      
      if (product) {
        // Update product information
        title.textContent = product.title;
        link.href = generateAffiliateLink(product.asin);
        link.textContent = `Comprar en Amazon - ${product.price}`;
        
        // Add price if not already present
        const priceElement = product.querySelector('.price');
        if (!priceElement) {
          const priceSpan = document.createElement('span');
          priceSpan.className = 'price';
          priceSpan.textContent = product.price;
          priceSpan.style.display = 'block';
          priceSpan.style.color = '#F5C400';
          priceSpan.style.fontWeight = 'bold';
          priceSpan.style.marginTop = '4px';
          title.appendChild(priceSpan);
        }
        
        // Add image if available
        if (product.image) {
          const imageElement = product.querySelector('img');
          if (!imageElement) {
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            img.style.width = '100%';
            img.style.height = '150px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '4px';
            img.style.marginBottom = '8px';
            product.insertBefore(img, title);
          }
        }
        
        console.log(`Updated product: ${product.title} (${category}/${type})`);
      } else {
        console.log(`No product found for: ${category}/${type}`);
      }
    });
  }
  
  // Initialize when DOM is ready
  async function init() {
    await loadProducts();
    replaceProductLinks();
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
