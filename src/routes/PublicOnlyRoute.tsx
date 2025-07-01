import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAccessTokenFromCookie } from '@/lib/cookies.util';

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!getAccessTokenFromCookie();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/backoffice/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;
  return <>{children}</>;
};

export default PublicOnlyRoute;
