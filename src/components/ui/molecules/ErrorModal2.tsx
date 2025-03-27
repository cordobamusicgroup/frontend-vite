import React, { ReactNode } from "react";
import { Dialog, DialogActions, Button, Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorModal2Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode; // El contenido personalizado de errores
}

const ErrorModal2: React.FC<ErrorModal2Props> = ({ open, onClose, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#fdecea", // Fondo color alerta
          borderTop: "6px solid #d32f2f", // Borde rojo en el lateral
          boxShadow: "none", // Sin sombras para parecerse más a la alerta
          padding: "16px", // Padding para espaciar mejor el contenido
        },
      }}
    >
      <Box mb={1} sx={{ display: "flex", alignItems: "center", justifyContent: "left", gap: 1 }}>
        <ErrorOutlineIcon fontSize="large" sx={{ color: "#d32f2f" }} />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", color: "#d32f2f" }}>
          ERROR
        </Typography>
      </Box>

      <Box p={1}>
        <Typography variant="body2" sx={{ color: "#d32f2f" }}>
          {children}
        </Typography>
      </Box>

      <DialogActions sx={{ justifyContent: "left" }}>
        <Button onClick={onClose} variant="contained" color="error">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal2;
