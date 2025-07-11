import React from 'react';
import { useFormContext } from 'react-hook-form';

import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import DnsIcon from '@mui/icons-material/Dns';
import ClientDetailsForm from '../molecules/ClientDetailsForm';
import AddressDetailsForm from '../molecules/AddressDetailsForm';
import ContractDetailsForm from '../molecules/ContractDetailsForm';
import DmbDetailsForm from '../molecules/DmbDetailsForm';
import FormSectionAccordion from '@/components/ui/molecules/FormSectionAccordion';

// No props needed for errors

const ClientFormLayout: React.FC = () => {
  const { formState } = useFormContext();
  const errors = formState.errors;

  // Utilidad para mapear errores por sección
  const errorsBySection = {
    personalDetails: !!errors.client && Object.keys(errors.client).length > 0,
    address: !!errors.address && Object.keys(errors.address).length > 0,
    contractDetails: !!errors.contract && Object.keys(errors.contract).length > 0,
    dmbData: !!errors.dmb && Object.keys(errors.dmb).length > 0,
  };

  return (
    <>
      <FormSectionAccordion title="Personal Details" icon={<PersonIcon sx={{ color: 'primary.main' }} />} hasError={!!errorsBySection.personalDetails} defaultExpanded={true}>
        <ClientDetailsForm />
      </FormSectionAccordion>
      <FormSectionAccordion title="Address" icon={<HomeIcon sx={{ color: 'primary.main' }} />} hasError={!!errorsBySection.address}>
        <AddressDetailsForm />
      </FormSectionAccordion>
      <FormSectionAccordion title="Contract Details" icon={<DescriptionIcon sx={{ color: 'secondary.main' }} />} hasError={!!errorsBySection.contractDetails}>
        <ContractDetailsForm />
      </FormSectionAccordion>
      <FormSectionAccordion title="DMB Data" icon={<DnsIcon sx={{ color: 'secondary.main' }} />} hasError={!!errorsBySection.dmbData}>
        <DmbDetailsForm />
      </FormSectionAccordion>
    </>
  );
};

export default ClientFormLayout;
