import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationCleanup } from '@/hooks/useNotificationCleanup';
import { useNotificationStore } from '@/stores';
import theme from '@/theme';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

export default function ReportsPage() {
  const { notification, setNotification } = useNotificationStore();
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);

  useNotificationCleanup();

  const handleDistributorChange = (event: SelectChangeEvent<string>) => {
    const distributor = event.target.value;
    setSelectedDistributor(distributor);
    setNotification(null); // Clear any existing notifications
  };

  return (
    <>
      <Helmet>
        <title>Financial Reports - Córdoba Music Group</title>
      </Helmet>

      <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
        <CustomPageHeader background={'#0A5F33'} color={theme.palette.primary.contrastText}>
          <Typography sx={{ fontSize: '18px' }}>Financial Reports</Typography>
          {/* <BasicButton colorBackground="white" colorText={"#0A5F33"} color="primary" variant="contained" startIcon={<FileUpload />}>
          Export Reports
        </BasicButton> */}
        </CustomPageHeader>

        <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel>Select Distributor</InputLabel>
          <Select value={selectedDistributor ?? ''} onChange={handleDistributorChange} label="Select Distributor">
            <MenuItem value="KONTOR">Kontor New Media</MenuItem>
            <MenuItem value="BELIEVE">Believe Digital</MenuItem>
          </Select>
        </FormControl>

        <Box>
          {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box my={2} p={2} sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', borderLeft: '6px solid #1976d2' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            FAQ
          </Typography>
          <Typography variant="body2">
            The page displays financial reports. The column <b>"Debit State"</b> indicates whether the report has been paid in the balance or not. If it says <b>"Paid"</b>, it means it was paid with
            its corresponding date. However, older reports from 2024 may appear without a date as they were paid on the previous platform. <b>"Unpaid"</b> means the report's value has not yet impacted
            your balance because we do not have the funds available on our side.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Below are approximate dates, which may vary:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">All reports are received between the 30th and the 1st of the following month, but this does not mean they are paid on those dates.</Typography>
            </li>
            <li>
              <Typography variant="body2">Payments are made on the 15th of each month once the payment is received. In some cases, delays may occur due to banking or other issues.</Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            * Dates are approximate and may vary. Please avoid contacting us frequently to inquire about when payments will be made or reports will arrive.
          </Typography>
        </Box>

        {selectedDistributor && <Box sx={{ display: 'flex', height: '600px', width: '100%', justifyContent: 'center' }}>{/* <ReportsTable distributor={selectedDistributor} /> */}</Box>}
      </Box>
    </>
  );
}
