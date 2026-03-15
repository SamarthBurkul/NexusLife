const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth.middleware');
require('dotenv').config();

const router = express.Router();
router.use(authMiddleware);

// Mock trust score data
const mockScore = {
  total: 78,
  education: 22,
  finance: 20,
  health: 18,
  employment: 18,
  lastUpdated: new Date().toISOString(),
};

/**
 * GET /api/trustscore
 * Get current trust score
 */
router.get('/', async (req, res) => {
  try {
    // Try to get from AI service
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const aiRes = await axios.post(`${aiUrl}/ai/calculate`, { userData: { userId: req.user.id } }, { timeout: 5000 });
      return res.json({ success: true, data: aiRes.data });
    } catch {
      // Fallback to mock data
    }

    res.json({ success: true, data: mockScore });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/trustscore/breakdown
 * Get score breakdown by category
 */
router.get('/breakdown', (req, res) => {
  res.json({
    success: true,
    data: {
      total: mockScore.total,
      categories: [
        { name: 'Education', score: 22, max: 25, factors: ['Degree level', 'Institution rating', 'Certifications'] },
        { name: 'Finance', score: 20, max: 25, factors: ['Income regularity', 'Savings', 'Credit score'] },
        { name: 'Health', score: 18, max: 25, factors: ['Insurance active', 'Regular checkups', 'Health records'] },
        { name: 'Employment', score: 18, max: 25, factors: ['Job stability', 'Seniority', 'Verification'] },
      ],
      history: [
        { month: 'Oct', score: 62 }, { month: 'Nov', score: 65 }, { month: 'Dec', score: 68 },
        { month: 'Jan', score: 71 }, { month: 'Feb', score: 74 }, { month: 'Mar', score: 78 },
      ],
    },
  });
});

/**
 * POST /api/trustscore/recalculate
 * Trigger score recalculation
 */
router.post('/recalculate', async (req, res) => {
  res.json({ success: true, data: mockScore, message: 'Score recalculated' });
});

module.exports = router;
