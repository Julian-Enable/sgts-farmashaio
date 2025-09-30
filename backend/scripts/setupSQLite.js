import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB, query } from '../src/utils/databaseSqlite.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const setupSQLiteDatabase = async () => {
  try {
    console.log('🔄 Iniciando configuración de base de datos SQLite...');
    
    // Conectar a la base de datos SQLite
    await connectDB();
    
    // Leer y ejecutar el schema SQLite
    const schemaPath = join(__dirname, '..', 'database', 'sqlite_schema.sql');
    console.log('📋 Leyendo esquema desde:', schemaPath);
    
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Dividir el schema en statements individuales
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log('📋 Ejecutando schema de base de datos SQLite...');
    
    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (cleanStatement) {
        try {
          await query(cleanStatement);
        } catch (error) {
          // Ignorar errores de "already exists" 
          if (!error.message.includes('already exists') && !error.message.includes('UNIQUE constraint failed')) {
            console.warn('⚠️ Warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Base de datos SQLite configurada exitosamente');
    console.log('📊 Tablas creadas:');
    console.log('   - users (usuarios)');
    console.log('   - categories (categorías)');
    console.log('   - priorities (prioridades)');
    console.log('   - ticket_statuses (estados)');
    console.log('   - tickets (tickets)');
    console.log('   - ticket_comments (comentarios)');
    console.log('   - ticket_history (historial)');
    console.log('   - notifications (notificaciones)');
    
    console.log('👥 Usuarios por defecto creados:');
    console.log('   - admin / admin@farmashaio.com (contraseña: admin123)');
    console.log('   - tecnico1 / tecnico1@farmashaio.com (contraseña: tecnico123)');
    console.log('   - empleado1 / empleado1@farmashaio.com (contraseña: empleado123)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en configuración de SQLite:', error);
    process.exit(1);
  }
};

setupSQLiteDatabase();