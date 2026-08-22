/**
 * API Service
 * Handles HTTP requests to the API server
 */

const http = require('http');
const https = require('https');

const API_URL = process.env.API_URL || 'http://localhost:3002';
const API_USE_LOCALHOST = process.env.API_USE_LOCALHOST === 'true';
const API_LOCAL_URL = process.env.API_LOCAL_URL || `http://localhost:${process.env.API_PORT || '3002'}`;
const RESOLVED_API_URL = API_USE_LOCALHOST ? API_LOCAL_URL : API_URL;
const ALLOW_INSECURE_HTTPS = process.env.ALLOW_INSECURE_HTTPS === 'true';
const API_WEB_SECRET = process.env.API_WEB_SECRET || null;
const WEB_SECRET_HEADER = 'X-OpenSpell-Web-Secret';

// API request timeout configuration
// Default 30 seconds - registration with bcrypt hashing can take 5-10 seconds
// Set higher if you have slow database connections or high bcrypt rounds
const API_REQUEST_TIMEOUT_MS = parseInt(process.env.API_REQUEST_TIMEOUT_MS || '30000', 10);

/**
 * Makes HTTP request to API
 */
function makeApiRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, RESOLVED_API_URL);
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...(API_WEB_SECRET ? { [WEB_SECRET_HEADER]: API_WEB_SECRET } : {}),
            ...(options.headers || {})
        };
        const requestOptions = {
            method: options.method || 'GET',
            headers: requestHeaders,
            // If you use mkcert and Node doesn't trust the OS trust store on your platform,
            // you can temporarily bypass TLS verification for local dev only:
            //   ALLOW_INSECURE_HTTPS=true
            ...(url.protocol === 'https:' && ALLOW_INSECURE_HTTPS ? { rejectUnauthorized: false } : {})
        };

        const transport = url.protocol === 'https:' ? https : http;

        const req = transport.request(url, requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`API request failed: ${res.statusCode} ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.setTimeout(API_REQUEST_TIMEOUT_MS, () => {
            req.destroy();
            reject(new Error(`API request timeout after ${API_REQUEST_TIMEOUT_MS}ms`));
        });
        
        req.end();
    });
}

/**
 * Extract error message from API error response
 * Handles errors like: "API request failed: 401 {"error":"Invalid credentials"}"
 */
function extractApiErrorMessage(error) {
    if (!error || !error.message) {
        return 'Internal server error';
    }
    
    const errorMessage = error.message;
    
    // Try to extract JSON error from the error message
    // Format: "API request failed: 401 {"error":"Invalid credentials"}"
    const jsonMatch = errorMessage.match(/\{.*\}/);
    if (jsonMatch) {
        try {
            const errorObj = JSON.parse(jsonMatch[0]);
            if (errorObj.error) {
                return errorObj.error;
            }
        } catch (e) {
            // If JSON parsing fails, continue to fallback
        }
    }
    
    // Check if it's a timeout error
    if (errorMessage.includes('timeout')) {
        return 'Request timeout. Please try again.';
    }
    
    // For other errors, return a generic message
    return 'Internal server error';
}

module.exports = {
    makeApiRequest,
    extractApiErrorMessage,
    API_URL: RESOLVED_API_URL
};

