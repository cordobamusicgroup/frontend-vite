import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  validateToken: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
