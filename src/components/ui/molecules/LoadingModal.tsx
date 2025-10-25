import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';

interface LoadingModalProps {
  open: boolean;
  message?: string;
}

/**
 * LoadingModal component
 * Displays a centered modal with a loading spinner and message
 *
 * @param open - Controls modal visibility
 * @param message - Loading message to display (default: "Processing...")
 */
const LoadingModal: React.FC<LoadingModalProps> = ({
  open,
  message = 'Processing...'
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 350,
          maxWidth: 450,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 3,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              mb: 3,
            }}
          >
            <CircularProgress
              size={70}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {message}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              maxWidth: 300,
            }}
          >
            Please wait, this may take a few moments...
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
