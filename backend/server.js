require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'https://student-doubt-clarification-portal.vercel.app'], credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/office-hours', require('./routes/officeHours'));
app.use('/api/appointments', require('./routes/appointments'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('❌ DB init failed:', err.message);
  process.exit(1);
});
