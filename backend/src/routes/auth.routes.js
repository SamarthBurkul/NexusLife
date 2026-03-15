const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { encryptData } = require('../services/dataVault');
const { supabase } = require('../config/db');
require('dotenv').config();

const router = express.Router();
router.use(authLimiter);

// In-memory user store (mock for hackathon — replace with Supabase queries in prod)
const users = new Map();

/**
 * POST /api/auth/register
 * Create a new user account
 */
router.post('/register', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { fullName, email, phone, password, aadhaar, domains } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Encrypt Aadhaar (sensitive data)
    const aadhaarHash = aadhaar ? encryptData(aadhaar) : null;

    // Create user object
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      fullName,
      email,
      phone: phone || null,
      passwordHash,
      aadhaarHash,
      domains: domains || [],
      createdAt: new Date().toISOString(),
    };

    users.set(email, user);

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email, fullName, phone },
      process.env.JWT_SECRET || 'nexuslife_jwt_secret_change_in_production',
      { expiresIn: '24h' }
    );

    res.status(201).json({ success: true, token, user: { id: userId, email, fullName } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate and return JWT
 */
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const { email, password } = req.body;
    const user = users.get(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone },
      process.env.JWT_SECRET || 'nexuslife_jwt_secret_change_in_production',
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, user: { id: user.id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Mock OTP verification — accepts any 6-digit code for hackathon
 */
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!otp || otp.length !== 6) {
    return res.status(400).json({ success: false, message: 'Invalid OTP — must be 6 digits' });
  }

  // Mock: Accept any 6-digit OTP
  res.json({ success: true, message: 'OTP verified successfully', phone });
});

module.exports = router;
