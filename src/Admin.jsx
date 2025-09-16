import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import './Admin.css';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    sponsor: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is admin (you can modify this to check for specific user ID or email)
  const isAdmin = user && (user.email === 'onuoraprecious@gmail.com' || user._id === 'admin-user-id');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/events' : 'http://localhost:5001/api/events';
      
      const response = await fetch(`${apiUrl}/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxParticipants: parseInt(formData.maxParticipants),
          currentParticipants: 0,
          isUpcoming: true
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          maxParticipants: '',
          sponsor: ''
        });
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Admin Access Required</h1>
          <p>Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Access Denied</h1>
          <p>You do not have admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Panel - Add New Event</h1>
        
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Bowling Night"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the event..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Fountain Park, Dundee St, Edinburgh EH11 1AW"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxParticipants">Max Participants *</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                min="1"
                placeholder="30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sponsor">Sponsor</label>
              <input
                type="text"
                id="sponsor"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                placeholder="e.g., Diageo"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
