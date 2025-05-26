/**
 * logColor: Log to console with color and label
 * @param {'log'|'warn'|'error'|'info'|'success'} type
 * @param context Context string, object, or function (optional, for source identification)
 * @param {...any} args
 */
export function logColor(type: 'log' | 'warn' | 'error' | 'info' | 'success', contextOrMsg?: string | object | Function, ...args: any[]) {
  if (import.meta.env.MODE === 'production') return;
  let style = '';
  let label = '[LOG]';
  switch (type) {
    case 'error':
      style = 'color: red; font-weight: bold;';
      label = '[ERROR]';
      break;
    case 'warn':
      style = 'color: orange;';
      label = '[WARN]';
      break;
    case 'info':
      style = 'color: #1976d2;';
      label = '[INFO]';
      break;
    case 'success':
      style = 'color: green; font-weight: bold;';
      label = '[SUCCESS]';
      break;
    default:
      style = 'color: #1565c0; font-weight: bold;';
      label = '[LOG]';
  }
  let contextLabel = '';
  let contextStyle = '';
  if (typeof contextOrMsg === 'string') {
    contextLabel = `[${contextOrMsg}]`;
    contextStyle = 'color: inherit;'; // sin color
  } else if (typeof contextOrMsg === 'function') {
    contextLabel = `[${contextOrMsg.name}]`;
    contextStyle = 'color: inherit;';
  } else if (typeof contextOrMsg === 'object' && contextOrMsg !== null) {
    if (contextOrMsg.constructor && contextOrMsg.constructor.name !== 'Object') {
      contextLabel = `[${contextOrMsg.constructor.name}]`;
      contextStyle = 'color: inherit;';
    } else {
      contextLabel = '[Object]';
      contextStyle = 'color: inherit;';
    }
  }
  // Si no hay context, el primer arg es el mensaje
  if (!contextLabel) {
    contextLabel = '';
    args = [contextOrMsg, ...args];
  }
  if (contextLabel) {
    // eslint-disable-next-line no-console
    console.log(`%c${label}%c ${contextLabel}`, style, contextStyle, ...args);
  } else {
    // eslint-disable-next-line no-console
    console.log(`%c${label}`, style, ...args);
  }
}
