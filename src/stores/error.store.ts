import { error } from 'console';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Estado global para manejar errores y el estado del modal de error.
 */
interface ErrorState {
  /**
   * Mensaje de error actual. Si no hay error, es `null`.
   */
  error: string | null;

  /**
   * Indica si el modal de error está abierto (`true`) o cerrado (`false`).
   */
  openModal: boolean;

  /**
   * Establece un mensaje de error y abre el modal si hay un error.
   * @param error - El mensaje de error o `null` para limpiar el error.
   */
  setError: (error: string | null) => void;

  /**
   * Limpia el mensaje de error (lo establece en `null`).
   */
  clearError: () => void;

  /**
   * Establece manualmente el estado del modal de error.
   * @param open - `true` para abrir el modal, `false` para cerrarlo.
   */
  setOpenModal: (open: boolean) => void;

  /**
   * Cierra el modal de error (establece `openModal` en `false`).
   */
  closeModal: () => void;
}

/**
 * Implementación del store usando `zustand` con soporte para herramientas de desarrollo.
 */
export const useErrorStore = create<ErrorState>()(
  devtools(
    (set) => ({
      // Estado inicial
      error: null,
      openModal: false,

      // Establece un mensaje de error y abre el modal si hay un error
      setError: (error) => set({ error, openModal: !!error }),

      // Limpia el mensaje de error
      clearError: () => set({ error: null }),

      // Establece manualmente el estado del modal
      setOpenModal: (open) => set({ openModal: open }),

      // Cierra el modal
      closeModal: () => set({ openModal: false }),
    }),
    { name: 'ErrorStore' }, // Nombre del store para herramientas de desarrollo
  ),
);
