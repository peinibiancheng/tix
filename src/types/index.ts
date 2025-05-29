// User types
export interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

// Ticket types
export interface Ticket {
  id: string;
  category: string;
  title: string;
  description: string;
  created_date: string;
  assignee: string;
  reporter: string;
  status: string;
  updated_at: string;
}

// Request types
export interface LoginRequest {
  username: string;
  password: string;
  remember_me: boolean;
}

export interface CreateTicketRequest {
  category: string;
  title: string;
  description: string;
  assignee: string;
  reporter: string;
}

export interface UpdateTicketRequest {
  id: string;
  status?: string;
  assignee?: string;
  category?: string;
  title?: string;
  description?: string;
}

// UI state types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  rememberMe: boolean;
}

export interface TicketFilters {
  category?: string;
  status?: string;
  assignee?: string;
  reporter?: string;
}

export interface TicketSort {
  field: keyof Ticket;
  direction: 'asc' | 'desc';
}

// Constants
export const TICKET_STATUSES = ['Open', 'In Progress', 'Closed', 'Resolved'] as const;
export const TICKET_CATEGORIES = ['Bug', 'Feature', 'Enhancement', 'Task', 'Support'] as const;

export type TicketStatus = typeof TICKET_STATUSES[number];
export type TicketCategory = typeof TICKET_CATEGORIES[number];
