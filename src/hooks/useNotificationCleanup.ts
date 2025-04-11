import { useNotificationStore } from '@/stores';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useNotificationCleanup = () => {
  const clearNotification = useNotificationStore().clearNotification;
  const location = useLocation();

  useEffect(() => {
    // Limpiar la notificación al cambiar de ruta
    clearNotification();
  }, [location, clearNotification]);

  useEffect(() => {
    return () => {
      // Limpiar la notificación al desmontar
      clearNotification();
    };
  }, [clearNotification]);
};
