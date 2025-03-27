import { Grid, Paper, Typography } from "@mui/material";
import AddressDetailsForm from "../molecules/AddressDetailsForm";
import ClientDetailsForm from "../molecules/ClientDetailsForm";
import ContractDetailsForm from "../molecules/ContractDetailsForm";
import DmbDetailsForm from "../molecules/DmbDetailsForm";

type Props = {
  handleSubmit: () => void;
  onChange: () => void;
};

const ClientFormLayout: React.FC<Props> = ({ handleSubmit, onChange }) => {
  return (
    <form onChange={onChange} onSubmit={handleSubmit}>
      <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" mb={1}>
              Personal Details
            </Typography>
            <ClientDetailsForm />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" mb={1}>
              Address
            </Typography>
            <AddressDetailsForm />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" mb={1}>
              Contract Details
            </Typography>
            <ContractDetailsForm />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" mb={1}>
              DMB Data
            </Typography>
            <DmbDetailsForm />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default ClientFormLayout;
