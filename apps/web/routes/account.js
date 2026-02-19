/**
 * Account Routes
 * Handles account management routes (account page, change password, change email)
 */

const express = require('express');
const router = express.Router();
const { getUserInfo, requireAuth } = require('../services/auth');
const { generatePage, SHOW_EMAIL_FIELD, SHOW_EMAIL_VERIFICATION_STATUS, EMAIL_VERIFICATION_REQUIRED, SHOW_RESEND_VERIFICATION, EMAIL_ENABLED } = require('../services/html');
const { getCsrfToken, csrfProtection } = require('../services/csrf');
const { sanitizeString, isValidEmail } = require('../services/validation');
const { makeApiRequest, extractApiErrorMessage } = require('../services/api');
const { escapeHtml } = require('../utils/helpers');

function formatTotalPlayTime(totalMs) {
    const safeMs = Number.isFinite(Number(totalMs)) ? Math.max(0, Number(totalMs)) : 0;
    const totalMinutes = Math.floor(safeMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days} days ${hours} hours ${minutes} minutes`;
}

// Apply authentication middleware to all account routes
router.use(requireAuth);

// Helper: Check if user is admin
async function requireAdmin(req, res, next) {
    try {
        const userData = await makeApiRequest('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        
        if (!userData.user || !userData.user.isAdmin) {
            return res.status(403).send('Access denied. Admin privileges required.');
        }
        
        req.adminUser = userData.user;
        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).send('Internal server error');
    }
}

// Route: Account page (requires authentication)
router.get('/', async (req, res) => {
    // Try to get fresh user data from API
    let user = {
        id: req.session.userId,
        username: req.session.username || 'User',
        displayName: req.session.displayName || req.session.username || 'User',
        email: null,
        createdAt: null
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
    
    // Format creation date
    let createdDateStr = 'N/A';
    if (user.createdAt) {
        const createdDate = new Date(user.createdAt);
        createdDateStr = createdDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    const totalPlayTimeStr = formatTotalPlayTime(user.timePlayed);
    
    // Get success/error messages
    const successMessage = req.query.success ? escapeHtml(req.query.success) : '';
    const accountErrorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    
    // Calculate cooldown information
    let passwordCooldownInfo = '';
    if (user.lastPasswordChange) {
        const lastChange = new Date(user.lastPasswordChange);
        const now = new Date();
        const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
        if (hoursSinceChange < 24) {
            const hoursRemaining = Math.ceil(24 - hoursSinceChange);
            passwordCooldownInfo = `<li style="color: #ff8800;">Password change cooldown: <span class="fw-bold">${hoursRemaining} hour(s) remaining</span></li>`;
        } else {
            passwordCooldownInfo = '<li style="color: #00aa00;">Password can be changed</li>';
        }
    } else {
        passwordCooldownInfo = '<li style="color: #00aa00;">Password can be changed</li>';
    }
    
    let emailCooldownInfo = '';
    if (user.lastEmailChange) {
        const lastChange = new Date(user.lastEmailChange);
        const now = new Date();
        const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
        if (hoursSinceChange < 24) {
            const hoursRemaining = Math.ceil(24 - hoursSinceChange);
            emailCooldownInfo = `<li style="color: #ff8800;">Email change cooldown: <span class="fw-bold">${hoursRemaining} hour(s) remaining</span></li>`;
        } else {
            emailCooldownInfo = '<li style="color: #00aa00;">Email can be changed</li>';
        }
    } else {
        emailCooldownInfo = '<li style="color: #00aa00;">Email can be changed</li>';
    }
    
    const bodyContent = `
<section id="account">

	<h1 class="sect-h" id="account_title">
		<span>Welcome, ${escapeHtml(user.displayName || user.username)}</span>
    </h1>

    <div id="account_container" class="content-box">
        <ul id="settings" class="card">
    <li class="card-title">SETTINGS</li>
    <li>
        <ul class="cfg-list">
            <li><a href="/account" title="My Account">My Account</a></li>
            <li><a href="/account/change-password" title="Change Password">Change Password</a></li>
            <li><a href="/account/change-email" title="Change Email">Change Email</a></li>
            ${user.isAdmin ? '<li><a href="/account/admin" title="Admin Panel" style="color: var(--warning-color); font-weight: 600;">Admin Panel</a></li>' : ''}
        </ul>
    </li>
</ul>

        <div id="account-info" class="card">
            <ul class="cont-list">
                ${successMessage ? `<li style="color: #00aa00; margin-bottom: 16px; padding: 12px; background: #00aa0020; border-radius: 4px;">${successMessage}</li>` : ''}
                ${accountErrorMessage ? `<li style="color: #ff4444; margin-bottom: 16px; padding: 12px; background: #ff444420; border-radius: 4px;">${accountErrorMessage}</li>` : ''}
                <li><h3>Account Overview</h3></li>
                <li>Display Name: <span class="fw-bold">${escapeHtml(user.displayName || user.username)}</span> <small style="color: #888;">(Admin only)</small></li>
                <li>Username: <span class="fw-bold">${escapeHtml(user.username)}</span></li>
                ${SHOW_EMAIL_FIELD ? `
                <li>Email: <span class="fw-bold">${escapeHtml(user.email)}</span>
                    ${SHOW_EMAIL_VERIFICATION_STATUS && EMAIL_VERIFICATION_REQUIRED ? `
                        ${user.emailVerified ? 
                            '<span style="color: #00aa00; margin-left: 8px;">✓ Verified</span>' : 
                            '<span style="color: #ff8800; margin-left: 8px;">⚠ Not Verified</span>'
                        }
                    ` : ''}
                </li>
                ${user.previousEmail ? `<li>Previous Email: <span class="fw-bold">${escapeHtml(user.previousEmail)}</span></li>` : ''}
                ${SHOW_EMAIL_VERIFICATION_STATUS && EMAIL_VERIFICATION_REQUIRED && !user.emailVerified && SHOW_RESEND_VERIFICATION ? `
                <li>
                    <form action="/resend-verification" method="POST" style="display: inline;">
                        <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                        <button type="submit" style="background: #4CAF50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Resend Verification Email</button>
                    </form>
                </li>
                ` : ''}
                ` : ''}
                <li>Player since <span class="fw-bold">${createdDateStr}</span></li>
                <li>Total play time: <span class="fw-bold">${totalPlayTimeStr}</span></li>
                <li></li>
                <li><h3>Account Management</h3></li>
                ${passwordCooldownInfo}
                ${emailCooldownInfo}
                <li></li>
            </ul>
        </div>

	</div>
    
</section>`;

    const html = generatePage('OpenSpell - My Account', bodyContent, null, user);
    res.send(html);
});

// Route: Change Password page (requires authentication)
router.get('/change-password', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    // Get fresh user data to check cooldown
    let userData = null;
    try {
        const apiResponse = await makeApiRequest('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        userData = apiResponse.user;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
    
    // Check cooldown
    let cooldownMessage = '';
    let canChange = true;
    if (userData && userData.lastPasswordChange) {
        const lastChange = new Date(userData.lastPasswordChange);
        const now = new Date();
        const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
        if (hoursSinceChange < 24) {
            const hoursRemaining = Math.ceil(24 - hoursSinceChange);
            cooldownMessage = `<div style="color: #ff8800; margin-bottom: 16px; padding: 12px; background: #ff880020; border-radius: 4px;">
                <strong>Cooldown Active:</strong> Password can only be changed once per day. Please wait ${hoursRemaining} more hour(s) before changing your password again.
            </div>`;
            canChange = false;
        }
    }
    
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    const successMessage = req.query.success ? escapeHtml(req.query.success) : '';
    
    const bodyContent = `
<section id="change-password">

    <div class="auth-wrap">

        <div class="auth-wrap_inner card">

            <div id="login-brand-img" title="OpenSpell"></div>

            <div class="frm-wrap">
                ${cooldownMessage}
                ${successMessage ? `<div style="color: #00aa00; margin-bottom: 16px; padding: 12px; background: #00aa0020; border-radius: 4px;">${successMessage}</div>` : ''}
                ${errorMessage ? `<div style="color: #ff4444; margin-bottom: 16px; padding: 12px; background: #ff444420; border-radius: 4px;">${errorMessage}</div>` : ''}

                <form action="/account/change-password" name="changepasswordform" id="changepasswordform" method="POST">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />

                    <div class="frm-wrap_row">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" name="current-password" maxlength="64" placeholder="Current Password" required ${canChange ? '' : 'disabled'} />
                    </div>

                    <div class="frm-wrap_row">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" name="new-password" maxlength="64" placeholder="New Password (min 8 characters)" required ${canChange ? '' : 'disabled'} />
                    </div>

                    <div class="frm-wrap_row">
                        <label for="confirm-new-password">Confirm New Password</label>
                        <input type="password" id="confirm-new-password" name="confirm-new-password" maxlength="64" placeholder="Confirm New Password" required ${canChange ? '' : 'disabled'} />
                    </div>

                    <div id="err-msg" class="frm-wrap-row">
                        <span id="status-message"></span>
                    </div>

                    <div class="frm-wrap_row frm-wrap_row--center">
                        <input type="submit" id="submit" class="btn-submit" name="submit" value="Change Password" ${canChange ? '' : 'disabled'} />
                    </div>
            
                    <div class="frm-wrap_row frm-wrap_row--center" style="margin-top:24px;flex-direction:column;">
                        <div style="margin:4px;"><a href="/account" title="Back to Account">Back to Account</a></div>
                    </div>

                </form>

                <script type="text/javascript" src="/js/checkfields.js?v=3"></script>
                
            </div>
            
        </div>

        <div style="margin-top: 8px;">
            <a href="/account" style="padding:8px;" title="Account">Back to Account</a>
        </div>

    </div>
    
</section>`;

    const html = generatePage('OpenSpell - Change Password', bodyContent, null, user);
    res.send(html);
});

// Route: POST Change Password
router.post('/change-password', csrfProtection, async (req, res) => {
    try {
        const currentPassword = req.body['current-password'];
        const newPassword = req.body['new-password'];
        const confirmNewPassword = req.body['confirm-new-password'];
        
        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.redirect(`/account/change-password?error=${encodeURIComponent('All fields are required')}`);
        }
        
        if (newPassword.length < 8) {
            return res.redirect(`/account/change-password?error=${encodeURIComponent('New password must be at least 8 characters')}`);
        }
        
        if (newPassword !== confirmNewPassword) {
            return res.redirect(`/account/change-password?error=${encodeURIComponent('New passwords do not match')}`);
        }
        
        // Call API
        try {
            const apiResponse = await makeApiRequest('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    currentPassword,
                    newPassword
                }
            });
            
            if (apiResponse.success) {
                return res.redirect(`/account/change-password?success=${encodeURIComponent('Password changed successfully!')}`);
            } else {
                return res.redirect(`/account/change-password?error=${encodeURIComponent(apiResponse.error || 'Failed to change password')}`);
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect(`/account/change-password?error=${encodeURIComponent(errorMessage)}`);
        }
    } catch (error) {
        console.error('Change password error:', error);
        return res.redirect(`/account/change-password?error=${encodeURIComponent('Internal server error')}`);
    }
});

// Route: Change Email page (requires authentication)
router.get('/change-email', async (req, res) => {
    // Get user info for header
    const user = await getUserInfo(req, false);
    
    // Get fresh user data to check cooldown
    let userData = null;
    try {
        const apiResponse = await makeApiRequest('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        userData = apiResponse.user;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
    
    // Check cooldown
    let cooldownMessage = '';
    let canChange = true;
    if (userData && userData.lastEmailChange) {
        const lastChange = new Date(userData.lastEmailChange);
        const now = new Date();
        const hoursSinceChange = (now - lastChange) / (1000 * 60 * 60);
        if (hoursSinceChange < 24) {
            const hoursRemaining = Math.ceil(24 - hoursSinceChange);
            cooldownMessage = `<div style="color: #ff8800; margin-bottom: 16px; padding: 12px; background: #ff880020; border-radius: 4px;">
                <strong>Cooldown Active:</strong> Email can only be changed once per day. Please wait ${hoursRemaining} more hour(s) before changing your email again.
            </div>`;
            canChange = false;
        }
    }
    
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    const successMessage = req.query.success ? escapeHtml(req.query.success) : '';
    
    const bodyContent = `
<section id="change-email">

    <div class="auth-wrap">

        <div class="auth-wrap_inner card">

            <div id="login-brand-img" title="OpenSpell"></div>

            <div class="frm-wrap">
                ${cooldownMessage}
                ${successMessage ? `<div style="color: #00aa00; margin-bottom: 16px; padding: 12px; background: #00aa0020; border-radius: 4px;">${successMessage}</div>` : ''}
                ${errorMessage ? `<div style="color: #ff4444; margin-bottom: 16px; padding: 12px; background: #ff444420; border-radius: 4px;">${errorMessage}</div>` : ''}

                <form action="/account/change-email" name="changeemailform" id="changeemailform" method="POST">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />

                    <div class="frm-wrap_row">
                        <label>Current Email</label>
                        <input type="email" value="${escapeHtml(userData?.email || '')}" disabled style="background: #333; color: #888;" />
                    </div>

                    <div class="frm-wrap_row">
                        <label for="new-email">New Email</label>
                        <input type="email" id="new-email" name="new-email" maxlength="255" placeholder="New Email" required ${canChange ? '' : 'disabled'} />
                    </div>

                    <div class="frm-wrap_row">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" maxlength="64" placeholder="Enter your password to confirm" required ${canChange ? '' : 'disabled'} />
                    </div>

                    <div class="frm-wrap_row">
                    <small style="color: #888; font-size: 0.9em;">Enter your current password to confirm the email change.</small>
                    </div>

                    <div id="err-msg" class="frm-wrap-row">
                        <span id="status-message"></span>
                    </div>

                    <div class="frm-wrap_row frm-wrap_row--center">
                        <input type="submit" id="submit" class="btn-submit" name="submit" value="Change Email" ${canChange ? '' : 'disabled'} />
                    </div>
            
                    <div class="frm-wrap_row frm-wrap_row--center" style="margin-top:24px;flex-direction:column;">
                        <div style="margin:4px;"><a href="/account" title="Back to Account">Back to Account</a></div>
                    </div>

                </form>

                <script type="text/javascript" src="/js/checkfields.js?v=3"></script>
                
            </div>
            
        </div>

        <div style="margin-top: 8px;">
            <a href="/account" style="padding:8px;" title="Account">Back to Account</a>
        </div>

    </div>
    
</section>`;

    const html = generatePage('OpenSpell - Change Email', bodyContent, null, user);
    res.send(html);
});

// Route: POST Change Email
router.post('/change-email', csrfProtection, async (req, res) => {
    try {
        const newEmail = sanitizeString(req.body['new-email']);
        const password = req.body.password;
        
        // Validation
        if (!newEmail || !password) {
            return res.redirect(`/account/change-email?error=${encodeURIComponent('New email and password are required')}`);
        }
        
        if (!isValidEmail(newEmail)) {
            return res.redirect(`/account/change-email?error=${encodeURIComponent('Invalid email format')}`);
        }
        
        // Call API
        try {
            const apiResponse = await makeApiRequest('/api/auth/change-email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    newEmail,
                    password
                }
            });
            
            if (apiResponse.success) {
                // Update session email if available
                try {
                    const userData = await makeApiRequest('/api/auth/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${req.session.token}`
                        }
                    });
                    if (userData.user) {
                        // Email is updated in database, session will get it on next refresh
                    }
                } catch (e) {
                    // Ignore errors updating session
                }
                return res.redirect(`/account/change-email?success=${encodeURIComponent('Email changed successfully!')}`);
            } else {
                return res.redirect(`/account/change-email?error=${encodeURIComponent(apiResponse.error || 'Failed to change email')}`);
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect(`/account/change-email?error=${encodeURIComponent(errorMessage)}`);
        }
    } catch (error) {
        console.error('Change email error:', error);
        return res.redirect(`/account/change-email?error=${encodeURIComponent('Internal server error')}`);
    }
});

// ==================== ADMIN PANEL ====================

// Route: Admin Panel (requires admin privileges)
router.get('/admin', requireAdmin, async (req, res) => {
    const user = await getUserInfo(req, false);
    
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    const successMessage = req.query.success ? escapeHtml(req.query.success) : '';
    const cspNonce = res.locals.cspNonce || '';
    const scriptNonceAttr = cspNonce ? ` nonce="${cspNonce}"` : '';
    
    const bodyContent = `
<section id="admin-panel">

    <h1 class="sect-h">
        <span>Admin Panel</span>
    </h1>

    <div id="admin_container" class="content-box">
        <ul id="settings" class="card">
            <li class="card-title">ADMIN MENU</li>
            <li>
                <ul class="cfg-list">
                    <li><a href="/account" title="My Account">My Account</a></li>
                    <li><a href="/account/admin" title="Admin Panel" class="sel">Admin Panel</a></li>
                </ul>
            </li>
        </ul>

        <div id="admin-content" class="card" style="flex-grow: 1;">
            ${successMessage ? `<div class="notification success" style="margin-bottom: 16px;">${successMessage}</div>` : ''}
            ${errorMessage ? `<div class="notification error" style="margin-bottom: 16px;">${errorMessage}</div>` : ''}
            
            <h2>User Management</h2>
            
            <div id="user-search-section" style="margin-bottom: 24px;">
                <h3>Search User</h3>
                <form id="user-search-form" method="POST" action="/account/admin/search-user" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                    <input type="text" name="query" placeholder="Username or Display Name" required style="flex: 1; min-width: 200px; padding: 8px;" />
                    <button type="submit" class="btn-submit">Search</button>
                </form>
            </div>

            <div id="user-details-section" style="display: none; margin-bottom: 24px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px;">
                <h3>User Details</h3>
                <div id="user-details-content"></div>
            </div>

            <div id="anti-cheat-section" style="margin-top: 32px;">
                <h3>Anti-Cheat Alerts</h3>
                <form id="anti-cheat-filter-form" method="POST" action="/account/admin/anti-cheat/alerts" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                    <select name="severity" style="padding: 8px;">
                        <option value="">All Severities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                    <input type="text" name="category" placeholder="Category (optional)" style="min-width: 200px; padding: 8px;" />
                    <label style="display: flex; align-items: center; gap: 6px;">
                        <input type="checkbox" name="dismissed" value="true" />
                        Show dismissed
                    </label>
                    <button type="submit" class="btn-submit">Load Alerts</button>
                </form>
                <div id="anti-cheat-alerts-container"></div>
                <div id="anti-cheat-risk-section" style="margin-top: 16px; display: none;">
                    <h4>User Risk Profile</h4>
                    <div id="anti-cheat-risk-content"></div>
                </div>
                <div id="anti-cheat-trends-section" style="margin-top: 16px;">
                    <h4>Anti-Cheat Trends</h4>
                    <form id="anti-cheat-trends-form" method="POST" action="/account/admin/anti-cheat/trends" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                        <label style="display: flex; align-items: center; gap: 6px;">
                            Hours
                            <input type="number" name="hours" min="1" max="168" value="24" style="padding: 8px; width: 100px;" />
                        </label>
                        <button type="submit" class="btn-submit">Load Trends</button>
                        <button type="button" class="btn-submit trend-range-btn" data-hours="24">24h</button>
                        <button type="button" class="btn-submit trend-range-btn" data-hours="72">72h</button>
                        <button type="button" class="btn-submit trend-range-btn" data-hours="168">168h</button>
                    </form>
                    <div id="anti-cheat-trends-content" style="margin-top: 12px;"></div>
                </div>
            </div>

            <div id="banned-ips-section" style="margin-top: 32px;">
                <h3>Banned IPs</h3>
                <form method="GET" action="/account/admin/banned-ips" style="margin-bottom: 16px;">
                    <button type="submit" class="btn-submit">View All Banned IPs</button>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <script${scriptNonceAttr}>
        function escapeHtml(input) {
            if (input === null || input === undefined) return '';
            return String(input)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        const chartRegistry = {};

        function formatJsonPreview(value, maxLength = 220) {
            if (value === null || value === undefined) return '';
            let text = '';
            try {
                text = JSON.stringify(value);
            } catch (e) {
                text = String(value);
            }
            if (text.length > maxLength) {
                text = text.slice(0, maxLength) + '...';
            }
            return escapeHtml(text);
        }

        function toHourKey(value) {
            return new Date(value).toISOString();
        }

        function buildSeries(rows, hourKeys, valueKey) {
            const map = new Map();
            (rows || []).forEach(row => {
                map.set(toHourKey(row.hour), Number(row[valueKey]) || 0);
            });
            return hourKeys.map(key => map.get(key) || 0);
        }

        function ensureChart(canvasId, config) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const existing = chartRegistry[canvasId];
            if (existing) {
                existing.data = config.data;
                existing.options = config.options;
                existing.update();
                return;
            }
            chartRegistry[canvasId] = new Chart(canvas, config);
        }

        function destroyChart(canvasId) {
            const existing = chartRegistry[canvasId];
            if (existing) {
                existing.destroy();
                delete chartRegistry[canvasId];
            }
        }

        // Function to ban an IP with a custom reason
        async function banIP(ip, csrfToken) {
            const reason = prompt('Enter reason for banning IP ' + ip + ':', 'Policy violation');
            if (!reason || reason.trim().length === 0) {
                alert('Ban reason is required');
                return;
            }
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/account/admin/ban-ip';
            
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            const ipInput = document.createElement('input');
            ipInput.type = 'hidden';
            ipInput.name = 'ip';
            ipInput.value = ip;
            form.appendChild(ipInput);
            
            const reasonInput = document.createElement('input');
            reasonInput.type = 'hidden';
            reasonInput.name = 'reason';
            reasonInput.value = reason.trim();
            form.appendChild(reasonInput);
            
            document.body.appendChild(form);
            form.submit();
        }
        
        // Helper function to handle form submissions and display results
        async function handlePayloadSubmission(endpoint, payload) {
            const detailsSection = document.getElementById('user-details-section');
            const detailsContentDiv = document.getElementById('user-details-content');

            // Show loading state
            if (detailsSection && detailsContentDiv) {
                detailsSection.style.display = 'block';
                detailsContentDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>';
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: payload instanceof URLSearchParams ? payload : new URLSearchParams(payload)
                });

                if (response.ok) {
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const detailsContent = doc.getElementById('user-details-content');

                    if (detailsContent && detailsContentDiv) {
                        detailsContentDiv.innerHTML = detailsContent.innerHTML;
                        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                        // Re-attach event handlers to any forms in the new content
                        attachFormHandlers();
                    } else {
                        detailsContentDiv.innerHTML = '<div class="notification error">Failed to parse results</div>';
                    }
                } else if (detailsContentDiv) {
                    detailsContentDiv.innerHTML = '<div class="notification error">Request failed: ' + response.status + '</div>';
                }
            } catch (error) {
                console.error('Request error:', error);
                if (detailsContentDiv) {
                    detailsContentDiv.innerHTML = '<div class="notification error">Network error. Please try again.</div>';
                }
            }
        }

        async function handleFormSubmission(formElement, endpoint) {
            const formData = new FormData(formElement);
            await handlePayloadSubmission(endpoint, new URLSearchParams(formData));
        }

        async function postAntiCheat(endpoint, payload) {
            const body = payload instanceof URLSearchParams ? payload : new URLSearchParams(payload);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body
            });
            if (!response.ok) {
                throw new Error('Request failed: ' + response.status);
            }
            return response.json();
        }

        function renderAlertRows(alerts) {
            if (!alerts || alerts.length === 0) {
                return '<div class="notification warning">No alerts found</div>';
            }
            const rows = alerts.map(alert => {
                const userLabel = alert.user ? escapeHtml(alert.user.username) : 'Unknown';
                const detectedAt = new Date(alert.detectedAt).toLocaleString();
                const severity = escapeHtml(alert.severity);
                const category = escapeHtml(alert.category);
                const description = escapeHtml(alert.description);
                const dismissedBadge = alert.dismissed ? '<span style="color: var(--warning-color); font-weight: 600;">DISMISSED</span>' : '';
                const userId = alert.user && alert.user.id ? alert.user.id : 'N/A';
                const riskButton = '<button type="button" class="btn-submit anti-cheat-risk-btn" data-user-id="' + (alert.user && alert.user.id ? alert.user.id : '') + '" style="padding: 4px 10px; margin-right: 6px;">Risk</button>';
                const viewButton = '<button type="button" class="btn-submit anti-cheat-user-btn" data-user-id="' + (alert.user && alert.user.id ? alert.user.id : '') + '" style="padding: 4px 10px; margin-right: 6px;">View</button>';
                const dismissButton = !alert.dismissed
                    ? '<button type="button" class="btn-submit anti-cheat-dismiss-btn" data-alert-id="' + alert.id + '" style="padding: 4px 10px;">Dismiss</button>'
                    : '';
                const legitButton = '<button type="button" class="btn-submit anti-cheat-legit-btn" data-alert-id="' + alert.id + '" style="padding: 4px 10px; margin-left: 6px;">Too Strict</button>';
                const confirmButton = '<button type="button" class="btn-submit anti-cheat-confirm-btn" data-alert-id="' + alert.id + '" style="padding: 4px 10px; margin-left: 6px;">Confirmed</button>';
                return (
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">' +
                    '<td style="padding: 8px;">' + detectedAt + '</td>' +
                    '<td style="padding: 8px;">' + userLabel + ' (#' + userId + ') ' + dismissedBadge + '</td>' +
                    '<td style="padding: 8px;">' + severity + '</td>' +
                    '<td style="padding: 8px;">' + category + '</td>' +
                    '<td style="padding: 8px;">' + description + '</td>' +
                    '<td style="padding: 8px;">' + viewButton + riskButton + dismissButton + legitButton + confirmButton + '</td>' +
                    '</tr>'
                );
            }).join('');

            return (
                '<table style="width: 100%; border-collapse: collapse; margin: 8px 0;">' +
                '<thead>' +
                '<tr style="border-bottom: 2px solid var(--theme-color);">' +
                '<th style="text-align: left; padding: 8px;">Detected</th>' +
                '<th style="text-align: left; padding: 8px;">User</th>' +
                '<th style="text-align: left; padding: 8px;">Severity</th>' +
                '<th style="text-align: left; padding: 8px;">Category</th>' +
                '<th style="text-align: left; padding: 8px;">Description</th>' +
                '<th style="text-align: left; padding: 8px;">Actions</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' + rows + '</tbody>' +
                '</table>'
            );
        }

        async function loadAntiCheatAlerts(formElement) {
            const payload = new FormData(formElement);
            const dismissedChecked = formElement.querySelector('input[name="dismissed"]').checked;
            if (dismissedChecked) {
                payload.set('dismissed', 'true');
            } else {
                payload.delete('dismissed');
            }
            const result = await postAntiCheat('/account/admin/anti-cheat/alerts', payload);
            const container = document.getElementById('anti-cheat-alerts-container');
            container.innerHTML = renderAlertRows(result.alerts || []);
            attachAntiCheatHandlers();
        }

        async function dismissAlert(alertId, csrfToken) {
            const note = prompt('Dismiss reason (optional):', '');
            const payload = new URLSearchParams();
            payload.set('_csrf', csrfToken);
            if (note && note.trim().length > 0) {
                payload.set('note', note.trim());
            }
            await postAntiCheat('/account/admin/anti-cheat/alerts/' + alertId + '/dismiss', payload);
        }

        async function submitAlertFeedback(alertId, verdict, csrfToken) {
            const note = prompt('Optional note for this feedback:', '');
            const payload = new URLSearchParams();
            payload.set('_csrf', csrfToken);
            payload.set('verdict', verdict);
            if (note && note.trim().length > 0) {
                payload.set('note', note.trim());
            }
            await postAntiCheat('/account/admin/anti-cheat/alerts/' + alertId + '/feedback', payload);
        }

        async function loadUserRisk(userId, csrfToken) {
            const payload = new URLSearchParams();
            payload.set('_csrf', csrfToken);
            const result = await postAntiCheat('/account/admin/anti-cheat/user-risk/' + userId, payload);
            const section = document.getElementById('anti-cheat-risk-section');
            const container = document.getElementById('anti-cheat-risk-content');
            section.style.display = 'block';
            container.innerHTML =
                '<div style="margin-bottom: 8px;">' +
                '<strong>' + escapeHtml(result.user.username) + '</strong> (#' + result.user.id + ')' +
                '<span style="margin-left: 8px;">Risk Score: ' + result.riskScore + '</span>' +
                '</div>' +
                '<div style="margin-bottom: 8px;">' +
                'Invalid packets (24h): ' + result.stats.invalidPacketsLast24h + ', ' +
                'Drops (24h): ' + result.stats.itemDropsLast24h + ', ' +
                'Pickups (24h): ' + result.stats.itemPickupsLast24h + ', ' +
                'Shop sales (24h): ' + result.stats.shopSalesLast24h +
                '</div>' +
                '<div><strong>Recent alerts:</strong> ' + result.alerts.length + '</div>';
        }

        async function loadUserDetailsById(userId, csrfToken) {
            if (!userId) return;
            const payload = new URLSearchParams();
            payload.set('_csrf', csrfToken);
            payload.set('userId', userId);
            await handlePayloadSubmission('/account/admin/get-user', payload);
        }

        async function loadUserAntiCheatLogs(formElement) {
            const payload = new FormData(formElement);
            const userId = formElement.dataset.userId;
            if (!userId) return;
            const result = await postAntiCheat('/account/admin/anti-cheat/user-logs/' + userId, payload);
            const container = document.querySelector('#user-anti-cheat-results-' + userId);
            if (!container) return;

            const rollups = result.invalidRollups || [];
            const hourKeys = rollups.map(row => toHourKey(row.bucketStart));
            const hourLabels = hourKeys.map(key => new Date(key).toLocaleString());
            const rollupCounts = rollups.map(row => Number(row.count) || 0);

            const invalidRows = (result.invalidEvents || []).map(event => {
                const payloadPreview = formatJsonPreview(event.payloadSample);
                const detailsPreview = formatJsonPreview(event.details);
                return (
                    '<tr>' +
                    '<td>' + new Date(event.occurredAt).toLocaleString() + '</td>' +
                    '<td>' + escapeHtml(event.packetName) + '</td>' +
                    '<td>' + escapeHtml(event.reason) + '</td>' +
                    '<td>' + event.count + '</td>' +
                    '<td><code>' + payloadPreview + '</code></td>' +
                    '<td><code>' + detailsPreview + '</code></td>' +
                    '</tr>'
                );
            }).join('');

            const alertRows = (result.alerts || []).map(alert => (
                '<tr>' +
                '<td>' + new Date(alert.detectedAt).toLocaleString() + '</td>' +
                '<td>' + escapeHtml(alert.severity) + '</td>' +
                '<td>' + escapeHtml(alert.category) + '</td>' +
                '<td>' + escapeHtml(alert.description) + '</td>' +
                '<td>' + (alert.dismissed ? 'Yes' : 'No') + '</td>' +
                '</tr>'
            )).join('');

            const dropRows = (result.itemDrops || []).map(drop => (
                '<tr>' +
                '<td>' + new Date(drop.droppedAt).toLocaleString() + '</td>' +
                '<td>' + drop.itemId + '</td>' +
                '<td>' + drop.amount + '</td>' +
                '<td>' + drop.mapLevel + '</td>' +
                '<td>' + drop.x + ', ' + drop.y + '</td>' +
                '</tr>'
            )).join('');

            const pickupRows = (result.itemPickups || []).map(pickup => (
                '<tr>' +
                '<td>' + new Date(pickup.pickedUpAt).toLocaleString() + '</td>' +
                '<td>' + pickup.itemId + '</td>' +
                '<td>' + pickup.amount + '</td>' +
                '<td>' + pickup.mapLevel + '</td>' +
                '<td>' + pickup.x + ', ' + pickup.y + '</td>' +
                '</tr>'
            )).join('');

            container.innerHTML =
                '<div style="margin-bottom: 16px;">' +
                '<strong>Invalid packets (hourly)</strong>' +
                '<div style="margin-top: 8px;"><canvas id="user-invalid-chart-' + userId + '" height="110"></canvas></div>' +
                '</div>' +
                '<details style="margin-top: 12px;">' +
                '<summary>Recent invalid packet events</summary>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">' +
                '<thead><tr><th>Time</th><th>Packet</th><th>Reason</th><th>Count</th><th>Payload</th><th>Details</th></tr></thead>' +
                '<tbody>' + (invalidRows || '<tr><td colspan="6">No invalid packet events</td></tr>') + '</tbody>' +
                '</table>' +
                '</details>' +
                '<details style="margin-top: 12px;">' +
                '<summary>Recent alerts</summary>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">' +
                '<thead><tr><th>Time</th><th>Severity</th><th>Category</th><th>Description</th><th>Dismissed</th></tr></thead>' +
                '<tbody>' + (alertRows || '<tr><td colspan="5">No alerts</td></tr>') + '</tbody>' +
                '</table>' +
                '</details>' +
                '<details style="margin-top: 12px;">' +
                '<summary>Item drops</summary>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">' +
                '<thead><tr><th>Time</th><th>Item</th><th>Amount</th><th>Map</th><th>Location</th></tr></thead>' +
                '<tbody>' + (dropRows || '<tr><td colspan="5">No drops</td></tr>') + '</tbody>' +
                '</table>' +
                '</details>' +
                '<details style="margin-top: 12px;">' +
                '<summary>Item pickups</summary>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">' +
                '<thead><tr><th>Time</th><th>Item</th><th>Amount</th><th>Map</th><th>Location</th></tr></thead>' +
                '<tbody>' + (pickupRows || '<tr><td colspan="5">No pickups</td></tr>') + '</tbody>' +
                '</table>' +
                '</details>';

            const chartId = 'user-invalid-chart-' + userId;
            destroyChart(chartId);
            ensureChart(chartId, {
                type: 'line',
                data: {
                    labels: hourLabels,
                    datasets: [
                        { label: 'Invalid packets', data: rollupCounts, borderColor: '#ff9966', backgroundColor: 'rgba(255,153,102,0.2)', tension: 0.25 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        async function loadAntiCheatTrends(formElement) {
            const payload = new FormData(formElement);
            const result = await postAntiCheat('/account/admin/anti-cheat/trends', payload);
            const container = document.getElementById('anti-cheat-trends-content');
            const hourSource = (result.itemFlow && result.itemFlow.length > 0)
                ? result.itemFlow
                : (result.invalidPackets && result.invalidPackets.length > 0)
                    ? result.invalidPackets
                    : (result.alerts || []);
            const hourKeys = (hourSource || []).map(row => toHourKey(row.hour));
            const hourLabels = hourKeys.map(key => new Date(key).toLocaleString());

            const invalidCounts = buildSeries(result.invalidPackets, hourKeys, 'count');
            const invalidUsers = buildSeries(result.invalidPackets, hourKeys, 'unique_users');
            const alertCritical = buildSeries(result.alerts, hourKeys, 'critical');
            const alertHigh = buildSeries(result.alerts, hourKeys, 'high');
            const alertMedium = buildSeries(result.alerts, hourKeys, 'medium');
            const alertLow = buildSeries(result.alerts, hourKeys, 'low');
            const itemDrops = buildSeries(result.itemFlow, hourKeys, 'drops');
            const itemPickups = buildSeries(result.itemFlow, hourKeys, 'pickups');

            const invalidRows = (result.invalidPackets || []).map(row =>
                '<tr><td>' + new Date(row.hour).toLocaleString() + '</td><td>' + row.count + '</td><td>' + row.unique_users + '</td></tr>'
            ).join('');
            const alertRows = (result.alerts || []).map(row =>
                '<tr><td>' + new Date(row.hour).toLocaleString() + '</td><td>' + row.critical + '</td><td>' + row.high + '</td><td>' + row.medium + '</td><td>' + row.low + '</td></tr>'
            ).join('');
            const itemRows = (result.itemFlow || []).map(row =>
                '<tr><td>' + new Date(row.hour).toLocaleString() + '</td><td>' + row.drops + '</td><td>' + row.pickups + '</td></tr>'
            ).join('');

            container.innerHTML =
                '<div style="margin-bottom: 16px;">' +
                '<strong>Invalid packets (hourly)</strong>' +
                '<div style="margin-top: 8px;"><canvas id="anti-cheat-invalid-chart" height="110"></canvas></div>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<strong>Alerts by severity (hourly)</strong>' +
                '<div style="margin-top: 8px;"><canvas id="anti-cheat-alerts-chart" height="110"></canvas></div>' +
                '</div>' +
                '<div style="margin-bottom: 16px;">' +
                '<strong>Item drops vs pickups (hourly)</strong>' +
                '<div style="margin-top: 8px;"><canvas id="anti-cheat-items-chart" height="110"></canvas></div>' +
                '</div>' +
                '<details style="margin-top: 12px;">' +
                '<summary>Show raw tables</summary>' +
                '<div style="margin-top: 12px;">' +
                '<strong>Invalid packets</strong>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 6px;">' +
                '<thead><tr><th style="text-align:left;">Hour</th><th>Count</th><th>Unique Users</th></tr></thead>' +
                '<tbody>' + (invalidRows || '<tr><td colspan="3">No data</td></tr>') + '</tbody>' +
                '</table>' +
                '</div>' +
                '<div style="margin-top: 12px;">' +
                '<strong>Alerts by severity</strong>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 6px;">' +
                '<thead><tr><th style="text-align:left;">Hour</th><th>Critical</th><th>High</th><th>Medium</th><th>Low</th></tr></thead>' +
                '<tbody>' + (alertRows || '<tr><td colspan="5">No data</td></tr>') + '</tbody>' +
                '</table>' +
                '</div>' +
                '<div style="margin-top: 12px;">' +
                '<strong>Item drops vs pickups</strong>' +
                '<table style="width: 100%; border-collapse: collapse; margin-top: 6px;">' +
                '<thead><tr><th style="text-align:left;">Hour</th><th>Drops</th><th>Pickups</th></tr></thead>' +
                '<tbody>' + (itemRows || '<tr><td colspan="3">No data</td></tr>') + '</tbody>' +
                '</table>' +
                '</div>' +
                '</details>';

            destroyChart('anti-cheat-invalid-chart');
            destroyChart('anti-cheat-alerts-chart');
            destroyChart('anti-cheat-items-chart');

            ensureChart('anti-cheat-invalid-chart', {
                type: 'line',
                data: {
                    labels: hourLabels,
                    datasets: [
                        { label: 'Packets', data: invalidCounts, borderColor: '#ffcc00', backgroundColor: 'rgba(255,204,0,0.2)', tension: 0.25 },
                        { label: 'Unique Users', data: invalidUsers, borderColor: '#66ccff', backgroundColor: 'rgba(102,204,255,0.2)', tension: 0.25 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            ensureChart('anti-cheat-alerts-chart', {
                type: 'bar',
                data: {
                    labels: hourLabels,
                    datasets: [
                        { label: 'Critical', data: alertCritical, backgroundColor: 'rgba(255,80,80,0.7)' },
                        { label: 'High', data: alertHigh, backgroundColor: 'rgba(255,140,0,0.7)' },
                        { label: 'Medium', data: alertMedium, backgroundColor: 'rgba(255,215,0,0.7)' },
                        { label: 'Low', data: alertLow, backgroundColor: 'rgba(135,206,250,0.7)' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    }
                }
            });

            ensureChart('anti-cheat-items-chart', {
                type: 'line',
                data: {
                    labels: hourLabels,
                    datasets: [
                        { label: 'Drops', data: itemDrops, borderColor: '#7CFC00', backgroundColor: 'rgba(124,252,0,0.2)', tension: 0.25 },
                        { label: 'Pickups', data: itemPickups, borderColor: '#1E90FF', backgroundColor: 'rgba(30,144,255,0.2)', tension: 0.25 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
        
        // Attach event handlers to forms
        function attachFormHandlers() {
            // Handle user search form
            const searchForm = document.getElementById('user-search-form');
            if (searchForm && !searchForm.dataset.handlerAttached) {
                searchForm.dataset.handlerAttached = 'true';
                searchForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    await handleFormSubmission(this, '/account/admin/search-user');
                });
            }
            
            // Handle all "get-user" forms dynamically (from search results)
            document.querySelectorAll('form[action="/account/admin/get-user"]').forEach(form => {
                if (!form.dataset.handlerAttached) {
                    form.dataset.handlerAttached = 'true';
                    form.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        await handleFormSubmission(this, '/account/admin/get-user');
                    });
                }
            });

            const antiCheatForm = document.getElementById('anti-cheat-filter-form');
            if (antiCheatForm && !antiCheatForm.dataset.handlerAttached) {
                antiCheatForm.dataset.handlerAttached = 'true';
                antiCheatForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    await loadAntiCheatAlerts(this);
                });
            }

            const trendsForm = document.getElementById('anti-cheat-trends-form');
            if (trendsForm && !trendsForm.dataset.handlerAttached) {
                trendsForm.dataset.handlerAttached = 'true';
                trendsForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    await loadAntiCheatTrends(this);
                });
            }

            document.querySelectorAll('.trend-range-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    const hoursValue = this.dataset.hours;
                    const trendsFormEl = document.getElementById('anti-cheat-trends-form');
                    if (trendsFormEl) {
                        trendsFormEl.querySelector('input[name="hours"]').value = hoursValue;
                        await loadAntiCheatTrends(trendsFormEl);
                    }
                });
            });

            document.querySelectorAll('.user-anti-cheat-form').forEach(form => {
                if (form.dataset.handlerAttached) return;
                form.dataset.handlerAttached = 'true';
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    await loadUserAntiCheatLogs(this);
                });
            });

            // Handle Ban IP buttons in dynamic user details content.
            document.querySelectorAll('.ban-ip-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await banIP(this.dataset.ip, this.dataset.csrf);
                });
            });

            // Confirm forms that previously used inline onclick handlers.
            document.querySelectorAll('.admin-confirm-form').forEach(form => {
                if (form.dataset.handlerAttached) return;
                form.dataset.handlerAttached = 'true';
                form.addEventListener('submit', function(e) {
                    const message = this.dataset.confirmMessage || 'Are you sure?';
                    if (!window.confirm(message)) {
                        e.preventDefault();
                    }
                });
            });

            // Delete-user form uses typed confirmation to satisfy strict CSP (no inline handlers).
            document.querySelectorAll('.admin-delete-user-form').forEach(form => {
                if (form.dataset.handlerAttached) return;
                form.dataset.handlerAttached = 'true';
                form.addEventListener('submit', function(e) {
                    const userId = this.dataset.userId;
                    const expected = 'DELETE USER ' + userId;
                    const typed = window.prompt(
                        'Type exactly ' + expected + ' to permanently delete user ' + userId + '.'
                    );
                    if (typed === null || typed !== expected) {
                        if (typed !== null) {
                            window.alert('Confirmation text did not match.');
                        }
                        e.preventDefault();
                        return;
                    }

                    if (!window.confirm('Final warning: permanently delete user ' + userId + '?')) {
                        e.preventDefault();
                        return;
                    }

                    const confirmationInput = this.querySelector('input[name="confirmation"]');
                    if (confirmationInput) {
                        confirmationInput.value = typed;
                    }
                });
            });
        }

        function attachAntiCheatHandlers() {
            const csrfToken = document.querySelector('#anti-cheat-filter-form input[name="_csrf"]').value;
            document.querySelectorAll('.anti-cheat-dismiss-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await dismissAlert(this.dataset.alertId, csrfToken);
                    await loadAntiCheatAlerts(document.getElementById('anti-cheat-filter-form'));
                });
            });
            document.querySelectorAll('.anti-cheat-risk-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await loadUserRisk(this.dataset.userId, csrfToken);
                });
            });
            document.querySelectorAll('.anti-cheat-user-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await loadUserDetailsById(this.dataset.userId, csrfToken);
                });
            });
            document.querySelectorAll('.anti-cheat-legit-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await submitAlertFeedback(this.dataset.alertId, 'LEGITIMATE', csrfToken);
                    await loadAntiCheatAlerts(document.getElementById('anti-cheat-filter-form'));
                });
            });
            document.querySelectorAll('.anti-cheat-confirm-btn').forEach(button => {
                if (button.dataset.handlerAttached) return;
                button.dataset.handlerAttached = 'true';
                button.addEventListener('click', async function() {
                    await submitAlertFeedback(this.dataset.alertId, 'CONFIRMED', csrfToken);
                    await loadAntiCheatAlerts(document.getElementById('anti-cheat-filter-form'));
                });
            });
        }
        
        // Initial attachment
        attachFormHandlers();
    </script>
    
</section>`;

    const html = generatePage('OpenSpell - Admin Panel', bodyContent, null, user);
    res.send(html);
});

// Route: Search User (AJAX endpoint)
router.post('/admin/search-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const query = sanitizeString(req.body.query);
        if (!query || query.trim().length === 0) {
            return res.status(400).send('<div id="user-details-content"><div class="notification error">Search query is required</div></div>');
        }

        try {
            const apiResponse = await makeApiRequest(`/api/admin/search-users?query=${encodeURIComponent(query)}&limit=50&offset=0`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
            
            const users = apiResponse.users || [];
            const total = apiResponse.total || 0;
            
            if (users.length === 0) {
                return res.send(`
                    <div id="user-details-content">
                        <div class="notification warning">
                            No users found matching "${escapeHtml(query)}"
                        </div>
                        <p style="margin-top: 16px;">Or search by User ID:</p>
                        <form method="POST" action="/account/admin/get-user" style="margin-top: 8px;">
                            <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                            <input type="number" name="userId" placeholder="User ID" required style="margin: 8px 0; padding: 8px; width: 200px;" />
                            <button type="submit" class="btn-submit">Get User by ID</button>
                        </form>
                    </div>
                `);
            }
            
            const userRows = users.map(user => {
                const isBanned = !!user.banReason;
                const banStatusBadge = isBanned 
                    ? '<span style="color: var(--error-color); margin-left: 8px; font-weight: 600;">BANNED</span>' 
                    : '';
                const isMuted = !!user.muteReason;
                const muteStatusBadge = isMuted
                    ? '<span style="color: var(--warning-color); margin-left: 8px; font-weight: 600;">MUTED</span>'
                    : '';
                const adminBadge = user.isAdmin 
                    ? '<span style="color: var(--warning-color); margin-left: 8px; font-weight: 600;">ADMIN</span>' 
                    : '';
                
                return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 8px;">${user.id}</td>
                        <td style="padding: 8px;">
                            ${escapeHtml(user.username)}${adminBadge}${banStatusBadge}${muteStatusBadge}
                        </td>
                        <td style="padding: 8px;">${escapeHtml(user.displayName || user.username)}</td>
                        <td style="padding: 8px;">
                            <form method="POST" action="/account/admin/get-user" style="display: inline;">
                                <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                <input type="hidden" name="userId" value="${user.id}" />
                                <button type="submit" class="btn-submit" style="padding: 4px 12px; margin: 0;">View</button>
                            </form>
                        </td>
                    </tr>
                `;
            }).join('');
            
            res.send(`
                <div id="user-details-content">
                    <div class="notification success" style="margin-bottom: 16px;">
                        Found ${total} user(s) matching "${escapeHtml(query)}" (showing ${users.length})
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--theme-color);">
                                <th style="text-align: left; padding: 8px;">ID</th>
                                <th style="text-align: left; padding: 8px;">Username</th>
                                <th style="text-align: left; padding: 8px;">Display Name</th>
                                <th style="text-align: left; padding: 8px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userRows}
                        </tbody>
                    </table>
                </div>
            `);
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.status(500).send(`<div id="user-details-content"><div class="notification error">${escapeHtml(errorMessage)}</div></div>`);
        }
    } catch (error) {
        console.error('Search user error:', error);
        res.status(500).send('<div id="user-details-content"><div class="notification error">Internal server error</div></div>');
    }
});

// Route: Anti-cheat alert list (admin panel)
router.post('/admin/anti-cheat/alerts', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const severity = sanitizeString(req.body.severity);
        const category = sanitizeString(req.body.category);
        const dismissed = req.body.dismissed === 'true' ? 'true' : 'false';
        const params = new URLSearchParams();
        if (severity) params.set('severity', severity);
        if (category) params.set('category', category);
        params.set('dismissed', dismissed);
        params.set('limit', '50');
        params.set('offset', '0');

        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/alerts?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });

        res.json(apiResponse);
    } catch (error) {
        console.error('Anti-cheat alert list error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Dismiss anti-cheat alert
router.post('/admin/anti-cheat/alerts/:id/dismiss', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const alertId = req.params.id;
        const note = sanitizeString(req.body.note);
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/alerts/${alertId}/dismiss`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            },
            body: {
                note
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('Dismiss anti-cheat alert error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Add note to alert
router.post('/admin/anti-cheat/alerts/:id/note', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const alertId = req.params.id;
        const note = sanitizeString(req.body.note);
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/alerts/${alertId}/note`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            },
            body: {
                note
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('Alert note error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Anti-cheat alert feedback
router.post('/admin/anti-cheat/alerts/:id/feedback', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const alertId = req.params.id;
        const verdict = sanitizeString(req.body.verdict);
        const note = sanitizeString(req.body.note);
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/alerts/${alertId}/feedback`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            },
            body: {
                verdict,
                note
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('Alert feedback error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Anti-cheat user risk profile
router.post('/admin/anti-cheat/user-risk/:userId', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = req.params.userId;
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/user-risk/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('User risk error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Anti-cheat trends
router.post('/admin/anti-cheat/trends', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const hours = sanitizeString(req.body.hours) || '24';
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/trends?hours=${encodeURIComponent(hours)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('Anti-cheat trends error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Anti-cheat user logs
router.post('/admin/anti-cheat/user-logs/:userId', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = req.params.userId;
        const hours = sanitizeString(req.body.hours) || '24';
        const apiResponse = await makeApiRequest(`/api/admin/anti-cheat/user-logs/${userId}?hours=${encodeURIComponent(hours)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        res.json(apiResponse);
    } catch (error) {
        console.error('Anti-cheat user logs error:', error);
        const errorMessage = extractApiErrorMessage(error);
        res.status(500).json({ error: errorMessage });
    }
});

// Route: Get User by ID (for admin panel)
router.post('/admin/get-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        if (!userId || isNaN(userId)) {
            return res.send('<div id="user-details-content"><div class="notification error">Invalid user ID</div></div>');
        }

        // Get user ban status to check if user exists and get ban info
        let banStatus = null;
        let muteStatus = null;
        let userIPs = null;
        
        try {
            banStatus = await makeApiRequest(`/api/admin/user-ban-status/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
        } catch (error) {
            // User might not exist or endpoint failed
        }
        
        try {
            muteStatus = await makeApiRequest(`/api/admin/user-mute-status/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
        } catch (error) {
            // User might not exist or endpoint failed
        }

        try {
            userIPs = await makeApiRequest(`/api/admin/user-ips/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
        } catch (error) {
            // Failed to get IPs
        }

        if (!banStatus && !muteStatus && !userIPs) {
            return res.send('<div id="user-details-content"><div class="notification error">User not found</div></div>');
        }

        const isBanned = banStatus?.isBanned || false;
        const isPermanent = banStatus?.isPermanent || false;
        const bannedUntil = banStatus?.bannedUntil || null;
        const banReason = banStatus?.banReason || null;
        const isMuted = muteStatus?.isMuted || false;
        const isMutePermanent = muteStatus?.isPermanent || false;
        const mutedUntil = muteStatus?.mutedUntil || null;
        const muteReason = muteStatus?.muteReason || null;
        const ips = userIPs?.ips || [];

        let banStatusHtml = '';
        if (isBanned) {
            const banUntilStr = bannedUntil ? new Date(bannedUntil).toLocaleString() : 'N/A';
            banStatusHtml = `
                <div class="notification error" style="margin: 16px 0;">
                    <strong>User is Banned</strong><br/>
                    Reason: ${escapeHtml(banReason || 'N/A')}<br/>
                    ${isPermanent ? 'Permanent ban' : `Temporary until: ${banUntilStr}`}
                </div>
            `;
        } else {
            banStatusHtml = '<div class="notification success" style="margin: 16px 0;">User is not banned</div>';
        }
        
        let muteStatusHtml = '';
        if (isMuted) {
            const muteUntilStr = mutedUntil ? new Date(mutedUntil).toLocaleString() : 'N/A';
            muteStatusHtml = `
                <div class="notification warning" style="margin: 16px 0;">
                    <strong>User is Muted</strong><br/>
                    Reason: ${escapeHtml(muteReason || 'N/A')}<br/>
                    ${isMutePermanent ? 'Permanent mute' : `Temporary until: ${muteUntilStr}`}
                </div>
            `;
        } else {
            muteStatusHtml = '<div class="notification success" style="margin: 16px 0;">User is not muted</div>';
        }

        let ipsHtml = '';
        if (ips.length > 0) {
            const ipListItems = ips.map(ip => {
                const firstSeen = new Date(ip.firstSeen).toLocaleString();
                const lastSeen = new Date(ip.lastSeen).toLocaleString();
                const ipEscaped = escapeHtml(ip.ip);
                return `
                        <li style="margin: 4px 0;">
                            ${ipEscaped} 
                            (First seen: ${firstSeen}, 
                            Last seen: ${lastSeen})
                            <button 
                                type="button" 
                                data-ip="${ipEscaped}"
                                data-csrf="${getCsrfToken(req)}"
                                class="anchor-submit-button ban-ip-btn" 
                                style="margin-left: 8px;" 
                                >
                                Ban IP
                            </button>
                        </li>
                    `;
            }).join('');
            
            ipsHtml = `
                <h4>Associated IPs:</h4>
                <ul style="list-style: disc; padding-left: 24px; margin: 8px 0;">
                    ${ipListItems}
                </ul>
            `;
        } else {
            ipsHtml = '<p>No IP addresses found for this user.</p>';
        }

        const usernameHtml = userIPs?.username ? `<p><strong>Username:</strong> ${escapeHtml(userIPs.username)}</p>` : '';
        
        const banActionsHtml = !isBanned ? `
                            <div style="margin-bottom: 16px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px;">
                                <h5 style="margin-top: 0;">Permanent Ban</h5>
                                <form method="POST" action="/account/admin/ban-user" class="admin-confirm-form" data-confirm-message="Permanently ban user ${userId}? This action requires a reason.">
                                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                    <input type="hidden" name="userId" value="${userId}" />
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Ban Reason:</label>
                                        <input type="text" name="reason" placeholder="Enter reason for ban" required style="width: 100%; max-width: 500px; padding: 8px; box-sizing: border-box;" />
                                    </div>
                                    <button type="submit" class="btn-submit">Permanently Ban User</button>
                                </form>
                            </div>
                            <div style="margin-bottom: 16px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px;">
                                <h5 style="margin-top: 0;">Temporary Ban</h5>
                                <form method="POST" action="/account/admin/ban-user-temp">
                                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                    <input type="hidden" name="userId" value="${userId}" />
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Ban Reason:</label>
                                        <input type="text" name="reason" placeholder="Enter reason for ban" required style="width: 100%; max-width: 500px; padding: 8px; box-sizing: border-box;" />
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Ban Until:</label>
                                        <input type="datetime-local" name="bannedUntil" required style="padding: 8px;" />
                                    </div>
                                    <button type="submit" class="btn-submit">Temporarily Ban User</button>
                                </form>
                            </div>
                        ` : `
                            <form method="POST" action="/account/admin/unban-user" style="display: inline;" class="admin-confirm-form" data-confirm-message="Unban user ${userId}?">
                                <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                <input type="hidden" name="userId" value="${userId}" />
                                <button type="submit" class="btn-submit">Unban User</button>
                            </form>
                        `;
        
        const muteActionsHtml = !isMuted ? `
                            <div style="margin-bottom: 16px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px;">
                                <h5 style="margin-top: 0;">Permanent Mute</h5>
                                <form method="POST" action="/account/admin/mute-user" class="admin-confirm-form" data-confirm-message="Permanently mute user ${userId}? This action requires a reason.">
                                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                    <input type="hidden" name="userId" value="${userId}" />
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Mute Reason:</label>
                                        <input type="text" name="reason" placeholder="Enter reason for mute" required style="width: 100%; max-width: 500px; padding: 8px; box-sizing: border-box;" />
                                    </div>
                                    <button type="submit" class="btn-submit">Permanently Mute User</button>
                                </form>
                            </div>
                            <div style="margin-bottom: 16px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px;">
                                <h5 style="margin-top: 0;">Temporary Mute</h5>
                                <form method="POST" action="/account/admin/mute-user-temp">
                                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                    <input type="hidden" name="userId" value="${userId}" />
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Mute Reason:</label>
                                        <input type="text" name="reason" placeholder="Enter reason for mute" required style="width: 100%; max-width: 500px; padding: 8px; box-sizing: border-box;" />
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: block; margin-bottom: 4px; font-weight: 600;">Mute Until:</label>
                                        <input type="datetime-local" name="mutedUntil" required style="padding: 8px;" />
                                    </div>
                                    <button type="submit" class="btn-submit">Temporarily Mute User</button>
                                </form>
                            </div>
                        ` : `
                            <form method="POST" action="/account/admin/unmute-user" style="display: inline;" class="admin-confirm-form" data-confirm-message="Unmute user ${userId}?">
                                <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                <input type="hidden" name="userId" value="${userId}" />
                                <button type="submit" class="btn-submit">Unmute User</button>
                            </form>
                        `;

        const deleteUserActionsHtml = (isBanned && isPermanent) ? `
                            <div style="margin-bottom: 16px; padding: 16px; background: #2a1616; border: 1px solid #7a1f1f; border-radius: 8px; width: 100%;">
                                <h5 style="margin-top: 0; color: #ff9b9b;">Danger Zone: Permanently Delete User</h5>
                                <p style="margin: 0 0 12px 0;">
                                    This permanently deletes this account and all user-linked data.
                                    This action cannot be undone.
                                </p>
                                <form method="POST" action="/account/admin/delete-user" class="admin-delete-user-form" data-user-id="${userId}">
                                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                    <input type="hidden" name="userId" value="${userId}" />
                                    <input type="hidden" name="confirmation" value="" />
                                    <button type="submit" class="btn-submit" style="background: #8e2525; border-color: #aa3333;">Delete User</button>
                                </form>
                            </div>
                        ` : `
                            <div style="margin-bottom: 16px; padding: 16px; background: var(--menu-selected-item-bg-color); border-radius: 8px; width: 100%;">
                                <h5 style="margin-top: 0;">Delete User</h5>
                                <p style="margin: 0;">User deletion is only available for permanently banned users.</p>
                            </div>
                        `;

        res.send(`
            <div id="user-details-content">
                <div style="margin-bottom: 16px;">
                    <a href="/account/admin" class="anchor-submit-button">← Back to Search</a>
                </div>
                <h3>User ID: ${userId}</h3>
                ${usernameHtml}
                
                ${banStatusHtml}
                ${muteStatusHtml}
                
                <div style="margin-top: 24px;">
                    <h4>Actions:</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                        ${banActionsHtml}
                        ${muteActionsHtml}
                        ${deleteUserActionsHtml}
                    </div>
                </div>
                
                <div style="margin-top: 24px;">
                    ${ipsHtml}
                </div>

                <div style="margin-top: 24px;">
                    <h4>Anti-Cheat Logs</h4>
                    <form class="user-anti-cheat-form" data-user-id="${userId}" method="POST" action="/account/admin/anti-cheat/user-logs/${userId}" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                        <label style="display: flex; align-items: center; gap: 6px;">
                            Hours
                            <input type="number" name="hours" min="1" max="168" value="24" style="padding: 8px; width: 100px;" />
                        </label>
                        <button type="submit" class="btn-submit">Load Logs</button>
                    </form>
                    <div id="user-anti-cheat-results-${userId}" style="margin-top: 12px;"></div>
                </div>
            </div>
        `);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).send('<div class="notification error">Internal server error</div>');
    }
});

// Route: Ban User
router.post('/admin/ban-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        const reason = sanitizeString(req.body.reason);
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        if (!reason || reason.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Ban reason is required'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/ban-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId,
                    reason: reason.trim()
                }
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} banned successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to ban user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Ban user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Ban User (Temporary)
router.post('/admin/ban-user-temp', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        const reason = sanitizeString(req.body.reason);
        const bannedUntil = req.body.bannedUntil;
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        if (!reason || reason.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Ban reason is required'));
        }
        
        if (!bannedUntil) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Ban expiration date is required'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/ban-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId,
                    reason: reason.trim(),
                    bannedUntil: new Date(bannedUntil).toISOString()
                }
            });
            
            const banUntilStr = new Date(bannedUntil).toLocaleString();
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} temporarily banned until ${banUntilStr}`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to ban user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Ban user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Unban User
router.post('/admin/unban-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/unban-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId
                }
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} unbanned successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to unban user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Unban user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Mute User
router.post('/admin/mute-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        const reason = sanitizeString(req.body.reason);
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        if (!reason || reason.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Mute reason is required'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/mute-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId,
                    reason: reason.trim()
                }
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} muted successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to mute user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Mute user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Mute User (Temporary)
router.post('/admin/mute-user-temp', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        const reason = sanitizeString(req.body.reason);
        const mutedUntil = req.body.mutedUntil;
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        if (!reason || reason.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Mute reason is required'));
        }
        
        if (!mutedUntil) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Mute expiration date is required'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/mute-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId,
                    reason: reason.trim(),
                    mutedUntil: new Date(mutedUntil).toISOString()
                }
            });
            
            const muteUntilStr = new Date(mutedUntil).toLocaleString();
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} temporarily muted until ${muteUntilStr}`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to mute user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Mute user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Unmute User
router.post('/admin/unmute-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        
        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/unmute-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId
                }
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`User ${userId} unmuted successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to unmute user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Unmute user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Delete User (permanently banned users only)
router.post('/admin/delete-user', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10);
        const confirmation = sanitizeString(req.body.confirmation);

        if (!userId || isNaN(userId)) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Invalid user ID'));
        }

        if (!confirmation || confirmation !== `DELETE USER ${userId}`) {
            return res.redirect('/account/admin?error=' + encodeURIComponent(`Confirmation must match exactly: DELETE USER ${userId}`));
        }

        try {
            const apiResponse = await makeApiRequest('/api/admin/delete-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    userId,
                    confirmation
                }
            });

            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(apiResponse.message || `User ${userId} deleted successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to delete user'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Delete user error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});


// Route: Ban IP
router.post('/admin/ban-ip', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const ip = sanitizeString(req.body.ip);
        const reason = sanitizeString(req.body.reason);
        const bannedUntil = req.body.bannedUntil ? new Date(req.body.bannedUntil).toISOString() : null;
        
        if (!ip || ip.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('IP address is required'));
        }
        
        if (!reason || reason.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('Ban reason is required'));
        }
        
        try {
            const body = {
                ip: ip.trim(),
                reason: reason.trim()
            };
            if (bannedUntil) {
                body.bannedUntil = bannedUntil;
            }
            
            const apiResponse = await makeApiRequest('/api/admin/ban-ip', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: body
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`IP ${ip.trim()} banned successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to ban IP'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Ban IP error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: Unban IP
router.post('/admin/unban-ip', requireAdmin, csrfProtection, async (req, res) => {
    try {
        const ip = sanitizeString(req.body.ip);
        
        if (!ip || ip.trim().length === 0) {
            return res.redirect('/account/admin?error=' + encodeURIComponent('IP address is required'));
        }
        
        try {
            const apiResponse = await makeApiRequest('/api/admin/unban-ip', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                },
                body: {
                    ip: ip.trim()
                }
            });
            
            if (apiResponse.success) {
                return res.redirect('/account/admin?success=' + encodeURIComponent(`IP ${ip.trim()} unbanned successfully`));
            } else {
                return res.redirect('/account/admin?error=' + encodeURIComponent(apiResponse.error || 'Failed to unban IP'));
            }
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('Unban IP error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

// Route: List Banned IPs
router.get('/admin/banned-ips', requireAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;
        
        try {
            const apiResponse = await makeApiRequest(`/api/admin/banned-ips?limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
            
            const user = await getUserInfo(req, false);
            const bannedIPs = apiResponse.bannedIPs || [];
            const total = apiResponse.total || 0;
            
            let bannedIPsHtml = '';
            if (bannedIPs.length === 0) {
                bannedIPsHtml = '<p>No banned IPs found.</p>';
            } else {
                const tableRows = bannedIPs.map(ipBan => {
                    const ipEscaped = escapeHtml(ipBan.ip);
                    const reasonEscaped = escapeHtml(ipBan.banReason || 'N/A');
                    const bannedUntilStr = ipBan.bannedUntil ? new Date(ipBan.bannedUntil).toLocaleString() : 'Permanent';
                    const createdAtStr = new Date(ipBan.createdAt).toLocaleString();
                    return `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                    <td style="padding: 8px;">${ipEscaped}</td>
                                    <td style="padding: 8px;">${reasonEscaped}</td>
                                    <td style="padding: 8px;">${bannedUntilStr}</td>
                                    <td style="padding: 8px;">${createdAtStr}</td>
                                    <td style="padding: 8px;">
                                        <form method="POST" action="/account/admin/unban-ip" style="display: inline;">
                                            <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                                            <input type="hidden" name="ip" value="${ipEscaped}" />
                                            <button type="submit" class="anchor-submit-button">Unban</button>
                                        </form>
                                    </td>
                                </tr>
                            `;
                }).join('');
                
                bannedIPsHtml = `
                    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--theme-color);">
                                <th style="text-align: left; padding: 8px;">IP Address</th>
                                <th style="text-align: left; padding: 8px;">Reason</th>
                                <th style="text-align: left; padding: 8px;">Banned Until</th>
                                <th style="text-align: left; padding: 8px;">Created</th>
                                <th style="text-align: left; padding: 8px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    <p>Showing ${offset + 1}-${Math.min(offset + limit, total)} of ${total} banned IPs</p>
                `;
            }
            
            const bodyContent = `
<section id="admin-panel">
    <h1 class="sect-h">
        <span>Admin Panel - Banned IPs</span>
    </h1>
    <div id="admin_container" class="content-box">
        <ul id="settings" class="card">
            <li class="card-title">ADMIN MENU</li>
            <li>
                <ul class="cfg-list">
                    <li><a href="/account" title="My Account">My Account</a></li>
                    <li><a href="/account/admin" title="Admin Panel">Admin Panel</a></li>
                </ul>
            </li>
        </ul>
        <div id="admin-content" class="card" style="flex-grow: 1;">
            <div style="margin-bottom: 16px;">
                <a href="/account/admin" class="anchor-submit-button">← Back to Admin Panel</a>
            </div>
            <h2>Banned IP Addresses</h2>
            ${bannedIPsHtml}
        </div>
    </div>
</section>
            `;
            
            const html = generatePage('OpenSpell - Admin Panel - Banned IPs', bodyContent, null, user);
            res.send(html);
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect('/account/admin?error=' + encodeURIComponent(errorMessage));
        }
    } catch (error) {
        console.error('List banned IPs error:', error);
        return res.redirect('/account/admin?error=' + encodeURIComponent('Internal server error'));
    }
});

module.exports = router;

