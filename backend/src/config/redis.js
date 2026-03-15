const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;

async function getRedisClient() {
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    redisClient.on('error', (err) => console.warn('⚠️  Redis error:', err.message));
    await redisClient.connect();
    console.log('✅ Redis connected');
    return redisClient;
  } catch (err) {
    console.warn('⚠️  Redis not available — consent tokens stored in memory');
    // In-memory fallback for hackathon
    const memoryStore = new Map();
    redisClient = {
      set: async (key, value) => memoryStore.set(key, value),
      get: async (key) => memoryStore.get(key) || null,
      del: async (key) => memoryStore.delete(key),
      setEx: async (key, ttl, value) => {
        memoryStore.set(key, value);
        setTimeout(() => memoryStore.delete(key), ttl * 1000);
      },
    };
    return redisClient;
  }
}

module.exports = { getRedisClient };
