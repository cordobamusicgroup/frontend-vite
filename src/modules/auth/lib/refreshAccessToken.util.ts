import axios from 'axios';
import { setAccessTokenCookie } from '@/lib/cookies.util';
import { useAuthStore } from '@/stores';

// Mutex para evitar múltiples refresh simultáneos
let refreshPromise: Promise<string | undefined> | null = null;

/**
 * Realiza el refresh del access token usando el refresh token httpOnly.
 * Solo permite un refresh concurrente; las demás requests esperan el mismo resultado.
 * Actualiza el estado global y la cookie si es exitoso.
 * Lanza error si falla el refresh.
 */
export async function refreshAccessToken() {
  if (refreshPromise) {
    // Si ya hay un refresh en curso, espera ese resultado
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
      const { access_token } = response.data;
      setAccessTokenCookie(access_token);
      useAuthStore.getState().setToken(access_token);
      return access_token;
    } catch (err) {
      useAuthStore.getState().clearAuthentication();
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}
