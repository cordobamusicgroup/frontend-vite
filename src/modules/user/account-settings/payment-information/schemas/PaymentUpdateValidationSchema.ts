import * as yup from 'yup';
import { PaymentMethodDto, CryptoNetworkDto, CRYPTO_NETWORKS } from '../hooks/useCurrentPaymentInfo';
import { BankTransferCurrencyDto, TransferTypeDto, UsdAccountTypeDto, USD_TRANSFER_TYPES, EUR_TRANSFER_TYPES, BANK_TRANSFER_CURRENCIES, USD_ACCOUNT_TYPES } from '../types/bankTransfer.types';
import { cleanPaymentFormData } from '../utils/cleanBankDetails';

// Validation patterns for wallet addresses
const walletPatterns = {
  [CryptoNetworkDto.BSC]: /^0x[a-fA-F0-9]{40}$/,
  [CryptoNetworkDto.ETH]: /^0x[a-fA-F0-9]{40}$/,
  [CryptoNetworkDto.SOL]: /^[A-Za-z0-9]{32,44}$/,
  [CryptoNetworkDto.XLM]: /^[GM][A-Z2-7]{55}$/,
};

const walletErrorMessages = {
  [CryptoNetworkDto.BSC]: 'Please enter a valid BSC wallet address (starts with 0x)',
  [CryptoNetworkDto.ETH]: 'Please enter a valid Ethereum wallet address (starts with 0x)',
  [CryptoNetworkDto.SOL]: 'Please enter a valid Solana wallet address',
  [CryptoNetworkDto.XLM]: 'Please enter a valid Stellar wallet address (starts with G or M)',
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
            network: yup.string().oneOf(CRYPTO_NETWORKS, 'Invalid cryptocurrency network').required('Network is required'),
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
            memo: yup.string().optional(),
          }),
        otherwise: (schema) =>
          schema.when('paymentMethod', {
            is: PaymentMethodDto.BANK_TRANSFER,
            then: (schema) =>
              schema.shape({
                currency: yup.string().oneOf(BANK_TRANSFER_CURRENCIES, 'Invalid currency').required('Currency is required'),
                accountHolder: yup.object().shape({
                  first_name: yup.string().required('First name is required'),
                  last_name: yup.string().required('Last name is required'),
                  street_address: yup.string().required('Street address is required'),
                  house_number: yup.string().optional(),
                  state: yup.string().required('State is required'),
                  city: yup.string().required('City is required'),
                  zip: yup.string().required('ZIP code is required'),
                  country: yup.string().required('Country is required'),
                }).required('Account holder information is required'),
                bank_details: yup.object().shape({
                  transfer_type: yup.string().test('currency-transfer-type-validation', function (value) {
                    const currency = this.parent.currency;
                    
                    if (!value) {
                      return this.createError({ message: 'Transfer type is required' });
                    }
                    
                    if (currency === BankTransferCurrencyDto.USD && !USD_TRANSFER_TYPES.includes(value as any)) {
                      return this.createError({ message: 'For USD, only ACH and SWIFT transfer types are allowed' });
                    }
                    
                    if (currency === BankTransferCurrencyDto.EUR && !EUR_TRANSFER_TYPES.includes(value as any)) {
                      return this.createError({ message: 'For EUR, only SEPA and SWIFT transfer types are allowed' });
                    }
                    
                    return true;
                  }).required('Transfer type is required'),
                  ach: yup.object().when(['transfer_type'], {
                    is: TransferTypeDto.ACH,
                    then: (schema) => schema.shape({
                      routing_number: yup.string().required('Routing number is required'),
                      account_number: yup.string().required('Account number is required'),
                      account_type: yup.string().oneOf(USD_ACCOUNT_TYPES, 'Invalid account type').required('Account type is required'),
                    }).required(),
                    otherwise: (schema) => schema.optional(),
                  }),
                  swift: yup.object().when(['transfer_type'], {
                    is: TransferTypeDto.SWIFT,
                    then: (schema) => schema.shape({
                      swift_bic: yup.string().required('SWIFT BIC is required'),
                      iban_account_number: yup.string().required('IBAN account number is required'),
                    }).required(),
                    otherwise: (schema) => schema.optional(),
                  }),
                  sepa: yup.object().when(['transfer_type'], {
                    is: TransferTypeDto.SEPA,
                    then: (schema) => schema.shape({
                      iban: yup.string().required('IBAN is required'),
                    }).required(),
                    otherwise: (schema) => schema.optional(),
                  }),
                }).required('Bank details are required'),
              }),
            otherwise: (schema) => schema.shape({}),
          }),
      }),
  }),
}).transform((value) => {
  // Automatically clean the form data after validation
  return cleanPaymentFormData(value);
});

export type PaymentUpdateFormData = {
  paymentMethod: PaymentMethodDto;
  paymentData: {
    paypalEmail?: string;
    network?: CryptoNetworkDto;
    walletAddress?: string;
    memo?: string;
    currency?: BankTransferCurrencyDto;
    accountHolder?: {
      first_name: string;
      last_name: string;
      street_address: string;
      house_number?: string;
      state: string;
      city: string;
      zip: string;
      country: string;
    };
    bank_details?: {
      transfer_type: TransferTypeDto;
      ach?: {
        routing_number: string;
        account_number: string;
        account_type: UsdAccountTypeDto;
      };
      swift?: {
        swift_bic: string;
        iban_account_number: string;
      };
      sepa?: {
        iban: string;
      };
    };
  };
};
