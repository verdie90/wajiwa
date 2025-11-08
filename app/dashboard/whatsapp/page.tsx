'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function WhatsAppPage() {
  const accounts = [
    {
      id: 1,
      name: 'Main Business Account',
      type: 'Cloud API',
      phone: '+62812345678',
      status: 'active',
      messagesMonth: '1,234',
    },
    {
      id: 2,
      name: 'Secondary Account',
      type: 'Web API',
      phone: '+62812345679',
      status: 'active',
      messagesMonth: '567',
    },
    {
      id: 3,
      name: 'Support Account',
      type: 'Cloud API',
      phone: '+62812345680',
      status: 'inactive',
      messagesMonth: '89',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Accounts</h1>
            <p className="text-gray-600 mt-2">Manage your WhatsApp Cloud API and Web API accounts</p>
          </div>
          <Button>Add Account</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Your WhatsApp accounts with messaging statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Messages (30d)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>{account.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            account.status === 'active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{account.messagesMonth}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Configure</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Webhooks</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Real-time conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No active conversations
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
