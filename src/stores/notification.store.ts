import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationPayload {
  message: string | string[];
  type: NotificationType;
  key?: string;
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
