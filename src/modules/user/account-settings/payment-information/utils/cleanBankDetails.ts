import { BankTransferCurrencyDto, TransferTypeDto, BankDetailsDto } from '../types/bankTransfer.types';

/**
 * Cleans bank details object by removing fields that don't correspond to the selected transfer type and currency
 */
export function cleanBankDetails(
  bankDetails: Partial<BankDetailsDto>,
  transferType: TransferTypeDto,
  currency: BankTransferCurrencyDto
): BankDetailsDto {
  const cleanedDetails: BankDetailsDto = {
    transfer_type: transferType,
  };

  // Only include the relevant details based on transfer type and currency
  if (transferType === TransferTypeDto.ACH && currency === BankTransferCurrencyDto.USD) {
    if (bankDetails.ach) {
      cleanedDetails.ach = bankDetails.ach;
    }
  } else if (transferType === TransferTypeDto.SWIFT) {
    // SWIFT works for both USD and EUR
    if (bankDetails.swift) {
      cleanedDetails.swift = bankDetails.swift;
    }
  } else if (transferType === TransferTypeDto.SEPA && currency === BankTransferCurrencyDto.EUR) {
    if (bankDetails.sepa) {
      cleanedDetails.sepa = bankDetails.sepa;
    }
  }

  return cleanedDetails;
}

/**
 * Cleans the entire payment form data before submission
 */
export function cleanPaymentFormData<T extends { paymentData?: { currency?: BankTransferCurrencyDto; bank_details?: Partial<BankDetailsDto> } }>(
  formData: T
): T {
  if (!formData.paymentData?.bank_details || !formData.paymentData.currency) {
    return formData;
  }

  const { transfer_type, ...restBankDetails } = formData.paymentData.bank_details;

  if (!transfer_type) {
    return formData;
  }

  const cleanedBankDetails = cleanBankDetails(
    restBankDetails,
    transfer_type as TransferTypeDto,
    formData.paymentData.currency
  );

  return {
    ...formData,
    paymentData: {
      ...formData.paymentData,
      bank_details: cleanedBankDetails,
    },
  };
}