import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface CenteredLoaderProps {
  open: boolean;
  size?: number;
  text?: string; // Nueva prop opcional para el texto
}

/**
 * A centered loader component that displays a spinner in the middle of the screen
 * without darkening the background.
 */
const CenteredLoader: React.FC<CenteredLoaderProps> = ({ open, size = 60, text }) => {
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        pointerEvents: 'none', // Allows clicking through the loader
      }}
    >
      <CircularProgress size={size} color="primary" />
      {text && (
        <Typography mt={2} sx={{ pointerEvents: 'none', fontSize: '1.25rem', fontWeight: 400 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default CenteredLoader;
