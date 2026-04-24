# Fix sitemap URLs - añadir slash final a las URLs de artículos
# Este script corrige la inconsistencia entre sitemap.xml y estructura real de archivos

Write-Host "Analizando sitemap.xml..." -ForegroundColor Green

# Leer sitemap actual
$sitemapPath = ".\sitemap.xml"
if (-not (Test-Path $sitemapPath)) {
    Write-Host "ERROR: sitemap.xml no encontrado" -ForegroundColor Red
    exit 1
}

$sitemapContent = Get-Content $sitemapPath -Raw
$originalCount = 0
$fixedCount = 0

# Patrón para encontrar URLs de artículos que necesitan slash final
# Las URLs de artículos siguen el patrón: /cuerpo/{zona}/{contexto} (sin slash)
$pattern = '<loc>https://sintomario\.org/cuerpo/[^/]+/[^<]+</loc>'

# Encontrar y reemplazar URLs
$fixedContent = [regex]::Replace($sitemapContent, $pattern, {
    param($match)
    $originalCount++
    $url = $match.Value
    
    # Si ya termina con /, no modificar
    if ($url.EndsWith("/</loc>")) {
        return $url
    }
    
    # Añadir slash final antes de </loc>
    $fixedUrl = $url -replace '</loc>', '/</loc>'
    $fixedCount++
    
    Write-Host "FIX: $url -> $fixedUrl" -ForegroundColor Yellow
    return $fixedUrl
})

# Guardar sitemap corregido
$backupPath = ".\sitemap-backup.xml"
Copy-Item $sitemapPath $backupPath
Write-Host "Backup creado: $backupPath" -ForegroundColor Green

Set-Content $sitemapPath $fixedContent -Encoding UTF8
Write-Host "Sitemap actualizado" -ForegroundColor Green

Write-Host "`nResumen:" -ForegroundColor Cyan
Write-Host "- URLs analizadas: $originalCount" -ForegroundColor White
Write-Host "- URLs corregidas: $fixedCount" -ForegroundColor White
Write-Host "- Backup: $backupPath" -ForegroundColor White

# Verificar algunos archivos para confirmar que existen
Write-Host "`nVerificando archivos corregidos..." -ForegroundColor Green
$testUrls = @(
    "https://sintomario.org/cuerpo/acne/abandono/",
    "https://sintomario.org/cuerpo/acne/ansiedad/",
    "https://sintomario.org/cuerpo/cabeza/ansiedad/"
)

foreach ($testUrl in $testUrls) {
    $relativePath = $testUrl -replace "https://sintomario.org/", ""
    $filePath = ".\" + $relativePath.Replace("/", "\") + "index.html"
    
    if (Test-Path $filePath) {
        Write-Host "OK: $relativePath -> $filePath" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $relativePath -> $filePath (no existe)" -ForegroundColor Red
    }
}

Write-Host "`nProceso completado. Revisa el sitemap.xml actualizado." -ForegroundColor Cyan
