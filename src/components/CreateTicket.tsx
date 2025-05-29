import React, { useState } from 'react';
import { ticketsApi } from '../services/api';
import { CreateTicketRequest, TICKET_CATEGORIES, User } from '../types';

interface CreateTicketProps {
  onClose: () => void;
  onCreate: () => void;
  currentUser: User;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ onClose, onCreate, currentUser }) => {
  const [formData, setFormData] = useState<CreateTicketRequest>({
    category: 'Bug',
    title: '',
    description: '',
    assignee: '',
    reporter: currentUser.username,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.assignee.trim()) {
      setError('Assignee is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await ticketsApi.create(formData);
      onCreate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateTicketRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="create-ticket-overlay">
      <div className="create-ticket-container">
        <div className="create-ticket-header">
          <h2>Create New Ticket</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-ticket-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="form-select"
              required
            >
              {TICKET_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter ticket title"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignee">Assignee *</label>
            <input
              id="assignee"
              type="text"
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder="Enter assignee username"
              className="form-input"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reporter">Reporter</label>
            <input
              id="reporter"
              type="text"
              value={formData.reporter}
              className="form-input"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter detailed description of the ticket"
              className="form-textarea"
              rows={6}
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="create-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
