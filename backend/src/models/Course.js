const { pool } = require('../config/database');

class Course {
  static async findAll() {
    const result = await pool.query(`
      SELECT c.*, u.username as teacher_name 
      FROM courses c 
      JOIN users u ON c.teacher_id = u.id
    `);
    return result.rows;
  }

  static async findByTeacherId(teacherId) {
    const result = await pool.query(
      'SELECT * FROM courses WHERE teacher_id = $1',
      [teacherId]
    );
    return result.rows;
  }

  static async create(teacherId, title, description) {
    const result = await pool.query(
      'INSERT INTO courses (teacher_id, title, description) VALUES ($1, $2, $3) RETURNING id',
      [teacherId, title, description]
    );
    return result.rows[0].id;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async togglePublishStatus(id) {
    await pool.query(
      'UPDATE courses SET is_published = NOT is_published WHERE id = $1',
      [id]
    );
  }
}

module.exports = Course;