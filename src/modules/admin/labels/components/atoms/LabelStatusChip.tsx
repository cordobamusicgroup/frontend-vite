import React from 'react';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface LabelStatusChipProps {
  status: 'ACTIVE' | 'DISABLED';
}

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    color: 'success' as const,
    icon: <CheckCircleOutlineIcon style={{ color: 'white' }} />,
  },
  DISABLED: {
    label: 'Disabled',
    color: 'default' as const,
    icon: <CancelOutlinedIcon style={{ color: 'gray' }} />,
  },
};

const LabelStatusChip: React.FC<LabelStatusChipProps> = ({ status }) => {
  const config = statusConfig[status];
  return config ? <Chip label={config.label} color={config.color} icon={config.icon} size="small" /> : null;
};

export default LabelStatusChip;
