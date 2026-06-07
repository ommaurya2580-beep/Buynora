import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { UserRole, ROLES } from '../../../constants';

type Permission = 'manage_products' | 'manage_orders' | 'manage_users' | 'manage_sellers' | 'manage_coupons' | 'view_analytics' | 'view_admin_stats';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.CUSTOMER]: [],
  [ROLES.SELLER]: ['manage_products', 'manage_orders', 'view_analytics'],
  [ROLES.ADMIN]: ['manage_products', 'manage_orders', 'manage_users', 'manage_sellers', 'manage_coupons', 'view_analytics', 'view_admin_stats'],
};

interface PermissionContextValue {
  canAccess: (requiredRole: UserRole) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const canAccess = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    return user.role === requiredRole;
  }, [user]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return user?.role === role;
  }, [user]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }, [user]);

  const value = useMemo(() => ({
    canAccess,
    hasRole,
    hasPermission
  }), [canAccess, hasRole, hasPermission]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextValue => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
