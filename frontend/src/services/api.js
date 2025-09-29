import axios from 'axios';
import { API_BASE_URL, TIMEOUTS } from '../utils/constants.js';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar responses y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Manejar errores de red
    if (error.code === 'ECONNABORTED') {
      error.message = 'Tiempo de espera agotado. Verifica tu conexión a internet.';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Error de conexión. Verifica que el servidor esté disponible.';
    }

    return Promise.reject(error);
  }
);

// Funciones helper para diferentes tipos de requests
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data, config = {}) => api.post(url, data, config);
export const apiPut = (url, data, config = {}) => api.put(url, data, config);
export const apiPatch = (url, data, config = {}) => api.patch(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

// Función para hacer upload de archivos
export const apiUpload = (url, formData, onProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: TIMEOUTS.FILE_UPLOAD,
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Función para descargar archivos
export const apiDownload = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    // Crear enlace temporal para descarga
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  } catch (error) {
    throw error;
  }
};

// Función para construir URLs con query parameters
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl, API_BASE_URL);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  return url.pathname + url.search;
};

// Función para manejar errores de API de forma consistente
export const handleApiError = (error) => {
  let message = 'Ha ocurrido un error inesperado';
  let details = null;

  if (error.response) {
    // El servidor respondió con un código de error
    const { data, status } = error.response;
    
    if (data?.message) {
      message = data.message;
    } else if (status >= 500) {
      message = 'Error interno del servidor. Intenta más tarde.';
    } else if (status === 404) {
      message = 'El recurso solicitado no fue encontrado.';
    } else if (status === 403) {
      message = 'No tienes permisos para realizar esta acción.';
    } else if (status === 400) {
      message = 'Datos de entrada inválidos.';
    }

    if (data?.errors) {
      details = data.errors;
    }
  } else if (error.request) {
    // La request fue hecha pero no se recibió respuesta
    message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
    // Error en la configuración de la request
    message = error.message || message;
  }

  return {
    message,
    details,
    status: error.response?.status,
    code: error.code,
  };
};

// Función para setear el token de autenticación
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Función para obtener el token actual
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default api;