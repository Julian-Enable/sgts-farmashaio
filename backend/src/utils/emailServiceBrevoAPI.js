import * as brevo from '@getbrevo/brevo';
import { query } from '../utils/database.js';

class EmailServiceBrevoAPI {
  constructor() {
    // Inicializar cliente de Brevo API
    this.apiInstance = new brevo.TransactionalEmailsApi();
    
    // Configurar API Key
    const apiKey = this.apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.EMAIL_PASS; // El SMTP key también funciona como API key
    
    console.log('📧 Configurando Brevo API para envío de emails');
    console.log('📧 Remitente configurado:', process.env.EMAIL_FROM);
  }

  // Verificar configuración
  async verifyConnection() {
    try {
      if (!process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_PASS (API key) no configurada');
        return false;
      }
      console.log('✅ Brevo API configurada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración de Brevo API:', error.message);
      return false;
    }
  }

  // Enviar email usando Brevo API
  async sendEmail(to, subject, html, text = '') {
    try {
      if (!process.env.EMAIL_PASS) {
        console.log('🔧 Brevo API no configurada, saltando envío');
        return false;
      }

      console.log(`📤 Enviando email vía Brevo API a: ${to}`);
      console.log(`📝 Asunto: ${subject}`);

      // Preparar email con formato de Brevo
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.sender = {
        name: "SGTS FARMASHAIO",
        email: "soporte.invfs@gmail.com" // Email verificado en Brevo
      };
      
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = html;
      sendSmtpEmail.textContent = text || this.htmlToText(html);

      // Enviar email
      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      
      console.log('✅ Email enviado exitosamente vía Brevo API');
      console.log('📧 Message ID:', response.messageId);
      console.log('📬 Destinatario:', to);
      
      return true;
    } catch (error) {
      console.error('❌ Error enviando email vía Brevo API:', error.message);
      if (error.response) {
        console.error('📋 Respuesta de error:', error.response.body);
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
          <p><strong>Categoría:</strong> ${ticketData.category?.name || 'N/A'}</p>
          <p><strong>Prioridad:</strong> ${ticketData.priority?.name || 'N/A'}</p>
          <p><strong>Estado:</strong> ${ticketData.status?.name || 'Nuevo'}</p>
          <p><strong>Solicitante:</strong> ${requesterData.name} (${requesterData.email})</p>
          <p><strong>Departamento:</strong> ${requesterData.department || 'N/A'}</p>
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

export default new EmailServiceBrevoAPI();
