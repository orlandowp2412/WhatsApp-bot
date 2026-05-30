#!/bin/bash

# 🤖 WhatsApp Bot - Instalación ULTRA RÁPIDA para Termux
# ============================================================

echo "╔════════════════════════════════════════╗"
echo "║  ⚡ Instalación ULTRA RÁPIDA           ║"
echo "╚════════════════════════════════════════╝"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Desactivar logs verbosos
export npm_config_loglevel=error
export npm_config_audit=false
export npm_config_fund=false

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# 1️⃣ SETUP STORAGE (sin esperar confirmación)
print_warning "1. Configurando almacenamiento..."
termux-setup-storage >/dev/null 2>&1 &
sleep 1
print_status "Almacenamiento listo"

# 2️⃣ ACTUALIZAR (solo lo esencial, muy rápido)
print_warning "2. Actualizando paquetes..."
apt update -y >/dev/null 2>&1
apt upgrade -y -o Dpkg::Pre-Install-Pkgs::="/bin/true" >/dev/null 2>&1
print_status "Actualización completada"

# 3️⃣ INSTALAR DEPENDENCIAS (EN PARALELO - SIN ESPERAR)
print_warning "3. Instalando dependencias..."

pkg install -y git nodejs ffmpeg imagemagick >/dev/null 2>&1 &
wait

print_status "Dependencias instaladas"

# 4️⃣ CLONAR REPO (o actualizar)
print_warning "4. Preparando repositorio..."

if [ -d "WhatsApp-bot" ]; then
    cd WhatsApp-bot
    git pull origin main -q 2>/dev/null
else
    git clone https://github.com/orlandowp2412/WhatsApp-bot.git -q --depth=1
    cd WhatsApp-bot
fi

print_status "Repositorio listo"

# 5️⃣ INSTALAR DEPENDENCIAS NPM (ULTRA RÁPIDO)
print_warning "5. Instalando paquetes npm..."

rm -rf node_modules package-lock.json 2>/dev/null
npm install --omit=dev --omit=optional --no-audit --no-fund --prefer-offline 2>/dev/null

print_status "Paquetes npm instalados"

# 6️⃣ LISTO PARA EJECUTAR
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ ¡LISTO PARA EJECUTAR!             ║"
echo "╚════════════════════════════════════════╝"
echo ""
print_status "Iniciando el bot..."
echo ""

npm start
