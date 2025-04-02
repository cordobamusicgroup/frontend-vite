import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface CenteredLoaderProps {
  open: boolean;
  size?: number;
}

/**
 * A centered loader component that displays a spinner in the middle of the screen
 * without darkening the background.
 */
const CenteredLoader: React.FC<CenteredLoaderProps> = ({ open, size = 60 }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        pointerEvents: 'none', // Allows clicking through the loader
      }}
    >
      <CircularProgress size={size} color="primary" />
    </Box>
  );
};

export default CenteredLoader;
