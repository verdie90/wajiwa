import { useCallback } from 'react';

export interface Permission {
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
}

export interface RBACRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export function useRBAC() {
  const checkPermission = useCallback(
    (permissions: Permission[], resource: string, action: string): boolean => {
      return permissions.some(
        (perm) => perm.resource === resource && perm.action === action
      );
    },
    []
  );

  const hasAccess = useCallback(
    (permissions: Permission[], resource: string, action?: string): boolean => {
      if (!action) {
        return permissions.some((perm) => perm.resource === resource);
      }
      return checkPermission(permissions, resource, action);
    },
    [checkPermission]
  );

  const canRead = useCallback(
    (permissions: Permission[], resource: string): boolean => {
      return checkPermission(permissions, resource, 'read');
    },
    [checkPermission]
  );

  const canCreate = useCallback(
    (permissions: Permission[], resource: string): boolean => {
      return checkPermission(permissions, resource, 'create');
    },
    [checkPermission]
  );

  const canUpdate = useCallback(
    (permissions: Permission[], resource: string): boolean => {
      return checkPermission(permissions, resource, 'update');
    },
    [checkPermission]
  );

  const canDelete = useCallback(
    (permissions: Permission[], resource: string): boolean => {
      return checkPermission(permissions, resource, 'delete');
    },
    [checkPermission]
  );

  return {
    checkPermission,
    hasAccess,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
  };
}
