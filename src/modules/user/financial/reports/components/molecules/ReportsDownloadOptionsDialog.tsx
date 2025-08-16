import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, ListItemIcon, Typography, Tooltip, Box, Alert, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import LabelIcon from '@mui/icons-material/Label';
import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';
import DevicesIcon from '@mui/icons-material/Devices';
import PublicIcon from '@mui/icons-material/Public';
import { useNotificationStore } from '@/stores';
import FetchErrorBox from '@/components/ui/molecules/FetchErrorBox';
import { useDownloadReport } from '../../hooks/mutations/useDownloadReport';
import { formatError } from '@/lib/formatApiError.util';

interface DownloadOptionsDTO {
  groupedByLabels?: string | null;
  groupedByArtists?: string | null;
  groupedByReleases?: string | null;
  groupedByPlatform?: string | null;
  groupedByCountries?: string | null;
  fullCatalog?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  // report id to fetch options for
  reportId?: number | string | null;
  // called after the dialog finished closing (exit animation)
  onAfterClose?: () => void;
}

const StatusText: React.FC<{ available: boolean | undefined }> = ({ available }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {available ? <CheckIcon sx={{ color: 'success.main', fontSize: 16 }} /> : <BlockIcon sx={{ color: 'text.disabled', fontSize: 16 }} />}
    <Typography variant="caption" sx={{ color: available ? 'success.main' : 'text.disabled' }}>
      {available ? 'Available' : 'Not available'}
    </Typography>
  </Box>
);

const ReportsDownloadOptionsDialog: React.FC<Props> = ({ open, onClose, reportId, onAfterClose }) => {
  const { notification, setNotification, clearNotification } = useNotificationStore();
  const localNotification = notification?.key === 'reports-download-dialog' ? notification : null;

  const { downloadReport } = useDownloadReport();

  const options = downloadReport.data as DownloadOptionsDTO | undefined | null;
  const error = downloadReport.error;
  const isLoading = downloadReport.isPending;

  const openUrl = (url: string | null | undefined) => {
    if (!url) return;
    try {
      window.open(url, '_blank');
      setNotification({ key: 'reports-download-dialog', message: 'Report opened in a new tab', type: 'success' });
    } catch {
      setNotification({ key: 'reports-download-dialog', message: 'Unable to open report', type: 'error' });
    }
  };

  const errorMessage = error ? (Array.isArray(formatError(error).message) ? formatError(error).message.join('\n') : formatError(error).message) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // Use slotProps.transition instead of deprecated TransitionProps
      slotProps={{
        transition: {
          onEnter: () => {
            if (reportId != null) {
              void downloadReport.mutate(reportId.toString());
            }
          },
          onExited: () => {
            onAfterClose?.();
            if (notification?.key === 'reports-download-dialog') clearNotification();
            downloadReport.reset();
          },
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box component="span">Download Report</Box>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {localNotification && (
          <Box mb={2}>
            <Alert severity={localNotification.type} onClose={clearNotification}>
              {Array.isArray(localNotification.message)
                ? localNotification.message.map((m, i) => (
                    <span key={i}>
                      {m}
                      {i < localNotification.message.length - 1 ? <br /> : null}
                    </span>
                  ))
                : localNotification.message}
            </Alert>
          </Box>
        )}

        {isLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : errorMessage ? (
          <Box mb={2}>
            <FetchErrorBox message={Array.isArray(errorMessage) ? errorMessage.join('\n') : errorMessage} defaultMessage="No se pudieron obtener las opciones de descarga." />
          </Box>
        ) : options ? (
          <List>
            <ListItem>
              <ListItemIcon>
                <AlbumIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Full Catalog" secondary={<StatusText available={Boolean(options.fullCatalog)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.fullCatalog ? 'Open full catalog in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-full-catalog" color="primary" disabled={!options.fullCatalog} onClick={() => openUrl(options.fullCatalog)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <LabelIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Per Labels" secondary={<StatusText available={Boolean(options.groupedByLabels)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.groupedByLabels ? 'Open per labels in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-per-labels" color="primary" disabled={!options.groupedByLabels} onClick={() => openUrl(options.groupedByLabels)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Per Artists" secondary={<StatusText available={Boolean(options.groupedByArtists)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.groupedByArtists ? 'Open per artists in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-per-artists" color="primary" disabled={!options.groupedByArtists} onClick={() => openUrl(options.groupedByArtists)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <AlbumIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Per Releases" secondary={<StatusText available={Boolean(options.groupedByReleases)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.groupedByReleases ? 'Open per releases in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-per-releases" color="primary" disabled={!options.groupedByReleases} onClick={() => openUrl(options.groupedByReleases)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <DevicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Per Platform" secondary={<StatusText available={Boolean(options.groupedByPlatform)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.groupedByPlatform ? 'Open per platform in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-per-platform" color="primary" disabled={!options.groupedByPlatform} onClick={() => openUrl(options.groupedByPlatform)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <PublicIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Per Countries" secondary={<StatusText available={Boolean(options.groupedByCountries)} />} />
              <ListItemSecondaryAction>
                <Tooltip title={options.groupedByCountries ? 'Open per countries in new tab' : 'Not available'}>
                  <span>
                    <IconButton aria-label="download-per-countries" color="primary" disabled={!options.groupedByCountries} onClick={() => openUrl(options.groupedByCountries)}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        ) : (
          <div>No download options available</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportsDownloadOptionsDialog;
