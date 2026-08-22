/**
 * CSRF Protection Service
 * Handles CSRF token generation and validation
 */

const crypto = require('crypto');

/**
 * Generate a CSRF token and store it in the session
 */
function generateCsrfToken(req) {
    if (!req.session) {
        req.session = {};
    }
    const token = crypto.randomBytes(32).toString('hex');
    req.session.csrfToken = token;
    return token;
}

/**
 * Get the current CSRF token from session (generate if doesn't exist)
 */
function getCsrfToken(req) {
    if (!req.session.csrfToken) {
        return generateCsrfToken(req);
    }
    return req.session.csrfToken;
}

/**
 * Validate CSRF token from request
 */
function validateCsrfToken(req) {
    const sessionToken = req.session?.csrfToken;
    const submittedToken = req.body._csrf || req.body.csrfToken;
    
    if (!sessionToken || !submittedToken) {
        return false;
    }
    
    // Ensure both tokens are the same length for timing-safe comparison
    if (sessionToken.length !== submittedToken.length) {
        return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(sessionToken),
            Buffer.from(submittedToken)
        );
    } catch (error) {
        // If comparison fails, tokens don't match
        return false;
    }
}

/**
 * Middleware to validate CSRF token on POST requests
 */
function csrfProtection(req, res, next) {
    if (req.method === 'POST') {
        if (!validateCsrfToken(req)) {
            // Determine redirect based on the current route
            let redirectPath = req.path;
            
            // Map POST routes to their corresponding GET pages
            const routeMapping = {
                '/login': '/login',
                '/register': '/register',
                '/forgot-password': '/forgot-password',
                '/reset-password': '/reset-password',
                '/account/change-password': '/account/change-password',
                '/account/change-email': '/account/change-email',
                '/resend-verification': '/account',
                '/game': '/play',
                '/hiscores/player': '/hiscores/overall'
            };
            
            redirectPath = routeMapping[req.path] || req.path;
            
            const errorMessage = encodeURIComponent('Security token expired. Please try again.');
            return res.redirect(`${redirectPath}?error=${errorMessage}`);
        }
    }
    next();
}

module.exports = {
    generateCsrfToken,
    getCsrfToken,
    validateCsrfToken,
    csrfProtection
};

