// SINTOMARIO.ORG - Data Consistency Validator
// Validates consistency between search-index.json and faq-responses.json

(function() {
  let validationResults = null;
  
  // Load and validate data consistency
  async function validateDataConsistency() {
    try {
      console.log('Starting data consistency validation...');
      
      // Load all data files
      const [searchResponse, faqResponse] = await Promise.all([
        fetch('/search-index-normalized.json'),
        fetch('/assets/data/faq-responses-expanded.json')
      ]);
      
      const searchData = await searchResponse.json();
      const faqData = await faqResponse.json();
      
      validationResults = {
        timestamp: new Date().toISOString(),
        searchIndex: {
          entities: Object.keys(searchData.entities).length,
          contexts: Object.keys(searchData.contexts).length,
          nodes: searchData.nodes.length
        },
        faqData: {
          contexts: Object.keys(faqData.contexts).length
        },
        issues: [],
        warnings: [],
        consistency: {}
      };
      
      // Validate entity-context combinations
      validateEntityContextCombinations(searchData, faqData);
      
      // Validate node references
      validateNodeReferences(searchData);
      
      // Validate FAQ coverage
      validateFAQCoverage(searchData, faqData);
      
      // Log results
      logValidationResults();
      
      return validationResults;
      
    } catch (error) {
      console.error('Error validating data consistency:', error);
      return null;
    }
  }
  
  // Validate entity-context combinations
  function validateEntityContextCombinations(searchData, faqData) {
    const searchContexts = new Set(Object.keys(searchData.contexts));
    const faqContexts = new Set(Object.keys(faqData.contexts));
    
    // Check for missing contexts in FAQ
    const missingInFAQ = [...searchContexts].filter(ctx => !faqContexts.has(ctx));
    if (missingInFAQ.length > 0) {
      validationResults.issues.push({
        type: 'missing_faq_contexts',
        severity: 'high',
        message: `Contextos en search-index pero no en FAQ: ${missingInFAQ.join(', ')}`,
        count: missingInFAQ.length
      });
    }
    
    // Check for extra contexts in FAQ
    const extraInFAQ = [...faqContexts].filter(ctx => !searchContexts.has(ctx));
    if (extraInFAQ.length > 0) {
      validationResults.warnings.push({
        type: 'extra_faq_contexts',
        severity: 'low',
        message: `Contextos en FAQ pero no en search-index: ${extraInFAQ.join(', ')}`,
        count: extraInFAQ.length
      });
    }
    
    validationResults.consistency.contexts = {
      search: searchContexts.size,
      faq: faqContexts.size,
      overlap: new Set([...searchContexts].filter(x => faqContexts.has(x))).size
    };
  }
  
  // Validate node references
  function validateNodeReferences(searchData) {
    const entities = new Set(Object.keys(searchData.entities));
    const contexts = new Set(Object.keys(searchData.contexts));
    const nodes = searchData.nodes;
    
    let invalidNodes = 0;
    let duplicateSlugs = new Set();
    const slugCount = new Map();
    
    nodes.forEach((node, index) => {
      // Check entity reference
      if (!entities.has(node.e)) {
        validationResults.issues.push({
          type: 'invalid_entity_reference',
          severity: 'high',
          message: `Nodo ${index}: entidad '${node.e}' no existe`,
          node: node
        });
        invalidNodes++;
      }
      
      // Check context reference
      if (!contexts.has(node.c)) {
        validationResults.issues.push({
          type: 'invalid_context_reference',
          severity: 'high',
          message: `Nodo ${index}: contexto '${node.c}' no existe`,
          node: node
        });
        invalidNodes++;
      }
      
      // Check for duplicate slugs
      if (slugCount.has(node.s)) {
        duplicateSlugs.add(node.s);
      } else {
        slugCount.set(node.s, 1);
      }
    });
    
    if (duplicateSlugs.size > 0) {
      validationResults.issues.push({
        type: 'duplicate_slugs',
        severity: 'high',
        message: `Slugs duplicados: ${Array.from(duplicateSlugs).join(', ')}`,
        count: duplicateSlugs.size
      });
    }
    
    validationResults.consistency.nodes = {
      total: nodes.length,
      valid: nodes.length - invalidNodes,
      invalid: invalidNodes,
      duplicateSlugs: duplicateSlugs.size
    };
  }
  
  // Validate FAQ coverage
  function validateFAQCoverage(searchData, faqData) {
    const searchContexts = Object.keys(searchData.contexts);
    let totalQuestions = 0;
    let contextsMissingQuestions = [];
    
    searchContexts.forEach(contextId => {
      const faqContext = faqData.contexts[contextId];
      if (faqContext && faqContext.questions) {
        totalQuestions += faqContext.questions.length;
        if (faqContext.questions.length === 0) {
          contextsMissingQuestions.push(contextId);
        }
      } else {
        contextsMissingQuestions.push(contextId);
      }
    });
    
    if (contextsMissingQuestions.length > 0) {
      validationResults.issues.push({
        type: 'missing_faq_questions',
        severity: 'medium',
        message: `Contextos sin preguntas FAQ: ${contextsMissingQuestions.join(', ')}`,
        count: contextsMissingQuestions.length
      });
    }
    
    validationResults.consistency.faq = {
      totalQuestions,
      averageQuestionsPerContext: searchContexts.length > 0 ? 
        Math.round(totalQuestions / searchContexts.length) : 0,
      contextsMissingQuestions: contextsMissingQuestions.length
    };
  }
  
  // Log validation results
  function logValidationResults() {
    console.group('SINTOMARIO.ORG - Data Consistency Validation');
    console.log('Timestamp:', validationResults.timestamp);
    
    console.group('Search Index Stats');
    console.log('Entities:', validationResults.searchIndex.entities);
    console.log('Contexts:', validationResults.searchIndex.contexts);
    console.log('Nodes:', validationResults.searchIndex.nodes);
    console.groupEnd();
    
    console.group('FAQ Data Stats');
    console.log('Contexts:', validationResults.faqData.contexts);
    console.groupEnd();
    
    console.group('Consistency Overview');
    console.log('Contexts Overlap:', validationResults.consistency.contexts.overlap);
    console.log('Valid Nodes:', validationResults.consistency.nodes.valid);
    console.log('Total FAQ Questions:', validationResults.consistency.faq.totalQuestions);
    console.groupEnd();
    
    if (validationResults.issues.length > 0) {
      console.group('Issues Found');
      validationResults.issues.forEach(issue => {
        console.warn(`${issue.severity.toUpperCase()}: ${issue.message}`);
      });
      console.groupEnd();
    }
    
    if (validationResults.warnings.length > 0) {
      console.group('Warnings');
      validationResults.warnings.forEach(warning => {
        console.warn(`WARNING: ${warning.message}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
    
    // Store results for debugging
    window.sintomarioDataValidation = validationResults;
  }
  
  // Auto-fix common issues (optional)
  function autoFixIssues() {
    if (!validationResults) return;
    
    console.log('Attempting auto-fix for common issues...');
    
    // This would contain logic to automatically fix common issues
    // For now, just log what could be fixed
    const fixableIssues = validationResults.issues.filter(issue => 
      issue.type === 'duplicate_slugs' || 
      issue.type === 'missing_faq_contexts'
    );
    
    if (fixableIssues.length > 0) {
      console.log('Potentially fixable issues:', fixableIssues);
    }
  }
  
  // Run validation on page load (development only)
  function initValidator() {
    // Only run in development or when explicitly requested
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('validate=true')) {
      
      validateDataConsistency().then(results => {
        if (results && results.issues.length > 0) {
          console.warn('Data consistency issues detected. See console for details.');
          
          // Auto-fix if requested
          if (window.location.search.includes('autofix=true')) {
            autoFixIssues();
          }
        } else if (results) {
          console.log('Data consistency validation passed successfully!');
        }
      });
    }
  }
  
  // Make validator available globally for manual triggering
  window.validateSintomarioData = validateDataConsistency;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidator);
  } else {
    initValidator();
  }
})();
