'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthSession } from '@/types';

interface Permission {
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
}

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  permissions: Permission[];
  availableResources: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (resource: string, action: string) => boolean;
  hasAccess: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [availableResources, setAvailableResources] = useState<string[]>([]);

  // Fetch RBAC data
  const fetchRBACData = async () => {
    try {
      const response = await fetch('/api/auth/rbac', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions);
        setAvailableResources(data.availableResources);
      }
    } catch (error) {
      console.error('Error fetching RBAC data:', error);
    }
  };

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSession(data);
          // Fetch RBAC data after session is verified
          await fetchRBACData();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setSession({
      userId: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role,
      permissions: [],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    });

    // Fetch RBAC data after login
    await fetchRBACData();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setSession(null);
    setPermissions([]);
    setAvailableResources([]);
  };

  const checkPermission = (resource: string, action: string): boolean => {
    return permissions.some(
      (perm) => perm.resource === resource && perm.action === action
    );
  };

  const hasAccess = (resource: string): boolean => {
    return availableResources.includes(resource);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isAuthenticated: !!session,
        permissions,
        availableResources,
        login,
        logout,
        checkPermission,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
