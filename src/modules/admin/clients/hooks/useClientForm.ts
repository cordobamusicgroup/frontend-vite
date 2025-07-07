import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClientValidationYupSchema } from '../schemas/ClientValidationYupSchema';
import { InferType } from 'yup';

export type ClientFormData = InferType<typeof ClientValidationYupSchema>;

export function useClientForm(onSubmitClient: (data: ClientFormData) => void, onError: (msg: string) => void, onSuccess: () => void) {
  const methods = useForm<ClientFormData>({
    mode: 'all',
    resolver: yupResolver(ClientValidationYupSchema),
  });
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const handleInputChange = useCallback(() => {
    onError('');
  }, [onError]);

  const handleClientFormSubmit = methods.handleSubmit(
    (formData) => {
      onSubmitClient(formData);
    },
    (validationErrors) => {
      if (Object.keys(validationErrors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  return {
    ...methods,
    isValidationErrorModalOpen,
    setIsValidationErrorModalOpen,
    handleClientFormSubmit,
    handleInputChange,
  } as UseFormReturn<ClientFormData> & {
    isValidationErrorModalOpen: boolean;
    setIsValidationErrorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleClientFormSubmit: () => void;
    handleInputChange: () => void;
  };
}
