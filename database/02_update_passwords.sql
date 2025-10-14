-- Actualizar hashes de contraseñas de usuarios
-- Este script actualiza las contraseñas de los 3 usuarios por defecto

UPDATE users SET password_hash = '$2a$12$W3KHlFjIlNVDHxeCx/Jm6.xVmejwzg5cidXIn4A9Q3Rua6Rd2O4JC' WHERE email = 'admin@farmashaio.com';
UPDATE users SET password_hash = '$2a$12$TjvdEOQF1iaEWSF1nH766eL9ctWuQwnlr6k9iesmIfrxq9t.hqhMC' WHERE email = 'tecnico1@farmashaio.com';
UPDATE users SET password_hash = '$2a$12$eK7Nz/6vDVaxMoHY7.rq8eqEyd1mgqR4ATZ947IiSxmDi33WExzBu' WHERE email = 'empleado1@farmashaio.com';

-- Verificar que se actualizaron
SELECT username, email, role FROM users;
