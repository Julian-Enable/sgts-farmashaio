import { connectDB, query } from '../src/utils/databaseSqlite.js';
import bcrypt from 'bcryptjs';

const updatePasswords = async () => {
  try {
    await connectDB();
    
    console.log('🔐 Actualizando contraseñas de usuarios...');
    
    // Hashear las contraseñas correctamente
    const adminHash = await bcrypt.hash('admin123', 12);
    const tecnicoHash = await bcrypt.hash('tecnico123', 12);
    const empleadoHash = await bcrypt.hash('empleado123', 12);
    
    // Actualizar contraseñas
    await query('UPDATE users SET password_hash = ? WHERE username = ?', [adminHash, 'admin']);
    await query('UPDATE users SET password_hash = ? WHERE username = ?', [tecnicoHash, 'tecnico1']);
    await query('UPDATE users SET password_hash = ? WHERE username = ?', [empleadoHash, 'empleado1']);
    
    console.log('✅ Contraseñas actualizadas correctamente');
    
    // Verificar usuarios
    console.log('\n👥 Usuarios actualizados:');
    const users = await query('SELECT id, username, email, role, password_hash FROM users');
    users.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Rol: ${user.role}`);
      console.log(`    Hash: ${user.password_hash.substring(0, 20)}...`);
    });
    
    console.log('\n🎉 ¡Ahora puedes hacer login con:');
    console.log('📧 admin@farmashaio.com / admin123');
    console.log('📧 tecnico1@farmashaio.com / tecnico123');
    console.log('📧 empleado1@farmashaio.com / empleado123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updatePasswords();