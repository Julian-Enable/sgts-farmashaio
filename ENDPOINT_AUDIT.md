# Auditoría de Endpoints Backend vs Frontend

## ❌ PROBLEMAS ENCONTRADOS:

### 1. **updateTicketStatus** - MÉTODO HTTP INCORRECTO
- **Backend**: `PATCH /:id/status` (línea 136 tickets.js)
- **Frontend**: `apiPut()` (línea 60 ticketService.js)
- **Fix**: Cambiar frontend de PUT a PATCH

### 2. **getTicketComments** - RUTA NO EXISTE EN BACKEND
- **Backend**: NO HAY RUTA DEFINIDA (controlador existe pero no está en router)
- **Frontend**: `GET /:id/comments` (línea 73 ticketService.js)
- **Fix**: Agregar ruta en backend

### 3. **getTicketHistory** - RUTA NO EXISTE EN BACKEND
- **Backend**: NO HAY RUTA DEFINIDA (controlador existe pero no está en router)
- **Frontend**: `GET /:id/history` (línea 79 ticketService.js)
- **Fix**: Agregar ruta en backend

### 4. **deleteTicket** - RUTA NO EXISTE EN BACKEND
- **Backend**: NO HAY RUTA DEFINIDA (controlador existe pero no está en router)
- **Frontend**: `DELETE /:id` (línea 44 ticketService.js)
- **Fix**: Agregar ruta en backend

### 5. **exportTickets** - NO EXISTE EN BACKEND
- **Backend**: NO EXISTE
- **Frontend**: `GET /tickets/export` (línea 109 ticketService.js)
- **Fix**: Eliminar del frontend o implementar en backend

### 6. **searchTickets** - NO EXISTE EN BACKEND
- **Backend**: NO EXISTE
- **Frontend**: `POST /tickets/search` (línea 119 ticketService.js)
- **Fix**: Eliminar del frontend o implementar en backend

### 7. **Extracción de datos inconsistente**
- **getTicketComments**: Retorna `response.data` pero backend retorna `{ success, comments }`
- **getTicketHistory**: Retorna `response.data` pero backend retorna `{ success, history }`
- **Fix**: Actualizar para extraer `.comments` y `.history`

## ✅ CORRECTOS (no necesitan cambios):
- ✅ getTickets - GET / 
- ✅ getTicketById - GET /:id
- ✅ createTicket - POST /
- ✅ updateTicket - PUT /:id
- ✅ assignTicket - POST /:id/assign (ya corregido)
- ✅ addComment - POST /:id/comments
- ✅ getTicketStats - GET /stats
- ✅ getTicketFilters - GET /filters
- ✅ getCategories, getPriorities, getStatuses - Endpoints públicos funcionando

---

## PLAN DE CORRECCIÓN:

1. Agregar rutas faltantes en backend
2. Corregir método HTTP de updateTicketStatus
3. Corregir extracción de datos en getTicketComments y getTicketHistory
4. Eliminar o comentar funciones no implementadas (export, search)
