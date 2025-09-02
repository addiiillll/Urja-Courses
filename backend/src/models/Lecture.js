const { pool } = require('../config/database');

class Lecture {
  static async create(courseId, title, videoUrl) {
    const result = await pool.query(
      'INSERT INTO lectures (course_id, title, video_url) VALUES ($1, $2, $3) RETURNING id',
      [courseId, title, videoUrl]
    );
    return result.rows[0].id;
  }

  static async findByCourseId(courseId) {
    const result = await pool.query(
      'SELECT * FROM lectures WHERE course_id = $1',
      [courseId]
    );
    return result.rows;
  }
}

module.exports = Lecture;