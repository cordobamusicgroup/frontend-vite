import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface NotificationState {
  notification: { message: string; type: "success" | "error" } | null;
  setNotification: (notification: { message: string; type: "success" | "error" } | null) => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notification: null,
      setNotification: (notification) => set({ notification }),
      clearNotification: () => set({ notification: null }),
    }),
    { name: "NotificationStore" }
  )
);
