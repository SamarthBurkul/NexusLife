const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { supabase } = require('../config/db');

const router = express.Router();
router.use(authMiddleware);

/**
 * GET /api/timeline/events
 * Get all life events for the authenticated user
 */
router.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('life_events')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    // Map event_type to type for frontend consistency
    const mappedData = data.map(event => ({
      ...event,
      type: event.event_type,
    }));

    res.json({ success: true, data: mappedData });
  } catch (err) {
    console.error('Timeline GET error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch timeline events' });
  }
});

/**
 * POST /api/timeline/events
 * Add a new life event manually
 */
router.post('/events', async (req, res) => {
  try {
    const { title, institution, date, type } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ success: false, message: 'Missing required event fields' });
    }

    const { data, error } = await supabase
      .from('life_events')
      .insert({
        user_id: req.user.id,
        event_type: type.toLowerCase(),
        title,
        institution: institution || 'Self-Reported',
        date,
        verified: false // manual entries are unverified by default
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Timeline POST error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to add timeline event' });
  }
});

module.exports = router;
