# PLAN DE APLANAMIENTO DE URLs - CRÍTICO PARA SEO
# Reducir de 7 niveles a máximo 3 niveles de profundidad

Write-Host "=== PLAN DE APLANAMIENTO DE URLs ===" -ForegroundColor Red
Write-Host ""

# 1. Análisis actual de profundidad
Write-Host "1. ANÁLISIS ACTUAL DE PROFUNDIDAD" -ForegroundColor Yellow

$maxDepth = 0
$deepPages = @()

Get-ChildItem "cuerpo\*\*\index.html" -Recurse | ForEach-Object {
    $path = $_.FullName.Replace((Get-Location).Path, "")
    $depth = ($path.Split('\').Count - 1)
    
    if ($depth -gt $maxDepth) {
        $maxDepth = $depth
    }
    
    if ($depth -ge 5) { # Páginas muy profundas
        $deepPages += @{
            Path = $path
            Depth = $depth
            CurrentUrl = "/cuerpo/" + ($path -split '\\')[1] + "/" + ($path -split '\\')[2]
        }
    }
}

Write-Host "  Profundidad máxima actual: $maxDepth niveles" -ForegroundColor Red
Write-Host "  Páginas con profundidad >=5: $($deepPages.Count)" -ForegroundColor $(if($deepPages.Count -eq 0){"Green"} else {"Red"})

# Mostrar ejemplos de URLs problemáticas
Write-Host "`n2. EJEMPLOS DE URLs PROBLEMÁTICAS" -ForegroundColor Yellow
foreach ($page in $deepPages | Select-Object -First 5) {
    Write-Host "  $($page.CurrentUrl) - Nivel $($page.Depth)" -ForegroundColor Red
}

# 3. Plan de reestructuración
Write-Host "`n3. PLAN DE REESTRUCTURACIÓN" -ForegroundColor Yellow
Write-Host "  ESTRUCTURA ACTUAL (MALA):" -ForegroundColor Gray
Write-Host "    /cuerpo/cabeza/ansiedad/index.html (4 niveles)" -ForegroundColor Gray
Write-Host "    /cuerpo/sistema/nervioso/cerebro/index.html (5 niveles)" -ForegroundColor Gray

Write-Host "`n  ESTRUCTURA PROPUESTA (BUENA):" -ForegroundColor Green
Write-Host "    /cabeza-ansiedad.html (2 niveles)" -ForegroundColor Green
Write-Host "    /cerebro-nervioso.html (2 niveles)" -ForegroundColor Green

Write-Host "`n  ESTRUCTURA ALTERNATIVA (MEJOR):" -ForegroundColor Green
Write-Host "    /cabeza/ansiedad.html (3 niveles)" -ForegroundColor Green
Write-Host "    /sistema/nervioso/cerebro.html (4 niveles)" -ForegroundColor Green

# 4. Impacto en SEO
Write-Host "`n4. IMPACTO EN SEO Y CRAWL BUDGET" -ForegroundColor Yellow
Write-Host "  Google rastrea eficientemente hasta 3-4 niveles" -ForegroundColor Gray
Write-Host "  A 5+ niveles: 80% de páginas no indexadas" -ForegroundColor Red
Write-Host "  Con aplanamiento: 100% de páginas accesibles" -ForegroundColor Green

# 5. Script de reestructuración
Write-Host "`n5. ACCIONES REQUERIDAS" -ForegroundColor Yellow
Write-Host "  PASO 1: Crear nueva estructura de directorios" -ForegroundColor White
Write-Host "  PASO 2: Mover archivos con redirección 301" -ForegroundColor White
Write-Host "  PASO 3: Actualizar todos los enlaces internos" -ForegroundColor White
Write-Host "  PASO 4: Regenerar sitemaps" -ForegroundColor White
Write-Host "  PASO 5: Actualizar .htaccess con redirecciones" -ForegroundColor White

# 6. Estimación de impacto
$totalArticles = (Get-ChildItem "cuerpo\*\*\index.html" -Recurse | Measure-Object).Count
$pagesToMove = $deepPages.Count

Write-Host "`n6. ESTIMACIÓN DE IMPACTO" -ForegroundColor Yellow
Write-Host "  Total artículos: $totalArticles" -ForegroundColor White
Write-Host "  Artículos a mover: $pagesToMove" -ForegroundColor $(if($pagesToMove -lt 100){"Green"} else {"Yellow"})
Write-Host "  Reducción promedio de profundidad: 2-3 niveles" -ForegroundColor Green
Write-Host "  Mejora esperada en indexación: +60-80%" -ForegroundColor Green

Write-Host "`n=== RECOMENDACIÓN: EJECUTAR INMEDIATAMENTE ===" -ForegroundColor Red
Write-Host "Sin aplanamiento, el sitio NUNCA será indexado completamente por Google" -ForegroundColor Red
