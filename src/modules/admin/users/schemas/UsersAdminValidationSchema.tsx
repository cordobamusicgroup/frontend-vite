import * as yup from 'yup';

/**
 * Validation schema for user-related data using Yup.
 */
export const UsersValidationSchema = yup.object({
  clientId: yup.mixed().nullable().optional(),
  username: yup.string().required('Username is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  fullName: yup.string().required('Full name is required').min(3, 'Full name must be at least 3 characters long').max(50, 'Full name must be at most 50 characters long'),
  role: yup.string().oneOf(['ADMIN', 'USER'], 'Invalid role').required('Role is required'),
});
