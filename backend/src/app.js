const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const consentRoutes = require('./routes/consent.routes');
const trustscoreRoutes = require('./routes/trustscore.routes');
const sourcesRoutes = require('./routes/sources.routes');
const advisorRoutes = require('./routes/advisor.routes');
const { generalLimiter } = require('./middleware/rateLimit.middleware');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/trustscore', trustscoreRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/advisor', advisorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'nexuslife-backend', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

module.exports = app;
