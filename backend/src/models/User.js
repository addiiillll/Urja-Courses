const { pool } = require('../config/database');

class User {
  static async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(username, passwordHash) {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, passwordHash, 'teacher']
    );
    return result.rows[0];
  }
}

module.exports = User;