import { Grid, Paper, Typography } from '@mui/material';
import UserDetailsForm from '../molecules/UserDetailsForm';

type Props = {
  handleSubmit: () => void;
  onChange: () => void;
};

const UsersFormLayout: React.FC<Props> = ({ handleSubmit, onChange }) => {
  return (
    <form onChange={onChange} onSubmit={handleSubmit}>
      <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" mb={1}>
              User Details
            </Typography>
            <UserDetailsForm />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default UsersFormLayout;
