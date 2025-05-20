import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setAuthenticated: (status: boolean) => void;
  setToken: (token: string) => void;
  clearAuthentication: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      token: null,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setToken: (token) => set({ token }),
      clearAuthentication: () => set({ isAuthenticated: false, token: null }),
    }),
    { name: 'AuthStore' },
  ),
);
