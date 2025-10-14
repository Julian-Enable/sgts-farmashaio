-- Verificar que todas las tablas necesarias existen
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar categorías
SELECT COUNT(*) as total_categorias FROM categories;

-- Verificar prioridades
SELECT COUNT(*) as total_prioridades FROM priorities;

-- Verificar estados
SELECT COUNT(*) as total_estados FROM ticket_statuses;

-- Verificar usuarios
SELECT COUNT(*) as total_usuarios FROM users;
