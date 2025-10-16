# 📧 Configuración de Notificaciones por Email

## Sistema Implementado

El sistema ya tiene **notificaciones automáticas por email** completamente implementadas. Solo necesitas configurar las credenciales.

### 🎯 Notificaciones Configuradas

#### 1. **Cuando se crea un ticket**
- ✅ **Destinatarios**: Todos los administradores y técnicos
- 📧 **Contenido**: 
  - Número de ticket
  - Título y descripción
  - Categoría y prioridad
  - Datos del solicitante

#### 2. **Cuando se asigna un ticket**
- ✅ **Destinatarios**: 
  - Técnico asignado (email principal)
  - Solicitante (notificación de asignación)
- 📧 **Contenido**:
  - Detalles del ticket
  - Prioridad destacada
  - Fecha límite (si existe)
  - Quién asignó el ticket

#### 3. **Cuando cambia el estado de un ticket**
- ✅ **Destinatarios**:
  - Solicitante del ticket
  - Técnico asignado (si aplica)
- 📧 **Contenido**:
  - Nuevo estado con color
  - Quién realizó el cambio
  - Mensaje especial si está "Resuelto"

#### 4. **Cuando se agrega un comentario**
- ✅ **Destinatarios**:
  - Solicitante
  - Técnico asignado
  - (Excepto el autor del comentario)
- 📧 **Contenido**:
  - Comentario completo
  - Autor y rol
  - Enlace contextual

---

## 🆓 Opciones de Servicio Gratuito

### Opción 1: Gmail (Recomendado) ⭐

**Límites gratuitos**: 500 emails/día  
**Pros**: Fácil configuración, confiable  
**Contras**: Requiere "Contraseña de aplicación"

#### Pasos para configurar Gmail:

1. **Crear o usar cuenta Gmail**
   - Usar una cuenta específica como `soporte@tuempresa.com`
   - O crear una nueva: `farmashaio.tickets@gmail.com`

2. **Habilitar verificación en 2 pasos**
   - Ir a: https://myaccount.google.com/security
   - Activar "Verificación en 2 pasos"

3. **Generar contraseña de aplicación**
   - Ir a: https://myaccount.google.com/apppasswords
   - Nombre: "SGTS FARMASHAIO"
   - Copiar la contraseña de 16 caracteres
   ljgr cxdv wgkx pvfn

4. **Configurar variables de entorno en Render**:
   ```bash
   EMAIL_SERVICE=gmail
   EMAIL_USER=tuempresa@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # Contraseña de aplicación
   EMAIL_FROM="SGTS FARMASHAIO" <tuempresa@gmail.com>
   ```

---

### Opción 2: Brevo (Sendinblue)

**Límites gratuitos**: 300 emails/día  
**Pros**: Dashboard profesional, estadísticas  
**Contras**: Requiere registro

#### Pasos para configurar Brevo:

1. **Crear cuenta**
   - Ir a: https://www.brevo.com/
   - Registrarse con email corporativo

2. **Obtener credenciales SMTP**
   - Dashboard → Settings → SMTP & API
   - Copiar:
     - SMTP Server: `smtp-relay.brevo.com`
     - Port: `587`
     - Login: tu email
     - SMTP Key: generar nueva

3. **Configurar variables de entorno en Render**:
   ```bash
   EMAIL_SERVICE=Brevo
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=tu-email@empresa.com
   EMAIL_PASS=tu-smtp-key-aqui
   EMAIL_FROM="SGTS FARMASHAIO" <noreply@farmashaio.com>
   ```

---

### Opción 3: Resend (Moderna)

**Límites gratuitos**: 100 emails/día  
**Pros**: Muy fácil, moderna, API simple  
**Contras**: Menos emails gratuitos

#### Pasos para configurar Resend:

1. **Crear cuenta**
   - Ir a: https://resend.com/
   - Registrarse gratis

2. **Obtener API Key**
   - Dashboard → API Keys
   - Create API Key
   - Copiar key

3. **Agregar paquete** (si usas Resend):
   ```bash
   npm install resend
   ```

4. **Configurar variables de entorno**:
   ```bash
   EMAIL_SERVICE=resend
   EMAIL_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM="SGTS FARMASHAIO" <onboarding@resend.dev>
   ```

---

## ⚙️ Configuración en Render

### 1. Ir al dashboard de Render
   - https://dashboard.render.com/
   - Seleccionar tu Web Service: `sgts-farmashaio-api`

### 2. Ir a Environment Variables
   - Click en "Environment" en el menú lateral
   - O ir directo: Settings → Environment

### 3. Agregar variables de email
   ```bash
   EMAIL_SERVICE=gmail
   EMAIL_USER=farmashaio.tickets@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   EMAIL_FROM="SGTS FARMASHAIO" <farmashaio.tickets@gmail.com>
   ```

### 4. Hacer "Manual Deploy"
   - Ir a: Manual Deploy → Deploy latest commit
   - O simplemente hacer push al repo (auto-deploy)

---

## 🧪 Probar el Sistema

### 1. Verificar logs de Render
```bash
# Buscar este mensaje en los logs:
✅ Servidor de email configurado correctamente
```

Si ves:
```bash
🔧 Email no configurado, saltando envío
```
→ Las variables de entorno no están configuradas correctamente.

### 2. Crear un ticket de prueba
1. Iniciar sesión como empleado
2. Crear nuevo ticket
3. Verificar que llegue email a admins/técnicos

### 3. Asignar ticket a técnico
1. Como admin, asignar ticket
2. Verificar emails:
   - ✅ Técnico recibe notificación de asignación
   - ✅ Empleado recibe notificación de actualización

### 4. Cambiar estado
1. Como técnico, cambiar estado a "En Progreso"
2. Verificar que empleado reciba email

### 5. Agregar comentario
1. Agregar comentario al ticket
2. Verificar que las partes involucradas reciban email

---

## 🎨 Diseño de Emails

Los emails tienen diseño profesional con:
- ✅ Colores corporativos (azul FARMASHAIO)
- ✅ Formato responsive
- ✅ Información estructurada
- ✅ Resaltado de prioridades con colores
- ✅ Secciones diferenciadas
- ✅ Footer informativo

### Ejemplo visual:

```
┌─────────────────────────────────────────┐
│  📧 Nuevo Ticket de Soporte Creado      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Detalles del Ticket               │ │
│  │                                   │ │
│  │ Número: TKT-2025-000123          │ │
│  │ Título: Computadora no enciende  │ │
│  │ Categoría: Hardware              │ │
│  │ Prioridad: Alta 🔴               │ │
│  │ Estado: Nuevo                    │ │
│  │                                   │ │
│  │ Solicitante: María García        │ │
│  │ Departamento: Farmacia           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ⚠️ Descripción:                   │ │
│  │                                   │ │
│  │ Al llegar esta mañana, la        │ │
│  │ computadora de la caja 3 no      │ │
│  │ enciende...                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Sistema de Gestión de Tickets FARMASHAIO │
└─────────────────────────────────────────┘
```

---

## 🔒 Seguridad

### Variables de entorno seguras:
- ✅ Nunca commitear credenciales en Git
- ✅ Usar variables de entorno de Render
- ✅ Contraseñas de aplicación (no contraseña principal)
- ✅ SMTP con TLS/SSL

### Validaciones implementadas:
- ✅ Verificación de configuración al inicio
- ✅ Manejo de errores (no crashea si falla email)
- ✅ Logs detallados para debugging
- ✅ Emails solo a usuarios activos
- ✅ No spam al autor del comentario

---

## 📊 Monitoreo

### Ver logs de emails enviados:

En Render logs, buscar:
```bash
📧 Email enviado: <message-id>
✅ Email de nuevo ticket enviado
✅ Email de asignación enviado
⚠️ Error enviando email: ...
```

### Estadísticas en Gmail:
- Ver en "Enviados" de la cuenta configurada
- Verificar tasa de entrega

### Estadísticas en Brevo:
- Dashboard → Statistics
- Ver emails enviados, abiertos, clics

---

## ❓ Troubleshooting

### "🔧 Email no configurado, saltando envío"
**Solución**: 
- Verificar que `EMAIL_USER` y `EMAIL_PASS` estén en Render
- Hacer redeploy después de agregar variables

### "❌ Error en configuración de email: Invalid login"
**Solución**:
- Gmail: Verificar que contraseña de aplicación sea correcta
- Verificar que verificación en 2 pasos esté activa
- Regenerar contraseña de aplicación

### "❌ Error enviando email: Connection timeout"
**Solución**:
- Verificar `EMAIL_SERVICE` (debe ser: `gmail`, `Brevo`, etc.)
- Verificar conexión de red de Render

### Los emails no llegan
**Solución**:
- Verificar carpeta de SPAM
- Verificar email del usuario esté correcto en BD
- Verificar logs de Render que diga "Email enviado"
- En Gmail, ir a "Enviados" para confirmar

### Emails van a SPAM
**Solución**:
- Usar dominio corporativo verificado
- Configurar SPF/DKIM en Brevo
- Evitar palabras "spam" en asunto

---

## 📝 Recomendación Final

**Para FARMASHAIO, recomiendo usar Gmail** porque:
1. ✅ Es gratuito y confiable
2. ✅ 500 emails/día son suficientes
3. ✅ Configuración en 5 minutos
4. ✅ Ya probado y funcional
5. ✅ No requiere cambios en código

### Quick Start (Gmail):
```bash
1. Crear gmail: farmashaio.tickets@gmail.com
2. Activar verificación 2 pasos
3. Generar contraseña de aplicación
4. Agregar en Render:
   EMAIL_SERVICE=gmail
   EMAIL_USER=farmashaio.tickets@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
5. Deploy → ¡Listo! 🎉
```

---

## 📞 Contacto

Si necesitas ayuda configurando:
- Revisar logs de Render
- Verificar variables de entorno
- Contactar soporte de Render si persiste

---

**¡El sistema de emails ya está listo! Solo falta configurar las credenciales.** 🚀
