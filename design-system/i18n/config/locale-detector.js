/**
 * Atlas Somático Editorial - Locale Detector
 * Advanced locale detection and negotiation system
 */

class LocaleDetector {
  constructor(config = {}) {
    this.config = {
      supportedLocales: ['es-ES', 'en-US', 'en-GB', 'pt-BR', 'pt-PT'],
      defaultLocale: 'es-ES',
      fallbackLocale: 'en-US',
      detectionOrder: ['url', 'cookie', 'localStorage', 'navigator', 'timezone', 'geo', 'default'],
      cookieName: 'atlas-locale',
      storageKey: 'atlas-locale',
      urlParam: 'lang',
      ...config
    };
    
    this.cache = new Map();
    this.detectionHistory = [];
  }

  /**
   * Detect the best locale for the user
   */
  async detect() {
    const detectionSteps = this.config.detectionOrder;
    let detectedLocale = null;
    const detectionLog = [];

    for (const step of detectionSteps) {
      try {
        const result = await this.detectByMethod(step);
        detectionLog.push({ method: step, result, success: !!result });
        
        if (result && this.isSupported(result)) {
          detectedLocale = result;
          break;
        }
      } catch (error) {
        detectionLog.push({ method: step, error: error.message, success: false });
        console.warn(`Locale detection failed for method ${step}:`, error);
      }
    }

    // Fallback to default if nothing detected
    if (!detectedLocale) {
      detectedLocale = this.config.defaultLocale;
      detectionLog.push({ method: 'fallback', result: detectedLocale, success: true });
    }

    // Cache the result
    this.cache.set('detected', detectedLocale);
    this.detectionHistory.push({
      timestamp: Date.now(),
      locale: detectedLocale,
      log: detectionLog
    });

    return detectedLocale;
  }

  /**
   * Detect locale from URL parameter
   */
  async detectByMethod(method) {
    switch (method) {
      case 'url':
        return this.detectFromURL();
      case 'cookie':
        return this.detectFromCookie();
      case 'localStorage':
        return this.detectFromLocalStorage();
      case 'navigator':
        return this.detectFromNavigator();
      case 'timezone':
        return this.detectFromTimezone();
      case 'geo':
        return this.detectFromGeolocation();
      case 'default':
        return this.config.defaultLocale;
      default:
        return null;
    }
  }

  /**
   * Detect locale from URL parameter
   */
  detectFromURL() {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get(this.config.urlParam);
    
    if (urlLocale) {
      const normalized = this.normalizeLocale(urlLocale);
      if (normalized && this.isSupported(normalized)) {
        return normalized;
      }
    }

    // Check URL path
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const pathLocale = this.normalizeLocale(pathSegments[0]);
      if (pathLocale && this.isSupported(pathLocale)) {
        return pathLocale;
      }
    }

    // Check subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      const subdomainLocale = this.normalizeLocale(subdomain);
      if (subdomainLocale && this.isSupported(subdomainLocale)) {
        return subdomainLocale;
      }
    }

    return null;
  }

  /**
   * Detect locale from cookie
   */
  detectFromCookie() {
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.config.cookieName) {
        const normalized = this.normalizeLocale(value);
        if (normalized && this.isSupported(normalized)) {
          return normalized;
        }
      }
    }

    return null;
  }

  /**
   * Detect locale from localStorage
   */
  detectFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const normalized = this.normalizeLocale(stored);
        if (normalized && this.isSupported(normalized)) {
          return normalized;
        }
      }
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
    }

    return null;
  }

  /**
   * Detect locale from browser navigator
   */
  detectFromNavigator() {
    // Primary language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      const normalized = this.normalizeLocale(browserLang);
      if (normalized && this.isSupported(normalized)) {
        return normalized;
      }
    }

    // Language list
    if (navigator.languages && navigator.languages.length > 0) {
      for (const lang of navigator.languages) {
        const normalized = this.normalizeLocale(lang);
        if (normalized && this.isSupported(normalized)) {
          return normalized;
        }
      }
    }

    // Try language-only matching
    const langOnly = browserLang ? browserLang.split('-')[0] : null;
    if (langOnly) {
      const match = this.config.supportedLocales.find(supported => 
        supported.startsWith(langOnly + '-')
      );
      if (match) {
        return match;
      }
    }

    return null;
  }

  /**
   * Detect locale from timezone
   */
  detectFromTimezone() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Timezone to locale mapping
      const timezoneMap = {
        // Europe
        'Europe/Madrid': 'es-ES',
        'Europe/Lisbon': 'pt-PT',
        'Europe/London': 'en-GB',
        'Europe/Paris': 'en-GB', // Fallback to English
        'Europe/Berlin': 'en-GB', // Fallback to English
        'Europe/Rome': 'en-GB', // Fallback to English
        
        // Americas
        'America/New_York': 'en-US',
        'America/Los_Angeles': 'en-US',
        'America/Chicago': 'en-US',
        'America/Denver': 'en-US',
        'America/Phoenix': 'en-US',
        'America/Sao_Paulo': 'pt-BR',
        'America/Mexico_City': 'es-ES',
        'America/Argentina/Buenos_Aires': 'es-ES',
        'America/Lima': 'es-ES',
        'America/Bogota': 'es-ES',
        
        // Other regions
        'Asia/Tokyo': 'en-US', // Fallback
        'Asia/Shanghai': 'en-US', // Fallback
        'Australia/Sydney': 'en-GB', // Fallback
        'Africa/Cairo': 'en-GB', // Fallback
      };

      return timezoneMap[timezone] || null;
    } catch (error) {
      console.warn('Failed to detect timezone:', error);
      return null;
    }
  }

  /**
   * Detect locale from geolocation (async)
   */
  async detectFromGeolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding API (you'll need to implement this)
            const locale = await this.getLocaleFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(locale);
          } catch (error) {
            console.warn('Geolocation detection failed:', error);
            resolve(null);
          }
        },
        (error) => {
          console.warn('Geolocation access denied:', error);
          resolve(null);
        },
        {
          timeout: 5000,
          maximumAge: 24 * 60 * 60 * 1000 // 24 hours
        }
      );
    });
  }

  /**
   * Get locale from coordinates (mock implementation)
   */
  async getLocaleFromCoordinates(lat, lon) {
    // This would typically call a geocoding API
    // For now, return based on rough geographic regions
    
    // North America
    if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
      return 'en-US';
    }
    
    // South America
    if (lat >= -55 && lat <= 13 && lon >= -81 && lon <= -35) {
      // Brazil vs Spanish-speaking countries
      if (lon >= -79 && lon <= -35) {
        return 'pt-BR';
      }
      return 'es-ES';
    }
    
    // Europe
    if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
      // Spain
      if (lat >= 36 && lat <= 44 && lon >= -10 && lon <= 4) {
        return 'es-ES';
      }
      // Portugal
      if (lat >= 37 && lat <= 42 && lon >= -10 && lon <= -6) {
        return 'pt-PT';
      }
      // UK
      if (lat >= 49 && lat <= 61 && lon >= -8 && lon <= 2) {
        return 'en-GB';
      }
      // Fallback to English
      return 'en-GB';
    }
    
    return null;
  }

  /**
   * Normalize locale to standard format
   */
  normalizeLocale(locale) {
    if (!locale || typeof locale !== 'string') {
      return null;
    }

    // Remove whitespace and convert to lowercase
    const clean = locale.trim().toLowerCase();
    
    // Split by common separators
    const parts = clean.split(/[-_]/);
    
    if (parts.length >= 2) {
      // Standard format: language-region
      const language = parts[0];
      const region = parts[1].toUpperCase();
      
      // Validate language code
      if (language.length === 2 && /^[a-z]{2}$/.test(language)) {
        // Validate region code
        if (region.length === 2 && /^[A-Z]{2}$/.test(region)) {
          return `${language}-${region}`;
        }
      }
    } else if (parts.length === 1) {
      // Language only
      const language = parts[0];
      if (language.length === 2 && /^[a-z]{2}$/.test(language)) {
        // Try to find a matching locale
        const match = this.config.supportedLocales.find(supported => 
          supported.startsWith(language + '-')
        );
        return match || null;
      }
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
   * Get the best match for a list of preferred locales
   */
  getBestMatch(preferredLocales) {
    if (!Array.isArray(preferredLocales)) {
      return null;
    }

    for (const preferred of preferredLocales) {
      const normalized = this.normalizeLocale(preferred);
      if (normalized && this.isSupported(normalized)) {
        return normalized;
      }
    }

    // Try language-only matching
    for (const preferred of preferredLocales) {
      const language = preferred.split('-')[0].toLowerCase();
      const match = this.config.supportedLocales.find(supported => 
        supported.startsWith(language + '-')
      );
      if (match) {
        return match;
      }
    }

    return this.config.fallbackLocale;
  }

  /**
   * Set user preference
   */
  setPreference(locale) {
    const normalized = this.normalizeLocale(locale);
    
    if (!normalized || !this.isSupported(normalized)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    // Set cookie
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year
    
    document.cookie = `${this.config.cookieName}=${normalized}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // Set localStorage
    try {
      localStorage.setItem(this.config.storageKey, normalized);
    } catch (error) {
      console.warn('Failed to set localStorage:', error);
    }

    return normalized;
  }

  /**
   * Clear user preference
   */
  clearPreference() {
    // Clear cookie
    document.cookie = `${this.config.cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;

    // Clear localStorage
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get detection history
   */
  getDetectionHistory() {
    return this.detectionHistory;
  }

  /**
   * Get cached detection result
   */
  getCachedResult() {
    return this.cache.get('detected');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get locale statistics
   */
  getStatistics() {
    const history = this.getDetectionHistory();
    const methodCounts = {};
    
    for (const detection of history) {
      for (const log of detection.log) {
        if (log.success) {
          methodCounts[log.method] = (methodCounts[log.method] || 0) + 1;
        }
      }
    }

    return {
      totalDetections: history.length,
      methodCounts,
      supportedLocales: this.config.supportedLocales,
      defaultLocale: this.config.defaultLocale,
      fallbackLocale: this.config.fallbackLocale,
      lastDetection: history[history.length - 1] || null
    };
  }

  /**
   * Validate locale format
   */
  validateLocaleFormat(locale) {
    const localeRegex = /^[a-z]{2}-[A-Z]{2}$/;
    return localeRegex.test(locale);
  }

  /**
   * Get locale information
   */
  getLocaleInfo(locale) {
    const info = {
      locale,
      normalized: this.normalizeLocale(locale),
      supported: this.isSupported(locale),
      valid: this.validateLocaleFormat(locale)
    };

    if (info.normalized) {
      const [language, region] = info.normalized.split('-');
      info.language = language;
      info.region = region;
    }

    return info;
  }

  /**
   * Compare two locales
   */
  compareLocales(locale1, locale2) {
    const info1 = this.getLocaleInfo(locale1);
    const info2 = this.getLocaleInfo(locale2);

    if (info1.normalized === info2.normalized) {
      return 1; // Exact match
    }

    if (info1.language === info2.language) {
      return 0.5; // Language match
    }

    return 0; // No match
  }
}

// Create global instance
window.LocaleDetector = LocaleDetector;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocaleDetector;
}
