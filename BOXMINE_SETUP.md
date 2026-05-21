# 🔗 Guía de Integración Boxmine

## Descripción
Este documento proporciona una guía completa para integrar tu WhatsApp Bot con **Boxmine**, permitiendo sincronizar usuarios, mensajes y campañas.

## 📋 Requisitos

- ✅ Node.js >= 20.0.0
- ✅ npm >= 9.0.0
- ✅ Cuenta en Boxmine con credenciales de API

## 🚀 Instalación Rápida

### Paso 1: Obtener Credenciales de Boxmine

1. Ve a [Boxmine Dashboard](https://app.boxmine.io)
2. Navega a **Settings** → **API Keys**
3. Copia tu `API_KEY` y `TOKEN`

### Paso 2: Configurar Variables de Entorno

Edita tu `.env`:

```env
# Boxmine Configuration
BOXMINE_URL=https://api.boxmine.io
BOXMINE_API_KEY=tu_api_key_aqui
BOXMINE_TOKEN=tu_token_aqui
APP_URL=http://localhost:3000
ENABLE_BOXMINE_SYNC=true
```

### Paso 3: Verificar Conexión

```javascript
import boxmineService from './lib/services/boxmineService.js';

const result = await boxmineService.testConnection();
console.log(result);
```

## 📚 Métodos Disponibles

### Usuarios

```javascript
// Crear usuario
await boxmineService.createUser({
  name: 'Juan Pérez',
  phone: '+573001234567',
  email: 'juan@example.com',
  whatsappId: '573001234567'
});

// Obtener usuario
await boxmineService.getUser('user_id');

// Actualizar usuario
await boxmineService.updateUser('user_id', {
  name: 'Juan P. García',
  email: 'nuevo@example.com'
});

// Listar usuarios
await boxmineService.listUsers(1, 50);
```

### Mensajes

```javascript
// Sincronizar mensaje
await boxmineService.syncMessage({
  body: 'Hola, esto es un mensaje',
  key: {
    fromMe: false,
    participant: '573001234567',
    remoteJid: '573001234567@s.whatsapp.net',
    id: 'msg_123'
  },
  messageTimestamp: Date.now(),
  type: 'text',
  status: 'delivered'
});
```

### Campañas

```javascript
// Crear campaña
await boxmineService.createCampaign({
  name: 'Campaña Mayo',
  description: 'Promoción especial',
  targetUsers: ['user_1', 'user_2'],
  message: '¡Descuento del 50%!',
  scheduleTime: new Date().toISOString()
});

// Obtener campañas
await boxmineService.getCampaigns('active');
```

### Estadísticas

```javascript
// Obtener estadísticas
await boxmineService.getStats({
  startDate: '2026-05-01',
  endDate: '2026-05-31',
  type: 'all'
});
```

## 🔄 Integración en index.js

```javascript
import boxmineService from './lib/services/boxmineService.js';

// En el evento de mensajes recibidos
socket.ev.on('messages.upsert', async (m) => {
  const message = m.messages[0];
  
  // Sincronizar mensaje con Boxmine
  if (process.env.ENABLE_BOXMINE_SYNC === 'true') {
    await boxmineService.syncMessage(message);
  }
});

// Cuando se inicia el bot
await boxmineService.initialize();
```

## 🧪 Probar la Integración

```bash
# Instalar dependencias si es necesario
npm install axios

# Ejecutar el bot
npm start
```

## 🐛 Troubleshooting

### Error: "Boxmine: No API Key o Token configurados"
**Solución:** Verifica que `BOXMINE_API_KEY` y `BOXMINE_TOKEN` estén en `.env`

### Error: "Cannot connect to Boxmine"
**Soluciones:**
1. Verifica `BOXMINE_URL` en `.env`
2. Comprueba tu conexión a internet
3. Verifica que Boxmine esté operacional

## 📞 Soporte

- **Boxmine Docs:** https://docs.boxmine.io
- **Issues:** https://github.com/orlandowp2412/WhatsApp-bot/issues
- **Email:** support@boxmine.io

---

**Última actualización:** Mayo 2026
**Versión:** 1.0.0