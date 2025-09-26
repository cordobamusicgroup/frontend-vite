import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, List, ListItem, ListItemText, Alert } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import PaymentFormContent from './organisms/PaymentFormContent';
import { PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';
import { useFetchWithdrawalAuth } from '@/modules/user/financial/payments-operations/hooks/queries/useFetchWithdrawalAuth';
import { usePaymentUpdateForm } from '../hooks/usePaymentUpdateForm';

interface PaymentUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentUpdateFormData) => Promise<void>;
  loading?: boolean;
  error?: any;
  isSuccess?: boolean;
}

const PaymentUpdateModal: React.FC<PaymentUpdateModalProps> = ({ open, onClose, onSubmit, loading = false, error, isSuccess = false }) => {
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const { withdrawalData, withdrawalLoading, withdrawalError } = useFetchWithdrawalAuth();

  const { methods, selectedPaymentMethod, selectedCurrency, selectedTransferType, onSubmitForm, handleSubmit } = usePaymentUpdateForm({ onSubmit, open });

  const {
    formState: { errors },
    reset,
  } = methods;

  const handleFormSubmitWithValidation = handleSubmit(onSubmitForm, () => setIsValidationErrorModalOpen(true));

  const handleClose = () => {
    reset();
    onClose();
  };

  // Computed values using RHF state
  const canSubmitRequest = !withdrawalLoading && !withdrawalData?.isPaymentDataInValidation;

  const getValidationMessage = () => {
    if (withdrawalLoading) return 'Checking payment status...';
    if (withdrawalError) return 'Error checking payment status. You can still try to submit.';
    if (withdrawalData?.isPaymentDataInValidation) {
      return 'You already have a pending payment information update request. Please wait for it to be processed.';
    }
    return null;
  };

  const extractValidationMessages = (errors: any): string[] => {
    const messages: string[] = [];

    const flattenErrors = (obj: any, path = ''): void => {
      Object.keys(obj).forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (value?.message) {
          messages.push(value.message);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          flattenErrors(value, currentPath);
        }
      });
    };

    if (errors) flattenErrors(errors);
    return messages;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Update Payment Information
          </Typography>
        </DialogTitle>

        <DialogContent>
          <FormProvider {...methods}>
            <Box component="form" sx={{ mt: 1 }}>
              {/* Success Message */}
              {isSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Payment update request submitted successfully! Your request is being processed.
                </Alert>
              )}

              {/* Error Messages */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error?.message || 'An error occurred while submitting the request'}
                </Alert>
              )}

              {/* Validation Status - Only show non-pending messages since pending is shown on main page */}
              {getValidationMessage() && !withdrawalData?.isPaymentDataInValidation && (
                <Alert severity={withdrawalError ? 'error' : 'info'} sx={{ mb: 2 }}>
                  {getValidationMessage()}
                </Alert>
              )}

              {/* Loading state */}
              {withdrawalLoading && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">Checking payment status...</Typography>
                </Box>
              )}

              {/* Only show form if there's no pending payment validation and not successful */}
              {!withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && !isSuccess && (
                <PaymentFormContent selectedPaymentMethod={selectedPaymentMethod} selectedCurrency={selectedCurrency} selectedTransferType={selectedTransferType} />
              )}
            </Box>
          </FormProvider>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <BasicButton onClick={handleClose} color="secondary" variant="outlined" disabled={loading}>
            {isSuccess ? 'Close' : 'Cancel'}
          </BasicButton>
          {!isSuccess && !withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && (
            <BasicButton onClick={handleFormSubmitWithValidation} color="primary" variant="contained" loading={loading} disabled={loading || !canSubmitRequest}>
              Submit Request
            </BasicButton>
          )}
        </DialogActions>
      </Dialog>

      <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
        <List sx={{ padding: 0, margin: 0 }}>
          {extractValidationMessages(errors).map((msg, index) => (
            <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
              <ListItemText primary={`• ${msg}`} sx={{ margin: 0, padding: 0 }} />
            </ListItem>
          ))}
        </List>
      </ErrorModal2>
    </>
  );
};

export default PaymentUpdateModal;
