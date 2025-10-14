# 🚨 SOLUCIÓN: Error 500 en Login

## 📋 **PROBLEMA ACTUAL:**

```
❌ Error interno del servidor
❌ Failed to load /api/auth/login
❌ Server responded with status 500
```

---

## 🔍 **DIAGNÓSTICO:**

| Componente | Estado | Notas |
|------------|--------|-------|
| ✅ Frontend (Vercel) | OK | Página carga correctamente |
| ✅ Backend Health | OK | `/health` responde 200 |
| ❌ Backend Login | ERROR | `/api/auth/login` da 500 |
| ❓ CORS | Por verificar | Puede estar bloqueando requests |

---

## ✅ **SOLUCIÓN PASO A PASO:**

### **PASO 1: Actualizar CORS en Render (CRÍTICO)**

Este es probablemente el problema principal. El backend no acepta requests del frontend de Vercel.

1. Ve a: **https://dashboard.render.com**

2. Click en tu servicio: **`sgts-farmashaio-api`**

3. Ve a la pestaña: **"Environment"**

4. Busca la variable: **`CORS_ORIGINS`**

5. Edítala y pon el valor completo:
   ```
   CORS_ORIGINS=https://sgts-farmashaio.vercel.app,https://sgts-farmashaio-git-main-julian-enable.vercel.app,https://*.vercel.app,http://localhost:5173
   ```
   
   **⚠️ IMPORTANTE:**
   - Reemplaza `sgts-farmashaio` con TU nombre de proyecto en Vercel
   - Verifica la URL exacta de tu frontend en Vercel

6. Click **"Save Changes"**

7. ⏳ Espera 2-3 minutos mientras Render redespliega el backend

---

### **PASO 2: Verificar Variables de Entorno en Vercel**

1. Ve a: **https://vercel.com**

2. Click en tu proyecto: **`sgts-farmashaio`**

3. Ve a: **Settings** → **Environment Variables**

4. Verifica que existan estas variables:
   ```
   VITE_API_URL=https://sgts-farmashaio-api.onrender.com
   VITE_APP_NAME=SGTS FARMASHAIO
   VITE_APP_VERSION=1.0.0
   ```

5. Si falta `VITE_API_URL` o está mal:
   - Click **"Add New"**
   - Key: `VITE_API_URL`
   - Value: `https://sgts-farmashaio-api.onrender.com`
   - Aplica a: **Production**, **Preview**, **Development**
   - Click **"Save"**

6. Si modificaste algo:
   - Ve a la pestaña **"Deployments"**
   - Click en los 3 puntos del último deployment
   - Click **"Redeploy"**
   - ⏳ Espera 2-3 minutos

---

### **PASO 3: Verificar URL del Frontend en Vercel**

1. En tu proyecto de Vercel, ve a la pestaña principal

2. Copia la URL del frontend (ejemplo):
   ```
   https://sgts-farmashaio.vercel.app
   ```

3. **ANOTA ESTA URL** para usarla en el CORS de Render (Paso 1)

---

### **PASO 4: Verificar Logs del Backend en Render**

1. Ve a: **https://dashboard.render.com**

2. Click en: **`sgts-farmashaio-api`**

3. Ve a la pestaña: **"Logs"**

4. Verifica si hay errores como:
   ```
   ❌ CORS error
   ❌ Database connection failed
   ❌ TypeError: Cannot read property...
   ```

5. Si ves errores de CORS, vuelve al Paso 1

6. Si ves errores de base de datos, verifica `DATABASE_URL` en Environment

---

### **PASO 5: Probar Login Nuevamente**

1. Abre tu frontend en Vercel

2. Presiona **F12** para abrir DevTools

3. Ve a la pestaña **"Network"**

4. Intenta hacer login con:
   ```
   Email: admin@farmashaio.com
   Password: admin123
   ```

5. Observa la request de login en Network:
   - ✅ Status 200 = ¡Funciona!
   - ❌ Status 500 = Revisa logs del backend
   - ❌ Status 0 / CORS error = Revisa CORS (Paso 1)

---

## 🎯 **CHECKLIST DE VERIFICACIÓN:**

- [ ] CORS_ORIGINS actualizado en Render con URL de Vercel
- [ ] Backend redesplegado después de cambiar CORS
- [ ] VITE_API_URL configurado correctamente en Vercel
- [ ] Frontend redesplegado si cambiaste variables
- [ ] URL del frontend anotada
- [ ] Logs del backend revisados
- [ ] Esperado 60 segundos después de los cambios
- [ ] Probado login con DevTools abierto

---

## 🔧 **TROUBLESHOOTING ADICIONAL:**

### **Si sigue sin funcionar después de CORS:**

1. **Verifica la URL exacta del backend:**
   ```
   https://sgts-farmashaio-api.onrender.com/health
   ```
   Debe responder con Status 200

2. **Verifica la conexión a la base de datos:**
   - Ve a Render → `sgts-farmashaio-db`
   - Verifica que esté **Available** (verde)
   - Si está en **Suspended**, reactivala

3. **Backend dormido (Cold Start):**
   - El backend en free tier se duerme después de 15 min de inactividad
   - Primer request después de dormir tarda **30-60 segundos**
   - Solución: Espera 60 segundos e intenta de nuevo

4. **Verifica que la DATABASE_URL sea la Internal URL:**
   ```
   postgresql://sgts_user:OtfEGRj0XljH4C7HTvItnKUHwL3742iQ@dpg-d3n8dpi4d50c73f43kr0-a/sgts_farmashaio_u3b7
   ```
   (Sin el `.oregon-postgres.render.com` en el host)

---

## 📞 **SI NADA FUNCIONA:**

Copia y envíame:

1. **URL del frontend en Vercel:**
   ```
   https://tu-proyecto.vercel.app
   ```

2. **Screenshot de los logs del backend en Render**
   (Últimas 20 líneas)

3. **Screenshot del error en DevTools (Network tab)**

4. **Variables de entorno configuradas:**
   - `CORS_ORIGINS` en Render
   - `VITE_API_URL` en Vercel

---

## 🎯 **SOLUCIÓN RÁPIDA (90% de los casos):**

**El problema suele ser CORS.** Sigue el **PASO 1** cuidadosamente:

1. Render → sgts-farmashaio-api → Environment
2. Edita `CORS_ORIGINS`
3. Agrega la URL exacta de tu frontend de Vercel
4. Save Changes
5. Espera 3 minutos
6. Refresca el frontend e intenta login

---

**Última actualización:** 14 de Octubre de 2025
