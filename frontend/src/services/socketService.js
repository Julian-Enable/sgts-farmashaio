import { io } from 'socket.io-client';
import { API_CONFIG } from '../utils/constants.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Conectar al servidor WebSocket
  connect(userId) {
    if (this.socket?.connected) {
      console.log('✅ Socket ya está conectado');
      return;
    }

    const socketUrl = API_CONFIG.BASE_URL.replace('/api', '');
    
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Conectado al servidor WebSocket');
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error);
    });

    // Eventos de notificaciones
    this.socket.on('notification', (data) => {
      console.log('🔔 Nueva notificación:', data);
      this.triggerListeners('notification', data);
    });

    this.socket.on('ticket:created', (data) => {
      console.log('🎫 Nuevo ticket creado:', data);
      this.triggerListeners('ticket:created', data);
    });

    this.socket.on('ticket:updated', (data) => {
      console.log('📝 Ticket actualizado:', data);
      this.triggerListeners('ticket:updated', data);
    });

    this.socket.on('ticket:assigned', (data) => {
      console.log('👤 Ticket asignado:', data);
      this.triggerListeners('ticket:assigned', data);
    });

    this.socket.on('ticket:commented', (data) => {
      console.log('💬 Nuevo comentario en ticket:', data);
      this.triggerListeners('ticket:commented', data);
    });
  }

  // Desconectar del servidor
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('🔌 Socket desconectado manualmente');
    }
  }

  // Suscribirse a eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Retornar función para desuscribirse
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Disparar listeners
  triggerListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Verificar si está conectado
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();
export default socketService;
