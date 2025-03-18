import { Alert, AlertTitle, Box, Typography, IconButton } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNotificationStore } from "../../../stores";

interface ErrorBoxProps {
  children: React.ReactNode;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ children }) => {
  const notificationState = useNotificationStore();

  return (
    <Box mb={2}>
      <Alert
        severity="error"
        iconMapping={{
          error: <ErrorOutlineIcon fontSize="large" />,
        }}
        action={
          <IconButton aria-label="close" color="inherit" size="small" onClick={notificationState.clearNotification}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          backgroundColor: "#fdecea",
          color: "#d32f2f",
          borderLeft: "6px solid #d32f2f",
          padding: "16px",
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            ERROR
          </Typography>
        </AlertTitle>
        <Typography variant="body2">{children}</Typography>
      </Alert>
    </Box>
  );
};

export default ErrorBox;
