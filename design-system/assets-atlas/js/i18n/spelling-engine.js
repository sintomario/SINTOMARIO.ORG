/**
 * Atlas Somático Editorial - Spelling Engine
 * Advanced spelling checker with medical terminology support
 */

class SpellingEngine {
  constructor(i18nEngine) {
    this.i18nEngine = i18nEngine;
    this.customWords = new Set();
    this.userDictionary = new Map();
    this.isEnabled = true;
    this.suggestionsLimit = 5;
    this.maxDistance = 2;
    
    // Load user custom words
    this.loadCustomWords();
    
    // Initialize with current locale
    this.currentLocale = i18nEngine.currentLocale || 'en-US';
    
    // Listen for locale changes
    this.i18nEngine.addObserver((event, data) => {
      if (event === 'localeChanged') {
        this.currentLocale = data.newLocale;
      }
    });
  }

  /**
   * Check spelling of a word or text
   */
  checkSpelling(text) {
    if (!this.isEnabled || !text) {
      return { correct: true, suggestions: [], errors: [] };
    }
    
    const words = this.extractWords(text);
    const errors = [];
    const suggestions = [];
    
    words.forEach((word, index) => {
      if (this.shouldSkipWord(word)) {
        return; // Skip numbers, URLs, etc.
      }
      
      const result = this.checkWord(word);
      if (!result.correct) {
        errors.push({
          word: word,
          position: index,
          suggestions: result.suggestions
        });
        suggestions.push(...result.suggestions);
      }
    });
    
    return {
      correct: errors.length === 0,
      suggestions: [...new Set(suggestions)], // Remove duplicates
      errors: errors
    };
  }

  /**
   * Check spelling of a single word
   */
  checkWord(word) {
    const cleanWord = word.toLowerCase().trim();
    
    // Check in main dictionary
    if (this.isInDictionary(cleanWord)) {
      return { correct: true, suggestions: [] };
    }
    
    // Check in custom words
    if (this.customWords.has(cleanWord)) {
      return { correct: true, suggestions: [] };
    }
    
    // Check in user dictionary
    if (this.userDictionary.has(cleanWord)) {
      return { correct: true, suggestions: [] };
    }
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(cleanWord);
    
    return {
      correct: false,
      suggestions: suggestions
    };
  }

  /**
   * Check if word exists in dictionary
   */
  isInDictionary(word) {
    return this.i18nEngine.isWordInDictionary(word);
  }

  /**
   * Extract words from text
   */
  extractWords(text) {
    // Match words including medical terms with hyphens
    return text.match(/\b[a-zA-Zà-ÿÀ-ÿ][\wà-ÿÀ-ÿ-]*\b/g) || [];
  }

  /**
   * Check if word should be skipped (numbers, URLs, etc.)
   */
  shouldSkipWord(word) {
    // Skip numbers
    if (/^\d+$/.test(word)) return true;
    
    // Skip URLs
    if (/^https?:\/\//.test(word)) return true;
    
    // Skip email addresses
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(word)) return true;
    
    // Skip very short words (1-2 characters)
    if (word.length <= 2) return true;
    
    // Skip all caps (acronyms)
    if (word === word.toUpperCase() && word.length > 2) return true;
    
    return false;
  }

  /**
   * Generate spelling suggestions for a word
   */
  generateSuggestions(word) {
    const dictionary = this.i18nEngine.getDictionary();
    const suggestions = [];
    
    // Collect all dictionary words
    const allWords = [];
    for (const category of Object.values(dictionary)) {
      if (typeof category === 'object') {
        allWords.push(...Object.keys(category));
      }
    }
    
    // Add custom words
    allWords.push(...this.customWords);
    allWords.push(...this.userDictionary.keys());
    
    // Find similar words using Levenshtein distance
    for (const dictWord of allWords) {
      const distance = this.levenshteinDistance(word, dictWord);
      if (distance <= this.maxDistance && distance > 0) {
        suggestions.push({ word: dictWord, distance });
      }
    }
    
    // Sort by distance and return top suggestions
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.suggestionsLimit)
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
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Add word to user dictionary
   */
  addCustomWord(word, category = 'custom') {
    const cleanWord = word.toLowerCase().trim();
    this.customWords.add(cleanWord);
    this.saveCustomWords();
    
    // Also add to user dictionary with category
    this.userDictionary.set(cleanWord, {
      word: word,
      category: category,
      addedAt: new Date().toISOString()
    });
    
    console.log(`Added custom word: ${word} (${category})`);
  }

  /**
   * Remove word from user dictionary
   */
  removeCustomWord(word) {
    const cleanWord = word.toLowerCase().trim();
    this.customWords.delete(cleanWord);
    this.userDictionary.delete(cleanWord);
    this.saveCustomWords();
    
    console.log(`Removed custom word: ${word}`);
  }

  /**
   * Get all custom words
   */
  getCustomWords() {
    return Array.from(this.customWords);
  }

  /**
   * Load custom words from localStorage
   */
  loadCustomWords() {
    try {
      const stored = localStorage.getItem('atlas-spelling-custom-words');
      if (stored) {
        const words = JSON.parse(stored);
        this.customWords = new Set(words);
      }
      
      const userDict = localStorage.getItem('atlas-spelling-user-dictionary');
      if (userDict) {
        const dict = JSON.parse(userDict);
        this.userDictionary = new Map(Object.entries(dict));
      }
    } catch (error) {
      console.warn('Failed to load custom spelling words:', error);
    }
  }

  /**
   * Save custom words to localStorage
   */
  saveCustomWords() {
    try {
      localStorage.setItem('atlas-spelling-custom-words', 
        JSON.stringify(Array.from(this.customWords)));
      
      localStorage.setItem('atlas-spelling-user-dictionary', 
        JSON.stringify(Object.fromEntries(this.userDictionary)));
    } catch (error) {
      console.warn('Failed to save custom spelling words:', error);
    }
  }

  /**
   * Enable/disable spelling checker
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('atlas-spelling-enabled', enabled.toString());
  }

  /**
   * Get medical terminology suggestions
   */
  getMedicalSuggestions(word) {
    const dictionary = this.i18nEngine.getDictionary();
    const medicalTerms = [];
    
    // Focus on medical categories
    const medicalCategories = ['medical', 'anatomy', 'symptoms', 'treatments'];
    
    for (const category of medicalCategories) {
      if (dictionary[category]) {
        medicalTerms.push(...Object.keys(dictionary[category]));
      }
    }
    
    // Find similar medical terms
    const suggestions = [];
    for (const term of medicalTerms) {
      const distance = this.levenshteinDistance(word.toLowerCase(), term);
      if (distance <= this.maxDistance && distance > 0) {
        suggestions.push({ word: term, distance, category: 'medical' });
      }
    }
    
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.suggestionsLimit);
  }

  /**
   * Check if word is medical terminology
   */
  isMedicalTerm(word) {
    const dictionary = this.i18nEngine.getDictionary();
    const cleanWord = word.toLowerCase().trim();
    
    // Check in medical categories
    const medicalCategories = ['medical', 'anatomy', 'symptoms', 'treatments'];
    
    for (const category of medicalCategories) {
      if (dictionary[category] && dictionary[category][cleanWord]) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get word definition from dictionary
   */
  getWordDefinition(word) {
    const dictionary = this.i18nEngine.getDictionary();
    const cleanWord = word.toLowerCase().trim();
    
    for (const category of Object.values(dictionary)) {
      if (typeof category === 'object' && category[cleanWord]) {
        return {
          word: word,
          definition: category[cleanWord],
          category: this.getCategoryName(dictionary, cleanWord)
        };
      }
    }
    
    return null;
  }

  /**
   * Get category name for a word
   */
  getCategoryName(dictionary, word) {
    for (const [categoryName, category] of Object.entries(dictionary)) {
      if (typeof category === 'object' && category[word]) {
        return categoryName;
      }
    }
    return 'unknown';
  }

  /**
   * Import dictionary from file
   */
  async importDictionary(file) {
    try {
      const text = await file.text();
      const words = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      words.forEach(word => {
        this.addCustomWord(word, 'imported');
      });
      
      console.log(`Imported ${words.length} words from dictionary`);
      return true;
    } catch (error) {
      console.error('Failed to import dictionary:', error);
      return false;
    }
  }

  /**
   * Export custom dictionary
   */
  exportDictionary() {
    const words = Array.from(this.customWords).sort();
    const content = words.join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-spelling-dictionary-${this.currentLocale}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const dictionary = this.i18nEngine.getDictionary();
    let totalWords = 0;
    
    for (const category of Object.values(dictionary)) {
      if (typeof category === 'object') {
        totalWords += Object.keys(category).length;
      }
    }
    
    return {
      dictionaryWords: totalWords,
      customWords: this.customWords.size,
      userDictionaryWords: this.userDictionary.size,
      currentLocale: this.currentLocale,
      isEnabled: this.isEnabled
    };
  }

  /**
   * Reset to defaults
   */
  reset() {
    this.customWords.clear();
    this.userDictionary.clear();
    this.saveCustomWords();
    console.log('Spelling engine reset to defaults');
  }
}

// Create global instance
window.atlasSpelling = new SpellingEngine(window.atlasI18n);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpellingEngine;
}
