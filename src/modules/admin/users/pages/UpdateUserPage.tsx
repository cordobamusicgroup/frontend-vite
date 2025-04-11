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
import { useUsersAdmin } from '../hooks/useUsersAdmin';
import { UsersValidationSchema } from '../schemas/UsersAdminValidationSchema';
import UsersFormLayout from '../components/organisms/UsersFormLayout';

type UserFormData = z.infer<typeof UsersValidationSchema>;

const getModifiedFields = (currentFormData: any, initialData: any) => {
  return Object.keys(currentFormData).reduce((changedFields: any, key) => {
    if (currentFormData[key] !== initialData[key]) {
      changedFields[key] = currentFormData[key];
    }
    return changedFields;
  }, {});
};

const UpdateUserPage: React.FC = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const { usersData: userData, loading, errors, mutations } = useUsersAdmin(userId);
  const { notification: userNotification, setNotification: setUserNotification, clearNotification: clearUserNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  // Store the initial data for comparison
  const [initialUserData, setInitialUserData] = useState<UserFormData | null>(null);

  const userFormMethods = useForm<UserFormData>({
    mode: 'all',
    resolver: zodResolver(UsersValidationSchema),
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors: userFormErrors },
    reset: resetUserForm,
  } = userFormMethods;

  const formattedUserData = useMemo(() => {
    if (!userData) return null;

    return {
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      clientId: userData.clientId,
    };
  }, [userData]);

  useEffect(() => {
    if (formattedUserData) {
      resetUserForm(formattedUserData);
      setInitialUserData(formattedUserData);
    }
  }, [formattedUserData, resetUserForm]);

  if (errors.userFetch) {
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
            {errors.userFetch.message || 'Failed to load user data.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (loading.userFetch || !userData) {
    return <SkeletonLoader />;
  }

  const handleUserSubmit: SubmitHandler<UserFormData> = async (formData) => {
    if (!initialUserData || !userId) return;

    const modifiedFields = getModifiedFields(formData, initialUserData);

    const userUpdatePayload = {
      ...modifiedFields,
    };

    mutations.updateUser.mutate(userUpdatePayload, {
      onSuccess: () => {
        scrollToPageTop();
        setUserNotification({ message: 'User updated successfully', type: 'success' });
      },
      onError: (userApiError: any) => {
        scrollToPageTop();
        setUserNotification({
          message: userApiError.messages,
          type: 'error',
        });
      },
    });
  };

  const submitUserForm = handleSubmit(
    (validUserFormData) => {
      handleUserSubmit(validUserFormData);
    },
    (userValidationErrors) => {
      if (Object.keys(userValidationErrors).length > 0) {
        setIsValidationErrorModalOpen(true);
      }
    },
  );

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormInputChange = () => clearUserNotification();

  const extractValidationErrorMessages = (formErrorObj: any): string[] => {
    const validationErrorMessages: string[] = [];
    const parseNestedErrors = (errorObj: any) => {
      if (errorObj?.message) {
        validationErrorMessages.push(errorObj.message);
      }
      if (errorObj && typeof errorObj === 'object') {
        for (const key in errorObj) {
          if (typeof errorObj[key] === 'object') {
            parseNestedErrors(errorObj[key]);
          }
        }
      }
    };
    parseNestedErrors(formErrorObj);
    return validationErrorMessages;
  };

  return (
    <>
      <Helmet>
        <title>{`Update User: ${userData?.fullName ?? 'Unknown'} - Córdoba Music Group`}</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,51,102,1) 0%, rgba(0,102,204,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Update User: {userData?.fullName ?? 'Unknown'}</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={submitUserForm}
            color="primary"
            variant="contained"
            disabled={loading.updateUser}
            startIcon={<AddOutlinedIcon />}
            loading={loading.updateUser}
          >
            Update User
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {userNotification?.type === 'success' && <SuccessBox>{userNotification.message}</SuccessBox>}
          {userNotification?.type === 'error' && <ErrorBox>{userNotification.message}</ErrorBox>}
        </Box>

        <FormProvider {...userFormMethods}>
          <UsersFormLayout handleSubmit={submitUserForm} onChange={handleFormInputChange} />
        </FormProvider>
        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {extractValidationErrorMessages(userFormErrors).map((errorMessage, index) => (
              <ListItem key={index} disableGutters sx={{ padding: '1px 0' }}>
                <ListItemText primary={`• ${errorMessage}`} sx={{ margin: 0, padding: 0 }} />
              </ListItem>
            ))}
          </List>
        </ErrorModal2>
      </Box>
    </>
  );
};

export default UpdateUserPage;
