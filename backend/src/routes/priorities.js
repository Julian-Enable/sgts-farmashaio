import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// GET /api/priorities - Obtener todas las prioridades
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, level, color, description FROM priorities WHERE is_active = true ORDER BY level'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener prioridades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener prioridades'
    });
  }
});

export default router;
