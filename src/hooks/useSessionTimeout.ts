import { useEffect, useRef, useState } from 'react';

/**
 * Hook para manejar el timeout de sesión y el countdown de aviso.
 * @param expTimestamp Expiración del token (segundos UNIX)
 * @param onTimeout Callback cuando expira la sesión
 * @param warningSeconds Segundos antes de expirar para mostrar el aviso
 */
export function useSessionTimeout(expTimestamp: number | null, onTimeout: () => void, warningSeconds = SESSION_TIMEOUT_WARNING_SECONDS) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!expTimestamp) {
      setCountdown(null);
      return;
    }
    const updateCountdown = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor(expTimestamp - now / 1000));
      setCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        onTimeout();
      }
    };
    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expTimestamp, onTimeout]);

  // Solo mostrar el countdown cuando faltan menos de warningSeconds
  if (typeof countdown === 'number' && countdown <= warningSeconds) {
    return countdown;
  }
  return null;
}

// Cambia el valor aquí para modificar el aviso en toda la app
export const SESSION_TIMEOUT_WARNING_SECONDS = 30;
