const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const consentRoutes = require('./routes/consent.routes');
const trustscoreRoutes = require('./routes/trustscore.routes');
const sourcesRoutes = require('./routes/sources.routes');
const advisorRoutes = require('./routes/advisor.routes');
const timelineRoutes = require('./routes/timeline.routes');
const { generalLimiter } = require('./middleware/rateLimit.middleware');

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || /^http:\/\/localhost/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/trustscore', trustscoreRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/advisor', advisorRoutes);
app.use('/api/timeline', timelineRoutes);

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
