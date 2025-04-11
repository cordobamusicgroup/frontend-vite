import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtonsLabels: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <Box>
      <Tooltip title="Edit">
        <IconButton sx={{ color: 'gray' }} onClick={onEdit} size="small">
          <EditIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton sx={{ color: 'gray' }} onClick={onDelete} size="small">
          <DeleteForeverIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionButtonsLabels;
