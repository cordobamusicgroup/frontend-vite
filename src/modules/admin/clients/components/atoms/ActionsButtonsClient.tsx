import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}
const ActionButtonsClient: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <Box>
      <Tooltip title="Edit">
        <IconButton sx={{ color: "gray" }} onClick={onEdit} size="small">
          <Edit sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton sx={{ color: "gray" }} onClick={onDelete} size="small">
          <Delete sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default ActionButtonsClient;
