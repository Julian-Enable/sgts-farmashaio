import { apiGet, apiPost, apiPut } from './api.js';
import { API_ENDPOINTS } from '../utils/constants.js';

class AuthService {
  // Iniciar sesión
  async login(credentials) {
    const response = await apiPost(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  // Cerrar sesión
  async logout() {
    try {
      const response = await apiPost(API_ENDPOINTS.LOGOUT);
      return response.data;
    } catch (error) {
      // Incluso si falla, limpiar datos locales
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Obtener perfil del usuario
  async getProfile() {
    const response = await apiGet(API_ENDPOINTS.PROFILE);
    return response.data;
  }

  // Actualizar perfil
  async updateProfile(profileData) {
    const response = await apiPut(API_ENDPOINTS.PROFILE, profileData);
    return response.data;
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    const response = await apiPost(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  }

  // Verificar token
  async verifyToken() {
    const response = await apiPost(API_ENDPOINTS.VERIFY_TOKEN);
    return response.data;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener usuario del localStorage
  getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Limpiar datos de autenticación
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Verificar si el token ha expirado
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decodificar el payload del JWT (sin verificar la firma)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Obtener información del token
  getTokenInfo() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
        expiresAt: new Date(payload.exp * 1000),
        issuedAt: new Date(payload.iat * 1000),
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Renovar sesión automáticamente
  async refreshSession() {
    if (this.isTokenExpired()) {
      this.clearAuth();
      throw new Error('Token expirado');
    }

    try {
      return await this.verifyToken();
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;