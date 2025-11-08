'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeamPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage team members and their roles</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Users in your organization</CardDescription>
            </div>
            <Button>Invite Member</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MemberItem
                name="Admin User"
                email="admin@wajiwa.com"
                role="admin"
                joinDate="2024-01-01"
              />
              <MemberItem
                name="Manager User"
                email="manager@wajiwa.com"
                role="manager"
                joinDate="2024-01-05"
              />
              <MemberItem
                name="Agent User"
                email="agent@wajiwa.com"
                role="agent"
                joinDate="2024-01-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Configure role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RoleCard
                name="Admin"
                permissions={['Full access', 'Manage users', 'Configure settings']}
              />
              <RoleCard
                name="Manager"
                permissions={['View all data', 'Create campaigns', 'Manage team']}
              />
              <RoleCard
                name="Agent"
                permissions={['Send messages', 'View contacts', 'Create leads']}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function MemberItem({
  name,
  email,
  role,
  joinDate,
}: {
  name: string;
  email: string;
  role: string;
  joinDate: string;
}) {
  const roleColor = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    agent: 'bg-green-100 text-green-800',
  }[role] || 'bg-gray-100 text-gray-800';

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{email}</p>
        <p className="text-xs text-gray-400 mt-1">Joined: {joinDate}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-sm rounded-full capitalize ${roleColor}`}>
          {role}
        </span>
        <Button variant="outline" size="sm">Edit</Button>
      </div>
    </div>
  );
}

function RoleCard({
  name,
  permissions,
}: {
  name: string;
  permissions: string[];
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-3">{name}</h3>
      <ul className="space-y-2">
        {permissions.map((perm, idx) => (
          <li key={idx} className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            {perm}
          </li>
        ))}
      </ul>
    </div>
  );
}
