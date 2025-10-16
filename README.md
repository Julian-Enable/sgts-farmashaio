# SGTS FARMASHAIO# SGTS FARMASHAIO# SGTS FARMASHAIO# SGTS FARMASHAIO



## Sistema de Gestión de Tickets de Soporte TI



[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)## Sistema de Gestión de Tickets de Soporte TI

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

[![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)]()[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=flat-square)](https://github.com/Julian-Enable/sgts-farmashaio/releases)### Sistema de Gestión de Tickets de Soporte TI### Sistema de Gestión de Tickets de Soporte TI



Sistema empresarial de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas con autenticación JWT, gestión de roles y notificaciones en tiempo real.[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)



**Aplicación:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)



---[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)



## Descripción[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=flat-square)](https://github.com/Julian-Enable/sgts-farmashaio/releases)[![GitHub release](https://img.shields.io/github/v/release/Julian-Enable/sgts-farmashaio?style=flat-square)](https://github.com/Julian-Enable/sgts-farmashaio/releases)



SGTS FARMASHAIO es una solución integral para la gestión de tickets de soporte técnico interno, diseñada específicamente para optimizar la comunicación entre empleados y el departamento de TI de FARMASHAIO.



### Características PrincipalesSistema integral de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas completamente desacoplada con autenticación JWT, gestión de roles y notificaciones en tiempo real.[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)



**Gestión de Tickets**

- Sistema de ticketing con numeración automática

- Categorización y priorización de solicitudes**Production:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

- Estados configurables del ciclo de vida

- Asignación inteligente a técnicos**API:** [https://sgts-farmashaio-api.onrender.com](https://sgts-farmashaio-api.onrender.com)

- Historial completo de cambios con auditoría

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

**Control de Acceso**

- Autenticación segura con JWT---

- Tres niveles de usuario: Empleado, Técnico, Administrador

- Protección de rutas basada en roles[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

- Sesiones persistentes

## Tabla de Contenidos

**Sistema de Comunicación**

- Comentarios públicos e internos

- Notificaciones automáticas por email

- Notificaciones en tiempo real en la aplicación- [Arquitectura del Sistema](#arquitectura-del-sistema)

- Historial de interacciones

- [Características Principales](#características-principales)Sistema integral de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas completamente desacoplada con autenticación JWT, gestión de roles y notificaciones en tiempo real.Sistema integral de gestión de tickets de soporte técnico para FARMASHAIO. Arquitectura de 3 capas completamente desacoplada con autenticación JWT, gestión de roles y notificaciones en tiempo real.

**Panel de Administración**

- Gestión completa de usuarios- [Tecnologías Utilizadas](#tecnologías-utilizadas)

- Reportes y estadísticas

- Configuración de categorías y prioridades- [Instalación Local](#instalación-local)

- Monitoreo del sistema

- [Deployment en Producción](#deployment-en-producción)

---

- [API Reference](#api-reference)**Production:** [https://sgts-farmashaio-3pj5.vercel.app/](https://sgts-farmashaio-3pj5.vercel.app/)  **Production:** [https://sgts-farmashaio-3pj5.vercel.app/](https://sgts-farmashaio-3pj5.vercel.app/)  

## Arquitectura Técnica

- [Estructura del Proyecto](#estructura-del-proyecto)

### Stack Tecnológico

- [Base de Datos](#base-de-datos)**API:** [https://sgts-farmashaio-api.onrender.com](https://sgts-farmashaio-api.onrender.com)**API:** [https://sgts-farmashaio-api.onrender.com](https://sgts-farmashaio-api.onrender.com)

| Capa | Tecnología | Versión |

|------|-----------|---------|- [Seguridad](#seguridad)

| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 |

| **Backend** | Node.js + Express | 18.x / 4.18 |- [Troubleshooting](#troubleshooting)

| **Database** | PostgreSQL | 14.x |

| **Auth** | JWT + bcrypt | - |- [Roadmap](#roadmap)

| **Email** | NodeMailer | 6.9 |

- [Licencia](#licencia)------

### Diagrama de Arquitectura



```

┌─────────────────────────────────────────────────┐---

│          PRESENTATION LAYER                     │

│  React 18 + Material-UI + Vite                 │

│  Vercel Edge Network                           │

└──────────────────┬──────────────────────────────┘## Arquitectura del Sistema## Tabla de Contenidos## Tabla de Contenidos

                   │ REST API (HTTPS)

┌──────────────────▼──────────────────────────────┐

│          APPLICATION LAYER                      │

│  Node.js + Express.js                          │### Stack Completo

│  Render Cloud Platform                         │

└──────────────────┬──────────────────────────────┘

                   │ SQL Queries

┌──────────────────▼──────────────────────────────┐| Capa | Tecnología | Versión | Hosting |- [Arquitectura del Sistema](#arquitectura-del-sistema)- [Arquitectura del Sistema](#arquitectura-del-sistema)

│          DATA LAYER                             │

│  PostgreSQL 14.x                               │|------|-----------|---------|---------|

│  Render Managed Database                       │

└─────────────────────────────────────────────────┘| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 | Vercel |- [Características Principales](#características-principales)- [Características Principales](#características-principales)

```

| **Backend** | Node.js + Express | 18.x / 4.18 | Render |

---

| **Database** | PostgreSQL | 14.x | Render |- [Tecnologías Utilizadas](#tecnologías-utilizadas)- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Seguridad

| **Auth** | JWT + bcrypt | - | - |

### Medidas Implementadas

| **Email** | NodeMailer | 6.9 | - |- [Instalación Local](#instalación-local)- [Instalación Local](#instalación-local)

**Autenticación y Autorización**

- Tokens JWT con expiración configurable

- Contraseñas hasheadas con bcrypt (12 rounds)

- Control de acceso basado en roles (RBAC)### Arquitectura de 3 Capas- [Deployment en Producción](#deployment-en-producción)- [Deployment en Producción](#deployment-en-producción)

- Protección de rutas en frontend y backend



**Protección de Datos**

- Validación y sanitización de inputs```- [API Reference](#api-reference)- [API Reference](#api-reference)

- Prevención de SQL injection mediante consultas parametrizadas

- Prevención de XSS (Cross-Site Scripting)┌─────────────────────────────────────────────────────────────┐

- CORS configurado con whitelist de orígenes

│                    PRESENTATION LAYER                        │- [Estructura del Proyecto](#estructura-del-proyecto)- [Estructura del Proyecto](#estructura-del-proyecto)

**Comunicación Segura**

- HTTPS enforced en producción│  React 18 + Material-UI + Vite                              │

- Headers de seguridad HTTP

- Encriptación de datos en tránsito│  https://sgts-farmashaio-3pj5.vercel.app/                         │- [Base de Datos](#base-de-datos)- [Seguridad](#seguridad)



**Base de Datos**└──────────────────────┬──────────────────────────────────────┘

- Backups automáticos diarios

- Índices optimizados para performance                       │ REST API (HTTPS)- [Seguridad](#seguridad)- [Licencia](#licencia)

- Foreign keys con integridad referencial

┌──────────────────────▼──────────────────────────────────────┐

---

│                    APPLICATION LAYER                         │- [Troubleshooting](#troubleshooting)

## Estructura del Sistema

│  Node.js + Express.js                                       │

### Base de Datos

│  https://sgts-farmashaio-api.onrender.com                  │- [Roadmap](#roadmap)---

**Tablas Principales:**

└──────────────────────┬──────────────────────────────────────┘

| Tabla | Función |

|-------|---------|                       │ SQL Queries- [Licencia](#licencia)

| `users` | Usuarios del sistema con roles |

| `tickets` | Tickets de soporte con estados |┌──────────────────────▼──────────────────────────────────────┐

| `ticket_comments` | Comunicación en tickets |

| `ticket_history` | Auditoría de cambios |│                    DATA LAYER                                │## Arquitectura del Sistema

| `categories` | Categorías de tickets |

| `priorities` | Niveles de prioridad |│  PostgreSQL 14.x                                            │

| `ticket_statuses` | Estados del workflow |

| `notifications` | Notificaciones del usuario |│  Render Managed Database                                    │---



### API Endpoints└─────────────────────────────────────────────────────────────┘



**Autenticación**```### Stack Completo

```

POST   /api/auth/login              # Login de usuario

GET    /api/auth/profile            # Perfil actual

POST   /api/auth/change-password    # Cambio de contraseña---## Arquitectura del Sistema

```



**Gestión de Tickets**

```## Características Principales| Capa | Tecnología | Versión | Hosting |

GET    /api/tickets                 # Listar tickets

POST   /api/tickets                 # Crear ticket

GET    /api/tickets/:id             # Detalle de ticket

PUT    /api/tickets/:id             # Actualizar ticket### Autenticación y Autorización### Stack Completo|------|-----------|---------|---------|

POST   /api/tickets/:id/assign      # Asignar técnico

POST   /api/tickets/:id/comments    # Agregar comentario- Login seguro con JWT (JSON Web Tokens)

```

- Hash de contraseñas con bcrypt (12 rounds)| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 | Vercel |

**Administración** (Solo Admin)

```- Gestión de roles: **Empleado**, **Técnico**, **Administrador**

GET    /api/users                   # Listar usuarios

POST   /api/users                   # Crear usuario- Protección de rutas basada en roles| Capa | Tecnología | Versión | Hosting || **Backend** | Node.js + Express | 18.x / 4.18 | Render |

PUT    /api/users/:id               # Actualizar usuario

DELETE /api/users/:id               # Eliminar usuario- Sesiones persistentes con refresh tokens

```

|------|-----------|---------|---------|| **Database** | PostgreSQL | 14.x | Render |

---

### Gestión de Tickets

## Roles y Permisos

- Creación y asignación automática de números de ticket| **Frontend** | React + Vite + Material-UI | 18.2 / 4.4 / 5.14 | Vercel || **Auth** | JWT + bcrypt | - | - |

### Empleado

- Sistema de categorías configurables

**Capacidades:**

- Crear nuevos tickets de soporte- Niveles de prioridad (Baja, Media, Alta, Crítica)| **Backend** | Node.js + Express | 18.x / 4.18 | Render || **Email** | NodeMailer | 6.9 | - |

- Ver y gestionar sus propios tickets

- Agregar comentarios a sus tickets- Estados personalizables del ciclo de vida

- Recibir notificaciones de actualizaciones

- Asignación inteligente a técnicos| **Database** | PostgreSQL | 14.x | Render |

**Limitaciones:**

- No puede ver tickets de otros empleados- Sistema de comentarios públicos e internos

- No puede cambiar estados de tickets

- Sin acceso a panel de administración- Historial completo de cambios con auditoría| **Auth** | JWT + bcrypt | - | - |### Arquitectura de 3 Capas



### Técnico



**Capacidades:**### Gestión de Usuarios| **Email** | NodeMailer | 6.9 | - |

- Ver todos los tickets del sistema

- Recibir asignaciones automáticas- CRUD completo de usuarios (Solo administradores)

- Cambiar estados de tickets asignados

- Agregar comentarios públicos e internos- Gestión avanzada de roles y permisos```

- Registrar tiempo y soluciones

- Activación y desactivación de cuentas

**Limitaciones:**

- No puede gestionar usuarios- Perfiles personalizables### Arquitectura de 3 Capas┌─────────────────────────────────────────────────────────────┐

- No puede eliminar tickets

- Sin acceso a configuración global- Cambio de contraseña con validación



### Administrador│                    PRESENTATION LAYER                        │



**Capacidades:**### Sistema de Notificaciones

- Acceso completo al sistema

- Gestión de usuarios y roles- Notificaciones automáticas por email```│  React 18 + Material-UI + Vite                              │

- Asignación manual de tickets

- Configuración de categorías y prioridades- Notificaciones en tiempo real en la aplicación

- Acceso a reportes y estadísticas

- Configuración del sistema- Plantillas de email HTML profesionales┌─────────────────────────────────────────────────────────────┐│  https://sgts-farmashaio.vercel.app                         │



**Sin restricciones**- Configuración de preferencias de notificación



---- Historial de notificaciones enviadas│                    PRESENTATION LAYER                        │└──────────────────────┬──────────────────────────────────────┘



## Componentes del Frontend



### Páginas Principales---│  React 18 + Material-UI + Vite                              │                       │ REST API (HTTPS)



- **Dashboard** - Vista general con estadísticas

- **Tickets** - Lista y filtrado de tickets

- **Detalle de Ticket** - Información completa y comentarios## Tecnologías Utilizadas│  https://sgts-farmashaio.vercel.app                         │┌──────────────────────▼──────────────────────────────────────┐

- **Crear Ticket** - Formulario de nueva solicitud

- **Usuarios** - Gestión de usuarios (Admin)

- **Notificaciones** - Centro de notificaciones

- **Perfil** - Configuración del usuario### Frontend└──────────────────────┬──────────────────────────────────────┘│                    APPLICATION LAYER                         │



### Tecnologías Frontend- **React 18.2** - Librería UI con hooks



- **React 18.2** - Hooks y Context API- **Vite 4.4** - Build tool de última generación                       │ REST API (HTTPS)│  Node.js + Express.js                                       │

- **Material-UI 5.14** - Design system

- **React Router 6** - Navegación SPA- **Material-UI 5.14** - Componentes UI

- **Axios** - Cliente HTTP

- **Vite** - Build tool optimizado- **React Router 6** - Navegación SPA┌──────────────────────▼──────────────────────────────────────┐│  https://sgts-farmashaio-api.onrender.com                  │



---- **Axios** - Cliente HTTP



## Información Técnica- **Context API** - State management│                    APPLICATION LAYER                         │└──────────────────────┬──────────────────────────────────────┘



### Performance



- **Frontend:** Edge deployment en Vercel### Backend│  Node.js + Express.js                                       │                       │ SQL Queries

- **Backend:** Auto-scaling en Render

- **Database:** Connection pooling optimizado- **Node.js 18.x** - Runtime JavaScript

- **Cache:** Estrategias de cache en múltiples capas

- **Express 4.18** - Framework web│  https://sgts-farmashaio-api.onrender.com                  │┌──────────────────────▼──────────────────────────────────────┐

### Monitoreo

- **PostgreSQL 14.x** - Base de datos relacional

- Logs centralizados en Render

- Error tracking en tiempo real- **JWT** - Autenticación stateless└──────────────────────┬──────────────────────────────────────┘│                    DATA LAYER                                │

- Métricas de performance

- Uptime monitoring- **bcrypt** - Hash de contraseñas



### Mantenimiento- **NodeMailer** - Envío de emails                       │ SQL Queries│  PostgreSQL 14.x                                            │



- Auto-deploy desde GitHub- **Winston** - Logging system

- Backups diarios automáticos

- Migraciones de base de datos versionadas┌──────────────────────▼──────────────────────────────────────┐│  Render Managed Database                                    │

- Pruebas automatizadas

### DevOps & Deployment

---

- **Git & GitHub** - Control de versiones│                    DATA LAYER                                │└─────────────────────────────────────────────────────────────┘

## Soporte y Contacto

- **Vercel** - Hosting frontend

**Departamento de TI - FARMASHAIO**

- **Render** - Hosting backend y database│  PostgreSQL 14.x                                            │```

Para soporte técnico o consultas sobre el sistema, contactar al departamento de TI interno.

- **ESLint** - Linter JavaScript

**Repositorio:** [https://github.com/Julian-Enable/sgts-farmashaio](https://github.com/Julian-Enable/sgts-farmashaio)

- **Prettier** - Code formatter│  Render Managed Database                                    │

---



## Tecnologías y Herramientas

---└─────────────────────────────────────────────────────────────┘---

**Lenguajes:**

- JavaScript (ES6+)

- SQL (PostgreSQL)

- HTML5 / CSS3## Instalación Local```



**Frameworks y Librerías:**

- React 18

- Express.js### Prerrequisitos## Características Principales

- Material-UI



**Base de Datos:**

- PostgreSQL 14.x```bash---

- Migrations con scripts SQL

node --version  # >= 18.0.0

**DevOps:**

- Git & GitHubnpm --version   # >= 9.0.0### Autenticación y Autorización

- Vercel (Frontend hosting)

- Render (Backend & Database hosting)psql --version  # >= 12.0

- ESLint + Prettier (Code quality)

```## Características Principales- Login seguro con JWT (JSON Web Tokens)

**Seguridad:**

- JWT (JSON Web Tokens)

- bcrypt (Password hashing)

- Helmet.js (HTTP headers)### 1. Clonar Repositorio- Hash de contraseñas con bcrypt (12 rounds)

- CORS configuration



---

```bash### Autenticación y Autorización- Gestión de roles: **Empleado**, **Técnico**, **Administrador**

## Licencia

git clone https://github.com/Julian-Enable/sgts-farmashaio.git

MIT License - Copyright (c) 2025 FARMASHAIO

cd sgts-farmashaio- Login seguro con JWT (JSON Web Tokens)- Protección de rutas basada en roles

---

```

<div align="center">

- Hash de contraseñas con bcrypt (12 rounds)- Sesiones persistentes con refresh tokens

**SGTS FARMASHAIO v1.0.0**

### 2. Configurar Base de Datos

Sistema de Gestión de Tickets de Soporte TI

- Gestión de roles: **Empleado**, **Técnico**, **Administrador**

Desarrollado por **Julian Merchán**

```bash

*Enterprise Solution - Built with React, Node.js & PostgreSQL*

# Crear base de datos PostgreSQL- Protección de rutas basada en roles### Gestión de Tickets

</div>

createdb sgts_farmashaio

- Sesiones persistentes con refresh tokens- Creación y asignación automática de números de ticket

# Ejecutar schema

psql sgts_farmashaio < database/schema.sql- Sistema de categorías configurables



# Cargar datos iniciales### Gestión de Tickets- Niveles de prioridad (Baja, Media, Alta, Crítica)

psql sgts_farmashaio < database/seed.sql

```- Creación y asignación automática de números de ticket- Estados personalizables del ciclo de vida



### 3. Configurar Backend- Sistema de categorías configurables- Asignación inteligente a técnicos



```bash- Niveles de prioridad (Baja, Media, Alta, Crítica)- Sistema de comentarios públicos e internos

cd backend

npm install- Estados personalizables del ciclo de vida- Historial completo de cambios con auditoría



# Crear archivo .env- Asignación inteligente a técnicos

cat > .env << EOF

NODE_ENV=development- Sistema de comentarios públicos e internos### Gestión de Usuarios

PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/sgts_farmashaio- Historial completo de cambios con auditoría- CRUD completo de usuarios (Solo administradores)

JWT_SECRET=your-secret-key-min-32-characters

CORS_ORIGINS=http://localhost:5173- Gestión avanzada de roles y permisos

EOF

### Gestión de Usuarios- Activación y desactivación de cuentas

# Iniciar servidor de desarrollo

npm run dev- CRUD completo de usuarios (Solo administradores)- Perfiles personalizables

```

- Gestión avanzada de roles y permisos- Cambio de contraseña con validación

El servidor estará disponible en `http://localhost:5000`

- Activación y desactivación de cuentas

### 4. Configurar Frontend

- Perfiles personalizables### Sistema de Notificaciones

```bash

cd frontend- Cambio de contraseña con validación- Notificaciones automáticas por email

npm install

- Notificaciones en tiempo real en la aplicación

# Crear archivo .env

cat > .env << EOF### Sistema de Notificaciones- Plantillas de email HTML profesionales

VITE_API_BASE_URL=http://localhost:5000/api

EOF- Notificaciones automáticas por email- Configuración de preferencias de notificación



# Iniciar servidor de desarrollo- Notificaciones en tiempo real en la aplicación- Historial de notificaciones enviadas

npm run dev

```- Plantillas de email HTML profesionales



El frontend estará disponible en `http://localhost:5173`- Configuración de preferencias de notificación---



### 5. Credenciales de Prueba- Historial de notificaciones enviadas



| Rol | Email | Contraseña | Descripción |## Tecnologías Utilizadas

|-----|-------|-----------|-------------|

| **Admin** | admin@farmashaio.com | admin123 | Acceso completo al sistema |---

| **Técnico** | tecnico1@farmashaio.com | tecnico123 | Gestión de tickets |

| **Empleado** | empleado1@farmashaio.com | empleado123 | Creación de tickets |### Frontend



---## Tecnologías Utilizadas- **React 18.2** - Librería UI con hooks



## Deployment en Producción- **Vite 4.4** - Build tool de última generación



### Stack de Hosting Gratuito### Frontend- **Material-UI 5.14** - Componentes UI



| Servicio | Proveedor | Plan | Recursos |- **React 18.2** - Librería UI con hooks- **React Router 6** - Navegación SPA

|----------|-----------|------|----------|

| **Database** | Render | Free | 0.1 CPU, 256 MB RAM |- **Vite 4.4** - Build tool de última generación- **Axios** - Cliente HTTP

| **Backend API** | Render | Free | 0.1 CPU, 512 MB RAM |

| **Frontend** | Vercel | Free | Edge Network Global |- **Material-UI 5.14** - Componentes UI- **Context API** - State management



**Costo total:** $0/mes- **React Router 6** - Navegación SPA



### Guía de Deployment- **Axios** - Cliente HTTP### Backend



#### 1. Preparar Repositorio- **Context API** - State management- **Node.js 18.x** - Runtime JavaScript



```bash- **Express 4.18** - Framework web

# Verificar que todo está commiteado

git status### Backend- **PostgreSQL 14.x** - Base de datos relacional



# Push a GitHub- **Node.js 18.x** - Runtime JavaScript- **JWT** - Autenticación stateless

git push origin main

```- **Express 4.18** - Framework web- **bcrypt** - Hash de contraseñas



#### 2. PostgreSQL Database en Render- **PostgreSQL 14.x** - Base de datos relacional- **NodeMailer** - Envío de emails



**a) Crear cuenta y conectar GitHub**- **JWT** - Autenticación stateless- **Winston** - Logging system

- Visitar [render.com](https://render.com)

- Sign up with GitHub- **bcrypt** - Hash de contraseñas

- Autorizar acceso al repositorio

- **NodeMailer** - Envío de emails### DevOps & Deployment

**b) Crear PostgreSQL Database**

```- **Winston** - Logging system- **Git & GitHub** - Control de versiones

Dashboard → New → PostgreSQL

Name: sgts-farmashaio-db- **Vercel** - Hosting frontend

Database: sgts_farmashaio

User: sgts_user### DevOps & Deployment- **Render** - Hosting backend y database

Region: Oregon (US West)

Plan: Free- **Git & GitHub** - Control de versiones- **ESLint** - Linter JavaScript

```

- **Vercel** - Hosting frontend- **Prettier** - Code formatter

**c) Ejecutar Schema**

- Copiar contenido de `database/schema.sql`- **Render** - Hosting backend y database

- Dashboard → Connect → PSQL Command

- Pegar y ejecutar- **ESLint** - Linter JavaScript---

- Repetir con `database/seed.sql`

- **Prettier** - Code formatter

**d) Guardar DATABASE_URL**

```## Instalación Local

Internal Database URL: postgresql://sgts_user:****@****/sgts_farmashaio

```---



#### 3. Backend API en Render### Prerrequisitos



**a) Crear Web Service**## Instalación Local

```

Dashboard → New → Web Service```bash

Repository: Julian-Enable/sgts-farmashaio

Name: sgts-farmashaio-api### Prerrequisitosnode --version  # >= 18.0.0

Region: Oregon (US West)

Branch: mainnpm --version   # >= 9.0.0

Root Directory: backend

Runtime: Node```bashpsql --version  # >= 12.0

Build Command: npm install

Start Command: npm startnode --version  # >= 18.0.0```

Plan: Free

```npm --version   # >= 9.0.0



**b) Configurar Variables de Entorno**psql --version  # >= 12.0### 1. Clonar Repositorio

```env

NODE_ENV=production```

DATABASE_URL=<Copiar Internal Database URL>

JWT_SECRET=<Generar string aleatorio de 32+ caracteres>```bash

CORS_ORIGINS=https://sgts-farmashaio-3pj5.vercel.app/

PORT=10000### 1. Clonar Repositoriogit clone https://github.com/Julian-Enable/sgts-farmashaio.git

```

cd sgts-farmashaio

**c) Conectar Database**

- En el Web Service: Environment → Add Environment Group```bash```

- Seleccionar la base de datos creada

git clone https://github.com/Julian-Enable/sgts-farmashaio.git

**d) Deploy**

- Click "Create Web Service"cd sgts-farmashaio### 2. Configurar Base de Datos

- Esperar ~5 minutos para el primer deploy

- Verificar: `https://sgts-farmashaio-api.onrender.com/health````



#### 4. Frontend en Vercel```bash



**a) Importar Proyecto**### 2. Configurar Base de Datos# Crear base de datos PostgreSQL

```

Dashboard → Add New → Projectcreatedb sgts_farmashaio

Import Git Repository: Julian-Enable/sgts-farmashaio

Framework Preset: Vite```bash

Root Directory: frontend

Build Command: npm run build# Crear base de datos PostgreSQL# Ejecutar schema

Output Directory: dist

Install Command: npm installcreatedb sgts_farmashaiopsql sgts_farmashaio < database/schema.sql

```



**b) Configurar Variables de Entorno**

```env# Ejecutar schema# Cargar datos iniciales

VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api

```psql sgts_farmashaio < database/schema.sqlpsql sgts_farmashaio < database/seed.sql



**c) Deploy**```

- Click "Deploy"

- Esperar ~2 minutos# Cargar datos iniciales

- Verificar: `https://sgts-farmashaio-3pj5.vercel.app/`

psql sgts_farmashaio < database/seed.sql### 3. Configurar Backend

#### 5. Verificación Post-Deployment

```

**Checklist de Validación:**

```bash

- [ ] Database responde correctamente

  ```bash### 3. Configurar Backendcd backend

  psql <DATABASE_URL> -c "SELECT COUNT(*) FROM users;"

  ```npm install



- [ ] Backend API funcional```bash

  ```bash

  curl https://sgts-farmashaio-api.onrender.com/healthcd backend# Crear archivo .env

  # Expected: {"status": "ok"}

  ```npm installcat > .env << EOF



- [ ] Frontend accesibleNODE_ENV=development

  - Abrir `https://sgts-farmashaio-3pj5.vercel.app/`

  - Verificar que carga sin errores# Crear archivo .envPORT=5000



- [ ] Login funcionalcat > .env << EOFDATABASE_URL=postgresql://postgres:password@localhost:5432/sgts_farmashaio

  - Email: `admin@farmashaio.com`

  - Password: `admin123`NODE_ENV=developmentJWT_SECRET=your-secret-key-min-32-characters

  - Verificar acceso al dashboard

PORT=5000CORS_ORIGINS=http://localhost:5173

- [ ] CORS configurado

  - Verificar que las llamadas API funcionanDATABASE_URL=postgresql://postgres:password@localhost:5432/sgts_farmashaioEOF

  - Revisar Network tab (sin errores CORS)

JWT_SECRET=your-secret-key-min-32-characters

### Actualización Continua

CORS_ORIGINS=http://localhost:5173# Iniciar servidor de desarrollo

Ambos servicios están configurados con **auto-deploy**:

EOFnpm run dev

```bash

git add .```

git commit -m "feat: nueva funcionalidad"

git push origin main# Iniciar servidor de desarrollo

```

npm run devEl servidor estará disponible en `http://localhost:5000`

- **Vercel**: Deploy automático en ~2 minutos

- **Render**: Deploy automático en ~5 minutos```



---### 4. Configurar Frontend



## API ReferenceEl servidor estará disponible en `http://localhost:5000`



### Base URL```bash

```

Development: http://localhost:5000/api### 4. Configurar Frontendcd frontend

Production:  https://sgts-farmashaio-api.onrender.com/api

```npm install



### Autenticación```bash



Todos los endpoints (excepto `/auth/login`) requieren token JWT en el header:cd frontend# Crear archivo .env

```http

Authorization: Bearer <token>npm installcat > .env << EOF

```

VITE_API_BASE_URL=http://localhost:5000/api

#### Endpoints de Autenticación

# Crear archivo .envEOF

```http

POST   /api/auth/logincat > .env << EOF

POST   /api/auth/logout

GET    /api/auth/profileVITE_API_BASE_URL=http://localhost:5000/api# Iniciar servidor de desarrollo

PUT    /api/auth/profile

POST   /api/auth/change-passwordEOFnpm run dev

```

```

**Ejemplo: Login**

```bash# Iniciar servidor de desarrollo

curl -X POST https://sgts-farmashaio-api.onrender.com/api/auth/login \

  -H "Content-Type: application/json" \npm run devEl frontend estará disponible en `http://localhost:5173`

  -d '{"email": "admin@farmashaio.com", "password": "admin123"}'

``````



### Gestión de Usuarios### 5. Credenciales de Prueba



```httpEl frontend estará disponible en `http://localhost:5173`

GET    /api/users              # Listar todos los usuarios

POST   /api/users              # Crear nuevo usuario| Rol | Email | Contraseña | Descripción |

GET    /api/users/:id          # Obtener usuario específico

PUT    /api/users/:id          # Actualizar usuario### 5. Credenciales de Prueba|-----|-------|-----------|-------------|

DELETE /api/users/:id          # Eliminar usuario

GET    /api/users/technicians  # Listar solo técnicos| **Admin** | `admin@farmashaio.com` | `admin123` | Acceso completo al sistema |

```

| Rol | Email | Contraseña | Descripción || **Técnico** | `tecnico1@farmashaio.com` | `tecnico123` | Gestión de tickets |

### Gestión de Tickets

|-----|-------|-----------|-------------|| **Empleado** | `empleado1@farmashaio.com` | `empleado123` | Creación de tickets |

```http

GET    /api/tickets                  # Listar tickets (con filtros)| **Admin** | `admin@farmashaio.com` | `admin123` | Acceso completo al sistema |

POST   /api/tickets                  # Crear nuevo ticket

GET    /api/tickets/:id              # Obtener ticket específico| **Técnico** | `tecnico1@farmashaio.com` | `tecnico123` | Gestión de tickets |---

PUT    /api/tickets/:id              # Actualizar ticket

DELETE /api/tickets/:id              # Eliminar ticket| **Empleado** | `empleado1@farmashaio.com` | `empleado123` | Creación de tickets |

POST   /api/tickets/:id/assign       # Asignar técnico

PATCH  /api/tickets/:id/status       # Cambiar estado## Deployment en Producción

POST   /api/tickets/:id/comments     # Agregar comentario

GET    /api/tickets/:id/history      # Obtener historial---

```

### Stack de Hosting Gratuito

**Ejemplo: Crear Ticket**

```bash## Deployment en Producción

curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \

  -H "Authorization: Bearer <token>" \| Servicio | Proveedor | Plan | Recursos |

  -H "Content-Type: application/json" \

  -d '{### Stack de Hosting Gratuito|----------|-----------|------|----------|

    "title": "Error en sistema de inventario",

    "description": "El sistema no permite actualizar existencias",| **Database** | Render | Free | 0.1 CPU, 256 MB RAM |

    "category_id": 1,

    "priority_id": 3| Servicio | Proveedor | Plan | Recursos || **Backend API** | Render | Free | 0.1 CPU, 512 MB RAM |

  }'

```|----------|-----------|------|----------|| **Frontend** | Vercel | Free | Edge Network Global |



### Notificaciones| **Database** | Render | Free | 0.1 CPU, 256 MB RAM |



```http| **Backend API** | Render | Free | 0.1 CPU, 512 MB RAM |**Costo total:** $0/mes

GET    /api/notifications           # Listar notificaciones del usuario

PUT    /api/notifications/:id/read  # Marcar como leída| **Frontend** | Vercel | Free | Edge Network Global |

DELETE /api/notifications/:id       # Eliminar notificación

```### Guía de Deployment



### Catálogos**Costo total:** $0/mes



```http#### 1. Preparar Repositorio

GET    /api/categories              # Listar categorías

GET    /api/priorities              # Listar prioridades### Guía de Deployment

GET    /api/statuses                # Listar estados

``````bash



### Códigos de Respuesta#### 1. Preparar Repositorio# Verificar que todo está commiteado



| Código | Descripción |git status

|--------|-------------|

| `200` | OK - Solicitud exitosa |```bash

| `201` | Created - Recurso creado |

| `400` | Bad Request - Datos inválidos |# Verificar que todo está commiteado# Push a GitHub

| `401` | Unauthorized - Token inválido o faltante |

| `403` | Forbidden - Sin permisos |git statusgit push origin main

| `404` | Not Found - Recurso no encontrado |

| `500` | Internal Server Error - Error del servidor |```



---# Push a GitHub



## Estructura del Proyectogit push origin main#### 2. PostgreSQL Database en Render



``````

sgts-farmashaio/

├── frontend/**a) Crear cuenta y conectar GitHub**

│   ├── src/

│   │   ├── assets/              # Imágenes y recursos estáticos#### 2. PostgreSQL Database en Render- Visitar [render.com](https://render.com)

│   │   ├── components/          # Componentes reutilizables

│   │   │   ├── auth/           # Componentes de autenticación- Sign up with GitHub

│   │   │   ├── common/         # Componentes compartidos

│   │   │   ├── tickets/        # Componentes de tickets**a) Crear cuenta y conectar GitHub**- Autorizar acceso al repositorio

│   │   │   └── users/          # Componentes de usuarios

│   │   ├── contexts/            # Context API (AuthContext)- Visitar [render.com](https://render.com)

│   │   ├── pages/              # Páginas de la aplicación

│   │   ├── services/           # Servicios API (axios)- Sign up with GitHub**b) Crear PostgreSQL Database**

│   │   ├── theme/              # Configuración Material-UI

│   │   ├── utils/              # Funciones de utilidad- Autorizar acceso al repositorio```

│   │   ├── App.jsx             # Componente raíz

│   │   └── main.jsx            # Entry pointDashboard → New → PostgreSQL

│   ├── public/                 # Archivos públicos

│   ├── index.html              # HTML template**b) Crear PostgreSQL Database**Name: sgts-farmashaio-db

│   ├── vite.config.js          # Configuración Vite

│   └── package.json```Database: sgts_farmashaio

│

├── backend/Dashboard → New → PostgreSQLUser: sgts_user

│   ├── src/

│   │   ├── config/             # Configuración (database, jwt)Name: sgts-farmashaio-dbRegion: Oregon (US West)

│   │   ├── controllers/        # Controladores de rutas

│   │   ├── middleware/         # Middleware (auth, validation)Database: sgts_farmashaioPlan: Free

│   │   ├── models/             # Modelos de datos

│   │   ├── routes/             # Definición de rutasUser: sgts_user```

│   │   ├── services/           # Lógica de negocio

│   │   └── utils/              # Utilidades (logger, email)Region: Oregon (US West)

│   ├── scripts/

│   │   ├── migrate.js          # Script de migración DBPlan: Free**c) Ejecutar Schema**

│   │   └── seed.js             # Script de datos iniciales

│   ├── server.js               # Entry point del servidor```- Copiar contenido de `database/schema.sql`

│   └── package.json

│- Dashboard → Connect → PSQL Command

├── database/

│   ├── schema.sql              # Schema de PostgreSQL**c) Ejecutar Schema**- Pegar y ejecutar

│   └── seed.sql                # Datos iniciales

│- Copiar contenido de `database/schema.sql`- Repetir con `database/seed.sql`

├── .github/

│   └── copilot-instructions.md # Instrucciones del proyecto- Dashboard → Connect → PSQL Command

│

├── render.yaml                 # Configuración Render- Pegar y ejecutar**d) Guardar DATABASE_URL**

├── vercel.json                 # Configuración Vercel

└── README.md- Repetir con `database/seed.sql````

```

Internal Database URL: postgresql://sgts_user:****@****/sgts_farmashaio

---

**d) Guardar DATABASE_URL**```

## Base de Datos

```

### Schema Principal

Internal Database URL: postgresql://sgts_user:****@****/sgts_farmashaio#### 3. Backend API en Render

**Tablas del Sistema:**

```

| Tabla | Descripción | Campos Principales |

|-------|-------------|-------------------|**a) Crear Web Service**

| `users` | Usuarios del sistema | id, username, email, password_hash, role_id |

| `roles` | Roles de usuario | id, name (Empleado, Técnico, Admin) |#### 3. Backend API en Render```

| `tickets` | Tickets de soporte | id, ticket_number, title, description, status_id |

| `ticket_comments` | Comentarios | id, ticket_id, user_id, comment, is_internal |Dashboard → New → Web Service

| `ticket_history` | Auditoría de cambios | id, ticket_id, changed_by, field_changed, old_value, new_value |

| `categories` | Categorías de tickets | id, name (Hardware, Software, Red, etc.) |**a) Crear Web Service**Repository: Julian-Enable/sgts-farmashaio

| `priorities` | Niveles de prioridad | id, name (Baja, Media, Alta, Crítica) |

| `ticket_statuses` | Estados del ticket | id, name (Abierto, En Proceso, Resuelto, Cerrado) |```Name: sgts-farmashaio-api

| `notifications` | Notificaciones | id, user_id, type, message, is_read |

Dashboard → New → Web ServiceRegion: Oregon (US West)

### Diagrama de Relaciones

Repository: Julian-Enable/sgts-farmashaioBranch: main

```

┌─────────────┐      ┌──────────────┐      ┌─────────────┐Name: sgts-farmashaio-apiRoot Directory: backend

│    roles    │──────│    users     │──────│ tickets     │

│             │ 1:N  │              │ 1:N  │             │Region: Oregon (US West)Runtime: Node

└─────────────┘      └──────────────┘      └─────────────┘

                            │                      │Branch: mainBuild Command: npm install

                            │ 1:N                  │ N:1

                            │                      │Root Directory: backendStart Command: npm start

                     ┌──────▼────────┐      ┌─────▼──────┐

                     │notifications  │      │categories  │Runtime: NodePlan: Free

                     └───────────────┘      └────────────┘

                                                   │Build Command: npm install```

                                                   │ N:1

┌─────────────┐      ┌──────────────┐      ┌─────▼──────┐Start Command: npm start

│priorities   │──────│   tickets    │      │ statuses   │

│             │ N:1  │              │      │            │Plan: Free**b) Configurar Variables de Entorno**

└─────────────┘      └──────┬───────┘      └────────────┘

                            │``````env

                            │ 1:N

                     ┌──────▼─────────┐NODE_ENV=production

                     │ticket_comments │

                     └────────────────┘**b) Configurar Variables de Entorno**DATABASE_URL=<Copiar Internal Database URL>

                     ┌────────────────┐

                     │ticket_history  │```envJWT_SECRET=<Generar string aleatorio de 32+ caracteres>

                     └────────────────┘

```NODE_ENV=productionCORS_ORIGINS=https://sgts-farmashaio-3pj5.vercel.app/



### Índices y OptimizaciónDATABASE_URL=<Copiar Internal Database URL>PORT=10000



- Primary keys en todas las tablasJWT_SECRET=<Generar string aleatorio de 32+ caracteres>```

- Foreign keys con `ON DELETE CASCADE`

- Índices en campos de búsqueda frecuenteCORS_ORIGINS=https://sgts-farmashaio.vercel.app

- Timestamps automáticos (`created_at`, `updated_at`)

PORT=10000**c) Conectar Database**

---

```- En el Web Service: Environment → Add Environment Group

## Seguridad

- Seleccionar la base de datos creada

### Implementaciones de Seguridad

**c) Conectar Database**

**Autenticación**

- Tokens JWT con expiración configurable- En el Web Service: Environment → Add Environment Group**d) Deploy**

- Refresh tokens para sesiones prolongadas

- Hashing de contraseñas con bcrypt (12 rounds)- Seleccionar la base de datos creada- Click "Create Web Service"

- Validación de fuerza de contraseña

- Esperar ~5 minutos para el primer deploy

**Autorización**

- Control de acceso basado en roles (RBAC)**d) Deploy**- Verificar: `https://sgts-farmashaio-api.onrender.com/health`

- Middleware de verificación de permisos

- Protección de endpoints según rol de usuario- Click "Create Web Service"



**Validación de Datos**- Esperar ~5 minutos para el primer deploy#### 4. Frontend en Vercel

- Sanitización de inputs del usuario

- Validación de tipos de datos- Verificar: `https://sgts-farmashaio-api.onrender.com/health`

- Prevención de SQL injection

- Prevención de XSS (Cross-Site Scripting)**a) Importar Proyecto**



**Comunicación**#### 4. Frontend en Vercel```

- HTTPS enforced en producción

- CORS configurado con whitelist de orígenesDashboard → Add New → Project

- Headers de seguridad HTTP

**a) Importar Proyecto**Import Git Repository: Julian-Enable/sgts-farmashaio

**Base de Datos**

- Consultas parametrizadas (prepared statements)```Framework Preset: Vite

- Índices en campos sensibles

- Backups automáticos diarios (Render)Dashboard → Add New → ProjectRoot Directory: frontend



### Variables de Entorno SensiblesImport Git Repository: Julian-Enable/sgts-farmashaioBuild Command: npm run build



**Backend (.env)**Framework Preset: ViteOutput Directory: dist

```env

JWT_SECRET=         # Mínimo 32 caracteres aleatoriosRoot Directory: frontendInstall Command: npm install

DATABASE_URL=       # Nunca compartir en público

EMAIL_PASSWORD=     # App password de emailBuild Command: npm run build```

```

Output Directory: dist

**Frontend (.env)**

```envInstall Command: npm install**b) Configurar Variables de Entorno**

VITE_API_BASE_URL=  # URL pública del backend

`````````env



**Importante:** Los archivos `.env` están en `.gitignore` y nunca se suben al repositorio.VITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api



---**b) Configurar Variables de Entorno**```



## Scripts Disponibles```env



### BackendVITE_API_BASE_URL=https://sgts-farmashaio-api.onrender.com/api**c) Deploy**



```bash```- Click "Deploy"

npm start          # Iniciar servidor de producción

npm run dev        # Servidor de desarrollo con nodemon- Esperar ~2 minutos

npm run migrate    # Ejecutar migraciones de base de datos

npm run seed       # Cargar datos iniciales**c) Deploy**- Verificar: `https://sgts-farmashaio.vercel.app`

npm test           # Ejecutar suite de tests

npm run lint       # Ejecutar ESLint- Click "Deploy"

```

- Esperar ~2 minutos#### 5. Verificación Post-Deployment

### Frontend

- Verificar: `https://sgts-farmashaio.vercel.app`

```bash

npm run dev        # Servidor de desarrollo (puerto 5173)**Checklist de Validación:**

npm run build      # Build de producción (carpeta dist/)

npm run preview    # Preview del build de producción#### 5. Verificación Post-Deployment

npm run lint       # Ejecutar ESLint

npm run format     # Formatear código con Prettier- [ ] Database responde correctamente

```

**Checklist de Validación:**  ```bash

---

  psql <DATABASE_URL> -c "SELECT COUNT(*) FROM users;"

## Funcionalidades por Rol

- [ ] Database responde correctamente  ```

### Empleado (User)

  ```bash

**Permisos:**

- Crear tickets de soporte  psql <DATABASE_URL> -c "SELECT COUNT(*) FROM users;"- [ ] Backend API funcional

- Ver y gestionar sus propios tickets

- Agregar comentarios a sus tickets  ```  ```bash

- Actualizar su perfil personal

- Recibir notificaciones de cambios  curl https://sgts-farmashaio-api.onrender.com/health



**Restricciones:**- [ ] Backend API funcional  # Expected: {"status": "ok"}

- No puede ver tickets de otros usuarios

- No puede cambiar estados de tickets  ```bash  ```

- No puede acceder al panel de administración

  curl https://sgts-farmashaio-api.onrender.com/health

### Técnico (Technician)

  # Expected: {"status": "ok"}- [ ] Frontend accesible

**Permisos:**

- Ver todos los tickets del sistema  ```  - Abrir `https://sgts-farmashaio.vercel.app`

- Recibir asignaciones automáticas

- Cambiar estados de tickets asignados  - Verificar que carga sin errores

- Agregar comentarios públicos e internos

- Registrar tiempo trabajado- [ ] Frontend accesible

- Actualizar detalles técnicos

  - Abrir `https://sgts-farmashaio.vercel.app`- [ ] Login funcional

**Restricciones:**

- No puede gestionar usuarios  - Verificar que carga sin errores  - Email: `admin@farmashaio.com`

- No puede acceder a configuración del sistema

- No puede eliminar tickets  - Password: `admin123`



### Administrador (Admin)- [ ] Login funcional  - Verificar acceso al dashboard



**Permisos:**  - Email: `admin@farmashaio.com`

- Acceso completo al sistema

- CRUD de usuarios y roles  - Password: `admin123`- [ ] CORS configurado

- Asignación manual de tickets

- Ver reportes y estadísticas  - Verificar acceso al dashboard  - Verificar que las llamadas API funcionan

- Configuración del sistema

- Gestión de categorías y prioridades  - Revisar Network tab (sin errores CORS)

- Acceso a logs del sistema

- [ ] CORS configurado

**Sin restricciones**

  - Verificar que las llamadas API funcionan### Actualización Continua

---

  - Revisar Network tab (sin errores CORS)

## Troubleshooting

Ambos servicios están configurados con **auto-deploy**:

### Problemas Comunes

### Actualización Continua

#### 1. Error de Conexión a Base de Datos

```bash

**Síntoma:** `Error: connect ECONNREFUSED` o `Database connection failed`

Ambos servicios están configurados con **auto-deploy**:git add .

**Solución:**

```bashgit commit -m "feat: nueva funcionalidad"

# Verificar que PostgreSQL está corriendo

pg_isready```bashgit push origin main



# Verificar variables de entornogit add .```

echo $DATABASE_URL

git commit -m "feat: nueva funcionalidad"

# Probar conexión manual

psql $DATABASE_URL -c "SELECT version();"git push origin main- **Vercel**: Deploy automático en ~2 minutos

```

```- **Render**: Deploy automático en ~5 minutos

#### 2. Error de CORS



**Síntoma:** `Access to fetch blocked by CORS policy`

- **Vercel**: Deploy automático en ~2 minutos---

**Solución:**

- Verificar que `CORS_ORIGINS` en backend incluye la URL del frontend- **Render**: Deploy automático en ~5 minutos## API Reference

- En desarrollo: `http://localhost:5173`

- En producción: `https://sgts-farmashaio.vercel.app`



#### 3. Token JWT Inválido---### Base URL



**Síntoma:** `401 Unauthorized` en todas las peticiones```



**Solución:**## API ReferenceDevelopment: http://localhost:5000/api

```javascript

// Limpiar localStorage en el navegadorProduction:  https://sgts-farmashaio-api.onrender.com/api

localStorage.clear();

### Base URL```

// Verificar que JWT_SECRET es el mismo en todos los ambientes

``````



#### 4. Error 500 en RenderDevelopment: http://localhost:5000/api### Autenticación



**Síntoma:** Backend no responde después del deployProduction:  https://sgts-farmashaio-api.onrender.com/api



**Solución:**```Todos los endpoints (excepto `/auth/login`) requieren token JWT en el header:

1. Revisar logs: Dashboard → Logs

2. Verificar variables de entorno configuradas```http

3. Confirmar que `DATABASE_URL` está conectado

4. Verificar que el puerto es `10000` o `process.env.PORT`### AutenticaciónAuthorization: Bearer <token>



#### 5. Build Fallido en Vercel```



**Síntoma:** `Build failed` durante el deployTodos los endpoints (excepto `/auth/login`) requieren token JWT en el header:



**Solución:**```http#### Endpoints de Autenticación

```bash

# Verificar build localmenteAuthorization: Bearer <token>

cd frontend

npm run build``````http



# Revisar que todas las dependencias están en package.jsonPOST   /api/auth/login

npm install

#### Endpoints de AutenticaciónPOST   /api/auth/logout

# Verificar que VITE_API_BASE_URL está configurado

```GET    /api/auth/profile



### Logs y Debugging```httpPUT    /api/auth/profile



**Backend Logs (Render):**POST   /api/auth/loginPOST   /api/auth/change-password

```bash

# Ver logs en tiempo realPOST   /api/auth/logout```

Dashboard → Service → Logs → Live Logs

```GET    /api/auth/profile



**Frontend Logs (Vercel):**PUT    /api/auth/profile**Ejemplo: Login**

```bash

# Ver logs de buildPOST   /api/auth/change-password```bash

Dashboard → Project → Deployments → [Select Deployment] → Logs

``````curl -X POST https://sgts-farmashaio-api.onrender.com/api/auth/login \



**Base de Datos (Render):**  -H "Content-Type: application/json" \

```bash

# Conectarse vía PSQL**Ejemplo: Login**  -d '{"email": "admin@farmashaio.com", "password": "admin123"}'

psql [Internal Database URL]

```bash```

# Ver tablas

\dtcurl -X POST https://sgts-farmashaio-api.onrender.com/api/auth/login \



# Ver usuarios  -H "Content-Type: application/json" \### Gestión de Usuarios

SELECT * FROM users;

```  -d '{"email": "admin@farmashaio.com", "password": "admin123"}'



---``````http



## RoadmapGET    /api/users              # Listar todos los usuarios



### Version 1.1 (Q1 2026)### Gestión de UsuariosPOST   /api/users              # Crear nuevo usuario

- [ ] Dashboard con gráficos interactivos (Chart.js)

- [ ] Sistema de archivos adjuntos (AWS S3 / Cloudinary)GET    /api/users/:id          # Obtener usuario específico

- [ ] Filtros avanzados de búsqueda

- [ ] Exportación de reportes (PDF, Excel)```httpPUT    /api/users/:id          # Actualizar usuario



### Version 1.2 (Q2 2026)GET    /api/users              # Listar todos los usuariosDELETE /api/users/:id          # Eliminar usuario

- [ ] Notificaciones push en tiempo real (WebSockets)

- [ ] Sistema de SLA automático con alertasPOST   /api/users              # Crear nuevo usuarioGET    /api/users/technicians  # Listar solo técnicos

- [ ] Integración con Microsoft Teams

- [ ] API pública con documentación SwaggerGET    /api/users/:id          # Obtener usuario específico```



### Version 2.0 (Q3 2026)PUT    /api/users/:id          # Actualizar usuario

- [ ] App móvil nativa (React Native)

- [ ] Integración con WhatsApp BusinessDELETE /api/users/:id          # Eliminar usuario### Gestión de Tickets

- [ ] Sistema de conocimiento base (FAQ)

- [ ] Analytics avanzados con BIGET    /api/users/technicians  # Listar solo técnicos



---``````http



## ContribuciónGET    /api/tickets                  # Listar tickets (con filtros)



### Cómo Contribuir### Gestión de TicketsPOST   /api/tickets                  # Crear nuevo ticket



1. Fork el proyectoGET    /api/tickets/:id              # Obtener ticket específico

2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)

3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)```httpPUT    /api/tickets/:id              # Actualizar ticket

4. Push a la rama (`git push origin feature/nueva-funcionalidad`)

5. Abrir Pull RequestGET    /api/tickets                  # Listar tickets (con filtros)DELETE /api/tickets/:id              # Eliminar ticket



### Convenciones de CódigoPOST   /api/tickets                  # Crear nuevo ticketPOST   /api/tickets/:id/assign       # Asignar técnico



**Commits (Conventional Commits):**GET    /api/tickets/:id              # Obtener ticket específicoPATCH  /api/tickets/:id/status       # Cambiar estado

```

feat: nueva funcionalidadPUT    /api/tickets/:id              # Actualizar ticketPOST   /api/tickets/:id/comments     # Agregar comentario

fix: corrección de bug

docs: cambios en documentaciónDELETE /api/tickets/:id              # Eliminar ticketGET    /api/tickets/:id/history      # Obtener historial

style: formato, espacios, etc

refactor: refactorización de códigoPOST   /api/tickets/:id/assign       # Asignar técnico```

test: agregar o actualizar tests

chore: tareas de mantenimientoPATCH  /api/tickets/:id/status       # Cambiar estado

```

POST   /api/tickets/:id/comments     # Agregar comentario**Ejemplo: Crear Ticket**

**Código:**

- ESLint configurado para JavaScript/ReactGET    /api/tickets/:id/history      # Obtener historial```bash

- Prettier para formato consistente

- 2 espacios de indentación```curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \

- Nombres descriptivos para variables y funciones

  -H "Authorization: Bearer <token>" \

---

**Ejemplo: Crear Ticket**  -H "Content-Type: application/json" \

## Licencia

```bash  -d '{

Este proyecto está licenciado bajo la **MIT License**.

curl -X POST https://sgts-farmashaio-api.onrender.com/api/tickets \    "title": "Error en sistema de inventario",

```

MIT License  -H "Authorization: Bearer <token>" \    "description": "El sistema no permite actualizar existencias",



Copyright (c) 2025 FARMASHAIO  -H "Content-Type: application/json" \    "category_id": 1,



Permission is hereby granted, free of charge, to any person obtaining a copy  -d '{    "priority_id": 3

of this software and associated documentation files (the "Software"), to deal

in the Software without restriction, including without limitation the rights    "title": "Error en sistema de inventario",  }'

to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

copies of the Software, and to permit persons to whom the Software is    "description": "El sistema no permite actualizar existencias",```

furnished to do so, subject to the following conditions:

    "category_id": 1,

The above copyright notice and this permission notice shall be included in all

copies or substantial portions of the Software.    "priority_id": 3### Notificaciones



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  }'

IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE``````http

AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,GET    /api/notifications           # Listar notificaciones del usuario

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE

SOFTWARE.### NotificacionesPUT    /api/notifications/:id/read  # Marcar como leída

```

DELETE /api/notifications/:id       # Eliminar notificación

---

```http```

## Contacto

GET    /api/notifications           # Listar notificaciones del usuario

**FARMASHAIO - Departamento de TI**

PUT    /api/notifications/:id/read  # Marcar como leída### Catálogos

- **Website:** [https://sgts-farmashaio.vercel.app](https://sgts-farmashaio.vercel.app)

- **Repository:** [https://github.com/Julian-Enable/sgts-farmashaio](https://github.com/Julian-Enable/sgts-farmashaio)DELETE /api/notifications/:id       # Eliminar notificación

- **Issues:** [GitHub Issues](https://github.com/Julian-Enable/sgts-farmashaio/issues)

``````http

---

GET    /api/categories              # Listar categorías

<div align="center">

### CatálogosGET    /api/priorities              # Listar prioridades

**SGTS FARMASHAIO v1.0.0**

GET    /api/statuses                # Listar estados

Sistema de Gestión de Tickets de Soporte TI

```http```

Desarrollado por **Julian Merchán**

GET    /api/categories              # Listar categorías

*Built with React, Node.js & PostgreSQL*

GET    /api/priorities              # Listar prioridades### Códigos de Respuesta

</div>

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

# Verificar variables de entorno*Sistema de Gestión de Tickets de Soporte TI v1.0.0*#

