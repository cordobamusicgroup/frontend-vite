import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ErrorState {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>()(
  devtools(
    (set) => ({
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    { name: "ErrorStore" }
  )
);
