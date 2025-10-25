import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useNotificationStore } from '@/stores';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import { Helmet } from 'react-helmet';
import { FormProvider } from 'react-hook-form';
import BackPageButton from '@/components/ui/atoms/BackPageButton';
import NotificationBox from '@/components/ui/molecules/NotificationBox';
import FormValidationErrorModal from '@/components/ui/organisms/FormValidationErrorModal';
import LoadingModal from '@/components/ui/molecules/LoadingModal';
import ReleaseSubmissionFormLayout from '../components/organisms/ReleaseSubmissionFormLayout';
import { useReleaseSubmissionForm } from '../hooks/useReleaseSubmissionForm';
import { ReleaseSubmissionFormData } from '../schemas/ReleaseSubmissionValidationSchema';
import { useWordPressSubmission } from '../hooks/useWordPressSubmission';
import { SubmitReleaseToWordPressRequest } from '../types/wordpress-submission.types';
import { logColor } from '@/lib/log.util';

const DMBSubmissionQCUser: React.FC = () => {
  const theme = useTheme();
  const { setNotification, clearNotification } = useNotificationStore();
  const wordPressSubmission = useWordPressSubmission();

  /**
   * Handle release submission to WordPress
   * Maps form data to WordPress API request format
   */
  const handleSubmitRelease = async (formData: ReleaseSubmissionFormData) => {
    try {
      logColor('info', 'DMBSubmissionQCUser', 'Release submission data:', formData);

      // Build track changes array - only include tracks with capitalization overrides
      const tracksWithOverrides = formData.tracks.filter(
        (track) =>
          track.overrideTrackTitleCapitalization || track.overrideTrackVersionCapitalization
      );

      logColor('info', 'DMBSubmissionQCUser', 'Tracks with overrides:', tracksWithOverrides);

      const trackChanges = tracksWithOverrides.map((track) => {
        logColor('info', 'DMBSubmissionQCUser', `Track ID: ${track.trackId}`, track);
        return {
          trackId: track.trackId,
          newTitle: track.overrideTrackTitleCapitalization ? track.trackTitle : undefined,
          newVersion: track.overrideTrackVersionCapitalization ? track.trackVersion : undefined,
        };
      });

      // Build WordPress submission payload
      const wordPressPayload: SubmitReleaseToWordPressRequest = {
        productCode: formData.upc,
        newAlbumTitle: formData.overrideAlbumTitleCapitalization
          ? formData.albumTitle
          : undefined,
        newAlbumVersion: formData.overrideAlbumVersionCapitalization
          ? formData.albumVersion
          : undefined,
        trackChanges: trackChanges.length > 0 ? trackChanges : undefined,
      };

      logColor('info', 'DMBSubmissionQCUser', 'WordPress payload:', wordPressPayload);

      // Log track changes in detail
      if (wordPressPayload.trackChanges) {
        wordPressPayload.trackChanges.forEach((tc, idx) => {
          logColor('info', 'DMBSubmissionQCUser', `Track change ${idx + 1}:`, {
            isrc: tc.isrc,
            newTitle: tc.newTitle,
            newVersion: tc.newVersion,
          });
        });
      }

      // Submit to WordPress
      const result = await wordPressSubmission.mutateAsync(wordPressPayload);

      logColor('success', 'DMBSubmissionQCUser', 'WordPress submission result:', result);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setNotification({
        message: `Release submitted successfully! Entry ID: ${result.entryId}. You will receive an email within 48-72 working hours.`,
        type: 'success',
      });

      // Clear validation data but keep the UPC field
      const currentUpc = formData.upc;
      releaseSubmissionForm.reset();
      releaseSubmissionForm.methods.setValue('upc', currentUpc);
    } catch (error: any) {
      logColor('error', 'DMBSubmissionQCUser', 'Submission error:', error);
      logColor('error', 'DMBSubmissionQCUser', 'Error response data:', error?.response?.data);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Handle specific error cases
      let errorMessage = 'An error occurred while submitting the release';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Handle duplicate EAN error
        if (error.response.data.existingEntryId) {
          errorMessage = `This release (EAN: ${formData.upc}) has already been submitted. Entry ID: ${error.response.data.existingEntryId}`;
        }

        // Handle validation error (release not ready for QC)
        if (error.response.data.failedChecks) {
          const failedFields = error.response.data.failedChecks
            .map((check: any) => check.field)
            .join(', ');
          errorMessage = `Release is not ready for QC. Failed checks: ${failedFields}`;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setNotification({
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const releaseSubmissionForm = useReleaseSubmissionForm({
    onSubmit: handleSubmitRelease,
  });

  const handleInputChange = () => clearNotification();

  // Watch the validation state from the form
  const isReleaseValid = releaseSubmissionForm.methods.watch('isReleaseValid');
  const hasValidationData = releaseSubmissionForm.methods.watch('albumId');

  // Use WordPress submission loading state
  const isSubmitting = wordPressSubmission.isPending;

  const handleFormSubmit = async () => {
    await releaseSubmissionForm.handleFormSubmitWithValidation();
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

        {/* Loading Modal */}
        <LoadingModal
          open={isSubmitting}
          message="Submitting release for review..."
        />
      </Box>
    </>
  );
};

export default DMBSubmissionQCUser;
