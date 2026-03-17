const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;

// In-memory fallback store (used when Redis is unavailable)
function createMemoryFallback() {
  console.warn('⚠️  Redis not available — consent tokens stored in memory');
  const memoryStore = new Map();
  return {
    set: async (key, value) => memoryStore.set(key, value),
    get: async (key) => memoryStore.get(key) || null,
    del: async (key) => memoryStore.delete(key),
    setEx: async (key, ttl, value) => {
      memoryStore.set(key, value);
      setTimeout(() => memoryStore.delete(key), ttl * 1000);
    },
  };
}

async function getRedisClient() {
  if (redisClient) return redisClient;

  try {
    const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    // Attach error handler BEFORE connect to prevent uncaught exceptions
    client.on('error', (err) => {
      console.warn('⚠️  Redis error:', err.message);
    });
    await client.connect();
    console.log('✅ Redis connected');
    redisClient = client;
    return redisClient;
  } catch (err) {
    redisClient = createMemoryFallback();
    return redisClient;
  }
}

module.exports = { getRedisClient };

