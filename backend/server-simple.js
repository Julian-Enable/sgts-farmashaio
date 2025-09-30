import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001; // Fixed port for testing

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'SGTS FARMASHAIO API está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Test simple auth route
app.post('/api/auth/login', (req, res) => {
  console.log('📝 Login request received:', req.body);
  res.status(200).json({ 
    success: true,
    message: 'Servidor funcionando - prueba exitosa',
    timestamp: new Date().toISOString()
  });
});

console.log('🔄 Iniciando servidor simple...');

app.listen(PORT, () => {
  console.log(`🚀 SGTS FARMASHAIO API (SIMPLE) ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

console.log('✅ Servidor configurado correctamente');