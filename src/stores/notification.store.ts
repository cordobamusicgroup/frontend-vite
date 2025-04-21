import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface NotificationPayload {
  message: string | string[]; // puede ser string o array
  type: 'success' | 'error';
  key?: string; // clave opcional para identificar la notificación
}

interface NotificationState {
  notification: NotificationPayload | null;
  setNotification: (notification: NotificationPayload | null) => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notification: null,
      setNotification: (notification) => set({ notification }),
      clearNotification: () => set({ notification: null }),
    }),
    { name: 'NotificationStore' },
  ),
);
