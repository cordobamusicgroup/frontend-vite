import { z } from 'zod';

/**
 * Validation schema for user-related data using Zod.
 */
export const UsersValidationSchema = z.object({
  clientId: z.any().nullable(),
  username: z.string({
    required_error: 'Username is required',
  }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email'),
  fullName: z.string({
    required_error: 'Full name is required',
  }),
  role: z.enum(['ADMIN', 'USER'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});
