import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router';

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;
  return <>{children}</>;
};

export default PublicOnlyRoute;
