'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AIAgentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-2">Create and manage intelligent chatbots</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Agents</CardTitle>
              <CardDescription>Your AI chatbots</CardDescription>
            </div>
            <Button>Create Agent</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AgentItem
                name="Customer Support Bot"
                model="GPT-3.5"
                status="active"
                interactions={1234}
              />
              <AgentItem
                name="Lead Qualifier"
                model="GPT-4"
                status="active"
                interactions={567}
              />
              <AgentItem
                name="FAQ Assistant"
                model="GPT-3.5"
                status="inactive"
                interactions={234}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Templates</CardTitle>
            <CardDescription>Pre-built agent templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TemplateCard
                name="Customer Support"
                description="Handle common customer inquiries"
              />
              <TemplateCard
                name="Sales Assistant"
                description="Qualify leads and guide sales"
              />
              <TemplateCard
                name="FAQ Bot"
                description="Answer frequently asked questions"
              />
              <TemplateCard
                name="Appointment Scheduler"
                description="Book and manage appointments"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function AgentItem({
  name,
  model,
  status,
  interactions,
}: {
  name: string;
  model: string;
  status: string;
  interactions: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">Model: {model}</p>
        <p className="text-xs text-gray-400 mt-1">{interactions.toLocaleString()} interactions</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-sm rounded-full ${
          status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <Button variant="outline" size="sm">Edit</Button>
      </div>
    </div>
  );
}

function TemplateCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      <h3 className="font-medium text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
      <Button variant="outline" size="sm" className="mt-4 w-full">
        Use Template
      </Button>
    </div>
  );
}
