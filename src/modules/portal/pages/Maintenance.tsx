import React from 'react';
import { Box, Typography, Button, Container, Avatar } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';

const Maintenance: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Box sx={{ position: 'relative', mb: 4 }}>
          <StorageIcon sx={{ fontSize: 100, color: 'primary.main' }} />
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              position: 'absolute',
              right: -20,
              top: -15,
              width: 56,
              height: 56,
              boxShadow: 2,
            }}
          >
            <BuildIcon sx={{ color: 'white', fontSize: 32 }} />
          </Avatar>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          System Maintenance
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px' }}>
          We're currently having trouble connecting to our servers. Our team is working to resolve the issue.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: '500px' }}>
          Please try again in a few moments or contact support if the problem persists.
        </Typography>

        <Button
          variant="contained"
          onClick={handleReload}
          color="primary"
          size="large"
          aria-label="Reload page"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
          }}
        >
          Reload Page
        </Button>
      </Container>
    </Box>
  );
};

export default Maintenance;
