import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Middleware de autenticación JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario aún existe y está activo
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

// Middleware para verificar si el usuario es administrador
export const requireAdmin = requireRole(['administrador']);

// Middleware para verificar si el usuario es técnico o administrador
export const requireTechnicianOrAdmin = requireRole(['tecnico', 'administrador']);

// Middleware para verificar si es el mismo usuario o un administrador
export const requireSameUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado'
    });
  }

  const targetUserId = req.params.id || req.params.userId;
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'administrador';

  if (currentUserId !== targetUserId && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'No puedes acceder a datos de otros usuarios'
    });
  }

  next();
};

// Middleware para verificar permisos de ticket
export const requireTicketAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado'
      });
    }

    const ticketId = req.params.id || req.params.ticketId;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Los administradores y técnicos tienen acceso a todos los tickets
    if (userRole === 'administrador' || userRole === 'tecnico') {
      return next();
    }

    // Los empleados solo pueden acceder a sus propios tickets
    if (userRole === 'empleado') {
      const { query } = await import('../utils/database.js');
      const result = await query(
        'SELECT requester_id FROM tickets WHERE id = $1',
        [ticketId]
      );

      if (!result.rows[0]) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado'
        });
      }

      if (result.rows[0].requester_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este ticket'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error verificando permisos de ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Generar token JWT
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

export default {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireTechnicianOrAdmin,
  requireSameUserOrAdmin,
  requireTicketAccess,
  generateToken
};