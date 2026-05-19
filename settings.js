import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = undefined //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = ['639641178130']
global.suittag = '639641178130'
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = "Baileys Multi Device"
global.vs = "^2.0.1|Update"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botname = "Diablo"
global.textbot = "Diablo, ꮇꭺꭰꭼ ꮃꮖꭲꮋ ᏼꭹ Diablo"
global.dev = "© ⍴᥆ᥕᥱʳᥱძ ᑲᥡ ᴹᴱᴸᴼᴰᴵᴬ"
global.author = "© ꮇᥲძᥱ ᥕі𝗍һ ᑲᥡ Diablo"
global.etiqueta = "Diablo"
global.currency = "usd"
global.banner = ""
global.icono = ""
global.catalogo = fs.readFileSync('')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = ""
global.community = ""
global.channel = ""
global.github = ""
global.gmail = ""
global.ch = {
ch1: "639641178130@s.whatsapp.net"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
  // Primary API (your own). Single source of truth.
  // Set this to your domain (no trailing slash).
  // IMPORTANTE: usa la API key COMPLETA (se muestra solo al crear/rotar).
  // Lo que ves como "Prefix" en el panel NO siempre funciona como key.
  MelodyApi: { url: 'https://api.melodiaauris.qzz.io', key: 'OguriCap-Bot' },
  xyro: { url: "https://api.xyro.site", key: null },
  yupra: { url: "https://api.yupra.my.id", key: null },
  vreden: { url: "https://api.vreden.web.id", key: null },
  delirius: { url: "https://api.delirius.store", key: null },
  zenzxz: { url: "https://api.zenzxz.my.id", key: null },
  siputzx: { url: "https://api.siputzx.my.id", key: null },
  adonix: { url: "https://api-adonix.ultraplus.click", key: 'Yuki-WaBot' }
}

// Download progress bar (for streaming downloads that send Content-Length).
// Styles: classic | blocks | dots | mini
global.downloadProgress = {
  enabled: true,
  style: 'blocks',
  width: 16,
  // WhatsApp puede rate-limitar si editas demasiado seguido.
  updateMs: 2200,
  minBytes: 512 * 1024,
  // Safety cap for raw downloads (avoid wasting bandwidth if WhatsApp rejects big files)
  maxRawBytes: 120 * 1024 * 1024
}

// Backward/forward compatibility aliases (do not edit URLs here).
// Some plugins used `melodia`/`MelodiaApi` keys previously.
try {
  global.APIs.melodia = global.APIs.MelodyApi
  global.APIs.MelodiaApi = global.APIs.MelodyApi
} catch {}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
