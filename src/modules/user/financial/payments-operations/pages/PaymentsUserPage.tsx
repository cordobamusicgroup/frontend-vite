import theme from '@/theme';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { useBalancesUser } from '../hooks/useBalancesUser';
import CustomPageHeader from '@/components/ui/molecules/CustomPageHeader';
import SuccessBox from '@/components/ui/molecules/SuccessBox';
import ErrorBox from '@/components/ui/molecules/ErrorBox';
import BalancesBlock from '../components/organisms/BalancesBlock';
import TransactionsTable from '../components/organisms/TransactionsTable';

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
