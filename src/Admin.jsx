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
  const [events, setEvents] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Check if user is admin (you can modify this to check for specific user ID or email)
  const isAdmin = user && (user.email === 'onuoraprecious@gmail.com' || user._id === '68c2d1c906745ea4203f5272');

  // Fetch events on component mount
  React.useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin]);

  const fetchEvents = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? '/api/events' : '/api/events';
      const response = await fetch(baseUrl);
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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
      // For now, simulate successful event creation
      // In a real app, this would call the API
      const newEvent = {
        _id: `admin_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        location: formData.location,
        maxParticipants: parseInt(formData.maxParticipants),
        currentParticipants: 0,
        isUpcoming: true,
        sponsor: formData.sponsor || 'To be announced'
      };

      // Add to local events list
      setEvents(prev => [...prev, newEvent]);

      setMessage('Event created successfully! (Note: This is a demo - event added locally)');
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        sponsor: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      setLoading(true);
      
      // For now, simulate successful event deletion
      // In a real app, this would call the API
      setEvents(prev => prev.filter(event => event._id !== eventToDelete._id));
      
      setMessage('Event deleted successfully! (Note: This is a demo - event removed locally)');
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Error deleting event. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setEventToDelete(null);
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

        {/* Events List */}
        <div className="events-list">
          <h2>Manage Events</h2>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Participants:</strong> {event.currentParticipants || 0}/{event.maxParticipants}</p>
                  <button 
                    onClick={() => handleDeleteClick(event)}
                    className="delete-btn"
                    disabled={loading}
                  >
                    Delete Event
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete the event "{eventToDelete?.title}"?</p>
              <p>This action cannot be undone.</p>
              <div className="modal-buttons">
                <button 
                  onClick={handleDeleteCancel}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="confirm-delete-btn"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Event'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
