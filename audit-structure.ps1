# Auditoría completa de estructura de archivos SINTOMARIO.ORG
# Verifica consistencia, archivos críticos y organización

Write-Host "=== AUDITORÍA DE ESTRUCTURA SINTOMARIO.ORG ===" -ForegroundColor Cyan
Write-Host ""

# Directorios críticos esperados
$expectedDirs = @(
    "api", "assets", "cuerpo", "docs", "faq", "sobre", "contexto", "zona"
)

# Archivos críticos raíz esperados
$expectedRootFiles = @(
    "index.html", "404.html", "robots.txt", "sitemap.xml", "sitemap-index.xml",
    "CNAME", ".nojekyll", "favicon.ico", "search.js", "search-index.json"
)

Write-Host "1. Verificando directorios críticos..." -ForegroundColor Yellow
$existingDirs = @()
$missingDirs = @()

foreach ($dir in $expectedDirs) {
    if (Test-Path $dir) {
        $existingDirs += $dir
        $files = (Get-ChildItem $dir -Recurse).Count
        Write-Host "  OK: $dir ($files archivos)" -ForegroundColor Green
    } else {
        $missingDirs += $dir
        Write-Host "  ERROR: $dir (faltante)" -ForegroundColor Red
    }
}

Write-Host "`n2. Verificando archivos raíz críticos..." -ForegroundColor Yellow
$existingFiles = @()
$missingFiles = @()

foreach ($file in $expectedRootFiles) {
    if (Test-Path $file) {
        $existingFiles += $file
        $size = (Get-Item $file).Length
        Write-Host "  OK: $file ($size bytes)" -ForegroundColor Green
    } else {
        $missingFiles += $file
        Write-Host "  ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host "`n3. Analizando estructura de contenido..." -ForegroundColor Yellow
# Contar artículos por zona corporal
$cuerpoDirs = Get-ChildItem "cuerpo" -Directory | Where-Object { $_.Name -notmatch "^sistema$" } | Sort-Object Name
$totalArticulos = 0
$zonasConArticulos = @()

foreach ($dir in $cuerpoDirs) {
    $indexPath = Join-Path $dir.FullName "index.html"
    if (Test-Path $indexPath) {
        $zonasConArticulos += $dir.Name
        $subdirs = Get-ChildItem $dir.FullName -Directory -ErrorAction SilentlyContinue
        $articulosCount = $subdirs.Count
        $totalArticulos += $articulosCount
        Write-Host "  $($dir.Name): $articulosCount artículos" -ForegroundColor Gray
    }
}

Write-Host "`n4. Verificando sitemaps generados..." -ForegroundColor Yellow
$sitemapFiles = Get-ChildItem "*.xml" | Where-Object { $_.Name -match "^sitemap" } | Sort-Object Name
foreach ($sitemap in $sitemapFiles) {
    $size = $sitemap.Length
    Write-Host "  $($sitemap.Name): $size bytes" -ForegroundColor Gray
}

Write-Host "`n5. Analizando assets..." -ForegroundColor Yellow
if (Test-Path "assets") {
    $cssFiles = Get-ChildItem "assets\css\*.css" -ErrorAction SilentlyContinue
    $jsFiles = Get-ChildItem "assets\js\*.js" -ErrorAction SilentlyContinue
    
    Write-Host "  CSS: $($cssFiles.Count) archivos" -ForegroundColor Gray
    foreach ($css in $cssFiles) {
        Write-Host "    - $($css.Name) ($($css.Length) bytes)" -ForegroundColor White
    }
    
    Write-Host "  JavaScript: $($jsFiles.Count) archivos" -ForegroundColor Gray
    foreach ($js in $jsFiles) {
        Write-Host "    - $($js.Name) ($($js.Length) bytes)" -ForegroundColor White
    }
}

Write-Host "`n=== RESUMEN DE ESTRUCTURA ===" -ForegroundColor Cyan
Write-Host "Directorios críticos: $($existingDirs.Count)/$($expectedDirs.Count) OK" -ForegroundColor $(if($existingDirs.Count -eq $expectedDirs.Count) {"Green"} else {"Yellow"})
Write-Host "Archivos raíz críticos: $($existingFiles.Count)/$($expectedRootFiles.Count) OK" -ForegroundColor $(if($existingFiles.Count -eq $expectedRootFiles.Count) {"Green"} else {"Yellow"})
Write-Host "Zonas corporales con artículos: $($zonasConArticulos.Count)" -ForegroundColor White
Write-Host "Total de artículos estimados: $totalArticulos" -ForegroundColor White
Write-Host "Sitemaps creados: $($sitemapFiles.Count)" -ForegroundColor White

if ($missingDirs.Count -gt 0) {
    Write-Host "`nDirectorios faltantes: $($missingDirs -join ', ')" -ForegroundColor Red
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`nArchivos faltantes: $($missingFiles -join ', ')" -ForegroundColor Red
}

Write-Host "`nAuditoría de estructura completada." -ForegroundColor Green
