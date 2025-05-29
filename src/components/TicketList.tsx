import React, { useState, useEffect, useMemo } from 'react';
import { ticketsApi } from '../services/api';
import { Ticket, TicketFilters, TicketSort, TICKET_STATUSES, TICKET_CATEGORIES } from '../types';

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  onCreateTicket: () => void;
  refreshTrigger: number;
}

const TicketList: React.FC<TicketListProps> = ({ 
  onTicketSelect, 
  onCreateTicket, 
  refreshTrigger 
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TicketFilters>({});
  const [sort, setSort] = useState<TicketSort>({ field: 'created_date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTickets();
  }, [refreshTrigger]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const ticketsData = await ticketsApi.getAll();
      setTickets(ticketsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!ticket.title.toLowerCase().includes(searchLower) &&
            !ticket.description.toLowerCase().includes(searchLower) &&
            !ticket.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && ticket.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      // Assignee filter
      if (filters.assignee && ticket.assignee !== filters.assignee) {
        return false;
      }

      // Reporter filter
      if (filters.reporter && ticket.reporter !== filters.reporter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [tickets, filters, sort, searchTerm]);

  const handleSort = (field: keyof Ticket) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      case 'resolved': return 'status-resolved';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h2>Tickets</h2>
        <button className="create-button" onClick={onCreateTicket}>
          Create Ticket
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {TICKET_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {TICKET_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ticket-table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('category')} className="sortable">
                Category {sort.field === 'category' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('title')} className="sortable">
                Title {sort.field === 'title' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('created_date')} className="sortable">
                Created {sort.field === 'created_date' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('assignee')} className="sortable">
                Assignee {sort.field === 'assignee' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('reporter')} className="sortable">
                Reporter {sort.field === 'reporter' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sort.field === 'status' && (sort.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTickets.map(ticket => (
              <tr 
                key={ticket.id} 
                onClick={() => onTicketSelect(ticket)}
                className="ticket-row"
              >
                <td className="category-cell">
                  <span className={`category-badge category-${ticket.category.toLowerCase()}`}>
                    {ticket.category}
                  </span>
                </td>
                <td className="title-cell">{ticket.title}</td>
                <td className="date-cell">{formatDate(ticket.created_date)}</td>
                <td className="assignee-cell">{ticket.assignee}</td>
                <td className="reporter-cell">{ticket.reporter}</td>
                <td className="status-cell">
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedTickets.length === 0 && (
          <div className="no-tickets">
            {searchTerm || Object.keys(filters).length > 0 
              ? 'No tickets match your filters' 
              : 'No tickets found'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
