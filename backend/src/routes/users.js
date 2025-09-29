import express from 'express';
import { body, query } from 'express-validator';
import userController from '../controllers/userController.js';
import { authenticateToken, requireAdmin, requireSameUserOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Validaciones de entrada
const createUserValidation = [
  body('username')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  body('firstName')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  body('lastName')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ max: 50 })
    .withMessage('El apellido no puede exceder 50 caracteres'),
  body('role')
    .isIn(['empleado', 'tecnico', 'administrador'])
    .withMessage('El rol debe ser empleado, tecnico o administrador'),
  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El departamento no puede exceder 100 caracteres')
];

const updateUserValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El apellido no puede exceder 50 caracteres'),
  body('role')
    .optional()
    .isIn(['empleado', 'tecnico', 'administrador'])
    .withMessage('El rol debe ser empleado, tecnico o administrador'),
  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El departamento no puede exceder 100 caracteres')
];

const queryValidation = [
  query('role')
    .optional()
    .isIn(['empleado', 'tecnico', 'administrador'])
    .withMessage('El rol debe ser empleado, tecnico o administrador'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100')
];

// Rutas para obtener usuarios
router.get('/', requireAdmin, queryValidation, userController.getUsers);
router.get('/stats', requireAdmin, userController.getUserStats);
router.get('/technicians', userController.getTechnicians);
router.get('/:id', requireSameUserOrAdmin, userController.getUserById);

// Rutas para crear y modificar usuarios
router.post('/', requireAdmin, createUserValidation, userController.createUser);
router.put('/:id', requireSameUserOrAdmin, updateUserValidation, userController.updateUser);
router.patch('/:id/toggle-status', requireAdmin, userController.toggleUserStatus);

// Ruta para restablecer contraseña (solo administradores)
router.post('/:id/reset-password', requireAdmin, [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], userController.resetUserPassword);

export default router;