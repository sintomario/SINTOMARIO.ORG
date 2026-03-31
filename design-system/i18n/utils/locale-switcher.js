/**
 * Atlas Somático Editorial - Locale Switcher
 * Interactive language switching with persistence and animations
 */

class LocaleSwitcher {
  constructor(config = {}) {
    this.config = {
      supportedLocales: ['es-ES', 'en-US', 'en-GB', 'pt-BR', 'pt-PT'],
      defaultLocale: 'es-ES',
      fallbackLocale: 'en-US',
      switchAnimation: true,
      animationDuration: 300,
      storageKey: 'atlas-locale',
      cookieName: 'atlas-locale',
      urlParam: 'lang',
      autoDetect: true,
      showNativeNames: true,
      showFlags: true,
      position: 'top-right', // top-right, top-left, bottom-right, bottom-left
      ...config
    };
    
    this.currentLocale = null;
    this.switcherElement = null;
    this.isOpen = false;
    this.observers = [];
    
    this.init();
  }

  /**
   * Initialize the locale switcher
   */
  async init() {
    // Detect current locale
    this.currentLocale = await this.detectCurrentLocale();
    
    // Create switcher UI
    this.createSwitcherUI();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Auto-detect if enabled
    if (this.config.autoDetect) {
      this.setupAutoDetection();
    }
    
    // Notify observers
    this.notifyObservers('initialized', { locale: this.currentLocale });
  }

  /**
   * Detect current locale
   */
  async detectCurrentLocale() {
    // Priority: URL > Cookie > Storage > Browser > Default
    const sources = [
      () => this.getLocaleFromURL(),
      () => this.getLocaleFromCookie(),
      () => this.getLocaleFromStorage(),
      () => this.getLocaleFromBrowser(),
      () => this.config.defaultLocale
    ];

    for (const getSource of sources) {
      try {
        const locale = getSource();
        if (locale && this.isSupported(locale)) {
          return locale;
        }
      } catch (error) {
        console.warn('Locale detection failed:', error);
      }
    }

    return this.config.defaultLocale;
  }

  /**
   * Get locale from URL parameter
   */
  getLocaleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(this.config.urlParam);
  }

  /**
   * Get locale from cookie
   */
  getLocaleFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.config.cookieName) {
        return value;
      }
    }
    return null;
  }

  /**
   * Get locale from localStorage
   */
  getLocaleFromStorage() {
    try {
      return localStorage.getItem(this.config.storageKey);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get locale from browser
   */
  getLocaleFromBrowser() {
    const browserLang = navigator.language || navigator.userLanguage;
    const normalized = this.normalizeLocale(browserLang);
    
    if (normalized && this.isSupported(normalized)) {
      return normalized;
    }

    // Try language-only matching
    const langOnly = browserLang.split('-')[0];
    const match = this.config.supportedLocales.find(supported => 
      supported.startsWith(langOnly + '-')
    );
    
    return match || null;
  }

  /**
   * Create switcher UI
   */
  createSwitcherUI() {
    // Create main switcher element
    this.switcherElement = document.createElement('div');
    this.switcherElement.className = 'locale-switcher';
    this.switcherElement.setAttribute('aria-label', 'Language switcher');
    this.switcherElement.setAttribute('role', 'combobox');
    this.switcherElement.setAttribute('aria-expanded', 'false');

    // Apply position styles
    this.applyPositionStyles();

    // Create trigger button
    const triggerButton = this.createTriggerButton();
    this.switcherElement.appendChild(triggerButton);

    // Create dropdown
    const dropdown = this.createDropdown();
    this.switcherElement.appendChild(dropdown);

    // Add to page
    document.body.appendChild(this.switcherElement);

    // Set initial state
    this.updateTriggerButton();
  }

  /**
   * Create trigger button
   */
  createTriggerButton() {
    const button = document.createElement('button');
    button.className = 'locale-switcher-trigger';
    button.setAttribute('aria-label', 'Select language');
    button.setAttribute('type', 'button');

    // Add flag if enabled
    if (this.config.showFlags) {
      const flag = document.createElement('span');
      flag.className = 'locale-flag';
      flag.textContent = this.getFlagEmoji(this.currentLocale);
      button.appendChild(flag);
    }

    // Add text
    const text = document.createElement('span');
    text.className = 'locale-text';
    text.textContent = this.getLocaleDisplayName(this.currentLocale);
    button.appendChild(text);

    // Add dropdown arrow
    const arrow = document.createElement('span');
    arrow.className = 'locale-arrow';
    arrow.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 4.5L6 7.5L9 4.5"/>
      </svg>
    `;
    button.appendChild(arrow);

    button.addEventListener('click', () => this.toggleDropdown());

    return button;
  }

  /**
   * Create dropdown
   */
  createDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'locale-switcher-dropdown';
    dropdown.setAttribute('role', 'listbox');

    // Create language list
    const list = document.createElement('ul');
    list.className = 'locale-list';

    this.config.supportedLocales.forEach(locale => {
      const item = this.createLanguageItem(locale);
      list.appendChild(item);
    });

    dropdown.appendChild(list);

    return dropdown;
  }

  /**
   * Create language item
   */
  createLanguageItem(locale) {
    const item = document.createElement('li');
    item.className = 'locale-item';
    item.setAttribute('role', 'option');
    item.setAttribute('data-locale', locale);

    if (locale === this.currentLocale) {
      item.setAttribute('aria-selected', 'true');
      item.classList.add('current');
    }

    const button = document.createElement('button');
    button.className = 'locale-option';
    button.setAttribute('type', 'button');
    button.setAttribute('lang', locale);

    // Add flag if enabled
    if (this.config.showFlags) {
      const flag = document.createElement('span');
      flag.className = 'locale-flag';
      flag.textContent = this.getFlagEmoji(locale);
      button.appendChild(flag);
    }

    // Add native name
    const nativeName = document.createElement('span');
    nativeName.className = 'locale-native-name';
    nativeName.textContent = this.getLocaleNativeName(locale);
    button.appendChild(nativeName);

    // Add English name if different
    if (this.config.showNativeNames && locale !== this.currentLocale) {
      const englishName = document.createElement('span');
      englishName.className = 'locale-english-name';
      englishName.textContent = this.getLocaleDisplayName(locale);
      button.appendChild(englishName);
    }

    button.addEventListener('click', () => this.switchLocale(locale));

    item.appendChild(button);
    return item;
  }

  /**
   * Apply position styles
   */
  applyPositionStyles() {
    const positions = {
      'top-right': {
        top: '20px',
        right: '20px',
        bottom: 'auto',
        left: 'auto'
      },
      'top-left': {
        top: '20px',
        left: '20px',
        bottom: 'auto',
        right: 'auto'
      },
      'bottom-right': {
        bottom: '20px',
        right: '20px',
        top: 'auto',
        left: 'auto'
      },
      'bottom-left': {
        bottom: '20px',
        left: '20px',
        top: 'auto',
        right: 'auto'
      }
    };

    const position = positions[this.config.position] || positions['top-right'];
    Object.assign(this.switcherElement.style, position);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.switcherElement.contains(event.target)) {
        this.closeDropdown();
      }
    });

    // Keyboard navigation
    this.switcherElement.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event);
    });

    // Escape key to close
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeDropdown();
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(event) {
    const items = this.switcherElement.querySelectorAll('.locale-item');
    const currentIndex = Array.from(items).findIndex(item => 
      item.getAttribute('aria-selected') === 'true'
    );

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (event.target.classList.contains('locale-switcher-trigger')) {
          event.preventDefault();
          this.toggleDropdown();
        } else if (event.target.classList.contains('locale-option')) {
          event.preventDefault();
          const locale = event.target.closest('.locale-item').getAttribute('data-locale');
          this.switchLocale(locale);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (this.isOpen) {
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].querySelector('button').focus();
        } else {
          this.openDropdown();
          items[0].querySelector('button').focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          items[prevIndex].querySelector('button').focus();
        }
        break;

      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.closeDropdown();
          this.switcherElement.querySelector('.locale-switcher-trigger').focus();
        }
        break;
    }
  }

  /**
   * Setup auto-detection
   */
  setupAutoDetection() {
    // Listen for browser language changes
    if ('languages' in navigator) {
      // This is not a standard event, but some browsers support it
      navigator.addEventListener('languagechange', async () => {
        const detected = await this.detectCurrentLocale();
        if (detected !== this.currentLocale) {
          console.log(`Browser language changed to ${detected}`);
          // Don't auto-switch, just notify
          this.notifyObservers('languageChanged', { 
            detected, 
            current: this.currentLocale 
          });
        }
      });
    }
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open dropdown
   */
  openDropdown() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.switcherElement.classList.add('open');
    this.switcherElement.setAttribute('aria-expanded', 'true');

    // Focus first item
    const firstItem = this.switcherElement.querySelector('.locale-item button');
    if (firstItem) {
      firstItem.focus();
    }
  }

  /**
   * Close dropdown
   */
  closeDropdown() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.switcherElement.classList.remove('open');
    this.switcherElement.setAttribute('aria-expanded', 'false');
  }

  /**
   * Switch locale
   */
  async switchLocale(locale) {
    if (locale === this.currentLocale) {
      this.closeDropdown();
      return;
    }

    if (!this.isSupported(locale)) {
      console.error(`Unsupported locale: ${locale}`);
      return;
    }

    try {
      // Show loading state
      this.showLoadingState();

      // Save preference
      this.saveLocalePreference(locale);

      // Update URL if needed
      this.updateURL(locale);

      // Notify observers
      this.notifyObservers('beforeSwitch', { 
        from: this.currentLocale, 
        to: locale 
      });

      // Switch with animation
      if (this.config.switchAnimation) {
        await this.switchWithAnimation(locale);
      } else {
        this.currentLocale = locale;
        this.updateUI();
      }

      // Notify observers
      this.notifyObservers('afterSwitch', { 
        from: this.currentLocale, 
        to: locale 
      });

    } catch (error) {
      console.error('Failed to switch locale:', error);
      this.hideLoadingState();
    }
  }

  /**
   * Switch with animation
   */
  async switchWithAnimation(locale) {
    const duration = this.config.animationDuration;
    
    // Fade out
    document.body.style.transition = `opacity ${duration}ms ease-in-out`;
    document.body.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, duration));

    // Switch locale
    this.currentLocale = locale;
    this.updateUI();

    // Fade in
    document.body.style.opacity = '1';

    await new Promise(resolve => setTimeout(resolve, duration));

    // Clean up
    document.body.style.transition = '';
    this.hideLoadingState();
  }

  /**
   * Update UI
   */
  updateUI() {
    this.updateTriggerButton();
    this.updateDropdownSelection();
    this.closeDropdown();
  }

  /**
   * Update trigger button
   */
  updateTriggerButton() {
    const button = this.switcherElement.querySelector('.locale-switcher-trigger');
    if (!button) return;

    const flag = button.querySelector('.locale-flag');
    const text = button.querySelector('.locale-text');

    if (flag) {
      flag.textContent = this.getFlagEmoji(this.currentLocale);
    }

    if (text) {
      text.textContent = this.getLocaleDisplayName(this.currentLocale);
    }
  }

  /**
   * Update dropdown selection
   */
  updateDropdownSelection() {
    const items = this.switcherElement.querySelectorAll('.locale-item');
    
    items.forEach(item => {
      const locale = item.getAttribute('data-locale');
      const isSelected = locale === this.currentLocale;
      
      item.setAttribute('aria-selected', isSelected.toString());
      item.classList.toggle('current', isSelected);
    });
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    this.switcherElement.classList.add('loading');
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    this.switcherElement.classList.remove('loading');
  }

  /**
   * Save locale preference
   */
  saveLocalePreference(locale) {
    // Save to localStorage
    try {
      localStorage.setItem(this.config.storageKey, locale);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }

    // Save to cookie
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${this.config.cookieName}=${locale}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  /**
   * Update URL
   */
  updateURL(locale) {
    const url = new URL(window.location);
    url.searchParams.set(this.config.urlParam, locale);
    
    if (window.history.pushState) {
      window.history.pushState({}, '', url);
    }
  }

  /**
   * Get locale display name
   */
  getLocaleDisplayName(locale) {
    const names = {
      'es-ES': 'Spanish',
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'pt-BR': 'Portuguese (BR)',
      'pt-PT': 'Portuguese (PT)'
    };
    return names[locale] || locale;
  }

  /**
   * Get locale native name
   */
  getLocaleNativeName(locale) {
    const names = {
      'es-ES': 'Español',
      'en-US': 'English',
      'en-GB': 'English',
      'pt-BR': 'Português',
      'pt-PT': 'Português'
    };
    return names[locale] || locale;
  }

  /**
   * Get flag emoji
   */
  getFlagEmoji(locale) {
    const flags = {
      'es-ES': '🇪🇸',
      'en-US': '🇺🇸',
      'en-GB': '🇬🇧',
      'pt-BR': '🇧🇷',
      'pt-PT': '🇵🇹'
    };
    return flags[locale] || '🌐';
  }

  /**
   * Normalize locale
   */
  normalizeLocale(locale) {
    if (!locale) return null;
    
    const parts = locale.split(/[-_]/);
    if (parts.length >= 2) {
      return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }
    
    return null;
  }

  /**
   * Check if locale is supported
   */
  isSupported(locale) {
    return this.config.supportedLocales.includes(locale);
  }

  /**
   * Add observer
   */
  addObserver(callback) {
    this.observers.push(callback);
  }

  /**
   * Remove observer
   */
  removeObserver(callback) {
    const index = this.observers.indexOf(callback);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notify observers
   */
  notifyObservers(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Observer callback error:', error);
      }
    });
  }

  /**
   * Get current locale
   */
  getCurrentLocale() {
    return this.currentLocale;
  }

  /**
   * Set locale programmatically
   */
  setLocale(locale) {
    if (this.isSupported(locale)) {
      this.switchLocale(locale);
    } else {
      throw new Error(`Unsupported locale: ${locale}`);
    }
  }

  /**
   * Destroy switcher
   */
  destroy() {
    if (this.switcherElement && this.switcherElement.parentNode) {
      this.switcherElement.parentNode.removeChild(this.switcherElement);
    }
    this.observers = [];
  }
}

// Create global instance
window.LocaleSwitcher = LocaleSwitcher;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocaleSwitcher;
}
