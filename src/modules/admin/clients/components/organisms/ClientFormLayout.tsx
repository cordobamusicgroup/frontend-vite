const AccordionTitle = ({ icon, text }: { icon: React.ReactElement; text: string }) => (
  <Box display="flex" alignItems="center">
    {icon}
    <Typography variant="subtitle1" sx={{ fontSize: '16px', ml: 1 }}>
      {text}
    </Typography>
  </Box>
);
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import DnsIcon from '@mui/icons-material/Dns';
import ClientDetailsForm from '../molecules/ClientDetailsForm';
import AddressDetailsForm from '../molecules/AddressDetailsForm';
import ContractDetailsForm from '../molecules/ContractDetailsForm';
import DmbDetailsForm from '../molecules/DmbDetailsForm';

const ClientFormLayout: React.FC = () => {
  return (
    <>
      <Accordion defaultExpanded={true} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTitle icon={<PersonIcon sx={{ color: 'primary.main' }} />} text="Personal Details" />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <ClientDetailsForm />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTitle icon={<HomeIcon sx={{ color: 'primary.main' }} />} text="Address" />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <AddressDetailsForm />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTitle icon={<DescriptionIcon sx={{ color: 'secondary.main' }} />} text="Contract Details" />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <ContractDetailsForm />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false} sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTitle icon={<DnsIcon sx={{ color: 'secondary.main' }} />} text="DMB Data" />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <DmbDetailsForm />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ClientFormLayout;
