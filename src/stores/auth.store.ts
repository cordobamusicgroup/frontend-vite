import { create } from 'zustand';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

interface AuthState {
  isAuthenticated: boolean;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAccessTokenFromCookie(),
  checkAuth: () => set({ isAuthenticated: !!getAccessTokenFromCookie() }),
}));
