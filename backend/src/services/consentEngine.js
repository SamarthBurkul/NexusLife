const crypto = require('crypto');
const { getRedisClient } = require('../config/redis');

/**
 * ============================================
 * CONSENT ENGINE — Core of NexusLife
 * ============================================
 * Manages the entire consent lifecycle:
 * 1. Institution creates a consent request
 * 2. User reviews and approves/denies
 * 3. On approval: one-time consent token generated, stored in Redis with TTL
 * 4. Institution uses token to access only approved fields
 * 5. Every action is logged to the audit trail
 */

// In-memory store for consent requests (mock for hackathon — replace with Supabase in prod)
const consentRequests = new Map();
const consentHistory = [];

/**
 * Create a new consent request from an institution
 * @param {string} institutionId - ID of requesting institution
 * @param {string} userId - Target user ID
 * @param {string[]} requestedFields - Fields the institution wants
 * @param {string} purpose - Why the data is needed
 * @returns {object} Created consent request
 */
function createConsentRequest(institutionId, userId, requestedFields, purpose) {
  const id = crypto.randomUUID();
  const request = {
    id,
    institutionId,
    userId,
    requestedFields,
    purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  consentRequests.set(id, request);
  return request;
}

/**
 * Approve a consent request
 * Generates a one-time consent token stored in Redis with TTL
 * @param {string} consentId - Consent request ID
 * @param {string} userId - User approving (must match request)
 * @param {string[]} approvedFields - Subset of fields user approves
 * @param {number} expiryHours - How long the token is valid
 * @returns {object} Approval result with consent token
 */
async function approveConsent(consentId, userId, approvedFields, expiryHours = 24) {
  const request = consentRequests.get(consentId);

  if (!request) throw new Error('Consent request not found');
  if (request.userId !== userId) throw new Error('Unauthorized — not your consent request');
  if (request.status !== 'pending') throw new Error('Request already processed');

  // Generate one-time consent token
  const consentToken = crypto.randomBytes(32).toString('hex');
  const ttl = expiryHours * 3600; // Convert hours to seconds

  // Store in Redis with TTL
  const redis = await getRedisClient();
  await redis.setEx(`consent:${consentToken}`, ttl, JSON.stringify({
    consentId,
    userId,
    institutionId: request.institutionId,
    approvedFields,
    expiresAt: new Date(Date.now() + ttl * 1000).toISOString(),
  }));

  // Update request status
  request.status = 'approved';
  request.approvedFields = approvedFields;
  request.consentToken = consentToken;
  request.expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  consentRequests.set(consentId, request);

  // Log to history
  logConsentAction('approved', userId, consentId);

  return { consentToken, expiresAt: request.expiresAt, approvedFields };
}

/**
 * Deny a consent request
 * @param {string} consentId - Consent request ID
 * @param {string} userId - User denying
 */
function denyConsent(consentId, userId) {
  const request = consentRequests.get(consentId);
  if (!request) throw new Error('Consent request not found');
  if (request.userId !== userId) throw new Error('Unauthorized');
  if (request.status !== 'pending') throw new Error('Request already processed');

  request.status = 'denied';
  consentRequests.set(consentId, request);

  logConsentAction('denied', userId, consentId);
  return { success: true };
}

/**
 * Validate a consent token
 * @param {string} token - Consent token to validate
 * @returns {object|null} Approved fields if valid, null if expired/invalid
 */
async function validateConsentToken(token) {
  const redis = await getRedisClient();
  const data = await redis.get(`consent:${token}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Log consent action to audit trail
 * @param {string} action - Action taken (approved/denied/accessed)
 * @param {string} userId - User ID
 * @param {string} consentId - Consent request ID
 */
function logConsentAction(action, userId, consentId) {
  consentHistory.push({
    id: crypto.randomUUID(),
    action,
    userId,
    consentId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get all pending consent requests for a user
 */
function getPendingRequests(userId) {
  return Array.from(consentRequests.values()).filter(
    (r) => r.userId === userId && r.status === 'pending'
  );
}

/**
 * Get consent history for a user
 */
function getConsentHistory(userId) {
  return consentHistory.filter((h) => h.userId === userId);
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
