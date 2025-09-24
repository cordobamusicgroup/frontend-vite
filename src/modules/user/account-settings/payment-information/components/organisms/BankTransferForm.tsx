import React from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import FormSectionAccordion from '@/components/ui/molecules/FormSectionAccordion';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencySelector from '../atoms/CurrencySelector';
import AccountHolderForm from '../molecules/AccountHolderForm';
import BankDetailsForm from '../molecules/BankDetailsForm';
import { BankTransferCurrencyDto, TransferTypeDto } from '../../types/bankTransfer.types';

interface BankTransferFormProps {
  selectedCurrency: BankTransferCurrencyDto;
  selectedTransferType: TransferTypeDto;
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({ selectedCurrency, selectedTransferType }) => {
  const { formState: { errors } } = useFormContext();

  const hasAccountHolderErrors = !!(errors?.paymentData as any)?.accountHolder;
  const hasBankDetailsErrors = !!(errors?.paymentData as any)?.bank_details;

  return (
    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column' }}>
      <CurrencySelector />
      
      {selectedCurrency && (
        <>
          <FormSectionAccordion
            title="Account Holder Information"
            icon={<PersonIcon />}
            defaultExpanded={false}
            hasError={hasAccountHolderErrors}
          >
            <AccountHolderForm />
          </FormSectionAccordion>
          
          <FormSectionAccordion
            title="Bank Details"
            icon={<AccountBalanceIcon />}
            defaultExpanded={false}
            hasError={hasBankDetailsErrors}
          >
            <BankDetailsForm selectedCurrency={selectedCurrency} selectedTransferType={selectedTransferType} />
          </FormSectionAccordion>
        </>
      )}
    </Box>
  );
};

export default BankTransferForm;