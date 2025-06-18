import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface SessionTimeoutDialogProps {
  open: boolean;
  countdown: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

const SessionTimeoutDialog: React.FC<SessionTimeoutDialogProps> = ({ open, countdown, onStayLoggedIn, onLogout }) => {
  return (
    <Dialog open={open} onClose={onLogout} maxWidth="xs" fullWidth>
      <DialogTitle>Session Expiring</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>
          Your session will expire soon. Do you want to stay logged in?
        </Typography>
        <Typography variant="body2">This window will close in {countdown} seconds.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogout} color="secondary">
          Logout
        </Button>
        <Button onClick={onStayLoggedIn} color="primary" variant="contained">
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutDialog;
