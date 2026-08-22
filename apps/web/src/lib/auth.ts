/**
 * Auth Service for Astro
 * Handles cookie-based user session and authentication state
 */

import type { AstroCookies } from 'astro';
import { makeApiRequest } from './api';

export interface UserSession {
  id: number;
  username: string;
  displayName: string;
  email?: string | null;
  isAdmin?: boolean;
  isMuted?: boolean;
  isBanned?: boolean;
  createdAt?: string | null;
  emailVerified?: boolean;
  timePlayed?: number | bigint;
  lastPasswordChange?: string | null;
  lastEmailChange?: string | null;
  lastDisplayNameChange?: string | null;
}

const AUTH_COOKIE_NAME = 'openspell_auth_token';
const USER_CACHE_COOKIE = 'openspell_user_cache';

export async function getUserInfo(
  cookies: AstroCookies,
  fetchFresh = false
): Promise<UserSession | null> {
  const token = cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  // Try cached user cookie first if not forcing fresh
  if (!fetchFresh) {
    const cached = cookies.get(USER_CACHE_COOKIE)?.value;
    if (cached) {
      try {
        return JSON.parse(decodeURIComponent(cached)) as UserSession;
      } catch (_) {}
    }
  }

  // Fetch fresh user profile from API server
  try {
    const data = await makeApiRequest<{ user: UserSession }>('/api/auth/me', {
      method: 'GET',
      token
    });

    if (data && data.user) {
      // Update the user cache cookie (valid for 1 hour)
      cookies.set(USER_CACHE_COOKIE, encodeURIComponent(JSON.stringify(data.user)), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600
      });
      return data.user;
    }
  } catch (error) {
    // If token invalid, clear it
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    cookies.delete(USER_CACHE_COOKIE, { path: '/' });
  }

  return null;
}

export function getAuthToken(cookies: AstroCookies): string | null {
  return cookies.get(AUTH_COOKIE_NAME)?.value || null;
}

export function setAuthCookies(cookies: AstroCookies, token: string, user: UserSession): void {
  cookies.set(AUTH_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  cookies.set(USER_CACHE_COOKIE, encodeURIComponent(JSON.stringify(user)), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookies(cookies: AstroCookies): void {
  cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
  cookies.delete(USER_CACHE_COOKIE, { path: '/' });
}
