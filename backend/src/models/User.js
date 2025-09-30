import { query } from '../utils/database.js';
import bcrypt from 'bcryptjs';

export class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.role = data.role;
    this.department = data.department;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.lastLogin = data.last_login;
    
    // Debug log
    if (process.env.NODE_ENV === 'production') {
      console.log(`👤 Usuario creado: ${this.email} (ID: ${this.id}, Activo: ${this.isActive})`);
    }
  }

  // Crear nuevo usuario
  static async create(userData) {
    const { username, email, password, firstName, lastName, role, department } = userData;
    
    // Hash de la contraseña
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, role, department)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [username, email, passwordHash, firstName, lastName, role, department]
    );

    return new User(result.rows[0]);
  }

  // Buscar usuario por ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [id]
    );

    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Buscar usuario por username
  static async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  // Obtener todos los usuarios
  static async findAll(filters = {}) {
    let queryText = 'SELECT * FROM users WHERE is_active = true';
    const params = [];
    
    if (filters.role) {
      params.push(filters.role);
      queryText += ` AND role = $${params.length}`;
    }
    
    if (filters.department) {
      params.push(filters.department);
      queryText += ` AND department = $${params.length}`;
    }
    
    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);
    return result.rows.map(row => new User(row));
  }

  // Obtener técnicos disponibles
  static async getTechnicians() {
    const result = await query(
      `SELECT * FROM users 
       WHERE role = 'tecnico' AND is_active = true 
       ORDER BY first_name, last_name`,
      []
    );

    return result.rows.map(row => new User(row));
  }

  // Validar contraseña
  async validatePassword(password) {
    // Usar email en lugar de id para evitar problemas con UUIDs
    const result = await query(
      'SELECT password_hash FROM users WHERE email = $1 AND is_active = true',
      [this.email]
    );
    
    if (!result.rows[0]) {
      console.log(`❌ No se encontró usuario con email: ${this.email}`);
      return false;
    }

    console.log(`🔐 Validando contraseña para: ${this.email}`);
    const isValid = await bcrypt.compare(password, result.rows[0].password_hash);
    console.log(`🔐 Resultado validación: ${isValid}`);
    return isValid;
  }

  // Actualizar último login
  async updateLastLogin() {
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [this.id]
    );
  }

  // Actualizar usuario
  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined && key !== 'id') {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return this;
    }

    values.push(this.id);
    const queryText = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await query(queryText, values);
    return new User(result.rows[0]);
  }

  // Cambiar contraseña
  async changePassword(newPassword) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, this.id]
    );
  }

  // Desactivar usuario
  async deactivate() {
    await query(
      'UPDATE users SET is_active = false WHERE id = $1',
      [this.id]
    );
  }

  // Serializar para JSON (sin datos sensibles)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      department: this.department,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin
    };
  }
}

export default User;