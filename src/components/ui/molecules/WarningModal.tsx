import React, { ReactNode } from 'react';
import { Dialog, DialogActions, Button, Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const WarningModal: React.FC<WarningModalProps> = ({ open, onClose, children, title = "WARNING" }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="warning-dialog-title"
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#fff8e1', // Fondo color warning
            borderTop: '6px solid #f57c00', // Borde naranja en el top
            boxShadow: 'none',
            padding: '16px',
          },
        },
      }}
    >
      <Box mb={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 1 }}>
        <WarningAmberIcon fontSize="large" sx={{ color: '#f57c00' }} />
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f57c00' }}
        >
          {title}
        </Typography>
      </Box>

      <Box p={1}>
        <Typography variant="body1" sx={{ color: '#e65100', lineHeight: 1.6 }}>
          {children}
        </Typography>
      </Box>

      <DialogActions sx={{ justifyContent: 'left', pt: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ 
          backgroundColor: '#f57c00', 
          '&:hover': { backgroundColor: '#e65100' },
          color: 'white',
          fontWeight: 'bold'
        }}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;