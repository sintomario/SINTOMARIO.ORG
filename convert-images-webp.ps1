# CONVERSIÓN CRÍTICA DE IMÁGENES A WEBP - SINTOMARIO.ORG
# Reducir 8.71MB a <1.5MB para cumplir Core Web Vitals

Write-Host "=== CONVERSIÓN CRÍTICA DE IMÁGENES ===" -ForegroundColor Red
Write-Host ""

# 1. Análisis actual de imágenes
$imgFiles = Get-ChildItem "*.png", "*.jpg", "*.jpeg" -Recurse
$totalSizeBefore = ($imgFiles | Measure-Object -Property Length -Sum).Sum
$imgCount = $imgFiles.Count

Write-Host "1. ANÁLISIS ACTUAL" -ForegroundColor Yellow
Write-Host "  Imágenes encontradas: $imgCount" -ForegroundColor White
Write-Host "  Tamaño total: $([math]::Round($totalSizeBefore/1MB, 2)) MB" -ForegroundColor Red
Write-Host "  Promedio por imagen: $([math]::Round($totalSizeBefore/$imgCount/1KB, 2)) KB" -ForegroundColor Red

# 2. Identificar imágenes pesadas (>100KB)
$heavyImages = $imgFiles | Where-Object { $_.Length -gt 100KB }
Write-Host "`n2. IMÁGENES PESADAS (>100KB)" -ForegroundColor Yellow
Write-Host "  Imágenes pesadas: $($heavyImages.Count)" -ForegroundColor $(if($heavyImages.Count -eq 0){"Green"} else {"Red"})

foreach ($img in $heavyImages) {
    $sizeMB = [math]::Round($img.Length/1MB, 2)
    $path = $img.FullName.Replace((Get-Location).Path, "")
    Write-Host "    $path ($sizeMB MB)" -ForegroundColor Red
}

# 3. Verificar si ImageMagick está disponible
try {
    $magickVersion = & magick -version 2>$null
    Write-Host "`n3. ImageMagick disponible: SÍ" -ForegroundColor Green
    $canConvert = $true
} catch {
    Write-Host "`n3. ImageMagick disponible: NO" -ForegroundColor Red
    Write-Host "   REQUERIDO: Instalar ImageMagick para conversión" -ForegroundColor Yellow
    Write-Host "   Descargar: https://imagemagick.org/script/download.php" -ForegroundColor Gray
    $canConvert = $false
}

# 4. Si ImageMagick disponible, proceder con conversión
if ($canConvert) {
    Write-Host "`n4. INICIANDO CONVERSIÓN A WEBP" -ForegroundColor Yellow
    
    $convertedCount = 0
    $totalSizeAfter = 0
    $savings = 0
    
    foreach ($img in $imgFiles) {
        $webpPath = $img.FullName.Replace($img.Extension, ".webp")
        
        # Skip si ya existe WebP
        if (Test-Path $webpPath) {
            $totalSizeAfter += (Get-Item $webpPath).Length
            $convertedCount++
            continue
        }
        
        try {
            # Convertir a WebP con calidad 85% (balance calidad/tamaño)
            & magick convert $img.FullName -quality 85 -define webp:method=6 $webpPath
            
            $originalSize = $img.Length
            $webpSize = (Get-Item $webpPath).Length
            $reduction = ($originalSize - $webpSize) / $originalSize * 100
            
            $totalSizeAfter += $webpSize
            $savings += $originalSize - $webpSize
            $convertedCount++
            
            Write-Host "  CONVERTIDO: $($img.Name) -> WebP ($([math]::Round($reduction, 1))% reducción)" -ForegroundColor Green
            
        } catch {
            Write-Host "  ERROR: No se pudo convertir $($img.Name)" -ForegroundColor Red
        }
    }
    
    # 5. Reporte final
    Write-Host "`n5. REPORTE DE CONVERSIÓN" -ForegroundColor Yellow
    Write-Host "  Imágenes convertidas: $convertedCount/$imgCount" -ForegroundColor White
    Write-Host "  Tamaño original: $([math]::Round($totalSizeBefore/1MB, 2)) MB" -ForegroundColor Red
    Write-Host "  Tamaño WebP: $([math]::Round($totalSizeAfter/1MB, 2)) MB" -ForegroundColor $(if($totalSizeAfter/1MB -lt 1.5){"Green"} else {"Yellow"})
    Write-Host "  Ahorro total: $([math]::Round($savings/1MB, 2)) MB ($([math]::Round($savings/$totalSizeBefore*100, 1))%)" -ForegroundColor Green
    
    # 6. Verificar objetivo
    if ($totalSizeAfter/1MB -lt 1.5) {
        Write-Host "`n  OBJETIVO CUMPLIDO: <1.5MB" -ForegroundColor Green
    } else {
        Write-Host "`n  OBJETIVO NO CUMPLIDO: Todavía >1.5MB" -ForegroundColor Yellow
        Write-Host "  Recomendación: Reducir calidad a 75% o eliminar imágenes innecesarias" -ForegroundColor Gray
    }
    
} else {
    Write-Host "`n4. ACCIÓN REQUERIDA" -ForegroundColor Red
    Write-Host "  1. Instalar ImageMagick" -ForegroundColor White
    Write-Host "  2. Ejecutar este script nuevamente" -ForegroundColor White
    Write-Host "  3. Alternativa: Usar herramienta online Squoosh.app" -ForegroundColor Gray
}

Write-Host "`n=== CONVERSIÓN COMPLETADA ===" -ForegroundColor $(if($canConvert){"Green"} else {"Red"})
