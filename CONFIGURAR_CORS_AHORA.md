# 🎯 CONFIGURACIÓN CORS - INSTRUCCIONES EXACTAS

## 📋 TU INFORMACIÓN:

```
Frontend URL: https://sgts-farmashaio-3pj5.vercel.app
Backend URL:  https://sgts-farmashaio-api.onrender.com
```

---

## 🔥 VALOR EXACTO PARA COPIAR:

**Copia esta línea COMPLETA (sin espacios al inicio/final):**

```
https://sgts-farmashaio-3pj5.vercel.app,https://sgts-farmashaio-3pj5-git-main-julian-enable.vercel.app,https://*.vercel.app,http://localhost:5173
```

---

## 📝 PASOS DETALLADOS:

### 1️⃣ **Abre Render Dashboard**
```
https://dashboard.render.com
```

### 2️⃣ **Selecciona tu backend**
- En la lista de servicios, busca: **`sgts-farmashaio-api`**
- Click en el nombre

### 3️⃣ **Ve a Environment**
- En el menú izquierdo o superior, click en: **"Environment"**
- Verás una lista de variables de entorno

### 4️⃣ **Edita CORS_ORIGINS**
- Busca la variable: **`CORS_ORIGINS`**
- Actualmente tiene: `http://localhost:5173`
- Click en el ícono de **editar** (lápiz) al lado derecho

### 5️⃣ **Reemplaza el valor**
- **BORRA** el contenido actual
- **PEGA** este valor completo:
  ```
  https://sgts-farmashaio-3pj5.vercel.app,https://sgts-farmashaio-3pj5-git-main-julian-enable.vercel.app,https://*.vercel.app,http://localhost:5173
  ```

### 6️⃣ **Guarda los cambios**
- Click en: **"Save Changes"**
- Verás un mensaje: "Deploying..."

### 7️⃣ **Espera el redespliegue**
- ⏳ Espera 2-3 minutos
- El estado cambiará de "Deploying" a "Live" (verde)

### 8️⃣ **Prueba el login**
- Ve a tu frontend: https://sgts-farmashaio-3pj5.vercel.app/login
- Refresca la página (F5 o Ctrl+R)
- Abre DevTools (F12) → pestaña Console
- Intenta login con:
  ```
  Email: admin@farmashaio.com
  Password: admin123
  ```

---

## ✅ **SI FUNCIONA:**

Verás:
- ✅ Login exitoso
- ✅ Redirección al dashboard
- ✅ Mensaje de bienvenida

---

## ❌ **SI SIGUE EL ERROR:**

### **Opción A: Verificar variables en Vercel**

1. Ve a: https://vercel.com
2. Click en tu proyecto: `sgts-farmashaio`
3. Ve a: **Settings** → **Environment Variables**
4. Verifica que exista:
   ```
   VITE_API_URL = https://sgts-farmashaio-api.onrender.com
   ```
5. Si NO existe o está mal:
   - Click **"Edit"**
   - Corrige el valor
   - Ve a **Deployments**
   - Click en los 3 puntos del último deployment
   - Click **"Redeploy"**
   - Espera 2-3 minutos

### **Opción B: Verificar logs del backend**

1. Ve a: https://dashboard.render.com
2. Click en: `sgts-farmashaio-api`
3. Click en: **"Logs"**
4. Intenta hacer login en el frontend
5. Observa si aparecen errores nuevos en los logs
6. Copia el error y avísame

### **Opción C: Cold Start (Backend dormido)**

El backend en free tier se duerme después de 15 minutos sin actividad.

1. Ve a: https://sgts-farmashaio-api.onrender.com/health
2. Espera 30-60 segundos (es lento la primera vez)
3. Si responde OK, el backend está despierto
4. Intenta login de nuevo

---

## 🎯 **CHECKLIST:**

- [ ] Abrí Render Dashboard
- [ ] Seleccioné sgts-farmashaio-api
- [ ] Fui a Environment
- [ ] Edité CORS_ORIGINS
- [ ] Pegué el valor completo con las 4 URLs
- [ ] Guardé los cambios
- [ ] Esperé 3 minutos
- [ ] Refresqué el frontend
- [ ] Abrí DevTools (F12)
- [ ] Intenté login
- [ ] ¿Funcionó? ✅ / ❌

---

## 📞 **AVÍSAME:**

Después de configurar CORS, dime:
1. ¿Guardó correctamente en Render?
2. ¿Viste el mensaje "Deploying..."?
3. ¿Cambió a "Live" (verde)?
4. ¿Qué error aparece ahora en el frontend?
5. ¿Hay nuevos errores en los logs de Render?

---

**¡Sigue estos pasos y avísame cómo te va!** 🚀
