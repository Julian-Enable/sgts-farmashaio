import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { catchAsync, createValidationError, createUnauthorizedError, createNotFoundError } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// Iniciar sesión
export const login = catchAsync(async (req, res) => {
  console.log('🔥 === INICIO DE LOGIN ===');
  console.log('📨 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🌍 Headers:', JSON.stringify(req.headers, null, 2));
  
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Errores de validación:', errors.array());
    throw createValidationError('Datos de entrada inválidos');
  }

  const { email, password } = req.body;
  console.log(`🔍 Buscando usuario con email: "${email}"`);
  console.log(`🔐 Password recibida: "${password}" (length: ${password?.length})`);

  // Buscar usuario
  const user = await User.findByEmail(email);
  if (!user) {
    console.log(`❌ Usuario NO encontrado para email: "${email}"`);
    throw createUnauthorizedError('Credenciales inválidas');
  }
  
  console.log(`✅ Usuario encontrado: ${user.email} (ID: ${user.id})`);
  console.log(`👤 Datos usuario:`, {
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    department: user.department
  });

  // Verificar contraseña
  console.log('🔐 Iniciando validación de contraseña...');
  const isValidPassword = await user.validatePassword(password);
  console.log(`🔐 Resultado validación contraseña: ${isValidPassword}`);
  
  if (!isValidPassword) {
    console.log('❌ Contraseña INVÁLIDA');
    throw createUnauthorizedError('Credenciales inválidas');
  }

  // Verificar que el usuario esté activo
  if (!user.isActive) {
    console.log('❌ Usuario INACTIVO');
    throw createUnauthorizedError('Cuenta desactivada. Contacta al administrador.');
  }
  
  console.log('✅ Usuario ACTIVO, procediendo con login...');

  // Actualizar último login
  await user.updateLastLogin();

  // Generar token
  const token = generateToken(user);

  // Respuesta exitosa
  res.status(200).json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: {
      token,
      user: user.toJSON()
    }
  });
});

// Registrar nuevo usuario (solo administradores)
export const register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { username, email, password, firstName, lastName, role, department } = req.body;

  // Verificar que no exista usuario con el mismo username o email
  const existingUser = await User.findByUsername(username) || await User.findByEmail(email);
  if (existingUser) {
    throw createValidationError('El usuario o email ya existe');
  }

  // Crear nuevo usuario
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
    role,
    department
  });

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: {
      user: user.toJSON()
    }
  });
});

// Obtener perfil del usuario actual
export const getProfile = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toJSON()
    }
  });
});

// Actualizar perfil del usuario actual
export const updateProfile = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { firstName, lastName, email, department } = req.body;
  const updateData = {};

  if (firstName) updateData.first_name = firstName;
  if (lastName) updateData.last_name = lastName;
  if (email) updateData.email = email;
  if (department) updateData.department = department;

  // Verificar que el email no esté en uso por otro usuario
  if (email && email !== req.user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser.id !== req.user.id) {
      throw createValidationError('El email ya está en uso por otro usuario');
    }
  }

  const updatedUser = await req.user.update(updateData);

  res.status(200).json({
    success: true,
    message: 'Perfil actualizado exitosamente',
    data: {
      user: updatedUser.toJSON()
    }
  });
});

// Cambiar contraseña
export const changePassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Verificar contraseña actual
  const isValidPassword = await req.user.validatePassword(currentPassword);
  if (!isValidPassword) {
    throw createUnauthorizedError('Contraseña actual incorrecta');
  }

  // Cambiar contraseña
  await req.user.changePassword(newPassword);

  res.status(200).json({
    success: true,
    message: 'Contraseña cambiada exitosamente'
  });
});

// Verificar token (para mantener sesión)
export const verifyToken = catchAsync(async (req, res) => {
  // El middleware de autenticación ya verificó el token
  res.status(200).json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user.toJSON()
    }
  });
});

// Cerrar sesión (invalida el token del lado del cliente)
export const logout = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
});

export default {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  logout
};