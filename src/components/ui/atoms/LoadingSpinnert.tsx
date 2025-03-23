import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingSpinnerProps {
  color?: CircularProgressProps["color"];
  size?: number;
  customColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color = "inherit", size = 45, customColor }) => {
  return <CircularProgress color={color} size={size} sx={{ color: customColor }} />;
};

export default LoadingSpinner;
