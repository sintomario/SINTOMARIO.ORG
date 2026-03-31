/**
 * Atlas Somático Editorial - Translation Loader
 * Advanced translation loading with caching and fallback support
 */

class TranslationLoader {
  constructor(config = {}) {
    this.config = {
      baseUrl: '/i18n/locales',
      cacheEnabled: true,
      cacheTTL: 3600000, // 1 hour
      fallbackLocale: 'en-US',
      retryAttempts: 3,
      retryDelay: 1000,
      compression: true,
      ...config
    };
    
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.loadStats = {
      hits: 0,
      misses: 0,
      errors: 0,
      totalRequests: 0
    };
  }

  /**
   * Load translations for a specific locale
   */
  async loadTranslations(locale, namespaces = ['common']) {
    const cacheKey = `${locale}:${namespaces.join(',')}`;
    
    // Check cache first
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.loadStats.hits++;
        return cached;
      }
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    this.loadStats.misses++;
    this.loadStats.totalRequests++;

    // Start loading
    const loadingPromise = this.loadTranslationsFromAPI(locale, namespaces);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const translations = await loadingPromise;
      
      // Cache the result
      if (this.config.cacheEnabled) {
        this.setCache(cacheKey, translations);
      }
      
      return translations;
    } catch (error) {
      this.loadStats.errors++;
      console.error(`Failed to load translations for ${locale}:`, error);
      
      // Try fallback locale
      if (locale !== this.config.fallbackLocale) {
        console.log(`Falling back to ${this.config.fallbackLocale}`);
        return this.loadTranslations(this.config.fallbackLocale, namespaces);
      }
      
      throw error;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Load translations from API/files
   */
  async loadTranslationsFromAPI(locale, namespaces) {
    const translationPromises = namespaces.map(namespace => 
      this.loadNamespace(locale, namespace)
    );

    const results = await Promise.allSettled(translationPromises);
    const translations = {};

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const namespace = namespaces[i];

      if (result.status === 'fulfilled') {
        translations[namespace] = result.value;
      } else {
        console.warn(`Failed to load namespace ${namespace} for ${locale}:`, result.reason);
        
        // Try fallback for this namespace
        if (locale !== this.config.fallbackLocale) {
          try {
            const fallback = await this.loadNamespace(this.config.fallbackLocale, namespace);
            translations[namespace] = fallback;
          } catch (fallbackError) {
            console.warn(`Fallback also failed for namespace ${namespace}`);
            translations[namespace] = {};
          }
        } else {
          translations[namespace] = {};
        }
      }
    }

    return translations;
  }

  /**
   * Load a specific namespace
   */
  async loadNamespace(locale, namespace) {
    const url = `${this.config.baseUrl}/${locale}/${namespace}.json`;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': this.config.cacheEnabled ? 'max-age=3600' : 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const translations = await response.json();
        
        if (typeof translations !== 'object') {
          throw new Error('Invalid translation format: expected object');
        }

        return translations;
      } catch (error) {
        if (attempt === this.config.retryAttempts) {
          throw error;
        }
        
        console.warn(`Attempt ${attempt} failed for ${url}, retrying...`);
        await this.delay(this.config.retryDelay * attempt);
      }
    }
  }

  /**
   * Load multiple locales at once
   */
  async loadMultipleLocales(locales, namespaces = ['common']) {
    const promises = locales.map(locale => 
      this.loadTranslations(locale, namespaces).catch(error => {
        console.error(`Failed to load ${locale}:`, error);
        return null;
      })
    );

    const results = await Promise.all(promises);
    const translations = {};

    locales.forEach((locale, index) => {
      if (results[index]) {
        translations[locale] = results[index];
      }
    });

    return translations;
  }

  /**
   * Preload translations for better performance
   */
  async preloadTranslations(locales, namespaces = ['common']) {
    console.log('Preloading translations for:', locales);
    
    try {
      await this.loadMultipleLocales(locales, namespaces);
      console.log('Preloading completed successfully');
    } catch (error) {
      console.error('Preloading failed:', error);
    }
  }

  /**
   * Get translation value with nested key support
   */
  getTranslation(translations, key, params = {}) {
    if (!translations || typeof translations !== 'object') {
      return key;
    }

    const value = this.getNestedValue(translations, key);
    
    if (value === null || value === undefined) {
      return key;
    }

    // Handle interpolation
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return this.interpolate(value, params);
    }

    return value;
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
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Cache management
   */
  setCache(key, value) {
    const cacheItem = {
      value,
      timestamp: Date.now(),
      ttl: this.config.cacheTTL
    };
    this.cache.set(key, cacheItem);
  }

  getFromCache(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Get loading statistics
   */
  getLoadStats() {
    return {
      ...this.loadStats,
      cacheSize: this.cache.size,
      loadingCount: this.loadingPromises.size,
      hitRate: this.loadStats.totalRequests > 0 
        ? (this.loadStats.hits / this.loadStats.totalRequests * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Validate translation structure
   */
  validateTranslations(translations) {
    const errors = [];
    
    if (!translations || typeof translations !== 'object') {
      errors.push('Translations must be an object');
      return errors;
    }

    const validateObject = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (value === null || value === undefined) {
          errors.push(`Null/undefined value at ${currentPath}`);
          continue;
        }
        
        if (typeof value === 'object' && !Array.isArray(value)) {
          validateObject(value, currentPath);
        } else if (typeof value !== 'string') {
          errors.push(`Non-string value at ${currentPath}: ${typeof value}`);
        }
      }
    };

    validateObject(translations);
    return errors;
  }

  /**
   * Merge translations (useful for fallback)
   */
  mergeTranslations(target, source) {
    const result = { ...target };
    
    const merge = (targetObj, sourceObj) => {
      for (const [key, value] of Object.entries(sourceObj)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (!targetObj[key] || typeof targetObj[key] !== 'object') {
            targetObj[key] = {};
          }
          merge(targetObj[key], value);
        } else if (targetObj[key] === undefined) {
          targetObj[key] = value;
        }
      }
    };
    
    merge(result, source);
    return result;
  }

  /**
   * Get missing translations
   */
  getMissingTranslations(translations, referenceTranslations) {
    const missing = [];
    
    const findMissing = (obj, ref, path = '') => {
      for (const [key, value] of Object.entries(ref)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (!obj[key] || typeof obj[key] !== 'object') {
            missing.push(currentPath);
          } else {
            findMissing(obj[key] || {}, value, currentPath);
          }
        } else if (!obj || obj[key] === undefined) {
          missing.push(currentPath);
        }
      }
    };
    
    findMissing(translations || {}, referenceTranslations || {});
    return missing;
  }

  /**
   * Export translations to JSON
   */
  exportTranslations(translations) {
    return JSON.stringify(translations, null, 2);
  }

  /**
   * Import translations from JSON
   */
  importTranslations(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to parse translations JSON:', error);
      return {};
    }
  }

  /**
   * Create translation namespace
   */
  createNamespace(namespace, translations = {}) {
    return {
      [namespace]: translations
    };
  }

  /**
   * Get all available namespaces for a locale
   */
  async getAvailableNamespaces(locale) {
    try {
      // This would typically be an API endpoint
      const response = await fetch(`${this.config.baseUrl}/${locale}/namespaces.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get namespaces:', error);
    }
    
    // Fallback to common namespaces
    return ['common', 'scrollytelling', 'body-maps', 'search', 'theme', 'progress', 'medical'];
  }

  /**
   * Watch for translation changes (for development)
   */
  watchTranslations(locale, namespace, callback) {
    if (typeof window === 'undefined') {
      return () => {}; // No-op in server environment
    }

    const checkInterval = setInterval(async () => {
      try {
        const current = await this.loadNamespace(locale, namespace);
        const cached = this.getFromCache(`${locale}:${namespace}`);
        
        if (JSON.stringify(current) !== JSON.stringify(cached)) {
          callback(current);
          this.setCache(`${locale}:${namespace}`, current);
        }
      } catch (error) {
        console.warn('Watch check failed:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }

  /**
   * Utility: delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup method
   */
  cleanup() {
    this.clearCache();
    this.loadingPromises.clear();
  }
}

// Create global instance
window.TranslationLoader = TranslationLoader;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationLoader;
}
