# 🔧 Troubleshooting - Create Ticket Issue

## ✅ Backend Status: FUNCIONANDO PERFECTAMENTE

### Tests Exitosos:
- ✅ Health check: `https://sgts-farmashaio-api.onrender.com/health` → 200 OK
- ✅ Categories API: `/api/categories` → Retorna 6 categorías correctamente
- ✅ Priorities API: `/api/priorities` → Retorna 5 prioridades correctamente
- ✅ Login funcionando: empleado1@farmashaio.com → Token JWT generado
- ✅ **TICKET CREADO**: ID: 1, Número: TKT-2025-000001 ✨

### Ticket de Prueba Creado:
```json
{
  "id": 1,
  "title": "Problema con impresora",
  "description": "La impresora HP del segundo piso no imprime documentos en color...",
  "ticketNumber": "TKT-2025-000001",
  "categoryId": 1,
  "priorityId": 3,
  "statusId": 1,
  "createdAt": "2025-10-14T20:30:46.034Z"
}
```

## ❌ Frontend Issue: Categories y Priorities no cargan

### Problema:
El frontend muestra "Error al cargar los datos iniciales" porque no puede cargar las categorías y prioridades desde el backend.

### Cambios Aplicados (Commit ebea54f):

#### 1. `frontend/src/services/ticketService.js`:
```javascript
// ANTES (incorrecto):
async getCategories() {
  const response = await apiGet('/categories');
  return response.data; // Retornaba { success: true, data: [...] }
}

// AHORA (correcto):
async getCategories() {
  const response = await apiGet('/categories');
  return response.data.data; // Retorna solo el array [...]
}
```

#### 2. `frontend/src/pages/CreateTicketPage.jsx`:
- ✅ Agregado `useState` para `priorities`
- ✅ `useEffect` carga categories Y priorities con `Promise.all`
- ✅ Select de prioridades usa datos del backend en lugar de constantes
- ✅ `handleCreateTicket` transforma `category`/`priority` a `categoryId`/`priorityId`

## 🔍 Pasos para Verificar:

### 1. Verificar que Vercel desplegó los cambios:
```
https://vercel.com/julian-enables-projects/sgts-farmashaio-frontend
```
- Ir a "Deployments"
- Verificar que el último deploy (commit ebea54f) está "Ready"

### 2. Hard Refresh del Frontend:
En el navegador:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 3. Abrir DevTools Console (F12) y verificar:
```javascript
// Debería ver estas requests:
// ✅ GET https://sgts-farmashaio-api.onrender.com/api/categories → 200
// ✅ GET https://sgts-farmashaio-api.onrender.com/api/priorities → 200
```

### 4. Si sigue sin funcionar, verificar en Console:
```javascript
// Ejecutar manualmente en la consola del navegador:
fetch('https://sgts-farmashaio-api.onrender.com/api/categories')
  .then(r => r.json())
  .then(d => console.log('Categories:', d.data));

fetch('https://sgts-farmashaio-api.onrender.com/api/priorities')
  .then(r => r.json())
  .then(d => console.log('Priorities:', d.data));
```

## 🎯 Solución Alternativa (si Vercel no desplegó):

### Forzar nuevo deploy en Vercel:
```powershell
# Hacer un cambio mínimo y push
git commit --allow-empty -m "trigger: Force Vercel redeploy"
git push origin main
```

## 📊 Endpoints Backend Verificados:

### GET /api/categories
```bash
curl https://sgts-farmashaio-api.onrender.com/api/categories
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Hardware", "description": "...", "color": "#f44336"},
    {"id": 2, "name": "Software", "description": "...", "color": "#2196f3"},
    {"id": 3, "name": "Red", "description": "...", "color": "#ff9800"},
    {"id": 4, "name": "Acceso", "description": "...", "color": "#4caf50"},
    {"id": 5, "name": "Email", "description": "...", "color": "#9c27b0"},
    {"id": 6, "name": "Otros", "description": "...", "color": "#9e9e9e"}
  ]
}
```

### GET /api/priorities
```bash
curl https://sgts-farmashaio-api.onrender.com/api/priorities
```
**Response:**
```json
{
  "success": true,
  "data": [
    {"id": 1, "name": "Muy Baja", "level": 1, "color": "#4caf50", "description": "..."},
    {"id": 2, "name": "Baja", "level": 2, "color": "#8bc34a", "description": "..."},
    {"id": 3, "name": "Media", "level": 3, "color": "#ff9800", "description": "..."},
    {"id": 4, "name": "Alta", "level": 4, "color": "#f44336", "description": "..."},
    {"id": 5, "name": "Crítica", "level": 5, "color": "#d32f2f", "description": "..."}
  ]
}
```

### POST /api/tickets (Crear ticket)
```bash
curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test ticket",
    "description": "Descripción del problema",
    "categoryId": 1,
    "priorityId": 3
  }'
```

## 🚨 Si el problema persiste:

### Opción 1: Verificar Build Logs en Vercel
1. Ir a https://vercel.com/dashboard
2. Seleccionar proyecto "sgts-farmashaio-frontend"
3. Ver "Deployments" → Click en el último
4. Revisar "Build Logs" para errores

### Opción 2: Verificar variables de entorno
En Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://sgts-farmashaio-api.onrender.com
```

### Opción 3: Rollback temporal
Si necesitas que funcione YA mientras debugueamos:
```powershell
# Revert al commit anterior
git revert ebea54f --no-commit
git commit -m "temp: Revert frontend changes for debugging"
git push origin main
```

## 📝 Commit History:

- **ebea54f**: fix: Frontend now loads categories and priorities from backend API
- **2cbca36**: fix: Remove affected_users field (column doesn't exist in DB)
- **e8b74ea**: fix: Update ticket creation to use numeric IDs instead of text mapping
- **9985f17**: fix: Correct database import in catalog routes

## ✅ Resumen:

**Backend**: 100% funcional, todos los endpoints responden correctamente
**Database**: Poblada con datos correctos (6 categorías, 5 prioridades, 6 estados, 3 usuarios)
**Ticket Creation**: ✅ COMPROBADO - Se creó el ticket TKT-2025-000001 exitosamente
**Frontend**: Esperando verificar si Vercel desplegó los cambios del commit ebea54f

## 🎯 Acción Inmediata:

1. **Hard refresh** del frontend (Ctrl+Shift+R)
2. Abrir **DevTools Console** (F12)
3. Ir a **Network tab**
4. Intentar crear ticket y ver qué requests fallan
5. Compartir screenshot de la consola si hay errores
