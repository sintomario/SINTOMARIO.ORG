# Análisis de meta titles truncados en SINTOMARIO.ORG
# Este script identifica todos los titles truncados y genera estadísticas

Write-Host "Analizando meta titles truncados..." -ForegroundColor Green

# Patrón para encontrar titles truncados (terminan abruptamente)
$pattern = '<title>([^<]{60,70})\w{3,5}</title>' # titles de 60-75 chars que terminan con palabra incompleta

$files = Get-ChildItem -Path ".\cuerpo" -Recurse -Filter "index.html" | Where-Object { $_.FullName -match "\\[a-z-]+\\[a-z-]+\\index\.html$" }

$totalFiles = $files.Count
$truncatedFiles = 0
$truncatedExamples = @()

Write-Host "Analizando $totalFiles archivos de artículos..." -ForegroundColor Cyan

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Extraer title
    if ($content -match '<title>([^<]+)</title>') {
        $title = $matches[1]
        
        # Detectar truncamiento: patterns comunes
        $isTruncated = $false
        $truncationReason = ""
        
        # Pattern 1: termina con palabra incompleta seguida de espacio o corte abrupto
        if ($title -match '\w{1,3}$' -and $title.Length -ge 60 -and $title.Length -le 75) {
            $isTruncated = $true
            $truncationReason = "Palabra incompleta al final"
        }
        
        # Pattern 2: termina con "concre", "sent", "señal", "patro"
        if ($title -match '(concre|sent|señ|patro)$') {
            $isTruncated = $true
            $truncationReason = "Palabra detectada como truncada"
        }
        
        # Pattern 3: muy corto para ser completo (menos de 40 chars)
        if ($title.Length -lt 40 -and $title -notlike "*SINTOMARIO*") {
            $isTruncated = $true
            $truncationReason = "Demasiado corto"
        }
        
        if ($isTruncated) {
            $truncatedFiles++
            
            if ($truncatedExamples.Count -lt 10) {
                $truncatedExamples += [PSCustomObject]@{
                    File = $file.FullName.Replace(".\cuerpo\", "cuerpo/")
                    Title = $title
                    Length = $title.Length
                    Reason = $truncationReason
                }
            }
        }
    }
}

Write-Host "`nResultados del análisis:" -ForegroundColor Cyan
Write-Host "- Total archivos analizados: $totalFiles" -ForegroundColor White
Write-Host "- Archivos con title truncado: $truncatedFiles" -ForegroundColor Red
Write-Host "- Porcentaje afectado: $([math]::Round($truncatedFiles/$totalFiles*100, 1))%" -ForegroundColor Yellow

if ($truncatedExamples.Count -gt 0) {
    Write-Host "`nEjemplos detectados:" -ForegroundColor Yellow
    foreach ($example in $truncatedExamples) {
        Write-Host "  $($example.File)" -ForegroundColor Gray
        Write-Host "    Title: $($example.Title)" -ForegroundColor Red
        Write-Host "    Length: $($example.Length) chars" -ForegroundColor White
        Write-Host "    Reason: $($example.Reason)" -ForegroundColor Cyan
        Write-Host ""
    }
}

# Estadísticas adicionales
Write-Host "`nEstadísticas adicionales:" -ForegroundColor Cyan

# Analizar distribución de longitudes
$allTitles = @()
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match '<title>([^<]+)</title>') {
        $allTitles += $matches[1].Length
    }
}

if ($allTitles.Count -gt 0) {
    $avgLength = [math]::Round(($allTitles | Measure-Object -Average).Average, 1)
    $minLength = ($allTitles | Measure-Object -Minimum).Minimum
    $maxLength = ($allTitles | Measure-Object -Maximum).Maximum
    
    Write-Host "- Longitud promedio de titles: $avgLength caracteres" -ForegroundColor White
    Write-Host "- Title más corto: $minLength caracteres" -ForegroundColor White
    Write-Host "- Title más largo: $maxLength caracteres" -ForegroundColor White
}

Write-Host "`nAnálisis completado." -ForegroundColor Green
