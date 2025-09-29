import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    
    // Verificar la conexión
    const result = await client.query('SELECT NOW()');
    console.log('📅 Timestamp de la base de datos:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    throw error;
  }
};

// Función para ejecutar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query ejecutado:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Error en query:', { text, error: error.message });
    throw error;
  }
};

// Función para obtener un cliente de la pool para transacciones
export const getClient = async () => {
  return await pool.connect();
};

export default pool;