import pkg from 'pg';
const { Pool } = pkg;

let pool = null;

// Configuración de conexión a PostgreSQL
const createPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

// Obtener conexión
export const getConnection = async () => {
  if (!pool) {
    pool = createPool();
  }
  return pool;
};

// Ejecutar query
export const query = async (text, params = []) => {
  const start = Date.now();
  const client = await getConnection();
  
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query ejecutado:', {
        text: text.length > 100 ? text.substring(0, 100) + '...' : text,
        duration: duration,
        rows: result.rows?.length || 0
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }
};

// Cerrar pool de conexiones
export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Verificar conexión
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    console.log('🕐 Hora del servidor:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    return false;
  }
};

export default { query, getConnection, testConnection, closePool };