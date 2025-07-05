import { z } from 'zod';

/**
 * Validation schema for user-related data using Zod.
 */
export const UsersValidationSchema = z.object({
  clientId: z.any().nullable().optional(), // Revert to `any` type for flexibility
  username: z.string({
    required_error: 'Username is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email'),
  fullName: z
    .string({
      required_error: 'Full name is required',
    })
    .min(3, 'Full name must be at least 3 characters long')
    .max(50, 'Full name must be at most 50 characters long'),
  role: z.enum(['ADMIN', 'USER'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});
