import { useErrorStore, useNotificationStore } from '@/stores';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Hook that clears notifications and errors automatically when the route changes or the component unmounts.
 * Useful to avoid persistent messages between pages.
 */
export const useRouteCleanup = () => {
  const { clearNotification } = useNotificationStore();
  const { clearError } = useErrorStore();
  const location = useLocation();

  useEffect(() => {
    // Limpiar notificaciones y errores al cambiar de ruta
    clearNotification();
    clearError();
  }, [location, clearNotification, clearError]);

  useEffect(() => {
    return () => {
      // Limpiar notificaciones y errores al desmontar
      clearNotification();
      clearError();
    };
  }, [clearNotification, clearError]);
};
