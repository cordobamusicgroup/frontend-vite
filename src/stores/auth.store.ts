import { create } from 'zustand';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAccessTokenFromCookie(),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  checkAuth: () => set({ isAuthenticated: !!getAccessTokenFromCookie() }),
}));

