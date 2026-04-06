# Script para corregir links en todos los hubs de sistema
Get-ChildItem -Directory | ForEach-Object {
    $dirName = $_.Name
    if ($dirName -ne "nervioso" -and $dirName -ne "oseo" -and $dirName -ne "circulatorio") {
        Copy-Item "nervioso/index.html" "$dirName/index.html" -Force
        Write-Host "Updated $dirName/index.html"
    }
}
