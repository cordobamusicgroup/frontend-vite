import { useEffect, useRef, useState } from 'react';

export const SESSION_TIMEOUT_WARNING_SECONDS = 30;

/**
 * Hook para manejar el timeout de sesión y el countdown de aviso.
 * @param expTimestamp Expiración del token (segundos UNIX)
 * @param onTimeout Callback cuando expira la sesión
 */
export function useSessionTimeout(expTimestamp: number | null, onTimeout: () => void) {
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutCalled = useRef(false);

  useEffect(() => {
    if (!expTimestamp) {
      setCountdown(0);
      timeoutCalled.current = false;
      return;
    }
    const updateCountdown = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor(expTimestamp - now / 1000));
      setCountdown(secondsLeft);
      if (secondsLeft === 0 && !timeoutCalled.current) {
        timeoutCalled.current = true;
        onTimeout();
      }
    };
    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);
    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      timeoutCalled.current = false;
    };
  }, [expTimestamp, onTimeout]);

  return countdown;
}
