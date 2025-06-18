import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { Helmet } from 'react-helmet';

const DMBSubmissionQCUser: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>DMB Submission QC - Córdoba Music Group</title>
      </Helmet>
      <Container maxWidth="sm">
        {' '}
        {/* Reducido de md a sm */}
        <Box my={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
            {' '}
            {/* Menos padding */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Box mb={2}>
                <BuildCircleIcon
                  sx={{
                    fontSize: 70, // Más pequeño
                    color: 'primary.main',
                    mb: 1,
                  }}
                />
              </Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                Page under construction
              </Typography>
              <Divider sx={{ width: '60%', my: 2 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 450, mb: 1, fontSize: '1.05rem' }}>
                We're building a centralized hub where you'll be able to submit and manage all your QC requests from one place.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 450, fontSize: '0.98rem' }}>
                Stay tuned for updates!
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default DMBSubmissionQCUser;
