import { useErrorStore, useNotificationStore } from '@/stores';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Hook que limpia notificaciones y errores al cambiar de ruta o desmontar el componente.
 * Útil para evitar mensajes persistentes entre páginas.
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
