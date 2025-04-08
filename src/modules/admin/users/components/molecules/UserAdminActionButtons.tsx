import { Box, Tooltip, IconButton } from "@mui/material";
import { Delete, Edit, MailOutline } from "@mui/icons-material";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onResendEmail: () => void;
}

const UserAdminActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, onResendEmail }) => {
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
      <Tooltip title="Resend Email">
        <IconButton sx={{ color: "gray" }} onClick={onResendEmail} size="small">
          <MailOutline sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UserAdminActionButtons;
