import theme from '@/theme';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { useBalancesUser } from '../hooks/useBalancesUser';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import BalancesBlock from '../components/organisms/BalancesBlock';
import TransactionsTable from '../components/organisms/TransactionsTable';
import InformativeBox from '@/components/ui/molecules/InformativeBox';

export default function PaymentsUserPage() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { balancesData, balancesFetchError } = useBalancesUser();
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | null>(null);

  const handleBalanceChange = (event: SelectChangeEvent<string>) => {
    const currency = event.target.value;
    setSelectedCurrency(currency as 'USD' | 'EUR');
    setNotification(null); // Clear any existing notifications
  };

  return (
    <Box p={3} sx={{ display: 'flex', flexDirection: 'column' }}>
      <CustomPageHeader background={'#0173C2'} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: '16px' }}>Payments & Operations</Typography>
      </CustomPageHeader>

      <Box>
        {notification?.type === 'success' && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === 'error' && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <>
        <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel>Select Balance</InputLabel>
          <Select value={selectedCurrency ?? ''} onChange={handleBalanceChange} label="Select Balance">
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </FormControl>

        <InformativeBox collapsible>
          <Typography variant="body2" sx={{ mb: 1 }}>
            On this page you can view your <b>balances</b> and the history of <b>payments and transactions</b> in your account:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                <b>Balance</b>: Shows the total amount credited in the selected currency. Balances are updated once payments have been processed and credited to your account.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <b>Transactions</b>: Here you will see all credits and debits associated with your account, including received payments, withdrawals, and other adjustments.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Please note:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                Payments are usually credited between the <b>15th and 30th of each month</b>, depending on the receipt of funds and banking processes. Delays may occur due to external factors.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            * Dates and amounts are estimates and may vary. Please avoid contacting support solely to inquire about credit dates or recent transactions.
          </Typography>
        </InformativeBox>

        {selectedCurrency && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {balancesData && <BalancesBlock balance={balancesData.find((balance: any) => balance.currency === selectedCurrency)?.total} currency={selectedCurrency} />}
            <TransactionsTable setNotification={setNotification} currency={selectedCurrency} />
          </Box>
        )}
      </>

      {balancesFetchError && <ErrorBox>{balancesFetchError.message}</ErrorBox>}
    </Box>
  );
}
