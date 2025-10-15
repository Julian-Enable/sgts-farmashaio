-- Crear notificaciones de prueba para el usuario admin

-- Notificación 1: Ticket asignado
INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@farmashaio.com'),
    1,
    'ticket_assigned',
    'Nuevo Ticket Asignado',
    'Se te ha asignado el ticket #1 - Problema con impresora HP LaserJet',
    false,
    NOW() - INTERVAL '2 hours'
);

-- Notificación 2: Comentario agregado
INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@farmashaio.com'),
    2,
    'ticket_commented',
    'Nuevo Comentario en Ticket',
    'Se agregó un comentario en el ticket #2 - Error de conexión a red',
    false,
    NOW() - INTERVAL '30 minutes'
);

-- Notificación 3: Estado cambiado
INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@farmashaio.com'),
    3,
    'ticket_updated',
    'Ticket Actualizado',
    'El estado del ticket #3 ha cambiado a "En Progreso"',
    false,
    NOW() - INTERVAL '15 minutes'
);

-- Notificación 4: Ticket resuelto (esta ya leída)
INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@farmashaio.com'),
    1,
    'ticket_closed',
    'Ticket Cerrado',
    'El ticket #1 - Problema con impresora ha sido cerrado exitosamente',
    true,
    NOW() - INTERVAL '1 day'
);

-- Notificación 5: Prioridad cambiada
INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@farmashaio.com'),
    2,
    'ticket_priority_changed',
    'Prioridad Actualizada',
    'La prioridad del ticket #2 ha sido cambiada a "Alta"',
    false,
    NOW() - INTERVAL '5 minutes'
);

-- Verificar las notificaciones creadas
SELECT 
    COUNT(*) as total_notificaciones,
    SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as no_leidas,
    SUM(CASE WHEN is_read = true THEN 1 ELSE 0 END) as leidas
FROM notifications
WHERE user_id = (SELECT id FROM users WHERE email = 'admin@farmashaio.com');
