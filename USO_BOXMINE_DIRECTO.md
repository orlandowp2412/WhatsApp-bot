# 🔗 USAR BOXMINE DIRECTAMENTE (SIN BOT LOCAL)

## 📋 ¿Qué es esto?

Si no quieres usar Termux o ejecutar el bot localmente, puedes:
- ✅ Usar Boxmine como tu panel principal
- ✅ Conectar el repositorio a Boxmine
- ✅ Gestionar todo desde la web de Boxmine
- ✅ Sin instalar nada en tu Android

---

## 1️⃣ CREAR CUENTA EN BOXMINE

### Ir a Boxmine

```
https://app.boxmine.io
```

### Registro

1. Haz clic en **"Sign Up"**
2. Completa:
   - **Email**: tu_email@gmail.com
   - **Contraseña**: contraseña123
   - **Nombre**: Tu nombre
3. Verifica tu correo
4. ¡Ya tienes cuenta!

---

## 2️⃣ OBTENER CREDENCIALES DE BOXMINE

### Ir a Settings

```
https://app.boxmine.io/settings
```

### Buscar "API" o "Integrations"

**Copia estos valores:**
- `API_KEY`: Algo como `sk_live_xxxxxx...`
- `API_SECRET`: Algo como `sk_secret_xxxxxx...`
- `TOKEN`: Algo como `box_token_xxxxx...`

**Guarda estos valores en un lugar seguro**

---

## 3️⃣ CONECTAR TU REPOSITORIO GITHUB

### En Boxmine, ir a:

```
https://app.boxmine.io/integrations
```

### Buscar "GitHub" o "Git Integration"

1. Haz clic en **"Connect GitHub"**
2. Autoriza a Boxmine
3. Selecciona el repositorio:
   ```
   orlandowp2412/WhatsApp-bot
   ```
4. Elige la rama:
   ```
   feat/boxmine-integration
   ```
5. Haz clic en **"Connect"**

---

## 4️⃣ CONFIGURAR WEBHOOKS

### En Boxmine:

```
Settings → Webhooks
```

1. Clic en **"Add Webhook"**
2. Configura:

```
URL: https://tu-dominio.com/api/webhooks/boxmine
Events: user.created, message.received, campaign.completed
Active: ✅
```

**Si no tienes dominio aún, usa ngrok (más adelante)**

---

## 5️⃣ SINCRONIZAR DATOS

### Opción A: Sincronización Manual

En Boxmine:

```
Settings → Data → Import/Export
```

1. Haz clic en **"Import from GitHub"**
2. Selecciona:
   - Rama: `feat/boxmine-integration`
   - Archivos de datos
3. Haz clic en **"Sync"**

### Opción B: Sincronización Automática

```
Settings → Integrations → Auto Sync
```

1. Activa **"Auto Sync"**
2. Configura frecuencia:
   - `Cada hora`
   - `Cada día`
   - `Cada 30 minutos`
3. Guarda

---

## 6️⃣ USAR EL PANEL DE BOXMINE

### Acceder desde cualquier dispositivo

```
https://app.boxmine.io/dashboard
```

### Funcionalidades disponibles

- ✅ **Usuarios**: Ver, crear, editar usuarios
- ✅ **Mensajes**: Histórico de mensajes sincronizados
- ✅ **Campañas**: Crear y gestionar campañas
- ✅ **Estadísticas**: Gráficos y análisis en tiempo real
- ✅ **Webhooks**: Monitorear eventos
- ✅ **API**: Documentación completa

---

## 7️⃣ USAR LA API DE BOXMINE

### Obtener Token de Acceso

En Boxmine:

```
Settings → API → Generate Token
```

Copia el token.

### Ejemplos de uso

#### Crear Usuario

```bash
curl -X POST https://api.boxmine.io/users \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "phone": "+573001234567",
    "email": "juan@example.com"
  }'
```

#### Obtener Usuarios

```bash
curl -H "Authorization: Bearer TU_TOKEN" \
     https://api.boxmine.io/users?limit=50
```

#### Crear Campaña

```bash
curl -X POST https://api.boxmine.io/campaigns \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campaña Mayo",
    "message": "¡Descuento 50%!",
    "targetUsers": ["user_1", "user_2"]
  }'
```

---

## 🌐 DESPLEGAR EL SERVIDOR EN LA NUBE

Si quieres que el servidor esté siempre activo:

### Opción 1: Railway (Recomendado)

1. Ve a: https://railway.app
2. Conecta tu GitHub
3. Crea proyecto
4. Conecta repositorio: `orlandowp2412/WhatsApp-bot`
5. Selecciona rama: `feat/boxmine-integration`
6. Railway hace deploy automático
7. Obtienes URL: `https://tu-app.railway.app`

### Opción 2: Heroku

```bash
# Login
heroku login

# Crear app
heroku create tu-boxmine-app

# Conectar repositorio
git remote add heroku https://git.heroku.com/tu-boxmine-app.git

# Deploy
git push heroku feat/boxmine-integration:main

# Ver URL
heroku open
```

### Opción 3: Vercel

1. Ve a: https://vercel.com
2. Conecta GitHub
3. Importa repositorio
4. Deploy automático
5. Obtienes URL pública

---

## 📱 ACCEDER DESDE ANDROID

### Sin instalar nada

Simplemente abre en tu navegador (Chrome, Firefox, etc.):

```
https://app.boxmine.io

- Inicia sesión con tu email y contraseña
- Accede a tu dashboard
- Gestiona todo desde el móvil
```

### Crear App Nativa (Opcional)

Boxmine ofrece:
- **App iOS**: Descarga desde App Store
- **App Android**: Descarga desde Google Play

---

## 🔐 SEGURIDAD

### Proteger tu API Key

```bash
# NUNCA compartas tu API Key públicamente
# Usa variables de entorno en tu servidor

# En Railway/Heroku:
# Settings → Environment Variables
BOXMINE_API_KEY=tu_key_secreto
BOXMINE_TOKEN=tu_token_secreto
```

### Regenerar Tokens

En Boxmine:

```
Settings → API → Regenerate Token
```

---

## 📊 FUNCIONALIDADES DISPONIBLES EN BOXMINE

| Característica | Descripción |
|---|---|
| 👥 **Usuarios** | Gestionar contactos y datos |
| 📨 **Mensajes** | Historial y sincronización |
| 📧 **Campañas** | Crear y ejecutar campañas masivas |
| 📊 **Estadísticas** | Gráficos y análisis |
| 🔌 **API** | Acceso programático |
| 🔗 **Webhooks** | Notificaciones en tiempo real |
| 🔐 **Seguridad** | Autenticación y encriptación |
| 📱 **Mobile** | Aplicación nativa |
| 🌐 **Web** | Panel completo en navegador |
| ⚙️ **Integraciones** | GitHub, Slack, Zapier, etc. |

---

## 💡 CASOS DE USO

### Caso 1: Gestor de Contactos

```
1. Importa contactos a Boxmine
2. Sincroniza con tu repositorio
3. Gestiona desde el panel
4. Exporta datos en cualquier momento
```

### Caso 2: Plataforma de Campañas

```
1. Crea campaña en Boxmine
2. Selecciona usuarios objetivo
3. Programa fecha/hora
4. Monitorea resultados en tiempo real
```

### Caso 3: Sistema de Notificaciones

```
1. Configura webhooks
2. Recibe eventos en tu servidor
3. Procesa automáticamente
4. Guarda en Boxmine
```

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Crear cuenta en Boxmine
2. ✅ Obtener credenciales API
3. ✅ Conectar GitHub
4. ✅ Sincronizar datos
5. ✅ Configurar webhooks
6. ✅ Desplegar servidor (opcional)
7. ✅ Usar panel desde Android
8. ✅ Crear automatizaciones

---

## 📚 RECURSOS

- **Boxmine Docs**: https://docs.boxmine.io
- **GitHub Repo**: https://github.com/orlandowp2412/WhatsApp-bot
- **API Reference**: https://api.boxmine.io/docs
- **Community**: https://community.boxmine.io

---

## 🆘 SOPORTE

### Problemas Comunes

#### "No puedo conectar GitHub"
- ✅ Verifica que tienes permisos en el repo
- ✅ Revoca acceso y vuelve a autorizar
- ✅ Usa una cuenta diferente de GitHub

#### "Los datos no se sincronizan"
- ✅ Verifica que el webhook está activo
- ✅ Revisa los logs de sincronización
- ✅ Regenera el token de acceso

#### "Error en la API"
- ✅ Verifica tu API Key
- ✅ Comprueba los headers HTTP
- ✅ Revisa la documentación de Boxmine

---

## 📞 Contacto

- **Email**: orlandowp2412@gmail.com
- **GitHub**: https://github.com/orlandowp2412
- **Issues**: https://github.com/orlandowp2412/WhatsApp-bot/issues

---

## ✨ VENTAJAS DE USAR SOLO BOXMINE

✅ **Sin instalaciones**: Todo en la nube
✅ **Acceso desde cualquier lado**: Incluido Android
✅ **Sincronización automática**: Datos siempre actualizados
✅ **Interfaz gráfica**: Fácil de usar
✅ **Sin servidor local**: No necesitas Termux
✅ **Escalable**: Maneja miles de usuarios
✅ **Seguro**: Encriptación de datos
✅ **24/7**: Siempre disponible

---

**¡Ya tienes todo para usar Boxmine directamente! 🎉**

No necesitas Termux, no necesitas tu Android. Solo abre el navegador y accede a Boxmine desde cualquier dispositivo.
