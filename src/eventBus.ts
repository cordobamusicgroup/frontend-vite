import mitt from 'mitt';

// Definimos los tipos de eventos
export type AppEvents = {
  openViewAsClientDialog: void;
};

export const eventBus = mitt<AppEvents>();
