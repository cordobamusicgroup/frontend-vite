import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { Chip } from '@mui/material';

interface LabelSpecialStoreStatusProps {
  status: string;
}
const LabelSpecialStoreStatus: React.FC<LabelSpecialStoreStatusProps> = ({ status }) => {
  if (status === 'NO_REGISTRATION')
    return (
      <Chip label="Unregistered" color="default" icon={<CancelOutlinedIcon style={{ color: 'gray' }} />} size="small" />
    ); // NO_REGISTRATION
  if (status === 'PENDING')
    return <Chip label="Pending" color="warning" icon={<ScheduleOutlinedIcon />} size="small" />; // pending
  if (status === 'ACTIVE')
    return (
      <Chip label="Active" color="success" icon={<CheckCircleOutlineIcon style={{ color: 'white' }} />} size="small" />
    );
  if (status === 'REJECTED')
    return (
      <Chip
        label="Rejected"
        color="error"
        icon={<PriorityHighOutlinedIcon style={{ color: 'white' }} />}
        size="small"
      />
    );
};

export default LabelSpecialStoreStatus;
