import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types/news';

interface CachePayload {
  list: Article[];
  totalResults: number;
  timestamp: number;
  country: string;
  lastPage: number;
}

const CACHE_KEY = 'news_cache_v1';

export const saveCache = async (payload: CachePayload) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore cache write errors
  }
};

export const readCache = async (): Promise<CachePayload | null> => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isCacheFresh = (timestamp: number, ttlMs: number): boolean => {
  return Date.now() - timestamp < ttlMs;
};

export const dedupeArticles = (articles: Article[]): Article[] => {
  const map = new Map<string, Article>();
  for (const a of articles) {
    const key = a.url || `${a.title}-${a.publishedAt}`;
    if (!map.has(key)) map.set(key, a);
  }
  return Array.from(map.values());
};
