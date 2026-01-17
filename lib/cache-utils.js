import { cache } from './redis.js';

/**
 * Cache wrapper for API routes
 * Usage: const result = await withCache('cache-key', fetchFunction, ttl);
 */
export async function withCache(key, fetchFunction, ttl = 3600) {
  const CACHE_ENABLED = process.env.ENABLE_CACHE === 'true';
  
  // If cache disabled, just fetch
  if (!CACHE_ENABLED) {
    return await fetchFunction();
  }

  try {
    // Try to get from cache
    const cached = await cache.get(key);
    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return cached;
    }

    // Cache miss - fetch data
    console.log(`❌ Cache MISS: ${key}`);
    const data = await fetchFunction();
    
    // Store in cache
    if (data) {
      await cache.set(key, data, ttl);
    }
    
    return data;
  } catch (error) {
    console.error('Cache error, falling back to direct fetch:', error);
    return await fetchFunction();
  }
}

/**
 * Invalidate multiple cache keys by pattern
 */
export async function invalidateCachePattern(pattern) {
  try {
    await cache.delPattern(pattern);
    console.log(`🗑️ Cache invalidated: ${pattern}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Cache decorator for functions
 */
export function cached(ttl = 3600) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const key = `${propertyKey}:${JSON.stringify(args)}`;
      return await withCache(key, () => originalMethod.apply(this, args), ttl);
    };

    return descriptor;
  };
}

/**
 * Rate limiting using Redis
 */
export async function rateLimit(identifier, maxRequests = 100, windowSeconds = 60) {
  const CACHE_ENABLED = process.env.ENABLE_CACHE === 'true';
  
  if (!CACHE_ENABLED) {
    return { allowed: true, remaining: maxRequests };
  }

  try {
    const key = `ratelimit:${identifier}`;
    const current = await cache.incr(key);

    if (current === 1) {
      await cache.expire(key, windowSeconds);
    }

    const remaining = Math.max(0, maxRequests - current);
    const allowed = current <= maxRequests;

    return { allowed, remaining, current };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Cache statistics
 */
export async function getCacheStats() {
  try {
    // This is a simple implementation
    // In production, you'd track hits/misses properly
    return {
      enabled: process.env.ENABLE_CACHE === 'true',
      connected: await cache.exists('test') !== null
    };
  } catch (error) {
    return {
      enabled: process.env.ENABLE_CACHE === 'true',
      connected: false,
      error: error.message
    };
  }
}
