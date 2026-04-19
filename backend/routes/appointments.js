const express = require('express');
const { pool } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/appointments
router.get('/', auth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'student') {
      query = 'SELECT * FROM appointments WHERE student_id = $1 ORDER BY date DESC';
      params = [req.user.id];
    } else if (req.user.role === 'faculty') {
      query = 'SELECT * FROM appointments WHERE faculty_id = $1 ORDER BY date DESC';
      params = [req.user.id];
    } else {
      query = 'SELECT * FROM appointments ORDER BY date DESC';
      params = [];
    }

    const { rows } = await pool.query(query, params);
    res.json(rows.map(r => ({
      id: r.id,
      studentId: r.student_id,
      studentName: r.student_name,
      facultyId: r.faculty_id,
      facultyName: r.faculty_name,
      officeHourId: r.office_hour_id,
      date: r.date?.toISOString().split('T')[0],
      time: r.time,
      doubt: r.doubt,
      status: r.status
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/appointments - student only
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  const { officeHourId, doubt } = req.body;

  if (!officeHourId || !doubt) return res.status(400).json({ message: 'All fields required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const slot = await client.query('SELECT * FROM office_hours WHERE id = $1 FOR UPDATE', [officeHourId]);
    if (!slot.rows[0]) return res.status(404).json({ message: 'Slot not found' });
    if (slot.rows[0].is_booked) return res.status(400).json({ message: 'Slot already booked' });

    const student = await client.query('SELECT name FROM users WHERE id = $1', [req.user.id]);

    const { rows } = await client.query(
      `INSERT INTO appointments (student_id, student_name, faculty_id, faculty_name, office_hour_id, date, time, doubt)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, student.rows[0].name, slot.rows[0].faculty_id, slot.rows[0].faculty_name,
       officeHourId, slot.rows[0].date, slot.rows[0].time, doubt]
    );

    await client.query('UPDATE office_hours SET is_booked = TRUE WHERE id = $1', [officeHourId]);
    await client.query('COMMIT');

    const r = rows[0];
    res.status(201).json({
      id: r.id, studentId: r.student_id, studentName: r.student_name,
      facultyId: r.faculty_id, facultyName: r.faculty_name, officeHourId: r.office_hour_id,
      date: r.date?.toISOString().split('T')[0], time: r.time, doubt: r.doubt, status: r.status
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// PATCH /api/appointments/:id - faculty only
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Forbidden' });
  const { status } = req.body;

  if (!['approved', 'cancelled', 'completed'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 AND faculty_id = $3 RETURNING *',
      [status, req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Appointment not found' });

    if (status === 'cancelled') {
      await client.query('UPDATE office_hours SET is_booked = FALSE WHERE id = $1', [rows[0].office_hour_id]);
    }

    await client.query('COMMIT');
    const r = rows[0];
    res.json({
      id: r.id, studentId: r.student_id, studentName: r.student_name,
      facultyId: r.faculty_id, facultyName: r.faculty_name, officeHourId: r.office_hour_id,
      date: r.date?.toISOString().split('T')[0], time: r.time, doubt: r.doubt, status: r.status
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;
