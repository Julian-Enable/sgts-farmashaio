import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validaciones de entrada
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const registerValidation = [
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

const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder 50 caracteres'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El apellido no puede exceder 50 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('El departamento no puede exceder 100 caracteres')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número')
];

// Rutas públicas
router.post('/login', loginValidation, authController.login);

// Rutas protegidas
router.use(authenticateToken);

// Rutas de perfil
router.get('/profile', authController.getProfile);
router.put('/profile', updateProfileValidation, authController.updateProfile);
router.post('/change-password', changePasswordValidation, authController.changePassword);
router.post('/verify-token', authController.verifyToken);
router.post('/logout', authController.logout);

export default router;