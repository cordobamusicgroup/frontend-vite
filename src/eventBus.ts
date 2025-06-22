import mitt from 'mitt';

// Definimos los tipos de eventos
export type AppEvents = {
  openViewAsClientDialog: void;
  // Eventos de sesión
  'session:expiring': { seconds: number };
  'session:tick': { seconds: number };
  'session:expired': void;
  'session:closed': void;
  'session:restart': void;
};

export const eventBus = mitt<AppEvents>();
