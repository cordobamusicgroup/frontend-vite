import * as yup from 'yup';
import { PaymentMethodDto } from '../hooks/useCurrentPaymentInfo';

/**
 * Validation schema for payment update request using Yup
 */
export const PaymentUpdateValidationSchema = yup.object().shape({
  paymentMethod: yup
    .string()
    .oneOf([PaymentMethodDto.PAYPAL, PaymentMethodDto.BANK_TRANSFER, PaymentMethodDto.CRYPTO], 'Invalid payment method')
    .required('Payment method is required'),
  paymentData: yup.object().when('paymentMethod', {
    is: PaymentMethodDto.PAYPAL,
    then: (schema) => schema.shape({
      paypalEmail: yup
        .string()
        .email('Please enter a valid email address')
        .required('PayPal email is required')
    }),
    otherwise: (schema) => schema.shape({})
  })
});

export type PaymentUpdateFormData = {
  paymentMethod: PaymentMethodDto;
  paymentData: {
    paypalEmail?: string;
  };
};