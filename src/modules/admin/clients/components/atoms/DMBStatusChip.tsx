import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";

interface DMBStatusChipProps {
  status: string;
}

const normalizeText = (text: string): string => {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const DMBStatusChip: React.FC<DMBStatusChipProps> = ({ status }) => {
  const normalized = normalizeText(status);
  let color: "default" | "success" | "warning" | "error" = "default";
  let icon = null;
  switch (status.toUpperCase()) {
    case "ACTIVE":
      color = "success";
      icon = <CheckCircleIcon fontSize="small" />;
      break;
    case "PENDING":
      color = "warning";
      icon = <HourglassEmptyIcon fontSize="small" />;
      break;
    case "INACTIVE":
      color = "error";
      icon = <CancelIcon fontSize="small" />;
      break;
    default:
      color = "default";
  }
  return <Chip label={normalized} color={color} size="small" icon={icon || undefined} />;
};

export default DMBStatusChip;
