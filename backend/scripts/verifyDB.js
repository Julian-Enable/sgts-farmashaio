import { connectDB, query } from '../src/utils/databaseSqlite.js';

const verifyTables = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Verificando tablas en SQLite...');
    const result = await query('SELECT name FROM sqlite_master WHERE type="table"');
    
    console.log('📊 Tablas en la base de datos:');
    result.rows.forEach(row => console.log('  -', row.name));
    
    console.log('\n👥 Verificando usuarios:');
    const users = await query('SELECT id, username, email, role FROM users');
    users.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Rol: ${user.role}`);
    });
    
    console.log('\n✅ Base de datos verificada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

verifyTables();