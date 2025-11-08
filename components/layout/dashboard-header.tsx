'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function DashboardHeader() {
  const router = useRouter();
  const { session, logout, availableResources } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  // Define all available menu items
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', resource: 'dashboard' },
    { href: '/dashboard/whatsapp', label: 'WhatsApp', resource: 'whatsapp' },
    { href: '/dashboard/campaigns', label: 'Campaigns', resource: 'campaigns' },
    { href: '/dashboard/crm', label: 'CRM', resource: 'crm' },
    { href: '/dashboard/ai-agents', label: 'AI Agents', resource: 'ai-agents' },
    { href: '/dashboard/team', label: 'Team', resource: 'team', adminOnly: true },
    { href: '/dashboard/settings', label: 'Settings', resource: 'settings', adminOnly: true },
  ];

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return session?.role === 'admin';
    }
    return availableResources.includes(item.resource);
  });

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            W
          </div>
          <span className="text-xl font-bold text-gray-900">Wajiwa</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-600">{session?.email}</span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
              {session?.role}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <span className="hidden md:inline">Logout</span>
            <span className="md:hidden">✕</span>
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-gray-50 p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
