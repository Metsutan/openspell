/**
 * News Service
 * Handles loading, caching, and organizing news items
 */

import fs from 'fs';
import path from 'path';
import { makeApiRequest } from './api';

export interface NewsItem {
  id?: number;
  title: string;
  slug: string;
  type?: string;
  date: string;
  description: string;
  thumbnail?: string | null;
  picture?: string | null;
  content: string;
}

export interface NewsData {
  items: NewsItem[];
}

let newsCache: {
  data: NewsData | null;
  expiresAt: number;
  inFlight: Promise<NewsData> | null;
} = {
  data: null,
  expiresAt: 0,
  inFlight: null
};

function readFallbackNewsFile(): NewsData {
  try {
    const candidatePaths = [
      path.resolve(process.cwd(), 'apps', 'web', 'news.json'),
      path.resolve(process.cwd(), 'news.json'),
      path.resolve(process.cwd(), 'apps', 'web-legacy', 'news.json'),
      path.resolve(process.cwd(), '..', 'web', 'news.json')
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.items)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Failed to read fallback news.json:', err);
  }
  return { items: [] };
}

export async function loadNews(forceRefresh = false): Promise<NewsData> {
  const now = Date.now();
  const ttlMs = 30 * 1000; // 30 seconds

  if (!forceRefresh && newsCache.data && newsCache.expiresAt > now) {
    return newsCache.data;
  }

  if (newsCache.inFlight) {
    return await newsCache.inFlight;
  }

  newsCache.inFlight = (async () => {
    try {
      const response = await makeApiRequest<{ items: NewsItem[] }>('/api/news');
      let rawItems: NewsItem[] = [];
      if (Array.isArray(response?.items)) {
        rawItems = response.items;
      } else if (Array.isArray(response)) {
        rawItems = response;
      }

      if (rawItems.length > 0) {
        const items = rawItems.map((item) => ({
          ...item,
          date: typeof item.date === 'string' ? item.date.split('T')[0] : String(item.date)
        }));
        const data: NewsData = { items };
        newsCache.data = data;
        newsCache.expiresAt = Date.now() + ttlMs;
        return data;
      }
    } catch (error) {
      console.warn('Failed to load news from API:', error);
    } finally {
      newsCache.inFlight = null;
    }

    // Fallback if API returned 0 items or threw an error
    const fallback = readFallbackNewsFile();
    if (fallback.items.length > 0) {
      newsCache.data = fallback;
      newsCache.expiresAt = Date.now() + ttlMs;
      return fallback;
    }

    if (newsCache.data) return newsCache.data;
    return { items: [] };
  })();

  return await newsCache.inFlight;
}

export async function fetchOnlineUsersCount(): Promise<number> {
  try {
    const data = await makeApiRequest<{ count?: number; onlineCount?: number; totalOnline?: number }>('/api/online/count');
    return data?.count ?? data?.onlineCount ?? data?.totalOnline ?? 0;
  } catch (error) {
    return 0;
  }
}

export function organizeNewsByDate(items: NewsItem[]): Record<number, Record<number, NewsItem[]>> {
  const organized: Record<number, Record<number, NewsItem[]>> = {};

  for (const item of items) {
    if (!item.date) continue;
    const date = new Date(item.date);
    if (isNaN(date.getTime())) continue;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (!organized[year]) {
      organized[year] = {};
    }
    if (!organized[year][month]) {
      organized[year][month] = [];
    }

    organized[year][month].push(item);
  }

  // Sort items within each month descending
  for (const year of Object.keys(organized)) {
    const y = parseInt(year, 10);
    for (const month of Object.keys(organized[y])) {
      const m = parseInt(month, 10);
      organized[y][m].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  return organized;
}
