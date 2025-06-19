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
import { formatError } from '@/lib/formatApiError.util';

type LabelFormData = z.infer<typeof LabelValidationSchema>;

const getModifiedFields = (currentFormData: any, initialData: any) => {
  return Object.keys(currentFormData).reduce((changedFields: any, key) => {
    if (currentFormData[key] !== initialData[key]) {
      changedFields[key] = currentFormData[key];
    }
    return changedFields;
  }, {});
};

const UpdateLabelPage: React.FC = () => {
  const theme = useTheme();
  const { labelId } = useParams();
  const { labelsData: labelData, labelFetchError, labelFetchLoading, updateLabel, updateLabelLoading } = useLabelsAdmin(labelId);
  const { notification: labelNotification, setNotification: setLabelNotification, clearNotification: clearLabelNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  // Store the initial data for comparison
  const [initialLabelData, setInitialLabelData] = useState<LabelFormData | null>(null);

  const labelFormMethods = useForm<LabelFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(LabelValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors: labelFormErrors },
    reset: resetLabelForm,
  } = labelFormMethods;

  const formattedLabelData = useMemo(() => {
    if (!labelData) return null;

    return {
      labelId: labelData.id,
      clientId: labelData.clientId,
      name: labelData.name,
      labelStatus: labelData.status,
      labelWebsite: labelData.website,
      countryId: labelData.countryId,
      beatportStatus: labelData.beatportStatus,
      traxsourceStatus: labelData.traxsourceStatus,
      beatportUrl: labelData.beatportUrl,
      traxsourceUrl: labelData.traxsourceUrl,
    };
  }, [labelData]);

  useEffect(() => {
    if (formattedLabelData) {
      resetLabelForm(formattedLabelData);
      setInitialLabelData(formattedLabelData);
    }
  }, [formattedLabelData, resetLabelForm]);

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
            Failed to load label data
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (labelFetchLoading || !labelData) {
    return <SkeletonLoader />;
  }

  const onSubmitLabel: SubmitHandler<LabelFormData> = async (formData) => {
    if (!initialLabelData) return;

    const modifiedFields = getModifiedFields(formData, initialLabelData);

    const labelUpdatePayload = {
      ...modifiedFields,
    };

    updateLabel.mutate(labelUpdatePayload, {
      onSuccess: () => {
        setLabelNotification({ message: 'Label updated successfully', type: 'success' });
        scrollToTop();
      },
      onError: (error: any) => {
        const formatted = formatError(error);
        setLabelNotification({
          message: formatted.message.join('\n'),
          type: 'error',
        });
        scrollToTop();
      },
    });
  };

  const onSubmitForm = handleSubmit(
    (data) => {
      onSubmitLabel(data); // Llama a la función onSubmit si no hay errores
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setIsValidationErrorModalOpen(true); // Abre el popup si hay errores
      }
    },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = () => clearLabelNotification();

  const extractValidationMessages = (errors: any): string[] => {
    const messages: string[] = [];
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
        <title>{`Update Label: ${labelData?.name ?? 'Unknown'} - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update Label: {labelData?.name ?? 'Unknown'}</Typography>
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
          {labelNotification?.type === 'success' && <SuccessBox>{labelNotification.message}</SuccessBox>}
          {labelNotification?.type === 'error' && <ErrorBox>{labelNotification.message}</ErrorBox>}
        </Box>

        <FormProvider {...labelFormMethods}>
          <LabelFormLayout handleSubmit={onSubmitForm} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {extractValidationMessages(labelFormErrors).map((msg, index) => (
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
