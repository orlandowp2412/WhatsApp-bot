#!/bin/bash

# 🤖 WhatsApp Bot - Instalación INSTANTÁNEA para Termux
# ============================================================
# SIN ACTUALIZACIONES - SOLO LO ESENCIAL

echo "╔════════════════════════════════════════╗"
echo "║  ⚡ INSTALACIÓN INSTANTÁNEA            ║"
echo "║  (Sin actualizaciones del sistema)     ║"
echo "╚════════════════════════════════════════╝"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# 1️⃣ SETUP STORAGE
print_warning "1. Configurando almacenamiento..."
termux-setup-storage >/dev/null 2>&1 &
sleep 0.5
print_status "Almacenamiento listo"

# 2️⃣ INSTALAR SOLO LO NECESARIO (SIN ACTUALIZAR)
print_warning "2. Instalando paquetes necesarios..."
pkg install -y git nodejs ffmpeg imagemagick >/dev/null 2>&1
print_status "Paquetes instalados"

# 3️⃣ CLONAR REPO
print_warning "3. Descargando repositorio..."

if [ -d "WhatsApp-bot" ]; then
    cd WhatsApp-bot
    git fetch origin main -q 2>/dev/null
    git reset --hard origin/main -q 2>/dev/null
else
    git clone https://github.com/orlandowp2412/WhatsApp-bot.git -q --depth=1
    cd WhatsApp-bot
fi

print_status "Repositorio listo"

# 4️⃣ INSTALAR DEPENDENCIAS NPM
print_warning "4. Instalando dependencias del bot..."

rm -rf node_modules package-lock.json 2>/dev/null
npm install --omit=dev --omit=optional --no-audit --no-fund --prefer-offline --ignore-scripts 2>/dev/null

print_status "Dependencias instaladas"

# 5️⃣ LISTO
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ ¡INSTALACIÓN COMPLETADA!          ║"
echo "║     Iniciando bot...                   ║"
echo "╚════════════════════════════════════════╝"
echo ""

npm start
