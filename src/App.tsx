import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import CreateTicket from './components/CreateTicket';
import { storageApi } from './services/api';
import { User, Ticket, AuthState } from './types';
import './App.css';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    rememberMe: false,
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check for saved authentication state
    const { user, rememberMe } = storageApi.getAuthState();
    if (user) {
      setAuthState({
        isAuthenticated: true,
        user,
        rememberMe,
      });
    }
  }, []);

  const handleLogin = (user: User, rememberMe: boolean) => {
    setAuthState({
      isAuthenticated: true,
      user,
      rememberMe,
    });
  };

  const handleLogout = () => {
    storageApi.clearAuthState();
    setAuthState({
      isAuthenticated: false,
      user: null,
      rememberMe: false,
    });
    setSelectedTicket(null);
    setShowCreateTicket(false);
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicketDetail = () => {
    setSelectedTicket(null);
  };

  const handleShowCreateTicket = () => {
    setShowCreateTicket(true);
  };

  const handleCloseCreateTicket = () => {
    setShowCreateTicket(false);
  };

  const handleTicketUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedTicket(null);
  };

  const handleTicketCreate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!authState.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Tix - Ticket Management System</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {authState.user?.username}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TicketList
          onTicketSelect={handleTicketSelect}
          onCreateTicket={handleShowCreateTicket}
          refreshTrigger={refreshTrigger}
        />
      </main>

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={handleCloseTicketDetail}
          onUpdate={handleTicketUpdate}
        />
      )}

      {showCreateTicket && authState.user && (
        <CreateTicket
          onClose={handleCloseCreateTicket}
          onCreate={handleTicketCreate}
          currentUser={authState.user}
        />
      )}
    </div>
  );
}

export default App;
