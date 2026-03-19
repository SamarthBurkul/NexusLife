const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { fetchDigiLockerData, fetchABHAData, fetchAAData, fetchLinkedInData } = require('../services/dataConnector');
const { supabase } = require('../config/db');

const router = express.Router();
router.use(authMiddleware);

/**
 * GET /api/sources
 * List all data sources and their connection status
 */
router.get('/', async (req, res) => {
  const { data: dbSources } = await supabase.from('connected_sources').select('*').eq('user_id', req.user.id);
  const userMap = {};
  if (dbSources) dbSources.forEach(s => userMap[s.source_name] = s);

  const sources = [
    { id: 'digilocker', name: 'DigiLocker', category: 'Education/Govt', connected: !!userMap.digilocker, lastSync: userMap.digilocker?.last_sync || null },
    { id: 'abha', name: 'ABHA', category: 'Health', connected: !!userMap.abha, lastSync: userMap.abha?.last_sync || null },
    { id: 'aa', name: 'Account Aggregator', category: 'Finance', connected: !!userMap.aa, lastSync: userMap.aa?.last_sync || null },
    { id: 'linkedin', name: 'LinkedIn/HRMS', category: 'Employment', connected: !!userMap.linkedin, lastSync: userMap.linkedin?.last_sync || null },
    { id: 'aadhaar', name: 'Aadhaar Auth', category: 'Identity', connected: !!userMap.aadhaar, lastSync: userMap.aadhaar?.last_sync || null },
    { id: 'pan', name: 'PAN Verification', category: 'Tax', connected: !!userMap.pan, lastSync: userMap.pan?.last_sync || null },
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

  await supabase.from('connected_sources').upsert({
    user_id: req.user.id,
    source_name: sourceId,
    status: 'active',
    last_sync: new Date().toISOString()
  }, { onConflict: 'user_id, source_name' });

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
router.delete('/:sourceId', async (req, res) => {
  await supabase.from('connected_sources').delete().eq('user_id', req.user.id).eq('source_name', req.params.sourceId);
  res.json({ success: true, message: 'Source disconnected' });
});

/**
 * POST /api/sources/sync/:sourceId
 * Trigger a data sync from a connected source
 */
router.post('/sync/:sourceId', async (req, res) => {
  const { sourceId } = req.params;
  const { data: source } = await supabase.from('connected_sources').select('id').eq('user_id', req.user.id).eq('source_name', sourceId).single();

  if (!source) {
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

  await supabase.from('connected_sources').update({
    last_sync: new Date().toISOString()
  }).eq('user_id', req.user.id).eq('source_name', sourceId);

  res.json({ success: true, message: 'Sync completed', data });
});

module.exports = router;
