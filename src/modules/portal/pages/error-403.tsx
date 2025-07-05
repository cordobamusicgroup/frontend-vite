import { Box, Container, Typography } from '@mui/material';

export default function Error403() {
  return (
    <Container maxWidth="sm">
      <title>Access Forbidden</title>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '5rem', fontWeight: 'bold' }}>
          403
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom>
          Access Forbidden
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          You do not have permission to access this page.
        </Typography>
      </Box>
    </Container>
  );
}
