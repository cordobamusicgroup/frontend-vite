import { Box, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import theme from "@/theme";
import { useNavigate } from "react-router";
import webRoutes from "@/lib/web.routes";
import BasicButton from "@/components/ui/atoms/BasicButton";
import ErrorBox from "@/components/ui/molecules/ErrorBox";
import SuccessBox from "@/components/ui/molecules/SuccessBox";
import ListClientsTable from "../components/organisms/ListClientsTable";
import { useNotificationStore } from "@/stores";
import CustomPageHeader from "@/components/ui/molecules/CustomPageHeader";
import { useNotificationCleanup } from "@/hooks/useNotificationCleanup";
import { Helmet } from "react-helmet";

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();

  const { notification, setNotification } = useNotificationStore();

  const handleCreateClient = (): void => {
    navigate(webRoutes.admin.clients.create);
  };

  useNotificationCleanup();

  return (
    <>
      <Helmet>
        <title>Clients - Córdoba Music Group</title>
      </Helmet>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: "16px" }}>Manage Clients</Typography>
          <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleCreateClient} color="primary" variant="contained" startIcon={<PersonAddIcon />}>
            Create Client
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
          <ListClientsTable setNotification={setNotification} />
        </Box>
      </Box>
    </>
  );
};

export default ClientListPage;
