import { z } from 'zod';
import dayjs from 'dayjs';
import {
  typeOptions,
  taxIdTypeOptions,
  contractTypeOptions,
  contractStatusOptions,
  AccessTypeDMB,
  StatusDMB,
} from '@/constants/backend.enums';
import { oneOfOptions, transformDate, isValidDayjs, isNotEmpty, isFutureDate } from '@/lib/zod.util';

// Define nested schemas
const ClientSchema = z.object({
  clientId: z.any().readonly().optional(), // ID is readonly
  clientName: z.string().nonempty('Client nickname is required'),
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  type: oneOfOptions(typeOptions, 'Invalid type'),
  taxIdType: oneOfOptions(taxIdTypeOptions, 'Invalid Tax ID Type'),
  taxId: z.string().nonempty('Tax ID is required'),
  vatRegistered: z.boolean(),
  vatId: z.string().nullable(),
});

const AddressSchema = z.object({
  street: z.string().nonempty('Street is required'),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  countryId: z.any().refine(isNotEmpty, { message: 'Country is required' }),
  zip: z.string().nonempty('Zip is required'),
});

const ContractSchema = z.object({
  uuid: z.any().readonly().optional(), // ID is readonly
  type: oneOfOptions(contractTypeOptions, 'Invalid contract type'),
  status: oneOfOptions(contractStatusOptions, 'Invalid contract status'),
  ppd: z.number({
    invalid_type_error: 'PPD must be a number',
    required_error: 'PPD is required',
  }),
  docUrl: z.string().nullable(),
  startDate: z.preprocess(transformDate, z.any().nullable()),
  endDate: z.preprocess(transformDate, z.any().nullable()),
  signed: z.boolean().optional(),
  signedBy: z.string().nullable(),
  signedAt: z.preprocess(transformDate, z.any().nullable()),
});

const DmbSchema = z.object({
  accessType: oneOfOptions(AccessTypeDMB, 'Invalid DMB Access Type'),
  status: oneOfOptions(StatusDMB, 'Invalid DMB Status'),
  subclientName: z.string().nullable(),
  username: z.string().nullable(),
});

// Main schema as nested object
const BaseSchema = z.object({
  client: ClientSchema,
  address: AddressSchema,
  contract: ContractSchema,
  dmb: DmbSchema,
});

// Cross-field validations.
export const ClientValidationSchema = BaseSchema.superRefine((data, ctx) => {
  // Validate VAT: inside client
  if (data.client.vatRegistered && (!data.client.vatId || data.client.vatId.trim() === '')) {
    ctx.addIssue({
      path: ['client', 'vatId'],
      code: z.ZodIssueCode.custom,
      message: 'VAT ID is required when VAT Registered is true',
    });
  }

  // Validate contract start date for ACTIVE or TERMINATED contracts.
  if (data.contract.status === 'ACTIVE' || data.contract.status === 'TERMINATED') {
    if (!data.contract.startDate) {
      ctx.addIssue({
        path: ['contract', 'startDate'],
        code: z.ZodIssueCode.custom,
        message: 'Start date is required',
      });
    } else if (!isValidDayjs(data.contract.startDate)) {
      ctx.addIssue({
        path: ['contract', 'startDate'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
      });
    }
  }

  // Validate endDate for TERMINATED contracts.
  if (data.contract.status === 'TERMINATED') {
    if (!data.contract.endDate) {
      ctx.addIssue({
        path: ['contract', 'endDate'],
        code: z.ZodIssueCode.custom,
        message: 'End date is required',
      });
    } else if (!isValidDayjs(data.contract.endDate)) {
      ctx.addIssue({
        path: ['contract', 'endDate'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
      });
    } else {
      if (
        data.contract.startDate &&
        dayjs.isDayjs(data.contract.startDate) &&
        dayjs.isDayjs(data.contract.endDate) &&
        !data.contract.endDate.isAfter(data.contract.startDate)
      ) {
        ctx.addIssue({
          path: ['contract', 'endDate'],
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
        });
      }
      if (!isFutureDate(data.contract.endDate)) {
        ctx.addIssue({
          path: ['contract', 'endDate'],
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be in the past',
        });
      }
    }
  }

  // For non-DRAFT contracts, require signed fields.
  if (data.contract.status !== 'DRAFT') {
    if (!data.contract.signedBy || data.contract.signedBy.trim() === '') {
      ctx.addIssue({
        path: ['contract', 'contractSignedBy'],
        code: z.ZodIssueCode.custom,
        message: 'Signed by is required',
      });
    }
    if (!data.contract.signedAt) {
      ctx.addIssue({
        path: ['contract', 'contractSignedAt'],
        code: z.ZodIssueCode.custom,
        message: 'Signed at is required',
      });
    } else if (!isValidDayjs(data.contract.signedAt)) {
      ctx.addIssue({
        path: ['contract', 'contractSignedAt'],
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
      });
    }
  }

  // For ACTIVE contracts, require ppd and docUrl.
  if (data.contract.status === 'ACTIVE') {
    if (!data.contract.ppd) {
      ctx.addIssue({
        path: ['contract', 'ppd'],
        code: z.ZodIssueCode.custom,
        message: 'PPD is required',
      });
    }
    if (!data.contract.docUrl || data.contract.docUrl.trim() === '') {
      ctx.addIssue({
        path: ['contract', 'docUrl'],
        code: z.ZodIssueCode.custom,
        message: 'Document URL is required',
      });
    }
  }
});
