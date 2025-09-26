import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { PaymentUpdateValidationSchema, PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';
import { PaymentMethodDto } from './useCurrentPaymentInfo';
import { BankTransferCurrencyDto, TransferTypeDto } from '../types/bankTransfer.types';
import { logColor } from '@/lib/log.util';

interface UsePaymentUpdateFormProps {
  onSubmit: (data: PaymentUpdateFormData) => Promise<void>;
  open: boolean;
}

export const usePaymentUpdateForm = ({ onSubmit, open }: UsePaymentUpdateFormProps) => {
  const methods = useForm<PaymentUpdateFormData>({
    resolver: yupResolver(PaymentUpdateValidationSchema, {
      stripUnknown: true,
      abortEarly: false,
    }),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, reset, watch } = methods;

  const selectedPaymentMethod = watch('paymentMethod') as PaymentMethodDto;
  const selectedCurrency = watch('paymentData.currency') as BankTransferCurrencyDto;
  const selectedTransferType = watch('paymentData.bank_details.transfer_type') as TransferTypeDto;

  // Only reset payment data when payment method changes
  useEffect(() => {
    if (!selectedPaymentMethod) return;
    methods.resetField('paymentData');
  }, [selectedPaymentMethod, methods]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmitForm: SubmitHandler<PaymentUpdateFormData> = async (data) => {
    logColor('info', 'PaymentUpdateForm', 'Form submitted (already cleaned by schema):', data);
    await onSubmit(data);
  };

  return {
    methods,
    selectedPaymentMethod,
    selectedCurrency,
    selectedTransferType,
    onSubmitForm,
    handleSubmit,
  };
};