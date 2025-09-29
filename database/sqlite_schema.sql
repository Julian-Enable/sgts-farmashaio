-- SGTS FARMASHAIO Database Schema para SQLite (Desarrollo Local)

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('empleado', 'tecnico', 'administrador')),
    department TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_login TEXT
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#1976d2',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Tabla de Prioridades
CREATE TABLE IF NOT EXISTS priorities (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 5),
    color TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1
);

-- Tabla de Estados
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT NOT NULL,
    is_final INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1
);

-- Tabla de Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    ticket_number TEXT UNIQUE NOT NULL,
    requester_id TEXT NOT NULL,
    assigned_to TEXT,
    category_id TEXT NOT NULL,
    priority_id TEXT NOT NULL,
    status_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    due_date TEXT,
    estimated_hours REAL,
    actual_hours REAL,
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (status_id) REFERENCES ticket_statuses(id)
);

-- Tabla de Comentarios
CREATE TABLE IF NOT EXISTS ticket_comments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    ticket_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_internal INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Historial
CREATE TABLE IF NOT EXISTS ticket_history (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    ticket_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'assigned', 'status_change', 'comment')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    ticket_id TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    sent_via_email INTEGER DEFAULT 0,
    email_sent_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);

-- Insertar datos iniciales
INSERT OR IGNORE INTO categories (id, name, description, color) VALUES
('cat1', 'Hardware', 'Problemas relacionados con equipos físicos', '#f44336'),
('cat2', 'Software', 'Problemas con aplicaciones y sistemas', '#2196f3'),
('cat3', 'Red', 'Problemas de conectividad y red', '#ff9800'),
('cat4', 'Acceso', 'Problemas de acceso y permisos', '#4caf50'),
('cat5', 'Email', 'Problemas con correo electrónico', '#9c27b0'),
('cat6', 'Otros', 'Otros problemas no categorizados', '#9e9e9e');

INSERT OR IGNORE INTO priorities (id, name, level, color, description) VALUES
('pri1', 'Muy Baja', 1, '#4caf50', 'No urgente, puede esperar varios días'),
('pri2', 'Baja', 2, '#8bc34a', 'Puede esperar hasta el final del día'),
('pri3', 'Media', 3, '#ff9800', 'Debe resolverse en unas pocas horas'),
('pri4', 'Alta', 4, '#f44336', 'Requiere atención inmediata'),
('pri5', 'Crítica', 5, '#d32f2f', 'Emergencia - bloquea operaciones críticas');

INSERT OR IGNORE INTO ticket_statuses (id, name, description, color, is_final, order_index) VALUES
('st1', 'Nuevo', 'Ticket recién creado', '#2196f3', 0, 1),
('st2', 'Asignado', 'Ticket asignado a un técnico', '#ff9800', 0, 2),
('st3', 'En Progreso', 'El técnico está trabajando en el ticket', '#9c27b0', 0, 3),
('st4', 'Esperando Usuario', 'Esperando respuesta del usuario', '#ffc107', 0, 4),
('st5', 'Resuelto', 'Problema resuelto', '#4caf50', 0, 5),
('st6', 'Cerrado', 'Ticket completamente finalizado', '#757575', 1, 6);

-- Usuarios por defecto (contraseñas: admin123, tecnico123, empleado123)
INSERT OR IGNORE INTO users (id, username, email, password_hash, first_name, last_name, role, department) VALUES
('admin1', 'admin', 'admin@farmashaio.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RKoydKb.K', 'Administrador', 'Sistema', 'administrador', 'TI'),
('tech1', 'tecnico1', 'tecnico1@farmashaio.com', '$2a$12$8vJ1YgKYVfUXNEwDhz0L8OqYgGYR.8mVq7eOyJ5YxdYNhqHEEILwq', 'Juan Carlos', 'Pérez', 'tecnico', 'Soporte TI'),
('emp1', 'empleado1', 'empleado1@farmashaio.com', '$2a$12$9wK2ZhLYWgVYOFXEi1.M9uqZhHZS.9nWr8fPzK6ZyeZOirIFJMxwq', 'María Elena', 'García', 'empleado', 'Farmacia');