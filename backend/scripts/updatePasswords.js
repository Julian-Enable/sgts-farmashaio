import bcrypt from 'bcryptjs';
import { connectDB, query } from '../src/utils/databaseSqlite.js';

async function updateUserPasswords() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();

    console.log('🔐 Generando hashes de contraseñas...');
    
    // Generar hashes para las contraseñas
    const adminHash = await bcrypt.hash('admin123', 12);
    const tecnicoHash = await bcrypt.hash('tecnico123', 12);
    const empleadoHash = await bcrypt.hash('empleado123', 12);

    console.log('✍️ Actualizando contraseñas en la base de datos...');

    // Actualizar contraseña del admin
    await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [adminHash, 'admin@farmashaio.com']
    );

    // Actualizar contraseña del técnico
    await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [tecnicoHash, 'tecnico1@farmashaio.com']
    );

    // Actualizar contraseña del empleado
    await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [empleadoHash, 'empleado1@farmashaio.com']
    );

    console.log('✅ Contraseñas actualizadas exitosamente');
    
    // Verificar los usuarios actualizados
    console.log('📋 Verificando usuarios en la base de datos:');
    const users = await query('SELECT id, username, email, role FROM users');
    
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Admin: admin@farmashaio.com / admin123');
    console.log('   Técnico: tecnico1@farmashaio.com / tecnico123');
    console.log('   Empleado: empleado1@farmashaio.com / empleado123');

  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error.message);
    process.exit(1);
  }
}

updateUserPasswords();