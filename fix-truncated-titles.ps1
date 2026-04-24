# Fix meta titles truncados en SINTOMARIO.ORG
# Este script repara automáticamente los titles cortados

Write-Host "Reparando meta titles truncados..." -ForegroundColor Green

# Mapeo de palabras truncadas comunes a sus formas completas
$fixes = @{
    "concre" = "concreta"
    "sent" = "sentido"
    "señ" = "señal"
    "patro" = "patrón"
    "sen" = "sentido"
    "corpo" = "corporal"
    "senti" = "sentimiento"
    "integ" = "integral"
    "simbo" = "simbólica"
    "contex" = "contexto"
    "pract" = "práctica"
    "recurs" = "recursos"
    "apoy" = "apoyo"
    "lectu" = "lectura"
    "corpor" = "corporal"
    "emocio" = "emocional"
    "fisic" = "física"
    "ment" = "mental"
    "espir" = "espiritual"
    "energ" = "energía"
    "sanac" = "sanación"
    "curac" = "curación"
    "transf" = "transformación"
    "evolu" = "evolución"
    "conci" = "conciencia"
    "percep" = "percepción"
    "sensib" = "sensibilidad"
    "expres" = "expresión"
    "comun" = "comunicación"
    "relac" = "relación"
    "conex" = "conexión"
    "equil" = "equilibrio"
    "harmon" = "armonía"
    "integr" = "integración"
    "liber" = "liberación"
    "renov" = "renovación"
    "regen" = "regeneración"
    "restau" = "restauración"
    "revita" = "revitalización"
    "purif" = "purificación"
    "limpie" = "limpieza"
    "detox" = "desintoxicación"
}

$files = Get-ChildItem -Path ".\cuerpo" -Recurse -Filter "index.html" | Where-Object { $_.FullName -match "\\[a-z-]+\\[a-z-]+\\index\.html$" }

$totalFiles = $files.Count
$fixedFiles = 0
$failedFiles = 0

Write-Host "Procesando $totalFiles archivos de artículos..." -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        
        # Encontrar y reemplazar title truncado
        if ($content -match '<title>([^<]+)</title>') {
            $title = $matches[1]
            $newTitle = $title
            $wasFixed = $false
            
            # Aplicar fixes para cada palabra truncada conocida
            foreach ($truncated in $fixes.Keys) {
                $complete = $fixes[$truncated]
                if ($title -match "$truncated$") {
                    $newTitle = $title -replace "$truncated$", $complete
                    $wasFixed = $true
                    Write-Host "FIX: $($file.FullName.Replace('.\cuerpo\', 'cuerpo/'))" -ForegroundColor Yellow
                    Write-Host "  Before: $title" -ForegroundColor Red
                    Write-Host "  After:  $newTitle" -ForegroundColor Green
                    break
                }
            }
            
            # Si no hay match específico, intentar completar palabra genérica
            if (-not $wasFixed -and $title.Length -ge 60 -and $title.Length -le 75) {
                # Pattern: termina con 1-3 caracteres (palabra incompleta)
                if ($title -match '(\w{1,3})$') {
                    $incomplete = $matches[1]
                    
                    # Heurística simple: agregar terminaciones comunes
                    $extensions = @("a", "o", "e", "ión", "ción", "miento", "idad", "ismo", "ista")
                    
                    foreach ($ext in $extensions) {
                        $candidate = $title -replace "$incomplete$", $ext
                        if ($candidate.Length -le 75) {
                            $newTitle = $candidate
                            $wasFixed = $true
                            Write-Host "HEURISTIC FIX: $($file.FullName.Replace('.\cuerpo\', 'cuerpo/'))" -ForegroundColor Cyan
                            Write-Host "  Before: $title" -ForegroundColor Red
                            Write-Host "  After:  $newTitle" -ForegroundColor Green
                            break
                        }
                    }
                }
            }
            
            # Actualizar el contenido si hubo cambios
            if ($wasFixed) {
                $content = $content -replace "<title>$([regex]::Escape($title))</title>", "<title>$newTitle</title>"
                
                # También actualizar og:title si existe
                if ($content -match "og:title.*content=`"[^`"]*`"") {
                    $content = $content -replace "og:title.*content=`"$([regex]::Escape($title))`"", "og:title content=`"$newTitle`""
                }
                
                # Guardar archivo
                Set-Content $file.FullName $content -Encoding UTF8
                $fixedFiles++
            }
        }
    }
    catch {
        Write-Host "ERROR procesando $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
        $failedFiles++
    }
}

Write-Host "`nResumen de reparación:" -ForegroundColor Cyan
Write-Host "- Total archivos procesados: $totalFiles" -ForegroundColor White
Write-Host "- Archivos reparados: $fixedFiles" -ForegroundColor Green
Write-Host "- Archivos con error: $failedFiles" -ForegroundColor Red
Write-Host "- Tasa de éxito: $([math]::Round($fixedFiles/$totalFiles*100, 1))%" -ForegroundColor Yellow

if ($fixedFiles -gt 0) {
    Write-Host "`nVerificando algunos archivos reparados..." -ForegroundColor Green
    
    # Verificar algunos archivos aleatorios
    $testFiles = $files | Get-Random -Minimum 1 -Maximum ([math]::Min(5, $files.Count))
    
    foreach ($testFile in $testFiles) {
        $content = Get-Content $testFile.FullName -Raw
        if ($content -match '<title>([^<]+)</title>') {
            $title = $matches[1]
            $length = $title.Length
            
            Write-Host "  $($testFile.FullName.Replace('.\cuerpo\', 'cuerpo/'))" -ForegroundColor Gray
            Write-Host "    Title: $title" -ForegroundColor White
            Write-Host "    Length: $length chars" -ForegroundColor Cyan
            
            if ($length -lt 40) {
                Write-Host "    WARNING: Title muy corto" -ForegroundColor Yellow
            } elseif ($length -gt 75) {
                Write-Host "    WARNING: Title muy largo (puede cortarse en SERPs)" -ForegroundColor Yellow
            } else {
                Write-Host "    OK: Longitud adecuada" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nProceso completado." -ForegroundColor Green
