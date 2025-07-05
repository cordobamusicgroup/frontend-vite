import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Roles } from '@/constants/roles';

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

function mapRole(role: string): Roles {
  if (Object.values(Roles).includes(role as Roles)) {
    return role as Roles;
  }
  return Roles.User;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      userData: null,
      setUserData: (userData) => set({ userData: { ...userData, role: mapRole(userData.role) } }),
      clearUserData: () => set({ userData: null }),
    }),
    { name: 'UserStore' },
  ),
);
