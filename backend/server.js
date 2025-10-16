import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import ticketRoutes from './src/routes/tickets.js';
import notificationRoutes from './src/routes/notifications.js';
import categoriesRoutes from './src/routes/categories.js';
import prioritiesRoutes from './src/routes/priorities.js';
import ticketStatusesRoutes from './src/routes/ticketStatuses.js';

// Middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { notFound } from './src/middleware/notFound.js';

// Utils
import { connectDB } from './src/utils/database.js';
import { initializeSocket } from './src/utils/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration - Allow all origins in production
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // Set to false when using origin: '*'
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'SGTS FARMASHAIO API está funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check users in production
app.get('/debug/users', async (req, res) => {
  try {
    const { query } = await import('./src/utils/database.js');
    const result = await query('SELECT email, role, created_at FROM users LIMIT 5');
    res.json({
      message: 'Users in database',
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/priorities', prioritiesRoutes);
app.use('/api/ticket-statuses', ticketStatusesRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize Socket.IO
    initializeSocket(httpServer);
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 SGTS FARMASHAIO API ejecutándose en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 WebSocket activado para notificaciones en tiempo real`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();