import { usePageDataStore } from "@/stores";
import { Box, Chip } from "@mui/material";
import BackofficeLogo from "../atoms/BackofficeLogo";

const VerticalMenuHeader: React.FC = () => {
  const { openMenu: isOpen } = usePageDataStore();
  return (
    <Box display="flex" alignItems={"center"} flexDirection={"column"} justifyContent="center" paddingTop={2} paddingBottom={1}>
      <BackofficeLogo small={!isOpen} />
      <Chip
        label="BETA"
        color="primary"
        size="small"
        sx={{
          marginTop: "8px",
          fontWeight: "bold",
          borderRadius: "4px",
        }}
      />
    </Box>
  );
};

export default VerticalMenuHeader;
