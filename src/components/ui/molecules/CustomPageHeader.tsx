import { isMobile } from '@/theme';
import { Box, BoxProps, SxProps } from '@mui/material';

interface CustomPageHeaderProps extends BoxProps {
  background: string;
  color?: string;
  children: React.ReactNode;
}

const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({ background, color, children, sx, ...boxProps }) => {
  const isSticky = !isMobile();

  const defaultStyles: SxProps = {
    display: 'flex',
    flexDirection: isMobile() ? 'column' : 'row',
    justifyContent: isMobile() ? 'center' : 'space-between',
    alignItems: 'center',
    marginBottom: '15px', // antes: "20px"
    minHeight: '55px', // antes: "62.5px"
    gap: 2,
    background,
    color,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '15px',
    paddingRight: '15px',
    borderRadius: '5px',
    position: isSticky ? 'sticky' : 'static',
    top: isSticky ? '80px' : 'auto',
    zIndex: isSticky ? '50' : 'auto',
  };

  return (
    <Box
      sx={{ ...defaultStyles, ...sx }} // Merge default styles with provided styles
      {...boxProps} // Spread other Box props
    >
      {children}
    </Box>
  );
};

export default CustomPageHeader;
