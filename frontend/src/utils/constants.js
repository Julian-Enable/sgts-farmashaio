// Configuración de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sgts-farmashaio-api.onrender.com';
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/api/auth/login',
  PROFILE: '/api/auth/profile',
  CHANGE_PASSWORD: '/api/auth/change-password',
  VERIFY_TOKEN: '/api/auth/verify-token',
  LOGOUT: '/api/auth/logout',

  // Usuarios
  USERS: '/api/users',
  TECHNICIANS: '/api/users/technicians',
  USER_STATS: '/api/users/stats',

  // Tickets
  TICKETS: '/api/tickets',
  TICKET_STATS: '/api/tickets/stats',
  TICKET_FILTERS: '/api/tickets/filters',

  // Notificaciones
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATIONS_UNREAD_COUNT: '/api/notifications/unread-count',
  NOTIFICATIONS_MARK_ALL_READ: '/api/notifications/mark-all-read',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'SGTS FARMASHAIO',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: 'Sistema de Gestión de Tickets de Soporte TI',
  COMPANY: 'FARMASHAIO',
};

// Configuraciones de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  MAX_PAGE_SIZE: 100,
};

// Roles de usuario
export const USER_ROLES = {
  EMPLEADO: 'empleado',
  TECNICO: 'tecnico',
  ADMINISTRADOR: 'administrador',
};

// Estados de tickets
export const TICKET_STATUS = {
  'nuevo': {
    label: 'Nuevo',
    description: 'Ticket recién creado',
    color: '#2196f3'
  },
  'asignado': {
    label: 'Asignado',
    description: 'Ticket asignado a un técnico',
    color: '#ff9800'
  },
  'en-progreso': {
    label: 'En Progreso',
    description: 'El técnico está trabajando en el ticket',
    color: '#9c27b0'
  },
  'esperando-usuario': {
    label: 'Esperando Usuario',
    description: 'Esperando respuesta del usuario',
    color: '#ffc107'
  },
  'resuelto': {
    label: 'Resuelto',
    description: 'Problema resuelto',
    color: '#4caf50'
  },
  'cerrado': {
    label: 'Cerrado',
    description: 'Ticket completamente finalizado',
    color: '#757575'
  }
};

// Prioridades de tickets
export const TICKET_PRIORITY = {
  'muy-baja': {
    label: 'Muy Baja',
    level: 1,
    color: '#4caf50',
    description: 'No urgente, puede esperar varios días'
  },
  'baja': {
    label: 'Baja',
    level: 2,
    color: '#8bc34a',
    description: 'Puede esperar hasta el final del día'
  },
  'media': {
    label: 'Media',
    level: 3,
    color: '#ff9800',
    description: 'Debe resolverse en unas pocas horas'
  },
  'alta': {
    label: 'Alta',
    level: 4,
    color: '#f44336',
    description: 'Requiere atención inmediata'
  },
  'critica': {
    label: 'Crítica',
    level: 5,
    color: '#d32f2f',
    description: 'Emergencia - bloquea operaciones críticas'
  }
};

// Categorías de tickets
export const TICKET_CATEGORIES = {
  'hardware': {
    label: 'Hardware',
    description: 'Problemas relacionados con equipos físicos',
    color: '#f44336'
  },
  'software': {
    label: 'Software',
    description: 'Problemas con aplicaciones y sistemas',
    color: '#2196f3'
  },
  'red': {
    label: 'Red',
    description: 'Problemas de conectividad y red',
    color: '#ff9800'
  },
  'acceso': {
    label: 'Acceso',
    description: 'Problemas de acceso y permisos',
    color: '#4caf50'
  },
  'email': {
    label: 'Email',
    description: 'Problemas con correo electrónico',
    color: '#9c27b0'
  },
  'otros': {
    label: 'Otros',
    description: 'Otros problemas no categorizados',
    color: '#9e9e9e'
  }
};

// Estados de tickets (legacy para compatibilidad)
export const TICKET_STATUSES = {
  NUEVO: 'Nuevo',
  ASIGNADO: 'Asignado',
  EN_PROGRESO: 'En Progreso',
  ESPERANDO_USUARIO: 'Esperando Usuario',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
  CANCELADO: 'Cancelado',
};

// Prioridades (legacy para compatibilidad)
export const PRIORITIES = {
  MUY_BAJA: 'Muy Baja',
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  TICKET_CREATED: 'ticket_created',
  TICKET_ASSIGNED: 'ticket_assigned',
  TICKET_UPDATED: 'ticket_updated',
  STATUS_CHANGED: 'status_changed',
  COMMENT_ADDED: 'comment_added',
};

// Configuraciones de validación
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  COMMENT_MAX_LENGTH: 1000,
  NAME_MAX_LENGTH: 50,
  DEPARTMENT_MAX_LENGTH: 100,
};

// Configuraciones de fecha y hora
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Configuraciones de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.csv'],
};

// Configuraciones de timeout
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 segundos
  FILE_UPLOAD: 60000, // 60 segundos
  NOTIFICATION_DURATION: 5000, // 5 segundos
};

// URLs para deployment
export const DEPLOYMENT_URLS = {
  PRODUCTION_FRONTEND: 'https://sgts-farmashaio.vercel.app',
  PRODUCTION_API: 'https://sgts-farmashaio-api.onrender.com',
  STAGING_FRONTEND: 'https://sgts-farmashaio-staging.vercel.app',
  STAGING_API: 'https://sgts-farmashaio-api-staging.onrender.com',
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_CONFIG,
  PAGINATION,
  USER_ROLES,
  TICKET_STATUSES,
  PRIORITIES,
  NOTIFICATION_TYPES,
  VALIDATION,
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  FILE_CONFIG,
  TIMEOUTS,
  DEPLOYMENT_URLS,
};