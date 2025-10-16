import nodemailer from 'nodemailer';
import { query } from '../utils/database.js';

class EmailService {
  constructor() {
    // Configuración para diferentes servicios de email
    const emailConfig = {
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Configuraciones adicionales para mejorar compatibilidad
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: false, // Cambiar a true para debugging
      debug: false   // Cambiar a true para ver comunicación SMTP
    };

    // Si es Brevo/Sendinblue o custom SMTP, usar configuración de host/port
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
      emailConfig.host = process.env.EMAIL_HOST;
      emailConfig.port = parseInt(process.env.EMAIL_PORT);
      emailConfig.secure = false; // true para 465, false para otros puertos
      emailConfig.requireTLS = true; // Requerir TLS para seguridad
      emailConfig.tls = {
        rejectUnauthorized: false // Para evitar problemas con certificados en cloud
      };
      console.log(`📧 Configurando email con SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
      console.log(`📧 Usuario SMTP: ${process.env.EMAIL_USER}`);
    } else {
      // Usar servicio predefinido (Gmail, Outlook, etc.)
      emailConfig.service = process.env.EMAIL_SERVICE || 'gmail';
      console.log(`📧 Configurando email con servicio: ${emailConfig.service}`);
    }

    this.transporter = nodemailer.createTransport(emailConfig);
    
    // Verificar conexión al inicializar (sin bloquear)
    this.verifyConnection();
  }

  // Verificar configuración de email
  async verifyConnection() {
    try {
      console.log('🔍 Verificando conexión SMTP...');
      await this.transporter.verify();
      console.log('✅ Servidor de email configurado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración de email:', error.message);
      console.error('📋 Detalles del error:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
      return false;
    }
  }

  // Enviar email genérico
  async sendEmail(to, subject, html, text = '') {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('🔧 Email no configurado, saltando envío');
        return false;
      }

      console.log(`📤 Intentando enviar email a: ${to}`);
      console.log(`📝 Asunto: ${subject}`);

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"SGTS FARMASHAIO" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado exitosamente');
      console.log('📧 Message ID:', info.messageId);
      console.log('📬 Destinatario:', to);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email:', error.message);
      console.error('📋 Código de error:', error.code);
      console.error('📋 Comando fallido:', error.command);
      if (error.response) {
        console.error('📋 Respuesta del servidor:', error.response);
      }
      return false;
    }
  }

  // Convertir HTML básico a texto plano
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  // Email para nuevo ticket
  async sendNewTicketEmail(ticketData, requesterData) {
    const subject = `Nuevo Ticket Creado: ${ticketData.ticketNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Nuevo Ticket de Soporte Creado</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Detalles del Ticket</h3>
          <p><strong>Número:</strong> ${ticketData.ticketNumber}</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Categoría:</strong> ${ticketData.category?.name}</p>
          <p><strong>Prioridad:</strong> ${ticketData.priority?.name}</p>
          <p><strong>Estado:</strong> ${ticketData.status?.name}</p>
          <p><strong>Solicitante:</strong> ${requesterData.name} (${requesterData.email})</p>
          <p><strong>Departamento:</strong> ${requesterData.department}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h4 style="margin-top: 0;">Descripción:</h4>
          <p>${ticketData.description}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Este ticket ha sido creado en el Sistema de Gestión de Tickets de FARMASHAIO.</p>
          <p style="color: #666; font-size: 12px;">No responda a este email. Para comentarios, use el sistema web.</p>
        </div>
      </div>
    `;

    // Enviar a administradores y técnicos
    const adminTechEmails = await this.getAdminTechEmails();
    const emailPromises = adminTechEmails.map(email => 
      this.sendEmail(email, subject, html)
    );

    await Promise.all(emailPromises);
  }

  // Email para asignación de ticket
  async sendTicketAssignmentEmail(ticketData, technicianData, assignedByData) {
    const subject = `Ticket Asignado: ${ticketData.ticketNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Ticket Asignado a Ti</h2>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Has sido asignado al siguiente ticket:</h3>
          <p><strong>Número:</strong> ${ticketData.ticketNumber}</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Categoría:</strong> ${ticketData.category?.name}</p>
          <p><strong>Prioridad:</strong> <span style="color: ${ticketData.priority?.color}">${ticketData.priority?.name}</span></p>
          <p><strong>Solicitante:</strong> ${ticketData.requester?.name}</p>
          <p><strong>Asignado por:</strong> ${assignedByData.name}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <h4 style="margin-top: 0;">Descripción:</h4>
          <p>${ticketData.description}</p>
        </div>
        
        ${ticketData.dueDate ? `
        <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>⚠️ Fecha límite:</strong> ${new Date(ticketData.dueDate).toLocaleDateString('es-ES')}</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Por favor, revisa el ticket y actualiza su estado según corresponda.</p>
          <p style="color: #666; font-size: 12px;">No responda a este email. Para comentarios, use el sistema web.</p>
        </div>
      </div>
    `;

    await this.sendEmail(technicianData.email, subject, html);
    
    // También notificar al solicitante
    const requesterSubject = `Ticket Actualizado: ${ticketData.ticketNumber}`;
    const requesterHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Tu Ticket Ha Sido Asignado</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>Tu ticket <strong>${ticketData.ticketNumber}</strong> ha sido asignado a ${technicianData.name}.</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Estado:</strong> ${ticketData.status?.name}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Recibirás actualizaciones sobre el progreso de tu ticket.</p>
        </div>
      </div>
    `;

    await this.sendEmail(ticketData.requester?.email, requesterSubject, requesterHtml);
  }

  // Email para cambio de estado
  async sendStatusChangeEmail(ticketData, newStatus, updatedByData) {
    const subject = `Estado del Ticket Actualizado: ${ticketData.ticketNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Estado del Ticket Actualizado</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket:</strong> ${ticketData.ticketNumber}</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Nuevo Estado:</strong> <span style="color: ${newStatus.color}">${newStatus.name}</span></p>
          <p><strong>Actualizado por:</strong> ${updatedByData.name}</p>
        </div>
        
        ${newStatus.name === 'Resuelto' ? `
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
          <h4 style="margin-top: 0; color: #155724;">✅ Ticket Resuelto</h4>
          <p>Tu ticket ha sido marcado como resuelto. Si el problema persiste, puedes agregar un comentario.</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Puedes ver los detalles completos en el sistema web.</p>
        </div>
      </div>
    `;

    // Enviar al solicitante
    await this.sendEmail(ticketData.requester?.email, subject, html);
    
    // Si está asignado, también enviar al técnico
    if (ticketData.assignedUser?.email) {
      await this.sendEmail(ticketData.assignedUser.email, subject, html);
    }
  }

  // Email para nuevo comentario
  async sendNewCommentEmail(ticketData, commentData, authorData) {
    const subject = `Nuevo Comentario en Ticket: ${ticketData.ticketNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Nuevo Comentario en Ticket</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ticket:</strong> ${ticketData.ticketNumber}</p>
          <p><strong>Título:</strong> ${ticketData.title}</p>
          <p><strong>Comentario de:</strong> ${authorData.name} (${authorData.role})</p>
        </div>
        
        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;">
          <h4 style="margin-top: 0;">Comentario:</h4>
          <p>${commentData.content}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666;">Puedes responder agregando un comentario en el sistema web.</p>
        </div>
      </div>
    `;

    // Lista de emails para notificar
    const emailList = new Set();
    
    // Agregar solicitante
    if (ticketData.requester?.email) {
      emailList.add(ticketData.requester.email);
    }
    
    // Agregar técnico asignado
    if (ticketData.assignedUser?.email) {
      emailList.add(ticketData.assignedUser.email);
    }
    
    // No enviar email al autor del comentario
    emailList.delete(authorData.email);
    
    // Enviar emails
    const emailPromises = Array.from(emailList).map(email => 
      this.sendEmail(email, subject, html)
    );

    await Promise.all(emailPromises);
  }

  // Obtener emails de administradores y técnicos
  async getAdminTechEmails() {
    try {
      const result = await query(
        `SELECT email FROM users 
         WHERE role IN ('administrador', 'tecnico') 
         AND is_active = true 
         AND email IS NOT NULL`,
        []
      );
      
      return result.rows.map(row => row.email);
    } catch (error) {
      console.error('Error obteniendo emails de admins/técnicos:', error);
      return [];
    }
  }
}

export default new EmailService();