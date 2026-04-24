# Corrección de errores HTML críticos en SINTOMARIO.ORG
# Arregla tags desbalanceados y problemas estructurales

Write-Host "=== CORRECCIÓN DE ERRORES HTML ===" -ForegroundColor Cyan
Write-Host ""

# Archivos con errores críticos identificados
$criticalFiles = @(
    "index.html",
    "404.html", 
    "faq/index.html",
    "sobre/index.html",
    "cuerpo/index.html"
)

$fixedFiles = 0
$totalErrors = 0

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "Corrigiendo: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        $fileErrors = 0
        
        # Corregir tags <sintomario> no estándar - reemplazar con <span>
        $content = $content -replace '<sintomario>', '<span class="sintomario">'
        $content = $content -replace '</sintomario>', '</span>'
        
        # Corregir tags <h> sin número - reemplazar con <h2>
        $content = $content -replace '<h>', '<h2>'
        $content = $content -replace '</h>', '</h2>'
        
        # Corregir tags <head> duplicados
        $headCount = ($content | Select-String -Pattern "<head>" -AllMatches).Matches.Count
        $headCloseCount = ($content | Select-String -Pattern "</head>" -AllMatches).Matches.Count
        
        if ($headCount -gt 1 -and $headCloseCount -lt $headCount) {
            # Mantener solo el primer <head> y añadir </head> si falta
            $firstHeadIndex = $content.IndexOf("<head>")
            $content = $content.Substring(0, $firstHeadIndex) + 
                      "<head>" + 
                      ($content -replace "<head>", "").Replace("</head>", "") +
                      "</head>"
        }
        
        # Verificar y añadir <body> si falta
        if ($content -match '</head>' -and $content -notmatch '<body>') {
            $content = $content -replace '</head>', "</head>`n<body>"
        }
        
        # Verificar cierre de <body>
        if ($content -match '<body>' -and $content -notmatch '</body>') {
            $content += "</body>"
        }
        
        # Contar cambios
        if ($content -ne $originalContent) {
            Set-Content $file.FullName $content -Encoding UTF8
            $fixedFiles++
            
            # Calcular errores corregidos
            $sintomarioFixes = ($originalContent | Select-String -Pattern "<sintomario>|</sintomario>" -AllMatches).Matches.Count
            $hTagFixes = ($originalContent | Select-String -Pattern "<h>|</h>" -AllMatches).Matches.Count
            $fileErrors = $sintomarioFixes + $hTagFixes
            $totalErrors += $fileErrors
            
            Write-Host "  OK: $fileErrors errores corregidos" -ForegroundColor Green
        } else {
            Write-Host "  Sin cambios necesarios" -ForegroundColor Gray
        }
    } else {
        Write-Host "ERROR: $file no encontrado" -ForegroundColor Red
    }
}

Write-Host "`n=== VERIFICACIÓN POST-CORRECCIÓN ===" -ForegroundColor Yellow

# Verificar que los errores fueron corregidos
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file.FullName -Raw
        $remainingErrors = @()
        
        if ($content -match '<sintomario>|</sintomario>') {
            $remainingErrors += "Tags sintomario todavía presentes"
        }
        
        if ($content -match '<h>|</h>(?!tml|ead|ody)') {
            $remainingErrors += "Tags h sin número todavía presentes"
        }
        
        if ($content -notmatch '<body>') {
            $remainingErrors += "Body tag faltante"
        }
        
        $headOpen = ($content | Select-String -Pattern "<head>" -AllMatches).Matches.Count
        $headClose = ($content | Select-String -Pattern "</head>" -AllMatches).Matches.Count
        
        if ($headOpen -ne $headClose) {
            $remainingErrors += "Tags HEAD desbalanceados ($headOpen abiertos, $headClose cerrados)"
        }
        
        if ($remainingErrors.Count -eq 0) {
            Write-Host "  $file : OK - Sin errores" -ForegroundColor Green
        } else {
            Write-Host "  $file : Errores restantes:" -ForegroundColor Red
            foreach ($remainingError in $remainingErrors) {
                Write-Host "    - $remainingError" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`n=== RESUMEN DE CORRECCIÓN ===" -ForegroundColor Cyan
Write-Host "Archivos corregidos: $fixedFiles" -ForegroundColor White
Write-Host "Total errores corregidos: $totalErrors" -ForegroundColor White
Write-Host "Archivos procesados: $($criticalFiles.Count)" -ForegroundColor White

Write-Host "`nCorrección HTML completada." -ForegroundColor Green
