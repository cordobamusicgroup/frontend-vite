import React from 'react';
import { Box, Typography, Paper, useTheme, Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EmailIcon from '@mui/icons-material/Email';

const SupportPage: React.FC = () => {
  const theme = useTheme();

  const handleTicketSystemClick = () => {
    window.open('https://support.cordobamusicgroup.co.uk/', '_blank');
  };

  const handleEmailSupportClick = () => {
    // Try to open mailto, but also provide visible email for copy
    window.location.href = 'mailto:support@cordobamusicgroup.co.uk';
  };

  return (
    <>
      <Helmet>
        <title>Support Center - Córdoba Music Group</title>
      </Helmet>

      <Box p={3} sx={{ display: 'flex', flexDirection: 'column', maxWidth: 1200, margin: '0 auto' }}>
        {/* Banner */}
        <Paper
          elevation={3}
          sx={{
            position: 'relative',
            height: 250,
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', px: 3, zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Support Center
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 400,
                maxWidth: 800,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              We're here to help you with any questions or issues you may have
            </Typography>
          </Box>
        </Paper>

        {/* Info Section */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            In order to streamline support requests and better serve you, we utilize a support ticket system.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Every support request is assigned a unique ticket number which you can use to track the progress and responses online.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            For your reference we provide complete archives and history of all your support requests.
          </Typography>
        </Paper>

        {/* Support Options */}
        <Grid container spacing={3}>
          {/* Support Ticket System */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={handleTicketSystemClick}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ConfirmationNumberIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    mr: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  Support Ticket System
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}>
                This is where you will keep track of all your requests, even those you have made through the other channels and require follow-up.
              </Typography>
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontWeight: 500 }}>
                  Click to access the ticket system
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Email Support */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={handleEmailSupportClick}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.secondary.main,
                    mr: 2,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Email Support
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: theme.palette.text.secondary, mb: 2 }}>
                By sending an email to our email address you will be creating a ticket in the system and you will be able to follow it up by mail or via the support centre.
              </Typography>
              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                    fontFamily: 'monospace',
                  }}
                >
                  support@cordobamusicgroup.co.uk
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SupportPage;
