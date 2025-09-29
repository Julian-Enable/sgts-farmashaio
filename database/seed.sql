-- SGTS FARMASHAIO - Datos iniciales
-- Sistema de Gestión de Tickets de Soporte TI

-- Insertar categorías por defecto
INSERT INTO categories (name, description, color) VALUES
('Hardware', 'Problemas relacionados con equipos físicos', '#f44336'),
('Software', 'Problemas con aplicaciones y sistemas', '#2196f3'),
('Red', 'Problemas de conectividad y red', '#ff9800'),
('Acceso', 'Problemas de acceso y permisos', '#4caf50'),
('Email', 'Problemas con correo electrónico', '#9c27b0'),
('Impresoras', 'Problemas con impresoras y escáneres', '#795548'),
('Teléfonos', 'Problemas con telefonía', '#607d8b'),
('Otros', 'Otros problemas no categorizados', '#9e9e9e')
ON CONFLICT (name) DO NOTHING;

-- Insertar prioridades
INSERT INTO priorities (name, level, color, description) VALUES
('Muy Baja', 1, '#4caf50', 'No urgente, puede esperar varios días'),
('Baja', 2, '#8bc34a', 'Puede esperar hasta el final del día'),
('Media', 3, '#ff9800', 'Debe resolverse en unas pocas horas'),
('Alta', 4, '#f44336', 'Requiere atención inmediata'),
('Crítica', 5, '#d32f2f', 'Emergencia - bloquea operaciones críticas')
ON CONFLICT (name) DO NOTHING;

-- Insertar estados de tickets
INSERT INTO ticket_statuses (name, description, color, is_final, order_index) VALUES
('Nuevo', 'Ticket recién creado', '#2196f3', false, 1),
('Asignado', 'Ticket asignado a un técnico', '#ff9800', false, 2),
('En Progreso', 'El técnico está trabajando en el ticket', '#9c27b0', false, 3),
('Esperando Usuario', 'Esperando respuesta o acción del usuario', '#ffc107', false, 4),
('Resuelto', 'Problema resuelto, esperando confirmación', '#4caf50', false, 5),
('Cerrado', 'Ticket completamente finalizado', '#757575', true, 6),
('Cancelado', 'Ticket cancelado por el usuario o administrador', '#f44336', true, 7)
ON CONFLICT (name) DO NOTHING;

-- Crear usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department)
VALUES (
    'admin',
    'admin@farmashaio.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RKoydKb.K',
    'Administrador',
    'Sistema',
    'administrador',
    'TI'
) ON CONFLICT (username) DO NOTHING;

-- Crear usuario técnico de ejemplo
-- Contraseña: tecnico123
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department)
VALUES (
    'tecnico1',
    'tecnico1@farmashaio.com',
    '$2a$12$8vJ1YgKYVfUXNEwDhz0L8OqYgGYR.8mVq7eOyJ5YxdYNhqHEEILwq',
    'Juan Carlos',
    'Pérez',
    'tecnico',
    'Soporte TI'
) ON CONFLICT (username) DO NOTHING;

-- Crear usuario empleado de ejemplo
-- Contraseña: empleado123
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department)
VALUES (
    'empleado1',
    'empleado1@farmashaio.com',
    '$2a$12$9wK2ZhLYWgVYOFXEi1.M9uqZhHZS.9nWr8fPzK6ZyeZOirIFJMxwq',
    'María Elena',
    'García',
    'empleado',
    'Farmacia'
) ON CONFLICT (username) DO NOTHING;

-- Verificar que los datos se insertaron correctamente
DO $$
DECLARE
    category_count INTEGER;
    priority_count INTEGER;
    status_count INTEGER;
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;
    SELECT COUNT(*) INTO priority_count FROM priorities WHERE is_active = true;
    SELECT COUNT(*) INTO status_count FROM ticket_statuses WHERE is_active = true;
    SELECT COUNT(*) INTO user_count FROM users WHERE is_active = true;
    
    RAISE NOTICE 'Datos iniciales insertados:';
    RAISE NOTICE '- Categorías: %', category_count;
    RAISE NOTICE '- Prioridades: %', priority_count;
    RAISE NOTICE '- Estados: %', status_count;
    RAISE NOTICE '- Usuarios: %', user_count;
END $$;