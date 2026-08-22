/**
 * Validation Service
 * Input validation and sanitization functions
 */

/**
 * Sanitize string input
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate username format
 */
function isValidUsername(username) {
    // Alphanumeric and spaces, 3-16 characters, no leading/trailing spaces, no double spaces
    const usernameRegex = /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/;
    return username.length >= 1 && username.length <= 16 && usernameRegex.test(username);
}

module.exports = {
    sanitizeString,
    isValidEmail,
    isValidUsername
};

