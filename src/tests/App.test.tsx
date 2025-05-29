import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock Tauri API
const mockInvoke = jest.fn();
jest.mock('@tauri-apps/api/core', () => ({
  invoke: mockInvoke,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Tix App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  });

  test('renders login form when not authenticated', () => {
    render(<App />);
    
    expect(screen.getByText('Tix')).toBeInTheDocument();
    expect(screen.getByText('Ticket Management System')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    mockInvoke.mockRejectedValueOnce('Invalid credentials');
    
    render(<App />);
    
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('successful login shows main application', async () => {
    const mockUser = {
      id: '1',
      username: 'admin',
      password_hash: '',
      created_at: '2024-01-01T00:00:00Z',
    };

    const mockTickets = [
      {
        id: '1',
        category: 'Bug',
        title: 'Test ticket',
        description: 'Test description',
        created_date: '2024-01-01T00:00:00Z',
        assignee: 'admin',
        reporter: 'user1',
        status: 'Open',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    mockInvoke
      .mockResolvedValueOnce(mockUser) // login
      .mockResolvedValueOnce(mockTickets); // get_tickets

    render(<App />);
    
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Tix - Ticket Management System')).toBeInTheDocument();
      expect(screen.getByText('Welcome, admin')).toBeInTheDocument();
      expect(screen.getByText('Tickets')).toBeInTheDocument();
    });
  });

  test('remembers user when remember me is checked', async () => {
    const mockUser = {
      id: '1',
      username: 'admin',
      password_hash: '',
      created_at: '2024-01-01T00:00:00Z',
    };

    mockInvoke.mockResolvedValueOnce(mockUser);

    render(<App />);
    
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByLabelText('Remember me'));
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tix_user',
        JSON.stringify(mockUser)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tix_remember_me',
        'true'
      );
    });
  });
});
