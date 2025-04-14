import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  clearAuthentication: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      clearAuthentication: () => set({ isAuthenticated: false }),
    }),
    { name: 'AuthStore' },
  ),
);
