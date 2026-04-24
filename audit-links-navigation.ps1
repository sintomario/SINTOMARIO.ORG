# Auditoría de enlaces internos y navegación en SINTOMARIO.ORG
# Verifica consistencia de URLs, broken links y estructura de navegación

Write-Host "=== AUDITORÍA DE ENLACES Y NAVEGACIÓN ===" -ForegroundColor Cyan
Write-Host ""

# Páginas críticas para analizar navegación
$criticalPages = @(
    "index.html",
    "cuerpo/index.html",
    "faq/index.html", 
    "sobre/index.html"
)

$brokenLinks = @()
$inconsistentUrls = @()
$navigationIssues = @()

Write-Host "1. Analizando navegación principal..." -ForegroundColor Yellow

foreach ($page in $criticalPages) {
    if (Test-Path $page) {
        Write-Host "  Analizando: $page" -ForegroundColor Gray
        
        $content = Get-Content $page.FullName -Raw
        $pageIssues = @()
        
        # Extraer todos los enlaces internos
        $internalLinks = [regex]::Matches($content, 'href="(/[^"]+)"') | ForEach-Object { $_.Groups[1].Value }
        
        foreach ($link in $internalLinks) {
            # Verificar consistencia de URLs (slash final)
            if ($link -match '/cuerpo/[^/]+/[^/]+$') {
                # Es un artículo sin slash final
                $inconsistentUrls += "$page`: $link (debería tener slash final)"
            }
            
            # Verificar que el archivo destino existe
            $linkPath = $link -replace '^/', ''
            
            if ($link -match '/$') {
                # Es una ruta con slash final, buscar index.html
                $filePath = $linkPath.Replace('/', '\') + "index.html"
            } else {
                # Es un archivo específico
                $filePath = $linkPath.Replace('/', '\')
            }
            
            if (-not (Test-Path $filePath)) {
                $brokenLinks += "$page`: $link (archivo no encontrado: $filePath)"
            }
        }
        
        # Verificar estructura de navegación
        if ($content -notmatch 'nav|navigation') {
            $pageIssues += "Navegación principal faltante"
        }
        
        if ($content -notmatch 'header') {
            $pageIssues += "Header faltante"
        }
        
        if ($content -notmatch 'footer') {
            $pageIssues += "Footer faltante"
        }
        
        # Verificar breadcrumbs en artículos
        if ($page -match 'cuerpo.*index\.html$' -and $page -ne "cuerpo/index.html") {
            if ($content -notmatch 'breadcrumb|nav.*aria-label') {
                $pageIssues += "Breadcrumb faltante en artículo"
            }
        }
        
        if ($pageIssues.Count -gt 0) {
            foreach ($issue in $pageIssues) {
                $navigationIssues += "$page`: $issue"
            }
        }
        
        Write-Host "    Enlaces internos encontrados: $($internalLinks.Count)" -ForegroundColor Gray
    } else {
        Write-Host "  ERROR: $page no encontrado" -ForegroundColor Red
    }
}

Write-Host "`n2. Verificando enlaces en páginas de zona..." -ForegroundColor Yellow

# Analizar muestra de páginas de zona
$zonaPages = Get-ChildItem "cuerpo\*\index.html" | Where-Object { $_.FullName -match '\\cuerpo\\[^\\]+\\index\.html$' } | Get-Random -Minimum 1 -Maximum 6

foreach ($zonaPage in $zonaPages) {
    $relativePath = $zonaPage.FullName.Replace(".\cuerpo\", "cuerpo/")
    Write-Host "  Analizando zona: $relativePath" -ForegroundColor Gray
    
    $content = Get-Content $zonaPage.FullName -Raw
    
    # Verificar enlaces a artículos
    $articleLinks = [regex]::Matches($content, 'href="(/cuerpo/[^/]+/[^/]+)"') | ForEach-Object { $_.Groups[1].Value }
    
    foreach ($link in $articleLinks) {
        $linkPath = $link.Replace('/', '\') + "index.html"
        if (-not (Test-Path $linkPath)) {
            $brokenLinks += "$relativePath`: $link (artículo no encontrado)"
        }
    }
    
    Write-Host "    Enlaces a artículos: $($articleLinks.Count)" -ForegroundColor Gray
}

Write-Host "`n3. Verificando consistencia de URLs en sitemaps vs archivos..." -ForegroundColor Yellow

# Verificar URLs en sitemap-index.xml
if (Test-Path "sitemap-index.xml") {
    $sitemapContent = Get-Content "sitemap-index.xml" -Raw
    $sitemapUrls = [regex]::Matches($sitemapContent, '<loc>([^<]+)</loc>') | ForEach-Object { $_.Groups[1].Value }
    
    $sitemapErrors = 0
    foreach ($url in $sitemapUrls) {
        if ($url -match 'https://sintomario.org/cuerpo/([^/]+)/([^/]+)/?$') {
            $zona = $matches[1]
            $contexto = $matches[2]
            $filePath = "cuerpo\$zona\$contexto\index.html"
            
            if (-not (Test-Path $filePath)) {
                $sitemapErrors++
            }
        }
    }
    
    Write-Host "  URLs en sitemap-index.xml: $($sitemapUrls.Count)" -ForegroundColor Gray
    Write-Host "  URLs rotas en sitemap: $sitemapErrors" -ForegroundColor $(if($sitemapErrors -eq 0) {"Green"} else {"Red"})
}

Write-Host "`n4. Analizando estructura de navegación del atlas..." -ForegroundColor Yellow

if (Test-Path "cuerpo/index.html") {
    $atlasContent = Get-Content "cuerpo/index.html" -Raw
    
    # Verificar botones de sistema
    $systemButtons = [regex]::Matches($atlasContent, 'data-system="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    Write-Host "  Botones de sistema encontrados: $($systemButtons.Count)" -ForegroundColor Gray
    
    # Verificar que cada sistema tenga su hub
    foreach ($system in $systemButtons) {
        $hubPath = "cuerpo\sistema\$system\index.html"
        if (-not (Test-Path $hubPath)) {
            $brokenLinks += "cuerpo/index.html: Sistema $system (hub no encontrado: $hubPath)"
        }
    }
}

Write-Host "`n=== RESUMEN DE AUDITORÍA DE ENLACES ===" -ForegroundColor Cyan
Write-Host "Páginas críticas analizadas: $($criticalPages.Count)" -ForegroundColor White
Write-Host "Zonas analizadas: $($zonaPages.Count)" -ForegroundColor White
Write-Host "Broken links encontrados: $($brokenLinks.Count)" -ForegroundColor $(if($brokenLinks.Count -eq 0) {"Green"} else {"Red"})
Write-Host "URLs inconsistentes: $($inconsistentUrls.Count)" -ForegroundColor $(if($inconsistentUrls.Count -eq 0) {"Green"} else {"Yellow"})
Write-Host "Problemas de navegación: $($navigationIssues.Count)" -ForegroundColor $(if($navigationIssues.Count -eq 0) {"Green"} else {"Yellow"})

if ($brokenLinks.Count -gt 0) {
    Write-Host "`nBroken Links (primeros 10):" -ForegroundColor Red
    for ($i = 0; $i -lt [math]::Min(10, $brokenLinks.Count); $i++) {
        Write-Host "  - $($brokenLinks[$i])" -ForegroundColor Red
    }
}

if ($inconsistentUrls.Count -gt 0) {
    Write-Host "`nURLs Inconsistentes (primeros 10):" -ForegroundColor Yellow
    for ($i = 0; $i -lt [math]::Min(10, $inconsistentUrls.Count); $i++) {
        Write-Host "  - $($inconsistentUrls[$i])" -ForegroundColor Yellow
    }
}

if ($navigationIssues.Count -gt 0) {
    Write-Host "`nProblemas de Navegación:" -ForegroundColor Yellow
    foreach ($issue in $navigationIssues) {
        Write-Host "  - $issue" -ForegroundColor Yellow
    }
}

Write-Host "`nAuditoría de enlaces completada." -ForegroundColor Green
