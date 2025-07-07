import { Alert, AlertTitle, Box, Typography, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { useNotificationStore, NotificationType } from '../../../stores/notification.store';

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircleOutlineIcon fontSize="large" />,
  error: <ErrorOutlineIcon fontSize="large" />,
  warning: <WarningAmberIcon fontSize="large" />,
  info: <InfoOutlinedIcon fontSize="large" />,
};

const titleMap: Record<NotificationType, string> = {
  success: 'SUCCESS',
  error: 'ERROR',
  warning: 'WARNING',
  info: 'INFO',
};

const colorMap: Record<NotificationType, string> = {
  success: '#e7f5e9',
  error: '#fdecea',
  warning: '#fff4e5',
  info: '#e8f4fd',
};

const borderMap: Record<NotificationType, string> = {
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1',
};

const NotificationBox: React.FC = () => {
  const { notification, clearNotification } = useNotificationStore();

  if (!notification) return null;

  return (
    <Box mb={2}>
      <Alert
        severity={notification.type}
        iconMapping={{
          success: iconMap.success,
          error: iconMap.error,
          warning: iconMap.warning,
          info: iconMap.info,
        }}
        action={
          <IconButton aria-label="close" color="inherit" size="small" onClick={clearNotification}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          backgroundColor: colorMap[notification.type],
          color: borderMap[notification.type],
          borderLeft: `6px solid ${borderMap[notification.type]}`,
          padding: '16px',
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
            {titleMap[notification.type]}
          </Typography>
        </AlertTitle>
        <Typography variant="body2">{notification.message}</Typography>
      </Alert>
    </Box>
  );
};

export default NotificationBox;
