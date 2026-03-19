const crypto = require('crypto');
const { getRedisClient } = require('../config/redis');
const { supabase } = require('../config/db');

const consentTokenStore = new Map();

/**
 * ============================================
 * CONSENT ENGINE — Core of NexusLife
 * ============================================
 */

async function approveConsent(consentId, userId, approvedFields, expiryHours = 24) {
  console.log('[APPROVE] consentId:', consentId, '| userId:', userId, '| fields:', approvedFields);

  // Fetch the consent request — filter by id ONLY, no user_id check
  const { data: request, error: fetchErr } = await supabase
    .from('consent_requests')
    .select('*')
    .eq('id', consentId)
    .single();

  console.log('[APPROVE] Fetched:', request?.id, '| status:', request?.status, '| error:', fetchErr?.message);

  if (fetchErr || !request) {
    throw new Error('Consent request not found: ' + (fetchErr?.message || 'no data'));
  }
  if (request.status !== 'pending') {
    throw new Error('Request already processed (status: ' + request.status + ')');
  }

  const consentToken = require('crypto').randomBytes(32).toString('hex');
  const ttl = expiryHours * 3600;

  // Store token in memory — no Redis dependency
  consentTokenStore.set(`consent:${consentToken}`, {
    consentId,
    userId,
    institutionId: request.institution_id,
    approvedFields,
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
  });

  // Update status in Supabase
  const { data: updateData, error: updateErr } = await supabase
    .from('consent_requests')
    .update({ status: 'approved', requested_fields: JSON.stringify(approvedFields) })
    .eq('id', consentId)
    .select();

  console.log('[APPROVE] Update result:', updateData?.length, 'rows | error:', updateErr?.message);

  if (updateErr) throw new Error('DB update error: ' + updateErr.message);
  if (!updateData || updateData.length === 0) {
    throw new Error('Update returned 0 rows — consentId not found in DB: ' + consentId);
  }

  // Insert consent grant (non-blocking)
  supabase
    .from('consent_grants')
    .insert({
      consent_request_id: consentId,
      consent_token: consentToken,
      expires_at: new Date(Date.now() + ttl * 1000).toISOString(),
      used: false,
    })
    .then(({ error }) => {
      if (error) console.warn('[APPROVE] Grant insert failed (non-critical):', error.message);
    });

  return { consentToken, approvedFields, expiresAt: new Date(Date.now() + ttl * 1000).toISOString() };
}

/**
 * Deny a consent request
 */
async function denyConsent(consentId, userId) {
  console.log('[DENY] consentId:', consentId);

  // Fetch by id only — no user_id check
  const { data: request, error: fetchErr } = await supabase
    .from('consent_requests')
    .select('id, status')
    .eq('id', consentId)
    .single();

  if (fetchErr || !request) {
    throw new Error('Consent request not found: ' + (fetchErr?.message || 'no data'));
  }
  if (request.status !== 'pending') {
    throw new Error('Request already processed (status: ' + request.status + ')');
  }

  const { error: updateErr } = await supabase
    .from('consent_requests')
    .update({ status: 'denied' })
    .eq('id', consentId);

  if (updateErr) throw new Error('DB update error: ' + updateErr.message);

  console.log('[DENY] Successfully denied consentId:', consentId);
  return { success: true };
}

/**
 * Validate a consent token
 */
async function validateConsentToken(token) {
  const redis = await getRedisClient();
  const data = await redis.get(`consent:${token}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Log consent action to audit trail (non-blocking)
 */
function logConsentAction(action, userId, consentId) {
  // Fire and forget - don't wait for audit log
  supabase.from('audit_logs').insert({
    user_id: userId,
    action: `consent_${action}`,
    details: { consentId }
  }).catch(err => console.warn('Audit log failed:', err.message));
  return Promise.resolve();
}

/**
 * Get all pending consent requests for a user
 */
async function getPendingRequests(userId) {
  const { data, error } = await supabase
    .from('consent_requests')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending');
    
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get consent history for a user
 */
async function getConsentHistory(userId) {
  const { data, error } = await supabase
    .from('consent_requests')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'pending')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error(error.message);
  return data;
}

// Keep create for any mock generation we still need
async function createConsentRequest(institutionId, userId, requestedFields, purpose) {
  const { data, error } = await supabase
    .from('consent_requests')
    .insert({
      institution_id: institutionId,
      user_id: userId,
      requested_fields: JSON.stringify(requestedFields),
      purpose,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  createConsentRequest,
  approveConsent,
  denyConsent,
  validateConsentToken,
  logConsentAction,
  getPendingRequests,
  getConsentHistory,
};
