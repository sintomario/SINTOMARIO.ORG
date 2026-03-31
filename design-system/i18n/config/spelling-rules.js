/**
 * Atlas Somático Editorial - Spelling Rules Configuration
 * Language-specific spelling rules and validation patterns
 */

const SPELLING_RULES = {
  // Spanish spelling rules
  'es-ES': {
    // Character patterns and rules
    patterns: {
      // Vowel patterns with accents
      vowels: {
        acute: ['á', 'é', 'í', 'ó', 'ú'],
        grave: ['à', 'è', 'ì', 'ò', 'ù'],
        dieresis: ['ä', 'ë', 'ï', 'ö', 'ü'],
        all: ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'ü']
      },
      
      // Consonant patterns
      consonants: {
        special: ['ñ', 'll', 'rr', 'ch'],
        silent: ['h'],
        strong: ['b', 'v', 'g', 'j', 'c', 'z', 's'],
        soft: ['d', 't', 'f', 'l', 'm', 'n', 'p', 'q', 'r', 'x', 'y']
      },
      
      // Punctuation and special characters
      punctuation: {
        opening: ['¿', '¡', '"', "'", '«', '‹'],
        closing: ['?', '!', '"', "'", '»', '›'],
        all: ['¿', '¡', '?', '!', '"', "'", '«', '»', '‹', '›', '.', ',', ';', ':', '-', '—']
      }
    },

    // Spelling rules
    rules: {
      // Accent rules
      accents: {
        // Words ending in -n, -s, or vowel need accent if stress is on antepenultimate syllable
        agudas: (word) => {
          const lastChar = word.slice(-1);
          const hasAccent = /[áéíóú]/.test(word);
          const stressOnLast = /[aeiouáéíóú][bcdfghjklmnñopqrstvwxyz]*$/.test(word);
          
          return (['n', 's', 'a', 'e', 'i', 'o', 'u'].includes(lastChar) && stressOnLast && !hasAccent) ||
                 (!['n', 's', 'a', 'e', 'i', 'o', 'u'].includes(lastChar) && !stressOnLast && hasAccent);
        },
        
        // Words with stress on penultimate syllable
        graves: (word) => {
          // Complex rules for graves (llanas)
          return false; // Simplified for now
        },
        
        // Words with stress on antepenultimate syllable
        esdrújulas: (word) => {
          // Always need accent
          return !/[áéíóú]/.test(word);
        }
      },
      
      // B/V rules
      bvRules: {
        // B after m, b
        bAfterM: (word) => /^m[b]/.test(word),
        
        // V in most other cases
        vDefault: (word) => !/^[mb]/.test(word) && !/[bñ]/.test(word),
        
        // Special cases
        exceptions: ['bueno', 'vivienda', 'haber', 'hervir', 'saber', 'cabeza']
      },
      
      // G/J rules
      gjRules: {
        // G before e, i (soft sound)
        gSoft: (word) => /[g][ei]/.test(word),
        
        // J before e, i (hard sound)
        jHard: (word) => /[j][ei]/.test(word),
        
        // G before a, o, u (hard sound)
        gHard: (word) => /[g][aou]/.test(word)
      },
      
      // C/Z/S rules
      czsRules: {
        // C before e, i (th sound in Spain, s sound in Latin America)
        cSoft: (word) => /[c][ei]/.test(word),
        
        // Z before a, o, u (th sound in Spain, s sound in Latin America)
        zHard: (word) => /[z][aou]/.test(word),
        
        // S in most other cases
        sDefault: (word) => /^[^cz]/.test(word)
      },
      
      // H rules (always silent)
      hRules: {
        // H at beginning of word
        hInitial: (word) => /^h/.test(word),
        
        // H in middle of word (rare)
        hMiddle: (word) => /[a-z]h[a-z]/.test(word),
        
        // Exceptions (no h where expected)
        exceptions: ['órgano', 'hueco', 'huevo', 'hueso', 'huir']
      }
    },

    // Common spelling mistakes and corrections
    commonMistakes: {
      'b': ['v', 'p'],
      'v': ['b', 'w'],
      'g': ['j', 'x'],
      'j': ['g', 'x'],
      'c': ['s', 'z'],
      's': ['c', 'z', 'x'],
      'z': ['s', 'c'],
      'h': [''], // Missing h
      '': ['h'], // Extra h
      'll': ['y'],
      'y': ['ll', 'i'],
      'ñ': ['n'],
      'n': ['ñ']
    },

    // Medical terminology specific rules
    medical: {
      // Common medical terms in Spanish
      terms: [
        'soma', 'somático', 'terapia', 'tratamiento', 'síntoma', 'diagnóstico',
        'paciente', 'médico', 'enfermera', 'hospital', 'clínica', 'medicina',
        'dolor', 'doloroso', 'dolorosa', 'agudo', 'crónico', 'aguda', 'crónica',
        'cabeza', 'cuello', 'hombro', 'pecho', 'espalda', 'abdomen', 'pelvis',
        'músculo', 'hueso', 'articulación', 'tendón', 'ligamento', 'nervio',
        'corazón', 'pulmón', 'hígado', 'riñón', 'estómago', 'intestino',
        'cerebro', 'mente', 'conciencia', 'emoción', 'sentimiento', 'estrés',
        'ansiedad', 'depresión', 'fatiga', 'insomnio', 'migraña', 'tensión'
      ],
      
      // Medical abbreviations
      abbreviations: {
        'dr': 'doctor',
        'dra': 'doctora',
        'sr': 'señor',
        'sra': 'señora',
        'etc': 'etcétera',
        'ap': 'presión arterial',
        'fc': 'frecuencia cardíaca',
        'fr': 'frecuencia respiratoria'
      }
    }
  },

  // English spelling rules
  'en-US': {
    patterns: {
      vowels: {
        short: ['a', 'e', 'i', 'o', 'u'],
        long: ['ā', 'ē', 'ī', 'ō', 'ū'],
        diphthongs: ['ai', 'ei', 'oi', 'au', 'ou', 'ea', 'ee', 'oo'],
        all: ['a', 'e', 'i', 'o', 'u', 'y']
      },
      
      consonants: {
        voiced: ['b', 'd', 'g', 'j', 'l', 'm', 'n', 'r', 'v', 'w', 'z'],
        voiceless: ['p', 't', 'k', 'f', 'h', 's', 'x', 'ch', 'sh', 'th'],
        digraphs: ['ch', 'sh', 'th', 'ph', 'wh', 'ng', 'ck', 'gh']
      },
      
      silent: {
        consonants: ['k', 'p', 't', 'w', 'b', 'l', 'h'],
        vowels: ['e'],
        patterns: ['gh', 'mb', 'gn', 'kn', 'ps', 'pt', 'rh', 'sc', 'wr']
      }
    },

    rules: {
      // I before E except after C
      ieRule: {
        iBeforeE: (word) => /ie/.test(word) && !/c[ie]/.test(word),
        eBeforeI: (word) => /ei/.test(word) && !/c[ei]/.test(word),
        cBeforeEI: (word) => /cei/.test(word),
        exceptions: ['weird', 'height', 'foreign', 'science', 'ancient', 'caffeine']
      },
      
      // Pluralization rules
      pluralization: {
        regular: (word) => word + 's',
        esEnding: (word) => /([sxz]|sh|ch)$/.test(word) ? word + 'es' : word + 's',
        yToIes: (word) => /[^aeiou]y$/.test(word) ? word.slice(0, -1) + 'ies' : word + 's',
        fToVes: (word) => /[fl]f$/.test(word) ? word.slice(0, -1) + 'ves' : word + 's',
        irregular: {
          'child': 'children',
          'person': 'people',
          'man': 'men',
          'woman': 'women',
          'tooth': 'teeth',
          'foot': 'feet',
          'mouse': 'mice',
          'goose': 'geese'
        }
      },
      
      // Doubling rules
      doubling: {
        cvcPattern: (word) => /([bcdfghjklmnpqrstvwxyz])([aeiou])(\2)$/.test(word),
        exceptions: ['bus', 'gas', 'quiz', 'yes', 'no', 'if', 'of', 'in', 'on', 'at', 'by', 'my', 'so', 'up', 'us', 'as', 'is', 'it', 'its']
      },
      
      // Silent E rules
      silentE: {
        dropE: (word, suffix) => word.endsWith('e') && !['ce', 'ge', 'se', 'ze'].includes(word.slice(-2)) && !suffix.startsWith('a'),
        keepE: (word, suffix) => word.endsWith('e') && (['ce', 'ge', 'se', 'ze'].includes(word.slice(-2)) || suffix.startsWith('a'))
      }
    },

    commonMistakes: {
      'ie': ['ei'],
      'ei': ['ie'],
      'their': ['there', 'they\'re'],
      'there': ['their', 'they\'re'],
      'they\'re': ['their', 'there'],
      'its': ['it\'s'],
      'it\'s': ['its'],
      'your': ['you\'re'],
      'you\'re': ['your'],
      'who': ['whom'],
      'whom': ['who'],
      'affect': ['effect'],
      'effect': ['affect'],
      'accept': ['except'],
      'except': ['accept'],
      'advice': ['advise'],
      'advise': ['advice'],
      'loose': ['lose'],
      'lose': ['loose']
    },

    medical: {
      terms: [
        'somatic', 'therapy', 'treatment', 'symptom', 'diagnosis', 'patient',
        'doctor', 'nurse', 'hospital', 'clinic', 'medicine', 'healthcare',
        'pain', 'painful', 'acute', 'chronic', 'headache', 'tension', 'fatigue',
        'head', 'neck', 'shoulder', 'chest', 'back', 'abdomen', 'pelvis',
        'muscle', 'bone', 'joint', 'tendon', 'ligament', 'nerve',
        'heart', 'lung', 'liver', 'kidney', 'stomach', 'intestine',
        'brain', 'mind', 'consciousness', 'emotion', 'feeling', 'stress',
        'anxiety', 'depression', 'insomnia', 'migraine', 'discomfort'
      ],
      
      abbreviations: {
        'dr': 'doctor',
        'rn': 'registered nurse',
        'bp': 'blood pressure',
        'hr': 'heart rate',
        'rr': 'respiratory rate',
        'etc': 'et cetera',
        'vs': 'vital signs'
      }
    }
  },

  // Portuguese spelling rules
  'pt-BR': {
    patterns: {
      vowels: {
        oral: ['a', 'e', 'i', 'o', 'u'],
        nasal: ['ã', 'õ', 'â', 'ê', 'î', 'ô', 'û'],
        accented: ['á', 'é', 'í', 'ó', 'ú', 'à', 'â', 'ê', 'î', 'ô', 'û'],
        all: ['a', 'e', 'i', 'o', 'u', 'á', 'é', 'í', 'ó', 'ú', 'à', 'â', 'ê', 'î', 'ô', 'û', 'ã', 'õ']
      },
      
      consonants: {
        special: ['nh', 'lh', 'ch', 'rr', 'ss'],
        nasal: ['m', 'n'],
        guttural: ['g', 'r', 'rr'],
        sibilant: ['s', 'ss', 'ç', 'x', 'z', 'j']
      },
      
      digraphs: {
        nasal: ['am', 'an', 'em', 'en', 'im', 'in', 'om', 'on', 'um', 'un'],
        consonantal: ['ch', 'lh', 'nh', 'rr', 'ss']
      }
    },

    rules: {
      // Accent rules
      accents: {
        // Oxítonas (stress on last syllable)
        oxitonas: (word) => {
          const lastChar = word.slice(-1);
          const hasAccent = /[áéíóúâêîôû]/.test(word);
          const needsAccent = ['a', 'e', 'o', 'as', 'es', 'os', 'em', 'ens'].includes(lastChar);
          return needsAccent && !hasAccent;
        },
        
        // Paroxítonas (stress on penultimate syllable)
        paroxitonas: (word) => {
          const hasAccent = /[áéíóúâêîôû]/.test(word);
          const exceptions = ['a', 'e', 'o', 'as', 'es', 'os', 'em', 'ens'];
          const lastChar = word.slice(-1);
          return !exceptions.includes(lastChar) && !hasAccent;
        },
        
        // Proparoxítonas (stress on antepenultimate syllable)
        proparoxitonas: (word) => {
          return !/[áéíóúâêîôû]/.test(word);
        }
      },
      
      // M/N nasalization
      nasalization: {
        mBeforePB: (word) => /[m][pb]/.test(word),
        nBeforeConsonant: (word) => /[n][bcdfghjklmnpqrstvwxyz]/.test(word),
        tildeVowels: (word) => /[ãõ]/.test(word)
      },
      
      // C/Ç/S rules
      cscRules: {
        cBeforeAEIOU: (word) => /[c][aeiou]/.test(word),
        cedilhaBeforeCEIO: (word) => /[ç][ceio]/.test(word),
        sDefault: (word) => !/[cç]/.test(word)
      },
      
      // G/J rules
      gjRules: {
        gBeforeAEIOU: (word) => /[g][aeiou]/.test(word),
        jDefault: (word) => !/[g]/.test(word)
      }
    },

    commonMistakes: {
      'ç': ['c', 's', 'ss', 'x'],
      'c': ['ç', 's', 'ss', 'x'],
      's': ['c', 'ç', 'ss', 'x', 'z'],
      'ss': ['s', 'c', 'ç', 'x', 'z'],
      'x': ['s', 'ss', 'c', 'ç', 'z'],
      'z': ['s', 'ss', 'x', 'c', 'ç'],
      'nh': ['n'],
      'lh': ['l'],
      'ch': ['x'],
      'rr': ['r'],
      'á': ['a'],
      'â': ['a'],
      'ã': ['a'],
      'é': ['e'],
      'ê': ['e'],
      'í': ['i'],
      'ó': ['o'],
      'ô': ['o'],
      'õ': ['o'],
      'ú': ['u'],
      'û': ['u']
    },

    medical: {
      terms: [
        'soma', 'somático', 'terapia', 'tratamento', 'sintoma', 'diagnóstico',
        'paciente', 'médico', 'enfermeira', 'hospital', 'clínica', 'medicina',
        'dor', 'doloroso', 'dolorosa', 'agudo', 'crônico', 'aguda', 'crônica',
        'cabeça', 'pescoço', 'ombro', 'peito', 'costas', 'abdômen', 'pelve',
        'músculo', 'osso', 'articulação', 'tendão', 'ligamento', 'nervo',
        'coração', 'pulmão', 'fígado', 'rim', 'estômago', 'intestino',
        'cérebro', 'mente', 'consciência', 'emoção', 'sentimento', 'estresse',
        'ansiedade', 'depressão', 'fadiga', 'insônia', 'enxaqueca', 'tensão'
      ],
      
      abbreviations: {
        'dr': 'doutor',
        'dra': 'doutora',
        'sr': 'senhor',
        'sra': 'senhora',
        'etc': 'etcetera',
        'pa': 'pressão arterial',
        'fc': 'frequência cardíaca',
        'fr': 'frequência respiratoria'
      }
    }
  }
};

// Spelling rules helper functions
const SpellingRulesHelper = {
  /**
   * Get spelling rules for a locale
   */
  getRules(locale) {
    return SPELLING_RULES[locale] || SPELLING_RULES['en-US'];
  },

  /**
   * Get patterns for a locale
   */
  getPatterns(locale) {
    const rules = this.getRules(locale);
    return rules.patterns || {};
  },

  /**
   * Check if a word follows specific spelling rule
   */
  checkRule(word, ruleName, locale) {
    const rules = this.getRules(locale);
    const rule = rules.rules[ruleName];
    
    if (!rule) return true;
    
    if (typeof rule === 'function') {
      return rule(word);
    }
    
    return true;
  },

  /**
   * Get common mistakes for a locale
   */
  getCommonMistakes(locale) {
    const rules = this.getRules(locale);
    return rules.commonMistakes || {};
  },

  /**
   * Get medical terms for a locale
   */
  getMedicalTerms(locale) {
    const rules = this.getRules(locale);
    return rules.medical ? rules.medical.terms || [] : [];
  },

  /**
   * Get medical abbreviations for a locale
   */
  getMedicalAbbreviations(locale) {
    const rules = this.getRules(locale);
    return rules.medical ? rules.medical.abbreviations || {} : {};
  },

  /**
   * Check if word contains medical terminology
   */
  isMedicalTerm(word, locale) {
    const medicalTerms = this.getMedicalTerms(locale);
    const normalizedWord = word.toLowerCase().trim();
    return medicalTerms.includes(normalizedWord);
  },

  /**
   * Expand medical abbreviations
   */
  expandAbbreviation(word, locale) {
    const abbreviations = this.getMedicalAbbreviations(locale);
    const normalizedWord = word.toLowerCase().trim().replace('.', '');
    
    return abbreviations[normalizedWord] || word;
  },

  /**
   * Validate word against spelling patterns
   */
  validatePatterns(word, locale) {
    const patterns = this.getPatterns(locale);
    const results = {};
    
    for (const [category, patternList] of Object.entries(patterns)) {
      results[category] = {};
      
      for (const [patternName, patternItems] of Object.entries(patternList)) {
        if (Array.isArray(patternItems)) {
          results[category][patternName] = patternItems.some(pattern => 
            word.toLowerCase().includes(pattern.toLowerCase())
          );
        }
      }
    }
    
    return results;
  },

  /**
   * Get suggestions for common mistakes
   */
  getCommonMistakeSuggestions(word, locale) {
    const mistakes = this.getCommonMistakes(locale);
    const suggestions = [];
    
    for (const [correct, mistakesList] of Object.entries(mistakes)) {
      for (const mistake of mistakesList) {
        if (word.toLowerCase().includes(mistake.toLowerCase())) {
          suggestions.push(word.replace(new RegExp(mistake, 'gi'), correct));
        }
      }
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  },

  /**
   * Check accent rules for Spanish/Portuguese
   */
  checkAccentRules(word, locale) {
    if (!['es-ES', 'pt-BR', 'pt-PT'].includes(locale)) {
      return { valid: true, rule: null };
    }
    
    const rules = this.getRules(locale);
    const accentRules = rules.rules.accents;
    
    for (const [ruleName, rule] of Object.entries(accentRules)) {
      if (typeof rule === 'function' && !rule(word)) {
        return { valid: false, rule: ruleName };
      }
    }
    
    return { valid: true, rule: null };
  },

  /**
   * Check if word has valid characters for locale
   */
  validateCharacters(word, locale) {
    const patterns = this.getPatterns(locale);
    const validChars = [];
    
    // Collect all valid characters
    if (patterns.vowels && patterns.vowels.all) {
      validChars.push(...patterns.vowels.all);
    }
    
    if (patterns.consonants) {
      for (const consonantList of Object.values(patterns.consonants)) {
        if (Array.isArray(consonantList)) {
          validChars.push(...consonantList);
        }
      }
    }
    
    if (patterns.punctuation && patterns.punctuation.all) {
      validChars.push(...patterns.punctuation.all);
    }
    
    // Add basic ASCII characters
    validChars.push(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''));
    
    const validPattern = new RegExp(`^[${validChars.join('')}\\s]+$`);
    return validPattern.test(word);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SPELLING_RULES, SpellingRulesHelper };
}

// Global assignment for browser use
if (typeof window !== 'undefined') {
  window.SPELLING_RULES = SPELLING_RULES;
  window.SpellingRulesHelper = SpellingRulesHelper;
}
