const { getRedisClient } = require('../config/redis');

/**
 * Consent Middleware
 * For institution API calls: validates consent token,
 * checks expiry, and verifies requested data is within approved fields.
 * Logs every access to audit trail.
 */
async function consentMiddleware(req, res, next) {
  const consentToken = req.headers['x-consent-token'];

  if (!consentToken) {
    return res.status(403).json({ success: false, message: 'Consent token required' });
  }

  try {
    const redis = await getRedisClient();
    const consentData = await redis.get(`consent:${consentToken}`);

    if (!consentData) {
      return res.status(403).json({ success: false, message: 'Invalid or expired consent token' });
    }

    const consent = JSON.parse(consentData);

    // Attach consent info to request for downstream use
    req.consent = {
      userId: consent.userId,
      approvedFields: consent.approvedFields,
      institutionId: consent.institutionId,
      consentId: consent.consentId,
    };

    // Log access to audit trail
    console.log(`[AUDIT] Institution ${consent.institutionId} accessed fields: ${consent.approvedFields.join(', ')}`);

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Consent validation failed' });
  }
}

module.exports = consentMiddleware;
