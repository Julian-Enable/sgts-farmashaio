// Configuración automática de base de datos según entorno
import dotenv from 'dotenv';
dotenv.config();

// Importar módulos de base de datos
let dbModule;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // En producción usar PostgreSQL
  dbModule = await import('./databasePostgres.js');
  console.log('🗄️ Usando PostgreSQL (Producción)');
} else {
  // En desarrollo usar SQLite
  dbModule = await import('./databaseSqlite.js');
  console.log('�️ Usando SQLite (Desarrollo)');
}

// Exportar funciones del módulo seleccionado
export const { query, testConnection, closePool } = dbModule;

// Función de conexión unificada para compatibilidad
export const connectDB = async () => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      return true;
    }
    throw new Error('No se pudo establecer la conexión');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    throw error;
  }
};