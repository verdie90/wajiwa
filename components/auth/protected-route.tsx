'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  resource: string;
  action?: 'read' | 'create' | 'update' | 'delete';
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  resource,
  action = 'read',
  fallback,
}: ProtectedRouteProps) {
  const { loading, isAuthenticated, checkPermission } = useAuth();
  const router = useRouter();

  // Loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  // Check permissions
  const hasPermission = checkPermission(resource, action);

  if (!hasPermission) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">
              You don&apos;t have permission to access this resource.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
