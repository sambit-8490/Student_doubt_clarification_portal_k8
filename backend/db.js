const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS office_hours (
        id SERIAL PRIMARY KEY,
        faculty_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        faculty_name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(50) NOT NULL,
        is_booked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        student_name VARCHAR(100) NOT NULL,
        faculty_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        faculty_name VARCHAR(100) NOT NULL,
        office_hour_id INTEGER REFERENCES office_hours(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time VARCHAR(50) NOT NULL,
        doubt TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed default users if none exist
    const { rows } = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      const hash = (pw) => bcrypt.hashSync(pw, 10);
      await client.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ('Admin User', 'admin@college.edu', '${hash('admin123')}', 'admin'),
        ('Faculty', 'faculty@college.edu', '${hash('faculty123')}', 'faculty'),
        ('Student', 'student@college.edu', '${hash('student123')}', 'student');
      `);
      console.log('✅ Default users seeded');
    }

    console.log('✅ Database initialized');
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
