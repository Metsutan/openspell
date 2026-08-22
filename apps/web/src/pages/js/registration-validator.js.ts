import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
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

  const validatorJs = `
(function() {
    'use strict';
    
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
    
    function validateUsername(username) {
        if (!username) return { valid: false, message: 'Username is required' };
        if (username.length < VALIDATION_RULES.username.minLength) return { valid: false, message: 'Username must be at least ' + VALIDATION_RULES.username.minLength + ' characters' };
        if (username.length > VALIDATION_RULES.username.maxLength) return { valid: false, message: 'Username must be no more than ' + VALIDATION_RULES.username.maxLength + ' characters' };
        if (!VALIDATION_RULES.username.allowSpaces && username.includes(' ')) return { valid: false, message: 'Username cannot contain spaces' };
        const pattern = VALIDATION_RULES.username.allowSpaces ? /^[a-zA-Z0-9 ]+$/ : /^[a-zA-Z0-9]+$/;
        if (!pattern.test(username)) return { valid: false, message: 'Username can only contain letters and numbers' + (VALIDATION_RULES.username.allowSpaces ? ' and spaces' : '') };
        return { valid: true, message: '' };
    }
    
    function validatePassword(password) {
        if (!password) return { valid: false, message: 'Password is required' };
        if (password.length < VALIDATION_RULES.password.minLength) return { valid: false, message: 'Password must be at least ' + VALIDATION_RULES.password.minLength + ' characters' };
        if (password.length > VALIDATION_RULES.password.maxLength) return { valid: false, message: 'Password must be no more than ' + VALIDATION_RULES.password.maxLength + ' characters' };
        if (VALIDATION_RULES.password.requireUppercase && !/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
        if (VALIDATION_RULES.password.requireLowercase && !/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
        if (VALIDATION_RULES.password.requireNumbers && !/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
        if (VALIDATION_RULES.password.requireSpecialChars && !/[^a-zA-Z0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one special character' };
        return { valid: true, message: '' };
    }
    
    function validateDisplayName(displayName) {
        if (!displayName || displayName.trim() === '') return { valid: true, message: '' };
        const trimmed = displayName.trim();
        if (trimmed.length < VALIDATION_RULES.displayName.minLength) return { valid: false, message: 'Display name must be at least ' + VALIDATION_RULES.displayName.minLength + ' characters' };
        if (trimmed.length > VALIDATION_RULES.displayName.maxLength) return { valid: false, message: 'Display name must be no more than ' + VALIDATION_RULES.displayName.maxLength + ' characters' };
        if (!VALIDATION_RULES.displayName.allowSpaces && trimmed.includes(' ')) return { valid: false, message: 'Display name cannot contain spaces' };
        const pattern = VALIDATION_RULES.displayName.allowSpaces ? /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/ : /^[A-Za-z0-9]+$/;
        if (!pattern.test(trimmed)) return { valid: false, message: 'Display name can only contain ASCII letters and numbers' };
        return { valid: true, message: '' };
    }
    
    function validateEmail(email) {
        if (!email || email.trim() === '') return { valid: true, message: '' };
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
        return { valid: true, message: '' };
    }
    
    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) return { valid: false, message: 'Please confirm your password' };
        if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
        return { valid: true, message: '' };
    }
    
    function showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) innerError.remove();
        let errorElement = frmRow.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('field-error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            if (frmRow.nextSibling) frmRow.parentNode.insertBefore(errorElement, frmRow.nextSibling);
            else frmRow.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showFieldValid(field) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) innerError.remove();
        const errorElement = frmRow.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.style.display = 'none';
        }
    }
    
    function clearFieldFeedback(field) {
        field.classList.remove('valid', 'invalid');
        const frmRow = field.closest('.frm-row');
        if (!frmRow) return;
        const innerError = frmRow.querySelector('.field-error');
        if (innerError) innerError.remove();
        const errorElement = frmRow.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.style.display = 'none';
        }
    }
    
    function initializeValidation() {
        const usernameInput = document.getElementById('username-input');
        const emailInput = document.getElementById('email-input');
        const displayNameInput = document.getElementById('display-name-input');
        const passwordInput = document.getElementById('password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');
        const form = document.getElementById('register-form');
        if (!form) return;
        
        const style = document.createElement('style');
        style.textContent = \`
            input.invalid, input[type="text"].invalid, input[type="email"].invalid, input[type="password"].invalid {
                border: 2px solid #ff4444 !important;
            }
            input.valid, input[type="text"].valid, input[type="email"].valid, input[type="password"].valid {
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
        
        if (usernameInput) {
            usernameInput.addEventListener('blur', function() {
                const res = validateUsername(this.value);
                if (!res.valid) showFieldError(this, res.message); else showFieldValid(this);
            });
        }
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const res = validateEmail(this.value);
                if (!res.valid) showFieldError(this, res.message); else if (this.value.trim()) showFieldValid(this); else clearFieldFeedback(this);
            });
        }
        if (displayNameInput) {
            displayNameInput.addEventListener('blur', function() {
                const res = validateDisplayName(this.value);
                if (!res.valid) showFieldError(this, res.message); else if (this.value.trim()) showFieldValid(this); else clearFieldFeedback(this);
            });
        }
        if (passwordInput) {
            passwordInput.addEventListener('blur', function() {
                const res = validatePassword(this.value);
                if (!res.valid) showFieldError(this, res.message); else showFieldValid(this);
            });
        }
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', function() {
                const res = validateConfirmPassword(passwordInput ? passwordInput.value : '', this.value);
                if (!res.valid) showFieldError(this, res.message); else showFieldValid(this);
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeValidation);
    } else {
        initializeValidation();
    }
})();
`;

  return new Response(validatorJs, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
