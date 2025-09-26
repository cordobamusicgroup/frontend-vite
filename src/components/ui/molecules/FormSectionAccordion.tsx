import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface FormSectionAccordionProps {
  title: string;
  icon: React.ReactElement;
  hasError?: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const FormSectionAccordion: React.FC<FormSectionAccordionProps> = ({ title, icon, hasError = false, defaultExpanded = false, children }) => (
  <Accordion 
    defaultExpanded={defaultExpanded} 
    sx={{ 
      width: '100%', 
      mb: '0px !important', 
      '&:not(:last-child)': { mb: '0px !important' }, 
      '&.MuiAccordion-root': { 
        mb: '0px !important',
        '&:before': {
          display: 'none'
        }
      },
      '&.Mui-expanded': {
        mb: '0px !important',
        margin: '0px !important'
      }
    }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box display="flex" alignItems="center">
        {icon}
        <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1, flexGrow: 1 }}>
          {title}
        </Typography>
        {hasError && (
          <Chip
            icon={<ErrorOutlineIcon />}
            label="Error"
            color="error"
            size="small"
            sx={{ ml: 1, height: '24px' }}
          />
        )}
      </Box>
    </AccordionSummary>
    <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>{children}</AccordionDetails>
  </Accordion>
);

export default FormSectionAccordion;
