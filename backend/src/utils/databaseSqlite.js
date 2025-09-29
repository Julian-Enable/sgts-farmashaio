import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

let db = null;

// Configuración de la base de datos SQLite para desarrollo local
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // En producción usar PostgreSQL
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      const client = await pool.connect();
      console.log('✅ Conexión a PostgreSQL establecida correctamente');
      client.release();
      return pool;
    } else {
      // En desarrollo usar SQLite
      const dbPath = join(__dirname, '..', '..', 'database', 'sgts_local.db');
      
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      
      console.log('✅ Conexión a SQLite establecida correctamente');
      console.log('📁 Base de datos local:', dbPath);
      return db;
    }
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    throw error;
  }
};

// Función para ejecutar queries
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    let result;
    
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      // PostgreSQL query
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      result = await pool.query(text, params);
      await pool.end();
    } else {
      // SQLite query
      if (!db) await connectDB();
      
      // Convertir query de PostgreSQL a SQLite
      const sqliteQuery = text
        .replace(/\$(\d+)/g, '?') // Cambiar $1, $2 por ?
        .replace(/uuid_generate_v4\(\)/g, 'lower(hex(randomblob(16)))') // UUID
        .replace(/CURRENT_TIMESTAMP/g, 'datetime("now")') // Timestamps
        .replace(/BOOLEAN/g, 'INTEGER') // Boolean
        .replace(/UUID/g, 'TEXT') // UUID como TEXT
        .replace(/SERIAL/g, 'INTEGER PRIMARY KEY AUTOINCREMENT'); // Serial
      
      if (sqliteQuery.toLowerCase().includes('select')) {
        const rows = await db.all(sqliteQuery, params);
        result = { rows, rowCount: rows.length };
      } else {
        const info = await db.run(sqliteQuery, params);
        result = { 
          rows: [{ id: info.lastID }], 
          rowCount: info.changes 
        };
      }
    }
    
    const duration = Date.now() - start;
    console.log('📊 Query ejecutado:', { text: text.substring(0, 100), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Error en query:', { text: text.substring(0, 100), error: error.message });
    throw error;
  }
};

// Función para obtener un cliente (SQLite no necesita pool)
const getClient = async () => {
  if (!db) await connectDB();
  return db;
};

export { connectDB, query, getClient };
export default { connectDB, query, getClient };