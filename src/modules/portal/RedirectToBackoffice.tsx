import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { Navigate, useNavigation } from 'react-router';

export default function RedirectToBackoffice() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return isNavigating ? <CenteredLoader open /> : <Navigate to="/backoffice" replace />;
}
