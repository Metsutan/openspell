/**
 * Auth Service
 * Handles user authentication and session management
 */

const { makeApiRequest } = require('./api');

/**
 * Gets user info from session (optionally fetches fresh data from API)
 */
async function getUserInfo(req, fetchFresh = false) {
    // Check if user is authenticated
    if (!req.session.userId || !req.session.token) {
        return null;
    }
    
    // Return session data if not fetching fresh
    if (!fetchFresh) {
        return {
            id: req.session.userId,
            username: req.session.username || 'User',
            displayName: req.session.displayName || req.session.username || 'User'
        };
    }
    
    // Try to get fresh user data from API
    let user = {
        id: req.session.userId,
        username: req.session.username || 'User',
        displayName: req.session.displayName || req.session.username || 'User'
    };
    
    try {
        const userData = await makeApiRequest('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        
        if (userData.user) {
            user = userData.user;
            // Update session with fresh data
            req.session.username = userData.user.username;
            req.session.displayName = userData.user.displayName;
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Use session data as fallback
    }
    
    return user;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated(req) {
    return !!(req.session.userId && req.session.token);
}

/**
 * Middleware to require authentication
 */
function requireAuth(req, res, next) {
    if (!isAuthenticated(req)) {
        return res.redirect('/login');
    }
    next();
}

module.exports = {
    getUserInfo,
    isAuthenticated,
    requireAuth
};

