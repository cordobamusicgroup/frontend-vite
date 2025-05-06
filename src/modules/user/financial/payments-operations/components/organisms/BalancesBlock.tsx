import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { Block, MoneyOff, Pending, ScheduleSend, WarningAmber } from '@mui/icons-material';
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { usePaymentsUser } from '../../hooks/usePaymentsUser';
import BasicButton from '@/components/ui/atoms/BasicButton';
import { useBalancesUser } from '../../hooks/useBalancesUser';

interface BalancesBlockProps {
  paymentMethod?: string;
  currency?: 'USD' | 'EUR';
}

const DisabledButton = styled(BasicButton)({
  backgroundColor: '#c4c6cc',
  color: 'white',
  pointerEvents: 'none',
  boxShadow: 'none',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

export default function BalancesBlock({ paymentMethod = 'N/A', currency = 'EUR' }: BalancesBlockProps) {
  const [open, setOpen] = useState(false);
  const date = dayjs().format('DD MMMM YYYY');
  const currencySymbol = currency === 'USD' ? '$' : '€';
  const { withdrawalData } = usePaymentsUser();
  const { balancesData } = useBalancesUser();

  // Buscar el balance y retained para la currency seleccionada
  const balanceObj = Array.isArray(balancesData) ? balancesData.find((b: any) => b.currency === currency) : null;
  const numericBalance = typeof balanceObj?.total === 'number' ? balanceObj.total : parseFloat(balanceObj?.total || 0);
  const retained = typeof balanceObj?.retained === 'number' ? balanceObj.retained : parseFloat(balanceObj?.retained || 0);

  const isBlocked = withdrawalData?.isBlocked;
  const isPaymentInProgress = withdrawalData?.isPaymentInProgress;
  const isPaymentDataInValidation = withdrawalData?.isPaymentDataInValidation;

  const showRequestPaymentButton = numericBalance >= 100 && !isBlocked && !isPaymentInProgress && !isPaymentDataInValidation;

  const handleRequestPaymentClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        id="balance"
        sx={{
          display: 'flex',
          backgroundColor: '#f6f7fa',
          borderRadius: '4px',
          border: '1px solid #e9e9e9',
          width: '100%',
          justifyContent: 'center',
          padding: '25px',
          color: '#444444',
          flexDirection: { xs: 'column-reverse', md: 'row' }, // Responsive layout
        }}
      >
        <Box
          id="balance_info_text"
          sx={{
            display: 'flex',
            width: { xs: '100%', md: '50%' }, // Responsive width
            alignItems: 'start',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography color={'#444444'}>
            <b>Payment Method:</b> {paymentMethod}
          </Typography>
          {showRequestPaymentButton ? <BasicButton onClick={handleRequestPaymentClick}>Request Payment</BasicButton> : <DisabledButton>Payment Not Available</DisabledButton>}
          {numericBalance >= 100 && (
            <Typography color={'#444444'}>
              Your royalties have reached the <b>$100 threshold</b>, and you can now request a withdrawal in your chosen payment method.
            </Typography>
          )}
          {numericBalance < 100 && (
            <Box sx={{ display: 'flex', alignItems: 'start', color: '#444444' }}>
              <MoneyOff sx={{ fontSize: 18, marginRight: 1, color: '#09365F' }} />
              <Typography sx={{ fontSize: 16 }}>The amount of royalties due is inferior to the minimum required by your distribution contract.</Typography>
            </Box>
          )}
          {isPaymentInProgress && (
            <Box sx={{ display: 'flex', alignItems: 'start', color: '#444444' }}>
              <ScheduleSend sx={{ fontSize: 18, marginRight: 1, color: '#09365F' }} />
              <Typography sx={{ fontSize: 16 }}>You have a payment in progress, when it is completed you can request a new payment.</Typography>
            </Box>
          )}
          {isPaymentDataInValidation && (
            <Box sx={{ display: 'flex', alignItems: 'start', color: '#444444' }}>
              <Pending sx={{ fontSize: 18, marginRight: 1, color: '#2196F3' }} />
              <Typography sx={{ fontSize: 16 }}>Your payment details are being validated. The average processing time is 3 days.</Typography>
            </Box>
          )}
          {isBlocked && (
            <Box sx={{ display: 'flex', alignItems: 'start', color: '#444444' }}>
              <Block sx={{ fontSize: 18, marginRight: 1, color: '#F44336' }} />
              <Typography sx={{ fontSize: 16 }}>Your royalty withdrawals, method updates are blocked, contact us for more information.</Typography>
            </Box>
          )}
          {numericBalance < 0 && (
            <Box sx={{ display: 'flex', alignItems: 'start', color: '#444444' }}>
              <WarningAmber sx={{ fontSize: 18, marginRight: 1, color: '#FF9800' }} />
              <Typography sx={{ fontSize: 16 }}>Your balance is negative, the outstanding balance will be deducted from your next royalty payment.</Typography>
            </Box>
          )}
        </Box>

        <Box
          id="balance_amount"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            width: { xs: '100%', md: '50%' }, // Responsive width
            alignItems: { xs: 'flex-start', md: 'flex-end' }, // Responsive alignment
            marginTop: { xs: 0, md: 0 }, // Add margin for spacing on mobile
          }}
        >
          <Typography color={'#444444'}>Available balance on {date}</Typography>
          <Typography color={'#444444'}>
            <b>Currency:</b> {currency}
          </Typography>
          <Typography color={'#1E73BE'} id="current_balance" sx={{ fontSize: '30px', fontWeight: '600' }}>
            {currencySymbol} {numericBalance.toFixed(2)}
          </Typography>
          <Typography color={'#888'} sx={{ fontSize: '16px', fontWeight: 400, mt: 1 }}>
            Retained: {currencySymbol} {retained.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>To request your payment, please fill out the following form:</DialogContentText>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScKjR0OVMgo0qIHn8kF_-MPJ1FdI8lEG5oTzK6sRQLzPAGBFQ/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <BasicButton sx={{ marginTop: 2 }}>Open Payment Request Form</BasicButton>
          </a>
        </DialogContent>
        <DialogActions>
          <BasicButton onClick={handleClose}>Close</BasicButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
