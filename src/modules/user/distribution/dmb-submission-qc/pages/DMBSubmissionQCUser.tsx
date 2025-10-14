import React from 'react';
import { Box, Typography, useTheme, List, ListItem, ListItemText } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { FormProvider } from 'react-hook-form';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import NotificationBox from '@/components/ui/molecules/NotificationBox';
import FormValidationErrorModal from '@/components/ui/organisms/FormValidationErrorModal';
import ReleaseSubmissionFormLayout from '../components/organisms/ReleaseSubmissionFormLayout';
import { useReleaseSubmissionForm } from '../hooks/useReleaseSubmissionForm';
import { ReleaseSubmissionFormData } from '../schemas/ReleaseSubmissionValidationSchema';
import { logColor } from '@/lib/log.util';

const DMBSubmissionQCUser: React.FC = () => {
  const theme = useTheme();
  const { setNotification, clearNotification } = useNotificationStore();

  // TODO: Replace with actual API mutation hook when backend is ready
  const handleSubmitRelease = async (formData: ReleaseSubmissionFormData) => {
    try {
      logColor('info', 'DMBSubmissionQCUser', 'Release submission data:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setNotification({
        message: 'Release submitted successfully for review! You will receive an email within 48-72 working hours.',
        type: 'success',
      });
      releaseSubmissionForm.reset();
    } catch (error: any) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setNotification({
        message: error?.message || 'An error occurred while submitting the release',
        type: 'error',
      });
    }
  };

  const releaseSubmissionForm = useReleaseSubmissionForm({
    onSubmit: handleSubmitRelease,
  });

  const handleInputChange = () => clearNotification();

  // For now, we'll use a temporary loading state
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Watch the validation state from the form
  const isReleaseValid = releaseSubmissionForm.methods.watch('isReleaseValid');
  const hasValidationData = releaseSubmissionForm.methods.watch('albumId');

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      await releaseSubmissionForm.handleFormSubmitWithValidation();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Release Submission - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader
          background={'linear-gradient(58deg, rgba(9,54,95,1) 0%, rgba(0,27,51,1) 85%)'}
          color={theme.palette.primary.contrastText}
        >
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Release Submission for Review</Typography>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton
            colorBackground="white"
            colorText={theme.palette.secondary.main}
            onClick={handleFormSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting || !hasValidationData || !isReleaseValid}
            startIcon={<SendOutlinedIcon />}
            loading={isSubmitting}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(0, 27, 51, 0.5)',
              },
            }}
          >
            Submit Release
          </BasicButton>
        </CustomPageHeader>

        <NotificationBox />

        <FormProvider {...releaseSubmissionForm.methods}>
          <form onChange={handleInputChange}>
            <ReleaseSubmissionFormLayout />
            <FormValidationErrorModal
              open={releaseSubmissionForm.isValidationErrorModalOpen}
              onClose={() => releaseSubmissionForm.setIsValidationErrorModalOpen(false)}
              errors={releaseSubmissionForm.errors}
            />
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default DMBSubmissionQCUser;
