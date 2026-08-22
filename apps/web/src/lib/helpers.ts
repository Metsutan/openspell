/**
 * Helper utilities for formatting and sanitization
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats a date to "MMMM D, YYYY" (e.g., "January 15, 2025")
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Formats number with commas (e.g., 1000000 -> "1,000,000")
 */
export function formatNumber(num: number | string | bigint | null | undefined): string {
  if (num === null || num === undefined || num === '-') return '-';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Formats total playtime in milliseconds to "X days Y hours Z minutes"
 */
export function formatTotalPlayTime(totalMs: number | bigint | string | null | undefined): string {
  const safeMs = Number.isFinite(Number(totalMs)) ? Math.max(0, Number(totalMs)) : 0;
  const totalMinutes = Math.floor(safeMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days} days ${hours} hours ${minutes} minutes`;
}

/**
 * Escapes HTML characters to prevent XSS
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes input string (trims and cleans)
 */
export function sanitizeString(str: any): string {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates username format
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;
  const allowSpaces = process.env.USERNAME_ALLOW_SPACES !== 'false';
  const pattern = allowSpaces ? /^[a-zA-Z0-9 ]+$/ : /^[a-zA-Z0-9]+$/;
  return pattern.test(username.trim());
}
