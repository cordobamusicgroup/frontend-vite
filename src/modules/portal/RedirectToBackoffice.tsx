import CenteredLoader from '@/components/ui/molecules/CenteredLoader';
import { Navigate, useNavigation } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

export default function RedirectToBackoffice() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return isNavigating ? <CenteredLoader open /> : <Navigate to="/backoffice" replace />;
}
