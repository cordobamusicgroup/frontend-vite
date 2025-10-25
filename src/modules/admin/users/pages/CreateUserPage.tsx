import { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import type { MetaFunction } from 'react-router';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorModal2 from '@/components/ui/molecules/ErrorModal2';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import { formatError } from '@/lib/formatApiError.util';
import { useRegisterUser } from '../hooks';
import UsersFormLayout from '../components/organisms/UsersFormLayout';
import { UsersValidationSchema } from '../schemas/UsersAdminValidationSchema';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create User - Córdoba Music Group' },
    { name: 'description', content: 'Create a new user' },
  ];
};

type UserFormData = yup.InferType<typeof UsersValidationSchema>;

const CreateUserPage: React.FC = () => {
  const theme = useTheme();
  const registerUser = useRegisterUser();
  const userOperationsLoading = { registerUser: registerUser.isPending };
  const { notification: userNotification, setNotification: setUserNotification, clearNotification: clearUserNotification } = useNotificationStore();
  const [isValidationErrorModalOpen, setIsValidationErrorModalOpen] = useState(false);

  const userFormMethods = useForm<UserFormData>({
    mode: 'all',
    resolver: yupResolver(UsersValidationSchema),
  });

  const {
    handleSubmit,
    formState: { errors: userFormErrors },
    reset: resetUserForm,
  } = userFormMethods;

  const onSubmitUser: SubmitHandler<UserFormData> = async (formData) => {
    const userPayload = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      role: formData.role,
      ...(formData.clientId ? { clientId: formData.clientId } : {}), // Include clientId only if it exists
    };
    registerUser.mutate(userPayload, {
      onSuccess: () => {
        scrollToPageTop();
        setUserNotification({ message: 'User created successfully', type: 'success' });
        resetUserForm();
      },
      onError: (userApiError: any) => {
        scrollToPageTop();
        setUserNotification({
          message: formatError(userApiError).message.join('\n'),
          type: 'error',
        });
      },
    });
  };

  const handleUserFormSubmit = handleSubmit(
    (userFormData) => {
      onSubmitUser(userFormData);
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

  const handleInputChange = () => clearUserNotification();

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
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(58deg, rgba(0,51,102,1) 0%, rgba(0,102,204,1) 85%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Creating User</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleUserFormSubmit}
            color="primary"
            variant="contained"
            disabled={userOperationsLoading.registerUser}
            startIcon={<AddOutlinedIcon />}
            loading={userOperationsLoading.registerUser}
          >
            Create User
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {userNotification?.type === 'success' && <SuccessBox>{userNotification.message}</SuccessBox>}
          {userNotification?.type === 'error' && <ErrorBox>{userNotification.message}</ErrorBox>}
        </Box>

        <FormProvider {...userFormMethods}>
          <UsersFormLayout handleSubmit={handleUserFormSubmit} onChange={handleInputChange} />
        </FormProvider>
        <ErrorModal2 open={isValidationErrorModalOpen} onClose={() => setIsValidationErrorModalOpen(false)}>
          <List sx={{ padding: 0, margin: 0 }}>
            {extractValidationMessages(userFormErrors).map((msg, index) => (
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

export default CreateUserPage;
