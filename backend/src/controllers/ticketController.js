import { Ticket } from '../models/Ticket.js';
import { query } from '../utils/database.js';
import { catchAsync, createValidationError, createNotFoundError, createForbiddenError } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';

// Crear nuevo ticket
export const createTicket = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { title, description, categoryId, priorityId, dueDate, affectedUsers } = req.body;

  // Validar que se envíen los IDs requeridos
  if (!categoryId || !priorityId) {
    return res.status(400).json({
      success: false,
      message: 'categoryId y priorityId son requeridos'
    });
  }

  // Estado por defecto: "Nuevo" (id: 1)
  const defaultStatusId = 1;

  // Crear ticket con los IDs directamente
  const ticket = await Ticket.create({
    title,
    description,
    requesterId: req.user.id,
    categoryId: parseInt(categoryId),
    priorityId: parseInt(priorityId),
    statusId: defaultStatusId,
    dueDate: dueDate || null,
    affectedUsers: affectedUsers || 1
  });

  // Log temporal para debug
  console.log('✅ Ticket creado:', {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    categoryId: ticket.categoryId,
    priorityId: ticket.priorityId
  });

  res.status(201).json({
    success: true,
    message: 'Ticket creado exitosamente',
    ticket: ticket
  });
});

// Obtener todos los tickets con filtros
export const getTickets = catchAsync(async (req, res) => {
  const { status, category, priority, search } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (category) filters.category = category;
  if (priority) filters.priority = priority;
  if (search) filters.search = search;

  // Filtrar por rol del usuario
  if (req.user.role === 'empleado') {
    filters.createdBy = req.user.id;
  }

  const tickets = await Ticket.findAll(filters);

  res.json({
    success: true,
    tickets: tickets
  });
});

// Obtener ticket por ID
export const getTicketById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos de acceso
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para ver este ticket');
  }

  res.json({
    success: true,
    ticket: ticket
  });
});

// Actualizar ticket
export const updateTicket = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const updateData = req.body;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para editar este ticket');
  }

  const updatedTicket = await Ticket.update(id, updateData);

  res.json({
    success: true,
    message: 'Ticket actualizado exitosamente',
    ticket: updatedTicket
  });
});

// Asignar ticket
export const assignTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  // Solo admins y técnicos pueden asignar
  if (!['administrador', 'tecnico'].includes(req.user.role)) {
    throw createForbiddenError('No tienes permisos para asignar tickets');
  }

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  const updatedTicket = await Ticket.update(id, { assignedTo });

  res.json({
    success: true,
    message: 'Ticket asignado exitosamente',
    ticket: updatedTicket
  });
});

// Cambiar estado del ticket
export const updateTicketStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para cambiar el estado de este ticket');
  }

  const updatedTicket = await Ticket.updateStatus(id, status, req.user.id, comment);

  res.json({
    success: true,
    message: 'Estado del ticket actualizado exitosamente',
    ticket: updatedTicket
  });
});

// Agregar comentario
export const addComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos de acceso
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para comentar en este ticket');
  }

  const newComment = await Ticket.addComment(id, req.user.id, comment);

  res.status(201).json({
    success: true,
    message: 'Comentario agregado exitosamente',
    comment: newComment
  });
});

// Obtener comentarios del ticket
export const getTicketComments = catchAsync(async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos de acceso
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para ver este ticket');
  }

  const comments = await Ticket.getComments(id);

  res.json({
    success: true,
    comments: comments
  });
});

// Obtener historial del ticket
export const getTicketHistory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  // Verificar permisos de acceso
  if (req.user.role === 'empleado' && ticket.createdBy !== req.user.id) {
    throw createForbiddenError('No tienes permisos para ver este ticket');
  }

  const history = await Ticket.getHistory(id);

  res.json({
    success: true,
    history: history
  });
});

// Obtener estadísticas
export const getTicketStats = catchAsync(async (req, res) => {
  const stats = await Ticket.getStats(req.user);

  res.json({
    success: true,
    stats: stats
  });
});

// Eliminar ticket (solo admins)
export const deleteTicket = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'administrador') {
    throw createForbiddenError('Solo los administradores pueden eliminar tickets');
  }

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw createNotFoundError('Ticket no encontrado');
  }

  await Ticket.delete(id);

  res.json({
    success: true,
    message: 'Ticket eliminado exitosamente'
  });
});

// Alias para compatibilidad con rutas
export const changeTicketStatus = updateTicketStatus;

// Obtener filtros disponibles
export const getTicketFilters = catchAsync(async (req, res) => {
  res.json({
    success: true,
    filters: {
      status: ['abierto', 'en_progreso', 'resuelto', 'cerrado'],
      priority: ['baja', 'media', 'alta', 'critica'],
      category: ['hardware', 'software', 'red', 'email', 'otro']
    }
  });
});

// Exportar como default
export default {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  changeTicketStatus,
  addComment,
  getTicketComments,
  getTicketHistory,
  getTicketStats,
  getTicketFilters,
  deleteTicket
};