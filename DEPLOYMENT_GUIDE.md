# 🚀 GUÍA DE DEPLOYMENT - SGTS FARMASHAIO
## Paso a Paso para Deploy en Producción (100% Gratis)

**Tiempo Estimado Total**: 50 minutos  
**Costo**: $0/mes  
**Dificultad**: ⭐⭐⭐ Intermedia

---

## 📋 PREREQUISITOS

Antes de empezar, asegúrate de tener:
- ✅ Cuenta de GitHub (ya tienes)
- ✅ Repositorio subido a GitHub (ya está)
- ✅ Email activo para verificación
- ✅ Navegador web moderno

---

## 🗄️ PASO 1: BASE DE DATOS EN RENDER (10 minutos)

### 1.1 Crear Cuenta en Render

1. Ve a https://render.com
2. Click en **"Get Started"**
3. Registra con:
   - GitHub (recomendado) ← Usa esta opción
   - Google
   - Email

### 1.2 Crear PostgreSQL Database

1. En el Dashboard de Render, click **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configura:
   ```
   Name: sgts-farmashaio-db
   Database: sgts_farmashaio
   User: sgts_user
   Region: Oregon (US West) - [o la más cercana]
   PostgreSQL Version: 15
   Plan: Free
   ```
4. Click **"Create Database"**
5. ⏳ Espera 2-3 minutos mientras se crea

### 1.3 Obtener Credenciales de la Base de Datos

1. Una vez creada, verás la página de información
2. Copia y guarda estos datos (los necesitarás):
   ```
   -Internal Database URL: postgresql://...
   postgresql://sgts_user:OtfEGRj0XljH4C7HTvItnKUHwL3742iQ@dpg-d3n8dpi4d50c73f43kr0-a/sgts_farmashaio_u3b7
   -External Database URL: postgresql://...
   postgresql://sgts_user:OtfEGRj0XljH4C7HTvItnKUHwL3742iQ@dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com/sgts_farmashaio_u3b7
   -PSQL Command: PGPASSWORD=...
   PGPASSWORD=OtfEGRj0XljH4C7HTvItnKUHwL3742iQ psql -h dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com -U sgts_user sgts_farmashaio_u3b7
   ```

### 1.4 Ejecutar Schema de Producción

**Método: Desde tu Terminal Local con PSQL Command**

1. En tu dashboard de Render, **copia el PSQL Command** que aparece en la sección "Connections"
   - Se ve así: `PGPASSWORD=OtfEGRj0XljH4C7HTvItnKUHwL3742iQ psql -h dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com -U sgts_user sgts_farmashaio_u3b7`

2. Abre una terminal en tu proyecto local (PowerShell)

3. Navega a la carpeta del proyecto:
   ```powershell
   cd C:\Users\Desktop\Desktop\sgtsFarmashaio
   ```

4. Ejecuta el comando para cargar el schema (reemplaza con TU comando):
   ```powershell
   # Copia tu PSQL Command de Render y agrégale al final: < database/production_schema.sql
   PGPASSWORD=TU_PASSWORD psql -h dpg-XXXXX-a.oregon-postgres.render.com -U sgts_user sgts_farmashaio_u3b7 < database/production_schema.sql
   ```

5. ⏳ Espera 5-10 segundos mientras se ejecuta

6. ✅ Si todo va bien, verás mensajes como:
   ```
   CREATE EXTENSION
   CREATE TABLE
   INSERT 0 3
   ...
   Database Initialized
   ```

**⚠️ Si no tienes PostgreSQL instalado localmente:**

```powershell
# Instalar PostgreSQL client en Windows
winget install PostgreSQL.PostgreSQL
```

**Alternativa sin instalar PostgreSQL:**
Usa una herramienta online como **pgAdmin** o **DBeaver** y conecta con las credenciales de Render.

### 1.5 Verificar Datos Iniciales

**Si ejecutaste el schema y viste "Exit Code: 0" ✅ YA ESTÁ LISTO**

Para verificar visualmente que todo se creó correctamente:

**Opción A: Desde Render Dashboard**
1. Ve a tu database en Render → Pestaña **"Connections"**
2. Bajo "**Connect via**", encontrarás links para herramientas como:
   - **pgAdmin** (recomendado para GUI)
   - **psql** (línea de comandos)
   - **DBeaver** (alternativa GUI)

**Opción B: Instalar herramienta GUI (Recomendado)**
1. Descarga **DBeaver** gratis: https://dbeaver.io/download/
2. Conecta con estas credenciales:
   ```
   Host: dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com
   Port: 5432
   Database: sgts_farmashaio_u3b7
   Username: sgts_user
   Password: OtfEGRj0XljH4C7HTvItnKUHwL3742iQ
   ```
3. Ejecuta estas queries para verificar:
   ```sql
   -- Ver usuarios creados (deberías ver 3)
   SELECT username, email, role FROM users;
   
   -- Ver categorías (deberías ver 6)
   SELECT name, color FROM categories;
   
   -- Ver prioridades (deberías ver 5)
   SELECT name, level, color FROM priorities;
   
   -- Ver estados (deberías ver 5)
   SELECT name, color, order_index FROM ticket_statuses ORDER BY order_index;
   ```

✅ **Checkpoint**: Deberías ver 3 usuarios, 6 categorías, 5 prioridades, 5 estados

**⚠️ Si el comando dio Exit Code: 0, todo está bien.** La verificación visual es opcional.

---

## 🔧 PASO 2: BACKEND API EN RENDER (15 minutos)

### 2.1 Crear Web Service

1. En Render Dashboard, click **"New +"**
2. Selecciona **"Web Service"**
3. Click **"Connect a repository"** (primera vez)
4. Autoriza a Render a acceder a tu GitHub
5. Busca y selecciona: **`Julian-Enable/sgts-farmashaio`**
6. Click **"Connect"**

### 2.2 Configurar el Servicio

```
Name: sgts-farmashaio-api
Region: Oregon (US West) - [misma que la DB]
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 2.3 Configurar Variables de Entorno

Click en **"Advanced"** → **"Add Environment Variable"**

Agrega estas variables (una por una):

```bash
# Node Environment
NODE_ENV=production

# Database (Copia el Internal Database URL de tu DB)
DATABASE_URL=postgresql://sgts_user:tu_password@dpg-xxxxx-a.oregon-postgres.render.com/sgts_farmashaio

# JWT Secret (Genera uno random de 32+ caracteres)
JWT_SECRET=tu_super_secreto_jwt_de_al_menos_32_caracteres_aqui_12345678

# CORS (Agregar luego de desplegar frontend)
CORS_ORIGINS=http://localhost:5173

# Puerto (Render lo configura automático)
PORT=10000

# Email (Opcional - Configurar después si quieres notificaciones)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
EMAIL_FROM=SGTS FARMASHAIO <noreply@farmashaio.com>
```

**💡 Tip para JWT_SECRET**: Usa este generador
```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. ⏳ Espera 5-7 minutos mientras Render:
   - Clona el repositorio
   - Instala dependencias
   - Inicia el servidor
3. Verás los logs en tiempo real

### 2.5 Verificar Backend

1. Copia la URL de tu servicio (ejemplo: `https://sgts-farmashaio-api.onrender.com`)
2. Abre en tu navegador: `https://sgts-farmashaio-api.onrender.com/health`
3. ✅ Deberías ver:
   ```json
   {
     "status": "OK",
     "message": "SGTS FARMASHAIO API está funcionando correctamente",
     "timestamp": "2025-10-14T..."
   }
   ```

**⚠️ Importante**: Guarda esta URL, la necesitarás para el frontend

### 2.6 Solución de Problemas Backend

Si el deploy falla, revisa los logs:

**Error: "Cannot find module"**
- Solución: Verifica que `Root Directory` sea `backend`

**Error: "Database connection failed"**
- Solución: Verifica el `DATABASE_URL` en variables de entorno

**Error: "Port already in use"**
- Solución: Render maneja el puerto automáticamente, usa `process.env.PORT`

---

## ⚡ PASO 3: FRONTEND EN VERCEL (10 minutos)

### 3.1 Crear Cuenta en Vercel

1. Ve a https://vercel.com
2. Click **"Sign Up"**
3. Selecciona **"Continue with GitHub"** ← Recomendado
4. Autoriza a Vercel

### 3.2 Importar Proyecto

1. En el Dashboard de Vercel, click **"Add New..."** → **"Project"**
2. Busca tu repositorio: **`sgts-farmashaio`**
3. Click **"Import"**

### 3.3 Configurar Proyecto

```
Project Name: sgts-farmashaio
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Configurar Variables de Entorno

Click en **"Environment Variables"**

Agrega estas variables:

```bash
# API URL (La URL del backend que guardaste en Paso 2.5)
VITE_API_URL=https://sgts-farmashaio-api.onrender.com

# App Info
VITE_APP_NAME=SGTS FARMASHAIO
VITE_APP_VERSION=1.0.0
```

**⚠️ CRÍTICO**: Reemplaza `sgts-farmashaio-api.onrender.com` con TU URL real del backend

### 3.5 Deploy

1. Click **"Deploy"**
2. ⏳ Espera 2-3 minutos mientras Vercel:
   - Clona el repositorio
   - Instala dependencias
   - Construye el proyecto
   - Despliega en CDN global
3. Verás el progreso en tiempo real

### 3.6 Verificar Frontend

1. Cuando termine, verás: **"Congratulations!"**
2. Click en **"Visit"** o copia la URL (ejemplo: `https://sgts-farmashaio.vercel.app`)
3. ✅ Deberías ver la página de login
4. Intenta iniciar sesión con:
   ```
   Email: admin@farmashaio.com
   Password: admin123
   ```

### 3.7 Solución de Problemas Frontend

**Error: "Failed to fetch" en login**
- Problema: CORS no configurado
- Solución: Ve al Paso 4

**Página en blanco**
- Problema: Root Directory incorrecto
- Solución: Verifica que sea `frontend`, no la raíz

**Error de build**
- Problema: Variables de entorno faltantes
- Solución: Verifica que VITE_API_URL esté configurada

---

## 🔗 PASO 4: CONFIGURAR CORS (5 minutos)

### 4.1 Actualizar Variable de Entorno en Render

1. Ve a Render Dashboard → Tu Web Service (`sgts-farmashaio-api`)
2. Ve a **"Environment"**
3. Edita la variable **`CORS_ORIGINS`**:
   ```
   CORS_ORIGINS=https://sgts-farmashaio.vercel.app,https://sgts-farmashaio-git-main-julian-enable.vercel.app,https://*.vercel.app
   ```
4. Click **"Save Changes"**
5. El servicio se redesplegará automáticamente (1-2 minutos)

### 4.2 Verificar CORS

1. Abre tu frontend: `https://sgts-farmashaio.vercel.app`
2. Abre DevTools (F12) → Console
3. Intenta hacer login
4. ✅ No deberías ver errores de CORS

---

## ✅ PASO 5: TESTING Y VERIFICACIÓN (10 minutos)

### 5.1 Test de Usuarios

Prueba iniciar sesión con cada rol:

**👑 Administrador**
```
Email: admin@farmashaio.com
Password: admin123
```
- ✅ Debería ver Dashboard completo
- ✅ Ver todos los tickets
- ✅ Gestionar usuarios
- ✅ Estadísticas globales

**🔧 Técnico**
```
Email: tecnico1@farmashaio.com
Password: tecnico123
```
- ✅ Debería ver Dashboard de técnico
- ✅ Ver tickets asignados
- ✅ Cambiar estado de tickets
- ✅ Agregar comentarios

**👤 Empleado**
```
Email: empleado1@farmashaio.com
Password: empleado123
```
- ✅ Debería ver Dashboard básico
- ✅ Crear nuevos tickets
- ✅ Ver sus propios tickets
- ✅ Agregar comentarios

### 5.2 Test de Funcionalidades Clave

**Como Empleado:**
1. ✅ Crear un ticket nuevo
   - Título: "Test de funcionamiento"
   - Categoría: Hardware
   - Prioridad: Media
   - Descripción: "Probando el sistema"
2. ✅ Ver el ticket creado en la lista
3. ✅ Agregar un comentario al ticket

**Como Administrador:**
1. ✅ Ver el ticket recién creado
2. ✅ Asignarlo al técnico
3. ✅ Ver historial de cambios

**Como Técnico:**
1. ✅ Ver ticket asignado
2. ✅ Cambiar estado a "En Progreso"
3. ✅ Agregar comentario
4. ✅ Cambiar estado a "Resuelto"

### 5.3 Test de Performance

1. ✅ Tiempo de carga < 3 segundos
2. ✅ Login responde < 1 segundo
3. ✅ Crear ticket < 2 segundos
4. ✅ Lista de tickets carga < 2 segundos

### 5.4 Test de Responsive

1. ✅ Prueba en móvil (Chrome DevTools)
2. ✅ Prueba en tablet
3. ✅ Prueba en desktop

---

## 🎯 CHECKLIST FINAL

### Base de Datos
- [ ] PostgreSQL creada en Render
- [ ] Schema ejecutado correctamente
- [ ] 3 usuarios iniciales verificados
- [ ] Categorías, prioridades y estados verificados

### Backend
- [ ] Web Service desplegado en Render
- [ ] Health check responde OK
- [ ] Variables de entorno configuradas
- [ ] CORS configurado para Vercel

### Frontend
- [ ] Proyecto desplegado en Vercel
- [ ] Página de login carga correctamente
- [ ] Login funciona con usuarios de prueba
- [ ] Dashboard muestra datos correctos

### Funcionalidades
- [ ] Crear ticket funciona
- [ ] Asignar ticket funciona
- [ ] Comentarios funcionan
- [ ] Notificaciones funcionan
- [ ] Cambio de estado funciona
- [ ] Historial se registra

---

## 🔄 AUTO-DEPLOY CONFIGURADO

### GitHub → Render
✅ Cada push a `main` redespliega automáticamente el backend

### GitHub → Vercel
✅ Cada push a `main` redespliega automáticamente el frontend

**Para hacer cambios:**
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

---

## 📊 MONITOREO POST-DEPLOYMENT

### URLs Importantes

Guarda estas URLs:

```
🌐 Frontend: https://sgts-farmashaio.vercel.app
🔧 Backend API: https://sgts-farmashaio-api.onrender.com
🗄️ Base de Datos: dpg-xxxxx-a.oregon-postgres.render.com

📊 Dashboards:
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
```

### Métricas a Monitorear

**Render (Backend):**
- CPU Usage (debe estar < 50% en free tier)
- Memory Usage (debe estar < 400 MB)
- Response Time (debe ser < 500ms promedio)
- Error Rate (debe ser < 1%)

**Vercel (Frontend):**
- Build Time (debería ser < 2 minutos)
- Deployment Status (debería ser successful)
- Bandwidth (ilimitado en free tier)

### Logs

**Backend Logs (Render):**
```bash
# En Render Dashboard → Web Service → Logs
# Verás logs en tiempo real
```

**Frontend Errors (Vercel):**
```bash
# En Vercel Dashboard → Project → Deployments → View Function Logs
```

---

## ⚠️ LIMITACIONES DEL FREE TIER

### Render (Backend + Database)

**Web Service:**
- ⏱️ Se duerme después de 15 minutos de inactividad
- ⏰ Primera petición después de dormir tarda ~30 segundos
- 🔄 750 horas/mes gratis (suficiente para 1 instancia 24/7)

**PostgreSQL:**
- 💾 1 GB de almacenamiento
- 📊 ~1000 tickets almacenables
- 🗑️ Se borra después de 90 días de inactividad

### Vercel (Frontend)

**Sin limitaciones significativas:**
- ✅ Bandwidth ilimitado
- ✅ 100 GB hosting
- ✅ Deploy automático
- ✅ CDN global

---

## 🚀 PRÓXIMOS PASOS

### Mejoras Recomendadas

**Semana 1:**
1. [ ] Configurar notificaciones por email
2. [ ] Agregar más usuarios de prueba
3. [ ] Personalizar tema de colores

**Semana 2:**
4. [ ] Implementar tests unitarios
5. [ ] Configurar CI/CD con GitHub Actions
6. [ ] Mejorar logs y monitoreo

**Semana 3:**
7. [ ] Agregar reportes y analytics
8. [ ] Optimizar queries de base de datos
9. [ ] Implementar caché con Redis

**Mes 2:**
10. [ ] WebSockets para notificaciones en tiempo real
11. [ ] Dashboard de métricas avanzado
12. [ ] Exportar reportes en PDF/Excel

### Upgrade a Paid Plans (Opcional)

**Cuando considerar upgrade:**
- > 100 tickets/mes
- > 10 usuarios activos
- Necesitas uptime 99.9%
- Necesitas > 1 GB database
- Quieres eliminar el cold start

**Costos de Paid Plans:**
- Render Database: $7/mes (mejor DB, sin cold start)
- Render Web Service: $7/mes (siempre activo)
- Vercel Pro: $20/mes (más features, no necesario para este proyecto)

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial

- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- PostgreSQL: https://www.postgresql.org/docs/

### Comunidad

- GitHub Issues: https://github.com/Julian-Enable/sgts-farmashaio/issues
- Stack Overflow: Busca "render postgres" o "vercel vite"

### Contacto del Proyecto

- Repository: https://github.com/Julian-Enable/sgts-farmashaio
- Issues: https://github.com/Julian-Enable/sgts-farmashaio/issues

---

## 🎉 ¡FELICITACIONES!

¡Has desplegado exitosamente SGTS FARMASHAIO en producción!

Tu sistema está ahora:
- ✅ Accesible globalmente
- ✅ Con SSL/HTTPS automático
- ✅ Con deploy automático
- ✅ 100% gratuito
- ✅ Listo para uso real

**Comparte tu proyecto:**
- URL: https://sgts-farmashaio.vercel.app
- GitHub: https://github.com/Julian-Enable/sgts-farmashaio
- LinkedIn, Twitter, Portfolio, etc.

---

**Última actualización**: 14 de Octubre de 2025  
**Versión de la guía**: 1.0  
**Tiempo total invertido en deployment**: ~50 minutos
