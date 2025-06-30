import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CurrentUserResponseDto {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  clientId: number;
  clientName: string;
}

interface UserState {
  userData: CurrentUserResponseDto | null;
  setUserData: (userData: CurrentUserResponseDto) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      userData: null,
      setUserData: (userData) => set({ userData }),
      clearUserData: () => set({ userData: null }),
    }),
    { name: 'UserStore' },
  ),
);
