import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class UserService {
  // Obtener lista de usuarios
  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;
    
    const response = await apiGet(url);
    return response.data;
  }

  // Obtener usuario por ID
  async getUserById(id) {
    const response = await apiGet(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  }

  // Crear nuevo usuario
  async createUser(userData) {
    const response = await apiPost(API_ENDPOINTS.USERS, userData);
    return response.data;
  }

  // Actualizar usuario
  async updateUser(id, userData) {
    const response = await apiPut(`${API_ENDPOINTS.USERS}/${id}`, userData);
    return response.data;
  }

  // Eliminar usuario
  async deleteUser(id) {
    const response = await apiDelete(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  }

  // Obtener técnicos disponibles
  async getTechnicians() {
    const response = await apiGet(API_ENDPOINTS.TECHNICIANS);
    return response.data?.data?.technicians || [];
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(id, isActive) {
    const response = await apiPut(`${API_ENDPOINTS.USERS}/${id}/status`, {
      isActive
    });
    return response.data;
  }

  // Resetear contraseña
  async resetPassword(id) {
    const response = await apiPost(`${API_ENDPOINTS.USERS}/${id}/reset-password`);
    return response.data;
  }

  // Obtener estadísticas de usuarios
  async getUserStats() {
    const response = await apiGet(API_ENDPOINTS.USER_STATS);
    return response.data;
  }

  // Buscar usuarios
  async searchUsers(searchQuery) {
    const response = await apiPost(`${API_ENDPOINTS.USERS}/search`, {
      query: searchQuery
    });
    return response.data;
  }
}

export const userService = new UserService();