-- SGTS FARMASHAIO - Schema Completo y Limpio
-- Ejecutar TODO de una vez

-- 1. Extensión UUID
CREATE EXTENSION IF NOT EXISTS uuid_ossp;

-- 2. CREAR TABLAS

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#1976d2',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Prioridades
CREATE TABLE IF NOT EXISTS priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 5),
    color VARCHAR(7) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Estados
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    requester_id UUID NOT NULL,
    assigned_to UUID,
    category_id UUID NOT NULL,
    priority_id UUID NOT NULL,
    status_id UUID NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL,
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    ticket_id UUID,
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

-- 3. CREAR FUNCIÓN Y TRIGGERS

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

-- 4. CREAR ÍNDICES

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

-- 5. INSERTAR DATOS

-- Categorías
INSERT INTO categories (id, name, description, color) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hardware', 'Problemas relacionados con equipos físicos', '#f44336'),
('550e8400-e29b-41d4-a716-446655440002', 'Software', 'Problemas con aplicaciones y sistemas', '#2196f3'),
('550e8400-e29b-41d4-a716-446655440003', 'Red', 'Problemas de conectividad y red', '#ff9800'),
('550e8400-e29b-41d4-a716-446655440004', 'Acceso', 'Problemas de acceso y permisos', '#4caf50'),
('550e8400-e29b-41d4-a716-446655440005', 'Email', 'Problemas con correo electrónico', '#9c27b0'),
('550e8400-e29b-41d4-a716-446655440006', 'Otros', 'Otros problemas no categorizados', '#9e9e9e')
ON CONFLICT (id) DO NOTHING;

-- Prioridades
INSERT INTO priorities (id, name, level, color, description) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'Muy Baja', 1, '#4caf50', 'No urgente, puede esperar varios días'),
('550e8400-e29b-41d4-a716-446655441002', 'Baja', 2, '#8bc34a', 'Puede esperar hasta el final del día'),
('550e8400-e29b-41d4-a716-446655441003', 'Media', 3, '#ff9800', 'Debe resolverse en unas pocas horas'),
('550e8400-e29b-41d4-a716-446655441004', 'Alta', 4, '#f44336', 'Requiere atención inmediata'),
('550e8400-e29b-41d4-a716-446655441005', 'Crítica', 5, '#d32f2f', 'Emergencia - bloquea operaciones críticas')
ON CONFLICT (id) DO NOTHING;

-- Estados
INSERT INTO ticket_statuses (id, name, description, color, is_final, order_index) VALUES
('550e8400-e29b-41d4-a716-446655442001', 'Nuevo', 'Ticket recién creado', '#2196f3', FALSE, 1),
('550e8400-e29b-41d4-a716-446655442002', 'Asignado', 'Ticket asignado a un técnico', '#ff9800', FALSE, 2),
('550e8400-e29b-41d4-a716-446655442003', 'En Progreso', 'El técnico está trabajando en el ticket', '#9c27b0', FALSE, 3),
('550e8400-e29b-41d4-a716-446655442004', 'Esperando Usuario', 'Esperando respuesta del usuario', '#ffc107', FALSE, 4),
('550e8400-e29b-41d4-a716-446655442005', 'Resuelto', 'Problema resuelto', '#4caf50', FALSE, 5),
('550e8400-e29b-41d4-a716-446655442006', 'Cerrado', 'Ticket completamente finalizado', '#757575', TRUE, 6)
ON CONFLICT (id) DO NOTHING;

-- Verificar resultados
SELECT 'Categorías' as tabla, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Prioridades', COUNT(*) FROM priorities
UNION ALL
SELECT 'Estados', COUNT(*) FROM ticket_statuses
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM users
ORDER BY tabla;
