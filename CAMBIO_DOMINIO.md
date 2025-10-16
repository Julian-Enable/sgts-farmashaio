# Guía de Cambio de Dominio - SGTS FARMASHAIO

## Si cambias el dominio de producción, debes actualizar estos archivos:

---

## 1. VARIABLES DE ENTORNO (Render - Backend)

**Ubicación:** Render Dashboard → sgts-farmashaio-api → Environment

**Variable a actualizar:**
```
CORS_ORIGINS=https://TU-NUEVO-DOMINIO.com
```

**Importante:** Si usas múltiples dominios (ej: www y sin www):
```
CORS_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

---

## 2. VARIABLES DE ENTORNO (Vercel - Frontend)

**Ubicación:** Vercel Dashboard → sgts-farmashaio → Settings → Environment Variables

**Variable a actualizar:**
```
VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api
```

**Nota:** Esta NO cambia si solo cambias el dominio del frontend. Solo si cambias la API.

---

## 3. ARCHIVO: render.yaml

**Ubicación:** `/render.yaml` (raíz del proyecto)

**Línea 19 - Actualizar:**
```yaml
envVars:
  - key: CORS_ORIGINS
    value: https://TU-NUEVO-DOMINIO.com
```

---

## 4. ARCHIVO: frontend/src/utils/constants.js

**Ubicación:** `/frontend/src/utils/constants.js`

**Actualizar las líneas 258-259:**

```javascript
export const URLS = {
  PRODUCTION_FRONTEND: 'https://TU-NUEVO-DOMINIO.com',
  PRODUCTION_API: 'https://sgts-farmashaio-api.onrender.com',
  // ...
};
```

---

## 5. ARCHIVO: README.md (Opcional)

**Ubicación:** `/README.md`

**Actualizar la línea 10:**
```markdown
**Aplicación:** [https://TU-NUEVO-DOMINIO.com](https://TU-NUEVO-DOMINIO.com)
```

---

## 6. CONFIGURACIÓN EN VERCEL (Dominio Custom)

Si vas a usar un dominio personalizado (ej: soporte.farmashaio.com):

### Paso 1: Agregar Dominio en Vercel
1. Vercel Dashboard → sgts-farmashaio → Settings → Domains
2. Click "Add Domain"
3. Ingresar tu dominio: `soporte.farmashaio.com`

### Paso 2: Configurar DNS
Vercel te dará registros DNS para configurar:

**Opción A - CNAME (Recomendado):**
```
Type: CNAME
Name: soporte (o @ si es dominio raíz)
Value: cname.vercel-dns.com
```

**Opción B - A Record:**
```
Type: A
Name: @ o soporte
Value: 76.76.21.21 (IP de Vercel)
```

### Paso 3: Esperar Propagación DNS
- Tiempo estimado: 5 minutos a 48 horas
- Verificar con: `nslookup tu-dominio.com`

---

## 7. BACKEND EN RENDER (Si cambias dominio de API)

Si decides cambiar `sgts-farmashaio-api.onrender.com` por un dominio custom:

### En Render Dashboard:
1. Settings → Custom Domains
2. Add Custom Domain
3. Configurar DNS según instrucciones de Render

### Actualizar en Frontend:
```javascript
// frontend/src/utils/constants.js
VITE_API_BASE_URL=https://api.tu-dominio.com/api
```

---

## RESUMEN: Checklist de Cambio de Dominio

### Frontend (Vercel):
- [ ] Agregar dominio custom en Vercel
- [ ] Configurar DNS (CNAME o A record)
- [ ] Actualizar `CORS_ORIGINS` en Render backend
- [ ] Actualizar `render.yaml` línea 19
- [ ] Actualizar `frontend/src/utils/constants.js` líneas 258
- [ ] Actualizar `README.md` (opcional)
- [ ] Hacer commit y push de cambios
- [ ] Redeploy en Vercel (automático con push)
- [ ] Verificar que SSL/HTTPS funciona

### Backend API (si cambias):
- [ ] Agregar dominio custom en Render
- [ ] Configurar DNS según Render
- [ ] Actualizar `VITE_API_BASE_URL` en Vercel
- [ ] Actualizar `frontend/src/utils/constants.js` línea 259
- [ ] Hacer commit y push
- [ ] Redeploy backend

---

## IMPORTANTE: Después del Cambio

### 1. Verificar CORS
Abre la consola del navegador en tu nuevo dominio y verifica que no hay errores CORS:
```
Access to fetch at 'https://api...' from origin 'https://tu-nuevo-dominio.com' 
has been blocked by CORS policy
```

Si ves este error, el `CORS_ORIGINS` no está actualizado correctamente.

### 2. Verificar SSL/HTTPS
- Tanto Vercel como Render proveen SSL automático
- Verifica que el candado verde aparece en el navegador
- Todas las URLs deben ser HTTPS

### 3. Probar Login
- Ir al nuevo dominio
- Intentar hacer login
- Verificar en Network tab que las peticiones van al backend correcto

### 4. Limpiar Caché
Los usuarios que ya visitaron el sitio anterior pueden necesitar:
```javascript
localStorage.clear();
sessionStorage.clear();
```

---

## TIEMPO ESTIMADO

- **Configuración:** 10-15 minutos
- **Propagación DNS:** 5 minutos a 48 horas (típicamente 1-2 horas)
- **SSL/HTTPS:** Automático (5-10 minutos después de DNS)

---

## CONTACTO

Si tienes problemas con el cambio de dominio, revisar:
- Logs de Render (backend)
- Logs de Vercel (frontend)
- Consola del navegador (Network y Console tabs)
