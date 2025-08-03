import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface ErrorModalProps {
  open: boolean;
  onClose?: () => void;
  errorMessage: string;
  showCloseButton?: boolean;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, errorMessage, showCloseButton = true }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" color="error">
          Something went wrong
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
        {showCloseButton && (
          <Button onClick={onClose} sx={{ mt: 2 }} variant="contained" color="error">
            Close
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default ErrorModal;
