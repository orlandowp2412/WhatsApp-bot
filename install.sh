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
pkg install -y -qq git nodejs ffmpeg imagemagick
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

# Paso 5: Instalar dependencias del bot
echo ""
print_warning "Paso 5: Instalando dependencias del bot..."
npm install --silent --no-audit
print_status "Dependencias del bot instaladas"

# Paso 6: Ejecutar el bot
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🚀 ¡Bot listo para ejecutarse!        ║"
echo "╚════════════════════════════════════════╝"
echo ""
print_status "Iniciando el bot..."
echo ""

npm start
