/**
 * Helper Utilities
 * Common utility functions for formatting and escaping
 */

// Month names
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Formats a date string (YYYY-MM-DD) to a readable format
 */
function formatDate(dateStr) {
    // Handle both string dates and Date objects
    let date;
    let isUTC = false;
    if (typeof dateStr === 'string') {
        // Check if it's a UTC date string (ends with 'Z')
        isUTC = dateStr.includes('Z') || dateStr.endsWith('Z');
        date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    } else if (dateStr instanceof Date) {
        date = dateStr;
    } else {
        date = new Date(dateStr);
    }
    
    // Use UTC methods if the input was a UTC date string, otherwise use local timezone
    const dayName = DAY_NAMES[isUTC ? date.getUTCDay() : date.getDay()];
    const monthName = MONTH_NAMES[isUTC ? date.getUTCMonth() : date.getMonth()];
    const day = isUTC ? date.getUTCDate() : date.getDate();
    const year = isUTC ? date.getUTCFullYear() : date.getFullYear();
    return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Parses date and extracts year, month, day
 */
function parseDate(dateStr) {
    // Handle both string dates and Date objects
    let date;
    if (typeof dateStr === 'string') {
        date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    } else if (dateStr instanceof Date) {
        date = dateStr;
    } else {
        date = new Date(dateStr);
    }
    
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12
        day: date.getDate(),
        dateObj: date
    };
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = {
    formatDate,
    parseDate,
    escapeHtml,
    MONTH_NAMES,
    DAY_NAMES
};

