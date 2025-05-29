import { invoke } from '@tauri-apps/api/core';
import { 
  User, 
  Ticket, 
  LoginRequest, 
  CreateTicketRequest, 
  UpdateTicketRequest 
} from '../types';

// Authentication API
export const authApi = {
  async login(request: LoginRequest): Promise<User> {
    try {
      const user = await invoke<User>('login', { request });
      return user;
    } catch (error) {
      throw new Error(error as string);
    }
  },
};

// Tickets API
export const ticketsApi = {
  async getAll(): Promise<Ticket[]> {
    try {
      const tickets = await invoke<Ticket[]>('get_tickets');
      return tickets;
    } catch (error) {
      throw new Error(error as string);
    }
  },

  async getById(ticketId: string): Promise<Ticket> {
    try {
      const ticket = await invoke<Ticket>('get_ticket_by_id', { ticketId });
      return ticket;
    } catch (error) {
      throw new Error(error as string);
    }
  },

  async create(request: CreateTicketRequest): Promise<Ticket> {
    try {
      const ticket = await invoke<Ticket>('create_ticket', { request });
      return ticket;
    } catch (error) {
      throw new Error(error as string);
    }
  },

  async update(request: UpdateTicketRequest): Promise<Ticket> {
    try {
      const ticket = await invoke<Ticket>('update_ticket', { request });
      return ticket;
    } catch (error) {
      throw new Error(error as string);
    }
  },
};

// Local storage utilities
export const storageApi = {
  saveAuthState(user: User, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('tix_user', JSON.stringify(user));
      localStorage.setItem('tix_remember_me', 'true');
    } else {
      sessionStorage.setItem('tix_user', JSON.stringify(user));
      localStorage.removeItem('tix_remember_me');
    }
  },

  getAuthState(): { user: User | null; rememberMe: boolean } {
    const rememberMe = localStorage.getItem('tix_remember_me') === 'true';
    
    let userStr: string | null = null;
    if (rememberMe) {
      userStr = localStorage.getItem('tix_user');
    } else {
      userStr = sessionStorage.getItem('tix_user');
    }

    const user = userStr ? JSON.parse(userStr) : null;
    return { user, rememberMe };
  },

  clearAuthState(): void {
    localStorage.removeItem('tix_user');
    localStorage.removeItem('tix_remember_me');
    sessionStorage.removeItem('tix_user');
  },
};
