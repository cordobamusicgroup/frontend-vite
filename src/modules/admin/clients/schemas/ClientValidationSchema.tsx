import { z } from 'zod';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions, AccessTypeDMB, StatusDMB } from '@/constants/backend.enums';
import 'dayjs/plugin/isSameOrBefore';

import { oneOfOptions, transformDate, isValidDayjs, isNotEmpty, isFutureDate } from '@/lib/zod.util';

// 📦 Utilidad para evitar repetir lógica
const isEmpty = (val?: string | null) => !val?.trim();

// 🧩 Esquema de Cliente
const ClientSchema = z.object({
  clientId: z.any().optional().readonly(),
  clientName: z.string().nonempty('Client nickname is required'),
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  type: oneOfOptions(typeOptions, 'Invalid type'),
  taxIdType: oneOfOptions(taxIdTypeOptions, 'Invalid Tax ID Type'),
  taxId: z.string().nonempty('Tax ID is required'),
  vatRegistered: z.boolean(),
  vatId: z.string().optional().nullable(),
});

// 🧩 Esquema de Dirección
const AddressSchema = z.object({
  street: z.string().nonempty('Street is required'),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  countryId: z.any().refine(isNotEmpty, { message: 'Country is required' }),
  zip: z.string().nonempty('Zip is required'),
});

// 🧩 Esquema de Contrato
const ContractSchema = z.object({
  uuid: z.string().optional().readonly(),
  type: oneOfOptions(contractTypeOptions, 'Invalid contract type'),
  status: oneOfOptions(contractStatusOptions, 'Invalid contract status'),
  ppd: z
    .number({
      invalid_type_error: 'PPD must be a number',
      required_error: 'PPD is required',
    })
    .nullable()
    .optional(),
  docUrl: z.string().nullable(),
  startDate: z.preprocess(transformDate, z.custom<dayjs.Dayjs>(isValidDayjs, 'Invalid date')),
  endDate: z.preprocess(transformDate, z.union([z.custom<dayjs.Dayjs>(isValidDayjs), z.null()])),
  signed: z.boolean().optional(),
  signedBy: z.string().nullable(),
  signedAt: z.preprocess(transformDate, z.union([z.custom<dayjs.Dayjs>(isValidDayjs), z.null()])),
});

// 🧩 Esquema de DMB
const DmbSchema = z.object({
  accessType: oneOfOptions(AccessTypeDMB, 'Invalid DMB Access Type'),
  status: oneOfOptions(StatusDMB, 'Invalid DMB Status'),
  subclientName: z.string().nullable(),
  username: z.string().nullable(),
});

// 🔗 Esquema principal
const BaseSchema = z.object({
  client: ClientSchema,
  address: AddressSchema,
  contract: ContractSchema,
  dmb: DmbSchema,
});

// ✅ Validaciones personalizadas condicionales
export const ClientValidationSchema = BaseSchema.superRefine((data, ctx) => {
  const { client, contract } = data;
  const status = contract.status;

  const isActive = status === 'ACTIVE';
  const isTerminated = status === 'TERMINATED';
  const isDraft = status === 'DRAFT';
  const isNotDraft = !isDraft;

  // VAT ID obligatorio si está registrado para IVA
  if (client.vatRegistered && isEmpty(client.vatId)) {
    ctx.addIssue({
      path: ['client', 'vatId'],
      code: z.ZodIssueCode.custom,
      message: 'VAT ID is required when VAT Registered is true',
    });
  }

  // Validación de fecha de inicio
  if ((isActive || isTerminated) && !contract.startDate?.isValid()) {
    ctx.addIssue({
      path: ['contract', 'startDate'],
      code: z.ZodIssueCode.custom,
      message: 'Start date is required or invalid',
    });
  }

  // Validación de fecha de finalización SIEMPRE que exista endDate
  if (contract.endDate) {
    if (!contract.endDate.isValid()) {
      ctx.addIssue({
        path: ['contract', 'endDate'],
        code: z.ZodIssueCode.custom,
        message: 'End date is required or invalid',
      });
    } else if (!contract.startDate || !contract.startDate.isValid() || !contract.endDate.isAfter(contract.startDate)) {
      ctx.addIssue({
        path: ['contract', 'endDate'],
        code: z.ZodIssueCode.custom,
        message: 'End date must be at least one day after start date',
      });
    } else if (!isFutureDate(contract.endDate)) {
      ctx.addIssue({
        path: ['contract', 'endDate'],
        code: z.ZodIssueCode.custom,
        message: 'End date cannot be in the past',
      });
    }
  }

  // Campos obligatorios si no está en DRAFT
  if (isNotDraft) {
    if (isEmpty(contract.signedBy)) {
      ctx.addIssue({
        path: ['contract', 'signedBy'],
        code: z.ZodIssueCode.custom,
        message: 'Signed by is required',
      });
    }

    if (!contract.signedAt?.isValid()) {
      ctx.addIssue({
        path: ['contract', 'signedAt'],
        code: z.ZodIssueCode.custom,
        message: 'Signed at is required or invalid',
      });
    }
  }

  // Campos obligatorios si está ACTIVO
  if (isActive) {
    if (contract.ppd === undefined || contract.ppd === null) {
      ctx.addIssue({
        path: ['contract', 'ppd'],
        code: z.ZodIssueCode.custom,
        message: 'PPD is required for active contracts',
      });
    }

    if (isEmpty(contract.docUrl)) {
      ctx.addIssue({
        path: ['contract', 'docUrl'],
        code: z.ZodIssueCode.custom,
        message: 'Document URL is required',
      });
    }
  }
});
