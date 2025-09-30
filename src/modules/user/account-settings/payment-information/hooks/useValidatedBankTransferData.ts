import { useMemo } from 'react';
import { BankTransferData } from './useCurrentPaymentInfo';

export interface ValidatedBankTransferData {
  isValid: boolean;
  errorMessage?: string;
  normalizedData?: NormalizedBankTransferData;
}

export interface NormalizedAccountHolder {
  fullName: string;
  country: string;
  address: string;
}

export interface NormalizedBankDetails {
  transferType: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: string;
  swiftBic?: string;
  ibanAccountNumber?: string;
  iban?: string;
  accountHolderName?: string;
}

export interface NormalizedBankTransferData {
  currency: string;
  accountHolder: NormalizedAccountHolder;
  bankDetails: NormalizedBankDetails;
}

/**
 * Hook to validate and normalize bank transfer data
 * Separates data validation/transformation logic from presentation
 */
export const useValidatedBankTransferData = (data: BankTransferData): ValidatedBankTransferData => {
  return useMemo(() => {
    // Primary validation - check for required top-level fields
    if (!data?.accountHolder || !data?.bank_details || !data?.currency) {
      return {
        isValid: false,
        errorMessage: 'Missing required payment information. Please update your payment details.',
      };
    }

    const { accountHolder, bank_details, currency } = data;

    // Validate accountHolder has required fields
    if (!accountHolder.first_name || !accountHolder.last_name) {
      return {
        isValid: false,
        errorMessage: 'Incomplete account holder information. Please update your payment details.',
      };
    }

    // Normalize account holder data
    const normalizedAccountHolder: NormalizedAccountHolder = {
      fullName: `${accountHolder.first_name.trim()} ${accountHolder.last_name.trim()}`,
      country: accountHolder.country || 'N/A',
      address: buildFullAddress(accountHolder),
    };

    // Normalize bank details based on currency and transfer type
    const normalizedBankDetails = normalizeBankDetails(bank_details, currency);

    return {
      isValid: true,
      normalizedData: {
        currency,
        accountHolder: normalizedAccountHolder,
        bankDetails: normalizedBankDetails,
      },
    };
  }, [data]);
};

/**
 * Build a complete address string with fallbacks
 */
function buildFullAddress(accountHolder: any): string {
  const parts = [
    accountHolder.street_address || '',
    accountHolder.house_number ? ` ${accountHolder.house_number}` : '',
    ', ',
    accountHolder.city || '',
    ', ',
    accountHolder.state || '',
    ' ',
    accountHolder.zip || '',
  ];

  return parts.join('').replace(/,\s*,/g, ',').replace(/^\s*,\s*|\s*,\s*$/g, '').trim();
}

/**
 * Normalize bank details based on currency and transfer type
 */
function normalizeBankDetails(bankDetails: any, currency: string): NormalizedBankDetails {
  const result: NormalizedBankDetails = {
    transferType: bankDetails.transfer_type || 'Unknown',
  };

  if (currency === 'USD') {
    if (bankDetails.transfer_type === 'ACH' && bankDetails.ach) {
      result.routingNumber = bankDetails.ach.routing_number || 'N/A';
      result.accountNumber = bankDetails.ach.account_number || 'N/A';
      result.accountType = bankDetails.ach.account_type || 'N/A';
    } else if (bankDetails.transfer_type === 'SWIFT' && bankDetails.swift) {
      result.swiftBic = bankDetails.swift.swift_bic || 'N/A';
      result.ibanAccountNumber = bankDetails.swift.iban_account_number || 'N/A';
    }
  } else if (currency === 'EUR') {
    if (bankDetails.transfer_type === 'SEPA' && bankDetails.sepa) {
      result.iban = bankDetails.sepa.iban || 'N/A';
      // Note: For SEPA, we use the main accountHolder data, not nested account_holder
    } else if (bankDetails.transfer_type === 'SWIFT' && bankDetails.swift) {
      result.swiftBic = bankDetails.swift.swift_bic || 'N/A';
      result.ibanAccountNumber = bankDetails.swift.iban_account_number || 'N/A';
      // Note: For EUR SWIFT, we use the main accountHolder data, not nested account_holder
    }
  }

  return result;
}