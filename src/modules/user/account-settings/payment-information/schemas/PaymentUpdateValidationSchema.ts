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
  paymentData: yup.lazy((value, context) => {
    const paymentMethod = context.parent.paymentMethod;
    
    if (paymentMethod === PaymentMethodDto.PAYPAL) {
      return yup.object().shape({
        paypalEmail: yup
          .string()
          .email('Please enter a valid email address')
          .required('PayPal email is required')
      });
    }
    
    if (paymentMethod === PaymentMethodDto.BANK_TRANSFER) {
      return yup.object().shape({
        // Add bank transfer validation if needed in the future
      });
    }
    
    if (paymentMethod === PaymentMethodDto.CRYPTO) {
      return yup.object().shape({
        // Add crypto validation if needed in the future
      });
    }
    
    return yup.object().shape({});
  })
});

export type PaymentUpdateFormData = yup.InferType<typeof PaymentUpdateValidationSchema>;