import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReleaseSubmissionValidationSchema, ReleaseSubmissionFormData } from '../schemas/ReleaseSubmissionValidationSchema';

interface UseReleaseSubmissionFormProps {
  onSubmit: (data: ReleaseSubmissionFormData) => Promise<void>;
}

export const useReleaseSubmissionForm = ({ onSubmit }: UseReleaseSubmissionFormProps) => {
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const methods = useForm<ReleaseSubmissionFormData>({
    mode: 'all',
    resolver: yupResolver(ReleaseSubmissionValidationSchema),
    defaultValues: {
      upc: '',
      albumTitle: '',
      albumArtist: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmitForm: SubmitHandler<ReleaseSubmissionFormData> = async (formData) => {
    await onSubmit(formData);
  };

  const handleFormSubmitWithValidation = handleSubmit(onSubmitForm, (validationErrors) => {
    if (Object.keys(validationErrors).length > 0) {
      setIsValidationErrorModalOpen(true);
    }
  });

  return {
    methods,
    handleFormSubmitWithValidation,
    isValidationErrorModalOpen,
    setIsValidationErrorModalOpen,
    errors,
    reset,
  };
};
