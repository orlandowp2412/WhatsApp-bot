#!/usr/bin/env node
import pkg from '@whiskeysockets/baileys'
import chalk from 'chalk'
import qrcode from 'qrcode-terminal'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SESSION_DIR = path.join(__dirname, 'session')
const CONFIG_FILE = path.join(__dirname, 'config.json')

// Crear directorio de sesión
await fs.ensureDir(SESSION_DIR)

// Configuración predeterminada
let config = {
  prefix: '.',
  antilink: false,
  selfMode: false,
  owner: process.env.OWNER_NUMBER || '34123456789@s.whatsapp.net'
}

// Cargar/guardar configuración
const loadConfig = async () => {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      config = await fs.readJSON(CONFIG_FILE)
    } else {
      await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 })
    }
  } catch (e) {
    console.log(chalk.yellow('⚠️  Usando configuración predeterminada'))
  }
}

const saveConfig = async () => {
  try {
    await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 })
  } catch (e) {
    console.error(chalk.red('Error guardando config:', e.message))
  }
}

await loadConfig()

async function connectBot() {
  console.log(chalk.cyan('╔════════════════════════════════╗'))
  console.log(chalk.cyan('║  🤖 WhatsApp Bot - Iniciando   ║'))
  console.log(chalk.cyan('╚════════════════════════════════╝\n'))

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['Ubuntu', 'Chrome', '120.0.0'],
    syncFullHistory: false,
    defaultQueryTimeoutMs: 0,
  })

  // Guardar credenciales
  socket.ev.on('creds.update', saveCreds)

  // Manejo de conexión
  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log(chalk.yellow('\n📱 Escanea el código QR:\n'))
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log(chalk.green('✅ Bot conectado exitosamente\n'))
      
      // Generar código de vinculación
      try {
        const phoneNumber = config.owner.split('@')[0]
        const pairingCode = await socket.requestPairingCode(phoneNumber)
        console.log(chalk.green('🔐 Código de vinculación: ') + chalk.yellow(pairingCode))
        console.log(chalk.cyan('Ingresa este código en WhatsApp > Dispositivos Vinculados\n'))
      } catch (err) {
        console.log(chalk.yellow('⚠️  Código de vinculación no disponible en este momento'))
      }
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      if (reason === 401 || reason === 440) {
        console.log(chalk.red('❌ Sesión expirada. Elimina la carpeta "session" e intenta de nuevo.'))
        process.exit(0)
      } else {
        console.log(chalk.yellow('⏳ Reconectando...'))
        setTimeout(() => connectBot(), 5000)
      }
    }
  })

  // Procesar mensajes
  socket.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0]
    if (!message.message) return

    const jid = message.key.remoteJid
    const sender = message.key.participant || jid
    const isOwner = sender === config.owner || jid === config.owner
    const isGroup = jid.endsWith('@g.us')
    
    const text = message.message.conversation || 
                 message.message.extendedTextMessage?.text || ''
    
    if (!text.startsWith(config.prefix)) return

    const args = text.split(' ')
    const cmd = args[0].slice(config.prefix.length).toLowerCase()

    // Verificar modo self
    if (config.selfMode && !isOwner) return

    try {
      console.log(chalk.gray(`[${new Date().toLocaleTimeString()}]`), chalk.blue(sender), chalk.yellow(text))

      switch (cmd) {
        case 'abrir':
          if (!isOwner) return
          config.selfMode = false
          await saveConfig()
          await socket.sendMessage(jid, { text: '✅ Bot abierto - Todos pueden usar comandos' })
          break

        case 'close':
          if (!isOwner) return
          config.selfMode = true
          await saveConfig()
          await socket.sendMessage(jid, { text: '🔒 Bot cerrado - Solo el owner puede usar comandos' })
          break

        case 'setprefix':
          if (!isOwner) return
          const newPrefix = args[1] || '.'
          config.prefix = newPrefix
          await saveConfig()
          await socket.sendMessage(jid, { text: `✅ Prefijo cambiado a: ${newPrefix}` })
          break

        case 'sinprefix':
          if (!isOwner) return
          const resultado = text.slice(cmd.length + config.prefix.length).trim()
          await socket.sendMessage(jid, { text: `📝 Ejecutado: ${resultado}` })
          break

        case 'antilink':
          if (!isOwner && !isGroup) return
          const toggle = args[1]?.toLowerCase()
          if (toggle === 'on') {
            config.antilink = true
            await saveConfig()
            await socket.sendMessage(jid, { text: '🔗 Anti-link activado' })
          } else if (toggle === 'off') {
            config.antilink = false
            await saveConfig()
            await socket.sendMessage(jid, { text: '🔗 Anti-link desactivado' })
          }
          break

        case 'play':
          await socket.sendMessage(jid, { text: '🎵 Play: Descarga música de YouTube\n(Requiere API)' })
          break

        case 'play2':
          await socket.sendMessage(jid, { text: '🎵 Play2: Alternativa de descarga\n(Requiere API)' })
          break

        case 'owner':
          const ownerNum = config.owner.split('@')[0]
          await socket.sendMessage(jid, { text: `👤 Owner: +${ownerNum}` })
          break

        case 'self':
          if (!isOwner) return
          const mode = args[1]?.toLowerCase()
          if (mode === 'on') {
            config.selfMode = true
            await saveConfig()
            await socket.sendMessage(jid, { text: '🔒 Modo Self activado' })
          } else if (mode === 'off') {
            config.selfMode = false
            await saveConfig()
            await socket.sendMessage(jid, { text: '🔓 Modo Self desactivado' })
          }
          break

        case 'update':
          if (!isOwner) return
          await socket.sendMessage(jid, { text: '📦 Comprobando actualizaciones...' })
          break

        case 'link':
          if (!isGroup) {
            await socket.sendMessage(jid, { text: '⚠️  Este comando solo funciona en grupos' })
            return
          }
          try {
            const code = await socket.groupInviteCode(jid)
            await socket.sendMessage(jid, { text: `🔗 Link del grupo:\nhttps://chat.whatsapp.com/${code}` })
          } catch (e) {
            await socket.sendMessage(jid, { text: '❌ Error al obtener link del grupo' })
          }
          break

        case 'kick':
          if (!isGroup || !isOwner) return
          const mentioned = message.message.extendedTextMessage?.contextInfo?.mentionedJid
          if (mentioned && mentioned.length > 0) {
            await socket.groupParticipantsUpdate(jid, mentioned, 'remove')
            await socket.sendMessage(jid, { text: '✅ Usuario(s) expulsado(s)' })
          } else {
            await socket.sendMessage(jid, { text: '⚠️  Menciona al usuario a expulsar' })
          }
          break

        case 'delete':
          const quoted = message.message.extendedTextMessage?.contextInfo?.quotedMessage
          if (quoted) {
            const msgId = message.message.extendedTextMessage.contextInfo.stanzaId
            await socket.sendMessage(jid, { delete: { remoteJid: jid, fromMe: true, id: msgId } })
          } else {
            await socket.sendMessage(jid, { text: '⚠️  Responde al mensaje que deseas eliminar' })
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error(chalk.red('Error:', error.message))
      await socket.sendMessage(jid, { text: '❌ Error: ' + error.message })
    }
  })
}

// Iniciar bot
console.log(chalk.magenta('\n🚀 Iniciando WhatsApp Bot...\n'))
connectBot().catch(err => {
  console.error(chalk.red('Error crítico:', err))
  process.exit(1)
})

// Manejo de señales
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Bot cerrado correctamente'))
  process.exit(0)
})
