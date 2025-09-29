import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB, query } from '../src/utils/database.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const runSeed = async () => {
  try {
    console.log('🌱 Iniciando seeding de datos iniciales...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Leer y ejecutar los datos iniciales
    const seedPath = join(__dirname, '..', 'database', 'seed.sql');
    const seedData = readFileSync(seedPath, 'utf8');
    
    console.log('📋 Insertando datos iniciales...');
    await query(seedData);
    
    // Verificar datos insertados
    console.log('✅ Seeding completado exitosamente');
    
    // Mostrar resumen de datos
    const [categories, priorities, statuses, users] = await Promise.all([
      query('SELECT COUNT(*) as count FROM categories WHERE is_active = true'),
      query('SELECT COUNT(*) as count FROM priorities WHERE is_active = true'),
      query('SELECT COUNT(*) as count FROM ticket_statuses WHERE is_active = true'),
      query('SELECT COUNT(*) as count FROM users WHERE is_active = true')
    ]);

    console.log('📊 Datos insertados:');
    console.log(`   - ${categories.rows[0].count} categorías`);
    console.log(`   - ${priorities.rows[0].count} prioridades`);
    console.log(`   - ${statuses.rows[0].count} estados de tickets`);
    console.log(`   - ${users.rows[0].count} usuarios`);
    
    console.log('\n👥 Usuarios creados:');
    const userList = await query(
      'SELECT username, email, role FROM users WHERE is_active = true ORDER BY role, username'
    );
    
    userList.rows.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🔐 Contraseñas por defecto:');
    console.log('   - admin: admin123');
    console.log('   - tecnico1: tecnico123');
    console.log('   - empleado1: empleado123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  }
};

runSeed();