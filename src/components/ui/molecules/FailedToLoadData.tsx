import { Box, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import React from 'react';

interface FailedToLoadDataProps {
  secondaryText?: string;
  children?: React.ReactNode;
}

const FailedToLoadData: React.FC<FailedToLoadDataProps> = ({ secondaryText = 'Failed to load data', children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        mt: 1,
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 3,
          backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(244, 67, 54, 0.1)'),
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

        <Typography variant="h5" color="error.main" gutterBottom>
          Oops! Something went wrong
        </Typography>

        {children ? (
          children
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {secondaryText}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FailedToLoadData;
