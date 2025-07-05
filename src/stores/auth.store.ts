import { create } from 'zustand';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAccessTokenFromCookie(),
  setAuthenticated: (authenticated: boolean) => set({ isAuthenticated: authenticated }),
  checkAuth: () => set({ isAuthenticated: !!getAccessTokenFromCookie() }),
}));
