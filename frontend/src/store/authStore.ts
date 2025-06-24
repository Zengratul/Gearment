import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

// Custom storage that uses cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(';').shift() || '');
      }
      return null;
    } catch (error) {
      console.error('Error reading cookie:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        });
        // Force persist to storage
        setTimeout(() => {
          const state = get();
          console.log('Auth state after login:', state);
        }, 100);
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && !!state.accessToken;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 