import { query } from '../utils/database.js';
import emailService from '../utils/emailService.js';
import { catchAsync, createNotFoundError } from '../middleware/errorHandler.js';

// Obtener notificaciones del usuario
export const getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let queryText = `
    SELECT n.*, t.ticket_number, t.title as ticket_title
    FROM notifications n
    LEFT JOIN tickets t ON n.ticket_id = t.id
    WHERE n.user_id = $1
  `;
  
  const params = [req.user.id];

  if (unreadOnly === 'true') {
    queryText += ' AND n.is_read = false';
  }

  queryText += ' ORDER BY n.created_at DESC';
  
  // Agregar paginación
  params.push(parseInt(limit));
  queryText += ` LIMIT $${params.length}`;
  
  params.push(offset);
  queryText += ` OFFSET $${params.length}`;

  const result = await query(queryText, params);

  // Contar total de notificaciones
  const countResult = await query(
    `SELECT COUNT(*) as total FROM notifications 
     WHERE user_id = $1 ${unreadOnly === 'true' ? 'AND is_read = false' : ''}`,
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    data: {
      notifications: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].total / parseInt(limit)),
        totalItems: parseInt(countResult.rows[0].total),
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// Marcar notificación como leída
export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `UPDATE notifications 
     SET is_read = true 
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, req.user.id]
  );

  if (!result.rows[0]) {
    throw createNotFoundError('Notificación');
  }

  res.status(200).json({
    success: true,
    message: 'Notificación marcada como leída',
    data: {
      notification: result.rows[0]
    }
  });
});

// Marcar todas las notificaciones como leídas
export const markAllAsRead = catchAsync(async (req, res) => {
  await query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    message: 'Todas las notificaciones marcadas como leídas'
  });
});

// Obtener conteo de notificaciones no leídas
export const getUnreadCount = catchAsync(async (req, res) => {
  const result = await query(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    data: {
      unreadCount: parseInt(result.rows[0].count)
    }
  });
});

// Eliminar notificación
export const deleteNotification = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, req.user.id]
  );

  if (!result.rows[0]) {
    throw createNotFoundError('Notificación');
  }

  res.status(200).json({
    success: true,
    message: 'Notificación eliminada exitosamente'
  });
});

// Crear notificación (función interna)
export const createNotification = async (userId, ticketId, type, title, message) => {
  try {
    const result = await query(
      `INSERT INTO notifications (user_id, ticket_id, type, title, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, ticketId, type, title, message]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creando notificación:', error);
    return null;
  }
};

// Crear notificaciones para ticket nuevo
export const createTicketNotifications = async (ticketData, requesterData) => {
  try {
    // Obtener administradores y técnicos
    const adminTechResult = await query(
      `SELECT id FROM users 
       WHERE role IN ('administrador', 'tecnico') 
       AND is_active = true 
       AND id != $1`,
      [requesterData.id]
    );

    const title = `Nuevo ticket creado: ${ticketData.ticketNumber}`;
    const message = `${requesterData.name} ha creado un nuevo ticket: "${ticketData.title}"`;

    // Crear notificaciones para admins y técnicos
    const notifications = adminTechResult.rows.map(user => 
      createNotification(user.id, ticketData.id, 'ticket_created', title, message)
    );

    await Promise.all(notifications);

    // Enviar emails
    await emailService.sendNewTicketEmail(ticketData, requesterData);
  } catch (error) {
    console.error('Error creando notificaciones de ticket nuevo:', error);
  }
};

// Crear notificaciones para asignación
export const createAssignmentNotifications = async (ticketData, technicianData, assignedByData) => {
  try {
    const title = `Ticket asignado: ${ticketData.ticketNumber}`;
    const message = `${assignedByData.name} te ha asignado el ticket: "${ticketData.title}"`;

    // Notificar al técnico asignado
    await createNotification(technicianData.id, ticketData.id, 'ticket_assigned', title, message);

    // Notificar al solicitante si no es el mismo que asignó
    if (ticketData.requester.id !== assignedByData.id) {
      const requesterTitle = `Ticket actualizado: ${ticketData.ticketNumber}`;
      const requesterMessage = `Tu ticket "${ticketData.title}" ha sido asignado a ${technicianData.name}`;
      
      await createNotification(ticketData.requester.id, ticketData.id, 'ticket_updated', requesterTitle, requesterMessage);
    }

    // Enviar emails
    await emailService.sendTicketAssignmentEmail(ticketData, technicianData, assignedByData);
  } catch (error) {
    console.error('Error creando notificaciones de asignación:', error);
  }
};

// Crear notificaciones para cambio de estado
export const createStatusChangeNotifications = async (ticketData, newStatus, updatedByData) => {
  try {
    const title = `Estado actualizado: ${ticketData.ticketNumber}`;
    const message = `${updatedByData.name} cambió el estado del ticket "${ticketData.title}" a ${newStatus.name}`;

    const usersToNotify = new Set();
    
    // Notificar al solicitante
    if (ticketData.requester.id !== updatedByData.id) {
      usersToNotify.add(ticketData.requester.id);
    }
    
    // Notificar al técnico asignado
    if (ticketData.assignedUser?.id && ticketData.assignedUser.id !== updatedByData.id) {
      usersToNotify.add(ticketData.assignedUser.id);
    }

    // Crear notificaciones
    const notifications = Array.from(usersToNotify).map(userId => 
      createNotification(userId, ticketData.id, 'status_changed', title, message)
    );

    await Promise.all(notifications);

    // Enviar emails
    await emailService.sendStatusChangeEmail(ticketData, newStatus, updatedByData);
  } catch (error) {
    console.error('Error creando notificaciones de cambio de estado:', error);
  }
};

// Crear notificaciones para nuevo comentario
export const createCommentNotifications = async (ticketData, commentData, authorData) => {
  try {
    const title = `Nuevo comentario: ${ticketData.ticketNumber}`;
    const message = `${authorData.name} agregó un comentario en el ticket "${ticketData.title}"`;

    const usersToNotify = new Set();
    
    // Notificar al solicitante
    if (ticketData.requester.id !== authorData.id) {
      usersToNotify.add(ticketData.requester.id);
    }
    
    // Notificar al técnico asignado
    if (ticketData.assignedUser?.id && ticketData.assignedUser.id !== authorData.id) {
      usersToNotify.add(ticketData.assignedUser.id);
    }

    // Solo crear notificaciones si el comentario no es interno o el usuario tiene permisos
    if (!commentData.is_internal) {
      const notifications = Array.from(usersToNotify).map(userId => 
        createNotification(userId, ticketData.id, 'comment_added', title, message)
      );

      await Promise.all(notifications);

      // Enviar emails
      await emailService.sendNewCommentEmail(ticketData, commentData, authorData);
    }
  } catch (error) {
    console.error('Error creando notificaciones de comentario:', error);
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  createNotification,
  createTicketNotifications,
  createAssignmentNotifications,
  createStatusChangeNotifications,
  createCommentNotifications
};