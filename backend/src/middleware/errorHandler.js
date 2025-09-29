// Middleware para manejar errores de forma centralizada
export const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de validación de datos
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: err.errors
    });
  }

  // Error de duplicado (PostgreSQL)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      error: 'Dato duplicado'
    });
  }

  // Error de clave foránea (PostgreSQL)
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      error: 'El recurso referenciado no existe'
    });
  }

  // Error de violación de restricción
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      error: 'Los datos no cumplen con las restricciones'
    });
  }

  // Error de conexión a base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Servicio temporalmente no disponible',
      error: 'Error de conexión a la base de datos'
    });
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticación expirado'
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Formato JSON inválido'
    });
  }

  // Error personalizado con status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Error en el servidor'
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Clase para errores personalizados
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Funciones helper para errores comunes
export const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

export const createValidationError = (message) => {
  return new AppError(message, 400);
};

export const createNotFoundError = (resource = 'Recurso') => {
  return new AppError(`${resource} no encontrado`, 404);
};

export const createUnauthorizedError = (message = 'No autorizado') => {
  return new AppError(message, 401);
};

export const createForbiddenError = (message = 'Acceso denegado') => {
  return new AppError(message, 403);
};

export const createConflictError = (message = 'Conflicto con el estado actual del recurso') => {
  return new AppError(message, 409);
};

// Wrapper para funciones async para capturar errores automáticamente
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;