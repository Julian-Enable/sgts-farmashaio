-- Verificar si las contraseñas se actualizaron
SELECT 
    username, 
    email, 
    role,
    SUBSTRING(password_hash, 1, 20) as hash_preview,
    created_at
FROM users
ORDER BY role DESC;
