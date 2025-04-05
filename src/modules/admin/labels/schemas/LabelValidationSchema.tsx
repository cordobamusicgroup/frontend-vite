import { z } from 'zod';
import { LabelStatus, LabelRegistrationStatus } from '@/constants/backend.enums';

/**
 * Helper function to validate options from an enum array
 */
const createEnumSchema = (options: { value: string }[], errorMessage: string) => {
  const validValues = options.map((option) => option.value);
  return z.string().refine((value) => validValues.includes(value), {
    message: errorMessage,
  });
};

/**
 * Validation schema for label data using Zod
 */
export const LabelValidationSchema = z
  .object({
    labelId: z.any().nullable().optional(),
    clientId: z.any().refine((value) => value !== null && value !== undefined && value !== '', {
      message: 'Client is required',
    }),
    labelName: z.string().min(1, 'Label Name is required'),
    labelStatus: createEnumSchema(LabelStatus, 'Invalid status'),
    labelWebsite: z.string().optional().nullable(),
    countryId: z.number().optional().nullable(),
    beatportStatus: createEnumSchema(LabelRegistrationStatus, 'Invalid Beatport status'),
    traxsourceStatus: createEnumSchema(LabelRegistrationStatus, 'Invalid Traxsource status'),
    beatportUrl: z.string().optional().nullable(),
    traxsourceUrl: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Validación para beatportUrl
    if (data.beatportStatus === 'ACTIVE') {
      if (!data.beatportUrl || data.beatportUrl.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Beatport URL is required when status is Active',
          path: ['beatportUrl'],
        });
      }
    }

    // Validación para traxsourceUrl
    if (data.traxsourceStatus === 'ACTIVE') {
      if (!data.traxsourceUrl || data.traxsourceUrl.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Traxsource URL is required when status is Active',
          path: ['traxsourceUrl'],
        });
      }
    }
  });

// Type for the form data that matches the schema
export type LabelFormValues = z.infer<typeof LabelValidationSchema>;
