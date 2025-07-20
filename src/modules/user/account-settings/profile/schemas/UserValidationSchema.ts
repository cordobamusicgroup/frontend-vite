import { z } from 'zod';

export const UserValidationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().nonempty('Full name is required'),
    currentPassword: z.string().nullable().optional(),
    newPassword: z.string().nullable().optional(),
    confirmPassword: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      const { newPassword } = data;
      return !newPassword || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword);
    },
    {
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      const { newPassword, confirmPassword } = data;
      return !newPassword || confirmPassword === newPassword;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    },
  )
  .refine(
    (data) => {
      const { currentPassword, newPassword } = data;
      return !currentPassword || (!!currentPassword && !!newPassword);
    },
    {
      message: 'New password is required when current password is provided',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      const { currentPassword, newPassword } = data;
      return !newPassword || (!!newPassword && !!currentPassword);
    },
    {
      message: 'Current password is required when setting a new password',
      path: ['currentPassword'],
    },
  );
