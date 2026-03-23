#!/usr/bin/env python3
"""
SINTOMARIO.ORG — Cross-platform Python Command Detector
Detecta el comando de Python adecuado para el sistema operativo actual.
"""

import sys
import subprocess
import shutil
from pathlib import Path

def detect_python_command():
    """
    Detecta el comando de Python adecuado para el sistema actual.
    Retorna una lista de comandos a intentar en orden de preferencia.
    """
    if sys.platform == "win32":
        # Windows: Prioridad a python, luego python3
        return ["python", "python3", "py"]
    else:
        # Unix/Linux/Mac: Prioridad a python3, luego python
        return ["python3", "python"]

def test_python_command(command):
    """
    Prueba si un comando de Python funciona correctamente.
    """
    try:
        result = subprocess.run(
            [command, "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def get_working_python():
    """
    Obtiene el comando de Python que funciona en el sistema actual.
    """
    commands = detect_python_command()
    
    for cmd in commands:
        if test_python_command(cmd):
            print(f"✅ Python detectado: {cmd}")
            return cmd
    
    raise RuntimeError("❌ No se encontró Python en el sistema")

def get_python_command_args(script_path, *args):
    """
    Genera la lista de argumentos para ejecutar un script Python de forma segura.
    """
    python_cmd = get_working_python()
    
    # Validar que el script existe
    if not Path(script_path).exists():
        raise FileNotFoundError(f"❌ Script no encontrado: {script_path}")
    
    # Construir lista de argumentos
    command_args = [python_cmd, script_path]
    command_args.extend(args)
    
    return command_args

if __name__ == "__main__":
    # Test del detector
    try:
        python_cmd = get_working_python()
        print(f"Comando Python recomendado: {python_cmd}")
        
        # Test con script
        if len(sys.argv) > 1:
            script_args = get_python_command_args(sys.argv[1], *sys.argv[2:])
            print(f"Comando completo: {' '.join(script_args)}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
