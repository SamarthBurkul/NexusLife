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
router.get('/requests', (req, res) => {
  try {
    const requests = getPendingRequests(req.user.id);

    // If no requests in system, return mock data for demo
    if (requests.length === 0) {
      return res.json({
        success: true,
        data: [
          { id: 'mock-1', institution: 'State Bank of India', institutionId: 'sbi-001', requestedFields: ['full_name', 'income', 'credit_score', 'employment_status'], purpose: 'Loan Application', status: 'pending', createdAt: new Date().toISOString() },
          { id: 'mock-2', institution: 'Apollo Hospital', institutionId: 'apollo-001', requestedFields: ['full_name', 'blood_group', 'allergies', 'insurance_id'], purpose: 'Treatment Records', status: 'pending', createdAt: new Date().toISOString() },
        ],
      });
    }

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/consent/approve
 * Approve a consent request with selected fields and expiry
 */
router.post('/approve', async (req, res) => {
  try {
    const { consentId, approvedFields, expiryHours } = req.body;

    if (!consentId || !approvedFields || approvedFields.length === 0) {
      return res.status(400).json({ success: false, message: 'consentId and approvedFields required' });
    }

    // For mock requests, create a real consent request first
    if (consentId.startsWith('mock-')) {
      const mockReq = createConsentRequest('institution-001', req.user.id, approvedFields, 'Demo request');
      const result = await approveConsent(mockReq.id, req.user.id, approvedFields, expiryHours || 24);
      return res.json({ success: true, data: result });
    }

    const result = await approveConsent(consentId, req.user.id, approvedFields, expiryHours || 24);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/consent/deny
 * Deny a consent request
 */
router.post('/deny', (req, res) => {
  try {
    const { consentId } = req.body;
    if (!consentId) {
      return res.status(400).json({ success: false, message: 'consentId required' });
    }

    // For mock requests, just return success
    if (consentId.startsWith('mock-')) {
      return res.json({ success: true, message: 'Request denied' });
    }

    denyConsent(consentId, req.user.id);
    res.json({ success: true, message: 'Request denied' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/consent/history
 * Get past consent decisions
 */
router.get('/history', (req, res) => {
  try {
    const history = getConsentHistory(req.user.id);

    // Return mock history if empty
    if (history.length === 0) {
      return res.json({
        success: true,
        data: [
          { id: 'hist-1', institution: 'HDFC Bank', purpose: 'Credit Card Application', action: 'approved', timestamp: '2025-03-10T11:00:00Z', fields: ['income', 'employment_status'] },
          { id: 'hist-2', institution: 'LIC', purpose: 'Insurance Claim', action: 'denied', timestamp: '2025-03-08T16:00:00Z', fields: ['health_records'] },
        ],
      });
    }

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
