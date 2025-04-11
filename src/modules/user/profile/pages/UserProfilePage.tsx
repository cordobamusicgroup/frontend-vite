import BackPageButton from '@/components/ui/atoms/BackPageButton';
import BasicButton from '@/components/ui/atoms/BasicButton';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { CachedOutlined, ErrorOutline } from '@mui/icons-material';
import { Box, List, ListItem, ListItemText, Paper, Typography, useTheme } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import UserFormLayout from '../components/organisms/UserFormLayout';
import { useProfileUser } from '../hooks/useProfileUser';
import { UserValidationSchema } from '../schemas/UserValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import { useNotificationStore } from '@/stores';
import { Helmet } from 'react-helmet';
import SkeletonLoader from '@/components/ui/molecules/SkeletonLoader';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

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

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const ProfileUserPage: React.FC = () => {
  const theme = useTheme();
  const { profileData, mutations, loading, error } = useProfileUser();
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const [originalData, setOriginalData] = useState<any>(null);
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const formattedProfileData = useMemo(() => {
    if (!profileData) return null;

    return {
      id: profileData.id,
      username: profileData.username,
      email: profileData.email,
      fullName: profileData.fullName,
    };
  }, [profileData]);

  useEffect(() => {
    if (formattedProfileData) {
      reset(formattedProfileData);
      setOriginalData(formattedProfileData);
      console.log('Form reset with:', formattedProfileData);
    }
  }, [formattedProfileData, error.profileFetchError, reset]);

  if (error.profileFetchError) {
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
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

          <Typography variant="h5" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {(error.profileFetchError as any)?.messages || 'Failed to load profile data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!profileData) {
    return <SkeletonLoader />;
  }

  const onSubmit = async (formData: any) => {
    const updatedFields = getUpdatedFields(formData, originalData);

    if (Object.keys(updatedFields).length === 0) {
      setNotification({
        message: 'No changes were made to submit.',
        type: 'error',
      });
      return;
    }

    const mappedData: any = Object.keys(updatedFields).reduce((acc: any, key) => {
      if (updatedFields[key] !== null && updatedFields[key] !== '') {
        acc[key] = updatedFields[key];
      }
      return acc;
    }, {});

    if (Object.keys(mappedData).length === 0) {
      setNotification({
        message: 'No valid changes were made to submit.',
        type: 'error',
      });
      return;
    }

    mutations.editProfile.mutate(mappedData, {
      onSuccess: () => {
        setNotification({ message: 'The profile was successfully updated.', type: 'success' });
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

  const handleFormSubmit = handleSubmit(
    (data) => onSubmit(data),
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  const handleInputChange = () => clearNotification();

  return (
    <>
      <Helmet>
        <title>{`Profile - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Profile</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
            <BasicButton
              colorBackground="white"
              colorText={'#164723'}
              onClick={handleFormSubmit}
              color="primary"
              variant="contained"
              startIcon={<CachedOutlined />}
              disabled={loading.profileEditLoading}
            >
              Update Profile
            </BasicButton>
          </Box>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <FormProvider {...methods}>
          <UserFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} />
        </FormProvider>

        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
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

export default ProfileUserPage;
