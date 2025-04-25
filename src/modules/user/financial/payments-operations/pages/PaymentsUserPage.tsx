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
            On this page, you can monitor your <b>account balances</b> and review the complete history of <b>payments and transactions</b> associated with your account:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                <b>Balance</b>: Displays the total amount currently available in the selected currency. Balances are updated after payments are processed and successfully credited to your account.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <b>Transactions</b>: Shows all credits and debits, including received payments, withdrawals, adjustments, and any other account activity.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Important information:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>
              <Typography variant="body2">
                Payments are typically credited to your account between the <b>15th and 30th of each month</b>, depending on when funds are received and processed by our banking partners. Please note
                that external factors may occasionally cause delays.
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            * All dates and amounts are approximate and subject to change. We kindly ask that you do not contact support solely to inquire about payment dates or recent transactions unless there is an
            urgent issue.
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
