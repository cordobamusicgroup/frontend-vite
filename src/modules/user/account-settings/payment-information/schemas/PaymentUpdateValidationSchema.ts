import * as yup from 'yup';
import { PaymentMethodDto, CryptoNetworkDto } from '../hooks/useCurrentPaymentInfo';

// Validation patterns for wallet addresses
const walletPatterns = {
  [CryptoNetworkDto.BSC]: /^0x[a-fA-F0-9]{40}$/,
  [CryptoNetworkDto.ETH]: /^0x[a-fA-F0-9]{40}$/,
  [CryptoNetworkDto.SOL]: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  [CryptoNetworkDto.XLM]: /^G[A-Z0-9]{55}$/,
};

const walletErrorMessages = {
  [CryptoNetworkDto.BSC]: 'Please enter a valid BSC wallet address (starts with 0x)',
  [CryptoNetworkDto.ETH]: 'Please enter a valid Ethereum wallet address (starts with 0x)',
  [CryptoNetworkDto.SOL]: 'Please enter a valid Solana wallet address',
  [CryptoNetworkDto.XLM]: 'Please enter a valid Stellar wallet address (starts with G)',
};

/**
 * Validation schema for payment update request using Yup
 */
export const PaymentUpdateValidationSchema = yup.object().shape({
  paymentMethod: yup.string().oneOf([PaymentMethodDto.PAYPAL, PaymentMethodDto.BANK_TRANSFER, PaymentMethodDto.CRYPTO], 'Invalid payment method').required('Payment method is required'),
  paymentData: yup.object().when('paymentMethod', {
    is: PaymentMethodDto.PAYPAL,
    then: (schema) =>
      schema.shape({
        paypalEmail: yup.string().email('Please enter a valid email address').required('PayPal email is required'),
      }),
    otherwise: (schema) =>
      schema.when('paymentMethod', {
        is: PaymentMethodDto.CRYPTO,
        then: (schema) =>
          schema.shape({
            network: yup.string().oneOf(Object.values(CryptoNetworkDto), 'Invalid cryptocurrency network').required('Network is required'),
            walletAddress: yup
              .string()
              .required('Wallet address is required')
              .test('wallet-format', function (value) {
                const { network } = this.parent;
                if (!network || !value) return true; // Let required validation handle empty values

                const pattern = walletPatterns[network as CryptoNetworkDto];
                if (!pattern) {
                  return this.createError({ message: 'Unsupported network selected' });
                }

                if (!pattern.test(value)) {
                  return this.createError({
                    message: walletErrorMessages[network as CryptoNetworkDto],
                  });
                }

                return true;
              }),
            memo: yup
              .string()
              .optional()
              .test('memo-validation', 'Memo cannot be empty when provided', function (value) {
                // If memo is provided, it cannot be empty or just whitespace
                if (value !== undefined && value !== null && value.trim().length === 0) {
                  return false;
                }
                return true;
              }),
          }),
        otherwise: (schema) => schema.shape({}),
      }),
  }),
});

export type PaymentUpdateFormData = {
  paymentMethod: PaymentMethodDto;
  paymentData: {
    paypalEmail?: string;
    network?: CryptoNetworkDto;
    walletAddress?: string;
    memo?: string;
  };
};
