import { Server } from 'socket.io';

let io;

// Inicializar Socket.IO
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // Unirse a una sala de usuario (para notificaciones personalizadas)
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Usuario ${userId} se unió a su sala`);
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });

  console.log('🔌 Socket.IO inicializado');
  return io;
};

// Obtener instancia de Socket.IO
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
};

// Emitir notificación a un usuario específico
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
    console.log(`📤 Notificación enviada a usuario ${userId}:`, event);
  }
};

// Emitir notificación a todos los usuarios
export const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`📢 Notificación enviada a todos:`, event);
  }
};

// Emitir notificación a usuarios con rol específico
export const emitToRole = (role, event, data) => {
  if (io) {
    io.to(`role_${role}`).emit(event, data);
    console.log(`📤 Notificación enviada al rol ${role}:`, event);
  }
};

export default {
  initializeSocket,
  getIO,
  emitToUser,
  emitToAll,
  emitToRole,
};
