import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB, query } from '../src/utils/database.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const runMigrations = async () => {
  try {
    console.log('🔄 Iniciando migración de base de datos...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Leer y ejecutar el schema
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Ejecutando schema de base de datos...');
    await query(schema);
    
    console.log('✅ Migración completada exitosamente');
    console.log('📊 Tablas creadas:');
    console.log('   - users (usuarios)');
    console.log('   - categories (categorías)');
    console.log('   - priorities (prioridades)');
    console.log('   - ticket_statuses (estados)');
    console.log('   - tickets (tickets)');
    console.log('   - ticket_comments (comentarios)');
    console.log('   - ticket_attachments (archivos adjuntos)');
    console.log('   - ticket_history (historial)');
    console.log('   - notifications (notificaciones)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
};

runMigrations();