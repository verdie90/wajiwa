'use client';

import { ReactNode } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="px-4 md:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
