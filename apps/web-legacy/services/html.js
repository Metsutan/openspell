/**
 * HTML Generation Service
 * Handles generation of HTML pages, headers, and footers
 */

const { escapeHtml } = require('../utils/helpers');

// Email configuration (must match API server)
const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';
const EMAIL_VERIFICATION_REQUIRED = process.env.EMAIL_VERIFICATION_REQUIRED === 'true';
const EMAIL_REQUIRED = process.env.EMAIL_REQUIRED === 'true';
const SHOW_EMAIL_FIELD = process.env.SHOW_EMAIL_FIELD !== 'false'; // Default true
const SHOW_EMAIL_VERIFICATION_STATUS = process.env.SHOW_EMAIL_VERIFICATION_STATUS !== 'false'; // Default true
const SHOW_RESEND_VERIFICATION = process.env.SHOW_RESEND_VERIFICATION !== 'false'; // Default true
const SHOW_FORGOT_PASSWORD = process.env.SHOW_FORGOT_PASSWORD !== 'false'; // Default true
const SHOW_DISCORD_LINK = process.env.SHOW_DISCORD_LINK === 'true'; // Default false
const DISCORD_LINK = process.env.DISCORD_LINK || '';

// reCAPTCHA configuration
const RECAPTCHA_ENABLED = process.env.RECAPTCHA_ENABLED === 'true'; // Default false
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '';

/**
 * Gets the common header HTML
 */
function getHeader(user = null, options = {}) {
    const isAuthenticated = user !== null;
    const displayName = user ? (user.displayName || user.username || 'User') : '';
    const hiscoresWorlds = Array.isArray(options.hiscoresWorlds) ? options.hiscoresWorlds : [];
    const selectedServerId = Number.isInteger(options.selectedServerId) ? options.selectedServerId : null;
    const hiscoresSelectBaseUrl = typeof options.hiscoresSelectBaseUrl === 'string'
        ? options.hiscoresSelectBaseUrl
        : null;
    
    const authLinks = isAuthenticated
        ? `                            <div class="nav-item"><span style="color: var(--theme-color); font-weight: 600;">${escapeHtml(displayName)}</span></div>
                            <div class="nav-item"><a href="/account" title="Account">MY ACCOUNT</a></div>
                            <div class="nav-item"><a href="/logout" title="Logout">LOGOUT</a></div>`
        : `                            <div class="nav-item"><a href="/login" title="Login">LOGIN</a></div>
                            <div class="nav-item"><a href="/register" title="Register">REGISTER</a></div>`;

    const hiscoresNavItem = (hiscoresWorlds.length > 0 && hiscoresSelectBaseUrl)
        ? `                            <div class="nav-item hs-nav">
                                <div class="hs-nav-label">HISCORES</div>
                                <select class="hs-nav-select" data-base-url="${escapeHtml(hiscoresSelectBaseUrl)}" aria-label="Select hiscores world">
${hiscoresWorlds.map(world => {
        const isSelected = selectedServerId !== null && world.serverId === selectedServerId;
        return `                                    <option value="${world.serverId}"${isSelected ? ' selected' : ''}>${escapeHtml(world.name)}</option>`;
    }).join('\n')}
                                </select>
                            </div>`
        : `                            <div class="nav-item"><a href="/hiscores" title="HiScores">HISCORES</a></div>`;
    
    return `            <header id="hd-fx">
                <div id="hd-wrap">
                    <div class="mb-nav-btn"></div>
                    <div id="hd-l">
                        <div id="hd-l-wrap">
                            <div id="hd-brand">
                                <a href="/" title="Home"><img id="brand-img" src="/images/logo-open.png" width="189" height="32" alt="OpenSpell" /></a>
                            </div>
                        </div>
                    </div>
                    <div id="hd-r">
                        <nav id="nav-main">
                            <div class="nav-item"><a href="/play" title="Play Now">PLAY NOW</a></div>
                            <div class="nav-item"><a href="/news/archives" title="News">NEWS</a></div>
${hiscoresNavItem}
                            <div class="nav-item"><a href="/rules" title="Rules">RULES</a></div>
${SHOW_DISCORD_LINK && DISCORD_LINK ? `                            <div class="nav-item"><a href="${escapeHtml(DISCORD_LINK)}" title="Community" target="_blank" rel="noopener noreferrer">COMMUNITY</a></div>` : ''}
                            <div class="nav-item"><a href="https://github.com/GammaParadox/openspell" title="Source" target="_blank" rel="noopener noreferrer">SOURCE</a></div>
                            <div id="map-nav" class="nav-item"><a href="/worldmap" title="World Map">WORLD MAP</a></div>
                        </nav>
                        <div id="hd-r-sec">
${authLinks}
                        </div>
                    </div>
                    <div class="mb-nav-btn">
                        <button id="mb-toggle-btn" class="mb-nav-btn hb-btn">
                            <div id="hb-icon"></div>
                        </button>
                    </div>
                </div>
            </header>`;
}

/**
 * Gets the common footer HTML
 */
function getFooter() {
    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    const yearRange = currentYear === startYear ? `${startYear}` : `${startYear}-${currentYear}`;
    return `            <footer id="ft">
                <div></div>
                <div id="ft-content"></div>
                <div id="cp-txt">${yearRange} OpenSpell</div>
                <div></div>
            </footer>`;
}

/**
 * Generates the full HTML page structure
 */
function generatePage(title, bodyContent, description = null, user = null, additionalHead = '', headerOptions = {}) {
    const metaDescription = description || "OpenSpell - A browser-based MMORPG. Play for free today!";
    
    // Add reCAPTCHA Enterprise script if enabled
    const recaptchaScript = (RECAPTCHA_ENABLED && RECAPTCHA_SITE_KEY) 
        ? `        <script src="https://www.google.com/recaptcha/api.js" async defer></script>\n`
        : '';
    
    return `<!DOCTYPE html>
<html lang="en">
	<head>
        <meta charset="UTF-8">
        <meta name="Description" content="${escapeHtml(metaDescription)}">
        <meta name='author' content='OpenSpell'/>
        <meta name="keywords" content="openspell, mmo, mmorpg, fantasy, online game" />
        <link rel='shortcut icon' href='/images/favicon2.ico?4'>
        <link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${escapeHtml(title)}</title>
            
        <link href="/css/main.5.css" rel="stylesheet" type="text/css">
        <script type="text/javascript" src="/js/main.js"></script>
${recaptchaScript}${additionalHead}
	</head>

    
    <body>
    
        
        
        <div id="app-wrap">
        
		
            
${getHeader(user, headerOptions)}
            
            

            
            <main id="content">

${bodyContent}

            </main>
                        
            
${getFooter()}
            

            
        </div>
    </body>
</html>`;
}

module.exports = {
    getHeader,
    getFooter,
    generatePage,
    EMAIL_ENABLED,
    EMAIL_VERIFICATION_REQUIRED,
    EMAIL_REQUIRED,
    SHOW_EMAIL_FIELD,
    SHOW_EMAIL_VERIFICATION_STATUS,
    SHOW_RESEND_VERIFICATION,
    SHOW_FORGOT_PASSWORD,
    RECAPTCHA_ENABLED,
    RECAPTCHA_SITE_KEY
};

