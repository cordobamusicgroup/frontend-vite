import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { logColor } from '@/lib/log.util';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import { useLabelsAdmin } from '../hooks/useLabelsAdmin';
import { LabelValidationSchema } from '../schemas/LabelValidationSchema';
import LabelFormLayout from '../components/organisms/LabelFormLayout';

type LabelFormData = z.infer<typeof LabelValidationSchema>;

const CreateLabelPage: React.FC = () => {
  const theme = useTheme();
  const { createLabel, createLabelLoading } = useLabelsAdmin();
  const { notification: labelNotification, setNotification: setLabelNotification, clearNotification: clearLabelNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const labelFormMethods = useForm<LabelFormData>({
    mode: 'all',
    resolver: zodResolver(LabelValidationSchema),
  });

  const {
    handleSubmit: onSubmitLabelForm,
    formState: { errors: labelFormErrors },
    reset: resetLabelForm,
  } = labelFormMethods;

  const onSubmitLabel: SubmitHandler<LabelFormData> = async (formData) => {
    const labelPayload = {
      clientId: formData.clientId,
      name: formData.name,
      status: formData.labelStatus,
      website: formData.labelWebsite,
      countryId: formData.countryId,
      beatportStatus: formData.beatportStatus,
      traxsourceStatus: formData.traxsourceStatus,
      beatportUrl: formData.beatportUrl,
      traxsourceUrl: formData.traxsourceUrl,
    };
    createLabel.mutate(labelPayload, {
      onSuccess: () => {
        scrollToPageTop();
        setLabelNotification({ message: 'Label created successfully', type: 'success' });
        resetLabelForm(); // Reset the form after successful submission
      },
      onError: (labelError: any) => {
        scrollToPageTop();
        setLabelNotification({
          message: labelError.messages,
          type: 'error',
        });
      },
    });
    logColor('info', 'CreateLabelPage', 'Create Label Form Submitted:', labelPayload);
  };

  const handleLabelFormSubmit = onSubmitLabelForm(
    (labelFormData) => {
      logColor('info', 'CreateLabelPage', 'Form data:', labelFormData);
      onSubmitLabel(labelFormData);
    },
    (validationErrors) => {
      if (Object.keys(validationErrors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearLabelNotification();

  const getErrorMessages = (errors: any): string[] => {
    let messages: string[] = [];
    const iterate = (errObj: any) => {
      if (errObj?.message) {
        messages.push(errObj.message);
      }
      if (errObj && typeof errObj === 'object') {
        for (const key in errObj) {
          if (typeof errObj[key] === 'object') {
            iterate(errObj[key]);
          }
        }
      }
    };
    iterate(errors);
    return messages;
  };

  return (
    <>
      <Helmet>
        <title>Create Label - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'#24793B'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Creating New Label</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleLabelFormSubmit}
            color="primary"
            variant="contained"
            disabled={createLabelLoading}
            startIcon={<AddOutlinedIcon />}
            loading={createLabelLoading}
          >
            Create Label
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {labelNotification?.type === 'success' && <SuccessBox>{labelNotification.message}</SuccessBox>}
          {labelNotification?.type === 'error' && <ErrorBox>{labelNotification.message}</ErrorBox>}
        </Box>

        <FormProvider {...labelFormMethods}>
          <LabelFormLayout handleSubmit={handleLabelFormSubmit} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {getErrorMessages(labelFormErrors).map((msg, index) => (
              <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
                <ListItemText primary={`• ${msg}`} sx={{ margin: 0, padding: 0 }} />
              </ListItem>
            ))}
          </List>
        </ErrorModal2>
      </Box>
    </>
  );
};

export default CreateLabelPage;
