// src/lib/jwt.util.ts
import { jwtDecode } from 'jwt-decode';
import { logColor } from './log.util';

/**
 * Decodifica un JWT de forma segura. Si es inválido, limpia la sesión y loguea el error.
 * Nunca expone el valor del token en logs.
 * @param token JWT string
 * @param onInvalid Callback para limpiar sesión (opcional)
 * @returns El payload decodificado o null si inválido
 */
export function decodeJwtOrLogout<T = any>(token: string, onInvalid?: () => void): T | null {
  try {
    return jwtDecode<T>(token);
  } catch (e) {
    logColor('error', 'JWT', 'Token inválido o corrupto. Limpiando sesión.', e);
    if (onInvalid) onInvalid();
    return null;
  }
}
