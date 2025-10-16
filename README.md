# SGTS FARMASHAIO# SGTS FARMASHAIO



### Sistema de Gestión de Tickets de Soporte TI### Sistema de Gestión de Tickets de Soporte TI



[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=flat-square)](https://github.com/Julian-Enable/sgts-farmashaio/releases)[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=flat-square)](https://github.com/Julian-Enable/sgts-farmashaio/releases)

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)



Sistema integral de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas completamente desacoplada con autenticación JWT, gestión de roles y notificaciones en tiempo real.Sistema integral de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas completamente desacoplada con autenticación JWT, gestión de roles y notificaciones en tiempo real.



**Production:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)  **Production:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)  

**API:** [https://sgts-farmashaio-api.onrender.com](https://sgts-farmashaio-api.onrender.com)**API:** [https://sgts-farmashaio-api.onrender.com](https://sgts-farmashaio-api.onrender.com)



------



## Tabla de Contenidos## Tabla de Contenidos



- [Arquitectura del Sistema](#arquitectura-del-sistema)- [Arquitectura del Sistema](#arquitectura-del-sistema)

- [Características Principales](#características-principales)- [Características Principales](#características-principales)

- [Tecnologías Utilizadas](#tecnologías-utilizadas)- [Tecnologías Utilizadas](#tecnologías-utilizadas)

- [Instalación Local](#instalación-local)- [Instalación Local](#instalación-local)

- [Deployment en Producción](#deployment-en-producción)- [Deployment en Producción](#deployment-en-producción)

- [API Reference](#api-reference)- [API Reference](#api-reference)

- [Estructura del Proyecto](#estructura-del-proyecto)- [Estructura del Proyecto](#estructura-del-proyecto)

- [Base de Datos](#base-de-datos)- [Seguridad](#seguridad)

- [Seguridad](#seguridad)- [Licencia](#licencia)

- [Troubleshooting](#troubleshooting)

- [Roadmap](#roadmap)---

- [Licencia](#licencia)

## Arquitectura del Sistema

---

### Stack Completo

## Arquitectura del Sistema

| Capa | Tecnología | Versión | Hosting |

### Stack Completo|------|-----------|---------|---------|

| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 | Vercel |

| Capa | Tecnología | Versión | Hosting || **Backend** | Node.js + Express | 18.x / 4.18 | Render |

|------|-----------|---------|---------|| **Database** | PostgreSQL | 14.x | Render |

| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 | Vercel || **Auth** | JWT + bcrypt | - | - |

| **Backend** | Node.js + Express | 18.x / 4.18 | Render || **Email** | NodeMailer | 6.9 | - |

| **Database** | PostgreSQL | 14.x | Render |

| **Auth** | JWT + bcrypt | - | - |### Arquitectura de 3 Capas

| **Email** | NodeMailer | 6.9 | - |

```

### Arquitectura de 3 Capas┌─────────────────────────────────────────────────────────────┐

│                    PRESENTATION LAYER                        │

```│  React 18 + Material-UI + Vite                              │

┌─────────────────────────────────────────────────────────────┐│  https://sgts-farmashaio.vercel.app                         │

│                    PRESENTATION LAYER                        │└──────────────────────┬──────────────────────────────────────┘

│  React 18 + Material-UI + Vite                              │                       │ REST API (HTTPS)

│  https://sgts-farmashaio.vercel.app                         │┌──────────────────────▼──────────────────────────────────────┐

└──────────────────────┬──────────────────────────────────────┘│                    APPLICATION LAYER                         │

                       │ REST API (HTTPS)│  Node.js + Express.js                                       │

┌──────────────────────▼──────────────────────────────────────┐│  https://sgts-farmashaio-api.onrender.com                  │

│                    APPLICATION LAYER                         │└──────────────────────┬──────────────────────────────────────┘

│  Node.js + Express.js                                       │                       │ SQL Queries

│  https://sgts-farmashaio-api.onrender.com                  │┌──────────────────────▼──────────────────────────────────────┐

└──────────────────────┬──────────────────────────────────────┘│                    DATA LAYER                                │

                       │ SQL Queries│  PostgreSQL 14.x                                            │

┌──────────────────────▼──────────────────────────────────────┐│  Render Managed Database                                    │

│                    DATA LAYER                                │└─────────────────────────────────────────────────────────────┘

│  PostgreSQL 14.x                                            │```

│  Render Managed Database                                    │

└─────────────────────────────────────────────────────────────┘---

```

## Características Principales

---

### Autenticación y Autorización

## Características Principales- Login seguro con JWT (JSON Web Tokens)

- Hash de contraseñas con bcrypt (12 rounds)

### Autenticación y Autorización- Gestión de roles: **Empleado**, **Técnico**, **Administrador**

- Login seguro con JWT (JSON Web Tokens)- Protección de rutas basada en roles

- Hash de contraseñas con bcrypt (12 rounds)- Sesiones persistentes con refresh tokens

- Gestión de roles: **Empleado**, **Técnico**, **Administrador**

- Protección de rutas basada en roles### Gestión de Tickets

- Sesiones persistentes con refresh tokens- Creación y asignación automática de números de ticket

- Sistema de categorías configurables

### Gestión de Tickets- Niveles de prioridad (Baja, Media, Alta, Crítica)

- Creación y asignación automática de números de ticket- Estados personalizables del ciclo de vida

- Sistema de categorías configurables- Asignación inteligente a técnicos

- Niveles de prioridad (Baja, Media, Alta, Crítica)- Sistema de comentarios públicos e internos

- Estados personalizables del ciclo de vida- Historial completo de cambios con auditoría

- Asignación inteligente a técnicos

- Sistema de comentarios públicos e internos### Gestión de Usuarios

- Historial completo de cambios con auditoría- CRUD completo de usuarios (Solo administradores)

- Gestión avanzada de roles y permisos

### Gestión de Usuarios- Activación y desactivación de cuentas

- CRUD completo de usuarios (Solo administradores)- Perfiles personalizables

- Gestión avanzada de roles y permisos- Cambio de contraseña con validación

- Activación y desactivación de cuentas

- Perfiles personalizables### Sistema de Notificaciones

- Cambio de contraseña con validación- Notificaciones automáticas por email

- Notificaciones en tiempo real en la aplicación

### Sistema de Notificaciones- Plantillas de email HTML profesionales

- Notificaciones automáticas por email- Configuración de preferencias de notificación

- Notificaciones en tiempo real en la aplicación- Historial de notificaciones enviadas

- Plantillas de email HTML profesionales

- Configuración de preferencias de notificación---

- Historial de notificaciones enviadas

## Tecnologías Utilizadas

---

### Frontend

## Tecnologías Utilizadas- **React 18.2** - Librería UI con hooks

- **Vite 4.4** - Build tool de última generación

### Frontend- **Material-UI 5.14** - Componentes UI

- **React 18.2** - Librería UI con hooks- **React Router 6** - Navegación SPA

- **Vite 4.4** - Build tool de última generación- **Axios** - Cliente HTTP

- **Material-UI 5.14** - Componentes UI- **Context API** - State management

- **React Router 6** - Navegación SPA

- **Axios** - Cliente HTTP### Backend

- **Context API** - State management- **Node.js 18.x** - Runtime JavaScript

- **Express 4.18** - Framework web

### Backend- **PostgreSQL 14.x** - Base de datos relacional

- **Node.js 18.x** - Runtime JavaScript- **JWT** - Autenticación stateless

- **Express 4.18** - Framework web- **bcrypt** - Hash de contraseñas

- **PostgreSQL 14.x** - Base de datos relacional- **NodeMailer** - Envío de emails

- **JWT** - Autenticación stateless- **Winston** - Logging system

- **bcrypt** - Hash de contraseñas

- **NodeMailer** - Envío de emails### DevOps & Deployment

- **Winston** - Logging system- **Git & GitHub** - Control de versiones

- **Vercel** - Hosting frontend

### DevOps & Deployment- **Render** - Hosting backend y database

- **Git & GitHub** - Control de versiones- **ESLint** - Linter JavaScript

- **Vercel** - Hosting frontend- **Prettier** - Code formatter

- **Render** - Hosting backend y database

- **ESLint** - Linter JavaScript---

- **Prettier** - Code formatter

## Instalación Local

---

### Prerrequisitos

## Instalación Local

```bash

### Prerrequisitosnode --version  # >= 18.0.0

npm --version   # >= 9.0.0

```bashpsql --version  # >= 12.0

node --version  # >= 18.0.0```

npm --version   # >= 9.0.0

psql --version  # >= 12.0### 1. Clonar Repositorio

```

```bash

### 1. Clonar Repositoriogit clone https://github.com/Julian-Enable/sgts-farmashaio.git

cd sgts-farmashaio

```bash```

git clone https://github.com/Julian-Enable/sgts-farmashaio.git

cd sgts-farmashaio### 2. Configurar Base de Datos

```

```bash

### 2. Configurar Base de Datos# Crear base de datos PostgreSQL

createdb sgts_farmashaio

```bash

# Crear base de datos PostgreSQL# Ejecutar schema

createdb sgts_farmashaiopsql sgts_farmashaio < database/schema.sql



# Ejecutar schema# Cargar datos iniciales

psql sgts_farmashaio < database/schema.sqlpsql sgts_farmashaio < database/seed.sql

```

# Cargar datos iniciales

psql sgts_farmashaio < database/seed.sql### 3. Configurar Backend

```

```bash

### 3. Configurar Backendcd backend

npm install

```bash

cd backend# Crear archivo .env

npm installcat > .env << EOF

NODE_ENV=development

# Crear archivo .envPORT=5000

cat > .env << EOFDATABASE_URL=postgresql://postgres:password@localhost:5432/sgts_farmashaio

NODE_ENV=developmentJWT_SECRET=your-secret-key-min-32-characters

PORT=5000CORS_ORIGINS=http://localhost:5173

DATABASE_URL=postgresql://postgres:password@localhost:5432/sgts_farmashaioEOF

JWT_SECRET=your-secret-key-min-32-characters

CORS_ORIGINS=http://localhost:5173# Iniciar servidor de desarrollo

EOFnpm run dev

```

# Iniciar servidor de desarrollo

npm run devEl servidor estará disponible en `http://localhost:5000`

```

### 4. Configurar Frontend

El servidor estará disponible en `http://localhost:5000`

```bash

### 4. Configurar Frontendcd frontend

npm install

```bash

cd frontend# Crear archivo .env

npm installcat > .env << EOF

VITE_API_BASE_URL=http://localhost:5000/api

# Crear archivo .envEOF

cat > .env << EOF

VITE_API_BASE_URL=http://localhost:5000/api# Iniciar servidor de desarrollo

EOFnpm run dev

```

# Iniciar servidor de desarrollo

npm run devEl frontend estará disponible en `http://localhost:5173`

```

### 5. Credenciales de Prueba

El frontend estará disponible en `http://localhost:5173`

| Rol | Email | Contraseña | Descripción |

### 5. Credenciales de Prueba|-----|-------|-----------|-------------|

| **Admin** | `admin@farmashaio.com` | `admin123` | Acceso completo al sistema |

| Rol | Email | Contraseña | Descripción || **Técnico** | `tecnico1@farmashaio.com` | `tecnico123` | Gestión de tickets |

|-----|-------|-----------|-------------|| **Empleado** | `empleado1@farmashaio.com` | `empleado123` | Creación de tickets |

| **Admin** | `admin@farmashaio.com` | `admin123` | Acceso completo al sistema |

| **Técnico** | `tecnico1@farmashaio.com` | `tecnico123` | Gestión de tickets |---

| **Empleado** | `empleado1@farmashaio.com` | `empleado123` | Creación de tickets |

## Deployment en Producción

---

### Stack de Hosting Gratuito

## Deployment en Producción

| Servicio | Proveedor | Plan | Recursos |

### Stack de Hosting Gratuito|----------|-----------|------|----------|

| **Database** | Render | Free | 0.1 CPU, 256 MB RAM |

| Servicio | Proveedor | Plan | Recursos || **Backend API** | Render | Free | 0.1 CPU, 512 MB RAM |

|----------|-----------|------|----------|| **Frontend** | Vercel | Free | Edge Network Global |

| **Database** | Render | Free | 0.1 CPU, 256 MB RAM |

| **Backend API** | Render | Free | 0.1 CPU, 512 MB RAM |**Costo total:** $0/mes

| **Frontend** | Vercel | Free | Edge Network Global |

### Guía de Deployment

**Costo total:** $0/mes

#### 1. Preparar Repositorio

### Guía de Deployment

```bash

#### 1. Preparar Repositorio# Verificar que todo está commiteado

git status

```bash

# Verificar que todo está commiteado# Push a GitHub

git statusgit push origin main

```

# Push a GitHub

git push origin main#### 2. PostgreSQL Database en Render

```

**a) Crear cuenta y conectar GitHub**

#### 2. PostgreSQL Database en Render- Visitar [render.com](https://render.com)

- Sign up with GitHub

**a) Crear cuenta y conectar GitHub**- Autorizar acceso al repositorio

- Visitar [render.com](https://render.com)

- Sign up with GitHub**b) Crear PostgreSQL Database**

- Autorizar acceso al repositorio```

Dashboard → New → PostgreSQL

**b) Crear PostgreSQL Database**Name: sgts-farmashaio-db

```Database: sgts_farmashaio

Dashboard → New → PostgreSQLUser: sgts_user

Name: sgts-farmashaio-dbRegion: Oregon (US West)

Database: sgts_farmashaioPlan: Free

User: sgts_user```

Region: Oregon (US West)

Plan: Free**c) Ejecutar Schema**

```- Copiar contenido de `database/schema.sql`

- Dashboard → Connect → PSQL Command

**c) Ejecutar Schema**- Pegar y ejecutar

- Copiar contenido de `database/schema.sql`- Repetir con `database/seed.sql`

- Dashboard → Connect → PSQL Command

- Pegar y ejecutar**d) Guardar DATABASE_URL**

- Repetir con `database/seed.sql````

Internal Database URL: postgresql://sgts_user:****@****/sgts_farmashaio

**d) Guardar DATABASE_URL**```

```

Internal Database URL: postgresql://sgts_user:****@****/sgts_farmashaio#### 3. Backend API en Render

```

**a) Crear Web Service**

#### 3. Backend API en Render```

Dashboard → New → Web Service

**a) Crear Web Service**Repository: Julian-Enable/sgts-farmashaio

```Name: sgts-farmashaio-api

Dashboard → New → Web ServiceRegion: Oregon (US West)

Repository: Julian-Enable/sgts-farmashaioBranch: main

Name: sgts-farmashaio-apiRoot Directory: backend

Region: Oregon (US West)Runtime: Node

Branch: mainBuild Command: npm install

Root Directory: backendStart Command: npm start

Runtime: NodePlan: Free

Build Command: npm install```

Start Command: npm start

Plan: Free**b) Configurar Variables de Entorno**

``````env

NODE_ENV=production

**b) Configurar Variables de Entorno**DATABASE_URL=<Copiar Internal Database URL>

```envJWT_SECRET=<Generar string aleatorio de 32+ caracteres>

NODE_ENV=productionCORS_ORIGINS=https://sgts-farmashaio.vercel.app

DATABASE_URL=<Copiar Internal Database URL>PORT=10000

JWT_SECRET=<Generar string aleatorio de 32+ caracteres>```

CORS_ORIGINS=https://sgts-farmashaio.vercel.app

PORT=10000**c) Conectar Database**

```- En el Web Service: Environment → Add Environment Group

- Seleccionar la base de datos creada

**c) Conectar Database**

- En el Web Service: Environment → Add Environment Group**d) Deploy**

- Seleccionar la base de datos creada- Click "Create Web Service"

- Esperar ~5 minutos para el primer deploy

**d) Deploy**- Verificar: `https://sgts-farmashaio-api.onrender.com/health`

- Click "Create Web Service"

- Esperar ~5 minutos para el primer deploy#### 4. Frontend en Vercel

- Verificar: `https://sgts-farmashaio-api.onrender.com/health`

**a) Importar Proyecto**

#### 4. Frontend en Vercel```

Dashboard → Add New → Project

**a) Importar Proyecto**Import Git Repository: Julian-Enable/sgts-farmashaio

```Framework Preset: Vite

Dashboard → Add New → ProjectRoot Directory: frontend

Import Git Repository: Julian-Enable/sgts-farmashaioBuild Command: npm run build

Framework Preset: ViteOutput Directory: dist

Root Directory: frontendInstall Command: npm install

Build Command: npm run build```

Output Directory: dist

Install Command: npm install**b) Configurar Variables de Entorno**

``````env

VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api

**b) Configurar Variables de Entorno**```

```env

VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api**c) Deploy**

```- Click "Deploy"

- Esperar ~2 minutos

**c) Deploy**- Verificar: `https://sgts-farmashaio.vercel.app`

- Click "Deploy"

- Esperar ~2 minutos#### 5. Verificación Post-Deployment

- Verificar: `https://sgts-farmashaio.vercel.app`

**Checklist de Validación:**

#### 5. Verificación Post-Deployment

- [ ] Database responde correctamente

**Checklist de Validación:**  ```bash

  psql <DATABASE_URL> -c "SELECT COUNT(*) FROM users;"

- [ ] Database responde correctamente  ```

  ```bash

  psql <DATABASE_URL> -c "SELECT COUNT(*) FROM users;"- [ ] Backend API funcional

  ```  ```bash

  curl https://sgts-farmashaio-api.onrender.com/health

- [ ] Backend API funcional  # Expected: {"status": "ok"}

  ```bash  ```

  curl https://sgts-farmashaio-api.onrender.com/health

  # Expected: {"status": "ok"}- [ ] Frontend accesible

  ```  - Abrir `https://sgts-farmashaio.vercel.app`

  - Verificar que carga sin errores

- [ ] Frontend accesible

  - Abrir `https://sgts-farmashaio.vercel.app`- [ ] Login funcional

  - Verificar que carga sin errores  - Email: `admin@farmashaio.com`

  - Password: `admin123`

- [ ] Login funcional  - Verificar acceso al dashboard

  - Email: `admin@farmashaio.com`

  - Password: `admin123`- [ ] CORS configurado

  - Verificar acceso al dashboard  - Verificar que las llamadas API funcionan

  - Revisar Network tab (sin errores CORS)

- [ ] CORS configurado

  - Verificar que las llamadas API funcionan### Actualización Continua

  - Revisar Network tab (sin errores CORS)

Ambos servicios están configurados con **auto-deploy**:

### Actualización Continua

```bash

Ambos servicios están configurados con **auto-deploy**:git add .

git commit -m "feat: nueva funcionalidad"

```bashgit push origin main

git add .```

git commit -m "feat: nueva funcionalidad"

git push origin main- **Vercel**: Deploy automático en ~2 minutos

```- **Render**: Deploy automático en ~5 minutos



- **Vercel**: Deploy automático en ~2 minutos---

- **Render**: Deploy automático en ~5 minutos## API Reference



---### Base URL

```

## API ReferenceDevelopment: http://localhost:5000/api

Production:  https://sgts-farmashaio-api.onrender.com/api

### Base URL```

```

Development: http://localhost:5000/api### Autenticación

Production:  https://sgts-farmashaio-api.onrender.com/api

```Todos los endpoints (excepto `/auth/login`) requieren token JWT en el header:

```http

### AutenticaciónAuthorization: Bearer <token>

```

Todos los endpoints (excepto `/auth/login`) requieren token JWT en el header:

```http#### Endpoints de Autenticación

Authorization: Bearer <token>

``````http

POST   /api/auth/login

#### Endpoints de AutenticaciónPOST   /api/auth/logout

GET    /api/auth/profile

```httpPUT    /api/auth/profile

POST   /api/auth/loginPOST   /api/auth/change-password

POST   /api/auth/logout```

GET    /api/auth/profile

PUT    /api/auth/profile**Ejemplo: Login**

POST   /api/auth/change-password```bash

```curl -X POST https://sgts-farmashaio-api.onrender.com/api/auth/login \

  -H "Content-Type: application/json" \

**Ejemplo: Login**  -d '{"email": "admin@farmashaio.com", "password": "admin123"}'

```bash```

curl -X POST https://sgts-farmashaio-api.onrender.com/api/auth/login \

  -H "Content-Type: application/json" \### Gestión de Usuarios

  -d '{"email": "admin@farmashaio.com", "password": "admin123"}'

``````http

GET    /api/users              # Listar todos los usuarios

### Gestión de UsuariosPOST   /api/users              # Crear nuevo usuario

GET    /api/users/:id          # Obtener usuario específico

```httpPUT    /api/users/:id          # Actualizar usuario

GET    /api/users              # Listar todos los usuariosDELETE /api/users/:id          # Eliminar usuario

POST   /api/users              # Crear nuevo usuarioGET    /api/users/technicians  # Listar solo técnicos

GET    /api/users/:id          # Obtener usuario específico```

PUT    /api/users/:id          # Actualizar usuario

DELETE /api/users/:id          # Eliminar usuario### Gestión de Tickets

GET    /api/users/technicians  # Listar solo técnicos

``````http

GET    /api/tickets                  # Listar tickets (con filtros)

### Gestión de TicketsPOST   /api/tickets                  # Crear nuevo ticket

GET    /api/tickets/:id              # Obtener ticket específico

```httpPUT    /api/tickets/:id              # Actualizar ticket

GET    /api/tickets                  # Listar tickets (con filtros)DELETE /api/tickets/:id              # Eliminar ticket

POST   /api/tickets                  # Crear nuevo ticketPOST   /api/tickets/:id/assign       # Asignar técnico

GET    /api/tickets/:id              # Obtener ticket específicoPATCH  /api/tickets/:id/status       # Cambiar estado

PUT    /api/tickets/:id              # Actualizar ticketPOST   /api/tickets/:id/comments     # Agregar comentario

DELETE /api/tickets/:id              # Eliminar ticketGET    /api/tickets/:id/history      # Obtener historial

POST   /api/tickets/:id/assign       # Asignar técnico```

PATCH  /api/tickets/:id/status       # Cambiar estado

POST   /api/tickets/:id/comments     # Agregar comentario**Ejemplo: Crear Ticket**

GET    /api/tickets/:id/history      # Obtener historial```bash

```curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \

  -H "Authorization: Bearer <token>" \

**Ejemplo: Crear Ticket**  -H "Content-Type: application/json" \

```bash  -d '{

curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \    "title": "Error en sistema de inventario",

  -H "Authorization: Bearer <token>" \    "description": "El sistema no permite actualizar existencias",

  -H "Content-Type: application/json" \    "category_id": 1,

  -d '{    "priority_id": 3

    "title": "Error en sistema de inventario",  }'

    "description": "El sistema no permite actualizar existencias",```

    "category_id": 1,

    "priority_id": 3### Notificaciones

  }'

``````http

GET    /api/notifications           # Listar notificaciones del usuario

### NotificacionesPUT    /api/notifications/:id/read  # Marcar como leída

DELETE /api/notifications/:id       # Eliminar notificación

```http```

GET    /api/notifications           # Listar notificaciones del usuario

PUT    /api/notifications/:id/read  # Marcar como leída### Catálogos

DELETE /api/notifications/:id       # Eliminar notificación

``````http

GET    /api/categories              # Listar categorías

### CatálogosGET    /api/priorities              # Listar prioridades

GET    /api/statuses                # Listar estados

```http```

GET    /api/categories              # Listar categorías

GET    /api/priorities              # Listar prioridades### Códigos de Respuesta

GET    /api/statuses                # Listar estados

```| Código | Descripción |

|--------|-------------|

### Códigos de Respuesta| `200` | OK - Solicitud exitosa |

| `201` | Created - Recurso creado |

| Código | Descripción || `400` | Bad Request - Datos inválidos |

|--------|-------------|| `401` | Unauthorized - Token inválido o faltante |

| `200` | OK - Solicitud exitosa || `403` | Forbidden - Sin permisos |

| `201` | Created - Recurso creado || `404` | Not Found - Recurso no encontrado |

| `400` | Bad Request - Datos inválidos || `500` | Internal Server Error - Error del servidor |

| `401` | Unauthorized - Token inválido o faltante |

| `403` | Forbidden - Sin permisos |---

| `404` | Not Found - Recurso no encontrado |

| `500` | Internal Server Error - Error del servidor |## Estructura del Proyecto



---```

sgts-farmashaio/

## Estructura del Proyecto├── frontend/

│   ├── src/

```│   │   ├── assets/              # Imágenes y recursos estáticos

sgts-farmashaio/│   │   ├── components/          # Componentes reutilizables

├── frontend/│   │   │   ├── auth/           # Componentes de autenticación

│   ├── src/│   │   │   ├── common/         # Componentes compartidos

│   │   ├── assets/              # Imágenes y recursos estáticos│   │   │   ├── tickets/        # Componentes de tickets

│   │   ├── components/          # Componentes reutilizables│   │   │   └── users/          # Componentes de usuarios

│   │   │   ├── auth/           # Componentes de autenticación│   │   ├── contexts/            # Context API (AuthContext)

│   │   │   ├── common/         # Componentes compartidos│   │   ├── pages/              # Páginas de la aplicación

│   │   │   ├── tickets/        # Componentes de tickets│   │   ├── services/           # Servicios API (axios)

│   │   │   └── users/          # Componentes de usuarios│   │   ├── theme/              # Configuración Material-UI

│   │   ├── contexts/            # Context API (AuthContext)│   │   ├── utils/              # Funciones de utilidad

│   │   ├── pages/              # Páginas de la aplicación│   │   ├── App.jsx             # Componente raíz

│   │   ├── services/           # Servicios API (axios)│   │   └── main.jsx            # Entry point

│   │   ├── theme/              # Configuración Material-UI│   ├── public/                 # Archivos públicos

│   │   ├── utils/              # Funciones de utilidad│   ├── index.html              # HTML template

│   │   ├── App.jsx             # Componente raíz│   ├── vite.config.js          # Configuración Vite

│   │   └── main.jsx            # Entry point│   └── package.json

│   ├── public/                 # Archivos públicos│

│   ├── index.html              # HTML template├── backend/

│   ├── vite.config.js          # Configuración Vite│   ├── src/

│   └── package.json│   │   ├── config/             # Configuración (database, jwt)

││   │   ├── controllers/        # Controladores de rutas

├── backend/│   │   ├── middleware/         # Middleware (auth, validation)

│   ├── src/│   │   ├── models/             # Modelos de datos

│   │   ├── config/             # Configuración (database, jwt)│   │   ├── routes/             # Definición de rutas

│   │   ├── controllers/        # Controladores de rutas│   │   ├── services/           # Lógica de negocio

│   │   ├── middleware/         # Middleware (auth, validation)│   │   └── utils/              # Utilidades (logger, email)

│   │   ├── models/             # Modelos de datos│   ├── scripts/

│   │   ├── routes/             # Definición de rutas│   │   ├── migrate.js          # Script de migración DB

│   │   ├── services/           # Lógica de negocio│   │   └── seed.js             # Script de datos iniciales

│   │   └── utils/              # Utilidades (logger, email)│   ├── server.js               # Entry point del servidor

│   ├── scripts/│   └── package.json

│   │   ├── migrate.js          # Script de migración DB│

│   │   └── seed.js             # Script de datos iniciales├── database/

│   ├── server.js               # Entry point del servidor│   ├── schema.sql              # Schema de PostgreSQL

│   └── package.json│   └── seed.sql                # Datos iniciales

││

├── database/├── .github/

│   ├── schema.sql              # Schema de PostgreSQL│   └── copilot-instructions.md # Instrucciones del proyecto

│   └── seed.sql                # Datos iniciales│

│├── render.yaml                 # Configuración Render

├── .github/├── vercel.json                 # Configuración Vercel

│   └── copilot-instructions.md # Instrucciones del proyecto└── README.md

│```

├── render.yaml                 # Configuración Render

├── vercel.json                 # Configuración Vercel---

└── README.md

```## Seguridad



---### Implementaciones de Seguridad



## Base de Datos**Autenticación**

- Tokens JWT con expiración configurable

### Schema Principal- Refresh tokens para sesiones prolongadas

- Hashing de contraseñas con bcrypt (12 rounds)

**Tablas del Sistema:**- Validación de fuerza de contraseña



| Tabla | Descripción | Campos Principales |**Autorización**

|-------|-------------|-------------------|- Control de acceso basado en roles (RBAC)

| `users` | Usuarios del sistema | id, username, email, password_hash, role_id |- Middleware de verificación de permisos

| `roles` | Roles de usuario | id, name (Empleado, Técnico, Admin) |- Protección de endpoints según rol de usuario

| `tickets` | Tickets de soporte | id, ticket_number, title, description, status_id |

| `ticket_comments` | Comentarios | id, ticket_id, user_id, comment, is_internal |**Validación de Datos**

| `ticket_history` | Auditoría de cambios | id, ticket_id, changed_by, field_changed, old_value, new_value |- Sanitización de inputs del usuario

| `categories` | Categorías de tickets | id, name (Hardware, Software, Red, etc.) |- Validación de tipos de datos

| `priorities` | Niveles de prioridad | id, name (Baja, Media, Alta, Crítica) |- Prevención de SQL injection

| `ticket_statuses` | Estados del ticket | id, name (Abierto, En Proceso, Resuelto, Cerrado) |- Prevención de XSS (Cross-Site Scripting)

| `notifications` | Notificaciones | id, user_id, type, message, is_read |

**Comunicación**

### Diagrama de Relaciones- HTTPS enforced en producción

- CORS configurado con whitelist de orígenes

```- Headers de seguridad HTTP

┌─────────────┐      ┌──────────────┐      ┌─────────────┐

│    roles    │──────│    users     │──────│ tickets     │**Base de Datos**

│             │ 1:N  │              │ 1:N  │             │- Consultas parametrizadas (prepared statements)

└─────────────┘      └──────────────┘      └─────────────┘- Índices en campos sensibles

                            │                      │- Backups automáticos diarios (Render)

                            │ 1:N                  │ N:1

                            │                      │### Variables de Entorno Sensibles

                     ┌──────▼────────┐      ┌─────▼──────┐

                     │notifications  │      │categories  │**Backend (.env)**

                     └───────────────┘      └────────────┘```env

                                                   │JWT_SECRET=         # Mínimo 32 caracteres aleatorios

                                                   │ N:1DATABASE_URL=       # Nunca compartir en público

┌─────────────┐      ┌──────────────┐      ┌─────▼──────┐EMAIL_PASSWORD=     # App password de email

│priorities   │──────│   tickets    │      │ statuses   │```

│             │ N:1  │              │      │            │

└─────────────┘      └──────┬───────┘      └────────────┘**Frontend (.env)**

                            │```env

                            │ 1:NVITE_API_BASE_URL=  # URL pública del backend

                     ┌──────▼─────────┐```

                     │ticket_comments │

                     └────────────────┘**Importante:** Los archivos `.env` están en `.gitignore` y nunca se suben al repositorio.

                     ┌────────────────┐

                     │ticket_history  │---

                     └────────────────┘

```## Scripts Disponibles



### Índices y Optimización### Backend



- Primary keys en todas las tablas```bash

- Foreign keys con `ON DELETE CASCADE`npm start          # Iniciar servidor de producción

- Índices en campos de búsqueda frecuentenpm run dev        # Servidor de desarrollo con nodemon

- Timestamps automáticos (`created_at`, `updated_at`)npm run migrate    # Ejecutar migraciones de base de datos

npm run seed       # Cargar datos iniciales

---npm test           # Ejecutar suite de tests

npm run lint       # Ejecutar ESLint

## Seguridad```



### Implementaciones de Seguridad### Frontend



**Autenticación**```bash

- Tokens JWT con expiración configurablenpm run dev        # Servidor de desarrollo (puerto 5173)

- Refresh tokens para sesiones prolongadasnpm run build      # Build de producción (carpeta dist/)

- Hashing de contraseñas con bcrypt (12 rounds)npm run preview    # Preview del build de producción

- Validación de fuerza de contraseñanpm run lint       # Ejecutar ESLint

npm run format     # Formatear código con Prettier

**Autorización**```

- Control de acceso basado en roles (RBAC)

- Middleware de verificación de permisos---

- Protección de endpoints según rol de usuario

## Funcionalidades por Rol

**Validación de Datos**

- Sanitización de inputs del usuario### Empleado (User)

- Validación de tipos de datos

- Prevención de SQL injection**Permisos:**

- Prevención de XSS (Cross-Site Scripting)- Crear tickets de soporte

- Ver y gestionar sus propios tickets

**Comunicación**- Agregar comentarios a sus tickets

- HTTPS enforced en producción- Actualizar su perfil personal

- CORS configurado con whitelist de orígenes- Recibir notificaciones de cambios

- Headers de seguridad HTTP

**Restricciones:**

**Base de Datos**- No puede ver tickets de otros usuarios

- Consultas parametrizadas (prepared statements)- No puede cambiar estados de tickets

- Índices en campos sensibles- No puede acceder al panel de administración

- Backups automáticos diarios (Render)

### Técnico (Technician)

### Variables de Entorno Sensibles

**Permisos:**

**Backend (.env)**- Ver todos los tickets del sistema

```env- Recibir asignaciones automáticas

JWT_SECRET=         # Mínimo 32 caracteres aleatorios- Cambiar estados de tickets asignados

DATABASE_URL=       # Nunca compartir en público- Agregar comentarios públicos e internos

EMAIL_PASSWORD=     # App password de email- Registrar tiempo trabajado

```- Actualizar detalles técnicos



**Frontend (.env)****Restricciones:**

```env- No puede gestionar usuarios

VITE_API_BASE_URL=  # URL pública del backend- No puede acceder a configuración del sistema

```- No puede eliminar tickets



**Importante:** Los archivos `.env` están en `.gitignore` y nunca se suben al repositorio.### Administrador (Admin)



---**Permisos:**

- Acceso completo al sistema

## Scripts Disponibles- CRUD de usuarios y roles

- Asignación manual de tickets

### Backend- Ver reportes y estadísticas

- Configuración del sistema

```bash- Gestión de categorías y prioridades

npm start          # Iniciar servidor de producción- Acceso a logs del sistema

npm run dev        # Servidor de desarrollo con nodemon

npm run migrate    # Ejecutar migraciones de base de datos**Sin restricciones**

npm run seed       # Cargar datos iniciales

npm test           # Ejecutar suite de tests---

npm run lint       # Ejecutar ESLint

```## 🔧 API Endpoints



### Frontend### Autenticación

```

```bashPOST   /api/auth/login           # Iniciar sesión

npm run dev        # Servidor de desarrollo (puerto 5173)POST   /api/auth/logout          # Cerrar sesión

npm run build      # Build de producción (carpeta dist/)GET    /api/auth/profile         # Obtener perfil

npm run preview    # Preview del build de producciónPUT    /api/auth/profile         # Actualizar perfil

npm run lint       # Ejecutar ESLintPOST   /api/auth/change-password # Cambiar contraseña

npm run format     # Formatear código con Prettier```

```

### Usuarios

---```

GET    /api/users               # Listar usuarios

## Funcionalidades por RolPOST   /api/users               # Crear usuario

GET    /api/users/:id           # Obtener usuario

### Empleado (User)PUT    /api/users/:id           # Actualizar usuario

DELETE /api/users/:id           # Eliminar usuario

**Permisos:**GET    /api/users/technicians   # Listar técnicos

- Crear tickets de soporte```

- Ver y gestionar sus propios tickets

- Agregar comentarios a sus tickets### Tickets

- Actualizar su perfil personal```

- Recibir notificaciones de cambiosGET    /api/tickets             # Listar tickets

POST   /api/tickets             # Crear ticket

**Restricciones:**GET    /api/tickets/:id         # Obtener ticket

- No puede ver tickets de otros usuariosPUT    /api/tickets/:id         # Actualizar ticket

- No puede cambiar estados de ticketsPOST   /api/tickets/:id/assign  # Asignar ticket

- No puede acceder al panel de administraciónPATCH  /api/tickets/:id/status  # Cambiar estado

POST   /api/tickets/:id/comments # Agregar comentario

### Técnico (Technician)```



**Permisos:**## 🌟 Próximas Mejoras

- Ver todos los tickets del sistema

- Recibir asignaciones automáticas- [ ] Dashboard con gráficos y métricas

- Cambiar estados de tickets asignados- [ ] Sistema de archivos adjuntos

- Agregar comentarios públicos e internos- [ ] Notificaciones push en tiempo real

- Registrar tiempo trabajado- [ ] App móvil nativa

- Actualizar detalles técnicos- [ ] Integración con WhatsApp

- [ ] Sistema de SLA automático

**Restricciones:**- [ ] Reportes avanzados y analytics

- No puede gestionar usuarios

- No puede acceder a configuración del sistema## 🐛 Solución de Problemas

- No puede eliminar tickets

### Error de Conexión a Base de Datos

### Administrador (Admin)```bash

# Verificar variables de entorno

**Permisos:**echo $DATABASE_URL

- Acceso completo al sistema

- CRUD de usuarios y roles# Probar conexión

- Asignación manual de ticketspsql $DATABASE_URL -c "SELECT version();"

- Ver reportes y estadísticas```

- Configuración del sistema

- Gestión de categorías y prioridades### Error de CORS

- Acceso a logs del sistemaVerificar que `CLIENT_URL` en el backend coincida con el dominio del frontend.



**Sin restricciones**### Error 500 en Render

Revisar logs en el dashboard de Render y verificar variables de entorno.

---

## 📞 Soporte

## Troubleshooting

Para soporte técnico:

### Problemas Comunes- 📧 **Email**: soporte@farmashaio.com

- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/sgts-farmashaio/issues)

#### 1. Error de Conexión a Base de Datos- 📖 **Wiki**: [Documentación completa](https://github.com/tu-usuario/sgts-farmashaio/wiki)



**Síntoma:** `Error: connect ECONNREFUSED` o `Database connection failed`## 📄 Licencia



**Solución:**Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```bash

# Verificar que PostgreSQL está corriendo---

pg_isready

**Desarrollado con ❤️ para FARMASHAIO**  

# Verificar variables de entorno*Sistema de Gestión de Tickets de Soporte TI v1.0.0*#   B u i l d :   0 9 / 2 9 / 2 0 2 5   2 3 : 5 9 : 4 9 

echo $DATABASE_URL 

 
# Probar conexión manual
psql $DATABASE_URL -c "SELECT version();"
```

#### 2. Error de CORS

**Síntoma:** `Access to fetch blocked by CORS policy`

**Solución:**
- Verificar que `CORS_ORIGINS` en backend incluye la URL del frontend
- En desarrollo: `http://localhost:5173`
- En producción: `https://sgts-farmashaio.vercel.app`

#### 3. Token JWT Inválido

**Síntoma:** `401 Unauthorized` en todas las peticiones

**Solución:**
```javascript
// Limpiar localStorage en el navegador
localStorage.clear();

// Verificar que JWT_SECRET es el mismo en todos los ambientes
```

#### 4. Error 500 en Render

**Síntoma:** Backend no responde después del deploy

**Solución:**
1. Revisar logs: Dashboard → Logs
2. Verificar variables de entorno configuradas
3. Confirmar que `DATABASE_URL` está conectado
4. Verificar que el puerto es `10000` o `process.env.PORT`

#### 5. Build Fallido en Vercel

**Síntoma:** `Build failed` durante el deploy

**Solución:**
```bash
# Verificar build localmente
cd frontend
npm run build

# Revisar que todas las dependencias están en package.json
npm install

# Verificar que VITE_API_BASE_URL está configurado
```

### Logs y Debugging

**Backend Logs (Render):**
```bash
# Ver logs en tiempo real
Dashboard → Service → Logs → Live Logs
```

**Frontend Logs (Vercel):**
```bash
# Ver logs de build
Dashboard → Project → Deployments → [Select Deployment] → Logs
```

**Base de Datos (Render):**
```bash
# Conectarse vía PSQL
psql [Internal Database URL]

# Ver tablas
\dt

# Ver usuarios
SELECT * FROM users;
```

---

## Roadmap

### Version 1.1 (Q1 2026)
- [ ] Dashboard con gráficos interactivos (Chart.js)
- [ ] Sistema de archivos adjuntos (AWS S3 / Cloudinary)
- [ ] Filtros avanzados de búsqueda
- [ ] Exportación de reportes (PDF, Excel)

### Version 1.2 (Q2 2026)
- [ ] Notificaciones push en tiempo real (WebSockets)
- [ ] Sistema de SLA automático con alertas
- [ ] Integración con Microsoft Teams
- [ ] API pública con documentación Swagger

### Version 2.0 (Q3 2026)
- [ ] App móvil nativa (React Native)
- [ ] Integración con WhatsApp Business
- [ ] Sistema de conocimiento base (FAQ)
- [ ] Analytics avanzados con BI

---

## Contribución

### Cómo Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Convenciones de Código

**Commits (Conventional Commits):**
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, espacios, etc
refactor: refactorización de código
test: agregar o actualizar tests
chore: tareas de mantenimiento
```

**Código:**
- ESLint configurado para JavaScript/React
- Prettier para formato consistente
- 2 espacios de indentación
- Nombres descriptivos para variables y funciones

---

## Licencia

Este proyecto está licenciado bajo la **MIT License**.

```
MIT License

Copyright (c) 2025 FARMASHAIO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Contacto

**FARMASHAIO - Departamento de TI**

- **Website:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)
- **Repository:** [https://github.com/Julian-Enable/sgts-farmashaio](https://github.com/Julian-Enable/sgts-farmashaio)
- **Issues:** [GitHub Issues](https://github.com/Julian-Enable/sgts-farmashaio/issues)

---

<div align="center">

**SGTS FARMASHAIO v1.0.0**

Sistema de Gestión de Tickets de Soporte TI

Desarrollado por **Julian Merchán**

*Built with React, Node.js & PostgreSQL*

</div>
