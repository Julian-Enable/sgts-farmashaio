import express from 'express';
import { query } from '../utils/database.js';

const router = express.Router();

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, description, color FROM categories WHERE is_active = true ORDER BY name'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
});

export default router;
