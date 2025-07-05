import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormProvider, useForm } from 'react-hook-form';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import InformativeBox from '@/components/ui/molecules/InformativeBox';
import { eventBus } from '@/eventBus';
import { useNotificationStore } from '@/stores/notification.store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ViewAsClientDialogProps {
  onClose?: () => void;
}

// Zod schema for the form
const viewAsClientFormSchema = z.object({
  clientId: z
    .string()
    .regex(/^\d+$/, 'Only numbers allowed')
    .refine((val) => Number(val) > 0, 'Client ID must be a positive number'),
});

const ViewAsClientDialog: React.FC<ViewAsClientDialogProps> = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm<{ clientId: string }>({ mode: 'onChange', resolver: zodResolver(viewAsClientFormSchema) });
  const { handleSubmit, reset } = methods;
  const setNotification = useNotificationStore((s) => s.setNotification);
  const notification = useNotificationStore((s) => s.notification);
  const { clearNotification } = useNotificationStore();

  useEffect(() => {
    const handler = () => setOpen(true);
    eventBus.on('openViewAsClientDialog', handler);
    return () => eventBus.off('openViewAsClientDialog', handler);
  }, []);

  const onSubmit = async () => {
    try {
      // Aquí va la lógica para manejar el cambio de vista como cliente
      setNotification({ message: 'You are now viewing the platform as the selected client.', type: 'success', key: 'viewAsClientDialog' });
      reset();
    } catch (e: any) {
      const msg = e?.message || 'Error switching client';
      setNotification({ message: msg, type: 'error', key: 'viewAsClientDialog' });
    }
  };

  // Determinar si mostrar success o error basado en la notificación y la key
  const showSuccess = notification && notification.type === 'success' && notification.key === 'viewAsClientDialog';
  const showError = notification && notification.type === 'error' && notification.key === 'viewAsClientDialog';

  const handleClose = () => {
    setOpen(false);
    clearNotification(); // Clear notification when the dialog opens
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <VisibilityIcon fontSize="small" /> View as Client
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>
          Enter the client ID to view the platform as that client.
        </Typography>
        {showSuccess && (
          <InformativeBox variant="success" title="Success">
            <Typography variant="body2">{notification.message}</Typography>
          </InformativeBox>
        )}
        {showError && (
          <InformativeBox variant="error" title="Error">
            <Typography variant="body2">{notification.message}</Typography>
          </InformativeBox>
        )}
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextFieldForm name="clientId" label="Client ID" autoFocus fullWidth type="number" inputProps={{ min: 1 }} />
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">
          View as Client
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAsClientDialog;
