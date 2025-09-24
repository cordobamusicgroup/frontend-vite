import React from 'react';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import TransferTypeSelector from '../atoms/TransferTypeSelector';
import AccountTypeSelector from '../atoms/AccountTypeSelector';
import { BankTransferCurrencyDto, TransferTypeDto } from '../../types/bankTransfer.types';

interface BankDetailsFormProps {
  selectedCurrency: BankTransferCurrencyDto;
  selectedTransferType: TransferTypeDto;
}

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ selectedCurrency, selectedTransferType }) => {
  return (
    <>
      <TransferTypeSelector selectedCurrency={selectedCurrency} />
      
      {selectedTransferType === TransferTypeDto.ACH && (
        <>
          <TextFieldForm name="paymentData.bank_details.ach.routing_number" label="Routing Number" variant="outlined" placeholder="Enter routing number" />
          <TextFieldForm name="paymentData.bank_details.ach.account_number" label="Account Number" variant="outlined" placeholder="Enter account number" />
          <AccountTypeSelector />
        </>
      )}
      
      {selectedTransferType === TransferTypeDto.SWIFT && (
        <>
          <TextFieldForm name="paymentData.bank_details.swift.swift_bic" label="SWIFT BIC" variant="outlined" placeholder="Enter SWIFT BIC code" />
          <TextFieldForm name="paymentData.bank_details.swift.iban_account_number" label="IBAN Account Number" variant="outlined" placeholder="Enter IBAN account number" />
        </>
      )}
      
      {selectedTransferType === TransferTypeDto.SEPA && (
        <TextFieldForm name="paymentData.bank_details.sepa.iban" label="IBAN" variant="outlined" placeholder="Enter IBAN number" />
      )}
    </>
  );
};

export default BankDetailsForm;