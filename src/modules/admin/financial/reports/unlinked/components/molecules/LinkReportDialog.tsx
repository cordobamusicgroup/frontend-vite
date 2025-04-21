import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { useNotificationStore } from '@/stores';
import { useUnlinkedReportsAdmin } from '../../hooks/useLinkReportsAdmin';
import LinkReportFormFields from './LinkReportFormFields';

interface LinkReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportId: number;
}

interface LinkReportFormData {
  labelId: number | null;
  id?: number;
  labelName?: string;
  distributor?: string;
  reportingMonth?: string;
  count?: number;
}

const LinkReportDialog: React.FC<LinkReportDialogProps> = ({ open, onClose, reportId }) => {
  const { unlinkedReportsData, loading, mutations } = useUnlinkedReportsAdmin(reportId);
  const { setNotification, notification } = useNotificationStore();

  const formattedReportData = useMemo(() => {
    if (!unlinkedReportsData) return { labelId: null };
    return {
      id: unlinkedReportsData.id,
      labelName: unlinkedReportsData.labelName,
      distributor: unlinkedReportsData.distributor,
      reportingMonth: unlinkedReportsData.reportingMonth,
      count: unlinkedReportsData.count,
      labelId: null,
    };
  }, [unlinkedReportsData]);

  const methods = useForm<LinkReportFormData>({
    defaultValues: formattedReportData,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (open && formattedReportData) {
      reset(formattedReportData);
    }
  }, [open, formattedReportData, reset]);

  const handleClose = () => {
    if (!loading.linkReport) {
      onClose();
      reset();
    }
  };

  const handleLinkReport = async (data: LinkReportFormData) => {
    if (!reportId || !data.labelId) return;
    try {
      await mutations.linkReport.mutateAsync({ unlinkedReportId: reportId, labelId: data.labelId });
      setNotification({ message: 'Report successfully sent to the processing queue', type: 'success' });
      onClose();
      reset();
    } catch (error) {
      setNotification({
        message: axios.isAxiosError(error) ? error.response?.data?.message || 'Error linking report' : 'An unexpected error occurred',
        type: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Link Unlinked Report</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleLinkReport)}>
            {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
            <LinkReportFormFields />
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading.linkReport}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleLinkReport)} disabled={!reportId || !watch('labelId') || loading.linkReport}>
          {loading.linkReport ? 'Linking...' : 'Link Report'}
        </Button>
      </DialogActions>
      <CenteredLoader open={loading.linkReport} />
    </Dialog>
  );
};

export default LinkReportDialog;
