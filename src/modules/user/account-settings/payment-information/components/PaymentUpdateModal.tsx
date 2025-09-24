import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, List, ListItem, ListItemText, Alert } from '@mui/material';
import { useForm, FormProvider, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import FormSectionAccordion from '@/components/ui/molecules/FormSectionAccordion';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { PaymentUpdateValidationSchema, PaymentUpdateFormData } from '../schemas/PaymentUpdateValidationSchema';
import { PaymentMethodDto, CryptoNetworkDto } from '../hooks/useCurrentPaymentInfo';
import { BankTransferCurrencyDto, TransferTypeDto, UsdAccountTypeDto } from '../types/bankTransfer.types';
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

const PaymentUpdateModal: React.FC<PaymentUpdateModalProps> = ({ open, onClose, onSubmit, loading = false, error, isSuccess = false }) => {
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { withdrawalData, withdrawalLoading, withdrawalError } = useFetchWithdrawalAuth();

  const methods = useForm<PaymentUpdateFormData>({
    resolver: yupResolver(PaymentUpdateValidationSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = methods;

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedCurrency = watch('paymentData.currency');
  const selectedTransferType = watch('paymentData.bank_details.transfer_type');

  // Check for errors in specific sections using React Hook Form errors
  const hasAccountHolderErrors = !!errors?.paymentData?.accountHolder;
  const hasBankDetailsErrors = !!errors?.paymentData?.bank_details;

  // Reset transfer type when currency changes
  useEffect(() => {
    if (selectedCurrency && selectedTransferType) {
      const isValidCombination = 
        (selectedCurrency === BankTransferCurrencyDto.USD && [TransferTypeDto.ACH, TransferTypeDto.SWIFT].includes(selectedTransferType)) ||
        (selectedCurrency === BankTransferCurrencyDto.EUR && [TransferTypeDto.SEPA, TransferTypeDto.SWIFT].includes(selectedTransferType));
      
      if (!isValidCombination) {
        methods.setValue('paymentData.bank_details.transfer_type', '' as any);
        methods.setValue('paymentData.bank_details.ach', undefined);
        methods.setValue('paymentData.bank_details.swift', undefined);
        methods.setValue('paymentData.bank_details.sepa', undefined);
      }
    }
  }, [selectedCurrency, selectedTransferType, methods]);

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
    },
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
    return true; // All payment methods are now supported
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
      return <TextFieldForm name="paymentData.paypalEmail" label="PayPal Email" type="email" variant="outlined" placeholder="Enter your PayPal email address" />;
    }

    if (selectedPaymentMethod === PaymentMethodDto.BANK_TRANSFER) {
      return (
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column' }}>
          <Controller
            name="paymentData.currency"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error} sx={{ marginBottom: 1.5 }}>
                <InputLabel>Currency</InputLabel>
                <Select {...field} label="Currency" value={field.value || ''}>
                  <MenuItem value={BankTransferCurrencyDto.USD}>USD</MenuItem>
                  <MenuItem value={BankTransferCurrencyDto.EUR}>EUR</MenuItem>
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          
          {selectedCurrency && (
            <>
              <FormSectionAccordion
                title="Account Holder Information"
                icon={<PersonIcon />}
                defaultExpanded={false}
                hasError={hasAccountHolderErrors}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  <TextFieldForm name="paymentData.accountHolder.first_name" label="First Name" variant="outlined" placeholder="Enter first name" />
                  <TextFieldForm name="paymentData.accountHolder.last_name" label="Last Name" variant="outlined" placeholder="Enter last name" />
                </Box>
                
                <TextFieldForm name="paymentData.accountHolder.street_address" label="Street Address" variant="outlined" placeholder="Enter street address" />
                <TextFieldForm name="paymentData.accountHolder.house_number" label="House Number (Optional)" variant="outlined" placeholder="Enter house number (optional)" />
                
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                  <TextFieldForm name="paymentData.accountHolder.city" label="City" variant="outlined" placeholder="Enter city" />
                  <TextFieldForm name="paymentData.accountHolder.state" label="State" variant="outlined" placeholder="Enter state" />
                  <TextFieldForm name="paymentData.accountHolder.zip" label="ZIP Code" variant="outlined" placeholder="Enter ZIP code" />
                </Box>
                
                <TextFieldForm name="paymentData.accountHolder.country" label="Country" variant="outlined" placeholder="Enter country" />
              </FormSectionAccordion>
              
              <FormSectionAccordion
                title="Bank Details"
                icon={<AccountBalanceIcon />}
                defaultExpanded={false}
                hasError={hasBankDetailsErrors}
              >
              
              <Controller
                name="paymentData.bank_details.transfer_type"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const getMenuItems = () => {
                    if (selectedCurrency === BankTransferCurrencyDto.USD) {
                      return [
                        <MenuItem key="ach" value={TransferTypeDto.ACH}>ACH</MenuItem>,
                        <MenuItem key="swift-usd" value={TransferTypeDto.SWIFT}>SWIFT</MenuItem>
                      ];
                    }
                    if (selectedCurrency === BankTransferCurrencyDto.EUR) {
                      return [
                        <MenuItem key="sepa" value={TransferTypeDto.SEPA}>SEPA</MenuItem>,
                        <MenuItem key="swift-eur" value={TransferTypeDto.SWIFT}>SWIFT</MenuItem>
                      ];
                    }
                    return [];
                  };

                  return (
                    <FormControl fullWidth error={!!error} sx={{ marginBottom: 1, marginTop: 1 }}>
                      <InputLabel>Transfer Type</InputLabel>
                      <Select {...field} label="Transfer Type" value={field.value || ''}>
                        {getMenuItems()}
                      </Select>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  );
                }}
              />
              
              {selectedTransferType === TransferTypeDto.ACH && (
                <>
                  <TextFieldForm name="paymentData.bank_details.ach.routing_number" label="Routing Number" variant="outlined" placeholder="Enter routing number" />
                  <TextFieldForm name="paymentData.bank_details.ach.account_number" label="Account Number" variant="outlined" placeholder="Enter account number" />
                  <Controller
                    name="paymentData.bank_details.ach.account_type"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error} sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>Account Type</InputLabel>
                        <Select {...field} label="Account Type" value={field.value || ''}>
                          <MenuItem value={UsdAccountTypeDto.CHECKING}>Checking</MenuItem>
                          <MenuItem value={UsdAccountTypeDto.SAVINGS}>Savings</MenuItem>
                        </Select>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
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
              </FormSectionAccordion>
            </>
          )}
        </Box>
      );
    }

    if (selectedPaymentMethod === PaymentMethodDto.CRYPTO) {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>CRITICAL:</strong> This wallet address will receive USDC payments from us. Do NOT enter an address that doesn't support USDC tokens. Using an incompatible address will result in
              permanent loss of funds.
            </Typography>
          </Alert>

          <Controller
            name="paymentData.network"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>Cryptocurrency Network (USDC Only)</InputLabel>
                <Select {...field} label="Cryptocurrency Network (USDC Only)">
                  <MenuItem value={CryptoNetworkDto.BSC}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        BNB Smart Chain (BEP20) - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 0.02 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.SOL}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Solana - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 0.5 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.ETH}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Ethereum (ERC20) - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 1 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CryptoNetworkDto.XLM}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Stellar Network - USDC
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Fee: 1 USDC
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />

          <TextFieldForm
            name="paymentData.walletAddress"
            label="USDC Wallet Address"
            variant="outlined"
            placeholder="Enter your USDC wallet address"
            inputProps={{ style: { fontFamily: 'monospace' } }}
            helperText="Enter your USDC wallet address where you want to receive payments"
          />

          {selectedPaymentMethod === PaymentMethodDto.CRYPTO && watch('paymentData.network') === CryptoNetworkDto.XLM && (
            <TextFieldForm name="paymentData.memo" label="Memo (Optional)" variant="outlined" placeholder="Enter memo (optional)" helperText="Optional memo for Stellar USDC transactions - required by some exchanges" />
          )}

          <Alert severity="info">
            <Typography variant="body2">Withdrawal payments are processed instantly. Verify your wallet address carefully as transactions cannot be reversed.</Typography>
          </Alert>
        </Box>
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
          <FormProvider {...methods}>
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
              {!withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && !submitSuccess && (
                <>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl fullWidth error={!!error} sx={{ marginBottom: 1.5 }}>
                        <InputLabel>Payment Method</InputLabel>
                        <Select {...field} label="Payment Method">
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
          </FormProvider>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <BasicButton onClick={handleClose} color="secondary" variant="outlined" disabled={loading}>
            {submitSuccess ? 'Close' : 'Cancel'}
          </BasicButton>
          {!submitSuccess && !withdrawalData?.isPaymentDataInValidation && !withdrawalLoading && (
            <BasicButton onClick={handleFormSubmit} color="primary" variant="contained" loading={loading} disabled={loading || !canSubmitRequest()}>
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
