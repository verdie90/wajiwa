'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session && session.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your workspace and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>General workspace configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  type="text"
                  defaultValue="Wajiwa Admin"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="workspace-email">Contact Email</Label>
                <Input
                  id="workspace-email"
                  type="email"
                  defaultValue="admin@wajiwa.com"
                  className="mt-1"
                />
              </div>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API & Integrations</CardTitle>
            <CardDescription>Manage API keys and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <IntegrationItem
                name="WhatsApp Cloud API"
                status="connected"
                description="Official WhatsApp API integration"
              />
              <IntegrationItem
                name="Google Maps"
                status="connected"
                description="Lead generation and scraping"
              />
              <IntegrationItem
                name="Stripe"
                status="not_connected"
                description="Payment processing"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Professional Plan</h3>
                  <p className="text-sm text-gray-500">Renews on January 31, 2025</p>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Export</CardTitle>
            <CardDescription>Download your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Export Contacts
              </Button>
              <Button variant="outline" className="w-full">
                Export Conversations
              </Button>
              <Button variant="outline" className="w-full">
                Export Campaign Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function IntegrationItem({
  name,
  status,
  description,
}: {
  name: string;
  status: string;
  description: string;
}) {
  const statusColor =
    status === 'connected'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-sm rounded-full capitalize ${statusColor}`}>
          {status.replace('_', ' ')}
        </span>
        <Button variant="outline" size="sm">
          {status === 'connected' ? 'Configure' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}
