/**
 * Authentication Routes
 * Handles login, registration, password reset, and email verification
 */

const express = require('express');
const router = express.Router();
const { getUserInfo, isAuthenticated } = require('../services/auth');
const { generatePage, SHOW_FORGOT_PASSWORD, EMAIL_ENABLED, SHOW_EMAIL_FIELD, EMAIL_REQUIRED, RECAPTCHA_ENABLED, RECAPTCHA_SITE_KEY } = require('../services/html');
const { getCsrfToken, csrfProtection } = require('../services/csrf');
const { sanitizeString, isValidEmail, isValidUsername } = require('../services/validation');
const { makeApiRequest, extractApiErrorMessage } = require('../services/api');
const { escapeHtml } = require('../utils/helpers');
const { authLimiter, registerLimiter, emailLimiter, verificationLimiter } = require('../middleware/rateLimit');

// reCAPTCHA configuration
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';

// Validation configuration
const USERNAME_MIN_LENGTH = parseInt(process.env.USERNAME_MIN_LENGTH || '2', 10);
const USERNAME_MAX_LENGTH = parseInt(process.env.USERNAME_MAX_LENGTH || '16', 10);
const USERNAME_ALLOW_SPACES = process.env.USERNAME_ALLOW_SPACES !== 'false';

const PASSWORD_MIN_LENGTH = parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10);
const PASSWORD_MAX_LENGTH = parseInt(process.env.PASSWORD_MAX_LENGTH || '64', 10);
const PASSWORD_REQUIRE_UPPERCASE = process.env.PASSWORD_REQUIRE_UPPERCASE === 'true';
const PASSWORD_REQUIRE_LOWERCASE = process.env.PASSWORD_REQUIRE_LOWERCASE === 'true';
const PASSWORD_REQUIRE_NUMBERS = process.env.PASSWORD_REQUIRE_NUMBERS === 'true';
const PASSWORD_REQUIRE_SPECIAL_CHARS = process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true';

const DISPLAYNAME_MIN_LENGTH = parseInt(process.env.DISPLAYNAME_MIN_LENGTH || '2', 10);
const DISPLAYNAME_MAX_LENGTH = parseInt(process.env.DISPLAYNAME_MAX_LENGTH || '25', 10);
const DISPLAYNAME_ALLOW_SPACES = process.env.DISPLAYNAME_ALLOW_SPACES !== 'false';

function isAsciiAlphanumericName(value, allowSpaces) {
    const pattern = allowSpaces ? /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/ : /^[A-Za-z0-9]+$/;
    return pattern.test(value);
}

/**
 * Verify reCAPTCHA v2 token with Google
 * @param {string} token - The g-recaptcha-response token from the form
 * @param {string} remoteIp - The user's IP address (optional)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function verifyRecaptcha(token, remoteIp = null) {
    if (!RECAPTCHA_ENABLED) {
        return { success: true }; // Skip if reCAPTCHA is disabled
    }
    
    if (!token) {
        return { success: false, error: 'Please complete the reCAPTCHA verification' };
    }
    
    if (!RECAPTCHA_SECRET_KEY) {
        console.error('RECAPTCHA_SECRET_KEY is not configured');
        return { success: false, error: 'reCAPTCHA configuration error' };
    }
    
    try {
        const params = new URLSearchParams({
            secret: RECAPTCHA_SECRET_KEY,
            response: token
        });
        
        if (remoteIp) {
            params.append('remoteip', remoteIp);
        }
        
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        
        const data = await response.json();
        
        if (!data.success) {
            console.warn('reCAPTCHA verification failed:', data['error-codes']);
            return { 
                success: false, 
                error: 'reCAPTCHA verification failed. Please try again.' 
            };
        }
        
        return { success: true };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return { 
            success: false, 
            error: 'Failed to verify reCAPTCHA. Please try again.' 
        };
    }
}

// Route: Dynamic Registration Validator JavaScript
router.get('/js/registration-validator.js', (req, res) => {
    // Set cache headers for 5 minutes (in case validation rules change)
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    const validatorJs = `
/**
 * OpenSpell Registration Validator
 * Dynamically generated based on server validation rules
 * Generated: ${new Date().toISOString()}
 */

(function() {
    'use strict';
    
    // Validation rules from server
    const VALIDATION_RULES = {
        username: {
            minLength: ${USERNAME_MIN_LENGTH},
            maxLength: ${USERNAME_MAX_LENGTH},
            allowSpaces: ${USERNAME_ALLOW_SPACES}
        },
        password: {
            minLength: ${PASSWORD_MIN_LENGTH},
            maxLength: ${PASSWORD_MAX_LENGTH},
            requireUppercase: ${PASSWORD_REQUIRE_UPPERCASE},
            requireLowercase: ${PASSWORD_REQUIRE_LOWERCASE},
            requireNumbers: ${PASSWORD_REQUIRE_NUMBERS},
            requireSpecialChars: ${PASSWORD_REQUIRE_SPECIAL_CHARS}
        },
        displayName: {
            minLength: ${DISPLAYNAME_MIN_LENGTH},
            maxLength: ${DISPLAYNAME_MAX_LENGTH},
            allowSpaces: ${DISPLAYNAME_ALLOW_SPACES}
        }
    };
    
    // Validation functions
    function validateUsername(username) {
        if (!username) {
            return { valid: false, message: 'Username is required' };
        }
        
        if (username.length < VALIDATION_RULES.username.minLength) {
            return { valid: false, message: \`Username must be at least \${VALIDATION_RULES.username.minLength} characters\` };
        }
        
        if (username.length > VALIDATION_RULES.username.maxLength) {
            return { valid: false, message: \`Username must be no more than \${VALIDATION_RULES.username.maxLength} characters\` };
        }
        
        if (!VALIDATION_RULES.username.allowSpaces && username.includes(' ')) {
            return { valid: false, message: 'Username cannot contain spaces' };
        }
        
        // Check for valid characters (alphanumeric + optional spaces)
        const pattern = VALIDATION_RULES.username.allowSpaces ? /^[a-zA-Z0-9 ]+$/ : /^[a-zA-Z0-9]+$/;
        if (!pattern.test(username)) {
            return { valid: false, message: 'Username can only contain letters and numbers' + (VALIDATION_RULES.username.allowSpaces ? ' and spaces' : '') };
        }
        
        return { valid: true, message: '' };
    }
    
    function validatePassword(password) {
        if (!password) {
            return { valid: false, message: 'Password is required' };
        }
        
        if (password.length < VALIDATION_RULES.password.minLength) {
            return { valid: false, message: \`Password must be at least \${VALIDATION_RULES.password.minLength} characters\` };
        }
        
        if (password.length > VALIDATION_RULES.password.maxLength) {
            return { valid: false, message: \`Password must be no more than \${VALIDATION_RULES.password.maxLength} characters\` };
        }
        
        if (VALIDATION_RULES.password.requireUppercase && !/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        
        if (VALIDATION_RULES.password.requireLowercase && !/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        
        if (VALIDATION_RULES.password.requireNumbers && !/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        
        if (VALIDATION_RULES.password.requireSpecialChars && !/[^a-zA-Z0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one special character' };
        }
        
        return { valid: true, message: '' };
    }
    
    function validateDisplayName(displayName) {
        // Display name is optional, so empty is valid
        if (!displayName || displayName.trim() === '') {
            return { valid: true, message: '' };
        }
        
        const trimmed = displayName.trim();
        
        if (trimmed.length < VALIDATION_RULES.displayName.minLength) {
            return { valid: false, message: \`Display name must be at least \${VALIDATION_RULES.displayName.minLength} characters\` };
        }
        
        if (trimmed.length > VALIDATION_RULES.displayName.maxLength) {
            return { valid: false, message: \`Display name must be no more than \${VALIDATION_RULES.displayName.maxLength} characters\` };
        }
        
        if (!VALIDATION_RULES.displayName.allowSpaces && trimmed.includes(' ')) {
            return { valid: false, message: 'Display name cannot contain spaces' };
        }

        const pattern = VALIDATION_RULES.displayName.allowSpaces ? /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/ : /^[A-Za-z0-9]+$/;
        if (!pattern.test(trimmed)) {
            return { valid: false, message: 'Display name can only contain ASCII letters and numbers' + (VALIDATION_RULES.displayName.allowSpaces ? ' and spaces' : '') };
        }
        
        return { valid: true, message: '' };
    }
    
    function validateEmail(email) {
        // Email is optional unless EMAIL_REQUIRED is set
        if (!email || email.trim() === '') {
            return { valid: true, message: '' };
        }
        
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Invalid email format' };
        }
        
        return { valid: true, message: '' };
    }
    
    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return { valid: false, message: 'Please confirm your password' };
        }
        
        if (password !== confirmPassword) {
            return { valid: false, message: 'Passwords do not match' };
        }
        
        return { valid: true, message: '' };
    }
    
    // UI feedback functions
    function showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        // Find the frm-row parent div
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        
        // Remove any error elements that might be inside the frm-row (cleanup)
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) {
            innerError.remove();
        }
        
        // Check if there's already an error element right after the frm-row
        let errorElement = frmRow.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('field-error')) {
            // Create new error element
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            // Insert immediately after the frm-row
            if (frmRow.nextSibling) {
                frmRow.parentNode.insertBefore(errorElement, frmRow.nextSibling);
            } else {
                frmRow.parentNode.appendChild(errorElement);
            }
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showFieldValid(field) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        
        // Find the frm-row parent div
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        
        // Remove any error elements inside the frm-row
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) {
            innerError.remove();
        }
        
        // Hide error element after the frm-row
        const errorElement = frmRow.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.style.display = 'none';
        }
    }
    
    function clearFieldFeedback(field) {
        field.classList.remove('valid', 'invalid');
        
        // Find the frm-row parent div
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        
        // Remove any error elements inside the frm-row
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) {
            innerError.remove();
        }
        
        // Hide error element after the frm-row
        const errorElement = frmRow.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.style.display = 'none';
        }
    }
    
    // Initialize validation when DOM is ready
    function initializeValidation() {
        const usernameInput = document.getElementById('username-input');
        const emailInput = document.getElementById('email-input');
        const displayNameInput = document.getElementById('display-name-input');
        const passwordInput = document.getElementById('password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');
        const form = document.getElementById('register-form');
        
        if (!form) return; // Not on registration page
        
        // Add CSS for validation feedback
        const style = document.createElement('style');
        style.textContent = \`
            input.invalid,
            input[type="text"].invalid,
            input[type="email"].invalid,
            input[type="password"].invalid {
                border: 2px solid #ff4444 !important;
            }
            input.valid,
            input[type="text"].valid,
            input[type="email"].valid,
            input[type="password"].valid {
                border: 2px solid #44cc44 !important;
            }
            .field-error {
                color: #ff4444;
                font-size: 0.9em;
                padding: 6px 10px;
                margin-top: -4px;
                margin-bottom: 8px;
                display: none;
                background-color: rgba(255, 68, 68, 0.1);
                border-left: 3px solid #ff4444;
                border-radius: 3px;
            }
        \`;
        document.head.appendChild(style);
        
        // Validate on blur (when user leaves field)
        if (usernameInput) {
            usernameInput.addEventListener('blur', function() {
                const result = validateUsername(this.value);
                if (!result.valid) {
                    showFieldError(this, result.message);
                } else {
                    showFieldValid(this);
                }
            });
            
            usernameInput.addEventListener('input', function() {
                if (this.classList.contains('invalid') || this.classList.contains('valid')) {
                    const result = validateUsername(this.value);
                    if (!result.valid) {
                        showFieldError(this, result.message);
                    } else {
                        showFieldValid(this);
                    }
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const result = validateEmail(this.value);
                if (!result.valid) {
                    showFieldError(this, result.message);
                } else if (this.value.trim()) {
                    showFieldValid(this);
                } else {
                    clearFieldFeedback(this);
                }
            });
        }
        
        if (displayNameInput) {
            displayNameInput.addEventListener('blur', function() {
                const result = validateDisplayName(this.value);
                if (!result.valid) {
                    showFieldError(this, result.message);
                } else if (this.value.trim()) {
                    showFieldValid(this);
                } else {
                    clearFieldFeedback(this);
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', function() {
                const result = validatePassword(this.value);
                if (!result.valid) {
                    showFieldError(this, result.message);
                } else {
                    showFieldValid(this);
                }
                
                // Also revalidate confirm password if it has a value
                if (confirmPasswordInput && confirmPasswordInput.value) {
                    const confirmResult = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
                    if (!confirmResult.valid) {
                        showFieldError(confirmPasswordInput, confirmResult.message);
                    } else {
                        showFieldValid(confirmPasswordInput);
                    }
                }
            });
            
            passwordInput.addEventListener('input', function() {
                if (this.classList.contains('invalid') || this.classList.contains('valid')) {
                    const result = validatePassword(this.value);
                    if (!result.valid) {
                        showFieldError(this, result.message);
                    } else {
                        showFieldValid(this);
                    }
                }
            });
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', function() {
                const result = validateConfirmPassword(passwordInput.value, this.value);
                if (!result.valid) {
                    showFieldError(this, result.message);
                } else {
                    showFieldValid(this);
                }
            });
            
            confirmPasswordInput.addEventListener('input', function() {
                if (this.classList.contains('invalid') || this.classList.contains('valid')) {
                    const result = validateConfirmPassword(passwordInput.value, this.value);
                    if (!result.valid) {
                        showFieldError(this, result.message);
                    } else {
                        showFieldValid(this);
                    }
                }
            });
        }
        
        // Validate all fields before submit
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            if (usernameInput) {
                const result = validateUsername(usernameInput.value);
                if (!result.valid) {
                    showFieldError(usernameInput, result.message);
                    isValid = false;
                }
            }
            
            if (emailInput && emailInput.value.trim()) {
                const result = validateEmail(emailInput.value);
                if (!result.valid) {
                    showFieldError(emailInput, result.message);
                    isValid = false;
                }
            }
            
            if (displayNameInput && displayNameInput.value.trim()) {
                const result = validateDisplayName(displayNameInput.value);
                if (!result.valid) {
                    showFieldError(displayNameInput, result.message);
                    isValid = false;
                }
            }
            
            if (passwordInput) {
                const result = validatePassword(passwordInput.value);
                if (!result.valid) {
                    showFieldError(passwordInput, result.message);
                    isValid = false;
                }
            }
            
            if (confirmPasswordInput) {
                const result = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
                if (!result.valid) {
                    showFieldError(confirmPasswordInput, result.message);
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeValidation);
    } else {
        initializeValidation();
    }
})();
`;
    
    res.send(validatorJs);
});

// Route: Login page
router.get('/login', async (req, res) => {
    // Redirect to account if already logged in
    if (isAuthenticated(req)) {
        return res.redirect('/account');
    }
    
    // Get user info for header (should be null if not logged in)
    const user = await getUserInfo(req, false);
    
    // Generate CSRF token for this form
    const csrfToken = getCsrfToken(req);
    
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    
    const bodyContent = `
<section id="login">

    <div class="auth-wrap">

        <div class="auth-card card">

            <div id="login-brand-img" title="OpenSpell"></div>

            <div class="frm-wrap">

                <form action="/login" name="login-form" id="login-form" method="POST">
                    <input type="hidden" name="_csrf" value="${csrfToken}" />

                    <div class="frm-row">
                        <label for="username-input">Username</label>
                        <input type="text" id="username-input" name="username" maxlength="16" placeholder="Username" required />
                    </div>

                    <div class="frm-row">
                        <label for="password-input">Password</label>
                        <input type="password" id="password-input" name="password" maxlength="64" placeholder="Password" required />
                    </div>

                    ${SHOW_FORGOT_PASSWORD && EMAIL_ENABLED ? `
                    <div class="frm-row frm-row--cntr" style="margin-top: 8px; margin-bottom: 8px;">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    ` : ''}

                    ${RECAPTCHA_ENABLED && RECAPTCHA_SITE_KEY ? `
                    <div class="frm-row frm-row--cntr">
                        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                        <div class="captcha-box">
                            <div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>
                        </div>
                    </div>
                    ` : ''}

                    <div id="err-msg-row" class="frm-row">
                        <span id="status-msg"${errorMessage ? ' style="color: #ff4444;"' : ''}>${errorMessage}</span>
                    </div>

                    <div class="frm-row frm-row--cntr">
                        <input type="submit" id="submit-btn" class="btn-submit" name="submit" value="Login" />
                    </div>

                    <div class="frm-row frm-row--cntr" style="margin-top:24px;flex-direction:column;">
                        <div style="margin:4px;">Not Registered? <a href="/register" title="Register">Create an Account</a></div>
                    </div>
            
                </form>

                <script type="text/javascript" src="/js/checkfields.js?v=3"></script>
                <script type="text/javascript" src="/js/login.js"></script>
                
            </div>
            
        </div>

        <div style="margin-top: 8px;">
            <a href="/" style="padding:8px;" title="Home">Home</a>
        </div>

    </div>
    
</section>`;

    const html = generatePage('OpenSpell - Login', bodyContent, null, user);
    res.send(html);
});

// Route: POST Login - Handle login form submission
router.post('/login', authLimiter, csrfProtection, async (req, res) => {
    try {
        const username = sanitizeString(req.body.username);
        const password = req.body.password; // Don't sanitize password
        
        // Validation
        if (!username || !password) {
            return res.redirect(`/login?error=${encodeURIComponent('Username and password are required')}`);
        }
        
        if (!isValidUsername(username)) {
            return res.redirect(`/login?error=${encodeURIComponent('Invalid username format')}`);
        }
        
        // Verify reCAPTCHA if enabled
        const recaptchaToken = req.body['g-recaptcha-response'];
        const recaptchaResult = await verifyRecaptcha(recaptchaToken, req.ip);
        
        if (!recaptchaResult.success) {
            return res.redirect(`/login?error=${encodeURIComponent(recaptchaResult.error || 'reCAPTCHA verification failed')}`);
        }
        
        // Call API server
        let apiResponse;
        try {
            apiResponse = await makeApiRequest('/api/auth/login', {
                method: 'POST',
                body: {
                    username,
                    password
                }
            });
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
        }
        
        if (apiResponse && apiResponse.success && apiResponse.user && apiResponse.token) {
            // Store in session
            req.session.userId = apiResponse.user.id;
            req.session.username = apiResponse.user.username;
            req.session.displayName = apiResponse.user.displayName;
            req.session.token = apiResponse.token;
            
            return res.redirect('/account');
        } else {
            return res.redirect(`/login?error=${encodeURIComponent(apiResponse?.error || 'Invalid credentials')}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.redirect(`/login?error=${encodeURIComponent('Internal server error')}`);
    }
});

// Route: Register page
router.get('/register', async (req, res) => {
    // Redirect to account if already logged in
    if (isAuthenticated(req)) {
        return res.redirect('/account');
    }
    
    // Get user info for header (should be null if not logged in)
    const user = await getUserInfo(req, false);
    
    // Generate CSRF token for this form
    const csrfToken = getCsrfToken(req);
    
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    
    const bodyContent = `
<section id="register">

    <div class="auth-wrap">

        <div class="auth-card card">

            <div id="login-brand-img" title="OpenSpell"></div>

            <div class="frm-wrap">

                <form action="/register" name="register-form" id="register-form" method="POST">
                    <input type="hidden" name="_csrf" value="${csrfToken}" />

                    <div class="frm-row">
                        <label for="username-input">Username</label>
                        <input type="text" id="username-input" name="username" maxlength="16" placeholder="Username" required />
                    </div>

                    ${SHOW_EMAIL_FIELD && EMAIL_REQUIRED ? `
                    <div class="frm-row">
                        <label for="email-input">Email${EMAIL_REQUIRED ? ' <span style="color: #ff4444;">*</span>' : ''}</label>
                        <input type="email" id="email-input" name="email" maxlength="255" placeholder="Email" ${EMAIL_REQUIRED ? 'required' : ''} />
                    </div>
                    ` : SHOW_EMAIL_FIELD && !EMAIL_REQUIRED ? `
                    <div class="frm-row">
                        <label for="email-input">Email (Optional)</label>
                        <input type="email" id="email-input" name="email" maxlength="255" placeholder="Email (optional)" />
                    </div>
                    ` : ''}

                    <div class="frm-row">
                        <label for="display-name-input">Display Name</label>
                        <input type="text" id="display-name-input" name="display-name" maxlength="50" placeholder="Display Name (optional)" />
                     </div>

                    <div style="margin-bottom: 8px; color: #888; font-size: 0.9em; padding: 0 4px;">
                        This is how other players will see you.<br> If left blank, your username will be used.
                    </div>


                    <div class="frm-row">
                        <label for="password-input">Password</label>
                        <input type="password" id="password-input" name="password" maxlength="64" placeholder="Password" required />
                    </div>

                    <div class="frm-row">
                        <label for="confirm-password-input">Confirm Password</label>
                        <input type="password" id="confirm-password-input" name="confirm-password" maxlength="64" placeholder="Confirm Password" required />
                    </div>

                    <div class="frm-row">
                        <input type="checkbox" id="accept-terms-checkbox" name="accept-terms" value="true" />
                        <label for="accept-terms-checkbox">I acknowledge that I have read and agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a>.</label>
                    </div>

                    ${RECAPTCHA_ENABLED && RECAPTCHA_SITE_KEY ? `
                    <div class="frm-row frm-row--cntr">
                        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                        <div class="captcha-box">
                            <div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>
                        </div>
                    </div>
                    ` : ''}

                    <div id="err-msg-row" class="frm-row">
                        <span id="status-msg"${errorMessage ? ' style="color: #ff4444;"' : ''}>${errorMessage}</span>
                    </div>

                    <div class="frm-row frm-row--cntr">
                        <input type="submit" id="submit-btn" class="btn-submit" name="submit" value="Register" />
                    </div>
            
                    <div class="frm-row frm-row--cntr" style="margin-top:24px;flex-direction:column;">
                        <div style="margin:4px;">Already have an account?</div>
                        <div style="margin:4px;"><a href="/login" title="Login">Login Now</a></div>
                    </div>

                </form>

                <script type="text/javascript" src="/js/checkfields.js?v=3"></script>
                <script type="text/javascript" src="/js/registration.js?v=3"></script>
                <script type="text/javascript" src="/js/registration-validator.js"></script>
                
            </div>
            
        </div>

        <div style="margin-top: 8px;">
            <a href="/" style="padding:8px;" title="Home">Home</a>
        </div>

    </div>

</section>`;

    const html = generatePage('OpenSpell - Register', bodyContent, null, user);
    res.send(html);
});

// Route: POST Register - Handle registration form submission
router.post('/register', registerLimiter, csrfProtection, async (req, res) => {
    try {
        const username = sanitizeString(req.body.username);
        const email = sanitizeString(req.body.email);
        const displayName = sanitizeString(req.body['display-name']);
        const password = req.body.password; // Don't sanitize password
        const confirmPassword = req.body['confirm-password'];
        const acceptTerms = req.body['accept-terms'] === 'true' || req.body['accept-terms'] === true;
        
        // Helper to log suspicious activity (bypassed client-side validation)
        const logSuspiciousActivity = (field, reason) => {
            //TODO log event in database
            console.warn(`[SUSPICIOUS ACTIVITY] IP: ${req.ip}, Field: ${field}, Reason: ${reason}, User-Agent: ${req.get('user-agent')}`);
        };
        
        // Validation with environment variable rules
        if (!username || !password) {
            logSuspiciousActivity('username/password', 'Missing required fields');
            return res.redirect(`/register?error=${encodeURIComponent('Username and password are required')}`);
        }
        
        // Username validation
        if (username.length < USERNAME_MIN_LENGTH) {
            logSuspiciousActivity('username', `Length ${username.length} < minimum ${USERNAME_MIN_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Username must be at least ${USERNAME_MIN_LENGTH} characters`)}`);
        }
        
        if (username.length > USERNAME_MAX_LENGTH) {
            logSuspiciousActivity('username', `Length ${username.length} > maximum ${USERNAME_MAX_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Username must be no more than ${USERNAME_MAX_LENGTH} characters`)}`);
        }
        
        if (!USERNAME_ALLOW_SPACES && username.includes(' ')) {
            logSuspiciousActivity('username', 'Contains spaces when not allowed');
            return res.redirect(`/register?error=${encodeURIComponent('Username cannot contain spaces')}`);
        }
        
        if (!isValidUsername(username)) {
            logSuspiciousActivity('username', 'Invalid format');
            return res.redirect(`/register?error=${encodeURIComponent('Invalid username format. Username must contain only letters and numbers' + (USERNAME_ALLOW_SPACES ? ' and spaces' : ''))}`);
        }

        if (!isAsciiAlphanumericName(username, USERNAME_ALLOW_SPACES)) {
            logSuspiciousActivity('username', 'Contains non-ASCII characters');
            return res.redirect(`/register?error=${encodeURIComponent('Username can only contain ASCII letters and numbers' + (USERNAME_ALLOW_SPACES ? ' and spaces' : ''))}`);
        }
        
        // Email validation
        if (EMAIL_REQUIRED && !email) {
            logSuspiciousActivity('email', 'Missing required email');
            return res.redirect(`/register?error=${encodeURIComponent('Email is required')}`);
        }
        
        if (email && !isValidEmail(email)) {
            logSuspiciousActivity('email', 'Invalid email format');
            return res.redirect(`/register?error=${encodeURIComponent('Invalid email format')}`);
        }
        
        // Display name validation
        const trimmedDisplayName = displayName ? displayName.trim() : '';
        if (trimmedDisplayName && trimmedDisplayName.length < DISPLAYNAME_MIN_LENGTH) {
            logSuspiciousActivity('displayName', `Length ${trimmedDisplayName.length} < minimum ${DISPLAYNAME_MIN_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Display name must be at least ${DISPLAYNAME_MIN_LENGTH} characters`)}`);
        }
        
        if (trimmedDisplayName && trimmedDisplayName.length > DISPLAYNAME_MAX_LENGTH) {
            logSuspiciousActivity('displayName', `Length ${trimmedDisplayName.length} > maximum ${DISPLAYNAME_MAX_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Display name must be no more than ${DISPLAYNAME_MAX_LENGTH} characters`)}`);
        }
        
        if (!DISPLAYNAME_ALLOW_SPACES && trimmedDisplayName.includes(' ')) {
            logSuspiciousActivity('displayName', 'Contains spaces when not allowed');
            return res.redirect(`/register?error=${encodeURIComponent('Display name cannot contain spaces')}`);
        }

        if (trimmedDisplayName && !isAsciiAlphanumericName(trimmedDisplayName, DISPLAYNAME_ALLOW_SPACES)) {
            logSuspiciousActivity('displayName', 'Contains non-ASCII characters');
            return res.redirect(`/register?error=${encodeURIComponent('Display name can only contain ASCII letters and numbers' + (DISPLAYNAME_ALLOW_SPACES ? ' and spaces' : ''))}`);
        }
        
        // Password validation
        if (password.length < PASSWORD_MIN_LENGTH) {
            logSuspiciousActivity('password', `Length ${password.length} < minimum ${PASSWORD_MIN_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)}`);
        }
        
        if (password.length > PASSWORD_MAX_LENGTH) {
            logSuspiciousActivity('password', `Length ${password.length} > maximum ${PASSWORD_MAX_LENGTH}`);
            return res.redirect(`/register?error=${encodeURIComponent(`Password must be no more than ${PASSWORD_MAX_LENGTH} characters`)}`);
        }
        
        if (PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
            logSuspiciousActivity('password', 'Missing required uppercase letter');
            return res.redirect(`/register?error=${encodeURIComponent('Password must contain at least one uppercase letter')}`);
        }
        
        if (PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
            logSuspiciousActivity('password', 'Missing required lowercase letter');
            return res.redirect(`/register?error=${encodeURIComponent('Password must contain at least one lowercase letter')}`);
        }
        
        if (PASSWORD_REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
            logSuspiciousActivity('password', 'Missing required number');
            return res.redirect(`/register?error=${encodeURIComponent('Password must contain at least one number')}`);
        }
        
        if (PASSWORD_REQUIRE_SPECIAL_CHARS && !/[^a-zA-Z0-9]/.test(password)) {
            logSuspiciousActivity('password', 'Missing required special character');
            return res.redirect(`/register?error=${encodeURIComponent('Password must contain at least one special character')}`);
        }
        
        if (password !== confirmPassword) {
            logSuspiciousActivity('confirmPassword', 'Passwords do not match');
            return res.redirect(`/register?error=${encodeURIComponent('Passwords do not match')}`);
        }
        
        if (!acceptTerms) {
            logSuspiciousActivity('acceptTerms', 'Terms not accepted');
            return res.redirect(`/register?error=${encodeURIComponent('You must accept the Terms & Conditions')}`);
        }
        
        // Verify reCAPTCHA if enabled
        const recaptchaToken = req.body['g-recaptcha-response'];
        const recaptchaResult = await verifyRecaptcha(recaptchaToken, req.ip);
        
        if (!recaptchaResult.success) {
            return res.redirect(`/register?error=${encodeURIComponent(recaptchaResult.error || 'reCAPTCHA verification failed')}`);
        }
        
        // Use displayName if provided and not empty, otherwise default to username
        const finalDisplayName = displayName && displayName.trim() ? displayName.trim() : username;
        
        // Call API server
        let apiResponse;
        try {
            const originalClientIp = typeof req.headers['cf-connecting-ip'] === 'string'
                ? req.headers['cf-connecting-ip']
                : '';

            apiResponse = await makeApiRequest('/api/auth/register', {
                method: 'POST',
                headers: {
                    'x-original-client-ip': originalClientIp
                },
                body: {
                    username,
                    email,
                    password,
                    displayName: finalDisplayName
                }
            });
        } catch (error) {
            console.error('API request error:', error);
            const errorMessage = extractApiErrorMessage(error);
            return res.redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
        }
        
        if (apiResponse && apiResponse.success && apiResponse.user && apiResponse.token) {
            // Store in session
            req.session.userId = apiResponse.user.id;
            req.session.username = apiResponse.user.username;
            req.session.displayName = apiResponse.user.displayName;
            req.session.token = apiResponse.token;
            
            return res.redirect('/account');
        } else {
            return res.redirect(`/register?error=${encodeURIComponent(apiResponse?.error || 'Registration failed')}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.redirect(`/register?error=${encodeURIComponent('Internal server error')}`);
    }
});

// Route: Logout
router.get('/logout', async (req, res) => {
    // Call API to logout if token exists
    if (req.session.token) {
        try {
            await makeApiRequest('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${req.session.token}`
                }
            });
        } catch (error) {
            console.error('Logout API error:', error);
        }
    }
    
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err);
        }
        res.redirect('/');
    });
});

// Route: Verify Email page
router.get('/verify-email', verificationLimiter, async (req, res) => {
    const token = req.query.token;
    
    if (!token) {
        const bodyContent = `
<section id="verify-email">
    <div class="auth-wrap">
        <div class="auth-card card">
            <h1>Email Verification</h1>
            <p style="color: #ff4444;">Invalid verification link. Please check your email for the correct link.</p>
            <p><a href="/login">Return to Login</a></p>
        </div>
    </div>
</section>`;
        const html = generatePage('OpenSpell - Verify Email', bodyContent);
        return res.send(html);
    }
    
    try {
        const response = await makeApiRequest(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
            method: 'GET'
        });
        
        if (response.success) {
            const bodyContent = `
<section id="verify-email">
    <div class="auth-wrap">
        <div class="auth-card card">
            <h1>Email Verified!</h1>
            <p style="color: #00aa00;">Your email has been successfully verified.</p>
            <p><a href="/login">Login Now</a></p>
        </div>
    </div>
</section>`;
            const html = generatePage('OpenSpell - Email Verified', bodyContent);
            return res.send(html);
        } else {
            throw new Error(response.error || 'Verification failed');
        }
    } catch (error) {
        const errorMessage = extractApiErrorMessage(error);
        const bodyContent = `
<section id="verify-email">
    <div class="auth-wrap">
        <div class="auth-card card">
            <h1>Email Verification Failed</h1>
            <p style="color: #ff4444;">${escapeHtml(errorMessage)}</p>
            <p><a href="/login">Return to Login</a></p>
        </div>
    </div>
</section>`;
        const html = generatePage('OpenSpell - Verify Email', bodyContent);
        return res.send(html);
    }
});

// Route: Forgot Password page
router.get('/forgot-password', async (req, res) => {
    if (!SHOW_FORGOT_PASSWORD || !EMAIL_ENABLED) {
        return res.redirect('/login');
    }
    
    const user = await getUserInfo(req, false);
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    const successMessage = req.query.success ? escapeHtml(req.query.success) : '';
    
    const bodyContent = `
<section id="forgot-password">
    <div class="auth-wrap">
        <div class="auth-card card">
            <div id="login-brand-img" title="OpenSpell"></div>
            <div class="frm-wrap">
                ${successMessage ? `<div style="color: #00aa00; margin-bottom: 16px; padding: 12px; background: #00aa0020; border-radius: 4px;">${successMessage}</div>` : ''}
                ${errorMessage ? `<div style="color: #ff4444; margin-bottom: 16px; padding: 12px; background: #ff444420; border-radius: 4px;">${errorMessage}</div>` : ''}
                
                <h2>Reset Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <form action="/forgot-password" method="POST">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                    
                    <div class="frm-row">
                        <label for="email-input">Email Address</label>
                        <input type="email" id="email-input" name="email" maxlength="255" placeholder="Email" required />
                    </div>
                    
                    <div class="frm-row frm-row--cntr">
                        <input type="submit" class="btn-submit" value="Send Reset Link" />
                    </div>
                    
                    <div class="frm-row frm-row--cntr" style="margin-top:24px;">
                        <a href="/login">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>`;

    const html = generatePage('OpenSpell - Forgot Password', bodyContent, null, user);
    res.send(html);
});

// Route: Forgot Password POST
router.post('/forgot-password', emailLimiter, csrfProtection, async (req, res) => {
    if (!SHOW_FORGOT_PASSWORD || !EMAIL_ENABLED) {
        return res.redirect('/login');
    }
    
    const email = sanitizeString(req.body.email);
    
    if (!email) {
        return res.redirect(`/forgot-password?error=${encodeURIComponent('Email is required')}`);
    }
    
    try {
        const response = await makeApiRequest('/api/auth/forgot-password', {
            method: 'POST',
            body: { email }
        });
        
        if (response.success) {
            return res.redirect(`/forgot-password?success=${encodeURIComponent('If an account exists with that email, a password reset link has been sent.')}`);
        } else {
            throw new Error(response.error || 'Failed to send reset email');
        }
    } catch (error) {
        const errorMessage = extractApiErrorMessage(error);
        return res.redirect(`/forgot-password?error=${encodeURIComponent(errorMessage)}`);
    }
});

// Route: Reset Password page
router.get('/reset-password', async (req, res) => {
    if (!EMAIL_ENABLED) {
        return res.redirect('/login');
    }
    
    const token = req.query.token;
    
    if (!token) {
        return res.redirect('/forgot-password?error=' + encodeURIComponent('Invalid reset token'));
    }
    
    const user = await getUserInfo(req, false);
    const errorMessage = req.query.error ? escapeHtml(req.query.error) : '';
    
    const bodyContent = `
<section id="reset-password">
    <div class="auth-wrap">
        <div class="auth-card card">
            <div id="login-brand-img" title="OpenSpell"></div>
            <div class="frm-wrap">
                ${errorMessage ? `<div style="color: #ff4444; margin-bottom: 16px; padding: 12px; background: #ff444420; border-radius: 4px;">${errorMessage}</div>` : ''}
                
                <h2>Reset Password</h2>
                <p>Enter your new password below.</p>
                
                <form action="/reset-password" method="POST">
                    <input type="hidden" name="_csrf" value="${getCsrfToken(req)}" />
                    <input type="hidden" name="token" value="${escapeHtml(token)}" />
                    
                    <div class="frm-row">
                        <label for="new-password-input">New Password</label>
                        <input type="password" id="new-password-input" name="new-password" maxlength="64" placeholder="New Password (min 8 characters)" required />
                    </div>
                    
                    <div class="frm-row">
                        <label for="confirm-password-input">Confirm New Password</label>
                        <input type="password" id="confirm-password-input" name="confirm-password" maxlength="64" placeholder="Confirm New Password" required />
                    </div>
                    
                    <div class="frm-row frm-row--cntr">
                        <input type="submit" class="btn-submit" value="Reset Password" />
                    </div>
                    
                    <div class="frm-row frm-row--cntr" style="margin-top:24px;">
                        <a href="/login">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>`;

    const html = generatePage('OpenSpell - Reset Password', bodyContent, null, user);
    res.send(html);
});

// Route: Reset Password POST
router.post('/reset-password', verificationLimiter, csrfProtection, async (req, res) => {
    if (!EMAIL_ENABLED) {
        return res.redirect('/login');
    }
    
    const token = req.body.token;
    const newPassword = req.body['new-password'];
    const confirmPassword = req.body['confirm-password'];
    
    if (!token || !newPassword) {
        return res.redirect(`/reset-password?token=${encodeURIComponent(token || '')}&error=${encodeURIComponent('Token and new password are required')}`);
    }
    
    if (newPassword !== confirmPassword) {
        return res.redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Passwords do not match')}`);
    }
    
    if (newPassword.length < 8) {
        return res.redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent('Password must be at least 8 characters')}`);
    }
    
    try {
        const response = await makeApiRequest('/api/auth/reset-password', {
            method: 'POST',
            body: { token, newPassword }
        });
        
        if (response.success) {
            return res.redirect(`/login?success=${encodeURIComponent('Password reset successfully. Please login with your new password.')}`);
        } else {
            throw new Error(response.error || 'Failed to reset password');
        }
    } catch (error) {
        const errorMessage = extractApiErrorMessage(error);
        return res.redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent(errorMessage)}`);
    }
});

module.exports = router;

