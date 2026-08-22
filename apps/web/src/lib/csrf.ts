/**
 * CSRF utilities for form submissions
 */

import type { AstroCookies } from 'astro';
import crypto from 'crypto';

const CSRF_COOKIE_NAME = 'openspell_csrf_token';

export function getCsrfToken(cookies: AstroCookies): string {
  let token = cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!token) {
    token = crypto.randomBytes(24).toString('hex');
    cookies.set(CSRF_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 * 24
    });
  }
  return token;
}

export function validateCsrfToken(cookies: AstroCookies, submittedToken: string | null | undefined): boolean {
  const cookieToken = cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken || !submittedToken) {
    return false;
  }
  return cookieToken === submittedToken;
}
