import { Ticket } from '../models/Ticket.js';
import { query } from '../utils/database.js';
import { catchAsync, createValidationError, createNotFoundError, createForbiddenError } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';
import { emitToRole, emitToUser } from '../utils/socket.js';
import { 
  createTicketNotifications,
  createAssignmentNotifications,
  createStatusChangeNotifications,
  createCommentNotifications 
} from './notificationController.js';
import emailService from '../utils/emailServiceBrevoAPI.js';

// Crear nuevo ticket
export const createTicket = catchAsync(async (req, res) => {
  // Validar que técnicos no puedan crear tickets
  if (req.user.role === 'tecnico') {
    throw createForbiddenError('Los técnicos no pueden crear tickets. Solo empleados y administradores.');
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array()
    });
  }

  const { title, description, categoryId, priorityId, dueDate } = req.body;

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
    dueDate: dueDate || null
  });

  // Log temporal para debug
  console.log('✅ Ticket creado:', {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    categoryId: ticket.categoryId,
    priorityId: ticket.priorityId
  });

  // Crear notificaciones para admins y técnicos (async, no bloqueante)
  createTicketNotifications(
    {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title
    },
    {
      id: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`
    }
  ).catch(err => console.error('Error creando notificaciones:', err));

  // Enviar email de nuevo ticket (async, no bloqueante)
  emailService.sendNewTicketEmail(
    {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      description: ticket.description,
      category: { name: categoryId }, // Simplificado, se podría obtener el nombre real
      priority: { name: priorityId }
    },
    {
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      department: req.user.department || 'N/A'
    }
  ).catch(err => console.error('Error enviando email:', err));

  // Emitir evento WebSocket a todos los técnicos y administradores
  try {
    emitToRole('tecnico', 'ticket:created', {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      createdBy: `${req.user.firstName} ${req.user.lastName}`,
    });
    emitToRole('administrador', 'ticket:created', {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      createdBy: `${req.user.firstName} ${req.user.lastName}`,
    });
  } catch (err) {
    console.error('Error emitiendo evento WebSocket:', err);
  }

  res.status(201).json({
    success: true,
    message: 'Ticket creado exitosamente',
    ticket: ticket
  });
});

// Obtener todos los tickets con filtros
export const getTickets = catchAsync(async (req, res) => {
  const { status, category, priority, search, assignedTo } = req.query;

  console.log('🔍 Filtros recibidos:', { status, category, priority, search, assignedTo });

  const filters = {};
  
  // Convertir nombres de filtros a IDs para el modelo
  if (status) {
    // Normalizar el valor: reemplazar guiones por espacios y capitalizar
    const normalizedStatus = status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Obtener el ID del estado por nombre
    const statusResult = await query(
      'SELECT id FROM ticket_statuses WHERE LOWER(name) = LOWER($1) OR id::text = $1',
      [normalizedStatus]
    );
    if (statusResult.rows[0]) {
      filters.statusId = statusResult.rows[0].id;
      console.log(`✅ Estado encontrado: ${normalizedStatus} -> ID: ${filters.statusId}`);
    } else {
      console.log(`⚠️ Estado no encontrado: ${normalizedStatus}`);
    }
  }
  
  if (category) {
    // Capitalizar primera letra
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Obtener el ID de la categoría por nombre
    const categoryResult = await query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) OR id::text = $1',
      [normalizedCategory]
    );
    if (categoryResult.rows[0]) {
      filters.categoryId = categoryResult.rows[0].id;
      console.log(`✅ Categoría encontrada: ${normalizedCategory} -> ID: ${filters.categoryId}`);
    } else {
      console.log(`⚠️ Categoría no encontrada: ${normalizedCategory}`);
    }
  }
  
  if (priority) {
    // Normalizar: reemplazar guiones por espacios y capitalizar cada palabra
    const normalizedPriority = priority
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Obtener el ID de la prioridad por nombre
    const priorityResult = await query(
      'SELECT id FROM priorities WHERE LOWER(name) = LOWER($1) OR id::text = $1',
      [normalizedPriority]
    );
    if (priorityResult.rows[0]) {
      filters.priorityId = priorityResult.rows[0].id;
      console.log(`✅ Prioridad encontrada: ${normalizedPriority} -> ID: ${filters.priorityId}`);
    } else {
      console.log(`⚠️ Prioridad no encontrada: ${normalizedPriority}`);
    }
  }
  
  if (search) {
    filters.search = search;
  }

  // Filtro de asignación (para administradores que filtran por técnico)
  if (assignedTo) {
    filters.assignedTo = assignedTo;
  }

  // Filtrar por rol del usuario
  switch (req.user.role) {
    case 'empleado':
      // Empleados solo ven tickets que ellos crearon
      filters.requesterId = req.user.id;
      break;
    
    case 'tecnico':
      // Técnicos solo ven tickets asignados a ellos (a menos que se especifique otro filtro de asignación)
      if (!filters.assignedTo) {
        filters.assignedTo = req.user.id;
      }
      break;
    
    case 'administrador':
      // Administradores ven todos los tickets (sin filtro adicional)
      break;
    
    default:
      // Por seguridad, si el rol no es reconocido, solo mostrar los propios
      filters.requesterId = req.user.id;
  }

  console.log('🔧 Filtros procesados para modelo:', filters);

  const tickets = await Ticket.findAll(filters);

  console.log(`✅ Tickets encontrados: ${tickets.length}`);

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
  if (req.user.role === 'empleado' && ticket.requesterId !== req.user.id) {
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
  if (req.user.role === 'empleado' && ticket.requesterId !== req.user.id) {
    throw createForbiddenError('No tienes permisos para editar este ticket');
  }

  const updatedTicket = await ticket.update(updateData, req.user.id);

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

  const updatedTicket = await ticket.assignTo(assignedTo, req.user.id);

  // Obtener datos del técnico asignado
  const techResult = await query(
    'SELECT id, first_name, last_name FROM users WHERE id = $1',
    [assignedTo]
  );

  if (techResult.rows.length > 0) {
    const technician = techResult.rows[0];
    
    // Crear notificaciones (async, no bloqueante)
    createAssignmentNotifications(
      {
        id: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        title: updatedTicket.title,
        requester: {
          id: updatedTicket.requesterId
        }
      },
      {
        id: technician.id,
        name: `${technician.first_name} ${technician.last_name}`
      },
      {
        id: req.user.id,
        name: `${req.user.firstName} ${req.user.lastName}`
      }
    ).catch(err => console.error('Error creando notificaciones de asignación:', err));

    // Enviar email de asignación (async, no bloqueante)
    const techEmail = await query('SELECT email FROM users WHERE id = $1', [assignedTo]);
    const requesterEmail = await query('SELECT email, first_name, last_name FROM users WHERE id = $1', [updatedTicket.requesterId]);
    
    if (techEmail.rows.length > 0 && requesterEmail.rows.length > 0) {
      emailService.sendTicketAssignmentEmail(
        {
          id: updatedTicket.id,
          ticketNumber: updatedTicket.ticketNumber,
          title: updatedTicket.title,
          description: updatedTicket.description,
          category: { name: 'N/A' },
          priority: { name: 'N/A', color: '#666' },
          requester: {
            name: `${requesterEmail.rows[0].first_name} ${requesterEmail.rows[0].last_name}`
          },
          dueDate: updatedTicket.dueDate
        },
        {
          email: techEmail.rows[0].email,
          name: `${technician.first_name} ${technician.last_name}`
        },
        {
          name: `${req.user.firstName} ${req.user.lastName}`
        }
      ).catch(err => console.error('Error enviando email de asignación:', err));
    }

    // Emitir evento WebSocket al técnico asignado
    try {
      emitToUser(technician.id, 'ticket:assigned', {
        id: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        title: updatedTicket.title,
        assignedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    } catch (err) {
      console.error('Error emitiendo evento WebSocket de asignación:', err);
    }
  }

  res.json({
    success: true,
    message: 'Ticket asignado exitosamente',
    ticket: updatedTicket
  });
});

// Mapeo de UUIDs a IDs de estados (por inconsistencia base de datos)
const STATUS_UUID_TO_ID = {
  '550e8400-e29b-41d4-a716-446655442001': 1, // Nuevo
  '550e8400-e29b-41d4-a716-446655442002': 2, // Asignado
  '550e8400-e29b-41d4-a716-446655442003': 3, // En Progreso
  '550e8400-e29b-41d4-a716-446655442004': 4, // Resuelto
  '550e8400-e29b-41d4-a716-446655442005': 5, // Cerrado
  '550e8400-e29b-41d4-a716-446655442006': 6  // Cancelado
};

// Cambiar estado del ticket
export const updateTicketStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status: statusInput, comment } = req.body;

  // Convertir UUID a INTEGER si es necesario
  const status = STATUS_UUID_TO_ID[statusInput] || statusInput;

  console.log('🔍 DEBUG updateTicketStatus:', {
    ticketId: id,
    statusInput: statusInput,
    statusConverted: status,
    userId: req.user.id,
    hasComment: !!comment
  });

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    console.error('❌ Ticket no encontrado:', id);
    throw createNotFoundError('Ticket no encontrado');
  }

  console.log('✅ Ticket encontrado:', {
    id: ticket.id,
    currentStatus: ticket.statusId,
    newStatus: status,
    requesterId: ticket.requesterId,
    assignedTo: ticket.assignedTo,
    userRole: req.user.role,
    userId: req.user.id
  });

  // Verificar permisos según rol
  if (req.user.role === 'empleado') {
    // Empleados solo pueden cambiar estado de sus propios tickets
    if (ticket.requesterId !== req.user.id) {
      throw createForbiddenError('No tienes permisos para cambiar el estado de este ticket');
    }
  } else if (req.user.role === 'tecnico') {
    // Técnicos solo pueden cambiar estado de tickets asignados a ellos
    if (ticket.assignedTo !== req.user.id) {
      throw createForbiddenError('Solo puedes cambiar el estado de tickets asignados a ti');
    }
  }
  // Administradores pueden cambiar cualquier ticket (sin restricción)

  // Actualizar el estado usando el método especializado
  console.log('🔄 Llamando a ticket.changeStatus...');
  const updatedTicket = await ticket.changeStatus(status, req.user.id);
  console.log('✅ Estado actualizado correctamente');

  // Obtener nombre del nuevo estado
  const statusResult = await query('SELECT name, color FROM ticket_statuses WHERE id = $1', [status]);
  const newStatusName = statusResult.rows[0]?.name || 'Desconocido';
  const newStatusColor = statusResult.rows[0]?.color || '#666';

  // Crear notificaciones (async, no bloqueante)
  createStatusChangeNotifications(
    {
      id: updatedTicket.id,
      ticketNumber: updatedTicket.ticketNumber,
      title: updatedTicket.title,
      requester: { id: updatedTicket.requesterId },
      assignedUser: updatedTicket.assignedTo ? { id: updatedTicket.assignedTo } : null
    },
    {
      name: newStatusName
    },
    {
      id: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`
    }
  ).catch(err => console.error('Error creando notificaciones de cambio de estado:', err));

  // Enviar email de cambio de estado (async, no bloqueante)
  const requesterData = await query('SELECT email, first_name, last_name FROM users WHERE id = $1', [updatedTicket.requesterId]);
  if (requesterData.rows.length > 0) {
    const ticketData = {
      id: updatedTicket.id,
      ticketNumber: updatedTicket.ticketNumber,
      title: updatedTicket.title,
      requester: {
        email: requesterData.rows[0].email,
        name: `${requesterData.rows[0].first_name} ${requesterData.rows[0].last_name}`
      }
    };

    // Si hay técnico asignado, obtener su email también
    if (updatedTicket.assignedTo) {
      const assignedData = await query('SELECT email FROM users WHERE id = $1', [updatedTicket.assignedTo]);
      if (assignedData.rows.length > 0) {
        ticketData.assignedUser = { email: assignedData.rows[0].email };
      }
    }

    emailService.sendStatusChangeEmail(
      ticketData,
      { name: newStatusName, color: newStatusColor },
      { name: `${req.user.firstName} ${req.user.lastName}` }
    ).catch(err => console.error('Error enviando email de cambio de estado:', err));
  }

  // Si hay comentario, agregarlo
  if (comment && comment.trim()) {
    console.log('💬 Agregando comentario...');
    await updatedTicket.addComment(req.user.id, comment);
  }

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
  if (req.user.role === 'empleado' && ticket.requesterId !== req.user.id) {
    throw createForbiddenError('No tienes permisos para comentar en este ticket');
  }

  const newComment = await ticket.addComment(req.user.id, comment);

  // Crear notificaciones (async, no bloqueante)
  createCommentNotifications(
    {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      requester: { id: ticket.requesterId },
      assignedUser: ticket.assignedTo ? { id: ticket.assignedTo } : null
    },
    {
      is_internal: false
    },
    {
      id: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`
    }
  ).catch(err => console.error('Error creando notificaciones de comentario:', err));

  // Enviar email de nuevo comentario (async, no bloqueante)
  const ticketData = {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title
  };

  // Obtener email del solicitante
  const requesterData = await query('SELECT email FROM users WHERE id = $1', [ticket.requesterId]);
  if (requesterData.rows.length > 0) {
    ticketData.requester = { email: requesterData.rows[0].email };
  }

  // Obtener email del técnico asignado
  if (ticket.assignedTo) {
    const assignedData = await query('SELECT email FROM users WHERE id = $1', [ticket.assignedTo]);
    if (assignedData.rows.length > 0) {
      ticketData.assignedUser = { email: assignedData.rows[0].email };
    }
  }

  emailService.sendNewCommentEmail(
    ticketData,
    { content: comment },
    {
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`,
      role: req.user.role
    }
  ).catch(err => console.error('Error enviando email de comentario:', err));

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
  if (req.user.role === 'empleado' && ticket.requesterId !== req.user.id) {
    throw createForbiddenError('No tienes permisos para ver este ticket');
  }

  const comments = await ticket.getComments();

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
  if (req.user.role === 'empleado' && ticket.requesterId !== req.user.id) {
    throw createForbiddenError('No tienes permisos para ver este ticket');
  }

  const history = await ticket.getHistory();

  res.json({
    success: true,
    history: history
  });
});

// Obtener estadísticas
export const getTicketStats = catchAsync(async (req, res) => {
  const filters = {};
  
  // Aplicar los mismos filtros por rol que en getTickets
  switch (req.user.role) {
    case 'empleado':
      // Empleados solo ven estadísticas de sus tickets
      filters.requesterId = req.user.id;
      break;
    
    case 'tecnico':
      // Técnicos solo ven estadísticas de tickets asignados
      filters.assignedTo = req.user.id;
      break;
    
    case 'administrador':
      // Administradores ven estadísticas de todos los tickets
      break;
  }

  const stats = await Ticket.getStats(filters);

  // Transformar nombres de keys a camelCase para el frontend
  const formattedStats = {
    total: parseInt(stats.total) || 0,
    nuevos: parseInt(stats.nuevos) || 0,
    enProgreso: parseInt(stats.en_progreso) || 0,  // Convertir en_progreso a enProgreso
    resueltos: parseInt(stats.resueltos) || 0,
    cerrados: parseInt(stats.cerrados) || 0,
    altaPrioridad: parseInt(stats.alta_prioridad) || 0
  };

  res.json({
    success: true,
    stats: formattedStats
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