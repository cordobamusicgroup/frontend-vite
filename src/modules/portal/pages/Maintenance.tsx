import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Page Unavailable
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sorry, the website is currently unavailable but will be back soon.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate(0)}>
          Reload
        </Button>
      </Box>
    </Container>
  );
};

export default Maintenance;
