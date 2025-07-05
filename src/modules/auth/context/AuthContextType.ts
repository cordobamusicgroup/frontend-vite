import { createContext } from 'react';

// Tipo del contexto
export interface AuthContextType {
  refetchUser: () => void;
  isLoading: boolean;
  error: Error | null;
}

// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
