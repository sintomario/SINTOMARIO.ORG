@echo off
REM SINTOMARIO.ORG — Script Maestro de Build (Windows)
REM Ejecuta todo el pipeline de generación completo

echo ============================================
echo  SINTOMARIO.ORG — Build System
echo  v4.0 — Marzo 2026
echo ============================================
echo.

REM Detectar comando de Python
set PYTHON_CMD=python
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    set PYTHON_CMD=python3
    python3 --version >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        set PYTHON_CMD=py
        py --version >nul 2>&1
        if %ERRORLEVEL% neq 0 (
            echo [ERROR] No se encontro Python en el sistema
            exit /b 1
        )
    )
)
echo 🐍 Usando Python: %PYTHON_CMD%

REM Verificar entorno virtual
if exist ".venv\Scripts\activate.bat" (
    echo [OK] Entorno virtual detectado
) else (
    echo [WARN] No se detecto entorno virtual
)

echo.
echo [1/8] Limpiando directorio public...
if exist public (
    rmdir /s /q public
    echo      ✓ Directorio public eliminado
)
mkdir public
echo      ✓ Directorio public creado

echo.
echo [2/8] Generando corpus principal...
%PYTHON_CMD% motor\sintomario_motor.py --output ./public --verbose
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Fallo en generacion de corpus
    exit /b 1
) else (
    echo      ✓ Corpus generado correctamente
)

echo.
echo [3/8] Generando hubs de navegacion...
%PYTHON_CMD% scripts\generate_hubs.py --output ./public --all
if %ERRORLEVEL% equ 0 (
    echo      ✓ Hubs generados correctamente
) else (
    echo [WARN] Algunos hubs pueden no haberse generado correctamente
    echo       Revisar logs para detalles especificos
)

echo.
echo [4/8] Generando paginas de autores...
%PYTHON_CMD% scripts\enrich_perspectives.py --generate-pages
if %ERRORLEVEL% equ 0 (
    echo      ✓ Paginas de autores generadas correctamente
) else (
    echo [WARN] Algunas paginas de autores pueden no haberse generado
    echo       Revisar logs para detalles especificos
)

echo.
echo [5/8] Validando SEO...
%PYTHON_CMD% scripts\validate_seo.py --public-dir ./public
if %ERRORLEVEL% equ 0 (
    echo      ✓ Validacion SEO completada
) else (
    echo [WARN] Validacion SEO encontro problemas
    echo       Revisar reports\seo-validation-report.json para detalles
)

echo.
echo [6/8] Generando reporte ejecutivo...
%PYTHON_CMD% scripts\generate_report.py --output ./reports/executive-summary.json
if %ERRORLEVEL% equ 0 (
    echo      ✓ Reporte ejecutivo generado
) else (
    echo [WARN] No se pudo generar reporte ejecutivo
    echo       Revisar logs para detalles especificos
)

echo.
echo [7/8] Configurando busqueda Pagefind (opcional)...
echo      Nota: Requiere Node.js y npm instalados
echo      Ejecuta manualmente: %PYTHON_CMD% scripts\setup_search.py --all

echo.
echo [8/8] Verificando estructura...
if exist public\sitemap.xml (
    echo      ✓ Sitemap generado
) else (
    echo [WARN] Sitemap no encontrado
)

if exist public\robots.txt (
    echo      ✓ robots.txt generado
) else (
    echo [WARN] robots.txt no encontrado
)

echo.
echo ============================================
echo  BUILD COMPLETADO
echo ============================================
echo.
echo Proximos pasos:
echo  1. Revisar reporte: reports\executive-summary.json
echo  2. Verificar SEO: reports\seo-validation-report.json
echo  3. Hacer commit: git add . ^&^& git commit -m "build: actualizacion"
echo  4. Hacer push: git push origin main
echo  5. GitHub Actions deployara automaticamente
echo.
echo Para configurar DNS:
echo  - Ve a Cloudflare Dashboard
echo  - Configura 4 registros A apuntando a GitHub Pages
echo  - Espera propagacion DNS (24-48 horas)
echo.
pause
