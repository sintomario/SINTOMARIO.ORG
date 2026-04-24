# Crear sitemap index segmentado para SINTOMARIO.ORG
# Divide el sitemap masivo en sitemaps por sistema corporal

Write-Host "Creando sitemap index segmentado..." -ForegroundColor Green

# Fecha actual para lastmod
$today = Get-Date -Format "yyyy-MM-dd"

# Leer sitemap actual
$sitemapPath = ".\sitemap.xml"
$sitemapContent = Get-Content $sitemapPath -Raw

# Extraer todas las URLs del sitemap actual
$urlPattern = '<loc>([^<]+)</loc>'
$urls = [regex]::Matches($sitemapContent, $urlPattern) | ForEach-Object { $_.Groups[1].Value }

Write-Host "Analizando $($urls.Count) URLs del sitemap actual..." -ForegroundColor Cyan

# Agrupar URLs por sistema corporal
$sistemas = @{}
$otherUrls = @()

foreach ($url in $urls) {
    if ($url -match '/cuerpo/([^/]+)/') {
        $sistema = $matches[1]
        
        if (-not $sistemas.ContainsKey($sistema)) {
            $sistemas[$sistema] = @()
        }
        
        $sistemas[$sistema] += $url
    } else {
        # URLs que no son de artículos (homepage, sobre, faq, etc.)
        $otherUrls += $url
    }
}

Write-Host "Sistemas corporales identificados: $($sistemas.Count)" -ForegroundColor White
foreach ($sistema in $sistemas.Keys) {
    Write-Host "  - $sistema : $($sistemas[$sistema].Count) URLs" -ForegroundColor Gray
}

# Crear sitemap index
$sitemapIndexContent = "<?xml version=`"1.0`" encoding=`"UTF-8`">`n<sitemapindex xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n"

# Añadir sitemaps de sistemas
foreach ($sistema in $sistemas.Keys | Sort-Object) {
    $sitemapIndexContent += "  <sitemap>`n    <loc>https://sintomario.org/sitemap-$sistema.xml</loc>`n    <lastmod>$today</lastmod>`n  </sitemap>`n"
}

# Añadir sitemap para páginas principales
$sitemapIndexContent += "  <sitemap>`n    <loc>https://sintomario.org/sitemap-main.xml</loc>`n    <lastmod>$today</lastmod>`n  </sitemap>`n</sitemapindex>"

# Guardar sitemap index
$sitemapIndexPath = ".\sitemap-index.xml"
Set-Content $sitemapIndexPath $sitemapIndexContent -Encoding UTF8
Write-Host "Sitemap index creado: $sitemapIndexPath" -ForegroundColor Green

# Crear sitemap para páginas principales
$mainSitemapContent = "<?xml version=`"1.0`" encoding=`"UTF-8`">`n<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n"

foreach ($url in $otherUrls) {
    $priority = "0.8"
    $changefreq = "weekly"
    
    if ($url -eq "https://sintomario.org") {
        $priority = "1.0"
        $changefreq = "daily"
    } elseif ($url -match "/sobre/|/faq/") {
        $priority = "0.6"
        $changefreq = "monthly"
    }
    
    $mainSitemapContent += "  <url>`n    <loc>$url</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>$changefreq</changefreq>`n    <priority>$priority</priority>`n  </url>`n"
}

$mainSitemapContent += "</urlset>"
Set-Content ".\sitemap-main.xml" $mainSitemapContent -Encoding UTF8
Write-Host "Sitemap main creado: sitemap-main.xml" -ForegroundColor Green

# Crear sitemaps por sistema corporal
foreach ($sistema in $sistemas.Keys | Sort-Object) {
    $sistemaUrls = $sistemas[$sistema]
    $sistemaSitemapContent = "<?xml version=`"1.0`" encoding=`"UTF-8`">`n<urlset xmlns=`"http://www.sitemaps.org/schemas/sitemap/0.9`">`n"
    
    foreach ($url in $sistemaUrls) {
        # Para artículos, usar prioridad 0.7 y changefreq monthly (contenido evergreen)
        $sistemaSitemapContent += "  <url>`n    <loc>$url</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>monthly</changefreq>`n    <priority>0.7</priority>`n  </url>`n"
    }
    
    $sistemaSitemapContent += "</urlset>"
    $sistemaSitemapPath = ".\sitemap-$sistema.xml"
    Set-Content $sistemaSitemapPath $sistemaSitemapContent -Encoding UTF8
    Write-Host "Sitemap de $sistema creado: $sistemaSitemapPath ($($sistemaUrls.Count) URLs)" -ForegroundColor Green
}

# Actualizar robots.txt para apuntar al sitemap index
$robotsContent = "User-agent: *`nAllow: /`n`nSitemap: https://sintomario.org/sitemap-index.xml`nHost: https://sintomario.org"

Set-Content ".\robots.txt" $robotsContent -Encoding UTF8
Write-Host "robots.txt actualizado para apuntar a sitemap-index.xml" -ForegroundColor Green

# Resumen
Write-Host "`nResumen de creación de sitemaps:" -ForegroundColor Cyan
Write-Host "- Sitemap index: sitemap-index.xml" -ForegroundColor White
Write-Host "- Sitemap main: sitemap-main.xml ($($otherUrls.Count) URLs)" -ForegroundColor White
foreach ($sistema in $sistemas.Keys | Sort-Object) {
    Write-Host "- Sitemap $sistema : sitemap-$sistema.xml ($($sistemas[$sistema].Count) URLs)" -ForegroundColor White
}

$totalSitemaps = 1 + 1 + $sistemas.Count
Write-Host "- Total sitemaps creados: $totalSitemaps" -ForegroundColor Yellow

Write-Host "`nSiguiente paso: Subir estos archivos a GitHub Pages" -ForegroundColor Green
Write-Host "Luego: Registrar sitemap-index.xml en Google Search Console" -ForegroundColor Green
