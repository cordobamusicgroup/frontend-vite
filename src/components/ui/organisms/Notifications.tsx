import React, { useEffect } from "react";
import { useNotificationStore } from "../../../stores";
import ErrorBox from "../molecules/ErrorBox";
import SuccessBox from "../molecules/SuccessBox";

/**
 * Componente global para mostrar notificaciones de éxito o error
 * Escucha los cambios en el store de notificaciones y muestra la notificación correspondiente
 */
export const Notifications: React.FC = () => {
  const { notification, clearNotification } = useNotificationStore();

  // Limpia automáticamente la notificación después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return <div className="fixed top-4 right-4 z-50 max-w-md">{notification.type === "error" ? <ErrorBox>{notification.message}</ErrorBox> : <SuccessBox>{notification.message}</SuccessBox>}</div>;
};

export default Notifications;
