// Script para crear notificaciones de prueba
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com',
  port: 5432,
  user: 'sgts_user',
  password: 'OtfEGRj0XljH4C7HTvItnKUHwL3742iQ',
  database: 'sgts_farmashaio_u3b7',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestNotifications() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Obtener el ID del usuario admin
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = 'admin@farmashaio.com'"
    );

    if (userResult.rows.length === 0) {
      console.error('❌ Usuario admin no encontrado');
      return;
    }

    const userId = userResult.rows[0].id;
    console.log('👤 Usuario admin ID:', userId);

    // Crear notificaciones de prueba
    const notifications = [
      {
        type: 'ticket_assigned',
        title: '🎫 Nuevo Ticket Asignado',
        message: 'Se te ha asignado el ticket #1 - Problema con impresora HP LaserJet',
        ticketId: 1,
        hoursAgo: 2
      },
      {
        type: 'ticket_commented',
        title: '💬 Nuevo Comentario en Ticket',
        message: 'Juan Pérez agregó un comentario en el ticket #2 - Error de conexión a red',
        ticketId: 2,
        hoursAgo: 0.5
      },
      {
        type: 'ticket_updated',
        title: '🔄 Ticket Actualizado',
        message: 'El estado del ticket #3 ha cambiado de "Nuevo" a "En Progreso"',
        ticketId: 3,
        hoursAgo: 0.25
      },
      {
        type: 'ticket_priority_changed',
        title: '⚠️ Prioridad Actualizada',
        message: 'La prioridad del ticket #2 ha sido cambiada de "Media" a "Alta"',
        ticketId: 2,
        hoursAgo: 0.08
      },
      {
        type: 'ticket_closed',
        title: '✅ Ticket Cerrado',
        message: 'El ticket #1 - Problema con impresora ha sido cerrado exitosamente',
        ticketId: 1,
        hoursAgo: 24,
        isRead: true
      }
    ];

    for (const notif of notifications) {
      const createdAt = new Date(Date.now() - notif.hoursAgo * 60 * 60 * 1000);
      
      await client.query(
        `INSERT INTO notifications (user_id, ticket_id, type, title, message, is_read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, notif.ticketId, notif.type, notif.title, notif.message, notif.isRead || false, createdAt]
      );
      
      console.log(`✅ Creada: ${notif.title}`);
    }

    // Verificar las notificaciones creadas
    const countResult = await client.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as no_leidas
       FROM notifications
       WHERE user_id = $1`,
      [userId]
    );

    console.log('\n📊 Resumen:');
    console.log(`   Total de notificaciones: ${countResult.rows[0].total}`);
    console.log(`   No leídas: ${countResult.rows[0].no_leidas}`);
    console.log(`   Leídas: ${countResult.rows[0].total - countResult.rows[0].no_leidas}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createTestNotifications();
