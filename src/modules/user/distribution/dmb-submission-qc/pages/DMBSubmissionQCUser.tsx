import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const DMBSubmissionQCUser: React.FC = () => {
  return (
    <>
      <title>DMB Submission QC - Córdoba Music Group</title>

      <Container
        maxWidth="sm"
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
            py: 6,
          }}
        >
          <Box
            sx={{
              mb: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1,
              },
            }}
          >
            <BuildCircleIcon
              sx={{
                fontSize: 120,
                color: 'primary.main',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.8,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontWeight: 600,
              color: 'primary.dark',
              mb: 1,
            }}
          >
            Page under construction
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: 'text.secondary',
              maxWidth: '450px',
              lineHeight: 1.7,
            }}
          >
            We're building a centralized hub where you'll be able to submit and manage all your QC requests from one place. Stay tuned!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default DMBSubmissionQCUser;
