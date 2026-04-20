// SINTOMARIO.ORG - Web Components System
// Centralizes header, footer, and disclaimer for consistency

class SintomarioHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .site-header {
          background: var(--deep, #1a010c);
          padding: 1rem 0;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.15));
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--light, #8c0548);
          text-decoration: none;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-links a {
          color: var(--text-dim, rgba(255,255,255,0.65));
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
          color: var(--light, #8c0548);
        }
        
        .language-selector {
          background: var(--mid, #670433);
          border: 1px solid var(--border, rgba(255,255,255,0.15));
          color: var(--text-dim, rgba(255,255,255,0.65));
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-links {
            gap: 1rem;
            font-size: 0.9rem;
          }
        }
      </style>
      
      <header class="site-header">
        <div class="header-content">
          <a href="/" class="logo">SINTOMARIO.ORG</a>
          <nav>
            <ul class="nav-links">
              <li><a href="/sobre/">Sobre</a></li>
              <li><a href="/cuerpo/">Atlas</a></li>
              <li><a href="/faq/">FAQ</a></li>
            </ul>
          </nav>
          <select class="language-selector" id="languageSelector">
            <option value="es">ES</option>
            <option value="en">EN</option>
            <option value="pt">PT</option>
          </select>
        </div>
      </header>
    `;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const langSelector = this.shadowRoot.getElementById('languageSelector');
    if (langSelector) {
      langSelector.addEventListener('change', (e) => {
        const lang = e.target.value;
        let currentPath = window.location.pathname;
        
        // Sanitizar y normalizar ruta actual
        currentPath = currentPath.replace(/^\/+/, '/'); // Eliminar slashes múltiples
        currentPath = currentPath.replace(/\/+$/, ''); // Eliminar slash final
        
        // Eliminar prefijo de idioma existente si existe
        currentPath = currentPath.replace(/^\/(en|pt)(\/|$)/, '/');
        if (!currentPath.startsWith('/')) {
          currentPath = '/' + currentPath;
        }
        
        // Validar idioma
        const validLangs = ['es', 'en', 'pt'];
        if (!validLangs.includes(lang)) {
          console.warn('Idioma no válido:', lang);
          return;
        }
        
        // Construir nueva ruta
        const newPath = lang === 'es' ? currentPath : `/${lang}${currentPath}`;
        
        // Evitar bucle infinito
        if (newPath === window.location.pathname) {
          console.log('Misma ruta detectada, evitando bucle');
          return;
        }
        
        window.location.href = newPath;
      });
    }
  }
}

class SintomarioFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .site-footer {
          background: var(--deep, #1a010c);
          padding: 2rem 0 1rem;
          border-top: 1px solid var(--border, rgba(255,255,255,0.15));
          margin-top: 3rem;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .footer-section h4 {
          color: var(--light, #8c0548);
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-section li {
          margin-bottom: 0.5rem;
        }
        
        .footer-section a {
          color: var(--text-dim, rgba(255,255,255,0.65));
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-section a:hover {
          color: var(--light, #8c0548);
        }
        
        .footer-bottom {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border, rgba(255,255,255,0.15));
          color: var(--text-dim, rgba(255,255,255,0.65));
        }
        
        .counter-display {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        
        .counter-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .counter-item strong {
          color: var(--light, #8c0548);
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .counter-display {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      </style>
      
      <footer class="site-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Explorar</h4>
            <ul>
              <li><a href="/cuerpo/">Atlas Corporal</a></li>
              <li><a href="/cuerpo/sistema/nervioso/">Sistema Nervioso</a></li>
              <li><a href="/cuerpo/sistema/oseo/">Sistema Óseo</a></li>
              <li><a href="/cuerpo/sistema/circulatorio/">Sistema Circulatorio</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Institucional</h4>
            <ul>
              <li><a href="/sobre/">Sobre SINTOMARIO</a></li>
              <li><a href="/faq/">Preguntas Frecuentes</a></li>
              <li><a href="/contacto/">Contacto</a></li>
              <li><a href="/donaciones/">Donaciones</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Contador Global</h4>
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
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 SINTOMARIO.ORG. Todos los derechos reservados.</p>
        </div>
      </footer>
    `;
  }
}

class SintomarioDisclaimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Pre-render styles to avoid FOUC
    const style = document.createElement('style');
    style.textContent = `:host { display: block; height: 64px; background: #1a010c; }`;
    this.shadowRoot.appendChild(style);
  }
  
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .disclaimer-bar {
          background: var(--mid, #670433);
          color: var(--text-dim, rgba(255,255,255,0.65));
          padding: 0.75rem 0;
          text-align: center;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.15));
        }
        
        .disclaimer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .disclaimer-icon {
          margin-right: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .disclaimer-content {
            font-size: 0.8rem;
          }
        }
      </style>
      
      <div class="disclaimer-bar">
        <div class="disclaimer-content">
          <span class="disclaimer-icon">⚠️</span>
          <span>Contenido informativo y reflexivo. No reemplaza la consulta médica profesional.</span>
        </div>
      </div>
    `;
  }
}

// Register custom elements
customElements.define('sintomario-header', SintomarioHeader);
customElements.define('sintomario-footer', SintomarioFooter);
customElements.define('sintomario-disclaimer', SintomarioDisclaimer);
