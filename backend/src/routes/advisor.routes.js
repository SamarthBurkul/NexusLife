const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/auth.middleware');
require('dotenv').config();

const router = express.Router();
router.use(authMiddleware);

/**
 * GET /api/advisor/insights
 * Proxy to AI service for insights, with graceful fallback
 */
router.get('/insights', async (req, res) => {
  try {
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const aiRes = await axios.get(`${aiUrl}/ai/insights`, {
      params: { user_id: req.user.id },
      timeout: 5000,
    });
    return res.json({ success: true, data: aiRes.data.insights });
  } catch {
    // Fallback mock insights when AI service is unavailable
    res.json({
      success: true,
      data: [
        { id: 1, category: 'finance', text: 'Your income growth suggests you could increase SIP investments by 20%.', urgency: 'medium', action: 'Review investments' },
        { id: 2, category: 'health', text: 'Your health insurance expires in 30 days. Renew to maintain your health score.', urgency: 'high', action: 'Renew insurance' },
        { id: 3, category: 'jobs', text: 'Based on your 2 years at Infosys, consider updating certifications for career growth.', urgency: 'low', action: 'Explore certifications' },
        { id: 4, category: 'finance', text: 'Your credit score has improved. You may qualify for better loan rates now.', urgency: 'medium', action: 'Check rates' },
        { id: 5, category: 'health', text: 'No dental checkup recorded in 8 months. Schedule one soon.', urgency: 'low', action: 'Book appointment' },
      ],
    });
  }
});

/**
 * POST /api/advisor/chat
 * Proxy to AI service for chat, with graceful fallback
 */
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message required' });

  try {
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const aiRes = await axios.post(`${aiUrl}/ai/chat`, {
      message,
      history: history || [],
      user_context: { userId: req.user.id, fullName: req.user.fullName },
    }, { timeout: 15000 });

    return res.json({ success: true, response: aiRes.data.response });
  } catch {
    // Fallback response when AI service is unavailable
    res.json({
      success: true,
      response: `I appreciate your question about "${message}". Currently the AI service is connecting. In the meantime, here are some general tips:\n\n1. Keep your data sources synced for an accurate trust score.\n2. Review pending consent requests regularly.\n3. Use data cards to share verified information securely.\n\nPlease try again shortly for personalized AI-powered insights.`,
    });
  }
});

module.exports = router;
