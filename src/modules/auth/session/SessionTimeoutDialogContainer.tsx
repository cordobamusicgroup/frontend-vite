import React, { useEffect, useState } from 'react';
import SessionTimeoutDialog from '../../../components/ui/molecules/SessionTimeoutDialog';
import { eventBus } from '../../../eventBus';
import { sessionTimer } from './SessionTimer';
import useAuthQueries from '../hooks/useAuthQueries';
import { useAuthStore } from '@/stores';
import { logColor } from '@/lib/log.util';

/**
 * Componente que conecta el eventBus/sessionTimer con el Dialog visual y maneja la sesión.
 * Obtiene el token directamente del store, sin recibirlo por props.
 */

export const SessionTimeoutDialogContainer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { refreshTokenMutation, logoutMutation } = useAuthQueries();
  const token = useAuthStore((s) => s.token);
  const { clearAuthentication } = useAuthStore();

  useEffect(() => {
    sessionTimer.setToken(token);
  }, [token]);

  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout | null = null;

    const onExpiring = ({ seconds }: { seconds: number }) => {
      setCountdown(seconds);
      setOpen(true);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (seconds > 0) {
        logoutTimeout = setTimeout(async () => {
          setOpen(false);
          setCountdown(0);
          if (token) {
            try {
              await logoutMutation.mutateAsync();
            } catch (e) {
              logColor('error', 'SessionTimeoutDialog', 'Auto logout failed', e);
            }
          }
        }, seconds * 1000);
      }
    };
    const onTick = ({ seconds }: { seconds: number }) => {
      setCountdown(seconds);
    };
    const onExpired = async () => {
      setOpen(false);
      setCountdown(0);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      // Si por alguna razón no se disparó antes, intenta logout aquí también
      if (token) {
        try {
          await logoutMutation.mutateAsync();
        } catch (e) {
          logColor('error', 'SessionTimeoutDialog', 'Auto logout failed', e);
        }
      }
    };
    const onClosed = () => {
      setOpen(false);
      setCountdown(30);
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
    eventBus.on('session:expiring', onExpiring);
    eventBus.on('session:tick', onTick);
    eventBus.on('session:expired', onExpired);
    eventBus.on('session:closed', onClosed);
    return () => {
      eventBus.off('session:expiring', onExpiring);
      eventBus.off('session:tick', onTick);
      eventBus.off('session:expired', onExpired);
      eventBus.off('session:closed', onClosed);
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
  }, [logoutMutation, clearAuthentication, token]);

  const handleStayLoggedIn = async () => {
    eventBus.emit('session:closed');
    try {
      await refreshTokenMutation.mutateAsync();
      logColor('info', 'SessionTimeoutDialog', 'Token refreshed by user, session extended');
    } catch (e) {
      logColor('error', 'SessionTimeoutDialog', 'Refresh during countdown failed', e);
      await logoutMutation.mutateAsync();
    }
  };

  const handleLogout = async () => {
    eventBus.emit('session:closed');
    if (token) {
      try {
        await logoutMutation.mutateAsync();
      } catch (e) {
        logColor('error', 'SessionTimeoutDialog', 'Auto logout failed', e);
      }
    }
  };

  return <SessionTimeoutDialog open={open} countdown={countdown} onStayLoggedIn={handleStayLoggedIn} onLogout={handleLogout} />;
};
