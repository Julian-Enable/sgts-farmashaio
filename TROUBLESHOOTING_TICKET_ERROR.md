# TROUBLESHOOTING - Error 500/401 al Crear Ticket

## Problema Actual
- ✅ Login funciona (obtiene token JWT)
- ❌ Crear ticket falla con error 500 en frontend, 401 en backend

## Diagnóstico

### 1. Verificar que el token se está enviando
En el navegador, abre DevTools (F12) → pestaña "Network":
1. Intenta crear un ticket
2. Busca la petición `POST https://sgts-farmashaio-api.onrender.com/api/tickets`
3. Click en la petición
4. Ve a "Headers"
5. Busca: `Authorization: Bearer <token>`

**¿El header Authorization existe?**
- ✅ SÍ → El problema está en el backend
- ❌ NO → El problema está en el frontend (no está enviando el token)

### 2. Ver el error exacto del backend
En DevTools → Network → POST /api/tickets → "Response":
- Deberías ver el mensaje de error exacto del backend

### 3. Verificar estructura de la petición
En DevTools → Network → POST /api/tickets → "Payload":

**Debería ser:**
```json
{
  "title": "No hay wifi en Cedi",
  "description": "No hay WIFI en CEDI desde las 9:00am",
  "category_id": 3,
  "priority_id": 4
}
```

**NO debería ser:**
```json
{
  "title": "...",
  "description": "...",
  "category": "Red",  ← INCORRECTO (debe ser category_id)
  "priority": "Alta"  ← INCORRECTO (debe ser priority_id)
}
```

## Posibles Causas

### A. Frontend enviando nombres en lugar de IDs
**Problema:** El frontend podría estar enviando `category: "Red"` en lugar de `category_id: 3`

**Solución:** Verificar archivo `frontend/src/components/tickets/CreateTicketForm.jsx`

### B. Backend esperando diferente formato
**Problema:** El backend podría esperar `category` en lugar de `category_id`

**Solución:** Verificar archivo `backend/src/controllers/ticketController.js`

### C. Token no se está guardando/enviando
**Problema:** El frontend no está guardando el token en localStorage

**Solución:** Verificar `frontend/src/contexts/AuthContext.jsx`

## Próximos Pasos

1. Abre DevTools → Network
2. Intenta crear un ticket
3. Captura pantalla de la petición POST /api/tickets mostrando:
   - Headers (especialmente Authorization)
   - Payload (datos enviados)
   - Response (error del servidor)

4. Con esa info puedo diagnosticar exactamente dónde está el problema
