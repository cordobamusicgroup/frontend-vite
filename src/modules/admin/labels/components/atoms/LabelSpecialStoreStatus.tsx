import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { Chip } from '@mui/material';

interface LabelSpecialStoreStatusProps {
  status: 'NO_REGISTRATION' | 'PENDING' | 'ACTIVE' | 'REJECTED';
}

const statusConfig = {
  NO_REGISTRATION: {
    label: 'Unregistered',
    color: 'default' as 'default',
    icon: <CancelOutlinedIcon style={{ color: 'gray' }} />,
  },
  PENDING: {
    label: 'Pending',
    color: 'warning' as 'warning',
    icon: <ScheduleOutlinedIcon />,
  },
  ACTIVE: {
    label: 'Active',
    color: 'success' as 'success',
    icon: <CheckCircleOutlineIcon style={{ color: 'white' }} />,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'error' as 'error',
    icon: <PriorityHighOutlinedIcon style={{ color: 'white' }} />,
  },
};

const LabelSpecialStoreStatus: React.FC<LabelSpecialStoreStatusProps> = ({ status }) => {
  const config = statusConfig[status];
  return config ? <Chip label={config.label} color={config.color} icon={config.icon} size="small" /> : null;
};

export default LabelSpecialStoreStatus;
