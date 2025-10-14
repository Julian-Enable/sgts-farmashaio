-- Insertar TODOS los datos necesarios para el sistema

-- 1. CATEGORÍAS
INSERT INTO categories (id, name, description, color, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hardware', 'Problemas relacionados con equipos físicos', '#f44336', true),
('550e8400-e29b-41d4-a716-446655440002', 'Software', 'Problemas con aplicaciones y sistemas', '#2196f3', true),
('550e8400-e29b-41d4-a716-446655440003', 'Red', 'Problemas de conectividad y red', '#ff9800', true),
('550e8400-e29b-41d4-a716-446655440004', 'Acceso', 'Problemas de acceso y permisos', '#4caf50', true),
('550e8400-e29b-41d4-a716-446655440005', 'Email', 'Problemas con correo electrónico', '#9c27b0', true),
('550e8400-e29b-41d4-a716-446655440006', 'Otros', 'Otros problemas no categorizados', '#9e9e9e', true)
ON CONFLICT (id) DO NOTHING;

-- 2. PRIORIDADES
INSERT INTO priorities (id, name, level, color, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'Muy Baja', 1, '#4caf50', 'No urgente, puede esperar varios días', true),
('550e8400-e29b-41d4-a716-446655441002', 'Baja', 2, '#8bc34a', 'Puede esperar hasta el final del día', true),
('550e8400-e29b-41d4-a716-446655441003', 'Media', 3, '#ff9800', 'Debe resolverse en unas pocas horas', true),
('550e8400-e29b-41d4-a716-446655441004', 'Alta', 4, '#f44336', 'Requiere atención inmediata', true),
('550e8400-e29b-41d4-a716-446655441005', 'Crítica', 5, '#d32f2f', 'Emergencia - bloquea operaciones críticas', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ESTADOS
INSERT INTO ticket_statuses (id, name, description, color, is_final, order_index, is_active) VALUES
('550e8400-e29b-41d4-a716-446655442001', 'Nuevo', 'Ticket recién creado', '#2196f3', false, 1, true),
('550e8400-e29b-41d4-a716-446655442002', 'Asignado', 'Ticket asignado a un técnico', '#ff9800', false, 2, true),
('550e8400-e29b-41d4-a716-446655442003', 'En Progreso', 'El técnico está trabajando en el ticket', '#9c27b0', false, 3, true),
('550e8400-e29b-41d4-a716-446655442004', 'Esperando Usuario', 'Esperando respuesta del usuario', '#ffc107', false, 4, true),
('550e8400-e29b-41d4-a716-446655442005', 'Resuelto', 'Problema resuelto', '#4caf50', false, 5, true),
('550e8400-e29b-41d4-a716-446655442006', 'Cerrado', 'Ticket completamente finalizado', '#757575', true, 6, true)
ON CONFLICT (id) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT 'Categorías' as tipo, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Prioridades', COUNT(*) FROM priorities
UNION ALL
SELECT 'Estados', COUNT(*) FROM ticket_statuses
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM users;
