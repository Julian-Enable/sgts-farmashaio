const bcrypt = require('bcryptjs');

const testPasswords = async () => {
  const plainPassword = 'admin123';
  const hashFromDB = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RKoydKb.K';
  
  console.log('🔐 Probando contraseña:');
  console.log('Texto plano:', plainPassword);
  console.log('Hash de DB:', hashFromDB);
  
  const isValid = await bcrypt.compare(plainPassword, hashFromDB);
  console.log('¿Coincide?:', isValid);
  
  // También probemos generar un hash nuevo para comparar
  const newHash = await bcrypt.hash(plainPassword, 12);
  console.log('Nuevo hash:', newHash);
  
  const testNew = await bcrypt.compare(plainPassword, newHash);
  console.log('¿Nuevo hash coincide?:', testNew);
};

testPasswords();