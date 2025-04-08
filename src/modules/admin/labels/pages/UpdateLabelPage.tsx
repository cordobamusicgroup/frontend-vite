import { useEffect, useState, useMemo } from 'react';
import { Box, List, ListItem, ListItemText, Paper, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useParams } from 'react-router';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SkeletonLoader from '@/components/ui/molecules/SkeletonLoader';
import { LabelValidationSchema } from '../schemas/LabelValidationSchema';
import { useLabelsAdmin } from '../hooks/useLabelsAdmin';
import LabelFormLayout from '../components/organisms/LabelFormLayout';

type IFormData = z.infer<typeof LabelValidationSchema>;

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const UpdateLabelPage: React.FC = () => {
  const theme = useTheme();
  const { labelId } = useParams();
  const { labelsData: label, labelFetchError, labelFetchLoading, updateLabel, updateLabelLoading } = useLabelsAdmin(labelId);
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [errorOpen, setErrorOpen] = useState(false);

  // Reintroduce originalData state
  const [originalData, setOriginalData] = useState<IFormData | null>(null);

  const methods = useForm<IFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(LabelValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const apiData = useMemo(() => {
    if (!label) return null;

    return {
      labelId: label.id,
      clientId: label.clientId,
      labelName: label.name,
      labelStatus: label.status,
      labelWebsite: label.website,
      countryId: label.countryId,
      beatportStatus: label.beatportStatus,
      traxsourceStatus: label.traxsourceStatus,
      beatportUrl: label.beatportUrl,
      traxsourceUrl: label.traxsourceUrl,
    };
  }, [label]);

  useEffect(() => {
    if (apiData) {
      reset(apiData); // Reset form data unconditionally when apiData changes
      setOriginalData(apiData); // Store the original data for comparison
    }
  }, [apiData, reset]);

  if (labelFetchError) {
    return (
      <Box
        sx={{
          width: '100%',
          mx: 'auto',
          mt: 1,
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'rgba(244, 67, 54, 0.05)' : 'rgba(244, 67, 54, 0.1)'),
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

          <Typography variant="h5" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {labelFetchError.message || 'Failed to load label data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!labelFetchLoading && !label) {
    return <SkeletonLoader />;
  }

  const onSubmit: SubmitHandler<IFormData> = async (formData) => {
    if (!originalData) return; // Ensure originalData is available

    const updatedFields = getUpdatedFields(formData, originalData);

    const mappedData = {
      name: updatedFields.labelName,
      clientId: updatedFields.clientId,
      status: updatedFields.labelStatus,
      website: updatedFields.labelWebsite,
      countryId: updatedFields.countryId,
      beatportStatus: updatedFields.beatportStatus,
      traxsourceStatus: updatedFields.traxsourceStatus,
      beatportUrl: updatedFields.beatportUrl,
      traxsourceUrl: updatedFields.traxsourceUrl,
    };
    updateLabel.mutate(mappedData, {
      onSuccess: () => {
        setNotification({ message: 'Label updated successfully', type: 'success' });
        scrollToTop();
      },
      onError: (error: any) => {
        setNotification({
          message: error.messages,
          type: 'error',
        });
        scrollToTop();
      },
    });
  };

  const onSubmitForm = handleSubmit(
    (data) => {
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
        <title>{`Update Label: ${label?.name ?? 'Unknown'} - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update Label: {label?.name ?? 'Unknown'}</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={onSubmitForm}
            color="primary"
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            loading={updateLabelLoading}
          >
            Update Client
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <FormProvider {...methods}>
          <LabelFormLayout handleSubmit={onSubmitForm} onChange={handleInputChange} />
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

export default UpdateLabelPage;
