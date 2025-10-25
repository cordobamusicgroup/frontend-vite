import HelpIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, Typography, Paper, useTheme, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'Overview - Córdoba Music Group' },
    { name: 'description', content: 'Welcome to the Córdoba Music Group platform' },
  ];
};

/**
 * Página de resumen (Overview) para el portal de Córdoba Music Group.
 *
 * Muestra información general sobre la plataforma, su propósito y una sección de preguntas frecuentes (FAQ).
 * Incluye detalles sobre balances en diferentes monedas y contacto para feedback.
 *
 * Estructura:
 * - Banner principal con gradiente
 * - Descripción de la plataforma y sus mejoras
 * - Tarjetas de características principales
 * - Sección FAQ con acordeón
 * - Información de contacto
 */
const PageOverview: React.FC = () => {
  const theme = useTheme();

  return (
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
            Welcome to Córdoba Music Group
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
            Your modern platform for music distribution and royalty management
          </Typography>
        </Box>
      </Paper>

      {/* About Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
          About This Platform
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
          This is our next-generation platform designed to provide you with a modern, efficient, and user-friendly experience.
          We've built this system from the ground up to better serve your needs and streamline your workflow.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
          We've focused on automation and efficiency to save you time. Processes that previously required manual intervention,
          such as royalty report registration, are now fully automated. This allows us to process your data faster and with
          greater accuracy.
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Our commitment is to continuously improve this platform. While some advanced features are still being developed,
          we maintain the highest standards when it comes to financial data accuracy—ensuring every transaction is tracked
          precisely and all reports remain transparent and reliable.
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SpeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Fast & Modern
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Built with the latest technologies to provide you with a fast, responsive, and reliable experience across all devices.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesomeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Automated Processes
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Automatic royalty processing, report generation, and data synchronization to reduce manual work and errors.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RocketLaunchIcon sx={{ fontSize: 40, color: theme.palette.success.main, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Continuous Evolution
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Regular updates and new features based on your feedback to ensure the platform evolves with your needs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <HelpIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Frequently Asked Questions
          </Typography>
        </Box>

        {[
          {
            icon: <AttachMoneyIcon sx={{ mr: 1, color: 'secondary.main' }} />,
            question: 'Why do I have two balances in USD and EUR?',
            answer: (
              <>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  As many of you know, we have migrated from Believe distribution to Kontor New Media. Until Believe royalties stop coming in,
                  we have separated the royalties: Believe payments in the USD balance and Kontor payments in the EUR balance.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  Once Believe stops reporting royalties, our plan is to combine everything into the EUR balance for simplified management.
                </Typography>
              </>
            ),
          },
        ].map((faq, idx) => (
          <Accordion key={idx} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-content-${idx}`}
              id={`faq-header-${idx}`}
              sx={{
                backgroundColor: 'action.hover',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Box display="flex" alignItems="center">
                {faq.icon}
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={3} p={2} sx={{ backgroundColor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            This FAQ section will be updated periodically with more questions and answers.
            If you have a question that's not answered here, please contact our support team.
          </Typography>
        </Box>
      </Paper>

      {/* Contact Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
          We Value Your Feedback
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Have suggestions or feedback about the platform? We'd love to hear from you at{' '}
          <Typography
            component="span"
            sx={{
              color: 'secondary.main',
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
          >
            feedback@cordobamusicgroup.co.uk
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default PageOverview;
