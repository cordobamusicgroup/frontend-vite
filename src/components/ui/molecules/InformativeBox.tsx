import { Box, Typography, Collapse, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ReactNode, useState } from 'react';

export type InformativeBoxVariant = 'info' | 'warning' | 'error' | 'success';

const variantStyles = {
  info: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderLeft: '6px solid #1976d2',
    icon: <InfoOutlinedIcon sx={{ mr: 1 }} />,
  },
  warning: {
    backgroundColor: '#fff8e1',
    color: '#ff9800',
    borderLeft: '6px solid #ff9800',
    icon: <WarningAmberOutlinedIcon sx={{ mr: 1 }} />,
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    borderLeft: '6px solid #d32f2f',
    icon: <ErrorOutlineOutlinedIcon sx={{ mr: 1 }} />,
  },
  success: {
    backgroundColor: '#e7f5e9',
    color: '#2e7d32',
    borderLeft: '6px solid #2e7d32',
    icon: <InfoOutlinedIcon sx={{ mr: 1, color: '#2e7d32' }} />,
  },
};

interface InformativeBoxProps {
  title?: string;
  children: ReactNode;
  variant?: InformativeBoxVariant;
  defaultOpen?: boolean;
  collapsible?: boolean; // Nuevo prop para controlar si es colapsable
}

export default function InformativeBox({ title = 'Information', children, variant = 'info', defaultOpen = true, collapsible = false }: InformativeBoxProps) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = variantStyles[variant];

  return (
    <Box my={2} sx={{ backgroundColor: styles.backgroundColor, color: styles.color, borderLeft: styles.borderLeft, borderRadius: 2, boxShadow: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: collapsible ? 'pointer' : 'default', minHeight: 48, px: 2 }} onClick={collapsible ? () => setOpen((prev) => !prev) : undefined}>
        {styles.icon}
        <Typography variant="subtitle1" sx={{ fontSize: "15px" ,fontWeight: 600, flexGrow: 1, textTransform: 'uppercase' }}>
          {title}
        </Typography>
        {collapsible && (
          <IconButton size="small" sx={{ color: styles.color }}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>
      {collapsible ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box px={2} pb={1}>
            {children}
          </Box>
        </Collapse>
      ) : (
        <Box px={2} pb={2}>
          {children}
        </Box>
      )}
    </Box>
  );
}
