import { z } from 'zod';
import { ClientValidationSchema } from '../schemas/ClientValidationSchema';

export type ClientFormData = z.infer<typeof ClientValidationSchema>;

// Helper para limpiar valores null, undefined y strings vacíos
function cleanValue(value: any) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  return value;
}

/**
 * Construye el payload para crear o actualizar clientes.
 * Crea el objeto manualmente para controlar exactamente qué propiedades incluir o excluir.
 *
 * @param formData Datos del formulario (puede ser parcial para updates)
 * @returns Payload limpio para el backend
 */
export function buildClientPayload(formData: Partial<ClientFormData>): any {
  if (!formData) return undefined;

  // Crear un objeto limpio para el payload
  const payload: any = {};

  // Extraer y mapear las propiedades del cliente a nivel raíz
  // IMPORTANTE: Omitir clientId como solicitado
  if (formData.client) {
    const client = formData.client;

    // Mapeo manual de propiedades
    payload.clientName = cleanValue(client.clientName);
    payload.firstName = cleanValue(client.firstName);
    payload.lastName = cleanValue(client.lastName);
    payload.type = cleanValue(client.type);
    payload.taxIdType = cleanValue(client.taxIdType);
    payload.taxId = cleanValue(client.taxId);
    payload.vatRegistered = client.vatRegistered;

    // Solo agregar vatId si vatRegistered es true
    if (client.vatRegistered && client.vatId) {
      payload.vatId = cleanValue(client.vatId);
    }
  }

  // Dirección
  if (formData.address) {
    const address = formData.address;
    payload.address = {
      street: cleanValue(address.street),
      city: cleanValue(address.city),
      state: cleanValue(address.state),
      countryId: cleanValue(address.countryId),
      zip: cleanValue(address.zip),
    };

    // Eliminar el objeto address si está vacío
    if (Object.keys(payload.address).length === 0) {
      delete payload.address;
    }
  }

  // Contrato - omitir las propiedades uuid y signed como solicitado
  if (formData.contract) {
    const contract = formData.contract;
    payload.contract = {
      type: cleanValue(contract.type),
      status: cleanValue(contract.status),
      startDate: cleanValue(contract.startDate),
      endDate: cleanValue(contract.endDate),
      ppd: cleanValue(contract.ppd),
      docUrl: cleanValue(contract.docUrl),
    };

    // Agregar signedBy y signedAt si están presentes
    if (contract.status !== 'DRAFT') {
      if (contract.signedBy) {
        payload.contract.signedBy = cleanValue(contract.signedBy);
      }
      if (contract.signedAt) {
        payload.contract.signedAt = cleanValue(contract.signedAt);
      }
    }

    // Eliminar el objeto contract si está vacío
    if (Object.keys(payload.contract).length === 0) {
      delete payload.contract;
    }
  }

  // DMB
  if (formData.dmb) {
    const dmb = formData.dmb;
    payload.dmb = {
      accessType: cleanValue(dmb.accessType),
      status: cleanValue(dmb.status),
      subclientName: cleanValue(dmb.subclientName),
      username: cleanValue(dmb.username),
    };

    // Eliminar el objeto dmb si está vacío
    if (Object.keys(payload.dmb).length === 0) {
      delete payload.dmb;
    }
  }

  return payload;
}
