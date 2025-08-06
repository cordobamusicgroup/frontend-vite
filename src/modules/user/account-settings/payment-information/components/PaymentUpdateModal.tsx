import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import { PaymentUpdateValidationSchema, PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';
import { PaymentMethodDto } from '../hooks/useCurrentPaymentInfo';
import { logColor } from '@/lib/log.util';
import { useFetchWithdrawalAuth } from '@/modules/user/financial/payments-operations/hooks/queries/useFetchWithdrawalAuth';

interface PaymentUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentUpdateFormData) => Promise<void>;
  loading?: boolean;
  error?: any;
  isSuccess?: boolean;
}

const PaymentUpdateModal: React.FC<PaymentUpdateModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  error,
  isSuccess = false
}) => {
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { withdrawalData, withdrawalLoading, withdrawalError } = useFetchWithdrawalAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PaymentUpdateFormData>({
    resolver: yupResolver(PaymentUpdateValidationSchema),
    defaultValues: {
      paymentMethod: '',
      paymentData: {}
    }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Reset states when modal opens/closes
  useEffect(() => {
    if (open) {
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [open]);

  // Update states when external props change
  useEffect(() => {
    if (error) {
      setSubmitError(error?.message || 'An error occurred while submitting the request');
      setSubmitSuccess(false);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setSubmitSuccess(true);
      setSubmitError(null);
    }
  }, [isSuccess]);

  const onSubmitForm: SubmitHandler<PaymentUpdateFormData> = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      logColor('info', 'PaymentUpdateModal', 'Form submitted:', data);
      await onSubmit(data);
    } catch (error: any) {
      setSubmitError(error?.message || 'An error occurred while submitting the request');
      setSubmitSuccess(false);
    }
  };

  const handleFormSubmit = handleSubmit(
    (data) => {
      onSubmitForm(data);
    },
    (validationErrors) => {
      if (Object.keys(validationErrors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    }
  );

  const handleClose = () => {
    reset();
    setSubmitError(null);
    setSubmitSuccess(false);
    onClose();
  };

  // Check if user can submit a payment update request
  const canSubmitRequest = () => {
    if (withdrawalLoading) return false;
    if (withdrawalError) return true; // Allow form but will show error
    if (withdrawalData?.isPaymentDataInValidation) return false;
    return true;
  };

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
    const iterate = (errObj: any) => {
      if (errObj?.message) {
        messages.push(errObj.message);
      }
      if (errObj && typeof errObj === 'object') {
        for (const key in errObj) {
          if (typeof errObj[key] === 'object') {
            iterate(errObj[key]);
          }
        }
      }
    };
    iterate(errors);
    return messages;
  };

  const renderPaymentDataFields = () => {
    if (selectedPaymentMethod === PaymentMethodDto.PAYPAL) {
      return (
        <Controller
          name="paymentData.paypalEmail"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="PayPal Email"
              type="email"
              error={!!error}
              helperText={error?.message}
              margin="normal"
            />
          )}
        />
      );
    }

    if (selectedPaymentMethod === PaymentMethodDto.BANK_TRANSFER) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Bank transfer updates will be available soon.
        </Typography>
      );
    }

    if (selectedPaymentMethod === PaymentMethodDto.CRYPTO) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Cryptocurrency updates will be available soon.
        </Typography>
      );
    }

    return null;
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
          <Box component="form" sx={{ mt: 1 }}>
            {/* Success Message */}
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Payment update request submitted successfully! Your request is being processed.
              </Alert>
            )}

            {/* Error Messages */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Validation Status */}
            {getValidationMessage() && (
              <Alert 
                severity={withdrawalData?.isPaymentDataInValidation ? "warning" : withdrawalError ? "error" : "info"} 
                sx={{ mb: 2 }}
              >
                {getValidationMessage()}
              </Alert>
            )}

            {/* Loading state */}
            {withdrawalLoading && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  Checking payment status...
                </Typography>
              </Box>
            )}

            {/* Only show form if there's no pending payment validation */}
            {!withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && (
              <>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth margin="normal" error={!!error}>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        {...field}
                        label="Payment Method"
                      >
                        <MenuItem value={PaymentMethodDto.PAYPAL}>PayPal</MenuItem>
                        <MenuItem value={PaymentMethodDto.BANK_TRANSFER}>Bank Transfer</MenuItem>
                        <MenuItem value={PaymentMethodDto.CRYPTO}>Cryptocurrency</MenuItem>
                      </Select>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />

                {renderPaymentDataFields()}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <BasicButton
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            disabled={loading}
          >
            {submitSuccess ? 'Close' : 'Cancel'}
          </BasicButton>
          {!submitSuccess && !withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && (
            <BasicButton
              onClick={handleFormSubmit}
              color="primary"
              variant="contained"
              loading={loading}
              disabled={loading || !canSubmitRequest()}
            >
              Submit Request
            </BasicButton>
          )}
        </DialogActions>
      </Dialog>

      <ErrorModal2 
        open={isValidationErrorModalOpen} 
        onClose={() => setIsValidationErrorModalOpen(false)}
      >
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