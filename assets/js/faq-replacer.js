// SINTOMARIO.ORG - FAQ Replacer System
// Replaces generic FAQ responses with specific, contextual answers

(function() {
  // Load FAQ responses database
  let faqDB = null;
  
  // Load FAQ responses from JSON
  async function loadFAQResponses() {
    try {
      const response = await fetch('/assets/data/faq-responses.json');
      faqDB = await response.json();
    } catch (error) {
      console.error('Error loading FAQ responses:', error);
      faqDB = {};
    }
  }
  
  // Extract context from URL path
  function getContextFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    
    // Extract zone and context from path like /cuerpo/vesicula/verguenza/
    const zoneIndex = parts.indexOf('cuerpo') + 1;
    const contextIndex = parts.indexOf('cuerpo') + 2;
    
    if (zoneIndex < parts.length && contextIndex < parts.length) {
      return {
        zone: parts[zoneIndex],
        context: parts[contextIndex]
      };
    }
    
    return null;
  }
  
  // Generate specific FAQ questions for context
  function generateFAQQuestions(context) {
    const baseQuestions = {
      "verguenza": [
        "¿Por qué la vergüenza afecta específicamente a esta zona corporal?",
        "¿Es normal sentir tensión física cuando me siento avergonzado?",
        "¿Cómo puedo trabajar la vergüenza sin que se manifieste físicamente?"
      ],
      "ansiedad": [
        "¿Por qué la ansiedad se manifiesta principalmente en esta zona?",
        "¿Es normal tener síntomas físicos constantes con ansiedad?",
        "¿Cómo puedo calmar mi cuerpo cuando la mente no se detiene?"
      ],
      "trauma": [
        "¿Por qué el trauma no procesado afecta a esta zona?",
        "¿Pueden los síntomas físicos ser señales de trauma antiguo?",
        "¿Cómo puedo 'digerir' emocionalmente experiencias difíciles?"
      ],
      "miedo": [
        "¿Por qué el miedo paraliza físicamente esta zona?",
        "¿Es normal tener reacciones físicas cuando estoy asustado?",
        "¿Cómo puedo diferenciar el miedo real del imaginario en mi cuerpo?"
      ],
      "tristeza": [
        "¿Por qué la tristeza no expresada afecta a esta zona?",
        "¿Es normal sentir el cuerpo 'pesado' cuando estoy triste?",
        "¿Cómo puedo procesar el duelo sin sentirme abrumado?"
      ],
      "rabia": [
        "¿Por qué la rabia no expresada causa problemas físicos?",
        "¿Es normal tener síntomas cuando estoy enojado?",
        "¿Cómo puedo canalizar la rabia de forma saludable?"
      ],
      "abandono": [
        "¿Por qué el sentimiento de abandono afecta físicamente esta zona?",
        "¿Pueden los síntomas físicos ser señales de soledad?",
        "¿Cómo puedo sanar el abandono sin depender de otros?"
      ]
    };
    
    return baseQuestions[context] || [
      "¿Qué significa esta combinación de zona y emoción?",
      "¿Es normal tener síntomas físicos con este contexto?",
      "¿Cómo puedo trabajar esta conexión mente-cuerpo?"
    ];
  }
  
  // Generate specific FAQ response for context
  function generateFAQResponse(zone, context) {
    if (faqDB && faqDB[context]) {
      return faqDB[context].response;
    }
    
    // Fallback generic responses
    const fallbackResponses = {
      "verguenza": `La vergüenza en ${zone} representa momentos donde uno se sintió defectuoso o inadecuado. El cuerpo está reteniendo experiencias que no fueron procesadas emocionalmente. La práctica recomendada es identificar situaciones recientes de vergüenza y ofrecerle a esa parte de usted el mismo reconocimiento que ofrecería a un niño pequeño: validez sin juicio.`,
      
      "ansiedad": `La ansiedad en ${zone} se manifiesta como tensión y pensamientos acelerados. El cuerpo está tratando de resolver múltiples escenarios futuros simultáneamente. La práctica consiste en elegir una preocupación dominante y crear un plan concreto para manejarla, dándole así al cerebro una tarea específica en lugar de mantenerlo en alerta generalizada.`,
      
      "trauma": `El trauma en ${zone} representa experiencias no procesadas que el cuerpo sigue cargando. Esta zona está expresando lo que la mente no pudo integrar. La práctica es escribir una carta a su versión más joven explicándole que ahora usted tiene los recursos que entonces le faltaban, permitiendo que el cuerpo suelte la tensión.`,
      
      "miedo": `El miedo en ${zone} representa una contracción que impide el flujo normal. El cuerpo está en modo supervivencia, tratando de conservar energía para una amenaza percibida. La práctica es identificar qué específico teme y crear un plan de tres pasos para manejarlo, diciéndole al cuerpo: 'Estoy preparado, puedes relajarte'.`,
      
      "tristeza": `La tristeza en ${zone} representa lágrimas no lloradas y duelos no procesados. Esta zona está cargando emociones que no encontraron salida. La práctica es permitirse expresar el duelo sin juicio, ya sea llorando o escribiendo lo que extraña y lo que aprendió de esas pérdidas.`,
      
      "rabia": `La rabia en ${zone} representa energía que no encuentra salida adecuada. El cuerpo está produciendo 'fuego' pero no puede dirigirlo constructivamente. La práctica es identificar qué injusticia activa su rabia y escribir una carta explicando claramente qué necesita y qué límites establece.`,
      
      "abandono": `El abandono en ${zone} representa vacíos emocionales que el cuerpo intenta 'llenar' con tensión. El cuerpo aprendió a contraerse para evitar más pérdidas. La práctica es identificar momentos de abandono y escribir tres maneras en que usted ahora se cuida a sí mismo.`
    };
    
    return fallbackResponses[context] || `La combinación de ${zone} y ${context} representa una conexión específica entre mente y cuerpo. Esta zona está expresando algo que el contexto emocional no pudo procesar completamente. La práctica recomendada es observar cuándo aparecen los síntomas y qué situaciones los activan, creando así un mapa de su lenguaje corporal personal.`;
  }
  
  // Replace generic FAQ section with specific content
  function replaceFAQSection() {
    const context = getContextFromPath();
    if (!context) return;
    
    // Find FAQ section
    const faqSections = document.querySelectorAll('section, article, div');
    let faqSection = null;
    
    for (const section of faqSections) {
      const heading = section.querySelector('h2, h3');
      if (heading && heading.textContent.toLowerCase().includes('preguntas frecuentes')) {
        faqSection = section;
        break;
      }
    }
    
    if (!faqSection) {
      // Create FAQ section if it doesn't exist
      faqSection = document.createElement('section');
      faqSection.className = 'card';
      
      const mainContent = document.querySelector('main, .main-content');
      if (mainContent) {
        mainContent.appendChild(faqSection);
      }
    }
    
    // Generate specific FAQ content
    const questions = generateFAQQuestions(context.context);
    const response = generateFAQResponse(context.zone, context.context);
    
    // Update FAQ section with specific content
    faqSection.innerHTML = `
      <h2>Preguntas Frecuentes</h2>
      <div class="faq-content">
        <div class="faq-main-response">
          <h3>¿Qué significa esta combinación?</h3>
          <p>${response}</p>
        </div>
        <div class="faq-additional-questions">
          <h4>Otras preguntas comunes:</h4>
          <ul>
            ${questions.slice(1).map(q => `<li><strong>${q}</strong></li>`).join('')}
          </ul>
        </div>
        <div class="faq-disclaimer">
          <p class="muted">Esta respuesta se basa en la perspectiva psicosomática y no reemplaza el consejo médico profesional. Cada persona puede experimentar estas conexiones de manera única.</p>
        </div>
      </div>
    `;
    
    console.log(`Replaced FAQ for: ${context.zone}/${context.context}`);
  }
  
  // Initialize when DOM is ready
  async function init() {
    await loadFAQResponses();
    replaceFAQSection();
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
