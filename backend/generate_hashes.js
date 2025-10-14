// Script para generar hashes bcrypt correctos
import bcrypt from 'bcryptjs';

const passwords = [
  { user: 'admin', password: 'admin123' },
  { user: 'tecnico1', password: 'tecnico123' },
  { user: 'empleado1', password: 'empleado123' }
];

async function generateHashes() {
  console.log('Generando hashes bcrypt...\n');
  
  for (const { user, password } of passwords) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`${user}:`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash: ${hash}\n`);
  }
}

generateHashes().catch(console.error);
