# Auditoría Profunda de Performance y Core Web Vitals - SINTOMARIO.ORG
# Análisis exhaustivo de rendimiento, optimización y métricas web

Write-Host "=== AUDITORÍA DE PERFORMANCE ===" -ForegroundColor Cyan
Write-Host ""

# 1. Análisis de tamaño y carga de recursos
Write-Host "1. ANÁLISIS DE TAMAÑO Y CARGA" -ForegroundColor Yellow

# Analizar archivos críticos
$criticalFiles = @("index.html", "cuerpo/index.html")
$totalSize = 0
$criticalSize = 0

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $sizeKB = [math]::Round($size/1KB, 2)
        $totalSize += $size
        $criticalSize += $size
        
        Write-Host "  $file : $sizeKB KB" -ForegroundColor Gray
    }
}

Write-Host "  Tamaño total crítico: $([math]::Round($totalSize/1KB, 2)) KB" -ForegroundColor White

# Analizar assets
$assetsSize = 0
$cssFiles = Get-ChildItem "assets/css/*.css"
$jsFiles = Get-ChildItem "assets/js/*.js"

foreach ($css in $cssFiles) {
    $assetsSize += $css.Length
}

foreach ($js in $jsFiles) {
    $assetsSize += $js.Length
}

Write-Host "  Tamaño assets CSS+JS: $([math]::Round($assetsSize/1KB, 2)) KB" -ForegroundColor White

# 2. Análisis de optimización de imágenes
Write-Host "`n2. OPTIMIZACIÓN DE IMÁGENES" -ForegroundColor Yellow

$imageFiles = Get-ChildItem "*.png", "*.jpg", "*.jpeg", "*.gif" -Recurse
$totalImageSize = 0
$imageCount = 0

foreach ($img in $imageFiles) {
    $totalImageSize += $img.Length
    $imageCount++
}

if ($imageCount -gt 0) {
    $avgImageSize = $totalImageSize / $imageCount
    Write-Host "  Total de imágenes: $imageCount" -ForegroundColor White
    Write-Host "  Tamaño promedio: $([math]::Round($avgImageSize/1KB, 2)) KB" -ForegroundColor White
    Write-Host "  Tamaño total imágenes: $([math]::Round($totalImageSize/1MB, 2)) MB" -ForegroundColor White
}

# 3. Análisis de requests potenciales
Write-Host "`n3. ANÁLISIS DE REQUESTS POTENCIALES" -ForegroundColor Yellow

# Contar recursos externos en página principal
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    
    $externalRequests = 0
    $internalRequests = 0
    
    # CSS links
    $cssLinks = [regex]::Matches($content, '<link[^>]*href="([^"]+)"')
    $externalRequests += $cssLinks.Count
    
    # JS scripts
    $jsScripts = [regex]::Matches($content, '<script[^>]*src="([^"]+)"')
    $externalRequests += $jsScripts.Count
    
    # Images
    $images = [regex]::Matches($content, '<img[^>]*src="([^"]+)"')
    $internalRequests += $images.Count
    
    Write-Host "  Requests CSS: $($cssLinks.Count)" -ForegroundColor Gray
    Write-Host "  Requests JS: $($jsScripts.Count)" -ForegroundColor Gray
    Write-Host "  Requests imágenes: $($images.Count)" -ForegroundColor Gray
    Write-Host "  Total requests potenciales: $($externalRequests + $internalRequests)" -ForegroundColor White
}

# 4. Análisis de Core Web Vitals estimado
Write-Host "`n4. CORE WEB VITALS ESTIMADO" -ForegroundColor Yellow

# LCP (Largest Contentful Paint) estimación
$lcpScore = "Good"
if ($totalSize/1KB -gt 500) { $lcpScore = "Needs Improvement" }
if ($totalSize/1KB -gt 1000) { $lcpScore = "Poor" }

# FID (First Input Delay) estimación
$fidScore = "Good"
if ($jsFiles.Count -gt 10) { $fidScore = "Needs Improvement" }
if ($jsFiles.Count -gt 20) { $fidScore = "Poor" }

# CLS (Cumulative Layout Shift) estimación
$clsScore = "Good"
# Basado en presencia de dimensiones en imágenes
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    $imgsWithoutDimensions = [regex]::Matches($content, '<img[^>]*(?!width=|height=)').Count
    if ($imgsWithoutDimensions -gt 5) { $clsScore = "Needs Improvement" }
    if ($imgsWithoutDimensions -gt 10) { $clsScore = "Poor" }
}

Write-Host "  LCP estimado: $lcpScore" -ForegroundColor $(if($lcpScore -eq "Good") {"Green"} elseif($lcpScore -eq "Needs Improvement") {"Yellow"} else {"Red"})
Write-Host "  FID estimado: $fidScore" -ForegroundColor $(if($fidScore -eq "Good") {"Green"} elseif($fidScore -eq "Needs Improvement") {"Yellow"} else {"Red"})
Write-Host "  CLS estimado: $clsScore" -ForegroundColor $(if($clsScore -eq "Good") {"Green"} elseif($clsScore -eq "Needs Improvement") {"Yellow"} else {"Red"})

# 5. Análisis de optimización de carga
Write-Host "`n5. OPTIMIZACIÓN DE CARGA" -ForegroundColor Yellow

# Verificar uso de async/defer
if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    
    $asyncScripts = [regex]::Matches($content, '<script[^>]*async').Count
    $deferScripts = [regex]::Matches($content, '<script[^>]*defer').Count
    $totalScripts = [regex]::Matches($content, '<script').Count
    
    Write-Host "  Scripts con async: $asyncScripts" -ForegroundColor Gray
    Write-Host "  Scripts con defer: $deferScripts" -ForegroundColor Gray
    Write-Host "  Total scripts: $totalScripts" -ForegroundColor White
    
    $optimizationScore = if ($totalScripts -gt 0) { [math]::Round(($asyncScripts + $deferScripts) / $totalScripts * 100, 1) } else { 0 }
    Write-Host "  Optimización de carga: $optimizationScore%" -ForegroundColor $(if($optimizationScore -ge 50) {"Green"} else {"Yellow"})
}

# 6. Análisis de cache y headers
Write-Host "`n6. CACHE Y HEADERS RECOMENDADOS" -ForegroundColor Yellow

$cacheRecommendations = @()

# Analizar tipos de archivo para cache
$fileTypes = @(".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2")

foreach ($type in $fileTypes) {
    $files = Get-ChildItem "*$type" -Recurse -ErrorAction SilentlyContinue
    if ($files.Count -gt 0) {
        $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
        $cacheRecommendations += "Archivos $type : $($files.Count) archivos, $([math]::Round($totalSize/1KB, 2)) KB - Cache 1 año"
    }
}

Write-Host "  Recomendaciones de cache:" -ForegroundColor Gray
foreach ($rec in $cacheRecommendations) {
    Write-Host "    $rec" -ForegroundColor White
}

Write-Host "`n=== AUDITORÍA DE PERFORMANCE COMPLETADA ===" -ForegroundColor Green
