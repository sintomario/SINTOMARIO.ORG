# Auditoría Profunda de Arquitectura y Patrones de Diseño - SINTOMARIO.ORG
# Análisis multidimensional de estructura, patrones y arquitectura del sistema

Write-Host "=== AUDITORÍA PROFUNDA DE ARQUITECTURA ===" -ForegroundColor Cyan
Write-Host ""

# 1. Análisis de patrones estructurales
Write-Host "1. PATRONES ESTRUCTURALES Y ARQUITECTURA" -ForegroundColor Yellow

$architectureMetrics = @{}

# Análisis de profundidad de directorios
$maxDepth = 0
$totalDirs = 0
$dirsByDepth = @{}

function Get-DirectoryDepth($path) {
    $depth = ($path.Split('\').Count - 1)
    return $depth
}

Get-ChildItem -Recurse -Directory | ForEach-Object {
    $depth = Get-DirectoryDepth $_.FullName
    $maxDepth = [math]::Max($maxDepth, $depth)
    $totalDirs++
    
    if (-not $dirsByDepth.ContainsKey($depth)) {
        $dirsByDepth[$depth] = 0
    }
    $dirsByDepth[$depth]++
}

Write-Host "  Profundidad máxima de directorios: $maxDepth niveles" -ForegroundColor White
Write-Host "  Total de directorios: $totalDirs" -ForegroundColor White

# Análisis de distribución de archivos
$filesByType = @{}
$totalFiles = 0
$totalSize = 0

Get-ChildItem -Recurse -File | ForEach-Object {
    $ext = $_.Extension.ToLower()
    if ($ext -eq "") { $ext = "no-extension" }
    
    if (-not $filesByType.ContainsKey($ext)) {
        $filesByType[$ext] = @{Count = 0; Size = 0}
    }
    
    $filesByType[$ext].Count++
    $filesByType[$ext].Size += $_.Length
    $totalFiles++
    $totalSize += $_.Length
}

Write-Host "  Total de archivos: $totalFiles" -ForegroundColor White
Write-Host "  Tamaño total: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor White

# Top 10 tipos de archivos por cantidad
Write-Host "`n  Top 10 tipos de archivos por cantidad:" -ForegroundColor Gray
$filesByType.GetEnumerator() | Sort-Object { $_.Value.Count } -Descending | Select-Object -First 10 | ForEach-Object {
    $sizeMB = [math]::Round($_.Value.Size/1MB, 2)
    Write-Host "    $($_.Key): $($_.Value.Count) archivos ($sizeMB MB)" -ForegroundColor White
}

# 2. Análisis de patrones de nomenclatura
Write-Host "`n2. PATRONES DE NOMENCLATURA" -ForegroundColor Yellow

$namingPatterns = @{
    "kebab-case" = 0
    "camelCase" = 0
    "PascalCase" = 0
    "snake_case" = 0
    "UPPER_CASE" = 0
    "mixed" = 0
    "other" = 0
}

Get-ChildItem -Recurse -File | ForEach-Object {
    $name = $_.BaseName
    
    if ($name -match '^[a-z]+(-[a-z]+)*$') {
        $namingPatterns["kebab-case"]++
    } elseif ($name -match '^[a-z]+([A-Z][a-z]*)*$') {
        $namingPatterns["camelCase"]++
    } elseif ($name -match '^[A-Z][a-zA-Z]*$') {
        $namingPatterns["PascalCase"]++
    } elseif ($name -match '^[a-z]+(_[a-z]+)*$') {
        $namingPatterns["snake_case"]++
    } elseif ($name -match '^[A-Z]+(_[A-Z]+)*$') {
        $namingPatterns["UPPER_CASE"]++
    } elseif ($name -match '^[a-zA-Z]+[-_][a-zA-Z]+.*$') {
        $namingPatterns["mixed"]++
    } else {
        $namingPatterns["other"]++
    }
}

Write-Host "  Patrones de nomenclatura detectados:" -ForegroundColor Gray
$namingPatterns.GetEnumerator() | Sort-Object { $_.Value } -Descending | ForEach-Object {
    if ($_.Value -gt 0) {
        $percentage = [math]::Round($_.Value/$totalFiles*100, 1)
        Write-Host "    $($_.Key): $($_.Value) archivos ($percentage%)" -ForegroundColor White
    }
}

# 3. Análisis de patrones de contenido
Write-Host "`n3. PATRONES DE CONTENIDO Y ESTRUCTURA" -ForegroundColor Yellow

# Analizar estructura de artículos
$articlePattern = Get-ChildItem "cuerpo\*\*\index.html" | Select-Object -First 5
$articleMetrics = @{}

foreach ($article in $articlePattern) {
    $content = Get-Content $article.FullName -Raw
    
    # Extraer métricas de contenido
    $wordCount = ($content -split '\s+').Count
    $charCount = $content.Length
    $paragraphCount = ($content | Select-String -Pattern '<p>' -AllMatches).Matches.Count
    $headingCount = ($content | Select-String -Pattern '<h[1-6]' -AllMatches).Matches.Count
    
    $articleMetrics[$article.Name] = @{
        Words = $wordCount
        Chars = $charCount
        Paragraphs = $paragraphCount
        Headings = $headingCount
    }
}

Write-Host "  Métricas promedio de artículos (muestra de $($articleMetrics.Count)):" -ForegroundColor Gray
if ($articleMetrics.Count -gt 0) {
    $avgWords = [math]::Round(($articleMetrics.Values | ForEach-Object { $_.Words } | Measure-Object -Average).Average)
    $avgChars = [math]::Round(($articleMetrics.Values | ForEach-Object { $_.Chars } | Measure-Object -Average).Average)
    $avgParagraphs = [math]::Round(($articleMetrics.Values | ForEach-Object { $_.Paragraphs } | Measure-Object -Average).Average)
    $avgHeadings = [math]::Round(($articleMetrics.Values | ForEach-Object { $_.Headings } | Measure-Object -Average).Average)
    
    Write-Host "    Palabras por artículo: $avgWords" -ForegroundColor White
    Write-Host "    Caracteres por artículo: $avgChars" -ForegroundColor White
    Write-Host "    Párrafos por artículo: $avgParagraphs" -ForegroundColor White
    Write-Host "    Headings por artículo: $avgHeadings" -ForegroundColor White
}

# 4. Análisis de patrones de dependencia
Write-Host "`n4. PATRONES DE DEPENDENCIA" -ForegroundColor Yellow

$dependencies = @()

# Analizar dependencias CSS
Get-ChildItem "*.html", "**\*.html" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Extraer CSS dependencies
    $cssLinks = [regex]::Matches($content, '<link[^>]*href="([^"]+\.css)"') | ForEach-Object { $_.Groups[1].Value }
    foreach ($css in $cssLinks) {
        $dependencies += @{ Type = "CSS"; Source = $_.Name; Target = $css }
    }
    
    # Extraer JS dependencies
    $jsLinks = [regex]::Matches($content, '<script[^>]*src="([^"]+\.js)"') | ForEach-Object { $_.Groups[1].Value }
    foreach ($js in $jsLinks) {
        $dependencies += @{ Type = "JS"; Source = $_.Name; Target = $js }
    }
}

# Analizar patrones de dependencia
$cssDependencies = $dependencies | Where-Object { $_.Type -eq "CSS" }
$jsDependencies = $dependencies | Where-Object { $_.Type -eq "JS" }

Write-Host "  Dependencias CSS detectadas: $($cssDependencies.Count)" -ForegroundColor White
Write-Host "  Dependencias JS detectadas: $($jsDependencies.Count)" -ForegroundColor White

# Top dependencies
Write-Host "`n  Top 5 dependencias CSS más usadas:" -ForegroundColor Gray
$cssDependencies | Group-Object Target | Sort-Object Count -Descending | Select-Object -First 5 | ForEach-Object {
    Write-Host "    $($_.Name): $($_.Count) archivos" -ForegroundColor White
}

Write-Host "`n  Top 5 dependencias JS más usadas:" -ForegroundColor Gray
$jsDependencies | Group-Object Target | Sort-Object Count -Descending | Select-Object -First 5 | ForEach-Object {
    Write-Host "    $($_.Name): $($_.Count) archivos" -ForegroundColor White
}

# 5. Análisis de patrones de modularidad
Write-Host "`n5. PATRONES DE MODULARIDAD" -ForegroundColor Yellow

# Analizar modularidad de CSS
$cssFiles = Get-ChildItem "assets\css\*.css"
$cssModularity = @{}

foreach ($css in $cssFiles) {
    $content = Get-Content $css.FullName -Raw
    
    # Extraer clases CSS
    $classes = [regex]::Matches($content, '\.([a-zA-Z][a-zA-Z0-9-_]*)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    
    # Extraer IDs
    $ids = [regex]::Matches($content, '#([a-zA-Z][a-zA-Z0-9-_]*)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    
    # Extraer variables CSS
    $variables = [regex]::Matches($content, '--([a-zA-Z][a-zA-Z0-9-_]*)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
    
    $cssModularity[$css.Name] = @{
        Classes = $classes.Count
        IDs = $ids.Count
        Variables = $variables.Count
        Size = $css.Length
    }
}

Write-Host "  Modularidad CSS:" -ForegroundColor Gray
foreach ($css in $cssModularity.GetEnumerator()) {
    $sizeKB = [math]::Round($_.Value.Size/1KB, 1)
    Write-Host "    $($_.Key): $($_.Value.Classes) clases, $($_.Value.IDs) IDs, $($_.Value.Variables) variables ($sizeKB KB)" -ForegroundColor White
}

# 6. Análisis de patrones de escalabilidad
Write-Host "`n6. PATRONES DE ESCALABILIDAD" -ForegroundColor Yellow

# Analizar capacidad de escalación del sistema
$scalabilityMetrics = @{
    "ArticlesPerZone" = 0
    "ZonesPerSystem" = 0
    "SystemsTotal" = 0
    "ContentGrowthFactor" = 0
}

# Contar zonas por sistema
$systemDirs = Get-ChildItem "cuerpo\sistema\*" -Directory
$scalabilityMetrics["SystemsTotal"] = $systemDirs.Count

foreach ($system in $systemDirs) {
    $zonesInSystem = Get-ChildItem $system.FullName -Directory
    $scalabilityMetrics["ZonesPerSystem"] += $zonesInSystem.Count
}

# Contar artículos por zona
$zoneDirs = Get-ChildItem "cuerpo\*" -Directory | Where-Object { $_.Name -ne "sistema" }
foreach ($zone in $zoneDirs) {
    $articlesInZone = Get-ChildItem $zone.FullName -Directory
    $scalabilityMetrics["ArticlesPerZone"] += $articlesInZone.Count
}

if ($zoneDirs.Count -gt 0) {
    $avgArticlesPerZone = [math]::Round($scalabilityMetrics["ArticlesPerZone"] / $zoneDirs.Count, 1)
    Write-Host "  Promedio de artículos por zona: $avgArticlesPerZone" -ForegroundColor White
}

if ($systemDirs.Count -gt 0) {
    $avgZonesPerSystem = [math]::Round($scalabilityMetrics["ZonesPerSystem"] / $systemDirs.Count, 1)
    Write-Host "  Promedio de zonas por sistema: $avgZonesPerSystem" -ForegroundColor White
}

Write-Host "  Total de sistemas: $($scalabilityMetrics["SystemsTotal"])" -ForegroundColor White
Write-Host "  Total de zonas: $($zoneDirs.Count)" -ForegroundColor White

# Factor de crecimiento potencial
$currentArticles = Get-ChildItem "cuerpo\*\*\index.html" -Recurse | Measure-Object | Select-Object -ExpandProperty Count
$potentialArticles = $zoneDirs.Count * 50 # 50 contextos por zona
$scalabilityMetrics["ContentGrowthFactor"] = [math]::Round($potentialArticles / $currentArticles, 2)

Write-Host "  Factor de crecimiento potencial: $($scalabilityMetrics["ContentGrowthFactor"])x" -ForegroundColor White

Write-Host "`n=== ANÁLISIS DE ARQUITECTURA COMPLETADO ===" -ForegroundColor Green
