import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
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
import { useUsersAdmin } from '../hooks/useUsersAdmin';
import { UsersValidationSchema } from '../schemas/UsersAdminValidationSchema';
import UsersFormLayout from '../components/organisms/UsersFormLayout';
import { getErrorMessages } from '@/lib/formatApiError.util';

type UserFormData = z.infer<typeof UsersValidationSchema>;

const CreateUserPage: React.FC = () => {
  const theme = useTheme();
  // El hook unificado no expone loading, así que lo obtengo de las mutations
  const { mutations: userMutations } = useUsersAdmin();
  const userLoading = {
    registerUser: userMutations.registerUser.isPending,
    updateUser: userMutations.updateUser.isPending,
    deleteUsers: userMutations.deleteUsers.isPending,
    viewAsClient: userMutations.viewAsClient.isPending,
    resendWelcomeEmail: userMutations.resendWelcomeEmail.isPending,
  };
  const { notification: userNotification, setNotification: setUserNotification, clearNotification: clearUserNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const userFormMethods = useForm<UserFormData>({
    mode: 'all',
    resolver: zodResolver(UsersValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors: userFormErrors },
    reset: resetUserForm,
  } = userFormMethods;

  const handleUserSubmit: SubmitHandler<UserFormData> = async (userData) => {
    const userPayload = {
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      clientId: userData.clientId,
    };
    userMutations.registerUser.mutate(userPayload, {
      onSuccess: () => {
        scrollToPageTop();
        setUserNotification({ message: 'User created successfully', type: 'success' });
        resetUserForm(); // Reset the form after successful submission
      },
      onError: (userApiError: any) => {
        scrollToPageTop();
        setUserNotification({
          message: getErrorMessages(userApiError),
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
        setIsValidationErrorModalOpen(true); // Open error modal when form has validation errors
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
        <title>Create User - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,51,102,1) 0%, rgba(0,102,204,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Creating User</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={submitUserForm}
            color="primary"
            variant="contained"
            disabled={userLoading.registerUser}
            startIcon={<AddOutlinedIcon />}
            loading={userLoading.registerUser}
          >
            Create User
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

export default CreateUserPage;
