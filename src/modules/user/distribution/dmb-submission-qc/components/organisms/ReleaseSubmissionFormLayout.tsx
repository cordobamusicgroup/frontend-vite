import React from 'react';
import { Box, Paper, Typography, Alert, TextField, Chip, Divider } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useReleaseValidation } from '../../hooks/useReleaseValidation';
import UPCFieldWithValidation from '../molecules/UPCFieldWithValidation';
import EditableFieldWithCapitalization from '../molecules/EditableFieldWithCapitalization';
import ValidationItem from '../molecules/ValidationItem';
import TrackAccordion from './TrackAccordion';

const ReleaseSubmissionFormLayout: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { validateRelease, isValidating, validationData, validationError, clearValidation } = useReleaseValidation();

  const handleValidate = async () => {
    const upc = watch('upc');
    if (!upc) return;

    const result = await validateRelease(upc);

    if (result) {
      // Auto-fill form fields from validation result
      setValue('albumId', result.albumId);
      setValue('albumGrid', result.albumGrid);
      setValue('albumArticleNumber', result.albumArticleNumber);
      setValue('albumTitle', result.albumTitle);
      setValue('albumVersion', result.albumVersion);
      setValue('albumArtist', result.albumArtistName);

      // Set validation state for controlling Submit button
      setValue('isReleaseValid', result.isValid);

      // Reset capitalization overrides
      setValue('overrideAlbumTitleCapitalization', false);
      setValue('overrideAlbumVersionCapitalization', false);

      // Initialize tracks array with data from all discs
      const tracksArray = result.discs.flatMap((disc) =>
        disc.tracks.map((track) => ({
          trackId: track.trackId,
          trackTitle: track.trackTitle,
          trackVersion: track.trackVersion,
          overrideTrackTitleCapitalization: false,
          overrideTrackVersionCapitalization: false,
        }))
      );
      setValue('tracks', tracksArray);
    }
  };

  const handleChangeUPC = () => {
    clearValidation();
    // Clear all form fields except UPC
    setValue('albumId', '');
    setValue('albumGrid', '');
    setValue('albumArticleNumber', null);
    setValue('albumTitle', '');
    setValue('albumVersion', null);
    setValue('albumArtist', '');
    setValue('tracks', []);
    setValue('isReleaseValid', false);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Great!</strong> You have your release ready on the DMB and here you can validate it for the first time or if you have been with us for a while.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            After the release is successfully submitted, it enters a phase of review of metadata, quality of the cover image, audio quality verification, this procedure takes between <strong>48 and 72 working hours</strong>.
          </Typography>
          <Typography variant="body2">
            If any errors are found, the area in charge will send an email to the email address provided by the producer, detailing the requested correction.
          </Typography>
        </Alert>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Release Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* UPC Field with Validate Button */}
          <UPCFieldWithValidation
            onValidate={handleValidate}
            isValidating={isValidating}
            isDisabled={!!validationData}
            onChangeUPC={handleChangeUPC}
          />

          {/* Validation Error */}
          {validationError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {validationError}
            </Alert>
          )}

          {/* Validation Success - Show Album Details */}
          {validationData && (
            <>
              {/* Overall Validation Status */}
              <Alert severity={validationData.isValid ? 'success' : 'warning'} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {validationData.isValid
                      ? 'Release is ready for submission!'
                      : 'Release has validation errors that must be fixed in DMB before submission.'}
                  </Typography>
                  <Chip
                    label={validationData.isValid ? 'VALID' : 'INVALID'}
                    color={validationData.isValid ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Alert>

              {/* Read-only Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Album Details (Auto-filled)
                </Typography>

                <TextField
                  label="Album ID"
                  value={validationData.albumId}
                  disabled
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Album Artist"
                  value={validationData.albumArtistName}
                  disabled
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="GRID"
                  value={validationData.albumGrid}
                  disabled
                  fullWidth
                  variant="outlined"
                />

                {validationData.albumArticleNumber && (
                  <TextField
                    label="Article Number"
                    value={validationData.albumArticleNumber}
                    disabled
                    fullWidth
                    variant="outlined"
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Editable Fields with Capitalization Override */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Editable Album Information
                </Typography>

                <EditableFieldWithCapitalization
                  name="albumTitle"
                  overrideName="overrideAlbumTitleCapitalization"
                  label="Album Title"
                  placeholder="Enter the album title"
                  helperText="The official title of the album"
                  required
                />

                <EditableFieldWithCapitalization
                  name="albumVersion"
                  overrideName="overrideAlbumVersionCapitalization"
                  label="Album Version"
                  placeholder="Enter the album version"
                  helperText="The version subtitle (e.g., Deluxe Edition, Remastered)"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Album Validation Items */}
              {validationData.albumValidationItems.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Album Validation Checks
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {validationData.albumValidationItems.map((item, index) => (
                      <ValidationItem key={`album-${index}`} item={item} />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Tracks Validation */}
              {validationData.discs && validationData.discs.length > 0 && (
                <TrackAccordion discs={validationData.discs} />
              )}

              {/* Validation Summary */}
              <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.50', mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Validation Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Album Checks:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                      ✓ Passed: {validationData.summary.album.passed}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      ✗ Failed: {validationData.summary.album.failed}
                    </Typography>
                    {validationData.summary.album.warnings > 0 && (
                      <Typography variant="body2" sx={{ color: 'warning.main' }}>
                        ⚠ Warnings: {validationData.summary.album.warnings}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Track Checks:
                    </Typography>
                    <Typography variant="body2">
                      Total Tracks: {validationData.summary.tracks.totalTracks}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                      ✓ Passed: {validationData.summary.tracks.passed}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      ✗ Failed: {validationData.summary.tracks.failed}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReleaseSubmissionFormLayout;
