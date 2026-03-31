/**
 * Atlas Somático Editorial - Language Configuration
 * Comprehensive language settings and locale configurations
 */

const LANGUAGE_CONFIG = {
  // Supported locales with detailed configuration
  locales: {
    'es-ES': {
      name: 'Español',
      nativeName: 'Español (España)',
      code: 'es',
      region: 'ES',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'EUR',
      decimal: ',',
      thousands: '.',
      // Language-specific settings
      features: {
        hyphenation: true,
        accentSupport: true,
        specialCharacters: ['ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü', '¿', '¡'],
        pluralRules: (n) => n === 1 ? 'one' : 'other'
      },
      // Typography settings
      typography: {
        lineHeight: {
          tight: 1.4,
          normal: 1.6,
          relaxed: 1.7,
          loose: 1.8
        },
        letterSpacing: {
          tight: -0.005,
          normal: 0.005,
          relaxed: 0.01,
          loose: 0.015
        },
        wordSpacing: {
          tight: 0.05,
          normal: 0.08,
          relaxed: 0.12,
          loose: 0.15
        }
      },
      // Medical terminology preferences
      medical: {
        terminology: 'european',
        units: 'metric',
        temperature: 'celsius',
        weight: 'kilograms',
        height: 'centimeters'
      }
    },
    
    'en-US': {
      name: 'English',
      nativeName: 'English (United States)',
      code: 'en',
      region: 'US',
      direction: 'ltr',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      decimal: '.',
      thousands: ',',
      // Language-specific settings
      features: {
        hyphenation: false,
        accentSupport: false,
        specialCharacters: [],
        pluralRules: (n) => n === 1 ? 'one' : 'other'
      },
      // Typography settings
      typography: {
        lineHeight: {
          tight: 1.4,
          normal: 1.5,
          relaxed: 1.6,
          loose: 1.7
        },
        letterSpacing: {
          tight: -0.01,
          normal: 0,
          relaxed: 0.01,
          loose: 0.02
        },
        wordSpacing: {
          tight: 0.05,
          normal: 0.1,
          relaxed: 0.15,
          loose: 0.2
        }
      },
      // Medical terminology preferences
      medical: {
        terminology: 'american',
        units: 'imperial',
        temperature: 'fahrenheit',
        weight: 'pounds',
        height: 'feet'
      }
    },
    
    'en-GB': {
      name: 'English',
      nativeName: 'English (United Kingdom)',
      code: 'en',
      region: 'GB',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'GBP',
      decimal: '.',
      thousands: ',',
      // Language-specific settings
      features: {
        hyphenation: true,
        accentSupport: false,
        specialCharacters: [],
        pluralRules: (n) => n === 1 ? 'one' : 'other'
      },
      // Typography settings
      typography: {
        lineHeight: {
          tight: 1.4,
          normal: 1.5,
          relaxed: 1.6,
          loose: 1.7
        },
        letterSpacing: {
          tight: -0.01,
          normal: 0,
          relaxed: 0.01,
          loose: 0.02
        },
        wordSpacing: {
          tight: 0.05,
          normal: 0.1,
          relaxed: 0.15,
          loose: 0.2
        }
      },
      // Medical terminology preferences
      medical: {
        terminology: 'british',
        units: 'metric',
        temperature: 'celsius',
        weight: 'kilograms',
        height: 'centimeters'
      }
    },
    
    'pt-BR': {
      name: 'Português',
      nativeName: 'Português (Brasil)',
      code: 'pt',
      region: 'BR',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'BRL',
      decimal: ',',
      thousands: '.',
      // Language-specific settings
      features: {
        hyphenation: true,
        accentSupport: true,
        specialCharacters: ['ã', 'õ', 'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ç', 'à'],
        pluralRules: (n) => n === 0 || n === 1 ? 'one' : 'other'
      },
      // Typography settings
      typography: {
        lineHeight: {
          tight: 1.4,
          normal: 1.6,
          relaxed: 1.7,
          loose: 1.8
        },
        letterSpacing: {
          tight: -0.005,
          normal: 0.005,
          relaxed: 0.01,
          loose: 0.015
        },
        wordSpacing: {
          tight: 0.05,
          normal: 0.08,
          relaxed: 0.12,
          loose: 0.15
        }
      },
      // Medical terminology preferences
      medical: {
        terminology: 'brazilian',
        units: 'metric',
        temperature: 'celsius',
        weight: 'kilograms',
        height: 'centimeters'
      }
    },
    
    'pt-PT': {
      name: 'Português',
      nativeName: 'Português (Portugal)',
      code: 'pt',
      region: 'PT',
      direction: 'ltr',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'EUR',
      decimal: ',',
      thousands: '.',
      // Language-specific settings
      features: {
        hyphenation: true,
        accentSupport: true,
        specialCharacters: ['ã', 'õ', 'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ç', 'à'],
        pluralRules: (n) => n === 0 || n === 1 ? 'one' : 'other'
      },
      // Typography settings
      typography: {
        lineHeight: {
          tight: 1.4,
          normal: 1.6,
          relaxed: 1.7,
          loose: 1.8
        },
        letterSpacing: {
          tight: -0.005,
          normal: 0.005,
          relaxed: 0.01,
          loose: 0.015
        },
        wordSpacing: {
          tight: 0.05,
          normal: 0.08,
          relaxed: 0.12,
          loose: 0.15
        }
      },
      // Medical terminology preferences
      medical: {
        terminology: 'european',
        units: 'metric',
        temperature: 'celsius',
        weight: 'kilograms',
        height: 'centimeters'
      }
    }
  },

  // Default configuration
  defaultLocale: 'es-ES',
  fallbackLocale: 'en-US',

  // Language groups for easier management
  languageGroups: {
    'spanish': ['es-ES'],
    'english': ['en-US', 'en-GB'],
    'portuguese': ['pt-BR', 'pt-PT'],
    'latin': ['es-ES', 'pt-BR', 'pt-PT'],
    'germanic': ['en-US', 'en-GB'],
    'romance': ['es-ES', 'pt-BR', 'pt-PT']
  },

  // Regional preferences
  regionalSettings: {
    'europe': ['es-ES', 'en-GB', 'pt-PT'],
    'americas': ['en-US', 'pt-BR', 'es-ES'],
    'north_america': ['en-US', 'es-ES'],
    'south_america': ['pt-BR', 'es-ES'],
    'europe_union': ['es-ES', 'en-GB', 'pt-PT']
  },

  // Language detection priorities
  detectionPriority: [
    'url',           // URL parameter ?lang=en-US
    'cookie',        // Stored preference
    'localStorage',  // Browser storage
    'navigator',     // Browser language
    'timezone',      // User timezone
    'default'        // Fallback to default
  ],

  // URL patterns for different languages
  urlPatterns: {
    subdomain: '{locale}.example.com',
    path: '/{locale}/path',
    parameter: '/path?lang={locale}',
    custom: '/{lang}/path'
  },

  // Content negotiation settings
  contentNegotiation: {
    enabled: true,
    headerName: 'Accept-Language',
    qualityFactor: 0.8,
    fallbackQuality: 0.1
  },

  // Cache settings
  cache: {
    enabled: true,
    ttl: 3600000, // 1 hour in milliseconds
    maxSize: 100, // Maximum number of cached translations
    storage: 'localStorage' // 'localStorage' or 'memory'
  },

  // Performance settings
  performance: {
    lazyLoading: true,
    preloading: true,
    compression: true,
    minification: true,
    bundling: true
  },

  // Debug settings
  debug: {
    enabled: false,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    showMissingKeys: true,
    showPerformanceMetrics: false
  }
};

// Helper functions for language configuration
const LanguageConfigHelper = {
  /**
   * Get configuration for a specific locale
   */
  getConfig(locale) {
    return LANGUAGE_CONFIG.locales[locale] || LANGUAGE_CONFIG.locales[LANGUAGE_CONFIG.defaultLocale];
  },

  /**
   * Get all supported locales
   */
  getSupportedLocales() {
    return Object.keys(LANGUAGE_CONFIG.locales);
  },

  /**
   * Check if a locale is supported
   */
  isSupported(locale) {
    return locale in LANGUAGE_CONFIG.locales;
  },

  /**
   * Get locales by language group
   */
  getByGroup(groupName) {
    return LANGUAGE_CONFIG.languageGroups[groupName] || [];
  },

  /**
   * Get locales by region
   */
  getByRegion(regionName) {
    return LANGUAGE_CONFIG.regionalSettings[regionName] || [];
  },

  /**
   * Get typography settings for a locale
   */
  getTypography(locale) {
    const config = this.getConfig(locale);
    return config.typography || LANGUAGE_CONFIG.locales[LANGUAGE_CONFIG.defaultLocale].typography;
  },

  /**
   * Get medical settings for a locale
   */
  getMedicalSettings(locale) {
    const config = this.getConfig(locale);
    return config.medical || LANGUAGE_CONFIG.locales[LANGUAGE_CONFIG.defaultLocale].medical;
  },

  /**
   * Format date according to locale
   */
  formatDate(date, locale, format = null) {
    const config = this.getConfig(locale);
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
        return date.toLocaleDateString(locale);
    }
  },

  /**
   * Format number according to locale
   */
  formatNumber(number, locale) {
    const config = this.getConfig(locale);
    
    const parts = number.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousands);
    const decimalPart = parts[1] ? config.decimal + parts[1] : '';
    
    return integerPart + decimalPart;
  },

  /**
   * Get plural form for a number
   */
  getPluralForm(number, locale) {
    const config = this.getConfig(locale);
    return config.features.pluralRules(number);
  },

  /**
   * Check if locale supports hyphenation
   */
  supportsHyphenation(locale) {
    const config = this.getConfig(locale);
    return config.features.hyphenation;
  },

  /**
   * Get special characters for a locale
   */
  getSpecialCharacters(locale) {
    const config = this.getConfig(locale);
    return config.features.specialCharacters || [];
  },

  /**
   * Get text direction for a locale
   */
  getTextDirection(locale) {
    const config = this.getConfig(locale);
    return config.direction;
  },

  /**
   * Validate locale format
   */
  validateLocale(locale) {
    const localeRegex = /^[a-z]{2}-[A-Z]{2}$/;
    return localeRegex.test(locale);
  },

  /**
   * Normalize locale to standard format
   */
  normalizeLocale(locale) {
    if (!locale) return null;
    
    // Convert to lowercase and ensure proper format
    const parts = locale.split(/[-_]/);
    if (parts.length >= 2) {
      return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }
    
    return null;
  },

  /**
   * Get locale from browser language
   */
  getBrowserLocale() {
    const browserLang = navigator.language || navigator.userLanguage;
    return this.normalizeLocale(browserLang);
  },

  /**
   * Get locale from timezone
   */
  getTimezoneLocale() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Simple timezone to locale mapping
    const timezoneMap = {
      'Europe/London': 'en-GB',
      'Europe/Madrid': 'es-ES',
      'Europe/Lisbon': 'pt-PT',
      'America/New_York': 'en-US',
      'America/Sao_Paulo': 'pt-BR',
      'America/Mexico_City': 'es-ES'
    };
    
    return timezoneMap[timezone] || null;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LANGUAGE_CONFIG, LanguageConfigHelper };
}

// Global assignment for browser use
if (typeof window !== 'undefined') {
  window.LANGUAGE_CONFIG = LANGUAGE_CONFIG;
  window.LanguageConfigHelper = LanguageConfigHelper;
}
