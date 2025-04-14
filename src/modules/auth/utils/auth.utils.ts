import Cookies from 'js-cookie';

/**
 * Enum representing various authentication error codes.
 */
export enum AuthErrorCode {
  USER_NOT_FOUND = 1001, // User not found in the system
  INVALID_CREDENTIALS = 1002, // Incorrect username or password
  WEAK_PASSWORD = 1012, // Password does not meet security requirements
  INVALID_TOKEN = 1013, // Token is invalid or expired
  UNAUTHORIZED = 1015, // User is not authorized to perform the action
  VALIDATION_ERROR = 1016, // Input validation failed
  CLIENT_BLOCKED = 1017, // User's client is blocked
}

/**
 * A mapping of authentication error codes to their corresponding error messages.
 */
export const AuthErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.USER_NOT_FOUND]: 'User not found',
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password',
  [AuthErrorCode.WEAK_PASSWORD]: 'Password is too weak',
  [AuthErrorCode.INVALID_TOKEN]: 'Invalid or expired token',
  [AuthErrorCode.UNAUTHORIZED]: 'Unauthorized access',
  [AuthErrorCode.VALIDATION_ERROR]: 'Validation error',
  [AuthErrorCode.CLIENT_BLOCKED]: 'The client related to your user is blocked, contact us for more details.',
};

/**
 * Sets authentication cookies for access and refresh tokens with specified expiration times.
 *
 * @param access_token - The access token to be stored in the cookie.
 * @param refresh_token - The refresh token to be stored in the cookie.
 * @param expires_in - The expiration time for the access token in seconds.
 * @param refresh_expires_in - The expiration time for the refresh token in seconds.
 *
 * The cookies are configured with the following options:
 * - `expires`: The calculated expiration date based on the provided expiration times.
 * - `path`: Set to `'/'` to make the cookies available across the entire site.
 * - `sameSite`: Set to `'strict'` to prevent cross-site request forgery (CSRF).
 */
export const setCookies = (access_token: string, refresh_token: string, expires_in: number, refresh_expires_in: number) => {
  // Convert seconds to milliseconds for Date object
  const accessExpiration = new Date(Date.now() + expires_in * 1000);
  const refreshExpiration = new Date(Date.now() + refresh_expires_in * 1000);

  Cookies.set('access_token', access_token, {
    expires: accessExpiration,
    path: '/',
    sameSite: 'strict',
  });
  Cookies.set('refresh_token', refresh_token, {
    expires: refreshExpiration,
    path: '/',
    sameSite: 'strict',
  });
};

export const clearCookies = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};
