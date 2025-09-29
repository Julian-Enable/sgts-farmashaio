import { User } from '../models/User.js';
import { catchAsync, createValidationError, createNotFoundError, createForbiddenError } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// Obtener todos los usuarios (solo administradores)
export const getUsers = catchAsync(async (req, res) => {
  const { role, department, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (role) filters.role = role;
  if (department) filters.department = department;

  const users = await User.findAll(filters);

  res.status(200).json({
    success: true,
    data: {
      users: users.map(user => user.toJSON()),
      total: users.length
    }
  });
});

// Obtener usuario por ID
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    throw createNotFoundError('Usuario');
  }

  res.status(200).json({
    success: true,
    data: {
      user: user.toJSON()
    }
  });
});

// Crear nuevo usuario (solo administradores)
export const createUser = catchAsync(async (req, res) => {
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

  // Crear usuario
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

// Actualizar usuario
export const updateUser = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const { username, email, firstName, lastName, role, department } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw createNotFoundError('Usuario');
  }

  // Solo administradores pueden cambiar roles
  if (role && req.user.role !== 'administrador') {
    throw createForbiddenError('No tienes permisos para cambiar roles');
  }

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (firstName) updateData.first_name = firstName;
  if (lastName) updateData.last_name = lastName;
  if (role && req.user.role === 'administrador') updateData.role = role;
  if (department) updateData.department = department;

  // Verificar duplicados
  if (username && username !== user.username) {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw createValidationError('El nombre de usuario ya existe');
    }
  }

  if (email && email !== user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw createValidationError('El email ya está en uso');
    }
  }

  const updatedUser = await user.update(updateData);

  res.status(200).json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: {
      user: updatedUser.toJSON()
    }
  });
});

// Desactivar/activar usuario
export const toggleUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    throw createNotFoundError('Usuario');
  }

  // No permitir desactivarse a sí mismo
  if (user.id === req.user.id) {
    throw createForbiddenError('No puedes desactivar tu propia cuenta');
  }

  const updatedUser = await user.update({
    is_active: !user.isActive
  });

  res.status(200).json({
    success: true,
    message: `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} exitosamente`,
    data: {
      user: updatedUser.toJSON()
    }
  });
});

// Restablecer contraseña de usuario (solo administradores)
export const resetUserPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    throw createValidationError('La nueva contraseña debe tener al menos 6 caracteres');
  }

  const user = await User.findById(id);
  if (!user) {
    throw createNotFoundError('Usuario');
  }

  await user.changePassword(newPassword);

  res.status(200).json({
    success: true,
    message: 'Contraseña restablecida exitosamente'
  });
});

// Obtener técnicos disponibles
export const getTechnicians = catchAsync(async (req, res) => {
  const technicians = await User.getTechnicians();

  res.status(200).json({
    success: true,
    data: {
      technicians: technicians.map(tech => ({
        id: tech.id,
        name: `${tech.firstName} ${tech.lastName}`,
        username: tech.username,
        email: tech.email,
        department: tech.department
      }))
    }
  });
});

// Obtener estadísticas de usuarios
export const getUserStats = catchAsync(async (req, res) => {
  const allUsers = await User.findAll();
  
  const stats = {
    total: allUsers.length,
    byRole: {
      administrador: allUsers.filter(u => u.role === 'administrador').length,
      tecnico: allUsers.filter(u => u.role === 'tecnico').length,
      empleado: allUsers.filter(u => u.role === 'empleado').length
    },
    active: allUsers.filter(u => u.isActive).length,
    inactive: allUsers.filter(u => !u.isActive).length
  };

  res.status(200).json({
    success: true,
    data: { stats }
  });
});

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  resetUserPassword,
  getTechnicians,
  getUserStats
};