/**
 * News Service
 * Handles news loading and caching
 */

const { makeApiRequest } = require('./api');
const { parseDate } = require('../utils/helpers');

// News cache
let newsCache = { items: [] };
let newsCacheTime = null;

// Online users cache
let onlineUsersCount = 0;
let onlineUsersCacheTime = null;
const ONLINE_USERS_CACHE_TTL = 30000; // 30 seconds

/**
 * Fetches news from API
 */
async function fetchNewsFromApi() {
    try {
        const response = await makeApiRequest('/api/news');
        return response;
    } catch (error) {
        console.warn('Failed to fetch news from API:', error.message);
        return null;
    }
}

/**
 * Loads news from API (with in-memory caching).
 * If the API is temporarily unavailable, we serve the last cached copy (if any).
 */
async function loadNews() {
    // Return cached data if available (cache for 1 minute)
    if (newsCacheTime !== null && (Date.now() - newsCacheTime) < 60000) {
        return newsCache;
    }
    
    // Fetch from API
    const apiNews = await fetchNewsFromApi();
    if (apiNews && apiNews.items) {
        // Convert date strings to Date objects for compatibility
        apiNews.items = apiNews.items.map(item => ({
            ...item,
            date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : 
                  typeof item.date === 'string' ? item.date.split('T')[0] : item.date
        }));
        newsCache = apiNews;
        newsCacheTime = Date.now();
        if (process.env.NODE_ENV !== 'production') console.log(`News loaded from API at ${new Date().toISOString()}`);
        return newsCache;
    }
    
    // API unavailable: keep serving the last cached copy (if any), otherwise return empty.
    if (newsCache && Array.isArray(newsCache.items) && newsCache.items.length > 0) {
        console.warn('News API unavailable; serving cached news');
        return newsCache;
    }

    return { items: [] };
}

/**
 * Organizes news by year and month
 */
function organizeNewsByDate(newsItems) {
    const organized = {};
    
    newsItems.forEach(item => {
        const { year, month } = parseDate(item.date);
        
        if (!organized[year]) {
            organized[year] = {};
        }
        if (!organized[year][month]) {
            organized[year][month] = [];
        }
        
        organized[year][month].push(item);
    });
    
    // Sort items within each month (newest first)
    Object.keys(organized).forEach(year => {
        Object.keys(organized[year]).forEach(month => {
            organized[year][month].sort((a, b) => new Date(b.date) - new Date(a.date));
        });
    });
    
    return organized;
}

/**
 * Fetches online users count from API
 */
async function fetchOnlineUsersCount() {
    // Return cached value if still valid
    if (onlineUsersCacheTime && (Date.now() - onlineUsersCacheTime) < ONLINE_USERS_CACHE_TTL) {
        return onlineUsersCount;
    }
    
    try {
        const response = await makeApiRequest('/api/online/count');
        onlineUsersCount = response.count || 0;
        onlineUsersCacheTime = Date.now();
        return onlineUsersCount;
    } catch (error) {
        console.warn('Failed to fetch online users count from API:', error.message);
        // Return cached value or default to 0
        return onlineUsersCount;
    }
}

module.exports = {
    loadNews,
    organizeNewsByDate,
    fetchOnlineUsersCount
};

