import * as yup from 'yup';

export const ClientValidationYupSchema = yup.object({
  client: yup.object({
    clientName: yup.string().required('Client nickname is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    type: yup.string().required('Type is required'),
    taxIdType: yup.string().required('Tax ID Type is required'),
    taxId: yup.string().required('Tax ID is required'),
    vatRegistered: yup.boolean().required('Please indicate if the client is VAT registered'),
    vatId: yup
      .string()
      .nullable()
      .when('vatRegistered', {
        is: true,
        then: (schema) => schema.required('VAT ID is required when VAT Registered is true'),
        otherwise: (schema) => schema.notRequired(),
      }),
  }),
  address: yup.object({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    countryId: yup
      .mixed()
      .required('Country is required')
      .test('is-valid-id', 'Country is required', (value) => value !== null && value !== undefined && value !== ''),
    zip: yup.string().required('Zip is required'),
  }),
  contract: yup.object({
    uuid: yup.string().notRequired(),
    type: yup.string().required('Contract type is required'),
    status: yup.string().required('Contract status is required'),
    ppd: yup
      .number()
      .nullable()
      .when('status', {
        is: 'ACTIVE',
        then: (schema) => schema.required('PPD is required for active contracts'),
        otherwise: (schema) => schema.notRequired(),
      }),
    docUrl: yup
      .string()
      .nullable()
      .when('status', {
        is: 'ACTIVE',
        then: (schema) => schema.required('Document URL is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    startDate: yup.date().typeError('Start date is required or invalid').required('Start date is required'),
    endDate: yup.date().nullable().notRequired(),
    signed: yup.boolean().notRequired(),
    signedBy: yup
      .string()
      .nullable()
      .when('status', {
        is: (status: string | undefined) => !!status && status !== 'DRAFT',
        then: (schema) => schema.required('Signed by is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    signedAt: yup
      .date()
      .nullable()
      .when('status', {
        is: (status: string | undefined) => !!status && status !== 'DRAFT',
        then: (schema) => schema.required('Signed at is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
  }),
  dmb: yup.object({
    clientId: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : value))
      .typeError('DMB Client ID must be a number')
      .integer('DMB Client ID must be an integer')
      .min(1, 'DMB Client ID must be a positive integer')
      .notRequired(),
    accessType: yup.string().required('DMB Access Type is required'),
    status: yup.string().required('DMB Status is required'),
    subclientName: yup.string().nullable(),
  }),
});
