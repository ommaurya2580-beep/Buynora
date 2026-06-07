import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { loginUser, logoutUser } from '../../../redux/authSlice';
import { TokenManager } from '../services/tokenManager';
import { UserProfile } from '../../../types';
import { UserRole } from '../../../constants';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile, token: string) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const login = useCallback((userData: UserProfile, token: string) => {
    TokenManager.setAccessToken(token);
    dispatch(loginUser(userData));
  }, [dispatch]);

  const logout = useCallback(() => {
    TokenManager.clearAll();
    dispatch(logoutUser());
  }, [dispatch]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole
  }), [user, login, logout, hasRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
