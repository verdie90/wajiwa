export type UserRole = 'admin' | 'manager' | 'agent' | 'user';

export interface UserPermission {
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed password
  role: UserRole;
  permissions?: UserPermission[];
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  workspaceId?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermission[];
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface WhatsAppAccount {
  id: string;
  businessAccountId: string;
  phoneNumberId: string;
  accessToken: string;
  displayName: string;
  type: 'cloud' | 'web';
  status: 'active' | 'inactive';
  createdAt: Date;
  workspaceId: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'broadcast' | 'targeted' | 'automated';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  template?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  messageCount: number;
  successCount: number;
  failureCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsappPhone?: string;
  tags?: string[];
  labels?: string[];
  notes?: string;
  company?: string;
  lastMessageDate?: Date;
  lastInteraction?: Date;
  messageCount?: number;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  workspaceId?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  accountId: string;
  messages: Message[];
  status: 'open' | 'closed' | 'resolved';
  labels: string[];
  assignedTo?: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'template';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  isActive: boolean;
  triggers: string[];
  responses: Record<string, string>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  logo?: string;
  ownerId: string;
  members: string[];
  subscription?: Subscription;
  whatsappAccounts: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
