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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      name: 'Summer Promotion',
      status: 'running',
      messagesSent: 1234,
      successRate: 94.2,
      createdDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Product Launch',
      status: 'scheduled',
      messagesSent: 0,
      successRate: 0,
      createdDate: '2024-01-20',
    },
    {
      id: 3,
      name: 'Q1 Newsletter',
      status: 'completed',
      messagesSent: 5678,
      successRate: 89.5,
      createdDate: '2024-01-10',
    },
  ];

  const templates = [
    { id: 1, name: 'Order Confirmation', type: 'Official' },
    { id: 2, name: 'Delivery Update', type: 'Official' },
    { id: 3, name: 'Promotional Offer', type: 'Custom' },
    { id: 4, name: 'Survey Request', type: 'Custom' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-2">Create and manage your WhatsApp campaigns</p>
          </div>
          <Button>New Campaign</Button>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Running Campaigns</CardTitle>
                <CardDescription>Manage your active and scheduled campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Messages Sent</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campaign.status === 'running'
                                  ? 'default'
                                  : campaign.status === 'scheduled'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.messagesSent.toLocaleString()}</TableCell>
                          <TableCell>{campaign.successRate}%</TableCell>
                          <TableCell>{campaign.createdDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Analytics</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Cancel
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
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Templates</CardTitle>
                <CardDescription>Official and custom templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <Badge className="mt-2" variant={template.type === 'Official' ? 'default' : 'secondary'}>
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Analytics</CardTitle>
                <CardDescription>Overview of all campaign metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Messages</p>
                    <p className="text-2xl font-bold text-blue-900">6,912</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Success Rate</p>
                    <p className="text-2xl font-bold text-green-900">91.8%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-purple-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
