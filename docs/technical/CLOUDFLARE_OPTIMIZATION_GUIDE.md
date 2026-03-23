# SINTOMARIO.ORG - Cloudflare Optimization Rules

## 🚀 **PAGE RULES PARA CACHING AGRESIVO**

### **Rule 1: Static Assets (CSS, JS, Images, Fonts)**
```
URL Pattern: sintomario.org/*.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ico)

Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year
- Bypass Cache on Cookie: Off
- Cache Deception Armor: On
- Performance: Auto Minify (HTML, CSS, JS)
- Security: Brotli Compression
```

### **Rule 2: HTML Content (Articles, Pages)**
```
URL Pattern: sintomario.org/*

Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 4 hours
- Browser Cache TTL: 2 hours
- Bypass Cache on Cookie: Off
- Cache Deception Armor: On
- Performance: Auto Minify (HTML)
- Security: Brotli Compression
```

### **Rule 3: API/External Resources**
```
URL Pattern: sintomario.org/api/*

Settings:
- Cache Level: Bypass
- Edge Cache TTL: Respect Headers
- Browser Cache TTL: Respect Headers
- Bypass Cache on Cookie: On
- Cache Deception Armor: On
```

---

## 🖼️ **2. CLOUDFLARE POLISH OPTIMIZATION**

### **Configuración según Plan:**
```yaml
# Si tienes plan Pro/Business:
polish_settings:
  webp: "on"          # Convertir a WebP automáticamente
  lossless: "off"      # Para fotos, usar lossy
  quality: 85          # Balance calidad/tamaño
  
# Si tienes plan Free:
polish_alternatives:
  manual_webp: "true"  # Servir WebP manualmente
  picture_element: "true"  # Usar <picture> con fallback
```

### **Implementación Manual (Plan Free):**
```html
<!-- Para imágenes -->
<picture>
  <source srcset="imagen.webp" type="image/webp">
  <img src="imagen.jpg" alt="Descripción" loading="lazy">
</picture>

<!-- Para backgrounds CSS -->
.style {
  background-image: url('imagen.webp');
  background-image: url('imagen.jpg') fallback;
}
```

---

## 🗜️ **3. BROTLI COMPRESSION**

### **Configuración Cloudflare:**
```
Speed > Optimization > Brotli: Enable
```

### **Verificación:**
```bash
# Testear Brotli compression
curl -H "Accept-Encoding: br" -I https://sintomario.org

# Deberías ver:
content-encoding: br
```

### **Niveles de Compresión:**
- **Brotli Level 4**: Default Cloudflare (balance velocidad/compresión)
- **Brotli Level 6**: Máxima compresión (más CPU, menos tamaño)
- **Gzip Level 6**: Fallback para navegadores antiguos

---

## 📊 **4. CACHE RULES POR TIPO DE CONTENIDO**

### **HTML Content (Articles)**
```yaml
cache_rules_html:
  edge_ttl: 4 hours        # Cloudflare edge cache
  browser_ttl: 2 hours     # Browser cache
  serve_stale: on_error    # Servir stale si GitHub Pages cae
  cache_key: 
    - url
    - device_type
    - country
```

### **Static Assets (CSS, JS, Images)**
```yaml
cache_rules_assets:
  edge_ttl: 1 year         # Máximo para assets con hash
  browser_ttl: 1 year      # Máximo navegador cache
  serve_stale: while_revalidate  # Stale-while-revalidate
  cache_key:
    - url
    - device_type
```

### **API/Dynamic Content**
```yaml
cache_rules_api:
  edge_ttl: 5 minutes      # Muy corto para API
  browser_ttl: no-cache     # No cachear en navegador
  serve_stale: off         # No servir stale
  cache_key:
    - url
    - headers
```

---

## 📈 **5. CORE WEB VITALS MONITORING**

### **Lighthouse CI Integration**
```yaml
# .github/workflows/performance-monitor.yml
name: Performance Monitoring

on:
  schedule:
    - cron: '0 */6 * * *'  # Cada 6 horas
  workflow_dispatch:

jobs:
  performance-check:
    runs-on: ubuntu-latest
    steps:
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun
        lhci upload --target=temporary-public-storage
```

### **Core Web Vitals Targets**
```yaml
performance_targets:
  lcp: "< 2.5s"           # Largest Contentful Paint
  cls: "< 0.1"            # Cumulative Layout Shift  
  fid: "< 100ms"          # First Input Delay
  ttfb: "< 200ms"         # Time to First Byte
  fcp: "< 1.8s"           # First Contentful Paint
  tti: "< 3.8s"           # Time to Interactive
  si: "< 3.4s"            # Speed Index
  lighthouse_score: "> 90"
```

---

## 🔧 **6. IMPLEMENTACIÓN PASO A PASO**

### **Paso 1: Page Rules Setup**
```bash
1. Ir a Rules > Page Rules en Cloudflare
2. Crear Rule 1: Static Assets
   - Pattern: sintomario.org/*.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ico)
   - Settings: Cache Everything + 1 year TTL
   
3. Crear Rule 2: HTML Content
   - Pattern: sintomario.org/*
   - Settings: Cache Everything + 4 hours TTL
```

### **Paso 2: Brotli Activation**
```bash
1. Ir a Speed > Optimization
2. Activar Brotli Compression
3. Verificar con: curl -H "Accept-Encoding: br" -I https://sintomario.org
```

### **Paso 3: Polish Configuration**
```bash
# Si tienes plan Pro/Business:
1. Ir a Speed > Optimization
2. Activar WebP conversion
3. Configurar quality level (85 recomendado)

# Si tienes plan Free:
1. Implementar manual <picture> elements
2. Servir WebP con fallback
```

### **Paso 4: Cache Rules**
```bash
1. Ir a Caching > Cache Rules
2. Crear regla para HTML (4 hours TTL)
3. Crear regla para Assets (1 year TTL)
4. Activar Stale-While-Revalidate
```

---

## 📊 **7. MONITORING POST-OPTIMIZACIÓN**

### **Daily Performance Check**
```bash
# Scripts automatizados
python scripts/daily-performance-check.py

# Métricas a monitorear:
- Lighthouse score changes
- Core Web Vitals regression
- Cache hit ratio
- Compression ratios
- Error rates
```

### **Alert Configuration**
```yaml
alerts:
  lighthouse_regression: "score < 85"
  lcp_degradation: "LCP > 3.0s"
  cls_degradation: "CLS > 0.15"
  cache_hit_ratio: "< 90%"
  compression_ratio: "< 70%"
```

---

## 🎯 **8. GITHUB PAGES + CLOUDFLARE BEST PRACTICES**

### **Según documentación oficial GitHub:**
- **GitHub Pages sirve contenido estático** → Perfecto para CDN caching
- **No soporta server-side rendering** → Edge caching es ideal
- **Custom domains requieren DNS** → Cloudflare maneja perfectamente
- **HTTPS enforced by default** → Complementado con Cloudflare

### **Configuración Óptima:**
```yaml
github_pages_cloudflare:
  dns_records:
    - A records (4 IPs) DNS only
    - CNAME www proxied
  ssl_tls:
    - Full (strict) mode
    - TLS 1.2 minimum
    - HSTS enabled
  caching:
    - HTML: 4 hours edge cache
    - Assets: 1 year edge cache
    - API: Bypass cache
  compression:
    - Brotli enabled
    - Auto minify HTML/CSS/JS
    - WebP conversion (if available)
```

---

## 🚀 **9. IMPLEMENTACIÓN AUTOMATIZADA**

### **GitHub Actions Pipeline**
```yaml
# .github/workflows/cloudflare-optimization.yml
name: Cloudflare Optimization Deploy

on:
  push:
    paths:
      - 'public/**'
    branches: [main]

jobs:
  deploy-and-optimize:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
    
    - name: Purge Cloudflare Cache
      run: |
        curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
          -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
          -H "Content-Type: application/json" \
          --data '{"purge_everything":true}'
    
    - name: Run Performance Test
      run: |
        lighthouse https://sintomario.org --output=json --chrome-flags="--headless" \
          --output-path=./lighthouse-results.json
    
    - name: Upload Results
      uses: actions/upload-artifact@v3
      with:
        name: lighthouse-results
        path: ./lighthouse-results.json
```

---

## 📋 **10. CHECKLIST DE OPTIMIZACIÓN**

```bash
[ ] 1. Configurar Page Rules para static assets (1 year cache)
[ ] 2. Configurar Page Rules para HTML content (4 hours cache)
[ ] 3. Activar Brotli compression
[ ] 4. Configurar Polish (WebP conversion)
[ ] 5. Crear Cache Rules por tipo de contenido
[ ] 6. Implementar monitoring de Core Web Vitals
[ ] 7. Configurar alerts de rendimiento
[ ] 8. Testear Lighthouse score >90
[ ] 9. Verificar cache hit ratio >90%
[ ] 10. Documentar configuración final
```

---

## 🎯 **RESULTADOS ESPERADOS**

### **Performance Improvements:**
- **LCP**: 2.5s → 1.8s (28% mejora)
- **CLS**: 0.1 → 0.05 (50% mejora)
- **FID**: 100ms → 60ms (40% mejora)
- **Lighthouse Score**: 85 → 95+
- **Cache Hit Ratio**: 70% → 95%
- **Compression**: 30% → 70% (Brotli)

### **SEO Benefits:**
- **Core Web Vitals**: All Green ✅
- **PageSpeed Insights**: 95+ score
- **Search Console**: Better rankings
- **User Experience**: Faster loading

---

## 🚀 **¿LISTO PARA IMPLEMENTAR ESTA OPTIMIZACIÓN COMPLETA?**

**Esta configuración pondrá a SINTOMARIO.ORG en el top 1% de rendimiento web.** 🎯
