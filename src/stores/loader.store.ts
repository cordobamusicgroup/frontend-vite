import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoaderState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoaderStore = create<LoaderState>()(
  devtools(
    (set) => ({
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    { name: "LoaderStore" }
  )
);
