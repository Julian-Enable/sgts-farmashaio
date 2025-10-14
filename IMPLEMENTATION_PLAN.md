# Plan de Implementación - Funcionalidades Pendientes

## 🎯 Funcionalidades a Implementar

### 1. Dashboard - Estadísticas
**Estado**: Pendiente
**Prioridad**: Alta
**Descripción**: El dashboard muestra 0 en todos los contadores

**Tareas**:
- [x] Verificar endpoint backend `/api/tickets/stats` - EXISTE ✅
- [ ] Implementar carga de stats en DashboardPage.jsx
- [ ] Usar ticketService.getTicketStats()
- [ ] Mostrar contadores reales

**Backend**: `/api/tickets/stats` (GET) - Ya implementado
**Frontend**: DashboardPage.jsx - Necesita useEffect

---

### 2. Ver Ticket (Detalle)
**Estado**: Pendiente
**Prioridad**: Alta
**Descripción**: Ver detalles completos de un ticket

**Tareas**:
- [ ] Crear/Actualizar TicketDetailPage.jsx
- [ ] Mostrar toda la información del ticket
- [ ] Mostrar comentarios
- [ ] Mostrar historial de cambios
- [ ] Botones de acción según rol

**Backend**: `/api/tickets/:id` (GET) - Ya implementado
**Frontend**: Necesita página completa

---

### 3. Asignar Ticket
**Estado**: Pendiente
**Prioridad**: Alta
**Descripción**: Solo admin/técnico pueden ser asignados

**Reglas de Negocio**:
- Solo admin puede asignar tickets
- Solo se puede asignar a usuarios con rol "tecnico" o "administrador"
- Empleados NO pueden ser asignados

**Tareas**:
- [ ] Endpoint backend `/api/tickets/:id/assign` - Verificar
- [ ] Cargar lista de técnicos/admins
- [ ] Dialog de asignación en frontend
- [ ] Validar permisos (solo admin asigna)

**Backend**: `/api/tickets/:id/assign` (PUT)
**Frontend**: Dialog component + ticketService

---

### 4. Gestionar Ticket (Actualizar Estado)
**Estado**: Pendiente
**Prioridad**: Alta
**Descripción**: Solo el técnico asignado o admin puede gestionar

**Reglas de Negocio**:
- Solo el técnico asignado puede cambiar estado
- Admin puede cambiar cualquier ticket
- Empleado solo puede ver SUS tickets

**Tareas**:
- [ ] Endpoint backend `/api/tickets/:id/status` - Verificar
- [ ] UI para cambiar estado
- [ ] Validación de permisos
- [ ] Registro en historial

**Backend**: `/api/tickets/:id/status` (PUT)
**Frontend**: StatusUpdateDialog component

---

### 5. Comentarios en Tickets
**Estado**: Pendiente
**Prioridad**: Media
**Descripción**: Agregar comentarios a tickets

**Reglas de Negocio**:
- Creador del ticket puede comentar
- Técnico asignado puede comentar
- Admin puede comentar en cualquier ticket
- Comentarios internos (solo técnicos/admin)

**Tareas**:
- [ ] Endpoint backend `/api/tickets/:id/comments` - Verificar
- [ ] Componente CommentsList
- [ ] Componente AddComment
- [ ] Diferenciar comentarios públicos/internos

**Backend**: 
- POST `/api/tickets/:id/comments`
- GET `/api/tickets/:id/comments`

**Frontend**: Comments components

---

### 6. Cerrar Ticket
**Estado**: Pendiente
**Prioridad**: Media
**Descripción**: Marcar ticket como resuelto/cerrado

**Reglas de Negocio**:
- Solo técnico asignado o admin puede cerrar
- Requiere comentario de cierre
- Estado final "Cerrado" o "Resuelto"

**Tareas**:
- [ ] UI para cerrar ticket
- [ ] Campo de comentario obligatorio
- [ ] Actualizar estado a "Cerrado"
- [ ] Registrar fecha de resolución

**Backend**: Usar `/api/tickets/:id/status`
**Frontend**: CloseTicketDialog component

---

## 📋 Orden de Implementación Recomendado

1. **Dashboard Stats** (15 min) - Rápido y da valor inmediato
2. **Ver Ticket Detalle** (30 min) - Base para las demás funciones
3. **Comentarios** (30 min) - Funcionalidad independiente
4. **Asignar Ticket** (30 min) - Crítico para workflow
5. **Gestionar Ticket (Estados)** (30 min) - Workflow completo
6. **Cerrar Ticket** (20 min) - Completar ciclo de vida

**Tiempo Total Estimado**: ~2.5 horas

---

## 🔧 Archivos a Crear/Modificar

### Frontend:
- `frontend/src/pages/DashboardPage.jsx` ⚠️ Actualizar
- `frontend/src/pages/TicketDetailPage.jsx` ✨ Crear/Actualizar
- `frontend/src/components/tickets/CommentsList.jsx` ✨ Crear
- `frontend/src/components/tickets/AddComment.jsx` ✨ Crear
- `frontend/src/components/tickets/AssignTicketDialog.jsx` ✨ Crear
- `frontend/src/components/tickets/UpdateStatusDialog.jsx` ✨ Crear
- `frontend/src/components/tickets/CloseTicketDialog.jsx` ✨ Crear
- `frontend/src/services/ticketService.js` ⚠️ Verificar métodos

### Backend:
- Verificar endpoints existentes
- Validar permisos en controllers
- Asegurar que solo admin/técnico puedan ser asignados

---

## 🎨 Wireframe Mental

### Dashboard:
```
┌─────────────────────────────────────────┐
│ ¡Bienvenido, [Nombre]!                  │
│ [Chip: Rol] [Departamento]              │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │  5  │ │  2  │ │  1  │ │  2  │        │
│ │Total│ │Nuevo│ │Prog │ │Resu │        │
│ └─────┘ └─────┘ └─────┘ └─────┘        │
└─────────────────────────────────────────┘
```

### Ticket Detail:
```
┌─────────────────────────────────────────┐
│ [← Volver] TKT-2025-000002              │
│ "No hay Wifi en CEDI"                   │
├─────────────────────────────────────────┤
│ Estado: [Nuevo ●] Prioridad: [Alta ▲]   │
│ Categoría: Red                           │
│ Creado: 14/10/2025 por María García     │
│ Asignado a: [Sin asignar]               │
│                                          │
│ [Asignar] [Cambiar Estado] [Comentar]   │
├─────────────────────────────────────────┤
│ Descripción:                             │
│ El wifi esta caido desde las 2:00pm     │
├─────────────────────────────────────────┤
│ Comentarios (0):                         │
│ [Agregar comentario...]                  │
└─────────────────────────────────────────┘
```

---

## ✅ Checkpoints de Calidad

Para cada funcionalidad:
- [ ] Backend endpoint verificado y funcional
- [ ] Frontend component creado
- [ ] Permisos validados (rol-based)
- [ ] UI responsive (mobile-friendly)
- [ ] Manejo de errores implementado
- [ ] Loading states implementados
- [ ] Success/error messages mostrados
- [ ] Tested con los 3 roles (admin, técnico, empleado)

---

## 🚀 ¿Por dónde empezamos?

**Sugerencia**: Empezar con Dashboard Stats (rápido win) y luego ir a Ver Ticket Detail (base para todo).
