import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { setAccessTokenCookie, getAccessTokenFromCookie, removeAccessTokenCookie } from '../lib/cookies.util';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setAuthenticated: (status: boolean) => void;
  setToken: (token: string | null) => void;
  clearAuthentication: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: !!getAccessTokenFromCookie(),
      token: getAccessTokenFromCookie(),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setToken: (token) => {
        if (token) {
          setAccessTokenCookie(token);
        } else {
          removeAccessTokenCookie();
        }
        set({ token });
      },
      clearAuthentication: () => {
        removeAccessTokenCookie();
        set({ isAuthenticated: false, token: null });
      },
    }),
    { name: 'AuthStore' },
  ),
);
