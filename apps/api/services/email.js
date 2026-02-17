/**
 * Email Service
 * Configurable email service supporting multiple providers:
 * - mailhog (development/testing)
 * - maildev (development/testing)
 * - smtp (generic SMTP)
 * - ses (AWS SES)
 */

const nodemailer = require('nodemailer');

// Email configuration from environment variables
const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'mailhog'; // mailhog, maildev, smtp, ses
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@openspell.com';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'OpenSpell';
const WEB_URL = process.env.WEB_URL || 'http://localhost:8887';

// SMTP Configuration (for smtp provider)
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'; // true for 465, false for other ports
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

// AWS SES Configuration (for ses provider)
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

let transporter = null;

/**
 * Initialize email transporter based on provider
 */
function initializeTransporter() {
  if (!EMAIL_ENABLED) {
    if (process.env.NODE_ENV !== 'production') console.log('[Email] Email service is disabled (EMAIL_ENABLED=false)');
    return null;
  }

  try {
    switch (EMAIL_PROVIDER) {
      case 'mailhog':
        // Mailhog runs on localhost:1025 by default
        transporter = nodemailer.createTransport({
          host: SMTP_HOST || 'localhost',
          port: SMTP_PORT || 1025,
          secure: false,
          auth: null
        });
        if (process.env.NODE_ENV !== 'production') console.log(`[Email] Initialized Mailhog transporter (${SMTP_HOST || 'localhost'}:${SMTP_PORT || 1025})`);
        break;

      case 'maildev':
        // Maildev runs on localhost:1025 by default
        transporter = nodemailer.createTransport({
          host: SMTP_HOST || 'localhost',
          port: SMTP_PORT || 1025,
          secure: false,
          auth: null
        });
        if (process.env.NODE_ENV !== 'production') console.log(`[Email] Initialized Maildev transporter (${SMTP_HOST || 'localhost'}:${SMTP_PORT || 1025})`);
        break;

      case 'smtp':
        // Generic SMTP server
        transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_SECURE,
          auth: SMTP_USER && SMTP_PASS ? {
            user: SMTP_USER,
            pass: SMTP_PASS
          } : undefined
        });
        if (process.env.NODE_ENV !== 'production') console.log(`[Email] Initialized SMTP transporter (${SMTP_HOST}:${SMTP_PORT})`);
        break;

      case 'ses':
        // AWS SES via SMTP
        // AWS SES SMTP endpoints: email-smtp.{region}.amazonaws.com
        const sesHost = process.env.SES_SMTP_HOST || `email-smtp.${AWS_REGION}.amazonaws.com`;
        const sesPort = parseInt(process.env.SES_SMTP_PORT || '587', 10);
        
        transporter = nodemailer.createTransport({
          host: sesHost,
          port: sesPort,
          secure: sesPort === 465, // true for 465, false for other ports
          auth: {
            user: AWS_ACCESS_KEY_ID,
            pass: AWS_SECRET_ACCESS_KEY
          }
        });
        if (process.env.NODE_ENV !== 'production') console.log(`[Email] Initialized AWS SES transporter via SMTP (${sesHost}:${sesPort})`);
        break;

      default:
        console.error(`[Email] Unknown email provider: ${EMAIL_PROVIDER}`);
        return null;
    }

    return transporter;
  } catch (error) {
    console.error('[Email] Failed to initialize transporter:', error);
    return null;
  }
}

/**
 * Send email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 * @param {string} text - Plain text email body (optional)
 * @returns {Promise<Object>} - Result object with success status
 */
async function sendEmail(to, subject, html, text = null) {
  if (!EMAIL_ENABLED) {
    if (process.env.NODE_ENV !== 'production') console.log(`[Email] Email disabled - would send to ${to}: ${subject}`);
    return { success: false, error: 'Email service is disabled' };
  }

  if (!transporter) {
    transporter = initializeTransporter();
    if (!transporter) {
      return { success: false, error: 'Email transporter not initialized' };
    }
  }

  try {
    const mailOptions = {
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV !== 'production') console.log(`[Email] Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Send email verification email
 * @param {string} to - Recipient email address
 * @param {string} token - Verification token
 * @param {string} username - Username for personalization
 * @returns {Promise<Object>} - Result object
 */
async function sendVerificationEmail(to, token, username) {
  const verificationUrl = `${WEB_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Verify Your Email Address</h1>
        <p>Hello ${username},</p>
        <p>Thank you for registering with OpenSpell! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <div class="footer">
          <p>Best regards,<br>The OpenSpell Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(to, 'Verify Your OpenSpell Account', html);
}

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} token - Reset token
 * @param {string} username - Username for personalization
 * @returns {Promise<Object>} - Result object
 */
async function sendPasswordResetEmail(to, token, username) {
  const resetUrl = `${WEB_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your Password</h1>
        <p>Hello ${username},</p>
        <p>We received a request to reset your password for your OpenSpell account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <div class="warning">
          <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </div>
        <div class="footer">
          <p>Best regards,<br>The OpenSpell Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(to, 'Reset Your OpenSpell Password', html);
}

module.exports = {
  EMAIL_ENABLED,
  initializeTransporter,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};

