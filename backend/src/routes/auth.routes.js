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

/**
 * POST /api/auth/register
 * Create a new user account — persisted in Supabase
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

    // Check if user already exists in Supabase
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Encrypt Aadhaar (sensitive data)
    const aadhaarHash = aadhaar ? encryptData(aadhaar) : null;

    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        phone: phone || null,
        full_name: fullName,
        password_hash: passwordHash,
        aadhaar_hash: aadhaarHash,
      })
      .select('id, email, full_name, phone')
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError.message);
      return res.status(500).json({ success: false, message: 'Registration failed' });
    }

    // Create default user profile with zero scores
    await supabase.from('user_profiles').insert({
      user_id: newUser.id,
      trust_score: 0,
      education_score: 0,
      finance_score: 0,
      health_score: 0,
      employment_score: 0,
    });

    // Generate JWT — keep same payload shape for AuthContext.jsx
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.full_name, phone: newUser.phone },
      process.env.JWT_SECRET || 'nexuslife_jwt_secret_change_in_production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, email: newUser.email, fullName: newUser.full_name },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate against Supabase and return JWT
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

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.full_name, phone: user.phone },
      process.env.JWT_SECRET || 'nexuslife_jwt_secret_change_in_production',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
  } catch (err) {
    console.error('Login error:', err.message);
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
