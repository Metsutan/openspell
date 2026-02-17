/**
 * @openspell/rate-limiter
 * Redis-based rate limiting with in-memory fallback
 * 
 * Features:
 * - Sliding window algorithm using Redis sorted sets
 * - Automatic fallback to in-memory rate limiting if Redis is unavailable
 * - Per-identifier tracking (IP, userId, etc.)
 * - Express middleware factory
 */

const Redis = require('ioredis');

/**
 * @typedef {Object} RateLimitConfig
 * @property {number} windowMs - Time window in milliseconds
 * @property {number} max - Maximum requests allowed in window
 * @property {string} keyPrefix - Prefix for Redis keys
 */

/**
 * @typedef {Object} RateLimitResult
 * @property {boolean} allowed - Whether the request is allowed
 * @property {number} remaining - Number of requests remaining
 * @property {Date} resetAt - When the rate limit resets
 * @property {number} current - Current request count
 */

/**
 * In-memory fallback for when Redis is unavailable
 */
class MemoryRateLimiter {
  constructor() {
    /** @type {Map<string, number[]>} */
    this.store = new Map();
    
    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * @param {string} identifier
   * @param {RateLimitConfig} config
   * @returns {Promise<RateLimitResult>}
   */
  async checkLimit(identifier, config) {
    const key = `${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create entry
    let timestamps = this.store.get(key) || [];
    
    // Remove old entries
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    const count = timestamps.length;
    const allowed = count < config.max;
    
    if (allowed) {
      timestamps.push(now);
      this.store.set(key, timestamps);
    }

    return {
      allowed,
      remaining: Math.max(0, config.max - count - (allowed ? 1 : 0)),
      resetAt: new Date(now + config.windowMs),
      current: count + (allowed ? 1 : 0)
    };
  }

  cleanup() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [key, timestamps] of this.store.entries()) {
      const filtered = timestamps.filter(ts => ts > now - maxAge);
      if (filtered.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, filtered);
      }
    }
  }
}

/**
 * Redis-based rate limiter using sliding window algorithm
 */
class RedisRateLimiter {
  /**
   * @param {Redis} redis
   */
  constructor(redis) {
    this.redis = redis;
    this.isHealthy = true;
    
    // Monitor Redis health
    this.redis.on('error', (err) => {
      console.error('[rate-limiter] Redis error:', err.message);
      this.isHealthy = false;
    });
    
    this.redis.on('ready', () => {
      if (process.env.NODE_ENV !== 'production') console.log('[rate-limiter] Redis connected');
      this.isHealthy = true;
    });
  }

  /**
   * @param {string} identifier
   * @param {RateLimitConfig} config
   * @returns {Promise<RateLimitResult>}
   */
  async checkLimit(identifier, config) {
    const key = `ratelimit:${config.keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    try {
      // Use Redis sorted set for sliding window
      const multi = this.redis.multi();
      
      // Remove old entries outside the window
      multi.zremrangebyscore(key, 0, windowStart);
      
      // Count current requests in window
      multi.zcard(key);
      
      // Add current request (with score = timestamp)
      multi.zadd(key, now, `${now}-${Math.random()}`);
      
      // Set expiration to window size (in seconds)
      multi.expire(key, Math.ceil(config.windowMs / 1000));
      
      const results = await multi.exec();
      
      // Check if any command failed
      if (!results || results.some(([err]) => err)) {
        throw new Error('Redis multi command failed');
      }
      
      // results[1] is the ZCARD result (count before adding current request)
      const count = results[1][1];
      const allowed = count < config.max;
      
      if (!allowed) {
        // Remove the request we just added since it's not allowed
        await this.redis.zrem(key, `${now}-${Math.random()}`);
      }

      return {
        allowed,
        remaining: Math.max(0, config.max - count - (allowed ? 1 : 0)),
        resetAt: new Date(now + config.windowMs),
        current: count + (allowed ? 1 : 0)
      };
    } catch (error) {
      console.error('[rate-limiter] Redis error during checkLimit:', error.message);
      this.isHealthy = false;
      throw error;
    }
  }
}

/**
 * Main rate limiter class with automatic fallback
 */
class RateLimiter {
  /**
   * @param {Object} options
   * @param {string} [options.host='localhost']
   * @param {number} [options.port=6379]
   * @param {string} [options.password]
   * @param {boolean} [options.disabled=false] - If true, uses memory-based rate limiting
   */
  constructor(options = {}) {
    this.options = options;
    this.memoryLimiter = new MemoryRateLimiter();
    this.redisLimiter = null;
    this.usingFallback = false;

    if (!options.disabled) {
      try {
        const redis = new Redis({
          host: options.host || 'localhost',
          port: options.port || 6379,
          password: options.password,
          retryStrategy: (times) => {
            // Exponential backoff: 50ms, 100ms, 200ms, ..., max 3s
            const delay = Math.min(times * 50, 3000);
            return delay;
          },
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: false
        });

        this.redisLimiter = new RedisRateLimiter(redis);
        if (process.env.NODE_ENV !== 'production') console.log('[rate-limiter] Initialized with Redis backend');
      } catch (error) {
        console.error('[rate-limiter] Failed to initialize Redis:', error.message);
        console.warn('[rate-limiter] Falling back to in-memory rate limiting');
        this.usingFallback = true;
      }
    } else {
      console.warn('[rate-limiter] Redis disabled, using in-memory rate limiting');
      this.usingFallback = true;
    }
  }

  /**
   * @param {string} identifier
   * @param {RateLimitConfig} config
   * @returns {Promise<RateLimitResult>}
   */
  async checkLimit(identifier, config) {
    // Try Redis first if available
    if (this.redisLimiter && !this.usingFallback) {
      try {
        return await this.redisLimiter.checkLimit(identifier, config);
      } catch (error) {
        console.warn('[rate-limiter] Redis failed, falling back to memory:', error.message);
        this.usingFallback = true;
      }
    }

    // Fallback to in-memory
    return await this.memoryLimiter.checkLimit(identifier, config);
  }

  /**
   * Create an Express middleware for rate limiting
   * @param {RateLimitConfig & {
   *   message?: string,
   *   statusCode?: number,
   *   keyGenerator?: (req: any) => string,
   *   handler?: (req: any, res: any, result: RateLimitResult) => void,
   *   skipSuccessfulRequests?: boolean
   * }} config
   */
  createMiddleware(config) {
    const {
      windowMs,
      max,
      keyPrefix,
      message = 'Too many requests, please try again later.',
      statusCode = 429,
      keyGenerator = (req) => req.ip || req.connection?.remoteAddress || 'unknown',
      handler,
      skipSuccessfulRequests = false
    } = config;

    return async (req, res, next) => {
      const identifier = keyGenerator(req);
      
      try {
        const result = await this.checkLimit(identifier, {
          windowMs,
          max,
          keyPrefix
        });

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', result.resetAt.toISOString());

        if (!result.allowed) {
          res.setHeader('Retry-After', Math.ceil((result.resetAt.getTime() - Date.now()) / 1000));
          
          if (handler) {
            return handler(req, res, result);
          }
          
          return res.status(statusCode).json({
            error: message,
            retryAfter: result.resetAt
          });
        }

        // If skipSuccessfulRequests is enabled, we need to handle the response
        if (skipSuccessfulRequests) {
          // Store original functions
          const originalJson = res.json.bind(res);
          const originalSend = res.send.bind(res);
          
          // Track if response was successful
          let intercepted = false;
          
          res.json = function(body) {
            if (!intercepted && res.statusCode >= 400) {
              intercepted = true;
              // TODO: Decrement counter for failed requests
            }
            return originalJson(body);
          };
          
          res.send = function(body) {
            if (!intercepted && res.statusCode >= 400) {
              intercepted = true;
              // TODO: Decrement counter for failed requests
            }
            return originalSend(body);
          };
        }

        next();
      } catch (error) {
        console.error('[rate-limiter] Middleware error:', error);
        // On error, allow the request through (fail-open)
        next();
      }
    };
  }

  /**
   * Close Redis connection
   */
  async close() {
    if (this.redisLimiter?.redis) {
      await this.redisLimiter.redis.quit();
    }
  }
}

/**
 * Create a new rate limiter instance
 * @param {Object} options
 * @returns {RateLimiter}
 */
function createRateLimiter(options = {}) {
  return new RateLimiter(options);
}

module.exports = {
  RateLimiter,
  createRateLimiter,
  MemoryRateLimiter,
  RedisRateLimiter
};
