# 🤖 WhatsApp Bot - Versión Simplificada

Un bot de WhatsApp minimalista y funcional con vinculación por código de dígitos.

## ✨ Características

- ✅ Vinculación por código de dígitos (6-8 dígitos)
- ✅ 13 comandos esenciales
- ✅ Fácil de instalar en Termux
- ✅ Configuración persistente
- ✅ Sistema de prefijos customizables

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `.abrir` | Abre el bot (todos pueden usar comandos) |
| `.close` | Cierra el bot (solo owner) |
| `.setprefix` | Cambia el prefijo del bot |
| `.sinprefix` | Ejecuta comandos sin prefijo |
| `.antilink on/off` | Activa/desactiva anti-links |
| `.play` | Descarga música de YouTube |
| `.play2` | Alternativa de descarga |
| `.owner` | Muestra el owner del bot |
| `.self on/off` | Activa/desactiva modo self |
| `.update` | Verifica actualizaciones |
| `.link` | Obtiene link del grupo |
| `.kick @usuario` | Expulsa un usuario del grupo |
| `.delete` | Elimina un mensaje |

## 📥 Instalación en Termux

### Paso 1: Descargar Termux
Descarga Termux desde [Google Play](https://play.google.com/store/apps/details?id=com.termux) o desde [F-Droid](https://f-droid.org/packages/com.termux/)

### Paso 2: Dar Permisos de Almacenamiento
```bash
termux-setup-storage
```

### Paso 3: Actualizar el Sistema
```bash
apt update && apt upgrade -y
```

### Paso 4: Instalar Dependencias
```bash
pkg install -y git nodejs ffmpeg imagemagick
```

### Paso 5: Clonar el Repositorio
```bash
git clone https://github.com/orlandowp2412/WhatsApp-bot.git
cd WhatsApp-bot
```

### Paso 6: Instalar Dependencias del Bot
```bash
npm install
```

### Paso 7: Ejecutar el Bot
```bash
npm start
```

## 🔐 Vinculación del Bot

1. Cuando ejecutes `npm start`, el bot generará un **código de 6-8 dígitos**
2. En WhatsApp ve a:
   - **Configuración** → **Dispositivos Vinculados** → **Vincular Dispositivo**
   - O en la opción **Vincular con número**
3. Ingresa el código que apareció en la terminal de Termux
4. ¡El bot estará listo para usar!

## ⚙️ Mantener el Bot Activo 24/7 (PM2)

Para que el bot siga funcionando incluso si cierras Termux:

```bash
npm install -g pm2
pm2 start index.js
pm2 save
pm2 logs
```

**Comandos Útiles:**
- `pm2 logs` - Ver los registros en tiempo real
- `pm2 stop index` - Detener el bot
- `pm2 start index` - Iniciar el bot nuevamente
- `pm2 delete index` - Eliminar el proceso

## 🔧 Solución de Problemas

### El bot no se conecta
```bash
cd WhatsApp-bot
npm start
```

### Generar nuevo código QR
```bash
rm -rf sessions/
npm start
```

### Actualizar el bot
```bash
git pull origin main
npm install
npm start
```

## 📝 Archivo de Configuración

El bot crea automáticamente un `config.json` con:
- Prefijo del bot (por defecto: `.`)
- Estado del anti-link
- Estado del modo self
- Owner del bot

## ⚠️ Aviso Importante

Este proyecto **no está afiliado** de ninguna manera con WhatsApp Inc. Es un desarrollo independiente utilizando la librería [Baileys](https://github.com/WhiskeySockets/Baileys).

## 📱 Soporte

Si tienes problemas o sugerencias:
- Abre un [Issue](https://github.com/orlandowp2412/WhatsApp-bot/issues)
- Contacta al owner del bot desde WhatsApp

## 📄 Licencia

MIT - Puedes usar este código libremente

---

**Hecho con ❤️ por orlandowp2412**
