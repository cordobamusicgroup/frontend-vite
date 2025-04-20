import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Autocomplete } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';

import axios from 'axios';
import TextFieldForm from '@/components/ui/atoms/TextFieldForm';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import { CheckCircle, DoDisturbOnOutlined } from '@mui/icons-material';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { useNotificationStore } from '@/stores';
import { useLabelsAdmin } from '@/modules/admin/labels/hooks/useLabelsAdmin';
import { useUnlinkedReportsAdmin } from '../../hooks/useLinkReportsAdmin';

interface LinkReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportId: number | null;
  reportData: {
    id: number;
    labelName: string;
    distributor: string;
    reportingMonth: string;
    count: number;
  } | null;
}

const LinkReportDialog: React.FC<LinkReportDialogProps> = ({ open, onClose, reportId, reportData }) => {
  const methods = useForm();
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const { labelsData, labelFetchLoading, labelFetchError } = useLabelsAdmin();
  const { loading, errors: linkErrors, mutations } = useUnlinkedReportsAdmin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setNotification } = useNotificationStore();

  const labelId = watch('labelId');
  const selectedClient = labelsData?.find((label: any) => label.id === labelId) || null;

  const handleLinkReport = async () => {
    if (reportId && labelId) {
      mutations.linkReport.mutateAsync(
        { unlinkedReportId: reportId, labelId },
        {
          onSuccess: () => {
            setNotification({ message: 'Report successfully sent to the processing queue', type: 'success' });
            onClose();
            reset();
          },
          onError: (error) => {
            console.error('Error linking report:', error);
            const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || 'Error linking report' : 'An unexpected error occurred';
            setErrorMessage(errorMessage);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (labelFetchError) {
      console.error('Error fetching labels:', labelFetchError);
      setErrorMessage('Error fetching labels');
    } else if (linkErrors.linkReport) {
      console.error('Error linking report:', linkErrors.linkReport);
      const errorMessage = axios.isAxiosError(linkErrors.linkReport) ? linkErrors.linkReport.response?.data?.message || 'Error linking report' : 'An unexpected error occurred';
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage(null);
    }
  }, [labelFetchError, linkErrors.linkReport]);

  const handleClose = () => {
    if (!loading.linkReport) {
      onClose();
      reset();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Link Unlinked Report</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleLinkReport)}>
            {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
            {reportData && (
              <>
                <TextFieldForm name="id" label="Unlinked Report ID" value={reportData.id} disabled />
                <TextFieldForm name="labelName" label="Label Name" value={reportData.labelName} disabled />
                <TextFieldForm name="distributor" label="Distributor" value={reportData.distributor} disabled />
                <TextFieldForm name="reportingMonth" label="Reporting Month" value={reportData.reportingMonth} disabled />
                <TextFieldForm name="count" label="Count" value={reportData.count} disabled />
              </>
            )}
            <Autocomplete
              options={labelsData}
              getOptionLabel={(option) => `[ID: ${option.id}] ${option.name} (${option.status}) `}
              loading={labelFetchLoading}
              onChange={(_, value) => setValue('labelId', value ? value.id : null)}
              value={selectedClient}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <li key={`${option.id}-${key}`} {...restProps}>
                    {option.status === 'ACTIVE' ? <CheckCircle style={{ marginRight: 8, color: '#4caf50' }} /> : <DoDisturbOnOutlined style={{ marginRight: 8, color: '#f44336' }} />}
                    {`[ID: ${option.id}] ${option.name}`}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextFieldForm
                  {...params}
                  required
                  name="labelId"
                  label="Select Label"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {labelFetchLoading ? <CircularProgress color="inherit" size={20} /> : null} {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading.linkReport}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleLinkReport)} disabled={!reportId || !labelId || loading.linkReport}>
          {loading.linkReport ? 'Linking...' : 'Link Report'}
        </Button>
      </DialogActions>
      <CenteredLoader open={loading.linkReport} />
    </Dialog>
  );
};

export default LinkReportDialog;
