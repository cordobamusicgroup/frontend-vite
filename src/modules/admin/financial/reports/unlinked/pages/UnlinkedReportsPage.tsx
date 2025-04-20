import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import theme from '@/theme';
import { Box, Typography } from '@mui/material';
import UnlinkedReportsTable from '../components/organisms/UnlinkedReportsTable';

const UnlinkedReportsPage: React.FC = () => {
  const { notification } = useNotificationStore();

  return (
    <>
      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: '18px' }}>Link Missing Reports</Typography>
        </CustomPageHeader>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: 'flex', height: '600px', width: '100%' }}>
          <UnlinkedReportsTable />
        </Box>
      </Box>
    </>
  );
};

export default UnlinkedReportsPage;
