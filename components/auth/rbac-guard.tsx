'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-context';

interface RBACGuardProps {
  resource: string;
  action?: 'read' | 'create' | 'update' | 'delete';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component untuk menampilkan element hanya jika user memiliki permission
 * Berguna untuk menu items, buttons, dan sections yang conditional
 */
export function RBACGuard({
  resource,
  action = 'read',
  children,
  fallback = null,
}: RBACGuardProps) {
  const { checkPermission } = useAuth();

  const hasPermission = checkPermission(resource, action);

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
}

interface RBACVisibleProps {
  resource: string;
  children: ReactNode;
}

/**
 * Simpler version - hanya cek jika resource accessible
 */
export function RBACVisible({ resource, children }: RBACVisibleProps) {
  const { hasAccess } = useAuth();

  if (!hasAccess(resource)) {
    return null;
  }

  return <>{children}</>;
}
