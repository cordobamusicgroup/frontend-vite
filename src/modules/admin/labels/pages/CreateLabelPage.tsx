import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { useNotificationCleanup } from '@/hooks/useNotificationCleanup';
import { Helmet } from 'react-helmet';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import { useLabelsAdmin } from '../hooks/useLabelsAdmin';
import { LabelValidationSchema } from '../schemas/LabelValidationSchema';
import LabelFormLayout from '../components/organisms/LabelFormLayout';

type FormData = z.infer<typeof LabelValidationSchema>;

const CreateLabelPage: React.FC = () => {
  const theme = useTheme();
  const { createLabel, createLabelLoading } = useLabelsAdmin();
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [errorOpen, setErrorOpen] = useState(false);

  useNotificationCleanup();

  const methods = useForm<FormData>({
    mode: 'all',
    resolver: zodResolver(LabelValidationSchema),
  });

  const {
    handleSubmit: onSubmitForm,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const payload = {
      clientId: formData.clientId,
      name: formData.labelName,
      status: formData.labelStatus,
      website: formData.labelWebsite,
      countryId: formData.countryId,
      beatportStatus: formData.beatportStatus,
      traxsourceStatus: formData.traxsourceStatus,
      beatportUrl: formData.beatportUrl,
      traxsourceUrl: formData.traxsourceUrl,
    };
    createLabel.mutate(payload, {
      onSuccess: () => {
        scrollToTop();
        setNotification({ message: 'Label created successfully', type: 'success' });
        reset(); // Reset the form after successful submission
      },
      onError: (error: any) => {
        scrollToTop();
        setNotification({
          message: error.messages,
          type: 'error',
        });
      },
    });
    console.log('Create Client Form Submitted:', payload);
  };

  const handleFormSubmit = onSubmitForm(
    (data) => {
      console.log('Form data:', data); // Muestra los datos del formulario en la consola
      onSubmit(data); // Llama a la función onSubmit si no hay errores
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true); // Abre el popup si hay errores
      }
    },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearNotification();

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
            onClick={handleFormSubmit}
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
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <FormProvider {...methods}>
          <LabelFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={errorOpen} onClose={() => setErrorOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {getErrorMessages(errors).map((msg, index) => (
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
