import { Box } from "@mui/material";
import { ReactNode } from "react";
import LoginLogo from "../components/atoms/LoginLogo";

interface AuthLayoutProps {
  children: ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <LoginLogo />
      {children}
    </Box>
  );
};
export default AuthLayout;
