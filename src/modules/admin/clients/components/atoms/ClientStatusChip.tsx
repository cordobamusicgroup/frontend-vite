import { Chip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

export type ClientStatus = 'ACTIVE' | 'BLOCKED' | 'TERMINATED' | 'INACTIVE';

interface ClientStatusChipProps {
  status: ClientStatus;
}

const statusConfig: Record<ClientStatus, { label: string; color: 'success' | 'error' | 'default' | 'warning'; icon: React.ReactElement | undefined }> = {
  ACTIVE: {
    label: 'Active',
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
  },
  BLOCKED: {
    label: 'Blocked',
    color: 'error',
    icon: <BlockIcon fontSize="small" />,
  },
  TERMINATED: {
    label: 'Terminated',
    color: 'default',
    icon: <CancelIcon fontSize="small" />,
  },
  INACTIVE: {
    label: 'Inactive',
    color: 'warning',
    icon: <PauseCircleIcon fontSize="small" />,
  },
};

const ClientStatusChip: React.FC<ClientStatusChipProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig['INACTIVE'];
  return <Chip label={config.label} color={config.color} size="small" icon={config.icon ?? undefined} />;
};

export default ClientStatusChip;
