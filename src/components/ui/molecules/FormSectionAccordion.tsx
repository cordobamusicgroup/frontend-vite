import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FormSectionAccordionProps {
  title: string;
  icon: React.ReactElement;
  hasError?: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const FormSectionAccordion: React.FC<FormSectionAccordionProps> = ({ title, icon, hasError = false, defaultExpanded = false, children }) => (
  <Accordion defaultExpanded={defaultExpanded} sx={{ width: '100%' }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center">
        {icon}
        <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
          {title}
          {hasError && (
            <Typography component="span" sx={{ color: 'error.main', fontWeight: 600, ml: 2, fontSize: '14px' }}>
              Complete!
            </Typography>
          )}
        </Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>{children}</AccordionDetails>
  </Accordion>
);

export default FormSectionAccordion;
