-- SGTS FARMASHAIO - Schema SIN UUID (usando SERIAL)
-- Más compatible con Render PostgreSQL Free

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#1976d2',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Prioridades
CREATE TABLE IF NOT EXISTS priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 5),
    color VARCHAR(7) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Estados
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    requester_id UUID NOT NULL,
    assigned_to UUID,
    category_id INTEGER NOT NULL,
    priority_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (status_id) REFERENCES ticket_statuses(id)
);

-- Tabla de Comentarios
CREATE TABLE IF NOT EXISTS ticket_comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Historial
CREATE TABLE IF NOT EXISTS ticket_history (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_type VARCHAR(30) NOT NULL CHECK (change_type IN ('created', 'updated', 'assigned', 'status_change', 'comment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    ticket_id INTEGER,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_via_email BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- FUNCIÓN Y TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_comments_updated_at BEFORE UPDATE ON ticket_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_tickets_requester_id ON tickets(requester_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status_id ON tickets(status_id);
CREATE INDEX IF NOT EXISTS idx_tickets_category_id ON tickets(category_id);
CREATE INDEX IF NOT EXISTS idx_tickets_priority_id ON tickets(priority_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- INSERTAR DATOS
INSERT INTO categories (name, description, color) VALUES
('Hardware', 'Problemas relacionados con equipos físicos', '#f44336'),
('Software', 'Problemas con aplicaciones y sistemas', '#2196f3'),
('Red', 'Problemas de conectividad y red', '#ff9800'),
('Acceso', 'Problemas de acceso y permisos', '#4caf50'),
('Email', 'Problemas con correo electrónico', '#9c27b0'),
('Otros', 'Otros problemas no categorizados', '#9e9e9e')
ON CONFLICT (name) DO NOTHING;

INSERT INTO priorities (name, level, color, description) VALUES
('Muy Baja', 1, '#4caf50', 'No urgente, puede esperar varios días'),
('Baja', 2, '#8bc34a', 'Puede esperar hasta el final del día'),
('Media', 3, '#ff9800', 'Debe resolverse en unas pocas horas'),
('Alta', 4, '#f44336', 'Requiere atención inmediata'),
('Crítica', 5, '#d32f2f', 'Emergencia - bloquea operaciones críticas')
ON CONFLICT (name) DO NOTHING;

INSERT INTO ticket_statuses (name, description, color, is_final, order_index) VALUES
('Nuevo', 'Ticket recién creado', '#2196f3', FALSE, 1),
('Asignado', 'Ticket asignado a un técnico', '#ff9800', FALSE, 2),
('En Progreso', 'El técnico está trabajando en el ticket', '#9c27b0', FALSE, 3),
('Esperando Usuario', 'Esperando respuesta del usuario', '#ffc107', FALSE, 4),
('Resuelto', 'Problema resuelto', '#4caf50', FALSE, 5),
('Cerrado', 'Ticket completamente finalizado', '#757575', TRUE, 6)
ON CONFLICT (name) DO NOTHING;

-- Verificar
SELECT 'Categorías' as tabla, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Prioridades', COUNT(*) FROM priorities
UNION ALL
SELECT 'Estados', COUNT(*) FROM ticket_statuses
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM users
ORDER BY tabla;
