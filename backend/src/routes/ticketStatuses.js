import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/ticket-statuses - Obtener todos los estados
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, color, is_final, order_index FROM ticket_statuses WHERE is_active = true ORDER BY order_index'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estados'
    });
  }
});

export default router;
