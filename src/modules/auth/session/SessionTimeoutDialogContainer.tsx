import React, { useEffect, useState } from 'react';
import { eventBus } from '../../../eventBus';
import { sessionTimer } from './SessionTimer';
import useAuthQueries from '../hooks/useAuthQueries';
import { useAuthStore } from '@/stores';
import { logColor } from '@/lib/log.util';
import SessionTimeoutDialog from '../../../components/ui/molecules/SessionTimeoutDialog';

/**
 * Componente que conecta el eventBus/sessionTimer con el Dialog visual y maneja la sesión.
 * Obtiene el token directamente del store, sin recibirlo por props.
 */

export const SessionTimeoutDialogContainer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { logoutMutation, refreshTokenMutation } = useAuthQueries();
  const { clearAuthentication } = useAuthStore();

  // Leer el token desde el estado global
  const token = useAuthStore((s) => s.token);

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
      // Al expirar, hace logout automático
      clearAuthentication();
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
  }, [clearAuthentication, token]);

  const handleStayLoggedIn = async () => {
    eventBus.emit('session:closed');
    try {
      await refreshTokenMutation.mutateAsync();
      logColor('info', 'SessionTimeoutDialog', 'Token refreshed by user, session extended');
    } catch (e) {
      logColor('error', 'SessionTimeoutDialog', 'Refresh during countdown failed', e);
      clearAuthentication();
    }
  };

  const handleLogout = async () => {
    eventBus.emit('session:closed');
    await logoutMutation.mutateAsync();
  };

  return <SessionTimeoutDialog open={open} countdown={countdown} onStayLoggedIn={handleStayLoggedIn} onLogout={handleLogout} />;
};
