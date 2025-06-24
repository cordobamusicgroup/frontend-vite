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
