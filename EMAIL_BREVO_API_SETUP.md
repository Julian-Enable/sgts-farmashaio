# 📧 Configuración de Brevo API para Emails (Solución para Render Free Tier)

## 🚨 Problema Identificado

**Render Free Tier BLOQUEA puertos SMTP** (25, 465, 587, 2525) para prevenir spam.

❌ **NO funciona**: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER` (SMTP)  
✅ **SÍ funciona**: Brevo API usando HTTPS (puerto 443)

---

## 📋 Pasos para Configurar Brevo API

### 1️⃣ Obtener API Key de Brevo

1. Ir a: https://app.brevo.com/settings/keys/api
2. Iniciar sesión con: **soporte.invfs@gmail.com**
3. Click en **"Create a new API key"**
4. Nombre: `SGTS-FARMASHAIO-PROD`
5. **COPIAR** el API key (se muestra solo 1 vez)
6. Guardar en lugar seguro

**Ejemplo de API key**:
```
xkeysib-1234567890abcdef1234567890abcdef1234567890abcdef1234567890-ABCD1234
```

⚠️ **IMPORTANTE**: Este es un API Key v3, NO es el SMTP key.

---

### 2️⃣ Configurar Variable en Render

1. Ir a: https://dashboard.render.com
2. Seleccionar: `sgts-farmashaio-api`
3. Click en **"Environment"** (menú izquierdo)
4. Buscar la variable: `EMAIL_PASS`
5. Click en **"Edit"**
6. **Pegar el API key** de Brevo (del paso 1)
7. Click en **"Save Changes"**

El servicio se reiniciará automáticamente.

---

### 3️⃣ Verificar Email del Remitente en Brevo

1. Ir a: https://app.brevo.com/settings/senders
2. Verificar que `soporte.invfs@gmail.com` esté en la lista
3. Si no está verificado:
   - Click en **"Add a sender"**
   - Email: `soporte.invfs@gmail.com`
   - Revisar Gmail y confirmar el email de Brevo
   - Esperar aprobación (puede tomar unos minutos)

---

### 4️⃣ Probar el Sistema

1. Ir a: https://farmatickets.vercel.app
2. Iniciar sesión como empleado
3. Crear un nuevo ticket
4. Verificar que lleguen los emails:
   - **Admin**: admin@farmashaio.com
   - **Técnico**: tecnico1@farmashaio.com

---

## 🔍 Verificar Logs en Render

1. Ir a: https://dashboard.render.com
2. Seleccionar: `sgts-farmashaio-api`
3. Click en **"Logs"**
4. Buscar:

**Éxito** ✅:
```
📧 Configurando Brevo API para envío de emails
✅ Brevo API configurada correctamente
📤 Enviando email vía Brevo API a: admin@farmashaio.com
✅ Email enviado exitosamente vía Brevo API
📧 Message ID: <...>
```

**Error** ❌:
```
❌ Error enviando email vía Brevo API: Unauthorized
```
👉 **Solución**: API key inválida, regenerar en paso 1.

---

## 📊 Límites de Brevo Free Tier

- **300 emails/día** (suficiente para sistema de tickets)
- Emails transaccionales ilimitados en plan pagado
- Tracking de emails y estadísticas incluidas

---

## 🔧 Arquitectura de la Solución

### Antes (SMTP - NO FUNCIONA)
```
Backend → Puerto 587 (SMTP) → 🚫 BLOQUEADO por Render → ❌ Error
```

### Ahora (API - FUNCIONA)
```
Backend → Puerto 443 (HTTPS) → ✅ Brevo API → ✅ Email enviado
```

### Implementación
- **Archivo**: `backend/src/utils/emailServiceBrevoAPI.js`
- **Paquete**: `@getbrevo/brevo` (SDK oficial)
- **Método**: `TransactionalEmailsApi.sendTransacEmail()`
- **Autenticación**: API key en header (no SMTP)

---

## 📧 Tipos de Emails Implementados

### 1. Nuevo Ticket Creado
- **Destinatarios**: Todos los admins y técnicos
- **Trigger**: Usuario crea ticket
- **Contenido**: Número, título, categoría, prioridad, descripción

### 2. Ticket Asignado
- **Destinatarios**: Técnico asignado + Solicitante
- **Trigger**: Admin/técnico asigna ticket
- **Contenido**: Datos del ticket, técnico asignado, fecha límite

### 3. Cambio de Estado
- **Destinatarios**: Solicitante + Técnico asignado
- **Trigger**: Cualquier cambio de estado
- **Contenido**: Estado nuevo, quién lo cambió, ticket

### 4. Nuevo Comentario
- **Destinatarios**: Solicitante + Técnico (excepto autor)
- **Trigger**: Usuario agrega comentario
- **Contenido**: Comentario, autor, ticket

---

## ⚡ Variables de Entorno Requeridas

En **Render Dashboard** → `sgts-farmashaio-api` → **Environment**:

```bash
EMAIL_SERVICE=Brevo
EMAIL_PASS=xkeysib-1234...ABCD1234  # ← API Key de Brevo
EMAIL_FROM="SGTS FARMASHAIO <soporte.invfs@gmail.com>"
```

⚠️ **ELIMINAR** (ya no se usan):
- ❌ `EMAIL_HOST` (era para SMTP)
- ❌ `EMAIL_PORT` (era para SMTP)
- ❌ `EMAIL_USER` (era para SMTP)

---

## 🐛 Troubleshooting

### Error: "Unauthorized"
**Causa**: API key inválida o expirada  
**Solución**: Regenerar API key en Brevo y actualizar en Render

### Error: "Sender not verified"
**Causa**: Email `soporte.invfs@gmail.com` no verificado  
**Solución**: Verificar sender en https://app.brevo.com/settings/senders

### Error: "Daily quota exceeded"
**Causa**: Se enviaron más de 300 emails en 24h  
**Solución**: Esperar o upgradear plan de Brevo

### No llegan emails
1. Revisar logs de Render (buscar "Email enviado exitosamente")
2. Verificar bandeja de spam
3. Revisar estadísticas en: https://app.brevo.com/logs

---

## 📚 Recursos

- **Brevo Dashboard**: https://app.brevo.com
- **API Documentation**: https://developers.brevo.com/docs
- **SDK GitHub**: https://github.com/getbrevo/brevo-node
- **Render Logs**: https://dashboard.render.com → Logs

---

## ✅ Checklist de Configuración

- [ ] Obtener API key de Brevo
- [ ] Configurar `EMAIL_PASS` en Render
- [ ] Verificar sender `soporte.invfs@gmail.com`
- [ ] Eliminar variables SMTP antiguas
- [ ] Reiniciar servicio en Render
- [ ] Crear ticket de prueba
- [ ] Verificar recepción de emails
- [ ] Revisar logs de Render

---

**Última actualización**: 2024  
**Estado**: ✅ Implementado y listo para producción
