import { apiGet, apiPut, apiDelete } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class NotificationService {
  // Obtener notificaciones del usuario
  async getNotifications(options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString()
    });

    const response = await apiGet(`${API_ENDPOINTS.NOTIFICATIONS}?${params.toString()}`);
    // Backend retorna: { success: true, data: { notifications: [...], pagination: {...} } }
    // Axios lo envuelve: response.data = { success: true, data: { notifications: [...], pagination: {...} } }
    // Retornamos el objeto 'data' interno
    return response.data.data || { notifications: [], pagination: {} };
  }

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    const response = await apiPut(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`);
    return response.data;
  }

  // Marcar todas como leídas
  async markAllAsRead() {
    const response = await apiPut(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`);
    return response.data;
  }

  // Eliminar notificación
  async deleteNotification(notificationId) {
    const response = await apiDelete(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`);
    return response.data;
  }

  // Obtener contador de no leídas
  async getUnreadCount() {
    const response = await this.getNotifications({ unreadOnly: true, limit: 1 });
    return response.pagination?.totalItems || 0;
  }
}

export const notificationService = new NotificationService();
