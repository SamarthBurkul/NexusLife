const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { fetchDigiLockerData, fetchABHAData, fetchAAData, fetchLinkedInData } = require('../services/dataConnector');

const router = express.Router();
router.use(authMiddleware);

// In-memory store for connected sources
const connectedSources = new Map();

/**
 * GET /api/sources
 * List all data sources and their connection status
 */
router.get('/', (req, res) => {
  const userSources = connectedSources.get(req.user.id) || {};

  const sources = [
    { id: 'digilocker', name: 'DigiLocker', category: 'Education/Govt', connected: !!userSources.digilocker, lastSync: userSources.digilocker?.lastSync || null },
    { id: 'abha', name: 'ABHA', category: 'Health', connected: !!userSources.abha, lastSync: userSources.abha?.lastSync || null },
    { id: 'aa', name: 'Account Aggregator', category: 'Finance', connected: !!userSources.aa, lastSync: userSources.aa?.lastSync || null },
    { id: 'linkedin', name: 'LinkedIn/HRMS', category: 'Employment', connected: !!userSources.linkedin, lastSync: userSources.linkedin?.lastSync || null },
    { id: 'aadhaar', name: 'Aadhaar Auth', category: 'Identity', connected: !!userSources.aadhaar, lastSync: userSources.aadhaar?.lastSync || null },
    { id: 'pan', name: 'PAN Verification', category: 'Tax', connected: !!userSources.pan, lastSync: userSources.pan?.lastSync || null },
  ];

  res.json({ success: true, data: sources });
});

/**
 * POST /api/sources/connect
 * Mock connect a data source (simulates OAuth flow)
 */
router.post('/connect', async (req, res) => {
  const { sourceId } = req.body;
  if (!sourceId) return res.status(400).json({ success: false, message: 'sourceId required' });

  const userSources = connectedSources.get(req.user.id) || {};
  userSources[sourceId] = { connected: true, lastSync: new Date().toISOString(), status: 'active' };
  connectedSources.set(req.user.id, userSources);

  // Fetch initial data from mock connector
  let data = null;
  try {
    switch (sourceId) {
      case 'digilocker': data = await fetchDigiLockerData(req.user.id); break;
      case 'abha': data = await fetchABHAData(req.user.id); break;
      case 'aa': data = await fetchAAData(req.user.id); break;
      case 'linkedin': data = await fetchLinkedInData(req.user.id); break;
      default: break;
    }
  } catch { /* ignore fetch errors on connect */ }

  res.json({ success: true, message: `${sourceId} connected successfully`, data });
});

/**
 * DELETE /api/sources/:sourceId
 * Disconnect a data source
 */
router.delete('/:sourceId', (req, res) => {
  const userSources = connectedSources.get(req.user.id) || {};
  delete userSources[req.params.sourceId];
  connectedSources.set(req.user.id, userSources);
  res.json({ success: true, message: 'Source disconnected' });
});

/**
 * POST /api/sources/sync/:sourceId
 * Trigger a data sync from a connected source
 */
router.post('/sync/:sourceId', async (req, res) => {
  const { sourceId } = req.params;
  const userSources = connectedSources.get(req.user.id) || {};

  if (!userSources[sourceId]) {
    return res.status(400).json({ success: false, message: 'Source not connected' });
  }

  let data = null;
  switch (sourceId) {
    case 'digilocker': data = await fetchDigiLockerData(req.user.id); break;
    case 'abha': data = await fetchABHAData(req.user.id); break;
    case 'aa': data = await fetchAAData(req.user.id); break;
    case 'linkedin': data = await fetchLinkedInData(req.user.id); break;
    default: break;
  }

  userSources[sourceId].lastSync = new Date().toISOString();
  connectedSources.set(req.user.id, userSources);

  res.json({ success: true, message: 'Sync completed', data });
});

module.exports = router;
