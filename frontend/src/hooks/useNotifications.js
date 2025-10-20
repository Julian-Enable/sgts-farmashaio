import { useEffect, useState, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones existentes de la API
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await notificationService.getNotifications({ 
          page: 1, 
          limit: 50 
        });
        
        const apiNotifications = (response.notifications || []).map(notif => ({
          id: notif.id,
          type: notif.type,
          message: notif.message,
          data: {
            id: notif.ticket_id,
            ticketNumber: notif.ticket_number,
            title: notif.ticket_title,
          },
          timestamp: notif.created_at,
          read: notif.is_read,
        }));
        
        setNotifications(apiNotifications);
        setUnreadCount(apiNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error cargando notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  // Conectar al WebSocket cuando el usuario esté autenticado
  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);

      // Cleanup al desmontar
      return () => {
        socketService.disconnect();
      };
    }
  }, [user?.id]);

  // Escuchar nuevas notificaciones
  useEffect(() => {
    const unsubscribe = socketService.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Mostrar notificación del navegador si está permitido
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nueva Notificación - SGTS', {
          body: notification.message || 'Tienes una nueva notificación',
          icon: '/logo.png',
          tag: notification.id,
        });
      }

      // Reproducir sonido (opcional)
      playNotificationSound();
    });

    return unsubscribe;
  }, []);

  // Escuchar eventos de tickets
  useEffect(() => {
    const unsubTicketCreated = socketService.on('ticket:created', (data) => {
      const notification = {
        id: Date.now(),
        type: 'ticket_created',
        message: `Nuevo ticket creado: ${data.title}`,
        data,
        timestamp: new Date(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    const unsubTicketUpdated = socketService.on('ticket:updated', (data) => {
      const notification = {
        id: Date.now(),
        type: 'ticket_updated',
        message: `Ticket actualizado: ${data.title}`,
        data,
        timestamp: new Date(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    const unsubTicketAssigned = socketService.on('ticket:assigned', (data) => {
      const notification = {
        id: Date.now(),
        type: 'ticket_assigned',
        message: `Se te ha asignado el ticket: ${data.title}`,
        data,
        timestamp: new Date(),
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      unsubTicketCreated();
      unsubTicketUpdated();
      unsubTicketAssigned();
    };
  }, []);

  // Solicitar permisos de notificaciones del navegador
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Marcar como leída (sincroniza con backend)
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  }, []);

  // Marcar todas como leídas (sincroniza con backend)
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  }, []);

  // Limpiar notificaciones (sincroniza con backend)
  const clearNotifications = useCallback(async () => {
    try {
      // Eliminar cada notificación en el backend
      await Promise.all(notifications.map(n => notificationService.deleteNotification(n.id)));
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error limpiando notificaciones:', error);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestNotificationPermission,
    isConnected: socketService.isConnected(),
  };
};

// Reproducir sonido de notificación
const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('No se pudo reproducir el sonido:', err));
  } catch (error) {
    // Silenciosamente ignorar errores de audio
  }
};
