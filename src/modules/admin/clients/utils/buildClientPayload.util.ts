import dayjs from 'dayjs';
import { deepClean } from '@/lib/deepClean.util';
import { ClientValidationYupSchema } from '../schemas/ClientValidationYupSchema';
import { InferType } from 'yup';

export type ClientFormData = InferType<typeof ClientValidationYupSchema>;

/**
 * Construye el payload para crear o actualizar clientes.
 * Crea el objeto manualmente para controlar exactamente qué propiedades incluir o excluir.
 *
 * @param formData Datos del formulario (puede ser parcial para updates)
 * @param allowNullKeys Lista de claves donde se permite null
 * @param isUpdate Si es true, envía strings vacíos para limpiar campos en el backend
 * @returns Payload limpio para el backend
 */

// Puedes definir un tipo más estricto para el payload si lo deseas
export function buildClientPayload(formData: Partial<ClientFormData>, allowNullKeys: string[] = [], isUpdate: boolean = false): any {
  if (!formData) return undefined;

  // Mapeo manual, serializando fechas con dayjs directamente
  const payload = {
    clientName: formData.client?.clientName,
    firstName: formData.client?.firstName,
    lastName: formData.client?.lastName,
    type: formData.client?.type,
    companyName: formData.client?.type === 'BUSINESS' ?
      formData.client?.companyName :
      (isUpdate ? null : undefined),
    taxIdType: formData.client?.taxIdType,
    taxId: formData.client?.taxId,
    vatRegistered: formData.client?.vatRegistered,
    vatId: formData.client?.vatRegistered ? formData.client?.vatId : undefined,
    address: formData.address && {
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      countryId: formData.address.countryId,
      zip: formData.address.zip,
    },
    contract: formData.contract && {
      type: formData.contract.type,
      status: formData.contract.status,
      startDate: formData.contract.startDate ? dayjs(formData.contract.startDate).toISOString() : undefined,
      endDate: formData.contract.endDate ? dayjs(formData.contract.endDate).toISOString() : undefined,
      ppd: formData.contract.ppd,
      docUrl: formData.contract.docUrl,
      signedBy: formData.contract.status !== 'DRAFT' ?
        formData.contract.signedBy :
        (isUpdate ? '' : undefined),
      signedAt: formData.contract.status !== 'DRAFT' && formData.contract.signedAt ?
        dayjs(formData.contract.signedAt).toISOString() :
        (isUpdate ? null : undefined),
    },
    dmb: formData.dmb && {
      dmbClientId: formData.dmb.clientId,
      accessType: formData.dmb.accessType,
      status: formData.dmb.status,
      subclientName: formData.dmb.subclientName,
    },
  };

  // For updates, preserve empty strings to clear fields in backend
  if (isUpdate) {
    return deepCleanForUpdate(payload, allowNullKeys);
  }

  return deepClean(payload, allowNullKeys);
}

/**
 * Version of deepClean for updates that preserves empty strings
 * to allow clearing fields in the backend
 */
function deepCleanForUpdate<T>(obj: T, allowNullKeys: string[] = []): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCleanForUpdate(item, allowNullKeys)).filter((v) => v !== undefined && v !== null) as unknown as T;
  }
  if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = deepCleanForUpdate(value, allowNullKeys);
      if (
        (allowNullKeys.includes(key) && value === null) ||
        (cleanedValue !== undefined && cleanedValue !== null && (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0))
      ) {
        cleaned[key] = allowNullKeys.includes(key) ? value : cleanedValue;
      }
    });
    return cleaned;
  }
  if (obj === null || obj === undefined) {
    return undefined as unknown as T;
  }
  // For updates, preserve empty strings (don't filter them out)
  return obj;
}
