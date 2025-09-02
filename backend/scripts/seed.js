require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

const seedDatabase = async () => {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);

    // Insert seed users
    await pool.query(`
      INSERT INTO users (username, password_hash, role) VALUES 
      ('admin', $1, 'admin'),
      ('teacher1', $2, 'teacher')
      ON CONFLICT (username) DO NOTHING
    `, [adminPassword, teacherPassword]);

    // Insert sample courses
    await pool.query(`
      INSERT INTO courses (teacher_id, title, description, is_published) VALUES 
      (2, 'JavaScript Fundamentals', 'Learn the basics of JavaScript programming', false),
      (2, 'React for Beginners', 'Introduction to React framework', true)
    `);

    // Insert sample lectures
    await pool.query(`
      INSERT INTO lectures (course_id, title, video_url) VALUES 
      (1, 'Variables and Data Types', 'https://example.com/video1'),
      (1, 'Functions and Scope', 'https://example.com/video2'),
      (2, 'Components and JSX', 'https://example.com/video3')
    `);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();