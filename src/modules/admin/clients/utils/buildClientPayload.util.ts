import { deepClean } from '@/lib/deepClean.util';
import { ClientValidationYupSchema } from '../schemas/ClientValidationYupSchema';
import { InferType } from 'yup';

export type ClientFormData = InferType<typeof ClientValidationYupSchema>;

/**
 * Construye el payload para crear o actualizar clientes.
 * Crea el objeto manualmente para controlar exactamente qué propiedades incluir o excluir.
 *
 * @param formData Datos del formulario (puede ser parcial para updates)
 * @returns Payload limpio para el backend
 */

// Puedes definir un tipo más estricto para el payload si lo deseas
export function buildClientPayload(formData: Partial<ClientFormData>, allowNullKeys: string[] = []): any {
  if (!formData) return undefined;

  // Mapeo manual, pero usando deepClean para limpiar el resultado final
  const payload = {
    clientName: formData.client?.clientName,
    firstName: formData.client?.firstName,
    lastName: formData.client?.lastName,
    type: formData.client?.type,
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
      startDate: formData.contract.startDate,
      endDate: formData.contract.endDate,
      ppd: formData.contract.ppd,
      docUrl: formData.contract.docUrl,
      signedBy: formData.contract.status !== 'DRAFT' ? formData.contract.signedBy : undefined,
      signedAt: formData.contract.status !== 'DRAFT' ? formData.contract.signedAt : undefined,
    },
    dmb: formData.dmb && {
      accessType: formData.dmb.accessType,
      status: formData.dmb.status,
      subclientName: formData.dmb.subclientName,
      username: formData.dmb.username,
    },
  };

  return deepClean(payload, allowNullKeys);
}
