import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { ROUTES } from '../../constants';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
