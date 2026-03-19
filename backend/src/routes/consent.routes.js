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

const parseFields = (fields) => {
  if (Array.isArray(fields)) return fields;
  if (typeof fields === 'string') {
    try { 
      const parsed = JSON.parse(fields); 
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { 
      return [fields]; 
    }
  }
  return [];
};

// All consent routes require authentication
router.use(authMiddleware);

/**
 * GET /api/consent/requests
 * Get all pending consent requests for the authenticated user
 * Auto-seeds with 3 demo requests if user has none
 */
router.get('/requests', async (req, res) => {
  try {
    let requests = await getPendingRequests(req.user.id);
    
    // Auto-seed demo requests if user has none
    if (!requests || requests.length === 0) {
      console.log('[CONSENT] Auto-seeding demo requests for user:', req.user.id);
      const demoRequests = [
        { inst: 'State Bank of India', fields: ['full_name','income','trust_score'], purpose: 'Loan Application' },
        { inst: 'Apollo Hospital', fields: ['blood_group','health_insurance','allergies'], purpose: 'Treatment Records' },
        { inst: 'Infosys HR', fields: ['full_name','education','certifications'], purpose: 'Background Verification' },
      ];
      for (const d of demoRequests) {
        await createConsentRequest(d.inst, req.user.id, d.fields, d.purpose);
      }
      requests = await getPendingRequests(req.user.id);
    }

    // Map Supabase fields to frontend expected ones
    const mappedRequests = requests.map(r => ({
      id: r.id,
      institution: r.institution_id, 
      fields: parseFields(r.requested_fields),
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
 * POST /api/consent/mock
 * Generate a demo consent request for empty states
 */
router.post('/mock', async (req, res) => {
  try {
    const mockInst = ['State Bank of India', 'Apollo Hospital', 'Infosys HR'][Math.floor(Math.random() * 3)];
    const mockPurpose = ['Loan App', 'Treatment Records', 'Background Check'][Math.floor(Math.random() * 3)];
    const mockFields = ['Full Name', 'Date of Birth', 'Email', 'Credit Score'];
    
    const data = await createConsentRequest(mockInst, req.user.id, mockFields, mockPurpose);
    res.status(201).json({ success: true, data });
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
    console.log('Approve called with:', req.body);
    let { consentId, approvedFields, expiryHours } = req.body;

    // ensure approvedFields is fundamentally an array
    if (typeof approvedFields === 'string') {
        try { approvedFields = JSON.parse(approvedFields); } catch(e) { approvedFields = [approvedFields]; }
    }

    if (!consentId || !approvedFields || !Array.isArray(approvedFields) || approvedFields.length === 0) {
      return res.status(400).json({ success: false, message: 'consentId and approvedFields array required' });
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
      fields: parseFields(h.requested_fields),
      decidedAt: h.updated_at || h.created_at
    }));

    res.json({ success: true, data: mappedHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
