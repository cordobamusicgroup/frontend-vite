import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// Almacenamiento persistente con localStorage
const zustandStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

interface UserState {
  userData: any | null;
  setUserData: (userData: any) => void;
  clearUserData: () => void;
}


export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        userData: null,
        setUserData: (userData) => set({ userData }),
        clearUserData: () => set({ userData: null }),
      }),
      {
        name: "user-store",
        storage: zustandStorage,
      }
    ),
    { name: "UserStore" }
  )
);
