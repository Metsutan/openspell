/**
 * OpenSpell API Server
 * Provides authentication, online users tracking, and news management
 */

// Load environment variables from single shared config
require('dotenv').config({ path: require('path').join(__dirname, '..', 'shared-assets', 'base', 'shared.env') });
const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const { createRateLimiter } = require('@openspell/rate-limiter');
const { getPrisma } = require('@openspell/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { RegExpMatcher, englishDataset, englishRecommendedTransformers } = require('obscenity');
const emailService = require('./services/email');

const app = express();
const prisma = getPrisma();
const PORT = process.env.PORT || process.env.API_PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || process.env.API_JWT_SECRET || 'default-secret-change-in-production';
const HISCORES_UPDATE_SECRET = process.env.HISCORES_UPDATE_SECRET || null;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

const DEFAULT_CERT_PATH = path.join(__dirname, '..', '..', 'certs', 'localhost.pem');
const DEFAULT_KEY_PATH = path.join(__dirname, '..', '..', 'certs', 'localhost-key.pem');
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || DEFAULT_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || DEFAULT_KEY_PATH;

// Assets client JSON (served at GET /assetsClient)
// This file lives in shared-assets since it's shared across all asset sets
const DEFAULT_ASSETS_CLIENT_PATH = path.join(__dirname, '..', 'shared-assets', 'base', 'assetsClient.json');
const FALLBACK_ASSETS_CLIENT_PATH = path.join(__dirname, '..', '..', 'shared-assets', 'base', 'assetsClient.json');
const ASSETS_CLIENT_PATH = process.env.ASSETS_CLIENT_PATH || DEFAULT_ASSETS_CLIENT_PATH;

const NODE_ENV = process.env.NODE_ENV || 'development';
const WEB_URL = process.env.WEB_URL || 'http://localhost:8887';
const CDN_URL = process.env.CDN_URL || WEB_URL; // Base URL for game assets (used to rewrite assetsClient.json)
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS || '';
const allowedOrigins = new Set(
  [WEB_URL, ...CORS_ALLOWED_ORIGINS.split(',')]
    .map(s => s.trim())
    .filter(Boolean)
);

const API_WEB_SECRET = process.env.API_WEB_SECRET || null;
const WEB_SECRET_HEADER = 'x-openspell-web-secret';
let warnedMissingWebSecret = false;


// Optional: Sync apps/web/news.json into the DB (dev convenience; keep off in production)
const NEWS_FILE_SYNC_ENABLED = process.env.NEWS_FILE_SYNC_ENABLED === 'true';
const NEWS_FILE_SYNC_PATH = process.env.NEWS_FILE_SYNC_PATH || path.join(__dirname, '..', 'web', 'news.json');
const NEWS_FILE_SYNC_DEBOUNCE_MS = parseInt(process.env.NEWS_FILE_SYNC_DEBOUNCE_MS || '250', 10);

// Email configuration
const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';
const EMAIL_VERIFICATION_REQUIRED = process.env.EMAIL_VERIFICATION_REQUIRED === 'true';
const EMAIL_REQUIRED = process.env.EMAIL_REQUIRED === 'true';

// Anti-cheat notifications
const ANTI_CHEAT_DISCORD_WEBHOOK_URL = process.env.ANTI_CHEAT_DISCORD_WEBHOOK_URL || '';
const ANTI_CHEAT_ALERT_EMAILS = process.env.ANTI_CHEAT_ALERT_EMAILS || '';
const ANTI_CHEAT_NOTIFICATION_INTERVAL_MS = parseInt(process.env.ANTI_CHEAT_NOTIFICATION_INTERVAL_MS || '120000', 10);
const ANTI_CHEAT_AUTOTUNE_ENABLED = process.env.ANTI_CHEAT_AUTOTUNE_ENABLED !== 'false';
const ANTI_CHEAT_AUTOTUNE_WINDOW_DAYS = parseInt(process.env.ANTI_CHEAT_AUTOTUNE_WINDOW_DAYS || '7', 10);
const ANTI_CHEAT_AUTOTUNE_SAMPLE_MIN = parseInt(process.env.ANTI_CHEAT_AUTOTUNE_SAMPLE_MIN || '20', 10);
const ANTI_CHEAT_AUTOTUNE_RATIO_LOW = parseFloat(process.env.ANTI_CHEAT_AUTOTUNE_RATIO_LOW || '0.2');
const ANTI_CHEAT_AUTOTUNE_RATIO_HIGH = parseFloat(process.env.ANTI_CHEAT_AUTOTUNE_RATIO_HIGH || '0.7');
const ANTI_CHEAT_AUTOTUNE_STEP_PCT = parseFloat(process.env.ANTI_CHEAT_AUTOTUNE_STEP_PCT || '0.1');

// Email validation configuration (defaults to strict validation)
const EMAIL_BLOCK_PLUS_ADDRESSING = process.env.EMAIL_BLOCK_PLUS_ADDRESSING !== 'false'; // default true
const EMAIL_BLOCK_DISPOSABLE = process.env.EMAIL_BLOCK_DISPOSABLE !== 'false'; // default true
const EMAIL_NORMALIZE_GMAIL_DOTS = process.env.EMAIL_NORMALIZE_GMAIL_DOTS !== 'false'; // default true

const displayNameProfanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers
});

// Worlds (game server list) configuration
const WORLD_REGISTRATION_SECRET = process.env.WORLD_REGISTRATION_SECRET || null;
const WORLD_HEARTBEAT_TIMEOUT_SEC = parseInt(process.env.WORLD_HEARTBEAT_TIMEOUT_SEC || '120', 10);

// Game server authentication (for online user tracking and login token consumption)
const GAME_SERVER_SECRET = process.env.GAME_SERVER_SECRET || null;
const GAME_SERVER_SECRET_HEADER = 'x-game-server-secret';
let warnedMissingGameServerSecret = false;

// Game login tokens (used to initiate websockets)
const GAME_LOGIN_TOKEN_TTL_SEC = parseInt(process.env.GAME_LOGIN_TOKEN_TTL_SEC || '60', 10); // 60s default
const GET_LOGIN_WINDOW_MS = parseInt(process.env.GET_LOGIN_WINDOW_MS || '900000', 10);
const GET_LOGIN_MAX = parseInt(process.env.GET_LOGIN_MAX || '15', 10); 

// Initialize email service on startup
if (EMAIL_ENABLED) {
  emailService.initializeTransporter();
}

function buildDiscordWebhookPayload(alert, user) {
  const adminUrl = `${WEB_URL}/account/admin`;
  return JSON.stringify({
    username: 'OpenSpell Anti-Cheat',
    embeds: [
      {
        title: `CRITICAL Anti-Cheat Alert`,
        color: 15158332,
        fields: [
          { name: 'User', value: `${user.username} (#${user.id})`, inline: true },
          { name: 'Category', value: alert.category, inline: true },
          { name: 'Detected', value: new Date(alert.detectedAt).toLocaleString(), inline: true },
          { name: 'Description', value: alert.description }
        ],
        url: adminUrl
      }
    ]
  });
}

function postDiscordWebhook(payload) {
  if (!ANTI_CHEAT_DISCORD_WEBHOOK_URL) return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      const url = new URL(ANTI_CHEAT_DISCORD_WEBHOOK_URL);
      const req = https.request(
        {
          method: 'POST',
          hostname: url.hostname,
          port: url.port || 443,
          path: `${url.pathname}${url.search}`,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (res) => {
          res.on('data', () => null);
          res.on('end', () => resolve(res.statusCode >= 200 && res.statusCode < 300));
        }
      );
      req.on('error', () => resolve(false));
      req.write(payload);
      req.end();
    } catch (err) {
      resolve(false);
    }
  });
}

async function sendAntiCheatNotifications() {
  try {
    const pending = await prisma.anomalyAlert.findMany({
      where: {
        severity: 'CRITICAL',
        dismissed: false,
        OR: [
          { discordNotifiedAt: null },
          { emailNotifiedAt: null }
        ]
      },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      },
      take: 25,
      orderBy: { detectedAt: 'desc' }
    });

    if (pending.length === 0) return;

    const emailRecipients = ANTI_CHEAT_ALERT_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);

    for (const alert of pending) {
      const updates = {};
      if (!alert.discordNotifiedAt && ANTI_CHEAT_DISCORD_WEBHOOK_URL) {
        const payload = buildDiscordWebhookPayload(alert, alert.user);
        const sent = await postDiscordWebhook(payload);
        if (sent) {
          updates.discordNotifiedAt = new Date();
        }
      }

      if (!alert.emailNotifiedAt && emailRecipients.length > 0) {
        const subject = `[OpenSpell] CRITICAL Anti-Cheat Alert (${alert.category})`;
        const html = `
          <p><strong>CRITICAL Anti-Cheat Alert</strong></p>
          <p>User: ${alert.user.username} (#${alert.user.id})</p>
          <p>Category: ${alert.category}</p>
          <p>Detected: ${new Date(alert.detectedAt).toLocaleString()}</p>
          <p>Description: ${alert.description}</p>
          <p>Admin panel: <a href="${WEB_URL}/account/admin">${WEB_URL}/account/admin</a></p>
        `;

        let allSent = true;
        for (const recipient of emailRecipients) {
          const result = await emailService.sendEmail(recipient, subject, html);
          if (!result.success) {
            allSent = false;
          }
        }

        if (allSent) {
          updates.emailNotifiedAt = new Date();
        }
      }

      if (Object.keys(updates).length > 0) {
        await prisma.anomalyAlert.update({
          where: { id: alert.id },
          data: updates
        });
      }
    }
  } catch (error) {
    console.error('[AntiCheat] Failed to send notifications:', error);
  }
}

if (ANTI_CHEAT_NOTIFICATION_INTERVAL_MS > 0) {
  setInterval(() => void sendAntiCheatNotifications(), ANTI_CHEAT_NOTIFICATION_INTERVAL_MS);
}

const ANTI_CHEAT_DEFAULT_THRESHOLDS = {
  ANTI_CHEAT_INVALID_MAX: 3,
  ANTI_CHEAT_DROP_AMOUNT_THRESHOLD: 1000,
  ANTI_CHEAT_TRADE_MAX: 6,
  ANTI_CHEAT_MULING_AMOUNT_THRESHOLD: 2500,
  ANTI_CHEAT_PACKET_SPIKE_THRESHOLD: 50,
  ANTI_CHEAT_PACKET_SPIKE_CRITICAL_THRESHOLD: 200,
  ANTI_CHEAT_PACKET_UNIQUE_REASONS_THRESHOLD: 5,
  ANTI_CHEAT_DROP_MIN_COUNT: 20,
  ANTI_CHEAT_TRADE_MIN_COUNT: 5,
  ANTI_CHEAT_WEALTH_AMOUNT_THRESHOLD: 1000000,
  ANTI_CHEAT_SHOP_MIN_COUNT: 10,
  ANTI_CHEAT_SHOP_GOLD_THRESHOLD: 100000,
  ANTI_CHEAT_IP_SHARED_MIN_USERS: 3
};

const ANTI_CHEAT_CATEGORY_THRESHOLD_KEY = {
  PACKET_ABUSE: "ANTI_CHEAT_INVALID_MAX",
  ITEM_DROP_BURST: "ANTI_CHEAT_DROP_AMOUNT_THRESHOLD",
  MULING_DETECTED: "ANTI_CHEAT_TRADE_MAX",
  MULING_LARGE_TRANSFER: "ANTI_CHEAT_MULING_AMOUNT_THRESHOLD",
  SHOP_ABUSE: "ANTI_CHEAT_SHOP_MIN_COUNT"
};

async function autoTuneAntiCheatThresholds(categoryFilter = null) {
  if (!ANTI_CHEAT_AUTOTUNE_ENABLED) return;
  const since = new Date(Date.now() - ANTI_CHEAT_AUTOTUNE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const rows = categoryFilter
    ? await prisma.$queryRaw`
        SELECT
          aa.category,
          SUM(CASE WHEN a.action = 'MARK_LEGIT' THEN 1 ELSE 0 END)::int as legit,
          SUM(CASE WHEN a.action = 'MARK_CONFIRMED' THEN 1 ELSE 0 END)::int as confirmed
        FROM anomaly_alert_actions a
        JOIN anomaly_alerts aa ON aa.id = a."alertId"
        WHERE a."createdAt" >= ${since}
          AND a.action IN ('MARK_LEGIT', 'MARK_CONFIRMED')
          AND aa.category = ${categoryFilter}
        GROUP BY aa.category
      `
    : await prisma.$queryRaw`
        SELECT
          aa.category,
          SUM(CASE WHEN a.action = 'MARK_LEGIT' THEN 1 ELSE 0 END)::int as legit,
          SUM(CASE WHEN a.action = 'MARK_CONFIRMED' THEN 1 ELSE 0 END)::int as confirmed
        FROM anomaly_alert_actions a
        JOIN anomaly_alerts aa ON aa.id = a."alertId"
        WHERE a."createdAt" >= ${since}
          AND a.action IN ('MARK_LEGIT', 'MARK_CONFIRMED')
        GROUP BY aa.category
      `;

  for (const row of rows) {
    const total = (row.legit || 0) + (row.confirmed || 0);
    if (total < ANTI_CHEAT_AUTOTUNE_SAMPLE_MIN) continue;
    const thresholdKey = ANTI_CHEAT_CATEGORY_THRESHOLD_KEY[row.category];
    if (!thresholdKey) continue;

    const legitRatio = total > 0 ? (row.legit || 0) / total : 0;
    if (legitRatio > ANTI_CHEAT_AUTOTUNE_RATIO_HIGH || legitRatio < ANTI_CHEAT_AUTOTUNE_RATIO_LOW) {
      const existing = await prisma.antiCheatThresholdOverride.findUnique({
        where: { key: thresholdKey }
      });
      const currentValue = existing?.value ?? ANTI_CHEAT_DEFAULT_THRESHOLDS[thresholdKey];
      if (typeof currentValue !== 'number' || !Number.isFinite(currentValue)) continue;

      const step = Math.max(currentValue * ANTI_CHEAT_AUTOTUNE_STEP_PCT, 1);
      const newValue = legitRatio > ANTI_CHEAT_AUTOTUNE_RATIO_HIGH
        ? currentValue + step
        : Math.max(currentValue - step, 1);

      await prisma.antiCheatThresholdOverride.upsert({
        where: { key: thresholdKey },
        update: {
          value: newValue,
          source: 'AUTO',
          reason: `auto_tune: legitRatio=${legitRatio.toFixed(2)} total=${total}`
        },
        create: {
          key: thresholdKey,
          value: newValue,
          source: 'AUTO',
          reason: `auto_tune: legitRatio=${legitRatio.toFixed(2)} total=${total}`
        }
      });
    }
  }
}

// Middleware
const corsOptions = {
  origin: (origin, cb) => {
    // Non-browser clients (curl/postman) often have no Origin header.
    if (!origin) return cb(null, true);

    // In production, enforce allowlist. In dev, be permissive to simplify iteration.
    if (NODE_ENV !== 'production') return cb(null, true);

    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Initialize Redis-backed rate limiter (with automatic fallback to in-memory)
const rateLimiter = createRateLimiter({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  disabled: process.env.REDIS_DISABLED === 'true'
});

// Rate limiter for /getLoginToken
const getLoginLimiter = rateLimiter.createMiddleware({
  windowMs: GET_LOGIN_WINDOW_MS,
  max: GET_LOGIN_MAX,
  keyPrefix: 'api:login',
  message: 'Too many login attempts, please try again later.',
  statusCode: 429,
  keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown',
  handler: (req, res, result) => {
    return res.status(429).json({ 
      error: 'Too many login attempts, please try again later.',
      retryAfter: result.resetAt
    });
  }
});

// ==================== ASSETS CLIENT (STATIC JSON) ====================

function resolveAssetsClientPath() {
  if (fs.existsSync(ASSETS_CLIENT_PATH)) return ASSETS_CLIENT_PATH;
  if (fs.existsSync(FALLBACK_ASSETS_CLIENT_PATH)) return FALLBACK_ASSETS_CLIENT_PATH;
  return null;
}

// The original base URL in assetsClient.json that needs to be replaced with CDN_URL
const ASSETS_ORIGINAL_BASE_URL = process.env.ASSETS_ORIGINAL_BASE_URL || 'https://highspell.com:8887';

/**
 * Recursively rewrites URLs in an object, replacing the original base URL with CDN_URL
 */
function rewriteAssetUrls(obj, originalBase, newBase) {
  if (typeof obj === 'string') {
    // Replace the original base URL with the new CDN URL
    if (obj.startsWith(originalBase)) {
      return newBase + obj.slice(originalBase.length);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => rewriteAssetUrls(item, originalBase, newBase));
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = rewriteAssetUrls(obj[key], originalBase, newBase);
    }
    return result;
  }
  return obj;
}

function sendAssetsClientJson(res) {
  const filePath = resolveAssetsClientPath();
  if (!filePath) {
    return res.status(404).json({ error: 'assetsClient.json not found' });
  }

  res.setHeader('Cache-Control', 'no-store');

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    
    // Rewrite asset URLs to use the configured CDN_URL
    const rewritten = rewriteAssetUrls(parsed, ASSETS_ORIGINAL_BASE_URL, CDN_URL);
    
    return res.status(200).json(rewritten);
  } catch (err) {
    console.error('Failed to read/parse assetsClient.json:', err);
    return res.status(500).json({ error: 'Failed to load assetsClient.json' });
  }
}

function requireWebServerSecret(req, res, next) {
  if (!API_WEB_SECRET) {
    if (!warnedMissingWebSecret) {
      warnedMissingWebSecret = true;
      console.warn('[web-secret] API_WEB_SECRET is not configured; web-only endpoints are unprotected (dev only).');
    }
    return next();
  }

  const provided = req.headers[WEB_SECRET_HEADER];
  if (!provided || provided !== API_WEB_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

app.get('/assetsClient', (req, res) => sendAssetsClientJson(res));
app.get('/assetsClient.json', (req, res) => sendAssetsClientJson(res));

// Read assetsClient.json (server-side) for validating client versions.
let assetsClientMetaCache = { version: null, expiresAt: 0, inFlight: null };
async function getLatestClientVersionFromAssetsClient() {
  const now = Date.now();
  const ttlMs = 30 * 1000;

  if (assetsClientMetaCache.version !== null && assetsClientMetaCache.expiresAt > now) {
    return assetsClientMetaCache.version;
  }

  if (assetsClientMetaCache.inFlight) {
    return await assetsClientMetaCache.inFlight;
  }

  assetsClientMetaCache.inFlight = (async () => {
    try {
      const filePath = resolveAssetsClientPath();
      if (!filePath) return null;
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      const v = parsed?.data?.latestClientVersion;
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) {
        assetsClientMetaCache.version = n;
        assetsClientMetaCache.expiresAt = Date.now() + ttlMs;
        return n;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      assetsClientMetaCache.inFlight = null;
    }
  })();

  return await assetsClientMetaCache.inFlight;
}

// Helper: Clean up expired sessions from database
async function cleanupExpiredSessions() {
  try {
    const now = new Date();
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });
    if (result.count > 0 && process.env.NODE_ENV !== 'production') {
      console.log(`Cleaned up ${result.count} expired session(s)`);
    }
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

// ==================== NEWS FILE SYNC (OPTIONAL) ====================

let newsFileSyncTimer = null;
let newsFileSyncInFlight = false;

function readNewsItemsFromJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[news-sync] File not found: ${filePath}`);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error('Invalid news JSON format: expected { items: [] }');
  }

  return parsed.items;
}

function normalizeNewsItem(item) {
  const title = item?.title ? String(item.title) : '';
  const slug = item?.slug ? String(item.slug) : '';
  const type = item?.type ? String(item.type) : 'Game';
  const description = item?.description ? String(item.description) : '';
  const content = item?.content ? String(item.content) : '';

  // Optional fields
  const picture = item?.picture !== undefined && item?.picture !== null ? String(item.picture) : null;
  const thumbnail = item?.thumbnail !== undefined && item?.thumbnail !== null ? String(item.thumbnail) : null;

  let date = null;
  if (item?.date) {
    const d = new Date(item.date);
    if (!Number.isNaN(d.getTime())) date = d;
  }

  if (!title || !slug || !description || !content) {
    return { ok: false, error: 'Missing required fields (title, slug, description, content)', slug };
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      type,
      date: date || new Date(),
      description,
      picture,
      thumbnail,
      content
    }
  };
}

async function syncNewsFromFileToDb() {
  if (!NEWS_FILE_SYNC_ENABLED) return;
  if (newsFileSyncInFlight) return;

  newsFileSyncInFlight = true;
  const startedAt = Date.now();

  try {
    const items = readNewsItemsFromJsonFile(NEWS_FILE_SYNC_PATH);
    if (!items) return;

    const upserts = [];
    let skipped = 0;

    for (const item of items) {
      const normalized = normalizeNewsItem(item);
      if (!normalized.ok) {
        skipped++;
        console.warn(`[news-sync] Skipping item${normalized.slug ? ` (${normalized.slug})` : ''}: ${normalized.error}`);
        continue;
      }

      const data = normalized.data;
      upserts.push(
        prisma.news.upsert({
          where: { slug: data.slug },
          update: {
            title: data.title,
            type: data.type,
            date: data.date,
            description: data.description,
            picture: data.picture,
            thumbnail: data.thumbnail,
            content: data.content
          },
          create: data
        })
      );
    }

    if (upserts.length) {
      await prisma.$transaction(upserts);
    }

    if (process.env.NODE_ENV !== 'production') {
      const ms = Date.now() - startedAt;
      console.log(`[news-sync] Synced ${upserts.length} item(s) from ${NEWS_FILE_SYNC_PATH}${skipped ? ` (skipped ${skipped})` : ''} in ${ms}ms`);
    }
  } catch (error) {
    console.error('[news-sync] Failed to sync news from file:', error);
  } finally {
    newsFileSyncInFlight = false;
  }
}

function scheduleNewsFileSync() {
  if (!NEWS_FILE_SYNC_ENABLED) return;
  if (newsFileSyncTimer) clearTimeout(newsFileSyncTimer);
  newsFileSyncTimer = setTimeout(() => {
    newsFileSyncTimer = null;
    void syncNewsFromFileToDb();
  }, Math.max(0, NEWS_FILE_SYNC_DEBOUNCE_MS));
}

function setupNewsFileWatcher() {
  if (!NEWS_FILE_SYNC_ENABLED) return;

  if (!fs.existsSync(NEWS_FILE_SYNC_PATH)) {
    console.warn(`[news-sync] NEWS_FILE_SYNC_ENABLED is true but file does not exist: ${NEWS_FILE_SYNC_PATH}`);
    return;
  }

  fs.watchFile(NEWS_FILE_SYNC_PATH, { interval: 1000 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
      if (process.env.NODE_ENV !== 'production') console.log('[news-sync] Detected change in news.json; scheduling DB sync...');
      scheduleNewsFileSync();
    }
  });

  if (process.env.NODE_ENV !== 'production') console.log(`[news-sync] Watching for changes: ${NEWS_FILE_SYNC_PATH}`);
}

// Helper: Verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Helper: Verify user is admin (must be called after verifyToken)
async function verifyAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { isAdmin: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== HISCORES HELPERS ====================

const hiscoresSkillIdCache = new Map(); // slug -> id

async function getSkillIdBySlug(slug) {
  if (hiscoresSkillIdCache.has(slug)) return hiscoresSkillIdCache.get(slug);
  const skill = await prisma.skill.findUnique({ where: { slug }, select: { id: true } });
  if (!skill) return null;
  hiscoresSkillIdCache.set(slug, skill.id);
  return skill.id;
}

function requireHiscoresUpdateSecret(req, res, next) {
  if (!HISCORES_UPDATE_SECRET) {
    return res.status(503).json({ error: 'Hiscores update is not configured' });
  }
  const provided = req.body?.secret;
  if (!provided || provided !== HISCORES_UPDATE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/**
 * Recompute the "overall" PlayerSkill row for a single user from their non-overall skills.
 * This keeps /hiscores/overall cheap (it becomes a normal skill query).
 */
async function recomputeOverallForUser(db, userId, overallSkillId, persistenceId) {
  // Postgres note: Prisma creates quoted identifiers for camelCase columns ("userId", "skillId", ...),
  // so raw SQL must quote them too.
  await db.$executeRaw`
    INSERT INTO "player_skills" ("userId", "persistenceId", "skillId", "level", "experience", "updatedAt")
    SELECT
      ${userId} as "userId",
      ${persistenceId} as "persistenceId",
      ${overallSkillId} as "skillId",
      COALESCE(SUM("level"), 0) as "level",
      COALESCE(SUM("experience"), 0) as "experience",
      CURRENT_TIMESTAMP as "updatedAt"
    FROM "player_skills"
    WHERE "userId" = ${userId}
      AND "persistenceId" = ${persistenceId}
      AND "skillId" <> ${overallSkillId}
    ON CONFLICT ("userId", "persistenceId", "skillId") DO UPDATE SET
      "level" = EXCLUDED."level",
      "experience" = EXCLUDED."experience",
      "updatedAt" = CURRENT_TIMESTAMP;
  `;
}

/**
 * Ensure a newly-created user has PlayerSkill rows for all skills.
 * - Creates missing non-overall skill rows at level=1, experience=0
 * - Recomputes/creates the overall row as sum(level) + sum(experience)
 *
 * Important: This is idempotent and will NOT overwrite existing skill values.
 */
async function ensureInitialPlayerSkillsForUser(db, userId, persistenceId) {
  const skills = await db.skill.findMany({
    select: { id: true, slug: true },
    orderBy: { displayOrder: 'asc' }
  });

  const overall = skills.find(s => s.slug === 'overall');
  const nonOverall = skills.filter(s => s.slug !== 'overall');

  if (!overall || nonOverall.length === 0) {
    throw new Error('Skills are not seeded (missing overall and/or non-overall skills)');
  }

  // Create non-overall rows if missing, but do not overwrite if already present.
  for (const skill of nonOverall) {
    const isHitpoints = skill.slug === 'hitpoints';
    await db.playerSkill.upsert({
      where: { userId_persistenceId_skillId: { userId, persistenceId, skillId: skill.id } },
      update: {},
      create: {
        userId,
        persistenceId,
        skillId: skill.id,
        level: isHitpoints ? 10 : 1,
        boostedLevel: isHitpoints ? 10 : 1,
        experience: isHitpoints ? BigInt(1414) : BigInt(0)
      }
    });
  }

  // Overall is derived from the other skills; compute it from current rows.
  await recomputeOverallForUser(db, userId, overall.id, persistenceId);
}

/**
 * Ensure a newly-created user has a persisted PlayerLocation row.
 *
 * Default spawn:
 * - mapLevel: 1 (overworld)
 * - x/y: 78/-93 (Middlefern spawn house)
 *
 * Important: This is idempotent and will NOT overwrite existing location values.
 */
async function ensureInitialPlayerLocationForUser(db, userId, persistenceId) {
  await db.playerLocation.upsert({
    where: { userId_persistenceId: { userId, persistenceId } },
    update: {},
    create: {
      userId,
      persistenceId,
      mapLevel: 1,
      x: 78,
      y: -93
    }
  });
}

/**
 * Ensure a newly-created user has default (empty) equipment slots.
 *
 * We pre-create one row per slot with itemDefId/amount NULL. This makes
 * equipment updates simple (update the row) and keeps the schema consistent.
 *
 * Important: This is idempotent and will NOT overwrite existing equipment values.
 */
async function ensureInitialPlayerEquipmentForUser(db, userId, persistenceId) {
  const slots = [
    'helmet',
    'chest',
    'legs',
    'boots',
    'neck',
    'weapon',
    'shield',
    'back',
    'gloves',
    'projectile'
  ];

  for (const slot of slots) {
    await db.playerEquipment.upsert({
      where: { userId_persistenceId_slot: { userId, persistenceId, slot } },
      update: {},
      create: {
        userId,
        persistenceId,
        slot,
        itemDefId: null,
        amount: null
      }
    });
  }
}

/**
 * Ensure a newly-created user has starter inventory items.
 *
 * Gives new players a basic set of starter items in their inventory (28 slots, 0-27).
 * Each item is stored as [slot, itemId, amount, isIOU] where:
 * - slot: 0-27 (inventory position)
 * - itemId: item definition ID
 * - amount: quantity
 * - isIOU: 0 (regular item) or 1 (IOU/bank note)
 *
 * Important: This is idempotent and will NOT overwrite existing inventory items.
 */
async function ensureInitialPlayerInventory(db, userId, persistenceId) {
  // Starter items: [slot, itemId, amount, isIOU]
  const starterItems = [
    [0, 240, 1, 0],  // Slot 0: Item ID 240, qty 1, regular item
    [1, 52, 1, 0],   // Slot 1: Item ID 52, qty 1, regular item
    [2, 58, 1, 0],   // Slot 2: Item ID 58, qty 1, regular item
    [3, 7, 1, 0]     // Slot 3: Item ID 7, qty 1, regular item
  ];

  for (const [slot, itemId, amount, isIOU] of starterItems) {
    await db.playerInventory.upsert({
      where: { userId_persistenceId_slot: { userId, persistenceId, slot } },
      update: {},  // Don't overwrite if item already exists in this slot
      create: {
        userId,
        persistenceId,
        slot,
        itemId,
        amount,
        isIOU
      }
    });
  }
}

const DEFAULT_PLAYER_ABILITIES = [1000, 1000];
const DEFAULT_PLAYER_SETTINGS = [0, 1, 7, 1, 1];

async function ensureInitialPlayerAbilitiesForUser(db, userId, persistenceId) {
  await db.playerAbility.upsert({
    where: { userId_persistenceId: { userId, persistenceId } },
    update: {},
    create: {
      userId,
      persistenceId,
      values: [...DEFAULT_PLAYER_ABILITIES]
    }
  });
}

async function ensureInitialPlayerSettingsForUser(db, userId, persistenceId) {
  await db.playerSetting.upsert({
    where: { userId_persistenceId: { userId, persistenceId } },
    update: {},
    create: {
      userId,
      persistenceId,
      data: [...DEFAULT_PLAYER_SETTINGS]
    }
  });
}

/**
 * Recompute rank for a skill using a window function (fast, done in the DB).
 * Ranks are 1..N by experience DESC; experience==0 is treated as "unranked" (rank NULL).
 */
async function recomputeRanksForSkill(skillId, persistenceId, overallSkillId = null) {
  const isOverall = overallSkillId !== null && skillId === overallSkillId;

  // Mark "unranked" rows with NULL rank.
  // - For normal skills: unranked if experience == 0
  // - For overall: unranked if total level == 0 (and therefore xp should be 0 as well)
  if (isOverall) {
    await prisma.$executeRaw`
      UPDATE "player_skills"
      SET "rank" = NULL
      WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "level" = 0;
    `;
  } else {
    await prisma.$executeRaw`
      UPDATE "player_skills"
      SET "rank" = NULL
      WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "experience" = 0;
    `;
  }

  // Rank everyone else.
  // IMPORTANT: Overall ranking is by (total level DESC, total XP DESC).
  if (isOverall) {
    await prisma.$executeRaw`
      WITH ranked AS (
        SELECT
          "id",
          ROW_NUMBER() OVER (ORDER BY "level" DESC, "experience" DESC, "userId" ASC) AS r
        FROM "player_skills"
        WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "level" > 0
      )
      UPDATE "player_skills"
      SET "rank" = (SELECT r FROM ranked WHERE ranked."id" = "player_skills"."id")
      WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "level" > 0;
    `;
  } else {
    await prisma.$executeRaw`
      WITH ranked AS (
        SELECT
          "id",
          ROW_NUMBER() OVER (ORDER BY "experience" DESC, "userId" ASC) AS r
        FROM "player_skills"
        WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "experience" > 0
      )
      UPDATE "player_skills"
      SET "rank" = (SELECT r FROM ranked WHERE ranked."id" = "player_skills"."id")
      WHERE "skillId" = ${skillId} AND "persistenceId" = ${persistenceId} AND "experience" > 0;
    `;
  }
}

// ==================== EMAIL VALIDATION ====================

/**
 * Comprehensive email validation and normalization
 * Handles Gmail dot normalization, plus addressing, and disposable email blocking
 * Features are controlled by environment variables for flexibility
 */
function validateAndNormalizeEmail(email) {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  const emailLower = email.toLowerCase();
  let [localPart, domain] = emailLower.split('@');
  
  // 1. Block plus addressing if enabled (configurable via EMAIL_BLOCK_PLUS_ADDRESSING)
  if (EMAIL_BLOCK_PLUS_ADDRESSING && localPart.includes('+')) {
    return { isValid: false, error: 'Email aliases with + are not allowed' };
  }

  // Always remove plus addressing from normalized email for uniqueness checking
  // This prevents abuse even if plus addressing is allowed
  if (localPart.includes('+')) {
    localPart = localPart.split('+')[0];
  }

  // 2. Normalize Gmail dots if enabled (configurable via EMAIL_NORMALIZE_GMAIL_DOTS)
  // Gmail ignores dots in the local part, so john.doe@gmail.com = johndoe@gmail.com
  let normalizedLocal = localPart;
  if (EMAIL_NORMALIZE_GMAIL_DOTS && (domain === 'gmail.com' || domain === 'googlemail.com')) {
    normalizedLocal = localPart.replace(/\./g, '');
  }

  // 3. Block disposable email providers if enabled (configurable via EMAIL_BLOCK_DISPOSABLE)
  if (EMAIL_BLOCK_DISPOSABLE) {
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com',
      '10minutemail.com', 'throwaway.email', 'temp-mail.org',
      'getnada.com', 'maildrop.cc', 'trashmail.com',
      'yopmail.com', 'fakeinbox.com', 'sharklasers.com',
      'guerrillamailblock.com', 'grr.la', 'guerrillamail.info',
      'guerrillamail.biz', 'guerrillamail.de', 'spam4.me',
      'tmpeml.com', 'dispostable.com', 'mohmal.com'
    ];
    
    if (disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Disposable email addresses are not allowed' };
    }
  }

  // 4. Return normalized email
  const normalizedEmail = `${normalizedLocal}@${domain}`;

  return { 
    isValid: true, 
    normalizedEmail,
    originalEmail: email
  };
}

function hasProhibitedDisplayNameContent(displayName) {
  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    return false;
  }

  return displayNameProfanityMatcher.getAllMatches(displayName).length > 0;
}

// ==================== AUTHENTICATION ====================

// Register new user
app.post('/api/auth/register', requireWebServerSecret, async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    // Validate username exists before processing
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Convert username to lowercase (client requirement)
    const lowercaseUsername = username.toLowerCase().trim();
    
    if (!lowercaseUsername) {
      return res.status(400).json({ error: 'Username cannot be empty' });
    }
    
    // Check if email is required
    if (EMAIL_REQUIRED && !email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Validate and normalize email if provided
    let normalizedEmail = null;
    let userEmail = `${lowercaseUsername}@placeholder.openspell.local`;
    
    if (email) {
      const validation = validateAndNormalizeEmail(email);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
      normalizedEmail = validation.normalizedEmail;
      userEmail = email;
    }
    
    // Determine final display name (defaults to lowercase username if not provided)
    // Display name CAN be uppercase/mixed case
    const finalDisplayName = displayName && displayName.trim() ? displayName.trim() : lowercaseUsername;

    if (hasProhibitedDisplayNameContent(finalDisplayName)) {
      return res.status(400).json({ error: 'That username/displayname contains prohibited content' });
    }
    
    // Build OR conditions for uniqueness check
    const orConditions = [{ username: lowercaseUsername }, { displayName: finalDisplayName }];
    if (normalizedEmail) {
      // Check against normalizedEmail to prevent email aliasing abuse
      orConditions.push({ normalizedEmail });
    }
    
    // Check if username, email, or displayName already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: orConditions
      }
    });
    
    if (existingUser) {
      // Provide specific error message
      if (existingUser.username === lowercaseUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (normalizedEmail && existingUser.normalizedEmail === normalizedEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingUser.displayName === finalDisplayName) {
        return res.status(400).json({ error: 'Display name already exists' });
      }
      return res.status(400).json({ error: 'Username, email, or display name already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Email verification is considered "enabled" only when we can actually send emails AND verification is required.
    const emailVerificationEnabled = EMAIL_ENABLED && EMAIL_VERIFICATION_REQUIRED && !!email;

    // Create user and (conditionally) seed PlayerSkill rows.
    // If email verification is enabled, defer PlayerSkill creation until verification is accepted.
    
    // Set default normalizedEmail if none was provided
    if (!normalizedEmail) {
      normalizedEmail = `${lowercaseUsername}@placeholder.openspell.local`;
    }

    let verificationTokenToSend = null;
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          username: lowercaseUsername, // Store as lowercase
          displayName: finalDisplayName, // Can be uppercase/mixed case
          email: userEmail,
          normalizedEmail: normalizedEmail, // Normalized email for uniqueness checking
          password: hashedPassword,
          emailVerified: !EMAIL_VERIFICATION_REQUIRED || !email // Auto-verify if verification not required or no email
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          emailVerified: true,
          createdAt: true
        }
      });

      if (emailVerificationEnabled) {
        verificationTokenToSend = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

        await tx.emailVerification.create({
          data: {
            userId: createdUser.id,
            token: verificationTokenToSend,
            expiresAt
          }
        });
      } else {
        // Initialize player data for ALL existing worlds
        await ensureInitialPlayerDataForAllWorlds(tx, createdUser.id);
      }

      return createdUser;
    });

    // Send verification email after the DB commit (don't block registration if email delivery fails).
    if (emailVerificationEnabled && verificationTokenToSend) {
      try {
        await emailService.sendVerificationEmail(user.email, verificationTokenToSend, user.username);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails, just log it
      }
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user,
      token,
      emailVerificationRequired: EMAIL_VERIFICATION_REQUIRED && EMAIL_ENABLED
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'username') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (field === 'email' || field === 'normalizedEmail') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (field === 'displayName') {
        return res.status(400).json({ error: 'Display name already exists' });
      }
      return res.status(400).json({ error: 'Username, email, or display name already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', requireWebServerSecret, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Convert username to lowercase (client requirement)
    const lowercaseUsername = username.toLowerCase().trim();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username: lowercaseUsername }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Delete ALL existing sessions for this user (ensures only 1 active token per user)
    await prisma.session.deleteMany({
      where: {
        userId: user.id
      }
    });
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (requires authentication)
app.get('/api/auth/me', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        previousEmail: true,
        isAdmin: true,
        emailVerified: true,
        lastPasswordChange: true,
        lastEmailChange: true,
        timePlayed: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update display name (requires authentication and admin privileges) - ADMIN ONLY
app.put('/api/auth/display-name', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { displayName, userId } = req.body;
    
    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name is required and must be a non-empty string' });
    }
    
    // Validate display name length
    if (displayName.trim().length > 50) {
      return res.status(400).json({ error: 'Display name must be 50 characters or less' });
    }
    
    const trimmedDisplayName = displayName.trim();

    if (hasProhibitedDisplayNameContent(trimmedDisplayName)) {
      return res.status(400).json({ error: 'That contains prohibited content' });
    }
    
    // Get the current user to check their current display name
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { displayName: true }
    });
    
    // Only check for uniqueness if the display name is actually changing
    if (currentUser && currentUser.displayName !== trimmedDisplayName) {
      // Check if display name is already in use by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          displayName: trimmedDisplayName
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Display name already exists' });
      }
    }
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        displayName: trimmedDisplayName
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        updatedAt: true
      }
    });
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update display name error:', error);
    
    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('displayName')) {
        return res.status(400).json({ error: 'Display name already exists' });
      }
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== BAN MANAGEMENT (ADMIN ONLY) ====================

// Ban a user (permanent or temporary)
app.post('/api/admin/ban-user', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, reason, bannedUntil } = req.body;
    
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'User ID is required and must be a number' });
    }
    
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ error: 'Ban reason is required and must be a non-empty string' });
    }
    
    // Validate bannedUntil if provided
    let bannedUntilDate = null;
    if (bannedUntil) {
      bannedUntilDate = new Date(bannedUntil);
      if (isNaN(bannedUntilDate.getTime())) {
        return res.status(400).json({ error: 'Invalid bannedUntil date format' });
      }
      if (bannedUntilDate <= new Date()) {
        return res.status(400).json({ error: 'bannedUntil must be in the future' });
      }
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent banning admins (safety check)
    if (user.isAdmin) {
      return res.status(403).json({ error: 'Cannot ban admin users' });
    }
    
    // Update user ban status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bannedUntil: bannedUntilDate,
        banReason: reason.trim()
      },
      select: {
        id: true,
        username: true,
        bannedUntil: true,
        banReason: true
      }
    });
    
    res.json({
      success: true,
      user: updatedUser,
      message: bannedUntilDate ? 'User temporarily banned' : 'User permanently banned'
    });
  } catch (error) {
    console.error('Ban user error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unban a user
app.post('/api/admin/unban-user', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'User ID is required and must be a number' });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, banReason: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.banReason) {
      return res.status(400).json({ error: 'User is not banned' });
    }
    
    // Remove ban
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bannedUntil: null,
        banReason: null
      },
      select: {
        id: true,
        username: true,
        bannedUntil: true,
        banReason: true
      }
    });
    
    res.json({
      success: true,
      user: updatedUser,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    console.error('Unban user error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Permanently delete a user (admin only)
app.post('/api/admin/delete-user', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, confirmation } = req.body;

    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'User ID is required and must be a number' });
    }

    const expectedConfirmation = `DELETE USER ${userId}`;
    if (!confirmation || typeof confirmation !== 'string' || confirmation.trim() !== expectedConfirmation) {
      return res.status(400).json({ error: `Confirmation must match exactly: ${expectedConfirmation}` });
    }

    const deletedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          isAdmin: true,
          banReason: true,
          bannedUntil: true
        }
      });

      if (!user) {
        const err = new Error('USER_NOT_FOUND');
        err.code = 'USER_NOT_FOUND';
        throw err;
      }

      if (user.isAdmin) {
        const err = new Error('CANNOT_DELETE_ADMIN');
        err.code = 'CANNOT_DELETE_ADMIN';
        throw err;
      }

      const isPermanentlyBanned = !!user.banReason && !user.bannedUntil;
      if (!isPermanentlyBanned) {
        const err = new Error('USER_NOT_PERMANENTLY_BANNED');
        err.code = 'USER_NOT_PERMANENTLY_BANNED';
        throw err;
      }

      const onlineUser = await tx.onlineUser.findUnique({
        where: { userId: user.id },
        select: { id: true, serverId: true }
      });

      if (onlineUser) {
        const onlineWorld = await tx.world.findUnique({
          where: { serverId: onlineUser.serverId },
          select: { lastHeartbeat: true }
        });
        const stalePresence = isHeartbeatStale(
          onlineWorld?.lastHeartbeat ?? null,
          WORLD_HEARTBEAT_TIMEOUT_SEC
        );

        if (stalePresence) {
          await tx.onlineUser.delete({ where: { id: onlineUser.id } });
        } else {
          const err = new Error('USER_ONLINE');
          err.code = 'USER_ONLINE';
          throw err;
        }
      }

      await tx.user.delete({
        where: { id: user.id }
      });

      return {
        id: user.id,
        username: user.username
      };
    });

    console.log(
      `[admin] User ${deletedUser.id} (${deletedUser.username}) was deleted by admin ${req.userId}`
    );

    return res.json({
      success: true,
      deletedUser,
      message: `User ${deletedUser.id} deleted successfully`
    });
  } catch (error) {
    const errorCode = error?.code;

    if (errorCode === 'USER_NOT_FOUND' || error?.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }

    if (errorCode === 'CANNOT_DELETE_ADMIN') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    if (errorCode === 'USER_NOT_PERMANENTLY_BANNED') {
      return res.status(403).json({ error: 'Only permanently banned users can be deleted' });
    }

    if (errorCode === 'USER_ONLINE') {
      return res.status(409).json({ error: 'User appears online and must be offline before deletion' });
    }

    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ban status for a user
app.get('/api/admin/user-ban-status/:userId', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        bannedUntil: true,
        banReason: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isBanned = !!user.banReason;
    const isPermanent = isBanned && !user.bannedUntil;
    
    res.json({
      isBanned,
      isPermanent,
      bannedUntil: user.bannedUntil,
      banReason: user.banReason
    });
  } catch (error) {
    console.error('Get user ban status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mute a user (permanent or temporary)
app.post('/api/admin/mute-user', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, reason, mutedUntil } = req.body;
    
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'User ID is required and must be a number' });
    }
    
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ error: 'Mute reason is required and must be a non-empty string' });
    }
    
    // Validate mutedUntil if provided
    let mutedUntilDate = null;
    if (mutedUntil) {
      mutedUntilDate = new Date(mutedUntil);
      if (isNaN(mutedUntilDate.getTime())) {
        return res.status(400).json({ error: 'Invalid mutedUntil date format' });
      }
      if (mutedUntilDate <= new Date()) {
        return res.status(400).json({ error: 'mutedUntil must be in the future' });
      }
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, isAdmin: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent muting admins (safety check)
    if (user.isAdmin) {
      return res.status(403).json({ error: 'Cannot mute admin users' });
    }
    
    // Update user mute status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        mutedUntil: mutedUntilDate,
        muteReason: reason.trim()
      },
      select: {
        id: true,
        username: true,
        mutedUntil: true,
        muteReason: true
      }
    });
    
    res.json({
      success: true,
      user: updatedUser,
      message: mutedUntilDate ? 'User temporarily muted' : 'User permanently muted'
    });
  } catch (error) {
    console.error('Mute user error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unmute a user
app.post('/api/admin/unmute-user', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'User ID is required and must be a number' });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, muteReason: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.muteReason) {
      return res.status(400).json({ error: 'User is not muted' });
    }
    
    // Remove mute
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        mutedUntil: null,
        muteReason: null
      },
      select: {
        id: true,
        username: true,
        mutedUntil: true,
        muteReason: true
      }
    });
    
    res.json({
      success: true,
      user: updatedUser,
      message: 'User unmuted successfully'
    });
  } catch (error) {
    console.error('Unmute user error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mute status for a user
app.get('/api/admin/user-mute-status/:userId', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        mutedUntil: true,
        muteReason: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If temporary mute has expired, clear it immediately.
    const now = new Date();
    const isExpired = user.muteReason && user.mutedUntil && user.mutedUntil <= now;
    if (isExpired) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          mutedUntil: null,
          muteReason: null
        }
      });
      return res.json({
        isMuted: false,
        isPermanent: false,
        mutedUntil: null,
        muteReason: null
      });
    }
    
    const isMuted = !!user.muteReason;
    const isPermanent = isMuted && !user.mutedUntil;
    
    res.json({
      isMuted,
      isPermanent,
      mutedUntil: user.mutedUntil,
      muteReason: user.muteReason
    });
  } catch (error) {
    console.error('Get user mute status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all IPs associated with a user
app.get('/api/admin/user-ips/:userId', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userIPs = await prisma.userIP.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
      select: {
        id: true,
        ip: true,
        firstSeen: true,
        lastSeen: true
      }
    });
    
    res.json({
      userId: user.id,
      username: user.username,
      ips: userIPs
    });
  } catch (error) {
    console.error('Get user IPs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ban an IP address (permanent or temporary)
app.post('/api/admin/ban-ip', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { ip, reason, bannedUntil } = req.body;
    
    if (!ip || typeof ip !== 'string' || ip.trim().length === 0) {
      return res.status(400).json({ error: 'IP address is required and must be a non-empty string' });
    }
    
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ error: 'Ban reason is required and must be a non-empty string' });
    }
    
    // Basic IP validation (IPv4 or IPv6)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    const trimmedIP = ip.trim();
    if (!ipRegex.test(trimmedIP)) {
      return res.status(400).json({ error: 'Invalid IP address format' });
    }
    
    // Validate bannedUntil if provided
    let bannedUntilDate = null;
    if (bannedUntil) {
      bannedUntilDate = new Date(bannedUntil);
      if (isNaN(bannedUntilDate.getTime())) {
        return res.status(400).json({ error: 'Invalid bannedUntil date format' });
      }
      if (bannedUntilDate <= new Date()) {
        return res.status(400).json({ error: 'bannedUntil must be in the future' });
      }
    }
    
    // Create or update IP ban
    const ipBan = await prisma.iPBan.upsert({
      where: { ip: trimmedIP },
      update: {
        bannedUntil: bannedUntilDate,
        banReason: reason.trim(),
        updatedAt: new Date()
      },
      create: {
        ip: trimmedIP,
        bannedUntil: bannedUntilDate,
        banReason: reason.trim()
      },
      select: {
        id: true,
        ip: true,
        bannedUntil: true,
        banReason: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json({
      success: true,
      ipBan,
      message: bannedUntilDate ? 'IP temporarily banned' : 'IP permanently banned'
    });
  } catch (error) {
    console.error('Ban IP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unban an IP address
app.post('/api/admin/unban-ip', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { ip } = req.body;
    
    if (!ip || typeof ip !== 'string' || ip.trim().length === 0) {
      return res.status(400).json({ error: 'IP address is required and must be a non-empty string' });
    }
    
    const trimmedIP = ip.trim();
    
    // Check if IP is banned
    const ipBan = await prisma.iPBan.findUnique({
      where: { ip: trimmedIP }
    });
    
    if (!ipBan) {
      return res.status(404).json({ error: 'IP address is not banned' });
    }
    
    // Remove ban
    await prisma.iPBan.delete({
      where: { ip: trimmedIP }
    });
    
    res.json({
      success: true,
      message: 'IP address unbanned successfully'
    });
  } catch (error) {
    console.error('Unban IP error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'IP address is not banned' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ban status for an IP address
app.get('/api/admin/ip-ban-status/:ip', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const ip = decodeURIComponent(req.params.ip);
    
    const ipBan = await prisma.iPBan.findUnique({
      where: { ip },
      select: {
        id: true,
        ip: true,
        bannedUntil: true,
        banReason: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!ipBan) {
      return res.json({
        isBanned: false,
        isPermanent: false,
        bannedUntil: null,
        banReason: null
      });
    }
    
    // Check if ban has expired
    const now = new Date();
    const isExpired = ipBan.bannedUntil && ipBan.bannedUntil <= now;
    
    if (isExpired) {
      // Clean up expired ban
      await prisma.iPBan.delete({
        where: { ip }
      });
      
      return res.json({
        isBanned: false,
        isPermanent: false,
        bannedUntil: null,
        banReason: null
      });
    }
    
    const isPermanent = !ipBan.bannedUntil;
    
    res.json({
      isBanned: true,
      isPermanent,
      bannedUntil: ipBan.bannedUntil,
      banReason: ipBan.banReason,
      createdAt: ipBan.createdAt,
      updatedAt: ipBan.updatedAt
    });
  } catch (error) {
    console.error('Get IP ban status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all banned IPs
app.get('/api/admin/banned-ips', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return res.status(400).json({ error: 'Invalid limit (must be between 1 and 1000)' });
    }
    
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: 'Invalid offset (must be >= 0)' });
    }
    
    const [bannedIPs, total] = await Promise.all([
      prisma.iPBan.findMany({
        take: limitNum,
        skip: offsetNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          ip: true,
          bannedUntil: true,
          banReason: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.iPBan.count()
    ]);
    
    res.json({
      bannedIPs,
      total,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error) {
    console.error('List banned IPs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search users by username (admin only)
app.get('/api/admin/search-users', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { query, limit = 50, offset = 0 } = req.query;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Invalid limit (must be between 1 and 100)' });
    }
    
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: 'Invalid offset (must be >= 0)' });
    }
    
    const searchQuery = query.trim();
    
    // Search for users where username or displayName contains the query (case-insensitive)
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' } },
            { displayName: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          isAdmin: true,
          bannedUntil: true,
          banReason: true,
          mutedUntil: true,
          muteReason: true,
          createdAt: true
        },
        orderBy: [
          { username: 'asc' }
        ],
        take: limitNum,
        skip: offsetNum
      }),
      prisma.user.count({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: 'insensitive' } },
            { displayName: { contains: searchQuery, mode: 'insensitive' } }
          ]
        }
      })
    ]);
    
    res.json({
      users,
      total,
      limit: limitNum,
      offset: offsetNum,
      query: searchQuery
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Anti-cheat alerts list (admin only)
app.get('/api/admin/anti-cheat/alerts', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { severity, category, dismissed = 'false', limit = 50, offset = 0 } = req.query;
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 200) {
      return res.status(400).json({ error: 'Invalid limit (must be between 1 and 200)' });
    }

    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ error: 'Invalid offset (must be >= 0)' });
    }

    const severityList = typeof severity === 'string' && severity.length > 0
      ? severity.split(',').map(s => s.trim()).filter(Boolean)
      : null;
    const categoryList = typeof category === 'string' && category.length > 0
      ? category.split(',').map(s => s.trim()).filter(Boolean)
      : null;
    const dismissedBool = dismissed === 'true';

    const where = {
      dismissed: dismissedBool,
      ...(severityList ? { severity: { in: severityList } } : {}),
      ...(categoryList ? { category: { in: categoryList } } : {})
    };

    const [alerts, total] = await Promise.all([
      prisma.anomalyAlert.findMany({
        where,
        take: limitNum,
        skip: offsetNum,
        orderBy: { detectedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              email: true,
              banReason: true,
              bannedUntil: true
            }
          }
        }
      }),
      prisma.anomalyAlert.count({ where })
    ]);

    res.json({
      alerts,
      total,
      limit: limitNum,
      offset: offsetNum
    });
  } catch (error) {
    console.error('Anti-cheat alert list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dismiss an alert
app.post('/api/admin/anti-cheat/alerts/:id/dismiss', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const alertId = parseInt(req.params.id, 10);
    const note = typeof req.body.note === 'string' ? req.body.note.trim() : null;
    if (!alertId || isNaN(alertId)) {
      return res.status(400).json({ error: 'Invalid alert id' });
    }

    const alert = await prisma.anomalyAlert.findUnique({ where: { id: alertId } });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await prisma.$transaction([
      prisma.anomalyAlert.update({
        where: { id: alertId },
        data: {
          dismissed: true,
          dismissedBy: req.userId,
          dismissedAt: new Date()
        }
      }),
      prisma.anomalyAlertAction.create({
        data: {
          alertId,
          actorUserId: req.userId,
          action: 'DISMISS',
          note: note || undefined
        }
      })
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feedback on an alert (legitimate vs confirmed)
app.post('/api/admin/anti-cheat/alerts/:id/feedback', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const alertId = parseInt(req.params.id, 10);
    const verdict = typeof req.body.verdict === 'string' ? req.body.verdict.toUpperCase() : '';
    const note = typeof req.body.note === 'string' ? req.body.note.trim() : null;
    if (!alertId || isNaN(alertId)) {
      return res.status(400).json({ error: 'Invalid alert id' });
    }
    if (!['LEGITIMATE', 'CONFIRMED'].includes(verdict)) {
      return res.status(400).json({ error: 'Invalid verdict' });
    }

    const alert = await prisma.anomalyAlert.findUnique({ where: { id: alertId } });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const actionType = verdict === 'LEGITIMATE' ? 'MARK_LEGIT' : 'MARK_CONFIRMED';
    const updates = [];

    if (verdict === 'LEGITIMATE' && !alert.dismissed) {
      updates.push(
        prisma.anomalyAlert.update({
          where: { id: alertId },
          data: {
            dismissed: true,
            dismissedBy: req.userId,
            dismissedAt: new Date()
          }
        })
      );
    }

    updates.push(
      prisma.anomalyAlertAction.create({
        data: {
          alertId,
          actorUserId: req.userId,
          action: actionType,
          note: note || undefined
        }
      })
    );

    await prisma.$transaction(updates);
    await autoTuneAntiCheatThresholds(alert.category);

    res.json({ success: true });
  } catch (error) {
    console.error('Alert feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add note to an alert
app.post('/api/admin/anti-cheat/alerts/:id/note', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const alertId = parseInt(req.params.id, 10);
    const note = typeof req.body.note === 'string' ? req.body.note.trim() : '';
    if (!alertId || isNaN(alertId)) {
      return res.status(400).json({ error: 'Invalid alert id' });
    }
    if (!note) {
      return res.status(400).json({ error: 'Note is required' });
    }

    await prisma.anomalyAlertAction.create({
      data: {
        alertId,
        actorUserId: req.userId,
        action: 'NOTE',
        note
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Alert note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User risk summary (admin only)
app.get('/api/admin/anti-cheat/user-risk/:userId', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, displayName: true, createdAt: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alertSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [alerts, ips, invalidPackets, drops, pickups, sales] = await Promise.all([
      prisma.anomalyAlert.findMany({
        where: { userId, detectedAt: { gte: alertSince } },
        orderBy: { detectedAt: 'desc' },
        take: 50
      }),
      prisma.userIP.findMany({
        where: { userId },
        orderBy: { lastSeen: 'desc' }
      }),
      prisma.invalidPacketEventRollup.aggregate({
        where: { userId, bucketStart: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        _sum: { count: true }
      }),
      prisma.itemDropEvent.count({
        where: { dropperUserId: userId, droppedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      }),
      prisma.itemPickupEvent.count({
        where: { pickerUserId: userId, pickedUpAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
      }),
      prisma.shopItemSaleEvent.count({
        where: {
          OR: [{ sellerUserId: userId }, { buyerUserId: userId }],
          soldAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    const severityWeights = { CRITICAL: 40, HIGH: 20, MEDIUM: 10, LOW: 5 };
    const riskScoreRaw = alerts.reduce((sum, alert) => {
      return sum + (severityWeights[alert.severity] || 0);
    }, 0);
    const riskScore = Math.min(riskScoreRaw, 100);

    res.json({
      user,
      riskScore,
      alerts,
      ips,
      stats: {
        invalidPacketsLast24h: invalidPackets._sum.count || 0,
        itemDropsLast24h: drops,
        itemPickupsLast24h: pickups,
        shopSalesLast24h: sales,
        accountAgeDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      }
    });
  } catch (error) {
    console.error('User risk error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Anti-cheat user logs (admin only)
app.get('/api/admin/anti-cheat/user-logs/:userId', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const hours = parseInt(req.query.hours || '24', 10);
    const hoursNum = Number.isFinite(hours) ? Math.min(Math.max(hours, 1), 168) : 24;
    const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

    const [user, invalidEvents, invalidRollups, alerts, drops, pickups] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, displayName: true }
      }),
      prisma.invalidPacketEvent.findMany({
        where: { userId },
        orderBy: { occurredAt: 'desc' },
        take: 50,
        select: {
          id: true,
          packetName: true,
          reason: true,
          count: true,
          actionType: true,
          payloadSample: true,
          details: true,
          occurredAt: true
        }
      }),
      prisma.invalidPacketEventRollup.findMany({
        where: { userId, bucketStart: { gte: since } },
        orderBy: { bucketStart: 'asc' },
        select: {
          bucketStart: true,
          count: true,
          packetName: true,
          reason: true
        }
      }),
      prisma.anomalyAlert.findMany({
        where: { userId },
        orderBy: { detectedAt: 'desc' },
        take: 20,
        select: {
          id: true,
          severity: true,
          category: true,
          description: true,
          detectedAt: true,
          dismissed: true
        }
      }),
      prisma.itemDropEvent.findMany({
        where: { dropperUserId: userId, droppedAt: { gte: since } },
        orderBy: { droppedAt: 'desc' },
        take: 50,
        select: {
          id: true,
          itemId: true,
          amount: true,
          mapLevel: true,
          x: true,
          y: true,
          droppedAt: true
        }
      }),
      prisma.itemPickupEvent.findMany({
        where: { pickerUserId: userId, pickedUpAt: { gte: since } },
        orderBy: { pickedUpAt: 'desc' },
        take: 50,
        select: {
          id: true,
          itemId: true,
          amount: true,
          mapLevel: true,
          x: true,
          y: true,
          pickedUpAt: true
        }
      })
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const normalizedDrops = (drops || []).map(drop => ({
      ...drop,
      amount: typeof drop.amount === 'bigint' ? Number(drop.amount) : drop.amount
    }));
    const normalizedPickups = (pickups || []).map(pickup => ({
      ...pickup,
      amount: typeof pickup.amount === 'bigint' ? Number(pickup.amount) : pickup.amount
    }));

    res.json({
      user,
      since,
      hours: hoursNum,
      invalidEvents,
      invalidRollups,
      alerts,
      itemDrops: normalizedDrops,
      itemPickups: normalizedPickups
    });
  } catch (error) {
    console.error('User logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Anti-cheat trend data (admin only)
app.get('/api/admin/anti-cheat/trends', requireWebServerSecret, verifyToken, verifyAdmin, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours || '24', 10);
    const hoursNum = Number.isFinite(hours) ? Math.min(Math.max(hours, 1), 168) : 24;
    const since = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

    const [invalidPackets, alerts, itemFlow] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('hour', "bucketStart") as hour,
          SUM(count)::int as count,
          COUNT(DISTINCT "userId")::int as unique_users
        FROM invalid_packet_event_rollups
        WHERE "bucketStart" >= ${since}
        GROUP BY hour
        ORDER BY hour ASC
      `,
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('hour', "detectedAt") as hour,
          SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END)::int as critical,
          SUM(CASE WHEN severity = 'HIGH' THEN 1 ELSE 0 END)::int as high,
          SUM(CASE WHEN severity = 'MEDIUM' THEN 1 ELSE 0 END)::int as medium,
          SUM(CASE WHEN severity = 'LOW' THEN 1 ELSE 0 END)::int as low
        FROM anomaly_alerts
        WHERE "detectedAt" >= ${since}
        GROUP BY hour
        ORDER BY hour ASC
      `,
      prisma.$queryRaw`
        SELECT
          hour_bucket.hour,
          COALESCE(drops.count, 0)::int as drops,
          COALESCE(pickups.count, 0)::int as pickups
        FROM (
          SELECT DATE_TRUNC('hour', ${since}::timestamp + interval '1 hour' * generate_series(0, ${hoursNum})) as hour
        ) hour_bucket
        LEFT JOIN (
          SELECT DATE_TRUNC('hour', "droppedAt") as hour, COUNT(*)::int as count
          FROM item_drop_events
          WHERE "droppedAt" >= ${since}
          GROUP BY hour
        ) drops ON drops.hour = hour_bucket.hour
        LEFT JOIN (
          SELECT DATE_TRUNC('hour', "pickedUpAt") as hour, COUNT(*)::int as count
          FROM item_pickup_events
          WHERE "pickedUpAt" >= ${since}
          GROUP BY hour
        ) pickups ON pickups.hour = hour_bucket.hour
        ORDER BY hour_bucket.hour ASC
      `
    ]);

    res.json({
      since,
      invalidPackets,
      alerts,
      itemFlow
    });
  } catch (error) {
    console.error('Anti-cheat trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password (requires authentication)
app.post('/api/auth/change-password', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check cooldown period (1 day = 24 hours)
    if (user.lastPasswordChange) {
      const lastChange = new Date(user.lastPasswordChange);
      const now = new Date();
      const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
      
      if (hoursSinceChange < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceChange);
        return res.status(429).json({ 
          error: `Password can only be changed once per day. Please wait ${hoursRemaining} more hour(s).` 
        });
      }
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and lastPasswordChange
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        password: hashedPassword,
        lastPasswordChange: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change email (requires authentication)
app.post('/api/auth/change-email', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    
    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and password are required' });
    }
    
    // Validate and normalize email
    const validation = validateAndNormalizeEmail(newEmail);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    
    const normalizedNewEmail = validation.normalizedEmail;
    
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if new normalized email is different from current normalized email
    if (normalizedNewEmail === user.normalizedEmail) {
      return res.status(400).json({ error: 'New email must be different from current email' });
    }
    
    // Check if normalized email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { normalizedEmail: normalizedNewEmail }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    
    // Check cooldown period (1 day = 24 hours)
    if (user.lastEmailChange) {
      const lastChange = new Date(user.lastEmailChange);
      const now = new Date();
      const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
      
      if (hoursSinceChange < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceChange);
        return res.status(429).json({ 
          error: `Email can only be changed once per day. Please wait ${hoursRemaining} more hour(s).` 
        });
      }
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }
    
    // Update email, normalizedEmail, previousEmail, and lastEmailChange
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        email: newEmail.toLowerCase(),
        normalizedEmail: normalizedNewEmail,
        previousEmail: user.email,
        lastEmailChange: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Email changed successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    console.error('Change email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email address
app.get('/api/auth/verify-email', requireWebServerSecret, async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    });
    
    if (!verification) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }
    
    // Check if already used
    if (verification.usedAt) {
      return res.status(400).json({ error: 'This verification link has already been used' });
    }
    
    // Check if expired
    if (new Date() > verification.expiresAt) {
      return res.status(400).json({ error: 'Verification link has expired' });
    }
    
    // Mark as verified; only at this point do we seed game-side rows (PlayerSkill) when verification is enabled.
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true }
      });

      await tx.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() }
      });

      // Initialize player data for ALL existing worlds
      await ensureInitialPlayerDataForAllWorlds(tx, verification.userId);
    });
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend verification email
app.post('/api/auth/resend-verification', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    if (!EMAIL_ENABLED || !EMAIL_VERIFICATION_REQUIRED) {
      return res.status(400).json({ error: 'Email verification is not enabled' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }
    
    // Delete old verification tokens
    await prisma.emailVerification.deleteMany({
      where: { userId: user.id }
    });
    
    // Create new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt
      }
    });
    
    // Send email
    const emailResult = await emailService.sendVerificationEmail(user.email, verificationToken, user.username);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
    
    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request password reset
app.post('/api/auth/forgot-password', requireWebServerSecret, async (req, res) => {
  try {
    if (!EMAIL_ENABLED) {
      return res.status(400).json({ error: 'Password recovery is not enabled' });
    }
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, username: true, isAdmin: true }
    });
    
    // Block admin accounts from password reset
    if (user && user.isAdmin) {
      // Still return success to prevent enumeration, but don't send email
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent'
      });
    }
    
    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Delete old reset tokens
      await prisma.passwordReset.deleteMany({
        where: { userId: user.id }
      });
      
      // Create new reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration
      
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt
        }
      });
      
      // Send email
      await emailService.sendPasswordResetEmail(user.email, resetToken, user.username);
    }
    
    // Always return success
    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password with token
app.post('/api/auth/reset-password', requireWebServerSecret, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    // Find reset record
    const reset = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });
    
    if (!reset) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }
    
    // Check if already used
    if (reset.usedAt) {
      return res.status(400).json({ error: 'This reset link has already been used' });
    }
    
    // Check if expired
    if (new Date() > reset.expiresAt) {
      return res.status(400).json({ error: 'Reset link has expired' });
    }
    
    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: {
          password: hashedPassword,
          lastPasswordChange: new Date()
        }
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() }
      })
    ]);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
app.post('/api/auth/logout', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await prisma.session.deleteMany({
        where: { token }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ONLINE USERS ====================

// Get online users count
app.get('/api/online/count', requireWebServerSecret, async (req, res) => {
  try {
    // Count active users
    const count = await prisma.onlineUser.count();

    res.json({ count });
  } catch (error) {
    console.error('Get online count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user online status (called by game server)
app.post('/api/online/update', requireGameServerSecret, async (req, res) => {
  try {
    const { userId, username, serverId } = req.body;
    const serverIdNum = serverId || 1;
    
    // Upsert online user
    if (userId) {
      // Find existing entry by userId
      const existing = await prisma.onlineUser.findFirst({
        where: { userId }
      });
      
      if (existing) {
        // Update existing entry
        await prisma.onlineUser.update({
          where: { id: existing.id },
          data: {
            lastSeen: new Date(),
            serverId: serverIdNum,
            username: username || existing.username
          }
        });
      } else {
        // Create new entry
        await prisma.onlineUser.create({
          data: {
            userId,
            username,
            serverId: serverIdNum,
            lastSeen: new Date()
          }
        });
      }
    } else if (username) {
      // Find existing entry by username
      const existing = await prisma.onlineUser.findFirst({
        where: { 
          username,
          userId: null
        }
      });
      
      if (existing) {
        // Update existing entry
        await prisma.onlineUser.update({
          where: { id: existing.id },
          data: {
            lastSeen: new Date(),
            serverId: serverIdNum
          }
        });
      } else {
        // Create new entry
        await prisma.onlineUser.create({
          data: {
            username,
            serverId: serverIdNum,
            lastSeen: new Date()
          }
        });
      }
    } else {
      return res.status(400).json({ error: 'userId or username is required' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get online users list (optional, for admin)
app.get('/api/online/users', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const users = await prisma.onlineUser.findMany({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo
        }
      },
      orderBy: {
        lastSeen: 'desc'
      },
      take: 100
    });
    
    res.json({ users });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== WORLDS (GAME SERVERS) ====================

let warnedInsecureWorldRegistration = false;
function requireWorldRegistrationSecret(req, res, next) {
  // In production, always require a secret.
  if (NODE_ENV === 'production' && !WORLD_REGISTRATION_SECRET) {
    return res.status(503).json({ error: 'WORLD_REGISTRATION_SECRET is not configured' });
  }

  // In dev, allow missing secret for convenience (but warn).
  if (NODE_ENV !== 'production' && !WORLD_REGISTRATION_SECRET) {
    if (!warnedInsecureWorldRegistration) {
      warnedInsecureWorldRegistration = true;
      console.warn('[worlds] WARNING: WORLD_REGISTRATION_SECRET is not set. World registration endpoints are unsecured (dev only).');
    }
    return next();
  }

  const provided = req.body?.secret || req.headers['x-world-secret'];
  if (!provided || provided !== WORLD_REGISTRATION_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

function requireGameServerSecret(req, res, next) {
  // In production, always require a secret.
  if (NODE_ENV === 'production' && !GAME_SERVER_SECRET) {
    return res.status(503).json({ error: 'GAME_SERVER_SECRET is not configured' });
  }

  // In dev, allow missing secret for convenience (but warn).
  if (NODE_ENV !== 'production' && !GAME_SERVER_SECRET) {
    if (!warnedMissingGameServerSecret) {
      warnedMissingGameServerSecret = true;
      console.warn('[game-server] WARNING: GAME_SERVER_SECRET is not set. Game server endpoints are unsecured (dev only).');
    }
    return next();
  }

  const provided = req.body?.gameServerSecret || req.headers[GAME_SERVER_SECRET_HEADER];
  if (!provided || provided !== GAME_SERVER_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

function parseServerId(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
  return n;
}

async function resolvePersistenceId(db, { persistenceId, serverId }) {
  if (persistenceId !== undefined && persistenceId !== null) {
    const n = Number(persistenceId);
    if (Number.isFinite(n) && Number.isInteger(n) && n > 0) {
      return n;
    }
    throw new Error('Invalid persistenceId for persistence lookup');
  }
  const resolvedServerId = parseServerId(serverId ?? process.env.DEFAULT_SERVER_ID ?? 1);
  if (!resolvedServerId) {
    throw new Error('Invalid serverId for persistence lookup');
  }
  const world = await db.world.findUnique({
    where: { serverId: resolvedServerId },
    select: { persistenceId: true }
  });
  if (!Number.isInteger(world?.persistenceId)) {
    throw new Error(`World persistenceId not found for serverId ${resolvedServerId}`);
  }
  return world.persistenceId;
}

async function resolveDefaultPersistenceId(db) {
  return resolvePersistenceId(db, { serverId: process.env.DEFAULT_SERVER_ID ?? 1 });
}

/**
 * Get all persistenceIds from the World table.
 * Returns an array of unique persistenceId values.
 */
async function getAllPersistenceIds(db) {
  const worlds = await db.world.findMany({
    select: { persistenceId: true },
    distinct: ['persistenceId']
  });
  return worlds.map(w => w.persistenceId).filter(id => Number.isInteger(id) && id > 0);
}

/**
 * Ensures all initial player data exists for a given userId and persistenceId.
 * This is idempotent - it will not overwrite existing data.
 * 
 * @param {*} db - Prisma transaction or client
 * @param {number} userId - The user ID
 * @param {number} persistenceId - The persistence/world ID
 */
async function ensureInitialPlayerDataForWorld(db, userId, persistenceId) {
  await ensureInitialPlayerSkillsForUser(db, userId, persistenceId);
  await ensureInitialPlayerLocationForUser(db, userId, persistenceId);
  await ensureInitialPlayerEquipmentForUser(db, userId, persistenceId);
  await ensureInitialPlayerInventory(db, userId, persistenceId);
  await ensureInitialPlayerAbilitiesForUser(db, userId, persistenceId);
  await ensureInitialPlayerSettingsForUser(db, userId, persistenceId);
}

/**
 * Ensures all initial player data exists for ALL worlds in the database.
 * Called during account creation to pre-populate data for all servers.
 * 
 * @param {*} db - Prisma transaction or client
 * @param {number} userId - The user ID
 */
async function ensureInitialPlayerDataForAllWorlds(db, userId) {
  const persistenceIds = await getAllPersistenceIds(db);
  
  if (persistenceIds.length === 0) {
    console.warn('[ensureInitialPlayerDataForAllWorlds] No worlds found in database');
    return;
  }
  
  for (const persistenceId of persistenceIds) {
    await ensureInitialPlayerDataForWorld(db, userId, persistenceId);
  }
  
  console.log(`[ensureInitialPlayerDataForAllWorlds] Initialized player data for user ${userId} across ${persistenceIds.length} world(s)`);
}

function normalizeTags(input) {
  // Accept: "development,pvp" | ["development", "pvp"] | null
  const raw = Array.isArray(input)
    ? input.map(v => String(v))
    : (input !== undefined && input !== null ? String(input).split(',') : []);

  const cleaned = raw
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // de-dupe while preserving order
  const out = [];
  const seen = new Set();
  for (const t of cleaned) {
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }

  return out.join(',');
}

/**
 * Check if a world's heartbeat is stale (older than the threshold).
 * 
 * @param lastHeartbeat - The last heartbeat timestamp (Date or null)
 * @param thresholdSeconds - Maximum age in seconds before heartbeat is considered stale (default: 30)
 * @returns true if heartbeat is stale or missing, false if fresh
 */
function isHeartbeatStale(lastHeartbeat, thresholdSeconds = 30) {
  if (!lastHeartbeat) return true;
  const now = Date.now();
  const heartbeatTime = new Date(lastHeartbeat).getTime();
  const thresholdMs = thresholdSeconds * 1000;
  return (now - heartbeatTime) > thresholdMs;
}

// GET /api/worlds - list worlds (filtered by environment) with player counts
app.get('/api/worlds', requireWebServerSecret, async (req, res) => {
  try {
    const includeDevelopment = NODE_ENV !== 'production';
    const includeInactive = req.query.includeInactive === 'true';

    const where = {
      ...(includeInactive ? {} : { isActive: true }),
      ...(includeDevelopment ? {} : {
        AND: [
          { isDevelopment: false },
          { NOT: { tags: { contains: 'development' } } }
        ]
      })
    };

    const [worlds, groupedCounts] = await Promise.all([
      prisma.world.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { serverId: 'asc' }
        ],
        select: {
          serverId: true,
          name: true,
          locationName: true,
          flagCode: true,
          serverUrl: true,
          isActive: true,
          isDevelopment: true,
          tags: true,
          sortOrder: true,
          lastHeartbeat: true
        }
      }),
      (async () => {
        try {
          return await prisma.onlineUser.groupBy({
            by: ['serverId'],
            _count: { _all: true }
          });
        } catch (err) {
          // If groupBy isn't supported for some reason, gracefully fall back to empty counts.
          console.warn('[worlds] Failed to group online users by serverId:', err?.message || err);
          return [];
        }
      })()
    ]);

    // Filter out online user counts from servers with stale heartbeats
    // This prevents counting players from crashed/offline servers
    const validServerIds = new Set(
      worlds
        .filter(w => !isHeartbeatStale(w.lastHeartbeat, WORLD_HEARTBEAT_TIMEOUT_SEC))
        .map(w => w.serverId)
    );

    const filteredCounts = groupedCounts.filter(g => validServerIds.has(g.serverId));
    const countByServerId = new Map(filteredCounts.map(g => [g.serverId, g._count?._all || 0]));

    const now = Date.now();
    const timeoutMs = Math.max(0, WORLD_HEARTBEAT_TIMEOUT_SEC) * 1000;

    const payload = worlds.map(w => {
      const last = w.lastHeartbeat ? new Date(w.lastHeartbeat).getTime() : null;
      // Server is marked as offline if heartbeat is null or has timed out.
      const isOnline = last !== null && ((now - last) <= timeoutMs);

      // Only count players if heartbeat is fresh (not stale)
      const playerCount = isHeartbeatStale(w.lastHeartbeat, WORLD_HEARTBEAT_TIMEOUT_SEC)
        ? 0
        : (countByServerId.get(w.serverId) || 0);

      return {
        serverId: w.serverId,
        name: w.name,
        locationName: w.locationName,
        flagCode: w.flagCode,
        serverUrl: w.serverUrl,
        isActive: w.isActive,
        isDevelopment: w.isDevelopment,
        tags: (w.tags || '').split(',').map(s => s.trim()).filter(Boolean),
        sortOrder: w.sortOrder,
        lastHeartbeat: w.lastHeartbeat,
        isOnline,
        playerCount
      };
    });

    return res.json({ worlds: payload });
  } catch (error) {
    // Helpful DX when migrations haven't been run yet.
    if (error?.code === 'P2021') {
      return res.status(503).json({ error: 'Worlds table is not initialized. Run: npm run prisma:migrate' });
    }
    console.error('Get worlds error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/worlds/:serverId - fetch a single world (env-filtered)
app.get('/api/worlds/:serverId', requireWebServerSecret, async (req, res) => {
  try {
    const serverId = parseServerId(req.params.serverId);
    if (!serverId) return res.status(400).json({ error: 'Invalid serverId' });

    const includeDevelopment = NODE_ENV !== 'production';
    const world = await prisma.world.findFirst({
      where: {
        serverId,
        ...(includeDevelopment ? {} : {
          AND: [
            { isDevelopment: false },
            { NOT: { tags: { contains: 'development' } } }
          ]
        })
      },
      select: {
        serverId: true,
        name: true,
        locationName: true,
        flagCode: true,
        serverUrl: true,
        isActive: true,
        isDevelopment: true,
        tags: true,
        sortOrder: true,
        lastHeartbeat: true
      }
    });

    if (!world) return res.status(404).json({ error: 'World not found' });

    return res.json({
      world: {
        ...world,
        tags: (world.tags || '').split(',').map(s => s.trim()).filter(Boolean)
      }
    });
  } catch (error) {
    if (error?.code === 'P2021') {
      return res.status(503).json({ error: 'Worlds table is not initialized. Run: npm run prisma:migrate' });
    }
    console.error('Get world error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/worlds/register - upsert a world (trusted callers: game servers / ops tooling)
// Body:
// {
//   "secret": "...",
//   "serverId": 1,
//   "name": "World 1",
//   "locationName": "USA",
//   "flagCode": "USA",
//   "serverUrl": "https://server1.openspell.com:8888",
//   "isActive": true,
//   "isDevelopment": false,
//   "sortOrder": 1
// }
app.post('/api/worlds/register', requireWorldRegistrationSecret, async (req, res) => {
  try {
    const serverId = parseServerId(req.body?.serverId);
    const name = req.body?.name ? String(req.body.name) : null;
    const locationName = req.body?.locationName ? String(req.body.locationName) : 'Unknown';
    const flagCode = req.body?.flagCode ? String(req.body.flagCode) : 'USA';
    const serverUrl = req.body?.serverUrl ? String(req.body.serverUrl) : null;
    const persistenceId = req.body?.persistenceId !== undefined && req.body?.persistenceId !== null
      ? Number(req.body.persistenceId)
      : null;

    if (!serverId) return res.status(400).json({ error: 'serverId is required (positive integer)' });
    if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
    if (!serverUrl || !serverUrl.trim()) return res.status(400).json({ error: 'serverUrl is required' });

    const isActive = req.body?.isActive === undefined ? true : !!req.body.isActive;
    const isDevelopment = req.body?.isDevelopment === undefined ? false : !!req.body.isDevelopment;
    const sortOrder = Number.isFinite(Number(req.body?.sortOrder)) ? Number(req.body.sortOrder) : 0;
    let tags = normalizeTags(req.body?.tags);
    if (isDevelopment && !tags.includes('development')) {
      tags = normalizeTags(tags ? `${tags},development` : 'development');
    }

    if (persistenceId !== null && (!Number.isFinite(persistenceId) || !Number.isInteger(persistenceId) || persistenceId <= 0)) {
      return res.status(400).json({ error: 'persistenceId must be a positive integer' });
    }

    const world = await prisma.world.upsert({
      where: { serverId },
      update: {
        name: name.trim(),
        locationName: locationName.trim(),
        flagCode: flagCode.trim(),
        serverUrl: serverUrl.trim(),
        isActive,
        isDevelopment,
        tags,
        sortOrder,
        lastHeartbeat: new Date(),
        ...(Number.isInteger(persistenceId) ? { persistenceId } : {})
      },
      create: {
        serverId,
        name: name.trim(),
        locationName: locationName.trim(),
        flagCode: flagCode.trim(),
        serverUrl: serverUrl.trim(),
        isActive,
        isDevelopment,
        tags,
        sortOrder,
        lastHeartbeat: new Date(),
        ...(Number.isInteger(persistenceId) ? { persistenceId } : {})
      },
      select: {
        serverId: true,
        name: true,
        locationName: true,
        flagCode: true,
        serverUrl: true,
        isActive: true,
        isDevelopment: true,
        tags: true,
        sortOrder: true,
        lastHeartbeat: true,
        persistenceId: true
      }
    });

    return res.json({ success: true, world });
  } catch (error) {
    if (error?.code === 'P2021') {
      return res.status(503).json({ error: 'Worlds table is not initialized. Run: npm run prisma:migrate' });
    }
    console.error('Register world error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/worlds/heartbeat - update lastHeartbeat only (trusted callers)
// Body: { "gameServerSecret": "...", "serverId": 1 }
app.post('/api/worlds/heartbeat', requireGameServerSecret, async (req, res) => {
  try {
    const serverId = parseServerId(req.body?.serverId);
    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required (positive integer)' });
    }

    const world = await prisma.world.update({
      where: { serverId },
      data: { lastHeartbeat: new Date() },
      select: { serverId: true, lastHeartbeat: true }
    });

    return res.json({ success: true, world });
  } catch (error) {
    if (error?.code === 'P2021') {
      return res.status(503).json({ error: 'Worlds table is not initialized. Run: npm run prisma:migrate' });
    }
    console.error('World heartbeat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== GAME LOGIN TOKENS (PUBLIC) ====================

// POST /getLoginToken
// Public endpoint used by the game client to obtain a short-lived token for websocket login.
// Body: { username, password, serverId, currentClientVersion }


app.post('/getLoginToken', getLoginLimiter, async (req, res) => {
  const sendGameError = (code, msg, httpStatus = 200) => {
    // For game clients, we typically keep HTTP 200 and communicate failure via {code,msg}.
    // This matches the expected client shape and avoids CORS/fetch error-path divergence.
    return res.status(httpStatus).json({ code, msg });
  };

  try {
    const username = req.body?.username ? String(req.body.username) : '';
    const password = req.body?.password ? String(req.body.password) : '';
    const serverId = Number(req.body?.serverId);
    const currentClientVersion = Number(req.body?.currentClientVersion);

    if (!username || !password) {
      return sendGameError(-400, 'Username and password are required');
    }

    if (!Number.isInteger(serverId) || serverId <= 0) {
      return sendGameError(-401, 'Invalid serverId');
    }

    if (!Number.isInteger(currentClientVersion) || currentClientVersion <= 0) {
      return sendGameError(-402, 'Invalid currentClientVersion');
    }

    // Validate server/world exists and is allowed in this environment.
    const includeDevelopment = NODE_ENV !== 'production';
    const world = await prisma.world.findFirst({
      where: {
        serverId,
        isActive: true,
        ...(includeDevelopment ? {} : {
          AND: [
            { isDevelopment: false },
            { NOT: { tags: { contains: 'development' } } }
          ]
        })
      },
      select: { serverId: true, persistenceId: true }
    });

    if (!world) {
      return sendGameError(-303, 'World not found');
    }

    // Validate client version against assetsClient.json (source of truth)
    const latest = await getLatestClientVersionFromAssetsClient();
    if (latest && currentClientVersion !== latest) {
      return sendGameError(-304, `Client out of date (current=${currentClientVersion}, latest=${latest})`);
    }

    // Convert username to lowercase (client requirement)
    const lowercaseUsername = username.toLowerCase().trim();

    // Authenticate user
    const user = await prisma.user.findUnique({ where: { username: lowercaseUsername } });
    if (!user) {
      // Client expects this exact shape/codes.
      return sendGameError(-301, 'Username not found');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      // Client expects this exact shape/codes.
      return sendGameError(-302, 'Password incorrect');
    }

    // Prevent duplicate login attempts across all game servers.
    // We must enforce this before issuing a login token so the client
    // does not proceed to open a socket only to fail later.
    const existingOnlineUser = await prisma.onlineUser.findUnique({
      where: { userId: user.id },
      select: { id: true, serverId: true }
    });
    if (existingOnlineUser) {
      const onlineWorld = await prisma.world.findUnique({
        where: { serverId: existingOnlineUser.serverId },
        select: { lastHeartbeat: true }
      });
      const isStalePresence = isHeartbeatStale(
        onlineWorld?.lastHeartbeat ?? null,
        WORLD_HEARTBEAT_TIMEOUT_SEC
      );

      if (isStalePresence) {
        await prisma.onlineUser.delete({ where: { id: existingOnlineUser.id } });
      } else {
        return sendGameError(
          -303,
          'Your account is currently logged in, please try again in about a minute'
        );
      }
    }

    // Lazy initialization: Ensure player has data for this world's persistenceId
    // This handles the case where a new world is created after the user registered,
    // or if a player is logging into a world for the first time.
    const worldPersistenceId = world.persistenceId;
    if (Number.isInteger(worldPersistenceId) && worldPersistenceId > 0) {
      // Check if player has a valid location for this persistenceId
      // We use location because:
      // 1. It's guaranteed to exist for initialized players (spawn at 78, -93)
      // 2. 0,0 is inaccessible in-game, so it indicates uninitialized state
      // 3. Empty inventory/equipment are valid game states, so we can't use those
      const playerLocation = await prisma.playerLocation.findUnique({
        where: { 
          userId_persistenceId: { 
            userId: user.id, 
            persistenceId: worldPersistenceId 
          } 
        },
        select: { x: true, y: true }
      });

      const needsInitialization = !playerLocation || (playerLocation.x === 0 && playerLocation.y === 0);

      if (needsInitialization) {
        console.log(`[getLoginToken] Initializing data for user ${user.id} on world persistenceId=${worldPersistenceId}`);
        await ensureInitialPlayerDataForWorld(prisma, user.id, worldPersistenceId);
      }
    }

    // Clean up old/expired tokens to keep table small.
    await prisma.gameLoginToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { usedAt: { not: null } }
        ]
      }
    });

    // Ensure only one active token per user (optional but reduces confusion).
    await prisma.gameLoginToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null
      }
    });

    const ttl = Math.max(5, Math.min(60 * 10, GAME_LOGIN_TOKEN_TTL_SEC)); // clamp 5s..10m
    const token = crypto.randomBytes(32).toString('hex'); // 64 hex chars
    const expiresAt = new Date(Date.now() + ttl * 1000);

    await prisma.gameLoginToken.create({
      data: {
        token,
        userId: user.id,
        serverId,
        clientVersion: currentClientVersion,
        ip: req.ip ? String(req.ip) : null,
        userAgent: req.headers['user-agent'] ? String(req.headers['user-agent']) : null,
        expiresAt
      }
    });

    return res.json({
      code: 1,
      msg: 'ok',
      data: { token }
    });
  } catch (error) {
    // Helpful DX when migrations haven't been run yet.
    if (error?.code === 'P2021') {
      return sendGameError(-500, 'Database not migrated');
    }
    console.error('getLoginToken error:', error);
    return sendGameError(-999, 'Internal server error');
  }
});

// POST /api/game/consumeLoginToken
// Used by the game server to validate and consume a login token (optional but completes the flow).
// Body: { token, serverId }
app.post('/api/game/consumeLoginToken', requireGameServerSecret, async (req, res) => {
  try {
    const token = req.body?.token ? String(req.body.token) : '';
    const serverId = Number(req.body?.serverId);

    if (!token || token.length < 32) {
      return res.status(400).json({ error: 'token is required' });
    }
    if (!Number.isInteger(serverId) || serverId <= 0) {
      return res.status(400).json({ error: 'serverId is required (positive integer)' });
    }

    const row = await prisma.gameLoginToken.findUnique({
      where: { token },
      include: {
        user: { select: { id: true, username: true, displayName: true } }
      }
    });

    if (!row) return res.status(404).json({ error: 'Token not found' });
    if (row.serverId !== serverId) return res.status(401).json({ error: 'Token server mismatch' });
    if (row.usedAt) return res.status(401).json({ error: 'Token already used' });
    if (new Date() > row.expiresAt) return res.status(401).json({ error: 'Token expired' });

    await prisma.gameLoginToken.update({
      where: { token },
      data: { usedAt: new Date() }
    });

    return res.json({
      success: true,
      user: row.user,
      serverId: row.serverId,
      clientVersion: row.clientVersion
    });
  } catch (error) {
    if (error?.code === 'P2021') {
      return res.status(503).json({ error: 'Database not migrated. Run: npm run prisma:migrate' });
    }
    console.error('consumeLoginToken error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== NEWS ====================

// Get all news items
app.get('/api/news', requireWebServerSecret, async (req, res) => {
  try {
    const { limit, offset, year, month } = req.query;
    
    let where = {};
    
    if (year) {
      const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, 1);
      const endDate = new Date(parseInt(year), month ? parseInt(month) : 12, 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    const news = await prisma.news.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined
    });
    
    res.json({ items: news });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single news item by slug
app.get('/api/news/:slug', requireWebServerSecret, async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { slug: req.params.slug }
    });
    
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create news item (requires authentication)
app.post('/api/news', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const { title, slug, type, date, description, picture, thumbnail, content } = req.body;
    
    if (!title || !slug || !description || !content) {
      return res.status(400).json({ error: 'Title, slug, description, and content are required' });
    }
    
    const news = await prisma.news.create({
      data: {
        title,
        slug,
        type: type || 'Game',
        date: date ? new Date(date) : new Date(),
        description,
        picture,
        thumbnail,
        content
      }
    });
    
    res.json(news);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update news item (requires authentication)
app.put('/api/news/:slug', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    const { title, type, date, description, picture, thumbnail, content } = req.body;
    
    const news = await prisma.news.update({
      where: { slug: req.params.slug },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(description && { description }),
        ...(picture !== undefined && { picture }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(content && { content })
      }
    });
    
    res.json(news);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete news item (requires authentication)
app.delete('/api/news/:slug', requireWebServerSecret, verifyToken, async (req, res) => {
  try {
    await prisma.news.delete({
      where: { slug: req.params.slug }
    });
    
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'News not found' });
    }
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== HISCORES ====================

// Get all skills
app.get('/api/hiscores/skills', requireWebServerSecret, async (req, res) => {
  try {
    // Skills are essentially static. Let callers cache.
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes

    const skills = await prisma.skill.findMany({
      orderBy: {
        displayOrder: 'asc'
      },
      select: {
        id: true,
        slug: true,
        title: true,
        iconPosition: true,
        displayOrder: true
      }
    });
    
    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get hiscores for a specific skill
app.get('/api/hiscores/:skill', requireWebServerSecret, async (req, res) => {
  try {
    const { skill: skillSlug } = req.params;
    const limit = parseInt(req.query.limit) || 25;
    const offset = parseInt(req.query.offset) || 0;
    const minLevel = Number.isFinite(Number(req.query.minLevel)) ? Number(req.query.minLevel) : null;
    const excludeUsername = typeof req.query.excludeUsername === 'string' ? req.query.excludeUsername.trim() : '';
    const serverId = parseServerId(req.query.serverId);
    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required' });
    }
    const persistenceId = await resolvePersistenceId(prisma, {
      persistenceId: req.query.persistenceId,
      serverId
    });
    
    // Find the skill
    const skill = await prisma.skill.findUnique({
      where: { slug: skillSlug }
    });
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // IMPORTANT: this endpoint must be light. It should NOT scan all users to compute ranks.
    // We rely on ordering (rank or experience) + pagination. Rank numbers returned are either
    // the stored rank (preferred) or offset-based (fallback).

    const where = {
      skillId: skill.id,
      persistenceId,
      experience: { gt: 0 } // only ranked entries
    };

    // Optional query-time filters used by the web hiscores page.
    // This keeps pagination/counting correct while avoiding DB data mutation.
    if (minLevel !== null) {
      where.level = { gt: minLevel };
    }
    // Exclude permanently banned users from hiscores.
    // Permanent ban = has banReason and no bannedUntil.
    const userFilters = [
      {
        NOT: {
          AND: [
            { banReason: { not: null } },
            { bannedUntil: null }
          ]
        }
      }
    ];
    if (excludeUsername) {
      userFilters.push({
        username: {
          not: excludeUsername,
          mode: 'insensitive'
        }
      });
    }
    where.user = { AND: userFilters };

    const [total, playerSkills] = await Promise.all([
      prisma.playerSkill.count({ where }),
      prisma.playerSkill.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true
            }
          }
        },
        orderBy: [
          { rank: 'asc' }, // fast if ranks are precomputed; otherwise may be null for all
          { experience: 'desc' },
          { userId: 'asc' }
        ],
        skip: offset,
        take: limit
      })
    ]);

    const players = playerSkills.map((ps, index) => ({
      rank: ps.rank ?? (offset + index + 1),
      userId: ps.userId,
      username: ps.user.username || 'Unknown',
      displayName: ps.user.displayName || ps.user.username || 'Unknown',
      level: ps.level,
      experience: ps.experience.toString()
    }));
    
    res.json({
      items: players,
      total,
      page: Math.floor(offset / limit) + 1,
      limit
    });
  } catch (error) {
    console.error('Get hiscores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player stats (all skills for a specific player)
app.get('/api/hiscores/player/:displayName', requireWebServerSecret, async (req, res) => {
  try {
    const { displayName } = req.params;
    const serverId = parseServerId(req.query.serverId);
    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required' });
    }
    const persistenceId = await resolvePersistenceId(prisma, {
      persistenceId: req.query.persistenceId,
      serverId
    });
    
    // Find user by displayName or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { displayName: displayName },
          { username: displayName }
        ],
        NOT: {
          AND: [
            { banReason: { not: null } },
            { bannedUntil: null }
          ]
        }
      },
      select: {
        id: true,
        username: true,
        displayName: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Keep player lookup consistent with overall hiscores visibility:
    // only return profiles for users with total level 27+.
    const overallSkillId = await getSkillIdBySlug('overall');
    if (!overallSkillId) {
      return res.status(500).json({ error: 'Overall skill is not seeded' });
    }
    const overallEntry = await prisma.playerSkill.findFirst({
      where: {
        userId: user.id,
        persistenceId,
        skillId: overallSkillId,
        level: { gt: 26 }
      },
      select: { id: true }
    });
    if (!overallEntry) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // IMPORTANT: this endpoint should also be light.
    // It should NOT scan all users (groupBy) and should NOT do one COUNT query per skill.
    // We return the stored rank values from player_skills (which are refreshed on stat update/logout).

    const [allSkills, playerSkills] = await Promise.all([
      prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } }),
      prisma.playerSkill.findMany({
        where: { userId: user.id, persistenceId },
        include: {
          skill: { select: { id: true, slug: true } }
        }
      })
    ]);

    const bySlug = new Map(playerSkills.map(ps => [ps.skill.slug, ps]));

    const stats = allSkills.map((skill) => {
      const ps = bySlug.get(skill.slug);
      if (!ps) {
        return { skill: skill.slug, rank: null, level: null, experience: null };
      }
      return {
        skill: skill.slug,
        rank: ps.rank ?? null,
        level: ps.level,
        experience: ps.experience.toString()
      };
    });
    
    res.json({
      player: {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username
      },
      stats
    });
  } catch (error) {
    console.error('Get player stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Game server / trusted caller: upsert skill stats on logout and refresh ranks.
// Body:
// {
//   "secret": "...",
//   "userId": 123,
//   "skills": [{ "slug": "magic", "level": 42, "experience": "57805" }, ...]
// }
// Recompute "overall" skill and recalculate ranks for changed players
// Game server already saves skills directly to DB, so this just handles:
// 1. Recomputing "overall" skill for specified users
// 2. Recalculating ranks for all skills
app.post('/api/hiscores/recompute', requireHiscoresUpdateSecret, async (req, res) => {
  try {
    const { userIds, persistenceId: requestPersistenceId, serverId } = req.body || {};
    const persistenceId = await resolvePersistenceId(prisma, {
      persistenceId: requestPersistenceId,
      serverId
    });
    
    const overallSkillId = await getSkillIdBySlug('overall');
    if (!overallSkillId) {
      return res.status(500).json({ error: 'Overall skill is not seeded' });
    }

    // Phase 1: Recompute "overall" for each user who changed skills (cheap)
    if (Array.isArray(userIds) && userIds.length > 0) {
      for (const userId of userIds) {
        await recomputeOverallForUser(prisma, userId, overallSkillId, persistenceId);
      }
    }

    // Phase 2: Recalculate ranks for all skills (expensive, but only once)
    const allSkills = await prisma.skill.findMany({
      select: { id: true, slug: true }
    });

    for (const skill of allSkills) {
      await recomputeRanksForSkill(skill.id, persistenceId, overallSkillId);
    }

    res.json({ 
      success: true, 
      overallRecomputed: userIds?.length ?? 0,
      skillsRanked: allSkills.length 
    });
  } catch (error) {
    console.error('Hiscores recompute error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy endpoint: Update skills AND recalculate ranks (expensive)
// Kept for backward compatibility, but prefer bulk-update-skills + recalculate-ranks
app.post('/api/hiscores/update', requireHiscoresUpdateSecret, async (req, res) => {
  try {
    const { userId, skills, persistenceId: requestPersistenceId, serverId } = req.body || {};
    if (!userId || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'userId and skills[] are required' });
    }
    const persistenceId = await resolvePersistenceId(prisma, {
      persistenceId: requestPersistenceId,
      serverId
    });

    const overallSkillId = await getSkillIdBySlug('overall');
    if (!overallSkillId) {
      return res.status(500).json({ error: 'Overall skill is not seeded' });
    }

    const slugs = skills.map(s => s?.slug).filter(Boolean);
    const dbSkills = await prisma.skill.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true }
    });
    const slugToId = new Map(dbSkills.map(s => [s.slug, s.id]));

    // Validate all slugs exist
    const unknown = slugs.filter(slug => !slugToId.has(slug) && slug !== 'overall');
    if (unknown.length) {
      return res.status(400).json({ error: `Unknown skill(s): ${unknown.join(', ')}` });
    }

    // Upsert skill stats for the user (exclude 'overall' from direct writes; we recompute it)
    const upserts = [];
    const touchedSkillIds = new Set();
    for (const s of skills) {
      if (!s || !s.slug || s.slug === 'overall') continue;
      const skillId = slugToId.get(s.slug);
      if (!skillId) continue;

      const level = Number.isInteger(s.level) ? s.level : parseInt(String(s.level), 10);
      const exp = typeof s.experience === 'bigint'
        ? s.experience
        : BigInt(String(s.experience ?? '0'));

      upserts.push(
        prisma.playerSkill.upsert({
          where: { userId_persistenceId_skillId: { userId, persistenceId, skillId } },
          update: { level: Number.isFinite(level) ? level : 1, experience: exp },
          create: { userId, persistenceId, skillId, level: Number.isFinite(level) ? level : 1, experience: exp }
        })
      );
      touchedSkillIds.add(skillId);
    }

    await prisma.$transaction(upserts);

    // Recompute overall for the user and refresh ranks for touched skills + overall.
    await recomputeOverallForUser(prisma, userId, overallSkillId, persistenceId);
    touchedSkillIds.add(overallSkillId);

    // Refresh ranks (window-function update)
    for (const skillId of touchedSkillIds) {
      await recomputeRanksForSkill(skillId, persistenceId, overallSkillId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Hiscores update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Optional: keep DB news in sync with apps/web/news.json for local/dev convenience.
    if (NEWS_FILE_SYNC_ENABLED) {
      if (process.env.NODE_ENV !== 'production') console.log(`[news-sync] Enabled (debounce=${NEWS_FILE_SYNC_DEBOUNCE_MS}ms)`);
      await syncNewsFromFileToDb();
      setupNewsFileWatcher();
    }
    
    // Clean up expired sessions on startup
    await cleanupExpiredSessions();
    
    // Set up periodic cleanup of expired sessions (every hour)
    setInterval(async () => {
      await cleanupExpiredSessions();
      if (process.env.NODE_ENV !== 'production') console.log('Sessions cleaned up successfully');
    }, 360 * 60 * 1000); // 6 hours
    
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

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`FATAL: Port ${PORT} is already in use.`);
        console.error('If you already have the API running, stop it first or set a different PORT.');
        process.exit(1);
      }
      console.error('Server error:', err);
      process.exit(1);
    });

    server.listen(PORT, () => {
      const proto = USE_HTTPS ? 'https' : 'http';
      console.log(`OpenSpell API Server running on ${proto}://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Session cleanup: Running every 6 hours');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

startServer();

