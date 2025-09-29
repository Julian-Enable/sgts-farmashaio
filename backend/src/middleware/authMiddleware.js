import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { createUnauthorizedError, createForbiddenError } from './errorHandler.js';

// Generar JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Middleware para verificar token JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createUnauthorizedError('Token de acceso requerido');
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en base de datos
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createUnauthorizedError('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw createUnauthorizedError('Cuenta desactivada');
    }

    // Agregar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createUnauthorizedError('Token inválido'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createUnauthorizedError('Token expirado'));
    }
    next(error);
  }
};

// Middleware para requerir rol específico
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createUnauthorizedError('Usuario no autenticado'));
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return next(createForbiddenError('No tienes permisos para realizar esta acción'));
    }

    next();
  };
};

// Middleware para requerir rol de administrador
export const requireAdmin = (req, res, next) => {
  return requireRole('administrador')(req, res, next);
};

// Middleware para requerir rol de técnico o administrador
export const requireTechnicianOrAdmin = (req, res, next) => {
  return requireRole(['tecnico', 'administrador'])(req, res, next);
};

// Middleware para verificar acceso al mismo usuario o ser administrador
export const requireSameUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return next(createUnauthorizedError('Usuario no autenticado'));
  }

  const requestedUserId = req.params.id;
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'administrador';

  if (!isAdmin && currentUserId !== requestedUserId) {
    return next(createForbiddenError('Solo puedes acceder a tu propia información'));
  }

  next();
};

// Middleware para verificar acceso a tickets
export const requireTicketAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createUnauthorizedError('Usuario no autenticado'));
    }

    const ticketId = req.params.id;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Administradores y técnicos tienen acceso completo
    if (userRole === 'administrador' || userRole === 'tecnico') {
      return next();
    }

    // Empleados solo pueden acceder a sus propios tickets
    if (userRole === 'empleado') {
      const { query } = await import('../utils/database.js');
      const result = await query(
        'SELECT requester_id FROM tickets WHERE id = $1',
        [ticketId]
      );

      if (!result.rows[0]) {
        return next(createNotFoundError('Ticket'));
      }

      if (result.rows[0].requester_id !== userId) {
        return next(createForbiddenError('Solo puedes acceder a tus propios tickets'));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default {
  generateToken,
  authenticateToken,
  requireRole,
  requireAdmin,
  requireTechnicianOrAdmin,
  requireSameUserOrAdmin,
  requireTicketAccess,
};