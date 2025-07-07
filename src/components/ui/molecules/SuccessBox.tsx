import { Alert, AlertTitle, Box, Typography, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useNotificationStore } from '../../../stores';

interface SuccessBoxProps {
  children: React.ReactNode;
}

/**
 * @deprecated Use NotificationBox instead for unified notifications.
 * SuccessBox will be removed in future versions.
 */
const SuccessBox: React.FC<SuccessBoxProps> = ({ children }) => {
  const notificationState = useNotificationStore();

  return (
    <Box mb={2}>
      <Alert
        severity="success"
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="large" />,
        }}
        action={
          <IconButton aria-label="close" color="inherit" size="small" onClick={notificationState.clearNotification}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          backgroundColor: '#e7f5e9',
          color: '#2e7d32',
          borderLeft: '6px solid #2e7d32',
          padding: '16px',
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
            SUCCESS
          </Typography>
        </AlertTitle>
        <Typography variant="body2">{children}</Typography>
      </Alert>
    </Box>
  );
};

export default SuccessBox;
