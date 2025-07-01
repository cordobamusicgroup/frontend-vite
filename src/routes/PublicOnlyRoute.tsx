import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;
  return <>{children}</>;
};

export default PublicOnlyRoute;
