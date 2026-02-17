# OpenSpell Environment Variables Reference

This document provides a comprehensive reference for all environment variables used across the OpenSpell project.

## 📁 File Structure

```
OpenSpell/
├── .env (ROOT - ALL SECRETS)
├── apps/
│   ├── shared-assets/base/
│   │   └── shared.env (Shared configuration, URLs, asset paths)
│   ├── api/.env (Optional - legacy/override only)
│   ├── web/.env (Optional - legacy/override only)
│   ├── game/.env (Optional - legacy/override only)
│   └── chat/.env (Chat server specific)
```

## 🎯 Setup Script

Run `./setup-env.ps1` to automatically create/update all environment files with sensible defaults.

The script:
- ✅ Creates root `.env` with all secrets
- ✅ Creates `apps/shared-assets/base/shared.env` with shared configuration
- ✅ Generates cryptographically secure random secrets
- ✅ Never overwrites existing values (safe to run multiple times)
- ✅ Ensures HTTPS certificates are generated
- ✅ Adds missing variables without removing existing ones

## 📦 Variable Categories

### 1. Database & Core (Root `.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://openspell:openspell@localhost:5432/openspell?schema=public` | PostgreSQL connection string |
| `NODE_ENV` | `development` | Environment mode (development/production) |

### 2. Shared Secrets (Root `.env`)

**⚠️ CRITICAL: These MUST match across services**

| Variable | Generated | Used By | Description |
|----------|-----------|---------|-------------|
| `API_WEB_SECRET` | Random | Web ↔ API | Authenticates web server to API server |
| `GAME_SERVER_SECRET` | Random | Game ↔ API | Authenticates game server to API server |

### 3. API Server Configuration (Root `.env`)

#### Ports & Auth
| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `3002` | API server port |
| `API_JWT_SECRET` | Random | JWT signing secret |
| `API_SESSION_SECRET` | Random | Session encryption secret |
| `WORLD_REGISTRATION_SECRET` | Random | World server registration secret |
| `HISCORES_UPDATE_SECRET` | Random | Hiscores update API secret |

#### Features
| Variable | Default | Description |
|----------|---------|-------------|
| `USE_HTTPS` | `true` | Enable HTTPS |
| `CORS_ALLOWED_ORIGINS` | `` | Comma-separated list of allowed CORS origins |
| `NEWS_FILE_SYNC_ENABLED` | `false` | Enable news.json file sync between API and web |
| `NEWS_FILE_SYNC_PATH` | `` | Path to news.json file for syncing |
| `NEWS_FILE_SYNC_DEBOUNCE_MS` | `250` | Debounce delay for file sync (ms) |

### 4. Web Server Configuration (Root `.env`)

#### Ports & Auth
| Variable | Default | Description |
|----------|---------|-------------|
| `WEB_PORT` | `8887` | Web server port |
| `WEB_SESSION_SECRET` | Random | Session encryption secret |

#### Features
| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOW_INSECURE_HTTPS` | `false` | Allow self-signed HTTPS certificates |
| `SHOW_DISCORD_LINK` | `false` | Show Discord link in UI |
| `DISCORD_LINK` | `` | Discord invite URL |
| `API_REQUEST_TIMEOUT_MS` | `30000` | API request timeout in milliseconds. Increase if registration/login times out (bcrypt hashing can take 5-10 seconds) |

### 5. Game Server Configuration (Root `.env`)

#### Ports & Auth
| Variable | Default | Description |
|----------|---------|-------------|
| `GAME_PORT` | `8888` | Game server WebSocket port |
| `GAME_JWT_SECRET` | Random | JWT signing secret for game tokens |

#### Game Mechanics
| Variable | Default | Description |
|----------|---------|-------------|
| `TICK_MS` | `600` | Game tick interval in milliseconds |
| `SERVER_ID` | `1` | Unique server ID (for multi-server setups) |
| `DISABLE_STAMINA` | `false` | Disable stamina system (for testing) |

#### Packet Logging (Game Server)
| Variable | Default | Description |
|----------|---------|-------------|
| `PACKET_LOG_INVALID_ENABLED` | `true` | Enable invalid packet logging to Postgres |
| `PACKET_LOG_INVALID_BATCH_SIZE` | `200` | Max invalid packet batch size before flush |
| `PACKET_LOG_INVALID_FLUSH_MS` | `2000` | Flush interval for invalid packet batches (ms) |
| `PACKET_LOG_INVALID_DEDUP_WINDOW_MS` | `60000` | Deduplicate invalid packets within this window |
| `PACKET_LOG_INVALID_SAMPLE_RATE` | `1.0` | Sampling rate for invalid packets (0-1) |
| `PACKET_TRACE_ENABLED` | `true` | Enable per-packet trace logging to disk |
| `PACKET_TRACE_PATH` | `logs/packets` | Directory for packet trace SQLite files |
| `PACKET_TRACE_ROTATE_MB` | `50` | Rotate trace files after this size (MB) |
| `PACKET_TRACE_ROTATE_MINUTES` | `30` | Legacy time-based rotation (ignored for SQLite traces) |
| `PACKET_TRACE_FLUSH_MS` | `1000` | Flush interval for trace metadata (ms) |
| `PACKET_TRACE_RETENTION_DAYS` | `30` | Retention period for trace files (days) |
| `PACKET_TRACE_SAMPLE_RATE` | `1.0` | Sampling rate for trace packets (0-1) |

#### Item & Shop Tracking (Game Server)
| Variable | Default | Description |
|----------|---------|-------------|
| `ITEM_EVENT_LOG_ENABLED` | `true` | Enable item drop/pickup logging |
| `ITEM_EVENT_BATCH_SIZE` | `200` | Max item event batch size before flush |
| `ITEM_EVENT_FLUSH_MS` | `2000` | Flush interval for item event batches (ms) |
| `ITEM_EVENT_RETENTION_DAYS` | `90` | Retention period for item logs (days) |
| `SHOP_SALE_LOG_ENABLED` | `true` | Track player-sold shop items and buyers |
| `TRADE_EVENT_LOG_ENABLED` | `true` | Track completed trade item transfers (from/to/item/amount) |

#### Anti-Cheat (Game Server)
| Variable | Default | Description |
|----------|---------|-------------|
| `ANTI_CHEAT_REALTIME_ENABLED` | `true` | Enable realtime anti-cheat rules |
| `ANTI_CHEAT_ACTION_MIN_INTERVAL_MS` | `50` | Minimum ms between actions before flag |
| `ANTI_CHEAT_MAX_ACTIONS_PER_TICK` | `6` | Max actions per tick before flag |
| `ANTI_CHEAT_INVALID_WINDOW_MS` | `60000` | Window for invalid packet counting |
| `ANTI_CHEAT_INVALID_MAX` | `3` | Max invalid packets before flag |
| `ANTI_CHEAT_TRADE_WINDOW_MS` | `120000` | Window for trade cycle detection |
| `ANTI_CHEAT_TRADE_MAX` | `6` | Trades per window before flag |
| `ANTI_CHEAT_MULING_AMOUNT_THRESHOLD` | `2500` | Muling transfer amount threshold |
| `ANTI_CHEAT_WEALTH_TRANSFER_WINDOW_MS` | `10000` | Realtime wealth transfer window (ms) |
| `ANTI_CHEAT_WEALTH_TRANSFER_VALUE_THRESHOLD` | `500000` | Wealth transfer value threshold |
| `ANTI_CHEAT_SHARED_IP_WINDOW_MS` | `30000` | Shared IP transfer aggregation window (ms) |
| `ANTI_CHEAT_SESSION_ALERT_START_HOURS` | `9` | Session length alert start (hours) |
| `ANTI_CHEAT_SESSION_ALERT_STEP_HOURS` | `3` | Session length alert escalation step (hours) |
| `ANTI_CHEAT_ALERT_COOLDOWN_MS` | `600000` | Suppress duplicate alerts per user/category |
| `ANTI_CHEAT_REALTIME_CLEANUP_MS` | `120000` | Cleanup interval for realtime caches |
| `ANTI_CHEAT_OVERRIDE_REFRESH_MS` | `60000` | Refresh interval for DB overrides |
| `ANTI_CHEAT_ANALYZER_ENABLED` | `true` | Enable periodic analyzer |
| `ANTI_CHEAT_ANALYZER_INTERVAL_MS` | `300000` | Analyzer interval (ms) |
| `ANTI_CHEAT_ANALYZER_DEDUPE_WINDOW_MS` | `86400000` | Dedupe window for analyzer alerts |
| `ANTI_CHEAT_PACKET_SPIKE_THRESHOLD` | `50` | Invalid packet count threshold |
| `ANTI_CHEAT_PACKET_SPIKE_CRITICAL_THRESHOLD` | `200` | Invalid packet critical threshold |
| `ANTI_CHEAT_PACKET_UNIQUE_REASONS_THRESHOLD` | `5` | Unique invalid reason threshold |
| `ANTI_CHEAT_DROP_WINDOW_MINUTES` | `60` | Drop/pickup analysis window |
| `ANTI_CHEAT_DROP_MIN_COUNT` | `20` | Minimum drops before ratio check |
| `ANTI_CHEAT_DROP_NEVER_PICKUP_RATIO` | `0.8` | Unpicked ratio threshold |
| `ANTI_CHEAT_TRADE_WINDOW_MINUTES` | `10` | Trade cycle analysis window |
| `ANTI_CHEAT_TRADE_MIN_COUNT` | `5` | Trade cycle minimum count |
| `ANTI_CHEAT_WEALTH_WINDOW_MINUTES` | `30` | Wealth spike analysis window |
| `ANTI_CHEAT_WEALTH_AMOUNT_THRESHOLD` | `1000000` | Wealth spike amount threshold |
| `ANTI_CHEAT_SHOP_WINDOW_MINUTES` | `60` | Shop analysis window |
| `ANTI_CHEAT_SHOP_MIN_COUNT` | `10` | Shop trade count threshold |
| `ANTI_CHEAT_SHOP_GOLD_THRESHOLD` | `100000` | Shop gold threshold |
| `ANTI_CHEAT_IP_SHARED_WINDOW_MINUTES` | `1440` | Shared IP analysis window |
| `ANTI_CHEAT_IP_SHARED_MIN_USERS` | `3` | Shared IP minimum user count |

#### Anti-Cheat Auto-Tuning (API)
| Variable | Default | Description |
|----------|---------|-------------|
| `ANTI_CHEAT_AUTOTUNE_ENABLED` | `true` | Enable auto-tuning thresholds from feedback |
| `ANTI_CHEAT_AUTOTUNE_WINDOW_DAYS` | `7` | Feedback lookback window |
| `ANTI_CHEAT_AUTOTUNE_SAMPLE_MIN` | `20` | Minimum feedback samples to tune |
| `ANTI_CHEAT_AUTOTUNE_RATIO_LOW` | `0.2` | Ratio to decrease sensitivity |
| `ANTI_CHEAT_AUTOTUNE_RATIO_HIGH` | `0.7` | Ratio to increase thresholds |
| `ANTI_CHEAT_AUTOTUNE_STEP_PCT` | `0.1` | Percentage step per adjustment |

### 6. SSL/TLS Configuration (Root `.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_HTTPS` | `true` | Enable HTTPS (shared by all servers) |
| `SSL_CERT_PATH` | `certs/localhost.pem` | Path to SSL certificate |
| `SSL_KEY_PATH` | `certs/localhost-key.pem` | Path to SSL private key |

### 7. Email Configuration (Root `.env`)

#### Feature Toggles
| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_ENABLED` | `false` | Master toggle for email functionality |
| `EMAIL_VERIFICATION_REQUIRED` | `false` | Require email verification for new accounts |
| `EMAIL_REQUIRED` | `false` | Require email for registration |

#### Email Validation Controls
| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_BLOCK_PLUS_ADDRESSING` | `true` | Block emails with + addressing (e.g., user+1@example.com) |
| `EMAIL_BLOCK_DISPOSABLE` | `true` | Block disposable/temporary email providers |
| `EMAIL_NORMALIZE_GMAIL_DOTS` | `true` | Normalize Gmail dots (treat john.doe@gmail.com same as johndoe@gmail.com) |

**Note**: Plus addressing is always removed from the normalized email for uniqueness checking, even if `EMAIL_BLOCK_PLUS_ADDRESSING=false`. When false, it allows users to register with plus addresses, but prevents creating multiple accounts by varying the plus part.

#### Provider Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_PROVIDER` | `mailhog` | Provider: `mailhog`, `maildev`, `smtp`, or `ses` |
| `EMAIL_FROM` | `noreply@openspell.dev` | From email address |
| `EMAIL_FROM_NAME` | `OpenSpell` | From display name |

#### SMTP Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_HOST` | `localhost` | SMTP server hostname |
| `SMTP_PORT` | `1025` | SMTP server port |
| `SMTP_SECURE` | `false` | Use TLS (true for port 465) |
| `SMTP_USER` | `` | SMTP username (if required) |
| `SMTP_PASS` | `` | SMTP password (if required) |

#### AWS SES Configuration (Production)
| Variable | Default | Description |
|----------|---------|-------------|
| `AWS_REGION` | `us-east-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | `` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | `` | AWS secret key |
| `SES_SMTP_HOST` | `` | SES SMTP endpoint (auto-generated if empty) |
| `SES_SMTP_PORT` | `587` | SES SMTP port |

#### Web UI Email Features
| Variable | Default | Description |
|----------|---------|-------------|
| `SHOW_EMAIL_FIELD` | `true` | Show email field in registration form |
| `SHOW_EMAIL_VERIFICATION_STATUS` | `true` | Show verification status on account page |
| `SHOW_RESEND_VERIFICATION` | `true` | Show "Resend verification email" option |
| `SHOW_FORGOT_PASSWORD` | `true` | Show "Forgot password" link on login page |

### 9. Anti-Cheat Notifications (API)
| Variable | Default | Description |
|----------|---------|-------------|
| `ANTI_CHEAT_DISCORD_WEBHOOK_URL` | `` | Discord webhook URL for critical alerts |
| `ANTI_CHEAT_ALERT_EMAILS` | `` | Comma-separated admin emails for alerts |
| `ANTI_CHEAT_NOTIFICATION_INTERVAL_MS` | `120000` | Notification scan interval (ms) |

### 8. Registration Validation Rules (`shared.env`)

#### Username Validation
| Variable | Default | Description |
|----------|---------|-------------|
| `USERNAME_MIN_LENGTH` | `2` | Minimum username length |
| `USERNAME_MAX_LENGTH` | `16` | Maximum username length |
| `USERNAME_ALLOW_SPACES` | `true` | Allow spaces in usernames |

#### Password Validation
| Variable | Default | Description |
|----------|---------|-------------|
| `PASSWORD_MIN_LENGTH` | `8` | Minimum password length |
| `PASSWORD_MAX_LENGTH` | `64` | Maximum password length |
| `PASSWORD_REQUIRE_UPPERCASE` | `false` | Require at least one uppercase letter |
| `PASSWORD_REQUIRE_LOWERCASE` | `false` | Require at least one lowercase letter |
| `PASSWORD_REQUIRE_NUMBERS` | `false` | Require at least one number |
| `PASSWORD_REQUIRE_SPECIAL_CHARS` | `false` | Require at least one special character |

#### Display Name Validation
| Variable | Default | Description |
|----------|---------|-------------|
| `DISPLAYNAME_MIN_LENGTH` | `2` | Minimum display name length |
| `DISPLAYNAME_MAX_LENGTH` | `25` | Maximum display name length |
| `DISPLAYNAME_ALLOW_SPACES` | `true` | Allow spaces in display names |

**Note**: These rules are enforced both client-side (via dynamic JavaScript validation) and server-side. Any attempt to bypass client-side validation is logged as suspicious activity with the user's IP address.

### 9. reCAPTCHA Configuration (`shared.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `RECAPTCHA_ENABLED` | `false` | Enable/disable reCAPTCHA on login and registration forms |
| `RECAPTCHA_SITE_KEY` | `` | reCAPTCHA Site Key (public key, visible in HTML). Get from: https://www.google.com/recaptcha/admin |
| `RECAPTCHA_SECRET_KEY` | `` | reCAPTCHA Secret Key (private key for server-side verification). **Keep secret!** |

**Note**: When `RECAPTCHA_ENABLED=true`, a reCAPTCHA widget will appear above the submit button on login and registration forms. You must provide both `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` for this to work properly.

### 10. Server URLs (`shared.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `https://localhost:3002` | API server URL (internal) |
| `WEB_URL` | `https://localhost:8887` | Web server URL (internal) |
| `CHAT_URL` | `https://localhost:8765` | Chat server URL (client) |
| `CDN_URL` | `https://localhost:8887` | CDN URL for static assets |
| `CLIENT_API_URL` | `https://localhost:3002` | API URL exposed to game client |

### 11. Asset Configuration (`shared.env`)

#### Asset Set Selection
| Variable | Default | Description |
|----------|---------|-------------|
| `ASSET_SET` | `base` | Asset set to use (base, custom, hardcore, etc.) |

#### Asset Paths
| Variable | Default | Description |
|----------|---------|-------------|
| `ASSETS_ROOT` | `` | Path to web assets (CSS, JS, images) |
| `ASSETS_CLIENT_PATH` | `` | Path to assetsClient.json manifest |
| `STATIC_ASSETS_PATH` | `` | Path to static game data (.carbon files) |

### 12. Game Data Files (`shared.env`)

#### World Data
| Variable | Default | Description |
|----------|---------|-------------|
| `WORLD_ENTITIES_FILE` | `worldentities.26.carbon` | World entities file |
| `WORLD_ENTITY_DEFS_FILE` | `worldentitydefs.13.carbon` | World entity definitions |
| `WORLD_ENTITY_ACTIONS_FILE` | `worldentityactions.4.carbon` | World entity actions |

#### NPC Data
| Variable | Default | Description |
|----------|---------|-------------|
| `NPC_ENTITY_DEFS_FILE` | `npcentitydefs.22.carbon` | NPC entity definitions |
| `NPC_ENTITIES_FILE` | `npcentities.16.carbon` | NPC entities |
| `NPC_LOOT_FILE` | `npcloot.18.carbon` | NPC loot tables |

#### Item Data
| Variable | Default | Description |
|----------|---------|-------------|
| `ITEM_DEFS_FILE` | `itemdefs.33.carbon` | Item definitions |
| `GROUND_ITEMS_FILE` | `grounditems.12.carbon` | Ground items (spawns) |

#### Other Data
| Variable | Default | Description |
|----------|---------|-------------|
| `NPC_CONVERSATION_DEFS_FILE` | `npcconversationdefs.2.carbon` | NPC conversations |
| `SHOP_DEFS_FILE` | `shopdefs.11.carbon` | Shop definitions |

### 13. Rate Limiting (`shared.env`)

#### Web Authentication
| Variable | Default | Description |
|----------|---------|-------------|
| `WEB_AUTH_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `WEB_AUTH_MAX` | `5` | Max auth attempts per window |
| `WEB_REGISTER_MAX` | `3` | Max registration attempts per window |
| `WEB_EMAIL_MAX` | `3` | Max email requests per window |
| `WEB_VERIFICATION_MAX` | `10` | Max verification attempts per window |

#### API Login Tokens
| Variable | Default | Description |
|----------|---------|-------------|
| `GET_LOGIN_WINDOW_MS` | `900000` | Rate limit window (15 minutes) |
| `GET_LOGIN_MAX` | `15` | Max login token requests per window |

### 14. World & Session Timeouts (`shared.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `WORLD_HEARTBEAT_TIMEOUT_SEC` | `120` | World considered offline after this (seconds) |
| `GAME_LOGIN_TOKEN_TTL_SEC` | `60` | Game login token lifetime (seconds) |

## 🔄 Variable Usage by Service

### API Server Reads:
- Root `.env`: All API_* variables, secrets, email config
- `shared.env`: URLs, rate limits, world heartbeat config

### Web Server Reads:
- Root `.env`: WEB_*, API_WEB_SECRET, email UI flags
- `shared.env`: URLs, API_URL, CDN_URL, asset paths

### Game Server Reads:
- Root `.env`: GAME_*, GAME_SERVER_SECRET, DATABASE_URL, SSL config
- `shared.env`: API_URL, asset paths, all game data file names

## 🐳 Docker Considerations

Docker Compose should load:
1. `.env` (root) - Automatically loaded by Docker Compose
2. `apps/shared-assets/base/shared.env` - Loaded via `env_file` directive

Example `docker-compose.yml`:
```yaml
services:
  api:
    env_file:
      - .env
      - apps/shared-assets/base/shared.env
  
  web:
    env_file:
      - .env
      - apps/shared-assets/base/shared.env
  
  game:
    env_file:
      - .env
      - apps/shared-assets/base/shared.env
```

## 🔒 Security Notes

1. **Never commit `.env` files to version control** (already in `.gitignore`)
2. **Rotate secrets regularly** in production
3. **Use strong secrets** - The setup script generates cryptographically secure 64-character hex secrets
4. **Shared secrets must match** - API_WEB_SECRET and GAME_SERVER_SECRET must be identical across services
5. **Email credentials** - Store SMTP_PASS and AWS secrets securely (use environment-specific secrets in production)

## 🚀 Quick Start

1. Run the setup script:
   ```powershell
   .\setup-env.ps1
   ```

2. Review and customize `.env`:
   - Update `DATABASE_URL` if not using default PostgreSQL setup
   - Configure email settings if needed
   - Update ports if they conflict with existing services

3. Review `apps/shared-assets/base/shared.env`:
   - Update URLs if using different domains/ports
   - Adjust rate limiting values if needed
   - Customize asset file names if using custom data files

4. Start services:
   ```bash
   # Docker
   docker-compose up
   
   # Or individual services
   pnpm run dev:api
   pnpm run dev:web
   pnpm run dev:game
   ```

## 📝 Adding New Variables

When adding new environment variables:

1. **Secrets** → Add to root `.env` section in `setup-env.ps1`
2. **Shared config** → Add to `shared.env` section in `setup-env.ps1`
3. **Update this document** with the new variable
4. **Update code** to read from `process.env.VARIABLE_NAME`
5. **Test** that setup script adds the variable correctly

## 🔍 Troubleshooting

### "Socket hangup" or authentication errors
- Ensure `API_WEB_SECRET` matches in web and API servers
- Ensure `GAME_SERVER_SECRET` matches in game and API servers
- Run `.\setup-env.ps1` to verify secrets are synchronized

### Email not working
- Check `EMAIL_ENABLED=true` in root `.env`
- Verify SMTP settings for your provider
- For Mailhog: Ensure it's running on `localhost:1025`

### Assets not loading
- Check `STATIC_ASSETS_PATH` points to correct directory
- Verify asset file names match actual files
- Check `ASSETS_ROOT` for web assets (CSS, JS, images)

### HTTPS certificate errors
- Run `.\setup-https.ps1` to generate self-signed certificates
- Set `ALLOW_INSECURE_HTTPS=true` for development
- Check `SSL_CERT_PATH` and `SSL_KEY_PATH` are correct

## 📚 Related Documentation

- `setup-env.ps1` - Environment setup script
- `setup-https.ps1` - HTTPS certificate generation
- `ARCHITECTURE.md` - Overall system architecture
- `apps/api/EMAIL-SERVICE.md` - Email service documentation
