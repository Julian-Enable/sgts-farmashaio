# 📋 SGTS FARMASHAIO - Sistema de Gestión de Tickets de Soporte TI

Sistema integral de gestión de tickets de soporte técnico desarrollado específicamente para FARMASHAIO, implementando una arquitectura de 3 capas completamente desacoplada con hosting gratuito.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: React.js 18 + Material-UI + Vite
- **Backend**: Node.js + Express.js + PostgreSQL
- **Base de Datos**: PostgreSQL (Hosted en Render)
- **Autenticación**: JWT + bcrypt
- **Notificaciones**: NodeMailer (Email)

### Estructura del Proyecto
```
sgtsFarmashaio/
├── frontend/           # Aplicación React
├── backend/           # API REST con Express
├── database/         # Scripts SQL y migraciones
└── .github/         # Configuración de CI/CD
```

## ✨ Características Implementadas

### 🔐 Módulo de Autenticación
- ✅ Login seguro con JWT
- ✅ Gestión de roles: Empleado, Técnico, Administrador
- ✅ Protección de rutas por rol
- ✅ Sesiones persistentes

### 🎫 Módulo de Gestión de Tickets
- ✅ Creación de tickets por empleados
- ✅ Asignación automática de números de ticket
- ✅ Sistema de categorías y prioridades
- ✅ Estados configurables del ticket
- ✅ Asignación a técnicos
- ✅ Sistema de comentarios
- ✅ Historial completo de cambios

### 👥 Módulo de Usuarios
- ✅ CRUD completo de usuarios (Solo admins)
- ✅ Gestión de roles y permisos
- ✅ Activación/desactivación de cuentas

### 📧 Módulo de Notificaciones
- ✅ Notificaciones por email automáticas
- ✅ Notificaciones en tiempo real
- ✅ Plantillas de email profesionales

## 🚀 Configuración Local

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/sgts-farmashaio.git
cd sgts-farmashaio
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb sgts_farmashaio

# Configurar variables de entorno del backend
cd backend
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Configurar Backend
```bash
cd backend
npm install
npm run migrate    # Crear tablas
npm run seed      # Datos iniciales
npm run dev       # Servidor en puerto 5000
```

### 4. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env si es necesario
npm run dev       # Servidor en puerto 5173
```

### 5. Acceder a la Aplicación
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000

#### Usuarios por Defecto:
- **Admin**: `admin` / `admin123`
- **Técnico**: `tecnico1` / `tecnico123`
- **Empleado**: `empleado1` / `empleado123`

## 🌐 Deployment en Hosting Gratuito

### Paso 1: Base de Datos en Render

1. **Crear cuenta en Render.com**
2. **Crear PostgreSQL Database**:
   - Dashboard → New → PostgreSQL
   - Nombre: `sgts-farmashaio-db`
   - Plan: Free
   - Copiar `DATABASE_URL`

3. **Ejecutar Migraciones**:
```bash
# Desde tu máquina local
cd backend
export DATABASE_URL="tu-database-url-de-render"
npm run migrate
npm run seed
```

### Paso 2: Backend API en Render

1. **Crear Web Service en Render**:
   - Dashboard → New → Web Service
   - Conectar repositorio GitHub
   - Configuración:
     - **Name**: `sgts-farmashaio-api`
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`

2. **Variables de Entorno**:
```env
NODE_ENV=production
DATABASE_URL=postgresql://render-database-url
JWT_SECRET=tu-jwt-secret-super-seguro-de-64-caracteres-minimo
JWT_EXPIRES_IN=7d
CLIENT_URL=https://sgts-farmashaio.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password
EMAIL_FROM=SGTS FARMASHAIO <noreply@farmashaio.com>
BCRYPT_ROUNDS=12
```

### Paso 3: Frontend en Vercel

1. **Crear cuenta en Vercel.com**
2. **Importar Proyecto**:
   - Dashboard → New Project
   - Importar desde GitHub
   - Seleccionar repositorio

3. **Configuración de Build**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Variables de Entorno**:
```env
VITE_API_URL=https://sgts-farmashaio-api.onrender.com
VITE_APP_NAME=SGTS FARMASHAIO
VITE_APP_VERSION=1.0.0
```

### Paso 4: Configurar CORS en Backend

Actualizar el backend para permitir el dominio de Vercel:

```javascript
// En server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://sgts-farmashaio.vercel.app',
    'https://sgts-farmashaio-git-main-tu-usuario.vercel.app'
  ],
  credentials: true
}));
```

## 📋 Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm run migrate    # Ejecutar migraciones
npm run seed       # Cargar datos iniciales
npm test          # Ejecutar tests
```

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Linter ESLint
```

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (12 rounds)
- ✅ Autenticación JWT con expiración
- ✅ Validación de datos de entrada
- ✅ Protección CORS configurada
- ✅ Rate limiting en API
- ✅ Sanitización de inputs
- ✅ HTTPS enforced en producción

## 📊 Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `tickets` - Tickets de soporte
- `ticket_comments` - Comentarios
- `ticket_history` - Historial de cambios
- `categories` - Categorías de tickets
- `priorities` - Niveles de prioridad
- `ticket_statuses` - Estados del ticket
- `notifications` - Notificaciones

### Diagrama ER
```
Users ||--o{ Tickets : creates
Users ||--o{ Tickets : assigned_to
Tickets ||--o{ Comments : has
Tickets ||--o{ History : tracks
Categories ||--o{ Tickets : categorizes
Priorities ||--o{ Tickets : prioritizes
Statuses ||--o{ Tickets : status
```

## 🎯 Funcionalidades por Rol

### 👤 Empleado
- Crear tickets de soporte
- Ver sus propios tickets
- Agregar comentarios
- Actualizar información personal

### 👨‍🔧 Técnico
- Ver todos los tickets
- Tickets asignados automáticamente
- Cambiar estados de tickets
- Agregar comentarios públicos e internos
- Registrar horas trabajadas

### 👑 Administrador
- Acceso completo al sistema
- Gestión de usuarios
- Asignación manual de tickets
- Configuración del sistema
- Reportes y estadísticas

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (320px - 768px)
- 📱 **Tablets** (768px - 1024px)  
- 🖥️ **Desktop** (1024px+)

## 🔧 API Endpoints

### Autenticación
```
POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/logout          # Cerrar sesión
GET    /api/auth/profile         # Obtener perfil
PUT    /api/auth/profile         # Actualizar perfil
POST   /api/auth/change-password # Cambiar contraseña
```

### Usuarios
```
GET    /api/users               # Listar usuarios
POST   /api/users               # Crear usuario
GET    /api/users/:id           # Obtener usuario
PUT    /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Eliminar usuario
GET    /api/users/technicians   # Listar técnicos
```

### Tickets
```
GET    /api/tickets             # Listar tickets
POST   /api/tickets             # Crear ticket
GET    /api/tickets/:id         # Obtener ticket
PUT    /api/tickets/:id         # Actualizar ticket
POST   /api/tickets/:id/assign  # Asignar ticket
PATCH  /api/tickets/:id/status  # Cambiar estado
POST   /api/tickets/:id/comments # Agregar comentario
```

## 🌟 Próximas Mejoras

- [ ] Dashboard con gráficos y métricas
- [ ] Sistema de archivos adjuntos
- [ ] Notificaciones push en tiempo real
- [ ] App móvil nativa
- [ ] Integración con WhatsApp
- [ ] Sistema de SLA automático
- [ ] Reportes avanzados y analytics

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Probar conexión
psql $DATABASE_URL -c "SELECT version();"
```

### Error de CORS
Verificar que `CLIENT_URL` en el backend coincida con el dominio del frontend.

### Error 500 en Render
Revisar logs en el dashboard de Render y verificar variables de entorno.

## 📞 Soporte

Para soporte técnico:
- 📧 **Email**: soporte@farmashaio.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/sgts-farmashaio/issues)
- 📖 **Wiki**: [Documentación completa](https://github.com/tu-usuario/sgts-farmashaio/wiki)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ para FARMASHAIO**  
*Sistema de Gestión de Tickets de Soporte TI v1.0.0*