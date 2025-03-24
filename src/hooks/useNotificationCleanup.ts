import { useNotificationStore } from "@/stores";
import { useEffect } from "react";

export const useNotificationCleanup = () => {
  const clearNotification = useNotificationStore().clearNotification;

  useEffect(() => {
    return () => {
      // Limpiar la notificación al desmontar
      clearNotification();
    };
  }, [clearNotification]);
};
