import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface LabelStatusChipProps {
  status: string;
}

const LabelStatusChip: React.FC<LabelStatusChipProps> = ({ status }) => {
  if (status === 'ACTIVE') {
    return (
      <Chip label="Active" color="success" icon={<CheckCircleOutlineIcon style={{ color: 'white' }} />} size="small" />
    );
  } else if (status === 'DISABLED') {
    return (
      <Chip label="Disabled" color="default" icon={<CancelOutlinedIcon style={{ color: 'gray' }} />} size="small" />
    );
  }
};

export default LabelStatusChip;
