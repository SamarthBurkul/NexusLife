const CryptoJS = require('crypto-js');
require('dotenv').config();

const VAULT_SECRET = process.env.VAULT_SECRET || 'nexuslife_aes_256_vault_secret_32chars';

/**
 * Data Vault — AES-256-CBC Encryption Service
 * All sensitive user data is encrypted at rest.
 * Only decrypted when the user or an approved consent request accesses it.
 */

/**
 * Encrypt data using AES-256-CBC
 * @param {object|string} data - Data to encrypt
 * @returns {string} Encrypted string
 */
function encryptData(data) {
  const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(plaintext, VAULT_SECRET).toString();
  return encrypted;
}

/**
 * Decrypt data using AES-256-CBC
 * @param {string} encrypted - Encrypted string
 * @returns {object} Decrypted data (parsed from JSON)
 */
function decryptData(encrypted) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, VAULT_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    throw new Error('Decryption failed — invalid data or key');
  }
}

module.exports = { encryptData, decryptData };
