import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FormSectionAccordion from '@/components/ui/molecules/FormSectionAccordion';

interface PaymentInfoSectionProps {
  paymentData?: any;
}

const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({ paymentData }) => {
  return (
    <FormSectionAccordion title="Payment Information" icon={<AccountBalanceIcon sx={{ color: 'primary.main' }} />} defaultExpanded={false}>
      <Box sx={{ p: 2 }}>
        {(() => {
          const pd = paymentData || null;

          // Support two shapes: { paymentMethod, data } or { paymentMethod, paymentData }
          if (!pd) {
            return (
              <Typography variant="body2" color="text.secondary">
                This client does not have payment information.
              </Typography>
            );
          }

          const paymentMethod = pd.paymentMethod || pd.method || null;
          const data = pd.data || pd.paymentData || pd;

          if (!paymentMethod || !data) {
            return (
              <Typography variant="body2" color="text.secondary">
                Payment information is not available.
              </Typography>
            );
          }

          // Flatten object into key/value pairs for generic display
          const flatten = (obj: any, parentKey = ''): Record<string, string> => {
            const result: Record<string, string> = {};
            const helper = (o: any, prefix: string) => {
              if (o === null || o === undefined) return;
              if (typeof o !== 'object' || o instanceof Date) {
                result[prefix] = String(o);
                return;
              }
              if (Array.isArray(o)) {
                o.forEach((item, idx) => {
                  helper(item, `${prefix}[${idx}]`);
                });
                return;
              }
              Object.keys(o).forEach((k) => {
                const val = o[k];
                const newKey = prefix ? `${prefix}.${k}` : k;
                helper(val, newKey);
              });
            };
            helper(obj, parentKey);
            return result;
          };

          const details = {
            Method: String(paymentMethod),
            ...flatten(data),
          };

          return (
            <Box>
              <Grid container spacing={1}>
                {Object.entries(details).map(([key, value]) => {
                  const isMonospace = /address|wallet|iban|account|iban_account|account_number/i.test(key);
                  const displayValue = (() => {
                    try {
                      // If value looks like JSON (object/array encoded), show a compact JSON
                      if (value && (value.startsWith('{') || value.startsWith('['))) {
                        const parsed = JSON.parse(value);
                        return JSON.stringify(parsed);
                      }
                    } catch {
                      // ignore parse errors
                    }
                    return value;
                  })();

                  return (
                    <Grid key={key} size={12}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 140 }}>
                          {key}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: isMonospace ? 'monospace' : 'inherit',
                            wordBreak: 'break-all',
                            bgcolor: isMonospace ? 'grey.100' : 'transparent',
                            p: isMonospace ? 1 : 0,
                            borderRadius: 1,
                          }}
                        >
                          {displayValue}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })()}
      </Box>
    </FormSectionAccordion>
  );
};

export default PaymentInfoSection;
