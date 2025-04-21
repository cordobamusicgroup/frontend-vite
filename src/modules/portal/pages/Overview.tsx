import HelpIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Container, Box, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Helmet } from 'react-helmet';

/**
 * Página de resumen (Overview) para el portal de Córdoba Music Group.
 *
 * Muestra información general sobre la plataforma, su propósito y una sección de preguntas frecuentes (FAQ).
 * Incluye detalles sobre balances en diferentes monedas y contacto para feedback.
 *
 * Estructura:
 * - Título y bienvenida
 * - Descripción de la plataforma y sus mejoras
 * - Sección FAQ con acordeón
 * - Información de contacto
 */
const PageOverview: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Overview - Córdoba Music Group</title>
      </Helmet>
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Córdoba Music Group!
          </Typography>

          <Paper elevation={3} sx={{ p: 4, my: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              About This Platform
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" paragraph>
              This web application is the progressive replacement for our previous "Database" platform which experienced performance issues, security concerns, and efficiency limitations.
            </Typography>

            <Typography variant="body1" paragraph>
              With this new system, we can manage everything more efficiently in a cleaner ecosystem, while automating previously manual processes such as royalty report registration. You might be
              surprised to learn that this was a completely manual process in the previous platform!
            </Typography>

            <Typography variant="body1" paragraph>
              Our goal is to automate all processes. While some features may take time to implement, we are extremely careful with financial details to ensure not even a decimal is incorrect. This
              guarantees that all reports are clear and accurate.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, my: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <HelpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Frequently Asked Questions
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="faq-balance-content" id="faq-balance-header" sx={{ backgroundColor: 'action.hover' }}>
                <Box display="flex" alignItems="center">
                  <AttachMoneyIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Why do I have two balances in USD and EUR?
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  As many of you know, we have migrated from Believe distribution to Kontor New Media. Until Believe royalties stop coming in, we have separated the royalties: Believe payments in the
                  USD balance and Kontor payments in the EUR balance.
                </Typography>
                <Typography variant="body1">Once Believe stops reporting royalties, our plan is to combine everything into the EUR balance.</Typography>
              </AccordionDetails>
            </Accordion>

            <Box mt={2} pl={1}>
              <Typography variant="caption" color="text.secondary" fontStyle="italic">
                This FAQ section will be updated periodically with more questions and answers.
              </Typography>
            </Box>
          </Paper>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              For feedback, please email us at feedback@cordobamusicgroup.co.uk
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PageOverview;
