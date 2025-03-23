import { Chip } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface IsBlockedChipProps {
  isBlocked: boolean;
}

const IsBlockedChip: React.FC<IsBlockedChipProps> = ({ isBlocked }) => {
  return isBlocked ? <Chip label="Blocked" color="error" size="small" icon={<BlockIcon fontSize="small" />} /> : <Chip label="Active" color="success" size="small" icon={<CheckCircleIcon fontSize="small" />} />;
};

export default IsBlockedChip;
