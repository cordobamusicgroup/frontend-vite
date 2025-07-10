// Extrae todos los mensajes de error de un objeto de errores de react-hook-form + zod

export function extractValidationMessages(errors: any): string[] {
  const messages: string[] = [];
  const iterate = (errObj: any) => {
    if (!errObj) return;
    if (Array.isArray(errObj)) {
      errObj.forEach(iterate);
    } else if (typeof errObj === 'object') {
      if (errObj.message && typeof errObj.message === 'string') {
        messages.push(errObj.message);
      }
      if (errObj.types) {
        iterate(errObj.types);
      }
      Object.values(errObj).forEach(iterate);
    }
  };
  iterate(errors);
  return messages;
}
