import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService.js';

// Estados del contexto de autenticación
const authInitialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Acciones del reducer
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION',
};

// Reducer de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...authInitialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(credentials);
      const { user, token } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success(`¡Bienvenido, ${user.firstName}!`);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.info('Sesión cerrada correctamente');
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser = response.data.user;

      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser
      });

      toast.success('Perfil actualizado correctamente');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Contraseña cambiada correctamente');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función para verificar token
  const verifyToken = async () => {
    try {
      const response = await authService.verifyToken();
      const { user } = response.data;

      // Actualizar datos del usuario
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: user
      });

      return true;
    } catch (error) {
      // Token inválido o expirado
      logout();
      return false;
    }
  };

  // Función para restaurar sesión desde localStorage
  const restoreSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);

        // Verificar que el token siga siendo válido
        const isValid = await verifyToken();

        if (isValid) {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user, token }
          });
          return true;
        }
      }
    } catch (error) {
      console.error('Error restaurando sesión:', error);
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    return false;
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Función para verificar permisos
  const hasRole = (roles) => {
    if (!state.user) return false;
    
    const userRole = state.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return allowedRoles.includes(userRole);
  };

  // Función para verificar si es administrador
  const isAdmin = () => hasRole('administrador');

  // Función para verificar si es técnico o administrador
  const isTechnicianOrAdmin = () => hasRole(['tecnico', 'administrador']);

  // Efecto para restaurar sesión al montar el componente
  useEffect(() => {
    restoreSession();
  }, []);

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Acciones
    login,
    logout,
    updateProfile,
    changePassword,
    verifyToken,
    clearError,
    
    // Utilidades
    hasRole,
    isAdmin,
    isTechnicianOrAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;