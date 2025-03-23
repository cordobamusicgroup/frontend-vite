import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  validateToken: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
