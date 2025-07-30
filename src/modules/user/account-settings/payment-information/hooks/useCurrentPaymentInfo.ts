import { useQuery } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';

export enum PaymentMethodDto {
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  CRYPTO = 'CRYPTO',
}

export enum CryptoNetworkDto {
  TRX = 'TRX',
  TON = 'TON',
}

export enum BankTransferCurrencyDto {
  USD = 'USD',
  EUR = 'EUR',
}

export enum UsdTransferTypeDto {
  ACH = 'ACH',
  SWIFT = 'SWIFT',
}

export enum UsdAccountTypeDto {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
}

export enum EurTransferTypeDto {
  SEPA = 'SEPA',
  SWIFT = 'SWIFT',
}

export interface PaypalData {
  paypalEmail: string;
}

export interface CryptoData {
  network: CryptoNetworkDto;
  walletAddress: string;
}

export interface AccountHolder {
  first_name: string;
  last_name: string;
  street_address: string;
  house_number?: string;
  state: string;
  city: string;
  zip: string;
  country: string;
}

export interface UsdAchDetails {
  routing_number: string;
  account_number: string;
  account_type: UsdAccountTypeDto;
}

export interface UsdSwiftDetails {
  swift_bic: string;
  iban_account_number: string;
}

export interface UsdBankDetails {
  transfer_type: UsdTransferTypeDto;
  ach?: UsdAchDetails;
  swift?: UsdSwiftDetails;
}

export interface EurAccountHolder {
  full_name: string;
}

export interface EurSepaDetails {
  account_holder: EurAccountHolder;
  iban: string;
}

export interface EurSwiftDetails {
  account_holder: EurAccountHolder;
  swift_bic: string;
  iban_account_number: string;
}

export interface EurBankDetails {
  transfer_type: EurTransferTypeDto;
  sepa?: EurSepaDetails;
  swift?: EurSwiftDetails;
}

export interface BankTransferData {
  currency: BankTransferCurrencyDto;
  accountHolder: AccountHolder;
  bank_details: UsdBankDetails | EurBankDetails;
}

export interface PaymentInfo {
  paymentMethod: PaymentMethodDto;
  data: PaypalData | BankTransferData | CryptoData;
}

/**
 * Hook para obtener la información de pago actual del usuario
 */
export const useCurrentPaymentInfo = () => {
  const { apiRequest } = useApiRequest();

  const queryKey = ['current-payment-info'];

  /**
   * Function to fetch current payment information
   */
  const fetchCurrentPaymentInfo = async (): Promise<PaymentInfo | null> => {
    try {
      const url = apiRoutes.financial.payments.currentPaymentInfo;
      const response = await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching payment info:', error);
      throw error;
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchCurrentPaymentInfo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: false,
  });

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
  };
};
