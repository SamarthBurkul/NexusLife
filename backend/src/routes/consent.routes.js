const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
  createConsentRequest,
  approveConsent,
  denyConsent,
  getPendingRequests,
  getConsentHistory,
} = require('../services/consentEngine');

const router = express.Router();

// All consent routes require authentication
router.use(authMiddleware);

/**
 * GET /api/consent/requests
 * Get all pending consent requests for the authenticated user
 */
router.get('/requests', async (req, res) => {
  try {
    const requests = await getPendingRequests(req.user.id);

    // Map Supabase fields to frontend expected ones
    const mappedRequests = requests.map(r => ({
      id: r.id,
      institution: r.institution_id, 
      fields: r.requested_fields,
      purpose: r.purpose,
      status: r.status,
      createdAt: r.created_at
    }));

    res.json({ success: true, data: mappedRequests });
  } catch (err) {
    console.error('Consent requests error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/consent/approve
 * Approve a consent request with selected fields and expiry
 */
router.post('/approve', async (req, res) => {
  try {
    console.log('Approve called with:', req.body);
    const { consentId, approvedFields, expiryHours } = req.body;

    if (!consentId || !approvedFields || approvedFields.length === 0) {
      return res.status(400).json({ success: false, message: 'consentId and approvedFields required' });
    }

    const result = await approveConsent(consentId, req.user.id, approvedFields, expiryHours || 24);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Approve error:', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/consent/deny
 * Deny a consent request
 */
router.post('/deny', async (req, res) => {
  try {
    const { consentId } = req.body;
    if (!consentId) {
      return res.status(400).json({ success: false, message: 'consentId required' });
    }

    await denyConsent(consentId, req.user.id);
    res.json({ success: true, message: 'Request denied' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/consent/history
 * Get past consent decisions
 */
router.get('/history', async (req, res) => {
  try {
    const history = await getConsentHistory(req.user.id);

    // Map for frontend
    const mappedHistory = history.map(h => ({
      id: h.id,
      institution: h.institution_id,
      purpose: h.purpose,
      status: h.status,
      fields: h.requested_fields,
      decidedAt: h.updated_at || h.created_at
    }));

    res.json({ success: true, data: mappedHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
