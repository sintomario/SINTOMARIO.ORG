// SINTOMARIO.ORG - Dynamic Clicker System
// Uses normalized search-index.json for dynamic word generation

(function() {
  let searchData = null;
  let clickerData = null;
  
  // Load normalized search data
  async function loadClickerData() {
    try {
      const response = await fetch('/search-index-normalized.json');
      searchData = await response.json();
      generateClickerData();
      initializeClicker();
      console.log('Dynamic clicker data loaded successfully');
    } catch (error) {
      console.error('Error loading clicker data:', error);
      // Fallback to hardcoded data
      initializeFallbackClicker();
    }
  }
  
  // Generate clicker data from normalized search index
  function generateClickerData() {
    clickerData = {
      "NERVIOSO": [],
      "ÓSEO": [],
      "CIRCULATORIO": [],
      "MUSCULAR": [],
      "DIGESTIVO": [],
      "PSÍQUICO": [],
      "EMOCIONAL": [],
      "PERCEPTUAL": [],
      "MATERNO": []
    };
    
    // Map entities to systems
    const entityToSystem = {
      'cabeza': 'NERVIOSO',
      'ojos': 'NERVIOSO',
      'oidos': 'NERVIOSO',
      'sistema_nervioso': 'NERVIOSO',
      
      'columna': 'ÓSEO',
      'rodillas': 'ÓSEO',
      'hombros': 'ÓSEO',
      'brazos': 'ÓSEO',
      'manos': 'ÓSEO',
      'pies': 'ÓSEO',
      'sistema_oseo': 'ÓSEO',
      
      'corazon': 'CIRCULATORIO',
      'pulmones': 'CIRCULATORIO',
      'pecho': 'CIRCULATORIO',
      'sangre': 'CIRCULATORIO',
      'sistema_circulatorio': 'CIRCULATORIO',
      
      'cuello': 'MUSCULAR',
      'brazos': 'MUSCULAR',
      'manos': 'MUSCULAR',
      'abdomen': 'MUSCULAR',
      'piernas': 'MUSCULAR',
      'sistema_muscular': 'MUSCULAR',
      
      'estomago': 'DIGESTIVO',
      'higado': 'DIGESTIVO',
      'vesicula': 'DIGESTIVO',
      'boca': 'DIGESTIVO',
      'sistema_digestivo': 'DIGESTIVO',
      
      'cabeza': 'PSÍQUICO',
      'sistema_nervioso': 'PSÍQUICO',
      
      'corazon': 'EMOCIONAL',
      'pecho': 'EMOCIONAL',
      'piel': 'EMOCIONAL',
      'sistema_endocrino': 'EMOCIONAL',
      
      'ojos': 'PERCEPTUAL',
      'oidos': 'PERCEPTUAL',
      'nariz': 'PERCEPTUAL',
      'piel': 'PERCEPTUAL',
      'sistema_respiratorio': 'PERCEPTUAL',
      
      'pelvis': 'MATERNO',
      'sistema_endocrino': 'MATERNO'
    };
    
    // Generate word combinations from nodes
    searchData.nodes.forEach(node => {
      const entity = searchData.entities[node.e];
      const context = searchData.contexts[node.c];
      const system = entityToSystem[node.e];
      
      if (system && entity && context) {
        // Create display text from entity name
        let displayText = entity.name;
        
        // Add variety by sometimes using context
        if (Math.random() > 0.7) {
          displayText = context.name;
        }
        
        // Check if this combination already exists
        const exists = clickerData[system].some(word => word.s === node.s);
        if (!exists && clickerData[system].length < 7) {
          clickerData[system].push({
            t: displayText,
            s: node.s
          });
        }
      }
    });
    
    // Ensure each system has at least 7 words
    Object.keys(clickerData).forEach(system => {
      while (clickerData[system].length < 7) {
        // Add some generic words if needed
        const genericWords = {
          'NERVIOSO': ['Estrés', 'Ansiedad', 'Migraña', 'Tensión', 'Cansancio', 'Insomnio', 'Vértigo'],
          'ÓSEO': ['Dolor', 'Rigidez', 'Articulaciones', 'Columna', 'Fractura', 'Osteoporosis', 'Estructura'],
          'CIRCULATORIO': ['Corazón', 'Presión', 'Circulación', 'Pulso', 'Sangre', 'Arterias', 'Venas'],
          'MUSCULAR': ['Músculos', 'Tensión', 'Calambres', 'Fatiga', 'Fuerza', 'Flexibilidad', 'Dolor'],
          'DIGESTIVO': ['Estómago', 'Digestión', 'Acidez', 'Gases', 'Colon', 'Hígado', 'Vesícula'],
          'PSÍQUICO': ['Mente', 'Pensamiento', 'Memoria', 'Concentración', 'Estrés', 'Ansiedad', 'Depresión'],
          'EMOCIONAL': ['Emociones', 'Sentimientos', 'Corazón', 'Amor', 'Tristeza', 'Alegría', 'Miedo'],
          'PERCEPTUAL': ['Sentidos', 'Percepción', 'Visión', 'Audición', 'Tacto', 'Olfato', 'Gusto'],
          'MATERNO': ['Fertilidad', 'Maternidad', 'Hormonas', 'Ciclo', 'Gestación', 'Nacimiento', 'Lactancia']
        };
        
        const wordPool = genericWords[system] || ['Síntoma'];
        const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
        const randomContext = Object.keys(searchData.contexts)[Math.floor(Math.random() * Object.keys(searchData.contexts).length)];
        const randomEntity = Object.keys(searchData.entities)[Math.floor(Math.random() * Object.keys(searchData.entities).length)];
        
        clickerData[system].push({
          t: randomWord,
          s: `${randomEntity}/${randomContext}`
        });
      }
    });
    
    console.log('Generated clicker data:', clickerData);
  }
  
  // Initialize clicker with dynamic data
  function initializeClicker() {
    if (!clickerData) return;
    
    // Update global WORDS object
    window.CLICKER_WORDS = clickerData;
    
    // Reinitialize clicker if it exists
    if (window.reinitClicker) {
      window.reinitClicker();
    }
  }
  
  // Fallback to hardcoded data
  function initializeFallbackClicker() {
    console.warn('Using fallback clicker data');
    window.CLICKER_WORDS = {
      "NERVIOSO": [{ t: "Cerebro", s: "cabeza/ansiedad" }, { t: "Ojos", s: "ojos/negacion" }, { t: "Oídos", s: "oidos/no-escuchar" }, { t: "N. Vago", s: "nervios/estres" }, { t: "Migraña", s: "cabeza/migrana" }, { t: "Insomnio", s: "sueno/insomnio" }, { t: "Vértigo", s: "cabeza/vertigo" }],
      "ÓSEO": [{ t: "Columna", s: "columna/abandono" }, { t: "Rodilla", s: "rodilla/conflicto" }, { t: "Cadera", s: "cadera/miedo" }, { t: "Cervicales", s: "cuello/rigidez" }, { t: "Mandíbula", s: "cabeza/tension" }, { t: "Articulaciones", s: "articulaciones/identidad" }, { t: "Dientes", s: "boca/decision" }],
      "CIRCULATORIO": [{ t: "Corazón", s: "corazon/tristeza" }, { t: "Pulmones", s: "pulmones/ahogo" }, { t: "Pecho", s: "pecho/ansiedad" }, { t: "Presión", s: "presion/control" }, { t: "Taquicardia", s: "corazon/panico" }, { t: "Circulación", s: "circulacion/miedo" }, { t: "Inflamación", s: "inflamacion/agotamiento" }],
      "MUSCULAR": [{ t: "Hombros", s: "hombro/responsabilidad" }, { t: "Cuello", s: "cuello/estres" }, { t: "Espalda", s: "espalda/miedo" }, { t: "Mandíbula", s: "cabeza/rabia" }, { t: "Tendones", s: "tendones/carga" }, { t: "Músculos", s: "musculos/trauma" }, { t: "Core", s: "columna/resistencia" }],
      "PSÍQUICO": [{ t: "Cerebro", s: "cabeza/obsesion" }, { t: "Memoria", s: "memoria/confusion" }, { t: "Ansiedad", s: "cabeza/ansiedad" }, { t: "Sueño", s: "sueno/fobia" }, { t: "Fatiga", s: "fatiga/toc" }, { t: "Estrés", s: "cabeza/burnout" }, { t: "Cerebro", s: "cabeza/disociacion" }],
      "DIGESTIVO": [{ t: "Estómago", s: "estomago/rabia" }, { t: "Colon", s: "colon/injusticia" }, { t: "Hígado", s: "higado/frustracion" }, { t: "Vesícula", s: "vesicula/represion" }, { t: "Intestinos", s: "intestinos/soltar" }, { t: "Boca", s: "boca/autoexigencia" }, { t: "Garganta", s: "garganta/expresion" }],
      "EMOCIONAL": [{ t: "Corazón", s: "corazon/liberacion" }, { t: "Pecho", s: "pecho/abandono" }, { t: "Cerebro", s: "cabeza/castigo" }, { t: "Piel", s: "piel/exposicion" }, { t: "Fatiga", s: "fatiga/desconexion" }, { t: "Sueño", s: "sueno/rechazo" }, { t: "Garganta", s: "garganta/represion" }],
      "PERCEPTUAL": [{ t: "Piel", s: "piel/limites" }, { t: "Acné", s: "acne/autoestima" }, { t: "Dermatitis", s: "dermatitis/rabia" }, { t: "Piel", s: "piel/proteccion" }, { t: "Nariz", s: "nariz/intuicion" }, { t: "Piel", s: "piel/miedo" }, { t: "Piel", s: "piel/conflicto" }],
      "MATERNO": [{ t: "Fertilidad", s: "fertilidad/concepcion" }, { t: "Fertilidad", s: "fertilidad/creacion" }, { t: "Menstruación", s: "menstruacion/ciclo" }, { t: "Ovarios", s: "ovarios/femenidad" }, { t: "Area Reproductiva", s: "area-reproductiva/gestacion" }, { t: "Pecho", s: "pecho/nutricion" }, { t: "Hormonas", s: "hormonas/transformacion" }]
    };
  }
  
  // Start loading when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadClickerData);
  } else {
    loadClickerData();
  }
})();
