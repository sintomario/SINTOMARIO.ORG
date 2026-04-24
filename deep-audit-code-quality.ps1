# Diagnóstico Profundo de Calidad de Código y Debt Técnico - SINTOMARIO.ORG
# Análisis exhaustivo de calidad, maintainability y debt técnico

Write-Host "=== DIAGNÓSTICO DE CALIDAD DE CÓDIGO ===" -ForegroundColor Cyan
Write-Host ""

# 1. Análisis de calidad de HTML
Write-Host "1. CALIDAD DE HTML Y SEMÁNTICA" -ForegroundColor Yellow

$htmlQualityMetrics = @{
    "TotalHTMLFiles" = 0
    "ValidHTML5" = 0
    "SemanticHTML" = 0
    "AccessibilityIssues" = 0
    "PerformanceIssues" = 0
    "SEOIssues" = 0
}

# Analizar archivos HTML críticos
$criticalHTMLFiles = @("index.html", "404.html", "faq/index.html", "sobre/index.html", "cuerpo/index.html")
$htmlQualityMetrics["TotalHTMLFiles"] = $criticalHTMLFiles.Count

foreach ($file in $criticalHTMLFiles) {
    if (Test-Path $file) {
        Write-Host "  Analizando: $file" -ForegroundColor Gray
        $content = Get-Content $file.FullName -Raw
        
        # Validar HTML5
        if ($content -match '<!doctype html>' -and $content -match '<html[^>]*>' -and $content -match '<head>' -and $content -match '<body>') {
            $htmlQualityMetrics["ValidHTML5"]++
        }
        
        # Verificar HTML semántico
        $semanticTags = @("header", "nav", "main", "section", "article", "aside", "footer")
        $semanticCount = 0
        foreach ($tag in $semanticTags) {
            if ($content -match "<$tag") {
                $semanticCount++
            }
        }
        if ($semanticCount -ge 3) {
            $htmlQualityMetrics["SemanticHTML"]++
        }
        
        # Verificar accesibilidad básica
        $accessibilityIssues = 0
        if ($content -match '<img[^>]*(?!alt=)') {
            $accessibilityIssues++
        }
        if ($content -match '<button[^>]*(?!aria-)') {
            $accessibilityIssues++
        }
        $htmlQualityMetrics["AccessibilityIssues"] += $accessibilityIssues
        
        # Verificar performance issues
        $performanceIssues = 0
        if ($content -match '<style[^>]*>[^<]{1000,}') {
            $performanceIssues++ # CSS inline muy grande
        }
        if (($content | Select-String -Pattern "<script" -AllMatches).Matches.Count -gt 5) {
            $performanceIssues++ # Demasiados scripts
        }
        $htmlQualityMetrics["PerformanceIssues"] += $performanceIssues
        
        # Verificar SEO issues
        $seoIssues = 0
        if ($content -notmatch '<meta name="description"') {
            $seoIssues++
        }
        if ($content -notmatch '<title>[^<]{30,70}</title>') {
            $seoIssues++
        }
        $htmlQualityMetrics["SEOIssues"] += $seoIssues
    }
}

Write-Host "  HTML5 válido: $($htmlQualityMetrics["ValidHTML5"])/$($htmlQualityMetrics["TotalHTMLFiles"])" -ForegroundColor $(if($htmlQualityMetrics["ValidHTML5"] -eq $htmlQualityMetrics["TotalHTMLFiles"]) {"Green"} else {"Yellow"})
Write-Host "  HTML semántico: $($htmlQualityMetrics["SemanticHTML"])/$($htmlQualityMetrics["TotalHTMLFiles"])" -ForegroundColor $(if($htmlQualityMetrics["SemanticHTML"] -ge 3) {"Green"} else {"Yellow"})
Write-Host "  Issues de accesibilidad: $($htmlQualityMetrics["AccessibilityIssues"])" -ForegroundColor $(if($htmlQualityMetrics["AccessibilityIssues"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Issues de performance: $($htmlQualityMetrics["PerformanceIssues"])" -ForegroundColor $(if($htmlQualityMetrics["PerformanceIssues"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Issues de SEO: $($htmlQualityMetrics["SEOIssues"])" -ForegroundColor $(if($htmlQualityMetrics["SEOIssues"] -eq 0) {"Green"} else {"Yellow"})

# 2. Análisis de calidad de CSS
Write-Host "`n2. CALIDAD DE CSS Y MANTENIBILIDAD" -ForegroundColor Yellow

$cssQualityMetrics = @{
    "TotalCSSFiles" = 0
    "ValidCSS" = 0
    "CSSVariables" = 0
    "ResponsiveDesign" = 0
    "CSSComplexity" = 0
    "UnusedCSS" = 0
}

$cssFiles = Get-ChildItem "assets\css\*.css"
$cssQualityMetrics["TotalCSSFiles"] = $cssFiles.Count

foreach ($css in $cssFiles) {
    $content = Get-Content $css.FullName -Raw
    
    # Validar CSS básico
    if ($content -match '\.[a-zA-Z][^{]*\{' -and $content -match '\}') {
        $cssQualityMetrics["ValidCSS"]++
    }
    
    # Verificar CSS variables
    if ($content -match '--[a-zA-Z-]+:') {
        $cssQualityMetrics["CSSVariables"]++
    }
    
    # Verificar responsive design
    if ($content -match '@media' -or $content -match 'flex|grid') {
        $cssQualityMetrics["ResponsiveDesign"]++
    }
    
    # Calcular complejidad CSS
    $selectors = [regex]::Matches($content, '[.#]?[a-zA-Z][a-zA-Z0-9-_]*(?=[^{])').Count
    $rules = [regex]::Matches($content, '\{[^}]*\}').Count
    $complexity = if ($rules -gt 0) { [math]::Round($selectors / $rules, 2) } else { 0 }
    $cssQualityMetrics["CSSComplexity"] += $complexity
}

Write-Host "  CSS válido: $($cssQualityMetrics["ValidCSS"])/$($cssQualityMetrics["TotalCSSFiles"])" -ForegroundColor Green
Write-Host "  CSS con variables: $($cssQualityMetrics["CSSVariables"])/$($cssQualityMetrics["TotalCSSFiles"])" -ForegroundColor $(if($cssQualityMetrics["CSSVariables"] -ge 2) {"Green"} else {"Yellow"})
Write-Host "  Responsive design: $($cssQualityMetrics["ResponsiveDesign"])/$($cssQualityMetrics["TotalCSSFiles"])" -ForegroundColor $(if($cssQualityMetrics["ResponsiveDesign"] -ge 2) {"Green"} else {"Yellow"})
Write-Host "  Complejidad CSS promedio: $([math]::Round($cssQualityMetrics["CSSComplexity"]/$cssQualityMetrics["TotalCSSFiles"], 2))" -ForegroundColor White

# 3. Análisis de calidad de JavaScript
Write-Host "`n3. CALIDAD DE JAVASCRIPT Y PATRONES" -ForegroundColor Yellow

$jsQualityMetrics = @{
    "TotalJSFiles" = 0
    "ValidJS" = 0
    "ModernJS" = 0
    "ErrorHandling" = 0
    "AsyncPatterns" = 0
    "CodeComplexity" = 0
}

$jsFiles = Get-ChildItem "assets\js\*.js"
$jsQualityMetrics["TotalJSFiles"] = $jsFiles.Count

foreach ($js in $jsFiles) {
    $content = Get-Content $js.FullName -Raw
    
    # Validar JavaScript básico
    if ($content -match 'function|var|let|const') {
        $jsQualityMetrics["ValidJS"]++
    }
    
    # Verificar JavaScript moderno
    if ($content -match 'const|let|=>|class|async|await') {
        $jsQualityMetrics["ModernJS"]++
    }
    
    # Verificar manejo de errores
    if ($content -match 'try|catch|throw') {
        $jsQualityMetrics["ErrorHandling"]++
    }
    
    # Verificar patrones async
    if ($content -match 'async|await|Promise|fetch') {
        $jsQualityMetrics["AsyncPatterns"]++
    }
    
    # Calcular complejidad (líneas de código)
    $lines = ($content -split '`n').Count
    $jsQualityMetrics["CodeComplexity"] += $lines
}

Write-Host "  JavaScript válido: $($jsQualityMetrics["ValidJS"])/$($jsQualityMetrics["TotalJSFiles"])" -ForegroundColor Green
Write-Host "  JavaScript moderno: $($jsQualityMetrics["ModernJS"])/$($jsQualityMetrics["TotalJSFiles"])" -ForegroundColor $(if($jsQualityMetrics["ModernJS"] -ge 2) {"Green"} else {"Yellow"})
Write-Host "  Manejo de errores: $($jsQualityMetrics["ErrorHandling"])/$($jsQualityMetrics["TotalJSFiles"])" -ForegroundColor $(if($jsQualityMetrics["ErrorHandling"] -ge 1) {"Green"} else {"Yellow"})
Write-Host "  Patrones async: $($jsQualityMetrics["AsyncPatterns"])/$($jsQualityMetrics["TotalJSFiles"])" -ForegroundColor $(if($jsQualityMetrics["AsyncPatterns"] -ge 1) {"Green"} else {"Yellow"})
Write-Host "  Líneas de código promedio: $([math]::Round($jsQualityMetrics["CodeComplexity"]/$jsQualityMetrics["TotalJSFiles"], 0))" -ForegroundColor White

# 4. Análisis de debt técnico
Write-Host "`n4. DEBT TÉCNICO Y LEGACY CODE" -ForegroundColor Yellow

$technicalDebt = @{
    "LegacyFiles" = 0
    "DuplicateCode" = 0
    "LargeFiles" = 0
    "DeepNesting" = 0
    "MagicNumbers" = 0
    "TODOComments" = 0
}

# Buscar archivos legacy
$legacyPatterns = @("legacy", "old", "deprecated", "backup", "temp")
foreach ($pattern in $legacyPatterns) {
    $legacyFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Name -match $pattern }
    $technicalDebt["LegacyFiles"] += $legacyFiles.Count
}

# Buscar código duplicado (similitud de nombres)
$allFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Extension -in @(".html", ".js", ".css") }
$fileNames = $allFiles | Group-Object Name | Where-Object { $_.Count -gt 1 }
$technicalDebt["DuplicateCode"] = $fileNames.Count

# Buscar archivos grandes
$largeFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Length -gt 100KB }
$technicalDebt["LargeFiles"] = $largeFiles.Count

# Buscar anidamiento profundo en HTML
foreach ($file in Get-ChildItem "*.html" -Recurse | Select-Object -First 10) {
    $content = Get-Content $file.FullName -Raw
    $maxDepth = 0
    $currentDepth = 0
    
    for ($i = 0; $i -lt $content.Length; $i++) {
        if ($content[$i] -eq '<') {
            $currentDepth++
            $maxDepth = [math]::Max($maxDepth, $currentDepth)
        } elseif ($content[$i] -eq '>') {
            $currentDepth--
        }
    }
    
    if ($maxDepth -gt 10) {
        $technicalDebt["DeepNesting"]++
    }
}

# Buscar magic numbers
$magicNumberPattern = '\b(1[0-9]|[2-9][0-9]|[1-9][0-9]{2,})\b'
foreach ($file in Get-ChildItem "*.js", "*.css" -Recurse | Select-Object -First 5) {
    $content = Get-Content $file.FullName -Raw
    $magicNumbers = [regex]::Matches($content, $magicNumberPattern).Count
    $technicalDebt["MagicNumbers"] += $magicNumbers
}

# Buscar comentarios TODO
foreach ($file in Get-ChildItem "*.html", "*.js", "*.css" -Recurse | Select-Object -First 10) {
    $content = Get-Content $file.FullName -Raw
    $todos = [regex]::Matches($content, 'TODO|FIXME|HACK|XXX').Count
    $technicalDebt["TODOComments"] += $todos
}

Write-Host "  Archivos legacy: $($technicalDebt["LegacyFiles"])" -ForegroundColor $(if($technicalDebt["LegacyFiles"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Código duplicado: $($technicalDebt["DuplicateCode"])" -ForegroundColor $(if($technicalDebt["DuplicateCode"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Archivos grandes (>100KB): $($technicalDebt["LargeFiles"])" -ForegroundColor $(if($technicalDebt["LargeFiles"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Anidamiento profundo: $($technicalDebt["DeepNesting"])" -ForegroundColor $(if($technicalDebt["DeepNesting"] -eq 0) {"Green"} else {"Yellow"})
Write-Host "  Magic numbers: $($technicalDebt["MagicNumbers"])" -ForegroundColor $(if($technicalDebt["MagicNumbers"] -lt 50) {"Green"} else {"Yellow"})
Write-Host "  Comentarios TODO: $($technicalDebt["TODOComments"])" -ForegroundColor $(if($technicalDebt["TODOComments"] -eq 0) {"Green"} else {"Yellow"})

# 5. Análisis de maintainability
Write-Host "`n5. MANTENIBILIDAD Y DOCUMENTACIÓN" -ForegroundColor Yellow

$maintainabilityMetrics = @{
    "DocumentedFiles" = 0
    "Comments" = 0
    "FunctionNames" = 0
    "VariableNames" = 0
    "CodeStructure" = 0
}

# Analizar documentación
$documentedFiles = 0
$totalCodeFiles = 0

foreach ($file in Get-ChildItem "*.js", "*.css" -Recurse) {
    $content = Get-Content $file.FullName -Raw
    $totalCodeFiles++
    
    if ($content -match '/\*|//|#') {
        $documentedFiles++
    }
    
    $comments = [regex]::Matches($content, '/\*.*?\*/|//.*$|#.*$', 'Multiline').Count
    $maintainabilityMetrics["Comments"] += $comments
}

$maintainabilityMetrics["DocumentedFiles"] = $documentedFiles
$maintainabilityMetrics["CodeStructure"] = if ($totalCodeFiles -gt 0) { [math]::Round($documentedFiles/$totalCodeFiles*100, 1) } else { 0 }

Write-Host "  Archivos documentados: $documentedFiles/$totalCodeFiles ($($maintainabilityMetrics["CodeStructure"])%)" -ForegroundColor $(if($maintainabilityMetrics["CodeStructure"] -ge 50) {"Green"} else {"Yellow"})
Write-Host "  Total de comentarios: $($maintainabilityMetrics["Comments"])" -ForegroundColor White

# 6. Score de calidad general
Write-Host "`n6. SCORE DE CALIDAD GENERAL" -ForegroundColor Yellow

$qualityScore = 0
$maxScore = 100

# HTML Quality (30 points)
$htmlScore = if ($htmlQualityMetrics["TotalHTMLFiles"] -gt 0) {
    ($htmlQualityMetrics["ValidHTML5"] + $htmlQualityMetrics["SemanticHTML"]) / ($htmlQualityMetrics["TotalHTMLFiles"] * 2) * 30
} else { 0 }

# CSS Quality (25 points)
$cssScore = if ($cssQualityMetrics["TotalCSSFiles"] -gt 0) {
    ($cssQualityMetrics["ValidCSS"] + $cssQualityMetrics["CSSVariables"] + $cssQualityMetrics["ResponsiveDesign"]) / ($cssQualityMetrics["TotalCSSFiles"] * 3) * 25
} else { 0 }

# JS Quality (25 points)
$jsScore = if ($jsQualityMetrics["TotalJSFiles"] -gt 0) {
    ($jsQualityMetrics["ValidJS"] + $jsQualityMetrics["ModernJS"] + $jsQualityMetrics["ErrorHandling"]) / ($jsQualityMetrics["TotalJSFiles"] * 3) * 25
} else { 0 }

# Technical Debt (20 points)
$debtScore = 20
if ($technicalDebt["LegacyFiles"] -gt 0) { $debtScore -= 5 }
if ($technicalDebt["DuplicateCode"] -gt 0) { $debtScore -= 5 }
if ($technicalDebt["LargeFiles"] -gt 0) { $debtScore -= 5 }
if ($technicalDebt["TODOComments"] -gt 5) { $debtScore -= 5 }

$qualityScore = [math]::Round($htmlScore + $cssScore + $jsScore + $debtScore, 1)

Write-Host "  Score HTML: $([math]::Round($htmlScore, 1))/30" -ForegroundColor White
Write-Host "  Score CSS: $([math]::Round($cssScore, 1))/25" -ForegroundColor White
Write-Host "  Score JavaScript: $([math]::Round($jsScore, 1))/25" -ForegroundColor White
Write-Host "  Score Debt Técnico: $debtScore/20" -ForegroundColor White
Write-Host "`n  SCORE DE CALIDAD GENERAL: $qualityScore/100" -ForegroundColor $(if($qualityScore -ge 80) {"Green"} elseif($qualityScore -ge 60) {"Yellow"} else {"Red"})

Write-Host "`n=== DIAGNÓSTICO DE CALIDAD COMPLETADO ===" -ForegroundColor Green
