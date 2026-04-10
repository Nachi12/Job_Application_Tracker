import { STORAGE_KEYS } from './constants';

export const storage = {
  // 🔐 TOKEN METHODS
  getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (err) {
      console.error('Error getting token:', err);
      return null;
    }
  },

  setToken(token: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (err) {
      console.error('Error setting token:', err);
    }
  },

  clearToken() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (err) {
      console.error('Error clearing token:', err);
    }
  },

  // 🎨 THEME METHODS
  getTheme(): 'light' | 'dark' | null {
    try {
      return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') ?? null;
    } catch (err) {
      console.error('Error getting theme:', err);
      return null;
    }
  },

  setTheme(theme: 'light' | 'dark') {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (err) {
      console.error('Error setting theme:', err);
    }
  },

  // 🔥 OPTIONAL (VERY USEFUL)
  clearAll() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  }
};