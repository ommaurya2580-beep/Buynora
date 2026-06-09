import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { ROUTES } from '../../constants';

interface CustomerRouteProps {
  children: React.ReactNode;
}

export const CustomerRoute: React.FC<CustomerRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (user?.role === 'SELLER') {
    return <Navigate to="/seller" replace />;
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role !== 'CUSTOMER') {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
