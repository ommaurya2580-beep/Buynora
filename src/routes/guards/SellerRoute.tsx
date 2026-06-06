import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { ROUTES } from '../../constants';

interface SellerRouteProps {
  children: React.ReactNode;
}

export const SellerRoute: React.FC<SellerRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (user?.role !== 'SELLER') {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
