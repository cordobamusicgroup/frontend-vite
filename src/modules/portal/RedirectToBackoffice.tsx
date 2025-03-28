import FullScreenLoader from '@/components/ui/molecules/FullScreenLoader';
import SkeletonLoader from '@/components/ui/molecules/SkeletonLoader';
import { Navigate, useNavigation } from 'react-router';

export default function RedirectToBackoffice() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return isNavigating ? <FullScreenLoader open /> : <Navigate to="/backoffice" replace />;
}
