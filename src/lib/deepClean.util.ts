/**
 * Limpia un objeto/array recursivamente, eliminando null/undefined/'' excepto en claves permitidas.
 * @param obj Objeto o array a limpiar
 * @param allowNullKeys Lista de claves (en cualquier nivel) donde se permite null
 */
export function deepClean<T>(obj: T, allowNullKeys: string[] = []): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item, allowNullKeys)).filter((v) => v !== undefined && v !== null && v !== '') as unknown as T;
  }
  if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = deepClean(value, allowNullKeys);
      if (
        (allowNullKeys.includes(key) && value === null) ||
        (cleanedValue !== undefined && cleanedValue !== null && cleanedValue !== '' && (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0))
      ) {
        cleaned[key] = allowNullKeys.includes(key) ? value : cleanedValue;
      }
    });
    return cleaned;
  }
  if (obj === null || obj === undefined || obj === '') {
    return undefined as unknown as T;
  }
  return obj;
}
