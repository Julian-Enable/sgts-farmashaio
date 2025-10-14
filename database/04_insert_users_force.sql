-- Insertar usuarios directamente (sin bloque DO)
-- Primero borramos si existen
DELETE FROM users WHERE email IN ('admin@farmashaio.com', 'tecnico1@farmashaio.com', 'empleado1@farmashaio.com');

-- Ahora insertamos con los nuevos hashes
INSERT INTO users (id, username, email, password_hash, first_name, last_name, role, department) VALUES
('550e8400-e29b-41d4-a716-446655443001', 'admin', 'admin@farmashaio.com', '$2a$12$W3KHlFjIlNVDHxeCx/Jm6.xVmejwzg5cidXIn4A9Q3Rua6Rd2O4JC', 'Administrador', 'Sistema', 'administrador', 'TI'),
('550e8400-e29b-41d4-a716-446655443002', 'tecnico1', 'tecnico1@farmashaio.com', '$2a$12$TjvdEOQF1iaEWSF1nH766eL9ctWuQwnlr6k9iesmIfrxq9t.hqhMC', 'Juan Carlos', 'Pérez', 'tecnico', 'Soporte TI'),
('550e8400-e29b-41d4-a716-446655443003', 'empleado1', 'empleado1@farmashaio.com', '$2a$12$eK7Nz/6vDVaxMoHY7.rq8eqEyd1mgqR4ATZ947IiSxmDi33WExzBu', 'María Elena', 'García', 'empleado', 'Farmacia');

-- Verificar
SELECT username, email, role, SUBSTRING(password_hash, 1, 25) as hash_check FROM users ORDER BY role DESC;
