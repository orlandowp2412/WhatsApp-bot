#!/bin/bash

# 🤖 Script de Instalación Automática - WhatsApp Bot para Termux (OPTIMIZADO)
# ============================================================

echo "╔════════════════════════════════════════╗"
echo "║  📱 WhatsApp Bot - Instalación Rápida  ║"
echo "║       (Versión Optimizada)             ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# ===== PASO 1: Permisos de Almacenamiento =====
echo ""
print_warning "Configurando permisos de almacenamiento..."
termux-setup-storage 2>/dev/null
print_status "Permisos configurados"

# ===== PASO 2: Actualización Rápida =====
echo ""
print_warning "Actualizando el sistema (esto puede tomar 1-2 minutos)..."
apt update -qq
apt upgrade -y -qq

if [ $? -ne 0 ]; then
    print_error "Hubo un problema en la actualización, continuando de todas formas..."
fi

print_status "Sistema actualizado"

# ===== PASO 3: Instalar Dependencias Esenciales =====
echo ""
print_warning "Instalando dependencias esenciales..."

# Instalar en paralelo para acelerar
pkg install -y -qq git curl wget 2>/dev/null &
PID1=$!

pkg install -y -qq nodejs ffmpeg 2>/dev/null &
PID2=$!

pkg install -y -qq imagemagick python 2>/dev/null &
PID3=$!

# Esperar a que todas las instalaciones terminen
wait $PID1 $PID2 $PID3

print_status "Dependencias instaladas"

# ===== PASO 4: Verificar Instalaciones =====
echo ""
print_info "Verificando instalaciones..."

if ! command -v node &> /dev/null; then
    print_warning "Node.js no se encontró, reinstalando..."
    pkg install -y nodejs
fi

if ! command -v npm &> /dev/null; then
    print_warning "npm no se encontró, reinstalando..."
    pkg install -y npm
fi

if ! command -v git &> /dev/null; then
    print_error "Git es requerido pero no está instalado"
    exit 1
fi

print_status "Todas las dependencias están disponibles"

# ===== PASO 5: Clonar o Actualizar Repositorio =====
echo ""

if [ -d "WhatsApp-bot" ]; then
    print_warning "Carpeta 'WhatsApp-bot' encontrada"
    cd WhatsApp-bot
    print_info "Actualizando repositorio..."
    git pull origin main -q 2>/dev/null || print_warning "No se pudo actualizar, usando versión local"
else
    print_warning "Clonando repositorio..."
    git clone https://github.com/orlandowp2412/WhatsApp-bot.git -q
    if [ $? -ne 0 ]; then
        print_error "Error al clonar el repositorio"
        exit 1
    fi
    cd WhatsApp-bot
fi

print_status "Repositorio listo"

# ===== PASO 6: Limpiar y Instalar Dependencias =====
echo ""
print_warning "Instalando dependencias del bot (esto tomará algunos minutos)..."

# Limpiar cache de npm
npm cache clean --force -q

# Eliminar node_modules anterior si existe
rm -rf node_modules package-lock.json 2>/dev/null

# Instalar con opciones optimizadas para Termux
npm install --no-optional --legacy-peer-deps --prefer-offline -q

if [ ! -d "node_modules" ]; then
    print_error "Error: Las dependencias no se instalaron correctamente"
    print_info "Intentando nuevamente..."
    npm install --legacy-peer-deps
fi

print_status "Dependencias instaladas"

# ===== PASO 7: Listo para Ejecutar =====
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  🚀 ¡Instalación completada!           ║"
echo "╚════════════════════════════════════════╝"
echo ""
print_status "Iniciando el bot..."
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

npm start
