import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import { useNotificationStore } from '@/stores';
import theme from '@/theme';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import ReportsTable from '../components/organisms/ReportsUserTable';
import InformativeBox from '@/components/ui/molecules/InformativeBox';

export default function ReportsPage() {
  const { notification, setNotification } = useNotificationStore();
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);

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
          <Typography sx={{ fontSize: '16px' }}>Financial Reports</Typography>
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

        <InformativeBox collapsible>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Here you can view your financial reports. The <b>"Debit State"</b> column shows whether the report amount has already been credited to your balance:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                <b>Paid</b>: The amount has been credited to your balance, and the corresponding payment date is shown. Older reports (prior to 2024) may not display a date, as they were processed on
                our previous platform.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <b>Unpaid</b>: The amount has not yet been credited to your balance because we have not received the corresponding funds from the distributor.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Please note:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                Reports are usually uploaded between the <b>30th of each month</b> and the <b>1st of the following month</b>. <u>This does not mean they are paid on those dates</u>; it only means they
                are available for review.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <b>Each report is credited to your balance at the end of the month in which it was uploaded.</b> For example: if a report is uploaded on April 1st, it will be paid around April 30th.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            * All dates are approximate and subject to change. Please do not contact support solely to inquire about payment or report arrival dates.
          </Typography>
        </InformativeBox>

        {selectedDistributor && (
          <Box sx={{ display: 'flex', height: '600px', width: '100%', justifyContent: 'center' }}>
            <ReportsTable distributor={selectedDistributor} />
          </Box>
        )}
      </Box>
    </>
  );
}
