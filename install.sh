#!/bin/bash

# 🤖 Script de Instalación Automática - WhatsApp Bot para Termux
# ============================================================

echo "╔════════════════════════════════════════╗"
echo "║  📱 WhatsApp Bot - Instalación Rápida  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Color de texto
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Función para verificar comando
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Paso 1: Configurar permisos de almacenamiento
echo ""
print_warning "Paso 1: Configurando permisos de almacenamiento..."
termux-setup-storage 2>/dev/null
print_status "Permisos configurados"

# Paso 2: Actualizar sistema
echo ""
print_warning "Paso 2: Actualizando sistema (esto puede tomar un tiempo)..."
apt update -qq && apt upgrade -y -qq
print_status "Sistema actualizado"

# Paso 3: Instalar dependencias
echo ""
print_warning "Paso 3: Instalando dependencias necesarias..."
pkg install -y -qq git nodejs ffmpeg imagemagick python

# Verificar que Node.js se instaló correctamente
if ! command_exists node; then
    print_error "Node.js no se instaló correctamente. Intentando de nuevo..."
    pkg install -y nodejs
fi

if ! command_exists npm; then
    print_error "npm no se instaló correctamente. Intentando de nuevo..."
    pkg install -y npm
fi

print_status "Dependencias instaladas"

# Paso 4: Verificar si el repo ya existe
echo ""
if [ -d "WhatsApp-bot" ]; then
    print_warning "La carpeta 'WhatsApp-bot' ya existe"
    read -p "¿Deseas actualizar el repositorio? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        cd WhatsApp-bot
        print_warning "Actualizando repositorio..."
        git pull origin main -q
        print_status "Repositorio actualizado"
    fi
else
    print_warning "Paso 4: Clonando repositorio..."
    git clone https://github.com/orlandowp2412/WhatsApp-bot.git -q
    cd WhatsApp-bot
    print_status "Repositorio clonado"
fi

# Paso 5: Limpiar dependencias anteriores si existen
echo ""
print_warning "Paso 5: Preparando dependencias..."
rm -rf node_modules package-lock.json 2>/dev/null
print_status "Limpieza completada"

# Paso 6: Instalar dependencias del bot
echo ""
print_warning "Paso 6: Instalando dependencias del bot (esto toma varios minutos)..."
npm install --no-audit --legacy-peer-deps

# Verificar que la instalación fue exitosa
if [ ! -f "package.json" ] || [ ! -d "node_modules" ]; then
    print_error "Error: Las dependencias no se instalaron correctamente"
    exit 1
fi

print_status "Dependencias del bot instaladas"

# Paso 7: Verificar que npm start existe
echo ""
npm run 2>/dev/null | grep -q "start"
if [ $? -eq 0 ]; then
    print_status "Script 'start' verificado"
else
    print_warning "Verificando scripts disponibles..."
    npm run
fi

# Paso 8: Ejecutar el bot
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🚀 ¡Bot listo para ejecutarse!        ║"
echo "╚════════════════════════════════════════╝"
echo ""
print_status "Iniciando el bot..."
echo ""

npm start
