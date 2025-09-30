# 📋 SGTS FARMASHAIO - Sistema de Gestión de Tickets de Soporte TI

[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=for-the-badge&logo=github)](https://github.com/Julian-Enable/sgts-farmashaio/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

> 🎯 **Sistema integral de gestión de tickets de soporte técnico desarrollado específicamente para FARMASHAIO**  
> Implementando una arquitectura de 3 capas completamente desacoplada con hosting gratuito.

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

## 🚀 Deployment en Producción (100% Gratis)

### Stack de Hosting
- **Base de datos**: Render PostgreSQL (Free tier - 0.1 CPU, 256 MB RAM)
- **Backend API**: Render Web Service (Free tier - 0.1 CPU, 512 MB RAM)  
- **Frontend**: Vercel (Free tier - Edge Network global)

### Paso 1: Preparar Código

```bash
# 1. Commitear todos los cambios
git add .
git commit -m "Preparado para deployment en producción"
git push origin main

# 2. Ejecutar script de deployment (opcional)
./deploy.ps1  # Windows PowerShell
# o
./deploy.sh   # Linux/Mac
```

### Paso 2: Base de Datos en Render

1. **Crear cuenta en [render.com](https://render.com)**
2. **Conectar repositorio GitHub**
3. **Crear PostgreSQL Database**:
   - Dashboard → New → PostgreSQL
   - Name: `sgts-farmashaio-db`
   - Database Name: `sgts_farmashaio`  
   - User: `sgts_user`
   - Plan: **Free**
   
4. **Ejecutar Schema**:
   - Copiar contenido de `database/production_schema.sql`
   - Ejecutar en el Query Tool del dashboard
   - ✅ Usuarios creados automáticamente

### Paso 3: Backend API en Render

1. **Crear Web Service**:
   - Dashboard → New → Web Service
   - Connect Repository: `Julian-Enable/sgts-farmashaio`
   - Configuración:
     - **Name**: `sgts-farmashaio-api`
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

2. **Variables de Entorno**:
```env
NODE_ENV=production
DATABASE_URL=[Auto-completado desde la DB]
JWT_SECRET=tu_jwt_secret_super_seguro_de_al_menos_32_caracteres
CORS_ORIGINS=https://sgts-farmashaio.vercel.app
PORT=10000
```

### Paso 4: Frontend en Vercel

1. **Crear cuenta en [vercel.com](https://vercel.com)**
2. **Conectar repositorio GitHub**
3. **Importar Proyecto**:
   - Dashboard → New Project
   - Import from GitHub: `Julian-Enable/sgts-farmashaio`
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Variable de Entorno**:
```env
VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api
```

### Paso 5: Verificar Deployment

#### ✅ Checklist Post-Deployment
- [ ] Base de datos PostgreSQL funcionando en Render
- [ ] Backend API respondiendo (health check: `/health`)
- [ ] Frontend cargando en Vercel
- [ ] Login funcionando con usuarios de prueba:

**Credenciales de Prueba:**
```
👑 Administrador: admin@farmashaio.com / admin123
🔧 Técnico: tecnico1@farmashaio.com / tecnico123  
👤 Empleado: empleado1@farmashaio.com / empleado123
```
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