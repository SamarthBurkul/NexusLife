const crypto = require('crypto');
const { getRedisClient } = require('../config/redis');
const { supabase } = require('../config/db');

/**
 * ============================================
 * CONSENT ENGINE — Core of NexusLife
 * ============================================
 */

/**
 * Approve a consent request
 * Generates a one-time consent token stored in Redis with TTL
 */
async function approveConsent(consentId, userId, approvedFields, expiryHours = 24) {
  console.log('Looking for consent:', consentId);

  // 1. Fetch request from Supabase
  const { data: request, error: fetchErr } = await supabase
    .from('consent_requests')
    .select('*')
    .eq('id', consentId)
    .single();

  if (fetchErr || !request) {
    console.error('Consent fetch error:', fetchErr?.message);
    throw new Error('Consent request not found');
  }

  if (request.user_id !== userId) throw new Error('Unauthorized — not your consent request');
  if (request.status !== 'pending') throw new Error('Request already processed');

  // Generate one-time consent token
  const consentToken = crypto.randomBytes(32).toString('hex');
  const ttl = expiryHours * 3600; // Convert hours to seconds

  // Store in Redis with TTL
  const redis = await getRedisClient();
  await redis.setEx(`consent:${consentToken}`, ttl, JSON.stringify({
    consentId,
    userId,
    institutionId: request.institution_id,
    approvedFields,
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
  }));

  // Update request status in Supabase
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  
  const { error: updateErr } = await supabase
    .from('consent_requests')
    .update({ 
      status: 'approved',
      requested_fields: approvedFields // update to only approved fields
    })
    .eq('id', consentId);

  if (updateErr) throw new Error('Failed to update consent request');

  // Insert consent grant
  const { error: grantErr } = await supabase
    .from('consent_grants')
    .insert({
      consent_request_id: consentId,
      consent_token: consentToken,
      expires_at: expiresAt,
      is_active: true
    });
    
  if (grantErr) console.warn('Failed to insert consent grant:', grantErr.message);

  // Log to history
  await logConsentAction('approved', userId, consentId);

  return { consentToken, expiresAt, approvedFields };
}

/**
 * Deny a consent request
 */
async function denyConsent(consentId, userId) {
  const { data: request, error: fetchErr } = await supabase
    .from('consent_requests')
    .select('*')
    .eq('id', consentId)
    .single();

  if (fetchErr || !request) throw new Error('Consent request not found');
  if (request.user_id !== userId) throw new Error('Unauthorized');
  if (request.status !== 'pending') throw new Error('Request already processed');

  const { error: updateErr } = await supabase
    .from('consent_requests')
    .update({ status: 'denied' })
    .eq('id', consentId);

  if (updateErr) throw new Error('Failed to update consent request');

  await logConsentAction('denied', userId, consentId);
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
 * Log consent action to audit trail
 */
async function logConsentAction(action, userId, consentId) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action: `consent_${action}`,
    details: { consentId }
  });
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
      requested_fields: requestedFields,
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
