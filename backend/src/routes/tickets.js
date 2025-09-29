import express from 'express';
import { body, query, param } from 'express-validator';
import ticketController from '../controllers/ticketController.js';
import { authenticateToken, requireTechnicianOrAdmin, requireTicketAccess } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Validaciones de entrada
const createTicketValidation = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 5, max: 200 })
    .withMessage('El título debe tener entre 5 y 200 caracteres'),
  body('description')
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('category')
    .optional()
    .isString()
    .withMessage('Categoría inválida'),
  body('priority')
    .optional()
    .isString()
    .withMessage('Prioridad inválida')
];

const updateTicketValidation = [
  param('id')
    .isNumeric()
    .withMessage('ID de ticket inválido'),
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('El título debe tener entre 5 y 200 caracteres'),
  body('description')
    .optional()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('category')
    .optional()
    .isString()
    .withMessage('Categoría inválida'),
  body('priority')
    .optional()
    .isString()
    .withMessage('Prioridad inválida'),
  body('status')
    .optional()
    .isIn(['abierto', 'en_progreso', 'resuelto', 'cerrado'])
    .withMessage('Estado inválido')
];

const assignTicketValidation = [
  param('id')
    .isNumeric()
    .withMessage('ID de ticket inválido'),
  body('assignedTo')
    .isNumeric()
    .withMessage('ID del técnico inválido')
];

const changeStatusValidation = [
  param('id')
    .isNumeric()
    .withMessage('ID de ticket inválido'),
  body('status')
    .isIn(['abierto', 'en_progreso', 'resuelto', 'cerrado'])
    .withMessage('Estado inválido')
];

const addCommentValidation = [
  param('id')
    .isNumeric()
    .withMessage('ID de ticket inválido'),
  body('content')
    .notEmpty()
    .withMessage('El contenido del comentario es requerido')
    .isLength({ min: 1, max: 1000 })
    .withMessage('El comentario debe tener entre 1 y 1000 caracteres')
];

const queryValidation = [
  query('status')
    .optional()
    .isString()
    .withMessage('Estado inválido'),
  query('category')
    .optional()
    .isString()
    .withMessage('Categoría inválida'),
  query('priority')
    .optional()
    .isString()
    .withMessage('Prioridad inválida'),
  query('assignedTo')
    .optional()
    .isNumeric()
    .withMessage('ID de usuario asignado inválido'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),
  query('orderBy')
    .optional()
    .isIn(['created_at', 'updated_at', 'title', 'priority_level'])
    .withMessage('Campo de ordenamiento inválido'),
  query('orderDirection')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Dirección de ordenamiento inválida')
];

// Rutas públicas (para todos los usuarios autenticados)
router.get('/filters', ticketController.getTicketFilters);
router.get('/stats', ticketController.getTicketStats);
router.get('/', queryValidation, ticketController.getTickets);
router.post('/', createTicketValidation, ticketController.createTicket);

// Rutas para tickets específicos
router.get('/:id', requireTicketAccess, ticketController.getTicketById);
router.put('/:id', requireTicketAccess, updateTicketValidation, ticketController.updateTicket);
router.post('/:id/comments', requireTicketAccess, addCommentValidation, ticketController.addComment);

// Rutas que requieren permisos de técnico o administrador
router.post('/:id/assign', requireTechnicianOrAdmin, assignTicketValidation, ticketController.assignTicket);
router.patch('/:id/status', requireTicketAccess, changeStatusValidation, ticketController.changeTicketStatus);

export default router;