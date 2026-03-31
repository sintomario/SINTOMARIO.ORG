/**
 * Atlas Somático Editorial - Internationalization Engine
 * Comprehensive i18n system for English and Portuguese support
 */

class I18nEngine {
  constructor() {
    this.currentLocale = 'es-ES';
    this.fallbackLocale = 'en-US';
    this.translations = new Map();
    this.dictionaries = new Map();
    this.isLoaded = false;
    this.observers = [];
    
    // Supported locales
    this.supportedLocales = ['es-ES', 'en-US', 'en-GB', 'pt-BR', 'pt-PT'];
    
    // Locale configurations
    this.localeConfigs = {
      'es-ES': {
        name: 'Español',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'EUR',
        decimal: ',',
        thousands: '.'
      },
      'en-US': {
        name: 'English (US)',
        direction: 'ltr',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currency: 'USD',
        decimal: '.',
        thousands: ','
      },
      'en-GB': {
        name: 'English (UK)',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'GBP',
        decimal: '.',
        thousands: ','
      },
      'pt-BR': {
        name: 'Português (Brasil)',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'BRL',
        decimal: ',',
        thousands: '.'
      },
      'pt-PT': {
        name: 'Português (Portugal)',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'EUR',
        decimal: ',',
        thousands: '.'
      }
    };
  }

  /**
   * Initialize the i18n engine
   */
  async init(locale = null) {
    try {
      // Detect locale
      this.currentLocale = locale || this.detectLocale();
      
      // Load translations
      await this.loadTranslations(this.currentLocale);
      
      // Load dictionary for spelling
      await this.loadDictionary(this.currentLocale);
      
      // Apply language styles
      this.applyLanguageStyles(this.currentLocale);
      
      // Update HTML attributes
      this.updateHTMLAttributes();
      
      // Update UI
      this.updateUI();
      
      // Mark as loaded
      this.isLoaded = true;
      
      // Notify observers
      this.notifyObservers('loaded', { locale: this.currentLocale });
      
      console.log(`I18n Engine initialized with locale: ${this.currentLocale}`);
      
    } catch (error) {
      console.error('Failed to initialize I18n Engine:', error);
      // Fallback to English
      await this.init('en-US');
    }
  }

  /**
   * Detect user's preferred locale
   */
  detectLocale() {
    // Priority order: URL parameter > stored preference > browser language > fallback
    
    // 1. URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.supportedLocales.includes(urlLang)) {
      return urlLang;
    }
    
    // 2. Stored preference
    const storedLang = localStorage.getItem('atlas-locale');
    if (storedLang && this.supportedLocales.includes(storedLang)) {
      return storedLang;
    }
    
    // 3. Browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const browserLocale = this.normalizeLocale(browserLang);
    if (browserLocale && this.supportedLocales.includes(browserLocale)) {
      return browserLocale;
    }
    
    // 4. Fallback
    return this.fallbackLocale;
  }

  /**
   * Normalize browser locale to supported format
   */
  normalizeLocale(locale) {
    if (!locale) return null;
    
    // Handle different browser locale formats
    const normalized = locale.replace('-', '_');
    
    // Check exact match
    if (this.supportedLocales.includes(normalized)) {
      return normalized;
    }
    
    // Check language-only match
    const langOnly = normalized.split('_')[0];
    const match = this.supportedLocales.find(supported => 
      supported.startsWith(langOnly + '-')
    );
    
    return match || null;
  }

  /**
   * Load translations for a specific locale
   */
  async loadTranslations(locale) {
    try {
      // Load common translations
      const commonResponse = await fetch(`/i18n/locales/${locale}/common.json`);
      if (commonResponse.ok) {
        const commonTranslations = await commonResponse.json();
        this.translations.set(locale, { ...commonTranslations });
      }
      
      // Load scrollytelling translations
      const scrollytellingResponse = await fetch(`/i18n/locales/${locale}/scrollytelling.json`);
      if (scrollytellingResponse.ok) {
        const scrollytellingTranslations = await scrollytellingResponse.json();
        const existing = this.translations.get(locale) || {};
        this.translations.set(locale, { 
          ...existing, 
          scrollytelling: scrollytellingTranslations 
        });
      }
      
      // Load body maps translations
      const bodyMapsResponse = await fetch(`/i18n/locales/${locale}/body-maps.json`);
      if (bodyMapsResponse.ok) {
        const bodyMapsTranslations = await bodyMapsResponse.json();
        const existing = this.translations.get(locale) || {};
        this.translations.set(locale, { 
          ...existing, 
          bodyMaps: bodyMapsTranslations 
        });
      }
      
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}:`, error);
      
      // Try fallback locale
      if (locale !== this.fallbackLocale) {
        await this.loadTranslations(this.fallbackLocale);
      }
    }
  }

  /**
   * Load dictionary for spelling checker
   */
  async loadDictionary(locale) {
    try {
      const dictResponse = await fetch(`/i18n/dictionaries/${locale}.dic`);
      if (dictResponse.ok) {
        const dictionary = await dictResponse.json();
        this.dictionaries.set(locale, dictionary);
      }
    } catch (error) {
      console.warn(`Failed to load dictionary for ${locale}:`, error);
    }
  }

  /**
   * Apply language-specific CSS styles
   */
  applyLanguageStyles(locale) {
    // Remove existing language stylesheets
    const existingLinks = document.querySelectorAll('link[data-i18n-stylesheet]');
    existingLinks.forEach(link => link.remove());
    
    // Add language-specific stylesheet
    const langCode = locale.split('-')[0];
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = `/assets-atlas/css/i18n/${langCode}-styles.css`;
    stylesheet.setAttribute('data-i18n-stylesheet', 'true');
    document.head.appendChild(stylesheet);
  }

  /**
   * Update HTML attributes for language
   */
  updateHTMLAttributes() {
    document.documentElement.lang = this.currentLocale;
    document.documentElement.dir = this.localeConfigs[this.currentLocale]?.direction || 'ltr';
  }

  /**
   * Translate a key with interpolation
   */
  t(key, params = {}) {
    if (!this.isLoaded) {
      console.warn('I18n Engine not loaded yet');
      return key;
    }
    
    const translations = this.translations.get(this.currentLocale);
    if (!translations) {
      console.warn(`No translations found for locale: ${this.currentLocale}`);
      return key;
    }
    
    // Get translation value
    let value = this.getNestedValue(translations, key);
    
    // If not found, try fallback locale
    if (!value && this.currentLocale !== this.fallbackLocale) {
      const fallbackTranslations = this.translations.get(this.fallbackLocale);
      value = this.getNestedValue(fallbackTranslations, key);
    }
    
    // If still not found, return key
    if (!value) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    
    // Interpolate parameters
    return this.interpolate(value, params);
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, key) {
    return key.split('.').reduce((current, keyPart) => {
      return current && current[keyPart] !== undefined ? current[keyPart] : null;
    }, obj);
  }

  /**
   * Interpolate parameters into translation string
   */
  interpolate(str, params) {
    if (typeof str !== 'string') return str;
    
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Update all UI elements with translations
   */
  updateUI() {
    // Update elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = translation;
      } else if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Update elements with data-i18n-html attribute (for HTML content)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      element.innerHTML = this.t(key);
    });
    
    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      titleElement.textContent = this.t(titleElement.getAttribute('data-i18n'));
    }
    
    // Update meta description
    const descElement = document.querySelector('meta[name="description"][data-i18n]');
    if (descElement) {
      descElement.content = this.t(descElement.getAttribute('data-i18n'));
    }
  }

  /**
   * Change locale
   */
  async changeLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.error(`Unsupported locale: ${locale}`);
      return false;
    }
    
    if (locale === this.currentLocale) {
      return true; // Already set
    }
    
    try {
      // Save preference
      localStorage.setItem('atlas-locale', locale);
      
      // Update current locale
      const oldLocale = this.currentLocale;
      this.currentLocale = locale;
      
      // Load new translations
      await this.loadTranslations(locale);
      
      // Load new dictionary
      await this.loadDictionary(locale);
      
      // Apply new styles
      this.applyLanguageStyles(locale);
      
      // Update HTML attributes
      this.updateHTMLAttributes();
      
      // Update UI
      this.updateUI();
      
      // Notify observers
      this.notifyObservers('localeChanged', { 
        oldLocale, 
        newLocale: locale 
      });
      
      console.log(`Locale changed from ${oldLocale} to ${locale}`);
      return true;
      
    } catch (error) {
      console.error('Failed to change locale:', error);
      
      // Revert to old locale
      this.currentLocale = oldLocale;
      return false;
    }
  }

  /**
   * Get current locale configuration
   */
  getLocaleConfig() {
    return this.localeConfigs[this.currentLocale] || this.localeConfigs[this.fallbackLocale];
  }

  /**
   * Format date according to locale
   */
  formatDate(date, format = null) {
    const config = this.getLocaleConfig();
    const dateFormat = format || config.dateFormat;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    switch (dateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString(this.currentLocale);
    }
  }

  /**
   * Format number according to locale
   */
  formatNumber(number) {
    const config = this.getLocaleConfig();
    
    // Simple implementation for basic formatting
    const parts = number.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousands);
    const decimalPart = parts[1] ? config.decimal + parts[1] : '';
    
    return integerPart + decimalPart;
  }

  /**
   * Add observer for locale changes
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
   * Notify all observers
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
   * Get dictionary for spelling checker
   */
  getDictionary() {
    return this.dictionaries.get(this.currentLocale) || 
           this.dictionaries.get(this.fallbackLocale) || 
           {};
  }

  /**
   * Check if word exists in dictionary
   */
  isWordInDictionary(word) {
    const dictionary = this.getDictionary();
    const normalizedWord = word.toLowerCase().trim();
    
    // Check in all dictionary categories
    for (const category of Object.values(dictionary)) {
      if (typeof category === 'object' && category[normalizedWord]) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get suggestions for misspelled words
   */
  getSpellingSuggestions(word) {
    const dictionary = this.getDictionary();
    const normalizedWord = word.toLowerCase().trim();
    const suggestions = [];
    
    // Collect all dictionary words
    const allWords = [];
    for (const category of Object.values(dictionary)) {
      if (typeof category === 'object') {
        allWords.push(...Object.keys(category));
      }
    }
    
    // Find similar words using Levenshtein distance
    for (const dictWord of allWords) {
      const distance = this.levenshteinDistance(normalizedWord, dictWord);
      if (distance <= 2 && distance > 0) {
        suggestions.push({ word: dictWord, distance });
      }
    }
    
    // Sort by distance and return top 5
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(s => s.word);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

// Create global instance
window.atlasI18n = new I18nEngine();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.atlasI18n.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nEngine;
}
