import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { AddOutlined, PersonAdd } from "@mui/icons-material";
import theme from "@/theme";
import { useNavigate } from "react-router";
import webRoutes from "@/lib/web.routes";
import BasicButton from "@/components/ui/atoms/BasicButton";
import ErrorBox from "@/components/ui/molecules/ErrorBox";
import SuccessBox from "@/components/ui/molecules/SuccessBox";
import ClientTable from "../components/organisms/ListClientsTable";
import { useNotificationStore } from "@/stores";
import CustomPageHeader from "@/components/ui/molecules/CustomPageHeader";

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();

  const { notification, setNotification, clearNotification } = useNotificationStore();

  const handleCreateClient = (): void => {
    navigate(webRoutes.admin.clients.create);
  };

  clearNotification();

  return (
    <>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: "16px" }}>Manage Clients</Typography>
          <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleCreateClient} color="primary" variant="contained" startIcon={<PersonAdd />}>
            Create Client
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
          <ClientTable setNotification={setNotification} />
        </Box>
      </Box>
    </>
  );
};

export default ClientListPage;
