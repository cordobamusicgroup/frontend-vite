import React from 'react';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import BasicButton from '@/components/ui/atoms/BasicButton';

interface UPCFieldWithValidationProps {
  onValidate: () => void;
  isValidating: boolean;
  isDisabled?: boolean;
  onChangeUPC?: () => void;
}

const UPCFieldWithValidation: React.FC<UPCFieldWithValidationProps> = ({
  onValidate,
  isValidating,
  isDisabled = false,
  onChangeUPC,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const upcValue = watch('upc');

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Controller
        name="upc"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="UPC/EAN/GTIN-13"
            variant="outlined"
            placeholder="Enter 12 or 13 digit UPC code"
            helperText={errors.upc?.message as string || 'Enter the Universal Product Code for your release'}
            error={!!errors.upc}
            disabled={isDisabled || isValidating}
            required
            fullWidth
            InputProps={{
              endAdornment: isDisabled && onChangeUPC && (
                <InputAdornment position="end">
                  <Button
                    onClick={onChangeUPC}
                    size="small"
                    sx={{
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      minWidth: 'auto',
                      padding: '4px 8px',
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(9, 54, 95, 0.04)',
                      },
                    }}
                  >
                    Change Product Code
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <BasicButton
        onClick={onValidate}
        variant="contained"
        color="primary"
        loading={isValidating}
        disabled={isValidating || !upcValue || !!errors.upc || isDisabled}
        sx={{ minWidth: 100, height: 56, flexShrink: 0 }}
      >
        Validate
      </BasicButton>
    </Box>
  );
};

export default UPCFieldWithValidation;
