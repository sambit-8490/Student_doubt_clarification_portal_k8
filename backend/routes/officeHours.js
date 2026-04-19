const express = require('express');
const { pool } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/office-hours
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM office_hours ORDER BY date, time'
    );
    res.json(rows.map(r => ({
      id: r.id,
      facultyId: r.faculty_id,
      facultyName: r.faculty_name,
      date: r.date?.toISOString().split('T')[0],
      time: r.time,
      isBooked: r.is_booked
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/office-hours - faculty only
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Forbidden' });
  const { date, time } = req.body;

  if (!date || !time) return res.status(400).json({ message: 'Date and time required' });

  try {
    const faculty = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const { rows } = await pool.query(
      'INSERT INTO office_hours (faculty_id, faculty_name, date, time) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, faculty.rows[0].name, date, time]
    );
    const r = rows[0];
    res.status(201).json({
      id: r.id, facultyId: r.faculty_id, facultyName: r.faculty_name,
      date: r.date?.toISOString().split('T')[0], time: r.time, isBooked: r.is_booked
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
