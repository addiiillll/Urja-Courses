require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const lectureRoutes = require('./src/routes/lectureRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', lectureRoutes);

module.exports = app;