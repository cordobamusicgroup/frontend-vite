import { PaymentInfo, PaymentMethodDto, BankTransferCurrencyDto, UsdTransferTypeDto, EurTransferTypeDto, CryptoNetworkDto } from '../hooks/useCurrentPaymentInfo';

export const mockPaypalData: PaymentInfo = {
  paymentMethod: PaymentMethodDto.PAYPAL,
  data: {
    paypalEmail: "user@example.com"
  }
};

export const mockBankTransferUsdAch: PaymentInfo = {
  paymentMethod: PaymentMethodDto.BANK_TRANSFER,
  data: {
    currency: BankTransferCurrencyDto.USD,
    accountHolder: {
      first_name: "John",
      last_name: "Doe",
      street_address: "123 Main Street",
      house_number: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States"
    },
    bank_details: {
      transfer_type: UsdTransferTypeDto.ACH,
      ach: {
        routing_number: "021000021",
        account_number: "1234567890",
        account_type: "CHECKING" as any
      }
    }
  }
};

export const mockBankTransferUsdSwift: PaymentInfo = {
  paymentMethod: PaymentMethodDto.BANK_TRANSFER,
  data: {
    currency: BankTransferCurrencyDto.USD,
    accountHolder: {
      first_name: "Jane",
      last_name: "Smith",
      street_address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States"
    },
    bank_details: {
      transfer_type: UsdTransferTypeDto.SWIFT,
      swift: {
        swift_bic: "CHASUS33XXX",
        iban_account_number: "US64SVBKUS6S3300958879"
      }
    }
  }
};

export const mockBankTransferEurSepa: PaymentInfo = {
  paymentMethod: PaymentMethodDto.BANK_TRANSFER,
  data: {
    currency: BankTransferCurrencyDto.EUR,
    accountHolder: {
      first_name: "Carlos",
      last_name: "Rodriguez",
      street_address: "Calle Mayor 15",
      city: "Madrid",
      state: "Madrid",
      zip: "28001",
      country: "Spain"
    },
    bank_details: {
      transfer_type: EurTransferTypeDto.SEPA,
      sepa: {
        account_holder: {
          full_name: "Carlos Rodriguez"
        },
        iban: "ES9121000418450200051332"
      }
    }
  }
};

export const mockBankTransferEurSwift: PaymentInfo = {
  paymentMethod: PaymentMethodDto.BANK_TRANSFER,
  data: {
    currency: BankTransferCurrencyDto.EUR,
    accountHolder: {
      first_name: "Marie",
      last_name: "Dubois",
      street_address: "12 Rue de la Paix",
      city: "Paris",
      state: "Île-de-France",
      zip: "75001",
      country: "France"
    },
    bank_details: {
      transfer_type: EurTransferTypeDto.SWIFT,
      swift: {
        account_holder: {
          full_name: "Marie Dubois"
        },
        swift_bic: "BNPAFRPPXXX",
        iban_account_number: "FR1420041010050500013M02606"
      }
    }
  }
};

export const mockCryptoTron: PaymentInfo = {
  paymentMethod: PaymentMethodDto.CRYPTO,
  data: {
    network: CryptoNetworkDto.TRX,
    walletAddress: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
  }
};

export const mockCryptoTon: PaymentInfo = {
  paymentMethod: PaymentMethodDto.CRYPTO,
  data: {
    network: CryptoNetworkDto.TON,
    walletAddress: "EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG"
  }
};

// Casos edge para testing
export const mockInvalidPaymentMethod: any = {
  paymentMethod: "INVALID_METHOD" as any,
  data: {
    someField: "invalid data"
  }
};

// Nueva respuesta del backend cuando no hay información de pago
export const mockEmptyData: any = {
  paymentMethod: null,
  data: null
};

export const mockCorruptedData: any = {
  paymentMethod: PaymentMethodDto.BANK_TRANSFER,
  data: {
    // Datos incompletos o corruptos
    currency: "USD",
    // Falta accountHolder y bank_details
  }
};

export const mockMissingData: any = {
  paymentMethod: PaymentMethodDto.PAYPAL,
  // Falta el campo data completamente
};

// Simular estado de loading
export const mockLoadingState = "LOADING";

// Simular estado de error
export const mockErrorState = "ERROR";

// Array con todos los mocks para facilitar el testing
export const allMockData = [
  { name: "✅ PayPal", data: mockPaypalData },
  { name: "✅ Bank Transfer USD ACH", data: mockBankTransferUsdAch },
  { name: "✅ Bank Transfer USD SWIFT", data: mockBankTransferUsdSwift },
  { name: "✅ Bank Transfer EUR SEPA", data: mockBankTransferEurSepa },
  { name: "✅ Bank Transfer EUR SWIFT", data: mockBankTransferEurSwift },
  { name: "✅ Crypto Tron (TRC20)", data: mockCryptoTron },
  { name: "✅ Crypto TON", data: mockCryptoTon },
  { name: "⚠️ Invalid Payment Method", data: mockInvalidPaymentMethod },
  { name: "⚠️ No Payment Info (null/null)", data: mockEmptyData },
  { name: "⚠️ Corrupted Data", data: mockCorruptedData },
  { name: "⚠️ Missing Data Field", data: mockMissingData },
  { name: "🔄 Loading State", data: mockLoadingState },
  { name: "❌ Error State", data: mockErrorState },
];