import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface PageDataState {
  openMenu: boolean;
  openSubMenu: string | null;
  toggleMenu: () => void;
  setMenuOpen: (openMenu: boolean) => void;
  toggleSubMenu: (subMenu: string) => void;
}

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

export const usePageDataStore = create<PageDataState>()(
  devtools(
    persist(
      (set) => ({
        openMenu: false,
        openSubMenu: null,

        toggleMenu: () => set((state) => ({ openMenu: !state.openMenu })),
        setMenuOpen: (openMenu) => set({ openMenu }),
        toggleSubMenu: (subMenu) =>
          set((state) => ({
            openSubMenu: state.openSubMenu === subMenu ? null : subMenu,
            openMenu: state.openMenu || state.openSubMenu !== subMenu,
          })),
      }),
      {
        name: "page-data-store",
        storage: zustandStorage,
      }
    ),
    { name: "PageDataStore" }
  )
);
