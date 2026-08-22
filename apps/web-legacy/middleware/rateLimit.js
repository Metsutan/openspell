/**
 * Rate Limiting Middleware
 * Redis-based rate limiting with automatic fallback to in-memory
 */

const { createRateLimiter } = require('@openspell/rate-limiter');

// Configuration from environment
const WEB_AUTH_WINDOW_MS = parseInt(process.env.WEB_AUTH_WINDOW_MS || '900000', 10);
const WEB_AUTH_MAX = parseInt(process.env.WEB_AUTH_MAX || '5', 10);
const WEB_REGISTER_MAX = parseInt(process.env.WEB_REGISTER_MAX || '3', 10);
const WEB_EMAIL_MAX = parseInt(process.env.WEB_EMAIL_MAX || '3', 10);
const WEB_VERIFICATION_MAX = parseInt(process.env.WEB_VERIFICATION_MAX || '10', 10);

// Initialize Redis-backed rate limiter (with automatic fallback)
const rateLimiter = createRateLimiter({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    disabled: process.env.REDIS_DISABLED === 'true'
});

// Rate limiter for authentication endpoints (login)
const authLimiter = rateLimiter.createMiddleware({
    windowMs: WEB_AUTH_WINDOW_MS,
    max: WEB_AUTH_MAX,
    keyPrefix: 'web:auth',
    message: 'Too many login attempts, please try again later.',
    handler: (req, res) => {
        res.redirect(`/login?error=${encodeURIComponent('Too many login attempts. Please try again in 15 minutes.')}`);
    },
    keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown'
});

// Rate limiter for registrations (tighter)
const registerLimiter = rateLimiter.createMiddleware({
    windowMs: WEB_AUTH_WINDOW_MS,
    max: WEB_REGISTER_MAX,
    keyPrefix: 'web:register',
    message: 'Too many registration attempts, please try again later.',
    handler: (req, res) => {
        res.redirect(`/register?error=${encodeURIComponent('Too many registration attempts. Please try again in 15 minutes.')}`);
    },
    keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown'
});

// Rate limiter for email-related flows (forgot password, resend verification)
const emailLimiter = rateLimiter.createMiddleware({
    windowMs: WEB_AUTH_WINDOW_MS,
    max: WEB_EMAIL_MAX,
    keyPrefix: 'web:email',
    message: 'Too many email requests, please try again later.',
    handler: (req, res) => {
        const path = req.path === '/resend-verification' ? '/account' : '/forgot-password';
        res.redirect(`${path}?error=${encodeURIComponent('Too many email requests. Please try again in 15 minutes.')}`);
    },
    keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown'
});

// Rate limiter for verification flows (verify email, password reset)
const verificationLimiter = rateLimiter.createMiddleware({
    windowMs: WEB_AUTH_WINDOW_MS,
    max: WEB_VERIFICATION_MAX,
    keyPrefix: 'web:verification',
    message: 'Too many verification attempts, please try again later.',
    handler: (req, res) => {
        if (req.method === 'POST') {
            return res.redirect(`/reset-password?error=${encodeURIComponent('Too many verification attempts. Please try again in 15 minutes.')}&token=${encodeURIComponent(req.body.token || '')}`);
        }
        res.status(429).send('Too many verification attempts. Please try again later.');
    },
    keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown'
});

module.exports = {
    authLimiter,
    registerLimiter,
    emailLimiter,
    verificationLimiter,
    rateLimiter // Export the base limiter for custom use cases
};

