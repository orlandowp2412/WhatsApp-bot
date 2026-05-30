#!/bin/bash

# 🤖 WhatsApp Bot - ABRE YA! (Sin instalaciones)
# ============================================================

echo "╔════════════════════════════════════════╗"
echo "║  🚀 ABRIENDO BOT INSTANTÁNEAMENTE      ║"
echo "╚════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# 1️⃣ Entrar a la carpeta del bot (o clonar si no existe)
if [ ! -d "WhatsApp-bot" ]; then
    print_warning "Descargando bot por primera vez..."
    git clone https://github.com/orlandowp2412/WhatsApp-bot.git -q --depth=1
fi

cd WhatsApp-bot
print_status "Bot descargado"

# 2️⃣ Instalar dependencias sin ruido
print_warning "Instalando dependencias..."
npm install --omit=dev --omit=optional --no-audit --no-fund --prefer-offline --ignore-scripts -q 2>/dev/null &
wait
print_status "Dependencias listas"

# 3️⃣ ¡ABRE YA!
echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ ¡EL BOT ESTÁ LISTO!               ║"
echo "╚════════════════════════════════════════╝"
echo ""

npm start
