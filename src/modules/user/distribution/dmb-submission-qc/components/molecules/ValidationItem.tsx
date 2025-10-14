import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { ValidationItem as ValidationItemType, ValidationStatus } from '../../types/validation.types';

interface ValidationItemProps {
  item: ValidationItemType;
}

const ValidationItem: React.FC<ValidationItemProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.status) {
      case ValidationStatus.PASSED:
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />;
      case ValidationStatus.FAILED:
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />;
      case ValidationStatus.WARNING:
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (item.status) {
      case ValidationStatus.PASSED:
        return 'success.main';
      case ValidationStatus.FAILED:
        return 'error.main';
      case ValidationStatus.WARNING:
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      {getIcon()}
      <Typography variant="body2" sx={{ color: getColor() }}>
        {item.message}
      </Typography>
    </Box>
  );
};

export default ValidationItem;
