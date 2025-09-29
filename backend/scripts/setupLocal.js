import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB, query } from '../src/utils/databaseSqlite.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const runMigrations = async () => {
  try {
    console.log('🔄 Iniciando configuración de base de datos local...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Leer y ejecutar el schema SQLite
    const schemaPath = join(__dirname, '..', 'database', 'sqlite_schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Ejecutando schema de base de datos...');
    
    // Dividir por punto y coma y ejecutar cada statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement + ';');
      }
    }
    
    console.log('✅ Base de datos configurada exitosamente');
    console.log('📊 Tablas creadas:');
    console.log('   - users (usuarios)');
    console.log('   - categories (categorías)');
    console.log('   - priorities (prioridades)');
    console.log('   - ticket_statuses (estados)');
    console.log('   - tickets (tickets)');
    console.log('   - ticket_comments (comentarios)');
    console.log('   - ticket_history (historial)');
    console.log('   - notifications (notificaciones)');
    
    console.log('\n👥 Usuarios creados:');
    console.log('   - admin (admin@farmashaio.com) - administrador');
    console.log('   - tecnico1 (tecnico1@farmashaio.com) - tecnico');
    console.log('   - empleado1 (empleado1@farmashaio.com) - empleado');
    
    console.log('\n🔐 Contraseñas por defecto:');
    console.log('   - admin: admin123');
    console.log('   - tecnico1: tecnico123');
    console.log('   - empleado1: empleado123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en configuración:', error);
    process.exit(1);
  }
};

runMigrations();