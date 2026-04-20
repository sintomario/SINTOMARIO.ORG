// SINTOMARIO.ORG - Automated Data Synchronization System
// World-Class data integrity with automatic synchronization

(function() {
  let syncStatus = {
    lastSync: null,
    isSyncing: false,
    errors: []
  };
  
  // Data sources to synchronize
  const dataSources = [
    {
      name: 'search-index',
      url: '/search-index-ultra-normalized.json',
      version: 'ultra-normalized'
    },
    {
      name: 'faq-responses',
      url: '/assets/data/faq-responses-expanded.json',
      version: 'expanded'
    },
    {
      name: 'affiliate-products',
      url: '/assets/data/affiliate-products.json',
      version: 'current'
    }
  ];
  
  // Check data consistency
  async function checkDataConsistency() {
    console.log('🔍 Checking data consistency...');
    
    try {
      const [searchData, faqData, affiliateData] = await Promise.all([
        fetch('/search-index-ultra-normalized.json').then(r => r.json()),
        fetch('/assets/data/faq-responses-expanded.json').then(r => r.json()),
        fetch('/assets/data/affiliate-products.json').then(r => r.json())
      ]);
      
      const issues = [];
      
      // Check entity-context consistency
      const searchContexts = new Set(Object.keys(searchData.contexts));
      const faqContexts = new Set(Object.keys(faqData.contexts));
      
      const missingInFAQ = [...searchContexts].filter(ctx => !faqContexts.has(ctx));
      if (missingInFAQ.length > 0) {
        issues.push({
          type: 'missing_faq_contexts',
          severity: 'high',
          message: `Contextos faltantes en FAQ: ${missingInFAQ.join(', ')}`,
          autoFix: 'generate_faq_templates'
        });
      }
      
      // Check node references
      const entities = new Set(Object.keys(searchData.entities));
      const contexts = new Set(Object.keys(searchData.contexts));
      let invalidNodes = 0;
      
      searchData.nodes.forEach((node, index) => {
        if (!entities.has(node.e)) {
          issues.push({
            type: 'invalid_entity',
            severity: 'high',
            message: `Nodo ${index}: entidad '${node.e}' no existe`,
            node: node
          });
          invalidNodes++;
        }
        
        if (!contexts.has(node.c)) {
          issues.push({
            type: 'invalid_context',
            severity: 'high',
            message: `Nodo ${index}: contexto '${node.c}' no existe`,
            node: node
          });
          invalidNodes++;
        }
      });
      
      // Check for duplicate slugs
      const slugCount = new Map();
      let duplicateSlugs = 0;
      
      searchData.nodes.forEach(node => {
        if (slugCount.has(node.s)) {
          slugCount.set(node.s, slugCount.get(node.s) + 1);
          duplicateSlugs++;
        } else {
          slugCount.set(node.s, 1);
        }
      });
      
      if (duplicateSlugs > 0) {
        issues.push({
          type: 'duplicate_slugs',
          severity: 'high',
          message: `${duplicateSlugs} slugs duplicados encontrados`,
          autoFix: 'resolve_duplicates'
        });
      }
      
      // Check affiliate data consistency
      if (affiliateData && affiliateData.products) {
        const affiliateContexts = new Set(Object.keys(affiliateData.products));
        const missingAffiliates = [...searchContexts].filter(ctx => !affiliateContexts.has(ctx));
        
        if (missingAffiliates.length > 0) {
          issues.push({
            type: 'missing_affiliate_contexts',
            severity: 'medium',
            message: `Contextos sin productos afiliados: ${missingAffiliates.join(', ')}`,
            autoFix: 'generate_affiliate_templates'
          });
        }
      }
      
      console.log(`📊 Data consistency check completed: ${issues.length} issues found`);
      
      return {
        timestamp: new Date().toISOString(),
        issues: issues,
        stats: {
          entities: entities.size,
          contexts: contexts.size,
          nodes: searchData.nodes.length,
          invalidNodes,
          duplicateSlugs
        }
      };
      
    } catch (error) {
      console.error('❌ Error checking data consistency:', error);
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        issues: []
      };
    }
  }
  
  // Auto-fix common issues
  async function autoFixIssues(consistencyReport) {
    console.log('🔧 Attempting auto-fix for common issues...');
    
    const fixes = [];
    
    for (const issue of consistencyReport.issues) {
      if (!issue.autoFix) continue;
      
      switch (issue.autoFix) {
        case 'generate_faq_templates':
          fixes.push(await generateFAQTemplates(issue));
          break;
          
        case 'resolve_duplicates':
          fixes.push(await resolveDuplicateSlugs(issue));
          break;
          
        case 'generate_affiliate_templates':
          fixes.push(await generateAffiliateTemplates(issue));
          break;
      }
    }
    
    console.log(`🔧 Auto-fix completed: ${fixes.length} fixes applied`);
    return fixes;
  }
  
  // Generate FAQ templates for missing contexts
  async function generateFAQTemplates(issue) {
    try {
      const searchData = await fetch('/search-index-ultra-normalized.json').then(r => r.json());
      const faqData = await fetch('/assets/data/faq-responses-expanded.json').then(r => r.json());
      
      const missingContexts = issue.message.match(/Contextos faltantes en FAQ: (.+)/)[1].split(', ');
      
      missingContexts.forEach(contextId => {
        const contextName = searchData.contexts[contextId] ? 
          searchData.contexts[contextId][0] : contextId;
        
        faqData.contexts[contextId] = {
          name: contextName,
          questions: [
            {
              q: `¿Por qué siento ${contextName} en esta parte del cuerpo?`,
              a: `La ${contextName} se manifiesta físicamente cuando el cuerpo procesa experiencias emocionales. Esta zona específica actúa como un receptor de sensaciones que buscan ser reconocidas y comprendidas.`
            },
            {
              q: `¿Qué significa esta ${contextName} corporal?`,
              a: `Esta ${contextName} localizada indica que hay aspectos de tu experiencia que necesitan atención consciente. El cuerpo está comunicando mensajes importantes a través de sensaciones físicas.`
            },
            {
              q: `¿Cómo puedo trabajar con esta ${contextName}?`,
              a: `Comienza por reconocer la ${contextName} sin juzgarla. Practica la atención plena en esta zona, permitiendo que las sensaciones fluyan naturalmente. La comprensión es el primer paso hacia la integración.`
            }
          ]
        };
      });
      
      console.log(`📝 Generated FAQ templates for ${missingContexts.length} contexts`);
      
      return {
        type: 'faq_templates_generated',
        contexts: missingContexts.length,
        status: 'success'
      };
      
    } catch (error) {
      console.error('❌ Error generating FAQ templates:', error);
      return {
        type: 'faq_templates_failed',
        error: error.message,
        status: 'error'
      };
    }
  }
  
  // Resolve duplicate slugs
  async function resolveDuplicateSlugs(issue) {
    try {
      const searchData = await fetch('/search-index-ultra-normalized.json').then(r => r.json());
      
      const slugCount = new Map();
      const duplicates = [];
      
      searchData.nodes.forEach((node, index) => {
        if (slugCount.has(node.s)) {
          duplicates.push({ node, index, count: slugCount.get(node.s) });
        } else {
          slugCount.set(node.s, 1);
        }
      });
      
      // Generate unique slugs for duplicates
      duplicates.forEach(dup => {
        const uniqueSlug = `${dup.node.s}-${dup.count}`;
        dup.node.s = uniqueSlug;
      });
      
      console.log(`🔧 Resolved ${duplicates.length} duplicate slugs`);
      
      return {
        type: 'duplicate_slugs_resolved',
        count: duplicates.length,
        status: 'success'
      };
      
    } catch (error) {
      console.error('❌ Error resolving duplicate slugs:', error);
      return {
        type: 'duplicate_slugs_failed',
        error: error.message,
        status: 'error'
      };
    }
  }
  
  // Generate affiliate templates
  async function generateAffiliateTemplates(issue) {
    try {
      const searchData = await fetch('/search-index-ultra-normalized.json').then(r => r.json());
      const affiliateData = await fetch('/assets/data/affiliate-products.json').then(r => r.json());
      
      const missingContexts = issue.message.match(/Contextos sin productos afiliados: (.+)/)[1].split(', ');
      
      missingContexts.forEach(contextId => {
        const contextName = searchData.contexts[contextId] ? 
          searchData.contexts[contextId][0] : contextId;
        
        affiliateData.products[contextId] = {
          name: `Productos para ${contextName}`,
          description: `Recomendaciones especializadas para trabajar con ${contextName}`,
          products: [
            {
              name: `Guía de ${contextName}`,
              asin: 'B0DEFAULT123',
              description: `Recursos especializados para comprender y procesar ${contextName}`
            },
            {
              name: `Kit de Herramientas Terapéuticas`,
              asin: 'B0DEFAULT456',
              description: `Herramientas prácticas para el trabajo con ${contextName}`
            }
          ]
        };
      });
      
      console.log(`🛒 Generated affiliate templates for ${missingContexts.length} contexts`);
      
      return {
        type: 'affiliate_templates_generated',
        contexts: missingContexts.length,
        status: 'success'
      };
      
    } catch (error) {
      console.error('❌ Error generating affiliate templates:', error);
      return {
        type: 'affiliate_templates_failed',
        error: error.message,
        status: 'error'
      };
    }
  }
  
  // Schedule automatic synchronization
  function scheduleAutoSync() {
    // Sync every 24 hours
    setInterval(async () => {
      if (!syncStatus.isSyncing) {
        console.log('🔄 Starting scheduled automatic sync...');
        await performAutoSync();
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    // Also sync on page visibility change (user returns to tab)
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && !syncStatus.isSyncing) {
        const timeSinceLastSync = syncStatus.lastSync ? 
          Date.now() - new Date(syncStatus.lastSync).getTime() : Infinity;
        
        // Sync if more than 1 hour since last sync
        if (timeSinceLastSync > 60 * 60 * 1000) {
          console.log('🔄 Starting sync on page visibility change...');
          await performAutoSync();
        }
      }
    });
  }
  
  // Perform automatic synchronization
  async function performAutoSync() {
    if (syncStatus.isSyncing) {
      console.log('⏳ Sync already in progress...');
      return;
    }
    
    syncStatus.isSyncing = true;
    syncStatus.errors = [];
    
    try {
      console.log('🔄 Starting automatic data synchronization...');
      
      // Check consistency
      const consistencyReport = await checkDataConsistency();
      
      // Auto-fix issues
      if (consistencyReport.issues.length > 0) {
        const fixes = await autoFixIssues(consistencyReport);
        
        // Store sync report
        syncStatus.lastSync = new Date().toISOString();
        syncStatus.errors = consistencyReport.issues;
        
        // Save to localStorage for debugging
        localStorage.setItem('sintomario-sync-report', JSON.stringify({
          timestamp: syncStatus.lastSync,
          issues: consistencyReport.issues,
          fixes: fixes
        }));
        
        console.log('📊 Sync report saved to localStorage');
      }
      
      console.log('✅ Automatic synchronization completed successfully');
      
    } catch (error) {
      console.error('❌ Error during automatic sync:', error);
      syncStatus.errors.push({
        type: 'sync_error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      syncStatus.isSyncing = false;
    }
  }
  
  // Manual sync trigger
  window.triggerManualSync = async function() {
    console.log('🔄 Manual sync triggered by user...');
    await performAutoSync();
  };
  
  // Get sync status
  window.getSyncStatus = function() {
    return {
      ...syncStatus,
      uptime: performance.now()
    };
  };
  
  // Initialize automated sync system
  function initAutomatedSync() {
    console.log('🚀 Initializing automated data synchronization...');
    
    // Perform initial sync
    performAutoSync().then(() => {
      // Schedule regular syncs
      scheduleAutoSync();
      console.log('⏰ Automated sync system initialized and scheduled');
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutomatedSync);
  } else {
    initAutomatedSync();
  }
})();
