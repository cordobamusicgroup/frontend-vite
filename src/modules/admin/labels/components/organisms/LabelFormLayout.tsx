import { Paper } from '@mui/material';
import LabelDetailsForm from '../molecules/LabelDetailsForm';

type Props = {
  handleSubmit: () => void;
  onChange: () => void;
};

const LabelFormLayout: React.FC<Props> = ({ handleSubmit, onChange }) => {
  return (
    <form onChange={onChange} onSubmit={handleSubmit}>
      <Paper elevation={0} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 2 }}>
        <LabelDetailsForm />
      </Paper>
    </form>
  );
};

export default LabelFormLayout;
