import axios from 'axios';
import { setAccessTokenCookie, removeAccessTokenCookie } from '@/lib/cookies.util';
import { queryClient } from '@/queryClient';

// Mutex para evitar múltiples refresh simultáneos
let refreshPromise: Promise<string | undefined> | null = null;

/**
 * Realiza el refresh del access token usando el refresh token httpOnly.
 * Solo permite un refresh concurrente; las demás requests esperan el mismo resultado.
 * Actualiza el estado global y la cookie si es exitoso.
 * Lanza error si falla el refresh.
 */
export async function refreshAccessToken() {
  // use the shared queryClient instance directly

  if (refreshPromise) {
    // Si ya hay un refresh en curso, espera ese resultado
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
      const { access_token } = response.data;
      setAccessTokenCookie(access_token);
      // Invalida la query de usuario para forzar refetch inmediato
      try {
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      } catch {}
      return access_token;
    } catch (err) {
      removeAccessTokenCookie();
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}
