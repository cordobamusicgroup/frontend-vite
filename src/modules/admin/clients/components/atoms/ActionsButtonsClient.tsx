import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}
const ActionButtonsClient: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <Box>
      <Tooltip title="Edit">
        <IconButton sx={{ color: "gray" }} onClick={onEdit} size="small">
          <EditIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton sx={{ color: "gray" }} onClick={onDelete} size="small">
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default ActionButtonsClient;
