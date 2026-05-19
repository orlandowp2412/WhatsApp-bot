import pkg from '@whiskeysockets/baileys';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSION_DIR = path.join(__dirname, 'sessions');
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Crear directorio de sesión
await fs.ensureDir(SESSION_DIR);

// Configuración predeterminada
let config = {
  prefix: '.',
  antilink: false,
  selfMode: false,
  owner: process.env.OWNER_NUMBER || '639641178130@s.whatsapp.net'
};

// Cargar configuración
if (await fs.pathExists(CONFIG_FILE)) {
  config = await fs.readJSON(CONFIG_FILE);
}

async function saveConfig() {
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
}

async function connectBot() {
  console.log(chalk.cyan('╔════════════════════════════════╗'));
  console.log(chalk.cyan('║  WhatsApp Bot - Vinculando     ║'));
  console.log(chalk.cyan('╚════════════════════════════════╝\n'));

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    syncFullHistory: true,
    defaultQueryTimeoutMs: undefined,
  });

  // Evento: Actualización de credenciales
  socket.ev.on('creds.update', saveCreds);

  // Evento: Actualización de conexión
  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log(chalk.green('✅ Bot conectado exitosamente\n'));
      
      // Generar y mostrar código de vinculación
      try {
        const phoneNumber = config.owner.split('@')[0];
        const pairingCode = await socket.requestPairingCode(phoneNumber);
        console.log(chalk.bold.white(chalk.bgMagenta('🔐 CÓDIGO DE VINCULACIÓN:')));
        console.log(chalk.bold.yellow(`\n   ${pairingCode}\n`));
        console.log(chalk.cyan('📱 Ingresa este código en WhatsApp:'));
        console.log(chalk.gray('   Dispositivos Vinculados > Vincular Dispositivo > Vincular con número\n'));
      } catch (err) {
        console.log(chalk.red('Error al generar código:', err.message));
      }
    }

    if (connection === 'close') {
      let reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === 401 || reason === 440) {
        console.log(chalk.red('❌ Sesión expirada. Eliminando sesión...'));
        await fs.remove(SESSION_DIR);
        process.exit();
      } else {
        console.log(chalk.yellow('⏳ Reconectando...'));
        setTimeout(() => connectBot(), 3000);
      }
    }
  });

  // Evento: Mensajes recibidos
  socket.ev.on('messages.upsert', async (m) => {
    const message = m.messages[0];
    if (!message.message) return;

    const isOwner = message.key.remoteJid === config.owner;
    const isGroup = message.key.remoteJid.endsWith('@g.us');
    const sender = message.key.participant || message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ');
    const command = args[0].toLowerCase();

    console.log(chalk.gray(`[${new Date().toLocaleTimeString()}]`), chalk.blue(sender), chalk.yellow(text));

    // Si está en modo self y no es owner, ignorar
    if (config.selfMode && !isOwner) return;

    if (!text.startsWith(config.prefix)) return;

    const cmd = command.slice(config.prefix.length);

    try {
      switch (cmd) {
        case 'abrir':
          if (isOwner) {
            config.selfMode = false;
            await saveConfig();
            await socket.sendMessage(message.key.remoteJid, { text: '✅ Bot abierto - Todos pueden usar comandos' });
          }
          break;

        case 'close':
          if (isOwner) {
            config.selfMode = true;
            await saveConfig();
            await socket.sendMessage(message.key.remoteJid, { text: '🔒 Bot cerrado - Solo el owner puede usar comandos' });
          }
          break;

        case 'setprefix':
          if (isOwner) {
            const newPrefix = args[1] || '.';
            config.prefix = newPrefix;
            await saveConfig();
            await socket.sendMessage(message.key.remoteJid, { text: `✅ Prefijo cambiado a: ${newPrefix}` });
          }
          break;

        case 'sinprefix':
          if (isOwner) {
            const textCmd = text.slice(command.length).trim();
            await socket.sendMessage(message.key.remoteJid, { text: `✓ Comando ejecutado: ${textCmd}` });
          }
          break;

        case 'antilink':
          if (isOwner) {
            const toggle = args[1]?.toLowerCase();
            if (toggle === 'on') {
              config.antilink = true;
              await saveConfig();
              await socket.sendMessage(message.key.remoteJid, { text: '🔗 Anti-link activado' });
            } else if (toggle === 'off') {
              config.antilink = false;
              await saveConfig();
              await socket.sendMessage(message.key.remoteJid, { text: '🔗 Anti-link desactivado' });
            }
          }
          break;

        case 'play':
          if (!isOwner && config.selfMode) break;
          await socket.sendMessage(message.key.remoteJid, { 
            text: '🎵 Comando play: Descarga música de YouTube\n(Requiere API configurada)' 
          });
          break;

        case 'play2':
          if (!isOwner && config.selfMode) break;
          await socket.sendMessage(message.key.remoteJid, { 
            text: '🎵 Comando play2: Alternativa de descarga\n(Requiere API configurada)' 
          });
          break;

        case 'owner':
          await socket.sendMessage(message.key.remoteJid, { 
            text: `👤 Owner del bot: ${config.owner.split('@')[0]}` 
          });
          break;

        case 'self':
          if (isOwner) {
            const toggle = args[1]?.toLowerCase();
            if (toggle === 'on') {
              config.selfMode = true;
              await saveConfig();
              await socket.sendMessage(message.key.remoteJid, { text: '🔒 Modo self activado' });
            } else if (toggle === 'off') {
              config.selfMode = false;
              await saveConfig();
              await socket.sendMessage(message.key.remoteJid, { text: '🔓 Modo self desactivado' });
            }
          }
          break;

        case 'update':
          if (isOwner) {
            await socket.sendMessage(message.key.remoteJid, { 
              text: '📦 Verificando actualizaciones...' 
            });
          }
          break;

        case 'link':
          if (isGroup) {
            try {
              const code = await socket.groupInviteCode(message.key.remoteJid);
              await socket.sendMessage(message.key.remoteJid, { 
                text: `🔗 Link del grupo:\nhttps://chat.whatsapp.com/${code}` 
              });
            } catch (e) {
              await socket.sendMessage(message.key.remoteJid, { text: '❌ Error al obtener link' });
            }
          }
          break;

        case 'kick':
          if (isGroup && isOwner) {
            const mentionedJid = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (mentionedJid) {
              await socket.groupParticipantsUpdate(message.key.remoteJid, [mentionedJid], 'remove');
              await socket.sendMessage(message.key.remoteJid, { text: '✅ Usuario expulsado' });
            } else {
              await socket.sendMessage(message.key.remoteJid, { text: '❌ Menciona un usuario para expulsarlo' });
            }
          }
          break;

        case 'delete':
          try {
            if (message.message.extendedTextMessage?.contextInfo?.stanzaId) {
              await socket.sendMessage(message.key.remoteJid, { 
                delete: message.message.extendedTextMessage.contextInfo 
              });
              await socket.sendMessage(message.key.remoteJid, { text: '✅ Mensaje eliminado' });
            } else {
              await socket.sendMessage(message.key.remoteJid, { text: '❌ Responde a un mensaje para eliminarlo' });
            }
          } catch (err) {
            await socket.sendMessage(message.key.remoteJid, { text: '❌ Error: No puedo eliminar ese mensaje' });
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(chalk.red('Error ejecutando comando:'), error);
      await socket.sendMessage(message.key.remoteJid, { text: '❌ Error: ' + error.message });
    }
  });
}

connectBot().catch(console.error);
