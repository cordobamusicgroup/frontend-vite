import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface FullScreenLoaderProps {
  open: boolean;
}

const FullScreenLoaderWithBack: React.FC<FullScreenLoaderProps> = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={45} />
    </Backdrop>
  );
};

export default FullScreenLoaderWithBack;
