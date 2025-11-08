'use client';

import { useAuth } from '@/components/auth/auth-context';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth/login');
    }
  }, [session, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.name}!</h1>
          <p className="text-gray-600 mt-2">Here&apos;s what&apos;s happening with your WhatsApp Business Suite.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Accounts"
            value="3"
            description="WhatsApp accounts connected"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Messages Sent"
            value="1,234"
            description="Last 30 days"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Active Campaigns"
            value="5"
            description="Running campaigns"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="CRM Contacts"
            value="892"
            description="Total contacts"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionButton href="/dashboard/whatsapp" label="Connect WhatsApp" />
              <QuickActionButton href="/dashboard/campaigns" label="Create Campaign" />
              <QuickActionButton href="/dashboard/crm" label="Add Contact" />
              <QuickActionButton href="/dashboard/ai-agents" label="Setup AI Agent" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <InfoRow label="Email" value={session.email} />
              <InfoRow label="Role" value={session.role.toUpperCase()} />
              <InfoRow label="Status" value="Active" />
              <InfoRow label="Last Login" value={new Date().toLocaleDateString()} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  description,
  bgColor,
}: {
  title: string;
  value: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className={bgColor}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      {label}
    </a>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
