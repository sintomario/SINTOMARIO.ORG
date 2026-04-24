# Auditoría de sintaxis HTML en páginas críticas de SINTOMARIO.ORG
# Verifica estructura básica, tags críticos y consistencia

Write-Host "=== AUDITORÍA DE SINTAXIS HTML ===" -ForegroundColor Cyan
Write-Host ""

# Páginas críticas a verificar
$criticalPages = @(
    "index.html",
    "404.html",
    "faq/index.html",
    "sobre/index.html",
    "cuerpo/index.html"
)

# Errores comunes a buscar
$htmlErrors = @()

Write-Host "1. Verificando páginas críticas..." -ForegroundColor Yellow

foreach ($page in $criticalPages) {
    if (Test-Path $page) {
        Write-Host "  Analizando: $page" -ForegroundColor Gray
        
        $content = Get-Content $page -Raw
        $pageErrors = @()
        
        # Verificar DOCTYPE
        if ($content -notmatch '<!doctype html>') {
            $pageErrors += "DOCTYPE faltante o incorrecto"
        }
        
        # Verificar charset
        if ($content -notmatch '<meta charset="utf-8">') {
            $pageErrors += "Charset UTF-8 faltante"
        }
        
        # Verificar viewport
        if ($content -notmatch '<meta name="viewport"') {
            $pageErrors += "Viewport meta tag faltante"
        }
        
        # Verificar title
        if ($content -notmatch '<title>[^<]+</title>') {
            $pageErrors += "Title tag faltante o vacío"
        }
        
        # Verificar estructura básica
        if ($content -notmatch '<html[^>]*>') {
            $pageErrors += "HTML tag faltante"
        }
        
        if ($content -notmatch '<head>') {
            $pageErrors += "HEAD tag faltante"
        }
        
        if ($content -notmatch '<body>') {
            $pageErrors += "BODY tag faltante"
        }
        
        # Verificar tags cerrados
        $openTags = [regex]::Matches($content, '<([a-z]+)[^>]*>') | ForEach-Object { $_.Groups[1].Value.ToLower() }
        $closeTags = [regex]::Matches($content, '</([a-z]+)>') | ForEach-Object { $_.Groups[1].Value.ToLower() }
        
        $selfClosingTags = @("meta", "link", "img", "br", "hr", "input", "source", "track")
        
        foreach ($tag in $openTags) {
            if ($tag -notin $selfClosingTags) {
                $openCount = ($content | Select-String -Pattern "<$tag[^>]*>" -AllMatches).Matches.Count
                $closeCount = ($content | Select-String -Pattern "</$tag>" -AllMatches).Matches.Count
                
                if ($openCount -ne $closeCount) {
                    $pageErrors += "Tags desbalanceados: <$tag> ($openCount abiertos, $closeCount cerrados)"
                }
            }
        }
        
        # Verificar imágenes con alt
        $imgTags = [regex]::Matches($content, '<img[^>]*>')
        $imgsWithoutAlt = 0
        foreach ($img in $imgTags) {
            if ($img.Value -notmatch 'alt=') {
                $imgsWithoutAlt++
            }
        }
        
        if ($imgsWithoutAlt -gt 0) {
            $pageErrors += "$imgsWithoutAlt imágenes sin atributo alt"
        }
        
        # Mostrar resultados
        if ($pageErrors.Count -eq 0) {
            Write-Host "    OK: Sin errores de sintaxis" -ForegroundColor Green
        } else {
            Write-Host "    ERRORES encontrados:" -ForegroundColor Red
            foreach ($error in $pageErrors) {
                Write-Host "      - $error" -ForegroundColor Red
                $htmlErrors += "$page`: $error"
            }
        }
    } else {
        Write-Host "  ERROR: $page (archivo no encontrado)" -ForegroundColor Red
        $htmlErrors += "$page`: Archivo no encontrado"
    }
}

Write-Host "`n2. Verificando muestra de artículos..." -ForegroundColor Yellow

# Verificar muestra aleatoria de artículos
$articulos = Get-ChildItem "cuerpo\*\*\index.html" | Get-Random -Minimum 1 -Maximum 6
$articulosErrores = 0

foreach ($articulo in $articulos) {
    $relativePath = $articulo.FullName.Replace(".\cuerpo\", "cuerpo/")
    Write-Host "  Analizando: $relativePath" -ForegroundColor Gray
    
    $content = Get-Content $articulo.FullName -Raw
    $articuloErrors = @()
    
    # Verificaciones básicas para artículos
    if ($content -notmatch '<title>[^<]+</title>') {
        $articuloErrors += "Title faltante"
    }
    
    if ($content -notmatch '<meta name="description"') {
        $articuloErrors += "Meta description faltante"
    }
    
    if ($content -notmatch 'rel="canonical"') {
        $articuloErrors += "Canonical URL faltante"
    }
    
    if ($content -match '\{[^}]*\}') {
        $articuloErrors += "Posibles placeholders sin reemplazar"
    }
    
    if ($articuloErrors.Count -eq 0) {
        Write-Host "    OK: Estructura de artículo correcta" -ForegroundColor Green
    } else {
        Write-Host "    ERRORES:" -ForegroundColor Red
        foreach ($error in $articuloErrors) {
            Write-Host "      - $error" -ForegroundColor Red
            $articulosErrores++
        }
    }
}

Write-Host "`n3. Verificando consistencia de charset y DOCTYPE..." -ForegroundColor Yellow

$allHtmlFiles = Get-ChildItem "*.html", "**\*.html" -Recurse | Where-Object { $_.Extension -eq ".html" }
$charsetIssues = 0
$doctypeIssues = 0

foreach ($file in $allHtmlFiles | Get-Random -Minimum 1 -Maximum 11) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -notmatch 'charset="utf-8"') {
        $charsetIssues++
    }
    
    if ($content -notmatch '<!doctype html>') {
        $doctypeIssues++
    }
}

Write-Host "  Muestra de $($allHtmlFiles.Count) archivos HTML:" -ForegroundColor Gray
Write-Host "    Issues con charset: $charsetIssues" -ForegroundColor $(if($charsetIssues -eq 0) {"Green"} else {"Yellow"})
Write-Host "    Issues con DOCTYPE: $doctypeIssues" -ForegroundColor $(if($doctypeIssues -eq 0) {"Green"} else {"Yellow"})

Write-Host "`n=== RESUMEN DE AUDITORÍA HTML ===" -ForegroundColor Cyan
Write-Host "Páginas críticas analizadas: $($criticalPages.Count)" -ForegroundColor White
Write-Host "Artículos analizados: $($articulos.Count)" -ForegroundColor White
Write-Host "Errores totales encontrados: $($htmlErrors.Count + $articulosErrores)" -ForegroundColor $(if($htmlErrors.Count + $articulosErrores -eq 0) {"Green"} else {"Red"})

if ($htmlErrors.Count -gt 0) {
    Write-Host "`nErrores en páginas críticas:" -ForegroundColor Red
    foreach ($error in $htmlErrors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
}

if ($articulosErrores -gt 0) {
    Write-Host "`nErrores en artículos: $articulosErrores" -ForegroundColor Red
}

Write-Host "`nAuditoría HTML completada." -ForegroundColor Green
