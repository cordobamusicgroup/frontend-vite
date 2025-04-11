import { Grid, Paper } from '@mui/material';
import EditProfileForm from '../molecules/EditProfileForm';
import ChangePasswordForm from '../molecules/ChangePasswordForm';

type Props = {
  handleSubmit: () => void;
  onChange: () => void;
};

const UserFormLayout: React.FC<Props> = ({ handleSubmit, onChange }) => {
  return (
    <form onChange={onChange} onSubmit={handleSubmit}>
      <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EditProfileForm />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ChangePasswordForm />
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default UserFormLayout;
