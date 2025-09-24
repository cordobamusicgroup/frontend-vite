export enum BankTransferCurrencyDto {
  USD = 'USD',
  EUR = 'EUR',
}

export enum TransferTypeDto {
  ACH = 'ACH',
  SWIFT = 'SWIFT',
  SEPA = 'SEPA',
}

export enum UsdAccountTypeDto {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
}

export interface UsdAchDetailsDto {
  routing_number: string;
  account_number: string;
  account_type: UsdAccountTypeDto;
}

export interface UsdSwiftDetailsDto {
  swift_bic: string;
  iban_account_number: string;
}

export interface EurSepaDetailsDto {
  iban: string;
}

export interface EurSwiftDetailsDto {
  swift_bic: string;
  iban_account_number: string;
}

export interface BankDetailsDto {
  transfer_type: TransferTypeDto;
  ach?: UsdAchDetailsDto;
  swift?: UsdSwiftDetailsDto | EurSwiftDetailsDto;
  sepa?: EurSepaDetailsDto;
}

// Helper types for currency-specific transfer types
export const USD_TRANSFER_TYPES = [TransferTypeDto.ACH, TransferTypeDto.SWIFT] as const;
export const EUR_TRANSFER_TYPES = [TransferTypeDto.SEPA, TransferTypeDto.SWIFT] as const;

export type UsdTransferTypeDto = typeof USD_TRANSFER_TYPES[number];
export type EurTransferTypeDto = typeof EUR_TRANSFER_TYPES[number];

export interface AccountHolderDto {
  first_name: string;
  last_name: string;
  street_address: string;
  house_number?: string;
  state: string;
  city: string;
  zip: string;
  country: string;
}

export interface BankTransferDataDto {
  currency: BankTransferCurrencyDto;
  accountHolder: AccountHolderDto;
  bank_details: BankDetailsDto;
}