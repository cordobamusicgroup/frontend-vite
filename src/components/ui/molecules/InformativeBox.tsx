import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useEffect } from 'react';
import { usePageDataStore } from '@/stores';

export type InformativeBoxVariant = 'info' | 'warning' | 'error' | 'success';

const variantStyles = {
  info: {
    backgroundColor: '#e8f4fd',
    color: '#0277bd',
    borderColor: '#0288d1',
    icon: InfoOutlinedIcon,
    iconColor: '#0288d1',
  },
  warning: {
    backgroundColor: '#fff9e6',
    color: '#e65100',
    borderColor: '#f57c00',
    icon: WarningAmberOutlinedIcon,
    iconColor: '#f57c00',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderColor: '#d32f2f',
    icon: ErrorOutlineOutlinedIcon,
    iconColor: '#d32f2f',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderColor: '#388e3c',
    icon: CheckCircleOutlineIcon,
    iconColor: '#388e3c',
  },
};

interface InformativeBoxProps {
  id?: string; // Unique ID for persistent state
  title?: string;
  children: ReactNode;
  variant?: InformativeBoxVariant;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export default function InformativeBox({
  id,
  title = 'Information',
  children,
  variant = 'info',
  defaultOpen = true,
  collapsible = false
}: InformativeBoxProps) {
  const { informativeBoxes, toggleInformativeBox, setInformativeBoxState } = usePageDataStore();
  const styles = variantStyles[variant];
  const IconComponent = styles.icon;

  // Determine open state: use stored state if ID is provided, otherwise use local default
  const isOpen = id ? (informativeBoxes[id] ?? defaultOpen) : defaultOpen;

  // Initialize state in store if ID is provided and not yet set
  useEffect(() => {
    if (id && informativeBoxes[id] === undefined) {
      setInformativeBoxState(id, defaultOpen);
    }
  }, [id, defaultOpen, informativeBoxes, setInformativeBoxState]);

  const handleToggle = () => {
    if (collapsible && id) {
      toggleInformativeBox(id);
    }
  };

  if (collapsible) {
    return (
      <Accordion
        expanded={isOpen}
        onChange={handleToggle}
        sx={{
          my: 2,
          backgroundColor: styles.backgroundColor,
          borderLeft: `4px solid ${styles.borderColor}`,
          borderRadius: '4px !important',
          border: `1px solid ${styles.borderColor}30`,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
          },
        }}
        disableGutters
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: styles.iconColor }} />}
          sx={{
            minHeight: 48,
            '&.Mui-expanded': {
              minHeight: 48,
            },
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 1.5,
              my: 1.5,
              '&.Mui-expanded': {
                my: 1.5,
              },
            },
          }}
        >
          <IconComponent
            sx={{
              fontSize: '20px',
              color: styles.iconColor,
            }}
          />
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 500,
              color: styles.color,
            }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            pt: 0,
            pb: 2,
            px: 2,
            color: styles.color,
            '& ul': {
              marginTop: 0.5,
              marginBottom: 0.5,
            },
            '& li': {
              marginBottom: 0.5,
            },
          }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }

  // Non-collapsible version
  return (
    <Box
      sx={{
        my: 2,
        backgroundColor: styles.backgroundColor,
        borderLeft: `4px solid ${styles.borderColor}`,
        borderRadius: '4px',
        border: `1px solid ${styles.borderColor}30`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
          minHeight: 48,
        }}
      >
        <IconComponent
          sx={{
            fontSize: '20px',
            color: styles.iconColor,
          }}
        />
        <Typography
          sx={{
            fontSize: '15px',
            fontWeight: 500,
            color: styles.color,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 0.5,
          color: styles.color,
          '& ul': {
            marginTop: 0.5,
            marginBottom: 0.5,
          },
          '& li': {
            marginBottom: 0.5,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
