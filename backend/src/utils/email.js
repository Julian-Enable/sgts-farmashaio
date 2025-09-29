import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del transportador de email
let transporter = null;

const initEmailTransporter = () => {
  try {
    // Si no están configuradas las variables de entorno, usar configuración de prueba
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
      console.log('📧 Variables de email no configuradas, usando modo de prueba');
      return nodemailer.createTestAccount().then((testAccount) => {
        return nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      });
    }

    // Configuración de producción/desarrollo
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('✅ Transportador de email configurado');
    return Promise.resolve(transporter);
  } catch (error) {
    console.error('❌ Error configurando email:', error.message);
    return null;
  }
};

// Función para enviar notificaciones por email
const sendNotificationEmail = async (to, subject, text, html = null) => {
  try {
    if (!transporter) {
      transporter = await initEmailTransporter();
    }

    if (!transporter) {
      console.log('📧 Email no disponible, saltando notificación');
      return false;
    }

    const mailOptions = {
      from: `"SGTS FARMASHAIO" <${process.env.EMAIL_USER || 'noreply@sgts.com'}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', result.messageId);
    
    // Si es cuenta de prueba, mostrar preview URL
    if (result.messageId && result.messageId.includes('ethereal')) {
      console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(result));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    return false;
  }
};

// Plantillas de email
const emailTemplates = {
  ticketCreated: (ticketId, title, createdBy) => ({
    subject: `Nuevo Ticket Creado - #${ticketId}`,
    text: `Se ha creado un nuevo ticket:
    
ID: #${ticketId}
Título: ${title}
Creado por: ${createdBy}
    
Ingresa al sistema para más detalles.`,
    html: `
      <h2>Nuevo Ticket Creado</h2>
      <p><strong>ID:</strong> #${ticketId}</p>
      <p><strong>Título:</strong> ${title}</p>
      <p><strong>Creado por:</strong> ${createdBy}</p>
      <p>Ingresa al sistema para más detalles.</p>
    `
  }),

  ticketAssigned: (ticketId, title, assignedTo) => ({
    subject: `Ticket Asignado - #${ticketId}`,
    text: `Se te ha asignado un nuevo ticket:
    
ID: #${ticketId}
Título: ${title}
Asignado a: ${assignedTo}
    
Ingresa al sistema para más detalles.`,
    html: `
      <h2>Ticket Asignado</h2>
      <p><strong>ID:</strong> #${ticketId}</p>
      <p><strong>Título:</strong> ${title}</p>
      <p><strong>Asignado a:</strong> ${assignedTo}</p>
      <p>Ingresa al sistema para más detalles.</p>
    `
  }),

  ticketStatusChanged: (ticketId, title, oldStatus, newStatus) => ({
    subject: `Cambio de Estado - Ticket #${ticketId}`,
    text: `El estado del ticket ha cambiado:
    
ID: #${ticketId}
Título: ${title}
Estado anterior: ${oldStatus}
Nuevo estado: ${newStatus}
    
Ingresa al sistema para más detalles.`,
    html: `
      <h2>Cambio de Estado</h2>
      <p><strong>ID:</strong> #${ticketId}</p>
      <p><strong>Título:</strong> ${title}</p>
      <p><strong>Estado anterior:</strong> ${oldStatus}</p>
      <p><strong>Nuevo estado:</strong> ${newStatus}</p>
      <p>Ingresa al sistema para más detalles.</p>
    `
  })
};

// Función para enviar notificación específica
const sendTicketNotification = async (type, recipientEmail, data) => {
  try {
    let template;
    
    switch (type) {
      case 'created':
        template = emailTemplates.ticketCreated(data.ticketId, data.title, data.createdBy);
        break;
      case 'assigned':
        template = emailTemplates.ticketAssigned(data.ticketId, data.title, data.assignedTo);
        break;
      case 'status_changed':
        template = emailTemplates.ticketStatusChanged(data.ticketId, data.title, data.oldStatus, data.newStatus);
        break;
      default:
        console.error('Tipo de notificación desconocido:', type);
        return false;
    }

    return await sendNotificationEmail(recipientEmail, template.subject, template.text, template.html);
  } catch (error) {
    console.error('Error enviando notificación de ticket:', error.message);
    return false;
  }
};

export {
  initEmailTransporter,
  sendNotificationEmail,
  sendTicketNotification,
  emailTemplates
};