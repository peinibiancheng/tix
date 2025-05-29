import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../services/api';
import { Ticket, TICKET_STATUSES, TICKET_CATEGORIES } from '../types';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Ticket>(ticket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedTicket(ticket);
  }, [ticket]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      await ticketsApi.update({
        id: editedTicket.id,
        category: editedTicket.category !== ticket.category ? editedTicket.category : undefined,
        title: editedTicket.title !== ticket.title ? editedTicket.title : undefined,
        description: editedTicket.description !== ticket.description ? editedTicket.description : undefined,
        status: editedTicket.status !== ticket.status ? editedTicket.status : undefined,
        assignee: editedTicket.assignee !== ticket.assignee ? editedTicket.assignee : undefined,
      });

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTicket(ticket);
    setIsEditing(false);
    setError('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="ticket-detail-overlay">
      <div className="ticket-detail-container">
        <div className="ticket-detail-header">
          <h2>Ticket Details</h2>
          <div className="header-actions">
            {!isEditing && (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="ticket-detail-content">
          {error && <div className="error-message">{error}</div>}

          <div className="detail-section">
            <div className="detail-row">
              <label>Category:</label>
              {isEditing ? (
                <select
                  value={editedTicket.category}
                  onChange={(e) => setEditedTicket(prev => ({ ...prev, category: e.target.value }))}
                  className="edit-select"
                >
                  {TICKET_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              ) : (
                <span className={`category-badge category-${ticket.category.toLowerCase()}`}>
                  {ticket.category}
                </span>
              )}
            </div>

            <div className="detail-row">
              <label>Title:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTicket.title}
                  onChange={(e) => setEditedTicket(prev => ({ ...prev, title: e.target.value }))}
                  className="edit-input"
                />
              ) : (
                <span className="detail-value">{ticket.title}</span>
              )}
            </div>

            <div className="detail-row">
              <label>Status:</label>
              {isEditing ? (
                <select
                  value={editedTicket.status}
                  onChange={(e) => setEditedTicket(prev => ({ ...prev, status: e.target.value }))}
                  className="edit-select"
                >
                  {TICKET_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status}
                </span>
              )}
            </div>

            <div className="detail-row">
              <label>Assignee:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTicket.assignee}
                  onChange={(e) => setEditedTicket(prev => ({ ...prev, assignee: e.target.value }))}
                  className="edit-input"
                />
              ) : (
                <span className="detail-value">{ticket.assignee}</span>
              )}
            </div>

            <div className="detail-row">
              <label>Reporter:</label>
              <span className="detail-value">{ticket.reporter}</span>
            </div>

            <div className="detail-row">
              <label>Created:</label>
              <span className="detail-value">{formatDate(ticket.created_date)}</span>
            </div>

            <div className="detail-row">
              <label>Updated:</label>
              <span className="detail-value">{formatDate(ticket.updated_at)}</span>
            </div>
          </div>

          <div className="description-section">
            <label>Description:</label>
            {isEditing ? (
              <textarea
                value={editedTicket.description}
                onChange={(e) => setEditedTicket(prev => ({ ...prev, description: e.target.value }))}
                className="edit-textarea"
                rows={6}
              />
            ) : (
              <div className="description-content">
                {ticket.description}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button 
                className="save-button"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
