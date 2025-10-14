import { query } from '../utils/database.js';

export class Ticket {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.ticketNumber = data.ticket_number;
    this.requesterId = data.requester_id;
    this.assignedTo = data.assigned_to;
    this.categoryId = data.category_id;
    this.priorityId = data.priority_id;
    this.statusId = data.status_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.resolvedAt = data.resolved_at;
    this.dueDate = data.due_date;
    this.estimatedHours = data.estimated_hours;
    this.actualHours = data.actual_hours;
    
    // Datos relacionados (si están incluidos)
    this.requester = data.requester;
    this.assignedUser = data.assigned_user;
    this.category = data.category;
    this.priority = data.priority;
    this.status = data.status;
  }

  // Generar número de ticket único
  static async generateTicketNumber() {
    const currentYear = new Date().getFullYear();
    
    // Obtener el siguiente número para el año actual
    // Usar sintaxis compatible con ambas bases de datos
    const isProduction = process.env.NODE_ENV === 'production';
    const likeParam = `TKT-${currentYear}-%`;
    
    const result = await query(
      `SELECT COUNT(*) as count FROM tickets WHERE ticket_number LIKE ${isProduction ? '$1' : '?'}`,
      [likeParam]
    );
    
    const nextNumber = parseInt(result.rows[0].count || 0) + 1;
    return `TKT-${currentYear}-${nextNumber.toString().padStart(6, '0')}`;
  }

  // Crear nuevo ticket
  static async create(ticketData) {
    const { 
      title, 
      description, 
      requesterId, 
      categoryId = 6, // Default: 'Otros'
      priorityId = 3,  // Default: 'Media'
      statusId = 1,     // Default: 'Nuevo'
      dueDate, 
      estimatedHours
    } = ticketData;

    // Generar número de ticket único
    const ticketNumber = await this.generateTicketNumber();

    console.log('🔄 Creando ticket con datos:', { title, ticketNumber, requesterId, categoryId, priorityId, statusId });

    const isProduction = process.env.NODE_ENV === 'production';

    // Insertar el ticket con sintaxis adaptada al entorno
    let result;
    if (isProduction) {
      // PostgreSQL con RETURNING
      result = await query(
        `INSERT INTO tickets (title, description, ticket_number, requester_id, category_id, priority_id, status_id, due_date, estimated_hours)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [title, description, ticketNumber, requesterId, categoryId, priorityId, statusId, dueDate, estimatedHours]
      );
      console.log('✅ Ticket creado en PostgreSQL, ID:', result.rows[0].id);
      return new Ticket(result.rows[0]);
    } else {
      // SQLite sin RETURNING
      result = await query(
        `INSERT INTO tickets (title, description, ticket_number, requester_id, category_id, priority_id, status_id, due_date, estimated_hours)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, ticketNumber, requesterId, categoryId, priorityId, statusId, dueDate, estimatedHours]
      );
      
      console.log('✅ Ticket insertado en SQLite, lastID:', result.lastID);
      
      // Devolver datos básicos para SQLite
      return new Ticket({
        id: result.lastID,
        title,
        description,
        ticket_number: ticketNumber,
        requester_id: requesterId,
        category_id: categoryId,
        priority_id: priorityId,
        status_id: statusId,
        due_date: dueDate,
        estimated_hours: estimatedHours,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  // Buscar ticket por ID con datos relacionados
  static async findById(id) {
    const result = await query(
      `SELECT 
        t.*,
        u_req.first_name || ' ' || u_req.last_name as requester_name,
        u_req.email as requester_email,
        u_req.department as requester_department,
        u_ass.first_name || ' ' || u_ass.last_name as assigned_name,
        u_ass.email as assigned_email,
        c.name as category_name,
        c.color as category_color,
        p.name as priority_name,
        p.level as priority_level,
        p.color as priority_color,
        s.name as status_name,
        s.color as status_color,
        s.is_final as status_is_final
       FROM tickets t
       LEFT JOIN users u_req ON t.requester_id = u_req.id
       LEFT JOIN users u_ass ON t.assigned_to = u_ass.id
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN priorities p ON t.priority_id = p.id
       LEFT JOIN ticket_statuses s ON t.status_id = s.id
       WHERE t.id = $1`,
      [id]
    );

    if (!result.rows[0]) {
      return null;
    }

    const ticketData = result.rows[0];
    const ticket = new Ticket(ticketData);
    
    // Agregar datos relacionados
    ticket.requester = {
      name: ticketData.requester_name,
      email: ticketData.requester_email,
      department: ticketData.requester_department
    };
    
    if (ticketData.assigned_name) {
      ticket.assignedUser = {
        name: ticketData.assigned_name,
        email: ticketData.assigned_email
      };
    }
    
    ticket.category = {
      name: ticketData.category_name,
      color: ticketData.category_color
    };
    
    ticket.priority = {
      name: ticketData.priority_name,
      level: ticketData.priority_level,
      color: ticketData.priority_color
    };
    
    ticket.status = {
      name: ticketData.status_name,
      color: ticketData.status_color,
      isFinal: ticketData.status_is_final
    };

    return ticket;
  }

  // Buscar tickets con filtros
  static async findAll(filters = {}) {
    let queryText = `
      SELECT 
        t.*,
        u_req.first_name || ' ' || u_req.last_name as requester_name,
        u_req.email as requester_email,
        u_req.department as requester_department,
        u_ass.first_name || ' ' || u_ass.last_name as assigned_name,
        c.name as category_name,
        c.color as category_color,
        p.name as priority_name,
        p.level as priority_level,
        p.color as priority_color,
        s.name as status_name,
        s.color as status_color
      FROM tickets t
      LEFT JOIN users u_req ON t.requester_id = u_req.id
      LEFT JOIN users u_ass ON t.assigned_to = u_ass.id
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN priorities p ON t.priority_id = p.id
      LEFT JOIN ticket_statuses s ON t.status_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (filters.requesterId) {
      params.push(filters.requesterId);
      queryText += ` AND t.requester_id = $${paramCount++}`;
    }
    
    if (filters.assignedTo) {
      params.push(filters.assignedTo);
      queryText += ` AND t.assigned_to = $${paramCount++}`;
    }
    
    if (filters.categoryId) {
      params.push(filters.categoryId);
      queryText += ` AND t.category_id = $${paramCount++}`;
    }
    
    if (filters.statusId) {
      params.push(filters.statusId);
      queryText += ` AND t.status_id = $${paramCount++}`;
    }
    
    if (filters.priorityId) {
      params.push(filters.priorityId);
      queryText += ` AND t.priority_id = $${paramCount++}`;
    }
    
    if (filters.search) {
      params.push(`%${filters.search}%`);
      const searchParam1 = paramCount++;
      params.push(`%${filters.search}%`);
      const searchParam2 = paramCount++;
      params.push(`%${filters.search}%`);
      const searchParam3 = paramCount++;
      queryText += ` AND (t.title LIKE $${searchParam1} OR t.description LIKE $${searchParam2} OR t.ticket_number LIKE $${searchParam3})`;
    }
    
    // Ordenamiento
    const orderBy = filters.orderBy || 'created_at';
    const orderDirection = filters.orderDirection || 'DESC';
    queryText += ` ORDER BY ${orderBy} ${orderDirection}`;
    
    // Paginación
    if (filters.limit) {
      params.push(filters.limit);
      queryText += ` LIMIT $${paramCount++}`;
      
      if (filters.offset) {
        params.push(filters.offset);
        queryText += ` OFFSET $${paramCount++}`;
      }
    }

    const result = await query(queryText, params);
    
    return result.rows.map(row => {
      const ticket = new Ticket(row);
      
      // Agregar datos relacionados básicos
      ticket.requester = {
        name: row.requester_name,
        email: row.requester_email,
        department: row.requester_department
      };
      
      if (row.assigned_name) {
        ticket.assignedUser = {
          name: row.assigned_name
        };
      }
      
      ticket.category = {
        name: row.category_name,
        color: row.category_color
      };
      
      ticket.priority = {
        name: row.priority_name,
        level: row.priority_level,
        color: row.priority_color
      };
      
      ticket.status = {
        name: row.status_name,
        color: row.status_color
      };
      
      return ticket;
    });
  }

  // Asignar ticket a un técnico
  async assignTo(technicianId, assignedBy) {
    const result = await query(
      `UPDATE tickets 
       SET assigned_to = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [technicianId, this.id]
    );

    // Registrar en historial
    await this.addToHistory(assignedBy, 'assigned', this.assignedTo, technicianId);
    
    return new Ticket(result.rows[0]);
  }

  // Cambiar estado del ticket
  async changeStatus(newStatusId, userId) {
    const oldStatusId = this.statusId;
    
    const result = await query(
      `UPDATE tickets 
       SET status_id = $1, updated_at = CURRENT_TIMESTAMP, 
           resolved_at = CASE WHEN $1 IN (SELECT id FROM ticket_statuses WHERE name IN ('Resuelto', 'Cerrado')) 
                              THEN CURRENT_TIMESTAMP ELSE resolved_at END
       WHERE id = $2
       RETURNING *`,
      [newStatusId, this.id]
    );

    // Registrar en historial
    await this.addToHistory(userId, 'status_change', oldStatusId, newStatusId);
    
    return new Ticket(result.rows[0]);
  }

  // Actualizar ticket
  async update(updateData, userId) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== 'id') {
        paramCount++;
        const dbField = key === 'dueDate' ? 'due_date' : 
                       key === 'estimatedHours' ? 'estimated_hours' :
                       key === 'actualHours' ? 'actual_hours' : key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this;
    }

    values.push(this.id);
    const queryText = `
      UPDATE tickets 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await query(queryText, values);
    
    // Registrar en historial
    await this.addToHistory(userId, 'updated', null, 'Ticket actualizado');
    
    return new Ticket(result.rows[0]);
  }

  // Agregar comentario
  async addComment(userId, content, isInternal = false) {
    const result = await query(
      `INSERT INTO ticket_comments (ticket_id, user_id, content, is_internal)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [this.id, userId, content, isInternal]
    );

    // Registrar en historial
    await this.addToHistory(userId, 'comment', null, 'Comentario agregado');
    
    return result.rows[0];
  }

  // Obtener comentarios del ticket
  async getComments() {
    const result = await query(
      `SELECT 
        tc.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.role as user_role
       FROM ticket_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.ticket_id = $1
       ORDER BY tc.created_at ASC`,
      [this.id]
    );

    return result.rows;
  }

  // Obtener historial del ticket
  async getHistory() {
    const result = await query(
      `SELECT 
        th.*,
        u.first_name || ' ' || u.last_name as user_name
       FROM ticket_history th
       JOIN users u ON th.user_id = u.id
       WHERE th.ticket_id = $1
       ORDER BY th.created_at DESC`,
      [this.id]
    );

    return result.rows;
  }

  // Agregar entrada al historial
  async addToHistory(userId, changeType, oldValue = null, newValue = null) {
    await query(
      `INSERT INTO ticket_history (ticket_id, user_id, field_name, old_value, new_value, change_type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [this.id, userId, changeType, oldValue, newValue, changeType]
    );
  }

  // Obtener estadísticas de tickets
  static async getStats(filters = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.assignedTo) {
      params.push(filters.assignedTo);
      whereClause += ` AND assigned_to = $${params.length}`;
    }

    if (filters.requesterId) {
      params.push(filters.requesterId);
      whereClause += ` AND requester_id = $${params.length}`;
    }

    const result = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN s.name = 'Nuevo' THEN 1 END) as nuevos,
        COUNT(CASE WHEN s.name = 'En Progreso' THEN 1 END) as en_progreso,
        COUNT(CASE WHEN s.name = 'Resuelto' THEN 1 END) as resueltos,
        COUNT(CASE WHEN s.name = 'Cerrado' THEN 1 END) as cerrados,
        COUNT(CASE WHEN p.level >= 4 THEN 1 END) as alta_prioridad
       FROM tickets t
       LEFT JOIN ticket_statuses s ON t.status_id = s.id
       LEFT JOIN priorities p ON t.priority_id = p.id
       ${whereClause}`,
      params
    );

    return result.rows[0];
  }

  // Serializar para JSON
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      ticketNumber: this.ticketNumber,
      requesterId: this.requesterId,
      assignedTo: this.assignedTo,
      categoryId: this.categoryId,
      priorityId: this.priorityId,
      statusId: this.statusId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      dueDate: this.dueDate,
      estimatedHours: this.estimatedHours,
      actualHours: this.actualHours,
      requester: this.requester,
      assignedUser: this.assignedUser,
      category: this.category,
      priority: this.priority,
      status: this.status
    };
  }
}

export default Ticket;