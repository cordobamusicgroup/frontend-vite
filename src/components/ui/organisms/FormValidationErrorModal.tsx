import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import { extractValidationMessages } from '../../../shared/utils/extractValidationMessages';
import { FieldErrors } from 'react-hook-form';

interface ValidationErrorModalProps {
  open: boolean;
  onClose: () => void;
  errors: FieldErrors<any>;
}

const FormValidationErrorModal: React.FC<ValidationErrorModalProps> = ({ open, onClose, errors }) => (
  <ErrorModal2 open={open} onClose={onClose}>
    <List sx={{ padding: 0, margin: 0 }}>
      {extractValidationMessages(errors).map((msg, index) => (
        <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
          <ListItemText primary={`• ${msg}`} sx={{ margin: 0, padding: 0 }} />
        </ListItem>
      ))}
    </List>
  </ErrorModal2>
);

export default FormValidationErrorModal;
