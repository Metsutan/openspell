/**
 * Express Server for OpenSpell Website
 * Main server file - uses services and routes for modularity
 */

// Load environment variables from single shared config
require('dotenv').config({ path: require('path').join(__dirname, '..', 'shared-assets', 'base', 'shared.env') });
const express = require('express');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || process.env.WEB_PORT || 8887;
const API_PORT = process.env.API_PORT || 3002;
const GAME_PORT = process.env.GAME_PORT || 8888;
const CHAT_PORT = process.env.CHAT_PORT || 8765;
const SESSION_SECRET = process.env.SESSION_SECRET || process.env.WEB_SESSION_SECRET || 'change-this-secret-in-production';
const USE_HTTPS = process.env.USE_HTTPS === 'true';
// Only use HTTPS when explicitly enabled - don't assume production means HTTPS
// (allows running production mode behind reverse proxy or Cloudflare Tunnel without local TLS)
const IS_HTTPS = USE_HTTPS;
const WEB_URL = process.env.WEB_URL || `${IS_HTTPS ? 'https' : 'http'}://localhost:${PORT}`;
const WEB_HOSTNAME = (() => {
    try {
        return new URL(WEB_URL).hostname;
    } catch (error) {
        return 'localhost';
    }
})();
function buildCspHeaderValue(nonce) {
    const nonceValue = nonce ? ` 'nonce-${nonce}'` : '';
    // CSP should reflect the browser-facing origin (typically HTTPS behind reverse proxy),
    // not whether this Node process terminates TLS locally.
    const httpScheme = 'https';
    const wsScheme = 'wss';
    return `default-src 'self';base-uri 'self';block-all-mixed-content;connect-src 'self' ${httpScheme}://${WEB_HOSTNAME}:${API_PORT} ${httpScheme}://${WEB_HOSTNAME}:${PORT} ${httpScheme}://${WEB_HOSTNAME}:${GAME_PORT} ${wsScheme}://${WEB_HOSTNAME}:${GAME_PORT} ${httpScheme}://*.${WEB_HOSTNAME}:* ${wsScheme}://*.${WEB_HOSTNAME}:* ${httpScheme}://${WEB_HOSTNAME}:${CHAT_PORT} ${wsScheme}://${WEB_HOSTNAME}:${CHAT_PORT} https://www.google.com https://www.gstatic.com https://recaptcha.google.com data: blob:;font-src 'self' https: data:;frame-src www.google.com imgur.com https://recaptcha.google.com;frame-ancestors 'self';img-src 'self' data: blob: *.imgur.com ${httpScheme}://${WEB_HOSTNAME}:${PORT} https://www.gstatic.com;object-src 'none';script-src 'self' www.google.com www.gstatic.com *.imgur.com https://cdn.jsdelivr.net 'unsafe-eval'${nonceValue};script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;worker-src 'self' blob:`;
}

// reCAPTCHA configuration
const RECAPTCHA_ENABLED = process.env.RECAPTCHA_ENABLED === 'true';
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '';

// Default TLS paths assume you run from repo root OR from apps/web (both work with __dirname)
const DEFAULT_CERT_PATH = path.join(__dirname, '..', '..', 'certs', 'localhost.pem');
const DEFAULT_KEY_PATH = path.join(__dirname, '..', '..', 'certs', 'localhost-key.pem');
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || DEFAULT_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || DEFAULT_KEY_PATH;

// If we ever enable secure cookies behind a proxy, Express needs this.
if (IS_HTTPS) {
    app.set('trust proxy', 1);
}

// Validate SESSION_SECRET on startup
const DEFAULT_SECRET = 'change-this-secret-in-production';
if (SESSION_SECRET === DEFAULT_SECRET) {
    console.error('ERROR: SESSION_SECRET is set to the default insecure value!');
    console.error('');
    console.error('For security, please set a strong random SESSION_SECRET.');
    console.error('You can do this by:');
    console.error('  1. Running the setup script:');
    console.error('     - Windows: .\\setup.ps1');
    console.error('     - Linux/Mac: ./setup.sh');
    console.error('  2. Creating a .env file with: SESSION_SECRET=<random-secret>');
    console.error('  3. Or setting the environment variable:');
    console.error('     - Windows: $env:SESSION_SECRET="<random-secret>"');
    console.error('     - Linux/Mac: export SESSION_SECRET="<random-secret>"');
    console.error('');
    console.error('To generate a secure secret, you can run:');
    console.error('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.error('');
    if (process.env.NODE_ENV === 'production') {
        console.error('FATAL: Cannot start in production with insecure SESSION_SECRET!');
        process.exit(1);
    } else {
        console.error('WARNING: Continuing with insecure secret in development mode.');
        console.error('This should NEVER be used in production!');
        console.error('');
    }
}

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON bodies
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: IS_HTTPS, // HTTPS in production or when USE_HTTPS=true in dev
        httpOnly: true, // Prevent XSS attacks
        // No maxAge = session cookie (expires when browser is closed)
        // This means users must log in again when they close their browser
    }
}));

// Content Security Policy middleware
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    // Set Content Security Policy (enforced, not report-only)
    res.setHeader(
        'Content-Security-Policy',
        buildCspHeaderValue(res.locals.cspNonce)
    );
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
});

// Paths
const rootDir = __dirname;

// Asset set selection (base, custom, hardcore, etc.)
const ASSET_SET = process.env.ASSET_SET || 'base';

// Assets directory - configurable via environment variable for Docker compatibility
// In development: apps/shared-assets/base
// In Docker: /app/shared-assets/base (mounted volume)
const DEFAULT_ASSETS_ROOT = path.join(__dirname, '..', 'shared-assets', ASSET_SET);
const assetsDir = process.env.ASSETS_ROOT 
    ? path.resolve(process.env.ASSETS_ROOT)
    : DEFAULT_ASSETS_ROOT;

const distDir = path.join(rootDir, 'dist'); // Local dist directory (served files)
const referencePublicDir = path.join(__dirname, '..', '..', 'public'); // Reference only - source of truth

// Log assets directory for debugging (dev only)
if (process.env.NODE_ENV !== 'production') console.log(`Assets directory: ${assetsDir}`);

/**
 * Copy file from reference directory to dist directory (one-time copy)
 */
function copyFileFromReference(sourcePath, destPath) {
    if (fs.existsSync(sourcePath)) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(sourcePath, destPath);
            if (process.env.NODE_ENV !== 'production') console.log(`Copied ${path.relative(rootDir, destPath)} from reference`);
        }
    }
}

// Copy needed HTML files from reference to dist (one-time on startup)
// copyFileFromReference(path.join(referencePublicDir, 'login.html'), path.join(distDir, 'login.html'));
// copyFileFromReference(path.join(referencePublicDir, 'register.html'), path.join(distDir, 'register.html'));
// copyFileFromReference(path.join(referencePublicDir, 'account.html'), path.join(distDir, 'account.html'));

// Copy needed JavaScript files from reference to assets/js (one-time on startup)
const jsFilesToCopy = [
    'main.js',
    'checkfields.js',
    'login.js',
    'registration.js'
];

for (const jsFile of jsFilesToCopy) {
    const sourceFile = path.join(referencePublicDir, 'js', jsFile);
    const destFile = path.join(assetsDir, 'js', jsFile);
    copyFileFromReference(sourceFile, destFile);
}

// Verify assets directory exists
if (!fs.existsSync(assetsDir)) {
    console.error(`ERROR: Assets directory not found: ${assetsDir}`);
    console.error('Please ensure the shared-assets folder exists and contains the base asset set.');
    process.exit(1);
}

// Serve static assets from shared assets directory
const cssPath = path.join(assetsDir, 'css');
const jsPath = path.join(assetsDir, 'js');
const imagesPath = path.join(assetsDir, 'images');
const staticPath = path.join(assetsDir, 'static');

if (process.env.NODE_ENV !== 'production') {
  console.log(`Serving CSS from: ${cssPath}`);
  console.log(`Serving JS from: ${jsPath}`);
  console.log(`Serving images from: ${imagesPath}`);
  console.log(`Serving static from: ${staticPath}`);
}

app.use('/css', express.static(cssPath));
app.use('/js', express.static(jsPath));
app.use('/images', express.static(imagesPath));
app.use('/static', express.static(staticPath));

// Import routes
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

// Import services for home page
const { loadNews, fetchOnlineUsersCount } = require('./services/news');
const { generatePage } = require('./services/html');
const { getUserInfo } = require('./services/auth');
const { formatDate, escapeHtml } = require('./utils/helpers');
const { makeApiRequest } = require('./services/api');
const { getCsrfToken, csrfProtection } = require('./services/csrf');
const { emailLimiter } = require('./middleware/rateLimit');

// ==================== GAME PAGE (CLIENT) ====================

const CLIENT_API_URL = process.env.CLIENT_API_URL || process.env.API_URL || 'http://localhost:3002';
const CLIENT_CHAT_URL = process.env.CHAT_URL || 'http://localhost:8765';
const CLIENT_CDN_URL = process.env.CDN_URL || `http://localhost:${PORT}`;
const GAME_API_ORIGIN = `${IS_HTTPS ? 'https' : 'http'}://${WEB_HOSTNAME}:${API_PORT}`;
const GAME_WS_ORIGIN = `${IS_HTTPS ? 'wss' : 'ws'}://${WEB_HOSTNAME}:${GAME_PORT}`;
const GAME_SERVER_ORIGIN = `${IS_HTTPS ? 'https' : 'http'}://${WEB_HOSTNAME}:${GAME_PORT}`;
const CHAT_HTTP_ORIGIN = `${IS_HTTPS ? 'https' : 'http'}://${WEB_HOSTNAME}:${CHAT_PORT}`;
const CHAT_WS_ORIGIN = `${IS_HTTPS ? 'wss' : 'ws'}://${WEB_HOSTNAME}:${CHAT_PORT}`;

// The client bundle version is sourced from the API server's assetsClient.json.
// We intentionally do NOT verify the file exists. If it doesn't, the client load should break
// so it's obvious that the bundle wasn't built/copied or the version wasn't updated.
let assetsClientCache = {
    version: null,
    expiresAt: 0,
    inFlight: null
};

async function fetchLatestClientVersion() {
    const now = Date.now();
    const ttlMs = 30 * 1000; // 30s cache (fast to update when you bump versions)

    if (assetsClientCache.version !== null && assetsClientCache.expiresAt > now) {
        return assetsClientCache.version;
    }

    if (assetsClientCache.inFlight) {
        return await assetsClientCache.inFlight;
    }

    assetsClientCache.inFlight = (async () => {
        try {
            // API server serves this from apps/api/assetsClient.json (or repo root fallback)
            const data = await makeApiRequest('/assetsClient');
            const v = data?.data?.latestClientVersion;
            const parsed = Number(v);
            if (Number.isFinite(parsed) && parsed > 0) {
                assetsClientCache.version = parsed;
                assetsClientCache.expiresAt = Date.now() + ttlMs;
                return parsed;
            }
        } catch (e) {
            // ignore; fallback below
        } finally {
            assetsClientCache.inFlight = null;
        }

        // Final fallback (keeps dev usable if API is down)
        const fallback = 61;
        assetsClientCache.version = fallback;
        assetsClientCache.expiresAt = Date.now() + 5 * 1000;
        return fallback;
    })();

    return await assetsClientCache.inFlight;
}

function renderGamePage(serverId, serverUrl, worldTitle = null, { isDevelopmentWorld = false, clientVersion = 61 } = {}) {
    const title = worldTitle || `World ${serverId}`;
    const version = Number.isFinite(Number(clientVersion)) ? Number(clientVersion) : 61;
    const clientBundleSrc = isDevelopmentWorld
        ? `/js/client/development.client.${version}.js`
        : `/js/client/client.${version}.js`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="Description" content="OpenSpell - A browser-based MMORPG. Play for free today!">
  <meta name='author' content='OpenSpell'/>
  <meta name="keywords" content="openspell, mmo, mmorpg, fantasy, online game" />
  <link rel='shortcut icon' href='/images/favicon2.ico?4'>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=device-width, user-scalable=0, interactive-widget=overlays-content">
  <title>OpenSpell - ${escapeHtml(title)}</title>
  <link href="/css/client.2.css" rel="stylesheet" type="text/css">
  <link href="/css/game.12.css" rel="stylesheet" type="text/css">
  <link href="/css/gamelogin.2.css" rel="stylesheet" type="text/css">
</head>
<body>
  <div id="body-container">
    <main id="main">
      <div id="game-container">
        <div id="loading-container">
          <div class="spinner-container">
            <svg class="spinner" width="66px" height="66px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="spinner-path" fill="none" stroke-width="4" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>
          <span id="loading-client" class="game-text">Loading Client...</span>
        </div>
      </div>
      <input type="hidden" id="api-url" value="${escapeHtml(CLIENT_API_URL)}" />
      <input type="hidden" id="server-id-input" value="${escapeHtml(String(serverId))}" />
      <input type="hidden" id="server-url" value="${escapeHtml(serverUrl)}" />
      <input type="hidden" id="chat-server-url" value="${escapeHtml(CLIENT_CHAT_URL)}" />
      <input type="hidden" id="cdn-url" value="${escapeHtml(CLIENT_CDN_URL)}" />
      <script src="${escapeHtml(clientBundleSrc)}"></script>
    </main>
  </div>
</body>
</html>`;
}

function setGameClientCsp(res) {
    res.setHeader(
        'Content-Security-Policy',
        buildCspHeaderValue(res.locals.cspNonce)
    );
}

// Route: Home page with latest news (must be before other routes)
app.get('/', async (req, res) => {
    // Get user info for header (use session data, don't fetch fresh for performance)
    const user = await getUserInfo(req, false);
    
    const newsData = await loadNews();
    const newsItems = newsData.items || [];
    
    // Get latest 5 news items
    const latestNews = newsItems
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const newsSummaryItems = latestNews.map(item => {
        const formattedDate = formatDate(item.date);
        const thumbnail = item.thumbnail || '/images/logo.png';
        return `                <div class="news-item">
    <img class="news-thumb" width="180" height="120" src="${thumbnail}" alt="${escapeHtml(item.title)}" title="${escapeHtml(item.title)}" />
    <div>
        <div class="news-h"><a href="/news/${item.slug}" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</a></div>
        <div class="news-meta"><a href="#" title="${escapeHtml(item.type || 'Game')}">${escapeHtml(item.type || 'Game')}</a> | ${formattedDate}</div>
        <div class="news-desc art-body">${escapeHtml(item.description)} <a href="/news/${item.slug}" title="Read More">...Read More</a></div>
    </div>
</div>`;
    }).join('\n            \n');

    // Fetch online users count
    const onlineCount = await fetchOnlineUsersCount();

    const bodyContent = `
    <div id="online-count">
        
            There are currently <span class="theme-color-text fw-bold">${onlineCount}</span> players online
        
    </div>

    <div id="gm-sect">

        <div id="gm-img"></div>

        <div id="play-sect">
            <div class="play-btn-wrap">
                <a href="/play" class="play-btn">
                    PLAY NOW
                </a>
            </div>
            <div class="play-btn-wrap">
                <a href="/register" class="play-btn reg-btn">
                    <div style="font-weight:100;">No Account?</div>
                    <div>Sign Up For Free</div>
                </a>
            </div>
        </div>

    </div>
    

    <div class="card">

        <h1 class="sect-h" id="news-h">
            <div id="news-ico"></div><span>Latest News and Updates</span>
        </h1>

        
            
${newsSummaryItems}
            
        
    </div>`;

    const html = generatePage('OpenSpell', bodyContent, null, user);
    res.send(html);
});

// Route: Play page (dynamic worlds list from DB via API server)
app.get('/play', async (req, res) => {
    const user = await getUserInfo(req, false);
    const csrfToken = getCsrfToken(req);

    let worlds = [];
    let errorMessage = null;
    try {
        const response = await makeApiRequest('/api/worlds');
        worlds = response?.worlds || [];
    } catch (error) {
        console.error('Error fetching worlds:', error);
        errorMessage = 'Unable to load worlds right now. Please try again later.';
    }

    const worldRows = worlds.map(world => {
        const serverId = world.serverId;
        const name = world.name || `World ${serverId}`;
        const locationName = world.locationName || 'Unknown';
        const flagCode = world.flagCode || 'USA';
        const serverUrl = world.serverUrl || '';
        const playerCount = Number.isFinite(Number(world.playerCount)) ? Number(world.playerCount) : 0;
        const isOnline = world.isOnline === undefined ? true : !!world.isOnline;
        const isActive = world.isActive === undefined ? true : !!world.isActive;

        const disabled = !isActive || !isOnline || !serverUrl;
        const countText = !isActive ? 'Disabled' : (isOnline ? String(playerCount) : 'Offline');

        return `                <li class="srv-row sel">
                        <div class="srv-loc"><span class="c-flag c-flag__${escapeHtml(flagCode)}" title="${escapeHtml(locationName)}"></span></div>
                        <div class="srv-r">
                            <div class="srv-name">
                                <form action="/game" name="${escapeHtml(String(serverId))}" method="POST">
                                    <input type="hidden" name="_csrf" value="${csrfToken}" />
                                    <input type="submit" id="submit" class="srv-link fw-bold" name="submit" value="${escapeHtml(name)}"${disabled ? ' disabled' : ''} />
                                    <input type="hidden" value="${escapeHtml(String(serverId))}" name="serverid" />
                                    <input type="hidden" value="${escapeHtml(serverUrl)}" name="serverurl" />
                                </form>
                            </div>
                            <div class="srv-count">${escapeHtml(countText)}</div>
                        </div>
                    </li>`;
    }).join('\n');

    const bodyContent = `
<section id="srv-page">

    <h1 class="sect-h" id="srv-h">
		<span>Select a world to play on</span>
	</h1>

    <div id="srv-cont" class="content-box">

        ${errorMessage ? `<div class="card" style="margin-bottom: 16px; color: #ff4444;">${escapeHtml(errorMessage)}</div>` : ''}

        <ul id="srv-tbl" class="card">
            
                <li id="srv-hdr" class="srv-row sel">
                    <div class="srv-loc">Location</div>
                    <div class="srv-r">
                        <div class="srv-name">World</div>
                        <div class="srv-count">Players</div>
                    </div>
                </li>
                
${worldRows || `                <li class="srv-row sel">
                    <div style="padding: 20px; opacity: 0.8;">No worlds are currently available.</div>
                </li>`}
            
        </ul>
        
    </div>

    <div id="srv-ad" class="card">
		<div id="ad-box"></div>
	</div>

</section>`;

    const html = generatePage('OpenSpell - Play', bodyContent, 'Select a world to play on', user);
    return res.send(html);
});

// POST /game - World selection (validates against DB via API, stores selection in session, serves game client HTML)
app.post('/game', csrfProtection, async (req, res) => {
    try {
        const serverId = Number(req.body?.serverid);
        if (!Number.isInteger(serverId) || serverId <= 0) {
            return res.status(400).send('Invalid server ID. Please select a valid world.');
        }

        const latestClientVersion = await fetchLatestClientVersion();

        const response = await makeApiRequest(`/api/worlds/${encodeURIComponent(String(serverId))}`);
        const world = response?.world;
        if (!world) {
            return res.status(404).send('World not found.');
        }

        if (!world.isActive) {
            return res.status(403).send('This world is currently disabled.');
        }

        const serverUrl = world.serverUrl;
        if (!serverUrl) {
            return res.status(500).send('World is missing a server URL configuration.');
        }

        const isDevelopmentWorld = !!world.isDevelopment;

        // Store selection in session
        req.session.serverId = serverId;
        req.session.serverUrl = serverUrl;
        req.session.worldName = world.name || `World ${serverId}`;
        req.session.isDevelopmentWorld = isDevelopmentWorld;
        req.session.clientVersion = latestClientVersion;

        // Render and send the game page
        setGameClientCsp(res);
        return res.type('html').send(renderGamePage(serverId, serverUrl, req.session.worldName, { isDevelopmentWorld, clientVersion: latestClientVersion }));
    } catch (error) {
        console.error('Error starting game:', error);
        return res.status(500).send('Unable to start game. Please try again later.');
    }
});

// GET /game - Allow direct access if session has a world selection
app.get('/game', async (req, res) => {
    if (!req.session.serverId || !req.session.serverUrl) {
        return res.redirect('/play');
    }

    const serverId = req.session.serverId;
    let serverUrl = req.session.serverUrl;
    let worldTitle = req.session.worldName || `World ${serverId}`;
    let isDevelopmentWorld = !!req.session.isDevelopmentWorld;
    let clientVersion = req.session.clientVersion || await fetchLatestClientVersion();

    // Refresh config from DB (best-effort) so URL/name changes take effect without forcing relog
    try {
        const response = await makeApiRequest(`/api/worlds/${encodeURIComponent(String(serverId))}`);
        const world = response?.world;
        if (world && world.isActive && world.serverUrl) {
            serverUrl = world.serverUrl;
            worldTitle = world.name || worldTitle;
            req.session.serverUrl = serverUrl;
            req.session.worldName = worldTitle;

            const tags = Array.isArray(world.tags)
                ? world.tags
                : (typeof world.tags === 'string' ? world.tags.split(',').map(s => s.trim()).filter(Boolean) : []);
            isDevelopmentWorld = !!world.isDevelopment || tags.includes('development');
            req.session.isDevelopmentWorld = isDevelopmentWorld;
        }
    } catch (error) {
        // Ignore and fall back to session values
    }

    setGameClientCsp(res);
    return res.type('html').send(renderGamePage(serverId, serverUrl, worldTitle, { isDevelopmentWorld, clientVersion }));
});

// Route: World Map page
app.get('/worldmap', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    const additionalHead = `        <link href="/css/worldmap.css" rel="stylesheet" type="text/css">`;
    
    const bodyContent = `
<section id="world-map">
    <div class="flex-center">
        <div class="card" style="max-width: 1200px; margin: 20px auto; padding: 20px; text-align: center;">
            <h1 class="sect-h" style="margin-bottom: 20px;">
                <span>World Map</span>
            </h1>
            <div style="background: var(--background-color, #1a1a1a); border: 2px solid var(--theme-color, #4a9eff); border-radius: 8px; padding: 20px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                <a href="/images/worldmap.png" target="_blank" title="Click to open full size map in new tab" style="display: inline-block; cursor: pointer; transition: transform 0.2s;">
                    <img src="/images/worldmap.png" alt="World Map" style="max-width: 100%; height: auto; border-radius: 4px; display: block;" />
                </a>
                <p style="margin-top: 15px; color: var(--text-color, #ffffff); font-size: 14px; opacity: 0.8;">
                    Click the map to view full size in a new tab
                </p>
            </div>
        </div>
    </div>
</section>`;

    const html = generatePage('OpenSpell - World Map', bodyContent, 'Explore the world of OpenSpell with our interactive world map.', user, additionalHead);
    res.send(html);
});

// Route: Rules page
app.get('/rules', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    const rulesContent = `
        <div class="rules-cont">
            
            <p class="rules-p">OpenSpell is meant to be a fun and low-stress game environment. These rules exist to protect that experience, not to police people unnecessarily. In an ideal world, they would never need to be enforced at all - the best outcome is one where everyone simply enjoys the game and treats others with respect. However, past experience shows that unclear boundaries and hands-off moderation allow toxicity, suspicion, and hostility to take over. For that reason, OpenSpell will be intentionally curated. Participation is a privilege that depends on respecting the experience of others, and moderation exists to keep the game enjoyable for the majority of players acting in good faith.</p>
            
            <ol class="rules-ol">
                <li class="rule">
                    <span class="rule-num">1</span>
                    <div class="rule-body">
                        <strong class="rule-h">Be kind and respectful.</strong>
                        <p class="rule-desc">Use your best judgement to be kind to one another. For example, Don't be toxic, racist, witch-hunt, harass, grief, etc. If we feel the game is a lesser experience with you in it, you will be removed from it.</p>
                    </div>
                </li>
                <li class="rule">
                    <span class="rule-num">2</span>
                    <div class="rule-body">
                        <strong class="rule-h">No rules lawyering</strong>
                        <p class="rule-desc">No bad-faith arguing, no baiting/rage-baiting, drama farming, meta-conflict, or other disruptive behavior intended to undermine the community or moderation. This is not a democracy, this is not a court of law. This is a game, it's meant to be fun, relaxing, and enjoyable. Any attempt to subvert this is not being respectful to others.</p>
                    </div>
                </li>
                <li class="rule">
                    <span class="rule-num">3</span>
                    <div class="rule-body">
                        <strong class="rule-h">Moderation decisions are final.</strong>
                        <p class="rule-desc">We are not required to provide evidence, debate rulings, or issue warnings before taking action. You are welcome to appeal a ban at <a href="mailto:support@openspell.dev" class="rule-link">support@openspell.dev</a>.</p>
                    </div>
                </li>
                <li class="rule">
                    <span class="rule-num">4</span>
                    <div class="rule-body">
                        <strong class="rule-h">Don't bot on non-botting servers.</strong>
                        <p class="rule-desc">You will be banned permanently on your first offense. Any attempt to subvert an IP ban will result in permanent removal. This rule exists to protect fair play and prevent the toxic, accusatory culture that unchecked botting creates. If you'd like to bot, you're welcome to play on the botting server.</p>
                    </div>
                </li>
                <li class="rule">
                    <span class="rule-num">5</span>
                    <div class="rule-body">
                        <strong class="rule-h">Account limit: one main and one alternate account.</strong>
                        <p class="rule-desc">Players may use a maximum of two accounts at a time across the servers (your main account plus one alternate account). If you are found playing more than two accounts at once, all associated accounts may be punished.</p>
                    </div>
                </li>
            </ol>
        </div>
    `;
    
    const bodyContent = `<section id="rules-page">
    <div>
        <h1 class="rules-h">RULES</h1>
    </div>
    <div class="card rules-box">
        <div class="rules-inner">
            ${rulesContent}
        </div>
    </div>
</section>`;

    const html = generatePage('OpenSpell - Rules', bodyContent, 'OpenSpell community rules and guidelines', user);
    res.send(html);
});

// ==================== HISCORES ====================

// Helper: Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || num === '-') return '-';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper: Fetch skills from API
let skillsCache = {
    data: null,
    expiresAt: 0,
    inFlight: null
};

async function fetchSkills() {
    // Skills rarely change, so cache them in-memory to avoid a roundtrip on every hiscores page view.
    // This cache is per web-server process (fine for a single instance; for multi-instance use Redis/CDN).
    const now = Date.now();
    const ttlMs = 5 * 60 * 1000; // 5 minutes

    if (skillsCache.data && skillsCache.expiresAt > now) {
        return skillsCache.data;
    }

    if (skillsCache.inFlight) {
        return await skillsCache.inFlight;
    }

    skillsCache.inFlight = (async () => {
        try {
            const response = await makeApiRequest('/api/hiscores/skills');
            const skills = response.skills || [];
            skillsCache.data = skills;
            skillsCache.expiresAt = Date.now() + ttlMs;
            return skills;
        } catch (error) {
            console.error('Error fetching skills:', error);
            // If we had cached data, prefer serving it even if stale.
            if (skillsCache.data) return skillsCache.data;
            return [];
        } finally {
            skillsCache.inFlight = null;
        }
    })();

    return await skillsCache.inFlight;
}

// Helper: Fetch worlds from API
let worldsCache = {
    data: null,
    expiresAt: 0,
    inFlight: null
};

function parseServerId(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
    return n;
}

function resolveSelectedServerId(worlds, requestedServerId) {
    const parsed = parseServerId(requestedServerId);
    if (parsed && worlds.some(world => world.serverId === parsed)) {
        return parsed;
    }
    const fallback = worlds.find(world => world.isActive) || worlds[0];
    return fallback ? fallback.serverId : 1;
}

async function fetchWorlds() {
    // World list can change, but not frequently; cache briefly.
    const now = Date.now();
    const ttlMs = 60 * 1000; // 1 minute

    if (worldsCache.data && worldsCache.expiresAt > now) {
        return worldsCache.data;
    }

    if (worldsCache.inFlight) {
        return await worldsCache.inFlight;
    }

    worldsCache.inFlight = (async () => {
        try {
            const response = await makeApiRequest('/api/worlds');
            const worlds = response.worlds || [];
            worldsCache.data = worlds;
            worldsCache.expiresAt = Date.now() + ttlMs;
            return worlds;
        } catch (error) {
            console.error('Error fetching worlds:', error);
            if (worldsCache.data) return worldsCache.data;
            return [];
        } finally {
            worldsCache.inFlight = null;
        }
    })();

    return await worldsCache.inFlight;
}

// Helper: Fetch hiscores from API
async function fetchHiscores(skill, page = 1, limit = 25, serverId, options = {}) {
    try {
        const offset = (page - 1) * limit;
        const query = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            serverId: String(serverId)
        });
        if (options.excludeUsername) {
            query.set('excludeUsername', options.excludeUsername);
        }
        if (Number.isFinite(Number(options.minLevel))) {
            query.set('minLevel', String(options.minLevel));
        }
        const response = await makeApiRequest(`/api/hiscores/${skill}?${query.toString()}`);
        return response;
    } catch (error) {
        console.error(`Error fetching hiscores for ${skill}:`, error);
        // Return empty data structure if API fails
        return { items: [], total: 0, page, limit };
    }
}

// Helper: Fetch player stats from API
async function fetchPlayerStats(displayName, serverId) {
    try {
        const response = await makeApiRequest(`/api/hiscores/player/${encodeURIComponent(displayName)}?serverId=${serverId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching player stats for ${displayName}:`, error);
        return null;
    }
}

// Route: HiScores main page (defaults to overall)
app.get('/hiscores', async (req, res) => {
    const worlds = await fetchWorlds();
    const selectedServerId = resolveSelectedServerId(worlds, req.query.serverId);
    return res.redirect(`/hiscores/overall?serverId=${selectedServerId}`);
});

// Route: HiScores by skill
app.get('/hiscores/:skill', async (req, res) => {
    const { skill } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 25; // 25 players per page
    
    // Get user info for header
    const user = await getUserInfo(req, false);
    const csrfToken = getCsrfToken(req);

    const worlds = await fetchWorlds();
    if (worlds.length === 0) {
        return res.status(500).send('Unable to load worlds. Please try again later.');
    }
    const selectedServerId = resolveSelectedServerId(worlds, req.query.serverId);
    const serverQuery = `serverId=${selectedServerId}`;
    
    // Fetch skills from API
    const skills = await fetchSkills();
    if (skills.length === 0) {
        return res.status(500).send('Unable to load skills. Please try again later.');
    }
    
    // Find skill info
    const skillInfo = skills.find(s => s.slug === skill);
    if (!skillInfo) {
        return res.status(404).send('Skill not found');
    }
    
    // Display rules:
    // - Hide username "admin" from all hiscore tables.
    // - For overall only, hide accounts at total level 26 or below.
    const hiscoresFilterOptions = {
        excludeUsername: 'admin',
        ...(skill === 'overall' ? { minLevel: 26 } : {})
    };

    // Fetch hiscores data from API
    const hiscoresData = await fetchHiscores(skill, page, limit, selectedServerId, hiscoresFilterOptions);
    const players = hiscoresData.items || [];
    const total = hiscoresData.total || 0;
    const totalPages = Math.ceil(total / limit);
    
    // Build skills menu
    const skillsMenu = skills.map(s => {
        const isSelected = s.slug === skill;
        const className = isSelected ? 'sel' : '';
        return `<li class="${className}"><a href="/hiscores/${s.slug}?${serverQuery}" title="${escapeHtml(s.title)}" class="sk-link">${escapeHtml(s.title)}<span class="sk-ico" style="background-position: ${s.iconPosition};"></span></a></li>`;
    }).join('\n    ');
    
    // Build player rows
    const playerRows = players.map((player, index) => {
        // Prefer API-provided rank (precomputed), fallback to offset-based rank.
        const rank = (player.rank !== null && player.rank !== undefined)
            ? player.rank
            : ((page - 1) * limit + index + 1);
        const displayName = player.displayName || player.username || 'Unknown';
        const level = player.level !== null && player.level !== undefined ? player.level : '-';
        const exp = player.experience !== null && player.experience !== undefined ? formatNumber(player.experience) : '-';
        
        return `<li class="hs-row sel">
                <div class="hs-rank">${rank}</div>
                <div class="hs-name"><a href="/hiscores/player/${encodeURIComponent(displayName)}?${serverQuery}" title="${escapeHtml(displayName)}">${escapeHtml(displayName)}</a></div>
                <div class="hs-lvl">${level}</div>
                <div class="hs-exp">${exp}</div>
            </li>`;
    }).join('\n        ');
    
    // Build pagination
    let paginationHtml = '';
    if (totalPages > 1) {
        const paginationItems = [];
        
        // Previous button
        if (page > 1) {
            paginationItems.push(`<a href="/hiscores/${skill}?${serverQuery}&page=${page - 1}" class="pg-link">Previous</a>`);
        } else {
            paginationItems.push(`<span class="pg-link disabled">Previous</span>`);
        }
        
        // Page numbers (show up to 5 pages around current)
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);
        
        if (startPage > 1) {
            paginationItems.push(`<a href="/hiscores/${skill}?${serverQuery}&page=1" class="pg-link">1</a>`);
            if (startPage > 2) {
                paginationItems.push(`<span class="pg-ellipsis">...</span>`);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === page) {
                paginationItems.push(`<span class="pg-link active">${i}</span>`);
            } else {
                paginationItems.push(`<a href="/hiscores/${skill}?${serverQuery}&page=${i}" class="pg-link">${i}</a>`);
            }
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(`<span class="pg-ellipsis">...</span>`);
            }
            paginationItems.push(`<a href="/hiscores/${skill}?${serverQuery}&page=${totalPages}" class="pg-link">${totalPages}</a>`);
        }
        
        // Next button
        if (page < totalPages) {
            paginationItems.push(`<a href="/hiscores/${skill}?${serverQuery}&page=${page + 1}" class="pg-link">Next</a>`);
        } else {
            paginationItems.push(`<span class="pg-link disabled">Next</span>`);
        }
        
        paginationHtml = `<div class="card pg-box">
            <div class="pg-links">
                ${paginationItems.join('\n                ')}
            </div>
            <div class="pg-info">
                Page ${page} of ${totalPages} (${total} total players)
            </div>
        </div>`;
    }
    
    const bodyContent = `
<section id="hs-page">

	<h1 class="sect-h" id="hs-h">
		<div id="hs-menu-toggle-wrap">
            <button id="hs-menu-toggle" class="hb-btn">
                <div id="hs-menu-icon"></div>
            </button>
        </div>
        <span>HiScores</span>
	</h1>
	
	<div id="hs-box" class="content-box">
        
            <ul id="sk-menu" class="card">
    ${skillsMenu}
    <li><div>
    <form action="/hiscores/player" method="POST">
        <input type="hidden" name="_csrf" value="${csrfToken}" />
        <input type="hidden" name="serverId" value="${selectedServerId}" />
        <div class="hs-search">
            <div>Player Search</div>
            <div><input type="text" maxlength="16" id="search-player" name="username" placeholder="Username" required /></div>
            <div><input type="submit" name="submit" value="Search" /></div>
        </div>
    </form>
</div></li>
</ul>
<div class="hs-tbl-wrap">
<ul id="hs-tbl" class="card">
    <li>
        <div class="hs-h">
            
                <h2>${escapeHtml(skillInfo.title)}</h2>
            
        </div>
    </li>
    <li id="hs-hdr" class="hs-row">
        <div class="hs-rank">Rank</div>
        <div class="hs-name">Name</div>
        <div class="hs-lvl">Level</div>
        <div class="hs-exp">Experience</div>
    </li>
    
        ${playerRows || '<li class="hs-row"><div style="text-align: center; padding: 20px; color: var(--text-color, #ffffff); opacity: 0.7;">No players found</div></li>'}
    
</ul>
${paginationHtml}
</div>
        
	</div>

</section>`;

    const headerOptions = {
        hiscoresWorlds: worlds.map(world => ({ serverId: world.serverId, name: world.name })),
        selectedServerId,
        hiscoresSelectBaseUrl: `/hiscores/${skill}?serverId=`
    };
    const html = generatePage(`OpenSpell - HiScores - ${skillInfo.title}`, bodyContent, `View the top players in ${skillInfo.title}`, user, '', headerOptions);
    res.send(html);
});

// Route: Player search (POST)
app.post('/hiscores/player', csrfProtection, async (req, res) => {
    const { serverId } = req.body ?? {};
    const rawUsername = req.body?.username;
    const username = typeof rawUsername === 'string' ? rawUsername.trim() : '';
    
    if (!username) {
        return res.redirect('/hiscores?error=' + encodeURIComponent('Username is required'));
    }
    
    // Redirect to player page
    const serverIdValue = parseServerId(serverId) || 1;
    return res.redirect(`/hiscores/player/${encodeURIComponent(username)}?serverId=${serverIdValue}`);
});

// Route: Player stats page
app.get('/hiscores/player/:displayName', async (req, res) => {
    const { displayName } = req.params;
    const normalizedDisplayName = String(displayName || '').trim().toLowerCase();
    const isHiddenHiscoresUser = normalizedDisplayName === 'admin';
    
    // Get user info for header
    const user = await getUserInfo(req, false);
    const csrfToken = getCsrfToken(req);

    const worlds = await fetchWorlds();
    if (worlds.length === 0) {
        return res.status(500).send('Unable to load worlds. Please try again later.');
    }
    const selectedServerId = resolveSelectedServerId(worlds, req.query.serverId);
    const serverQuery = `serverId=${selectedServerId}`;
    
    // Fetch skills from API
    const skills = await fetchSkills();
    if (skills.length === 0) {
        return res.status(500).send('Unable to load skills. Please try again later.');
    }
    
    // Fetch player stats from API (except hidden hiscores users).
    const playerStats = isHiddenHiscoresUser
        ? null
        : await fetchPlayerStats(displayName, selectedServerId);
    
    if (!playerStats || !playerStats.player) {
        const skillsMenu = skills.map(s => {
            return `<li><a href="/hiscores/${s.slug}?${serverQuery}" title="${escapeHtml(s.title)}" class="sk-link">${escapeHtml(s.title)}<span class="sk-ico" style="background-position: ${s.iconPosition};"></span></a></li>`;
        }).join('\n    ');

        const bodyContent = `
<section id="hs">

\t<h1 class="sect-h" id="hs-h">
\t\t<div id="hs-menu-toggle-wrap">
            <button id="hs-menu-toggle" class="hb-btn">
                <div id="hs-menu-icon"></div>
            </button>
        </div>
        <span>HiScores</span>
\t</h1>
\t
\t<div id="hs-box" class="main-content-container">
        
            <ul id="sk-menu" class="card">
    <li><div style="width:100%;display:flex;justify-content:center;"><a href="/hiscores/overall?${serverQuery}" title="All Hiscores" class="sk-link">All Hiscores</a></div></li>
    ${skillsMenu}
    <li><div>
    <form action="/hiscores/player" method="POST">
        <input type="hidden" name="_csrf" value="${csrfToken}" />
        <input type="hidden" name="serverId" value="${selectedServerId}" />
        <div class="hs-search">
            <div>Player Search</div>
            <div><input type="text" maxlength="16" id="search-player" name="username" placeholder="Username" required /></div>
            <div><input type="submit" name="submit" value="Search" /></div>
        </div>
    </form>
</div></li>
</ul>
<ul id="hs-tbl" class="card">
    
        <li>
            <div class="hs-h">
                <h3>Player not found</h3>
            </div>
            <li id="hs-hdr" class="hs-row">
                <div class="hs-row__rank">Rank</div>
                <div class="hs-row__name">Skill</div>
                <div class="hs-row__level">Level</div>
                <div class="hs-row__exp">Experience</div>
            </li>
            <li class="hs-row hs-empty">
                At least one skill needs to be level 30 or higher to appear on the hiscores
            </li>
        </li>
    
</ul>
        
\t</div>
\t


</section>`;

        const headerOptions = {
            hiscoresWorlds: worlds.map(world => ({ serverId: world.serverId, name: world.name })),
            selectedServerId,
            hiscoresSelectBaseUrl: `/hiscores/player/${encodeURIComponent(displayName)}?serverId=`
        };
        const html = generatePage(
            `OpenSpell - HiScores - Player not found`,
            bodyContent,
            `Player not found`,
            user,
            '',
            headerOptions
        );

        return res.status(404).send(html);
    }
    
    const player = playerStats.player;
    const stats = playerStats.stats || [];
    
    // Build skills menu (same as hiscores page)
    const skillsMenu = skills.map(s => {
        return `<li><a href="/hiscores/${s.slug}?${serverQuery}" title="${escapeHtml(s.title)}" class="sk-link">${escapeHtml(s.title)}<span class="sk-ico" style="background-position: ${s.iconPosition};"></span></a></li>`;
    }).join('\n    ');
    
    // Build player stats rows - use stats from API which includes all skills
    const statsRows = stats.map(stat => {
        // Find skill info for icon
        const skill = skills.find(s => s.slug === stat.skill);
        if (!skill) return ''; // Skip if skill not found
        
        const rank = stat.rank !== null && stat.rank !== undefined ? formatNumber(stat.rank) : 'No Rank';
        const level = stat.level !== null && stat.level !== undefined ? stat.level : '-';
        const exp = stat.experience !== null && stat.experience !== undefined ? formatNumber(stat.experience) : '-';
        
        const rankClass = rank === 'No Rank' ? '' : 'sel';
        
        return `<li class="hs-row sel">
                    <div class="hs-rank">${rank}</div>
                    <div class="hs-name">
                        <a href="/hiscores/${skill.slug}?${serverQuery}" title="${escapeHtml(skill.title)}" class="hs-name-link">
                        
                            <span class="sk-ico" style="background-position: ${skill.iconPosition};"></span>
                            
                        ${escapeHtml(skill.title)}
                        </a>
                    </div>
                    <div class="hs-lvl">${level}</div>
                    <div class="hs-exp">${exp}</div>
                </li>`;
    }).filter(row => row !== '').join('\n            ');
    
    const bodyContent = `
<section id="hs-page">

	<h1 class="sect-h" id="hs-h">
		<div id="hs-menu-toggle-wrap">
            <button id="hs-menu-toggle" class="hb-btn">
                <div id="hs-menu-icon"></div>
            </button>
        </div>
        <span>HiScores</span>
	</h1>
	
	<div id="hs-box" class="content-box">
        
            <ul id="sk-menu" class="card">
    <li><div style="width:100%;display:flex;justify-content:center;"><a href="/hiscores/overall?${serverQuery}" title="All Hiscores" class="sk-link">All Hiscores</a></div></li>
    ${skillsMenu}
    <li><div>
    <form action="/hiscores/player" method="POST">
        <input type="hidden" name="_csrf" value="${csrfToken}" />
        <input type="hidden" name="serverId" value="${selectedServerId}" />
        <div class="hs-search">
            <div>Player Search</div>
            <div><input type="text" maxlength="16" id="search-player" name="username" placeholder="Username" required /></div>
            <div><input type="submit" name="submit" value="Search" /></div>
        </div>
    </form>
</div></li>
</ul>
<ul id="hs-tbl" class="card">
    
        <li>
            <div class="hs-h">
                <h2>${escapeHtml(player.displayName || player.username || displayName)}</h2>
            </div>
        </li>
        <li id="hs-hdr" class="hs-row">
            <div class="hs-rank">Rank</div>
            <div class="hs-name">Skill</div>
            <div class="hs-lvl">Level</div>
            <div class="hs-exp">Experience</div>
        </li>
        
            ${statsRows}
        
    
</ul>
        
	</div>
	


</section>`;

    const headerOptions = {
        hiscoresWorlds: worlds.map(world => ({ serverId: world.serverId, name: world.name })),
        selectedServerId,
        hiscoresSelectBaseUrl: `/hiscores/player/${encodeURIComponent(displayName)}?serverId=`
    };
    const html = generatePage(`OpenSpell - HiScores - ${escapeHtml(player.displayName || player.username || displayName)}`, bodyContent, `View stats for ${escapeHtml(player.displayName || player.username || displayName)}`, user, '', headerOptions);
    res.send(html);
});

// Use routes
app.use('/news', newsRoutes); // News routes
app.use('/', authRoutes); // Auth routes (login, register, logout, etc.)
app.use('/account', accountRoutes); // Account management routes

// Route: Resend Verification Email (POST at root level, not under /account)
const {extractApiErrorMessage } = require('./services/api');
const { SHOW_RESEND_VERIFICATION, EMAIL_ENABLED, EMAIL_VERIFICATION_REQUIRED } = require('./services/html');

app.post('/resend-verification', emailLimiter, csrfProtection, async (req, res) => {
    if (!req.session.userId || !req.session.token) {
        return res.redirect('/login');
    }
    
    if (!SHOW_RESEND_VERIFICATION || !EMAIL_ENABLED || !EMAIL_VERIFICATION_REQUIRED) {
        return res.redirect('/account');
    }
    
    try {
        const response = await makeApiRequest('/api/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        
        if (response.success) {
            return res.redirect('/account?success=' + encodeURIComponent('Verification email sent successfully. Please check your inbox.'));
        } else {
            throw new Error(response.error || 'Failed to send verification email');
        }
    } catch (error) {
        const errorMessage = extractApiErrorMessage(error);
        return res.redirect('/account?error=' + encodeURIComponent(errorMessage));
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal server error');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Initialize: Load news and set up file watching

(async () => {
    await loadNews();
})();

// Start server
const server = (() => {
    if (!USE_HTTPS) return http.createServer(app);

    if (!fs.existsSync(SSL_CERT_PATH) || !fs.existsSync(SSL_KEY_PATH)) {
        console.error('ERROR: USE_HTTPS=true but TLS files were not found.');
        console.error(`  SSL_CERT_PATH: ${SSL_CERT_PATH}`);
        console.error(`  SSL_KEY_PATH:  ${SSL_KEY_PATH}`);
        console.error('');
        console.error('Run the repo root script to generate local dev certs:');
        console.error('  .\\setup-https.ps1');
        process.exit(1);
    }

    const cert = fs.readFileSync(SSL_CERT_PATH);
    const key = fs.readFileSync(SSL_KEY_PATH);
    return https.createServer({ cert, key }, app);
})();

server.listen(PORT, async () => {
    const newsService = require('./services/news');
    const newsData = await newsService.loadNews();
    const proto = USE_HTTPS ? 'https' : 'http';
    console.log(`OpenSpell Web Server running on ${proto}://localhost:${PORT}`);
    console.log(`API URL: ${process.env.API_URL || 'http://localhost:3002'}`);
    console.log(`News data will be loaded from API`);
    console.log(`News cache initialized with ${newsData.items.length} item(s)`);
    console.log(`Static assets served from: ${assetsDir}`);
    console.log(`HTML files served from: ${distDir}`);
});
