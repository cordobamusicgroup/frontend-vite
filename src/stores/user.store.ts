import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserState {
  userData: any | null;
  setUserData: (userData: any) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      userData: null,
      setUserData: (userData) => set({ userData }),
      clearUserData: () => set({ userData: null }),
    }),
    { name: "UserStore" }
  )
);
