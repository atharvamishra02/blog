import Redis from 'ioredis';

let redis = null;
let isConnecting = false;
let connectionPromise = null;
let connectionTimeout = null;

// Create Redis client singleton with optimized settings
function getRedisClient() {
  if (!redis) {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        connectTimeout: 2000, // 2 second connection timeout
        commandTimeout: 1000, // 1 second command timeout
        retryStrategy: (times) => {
          // Limit retries to avoid hanging
          if (times > 3) {
            console.warn('Redis max retries reached');
            return null; // Stop retrying
          }
          const delay = Math.min(times * 100, 500);
          return delay;
        },
        maxRetriesPerRequest: 1, // Reduced from 3
        enableOfflineQueue: false, // Don't queue when offline
        lazyConnect: true,
        enableReadyCheck: true,
        keepAlive: 30000, // Keep connection alive
        family: 4, // Use IPv4
      };

      // Add username if provided (for Redis Cloud)
      if (process.env.REDIS_USERNAME) {
        redisConfig.username = process.env.REDIS_USERNAME;
      }

      redis = new Redis(redisConfig);

      redis.on('error', (err) => {
        console.warn('Redis Client Error:', err.message);
      });

      redis.on('connect', () => {
        console.log('✅ Redis connected');
        isConnecting = false;
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      });

      redis.on('close', () => {
        console.log('Redis connection closed');
        isConnecting = false;
      });

      redis.on('reconnecting', () => {
        console.log('Redis reconnecting...');
      });

    } catch (error) {
      console.error('Failed to create Redis client:', error);
      return null;
    }
  }
  return redis;
}

// Ensure Redis is connected before operations with timeout
async function ensureConnected() {
  const client = getRedisClient();
  if (!client) return null;

  // If already connected, return immediately
  if (client.status === 'ready') {
    return client;
  }

  // If connection is in progress, wait for it with timeout
  if (isConnecting && connectionPromise) {
    try {
      await Promise.race([
        connectionPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 2000)
        )
      ]);
      return client.status === 'ready' ? client : null;
    } catch {
      console.warn('Redis connection wait timeout');
      isConnecting = false;
      return null;
    }
  }

  // Start new connection with timeout
  if (client.status === 'wait' || client.status === 'end') {
    isConnecting = true;
    connectionPromise = Promise.race([
      client.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 2000)
      )
    ]).catch(err => {
      console.warn('Redis connection failed:', err.message);
      isConnecting = false;
      return null;
    });
    
    await connectionPromise;
    isConnecting = false;
    return client.status === 'ready' ? client : null;
  }

  return null;
}

// Cache helper functions
export const cache = {
  // Get value from cache
  async get(key) {
    try {
      const client = await ensureConnected();
      if (!client) return null;
      
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // Set value in cache with TTL (time to live in seconds)
  async set(key, value, ttl = 3600) {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      await client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // Delete key from cache
  async del(key) {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  },

  // Delete keys by pattern
  async delPattern(pattern) {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delPattern error:', error);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  // Set expiry time for a key
  async expire(key, ttl) {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      await client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  },

  // Increment counter
  async incr(key) {
    try {
      const client = await ensureConnected();
      if (!client) return 0;
      
      return await client.incr(key);
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  },

  // Get multiple keys at once
  async mget(keys) {
    try {
      const client = await ensureConnected();
      if (!client) return [];
      
      const values = await client.mget(keys);
      return values.map(v => v ? JSON.parse(v) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return [];
    }
  },

  // Flush all cache
  async flushAll() {
    try {
      const client = await ensureConnected();
      if (!client) return false;
      
      await client.flushall();
      return true;
    } catch (error) {
      console.error('Cache flushAll error:', error);
      return false;
    }
  }
};

export default getRedisClient;
