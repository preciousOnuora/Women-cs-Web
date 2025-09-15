import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?._id || user?.id;
  
  const fetchUserEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching events for user ID:', userId);
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/events' : 'http://localhost:5001/api/events';
      const response = await fetch(`${apiUrl}?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setUserEvents(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
      setError('Error loading your events');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserEvents();
    }
  }, [isAuthenticated, user, fetchUserEvents]);

  const handleUnregisterEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/events' : 'http://localhost:5001/api/events';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'unregister',
          eventId: eventId,
          userId: userId
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Remove the event from the list
        setUserEvents(prev => prev.filter(event => event._id !== eventId));
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
      setError('Error unregistering from event');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1 className="page-title">Access Denied</h1>
          <p>Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1 className="page-title">My Dashboard</h1>
        
        <div className="dashboard-content">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="profile-info">
                  <h2>{user?.firstName} {user?.lastName}</h2>
                  <p className="profile-email">{user?.email}</p>
                  <p className="profile-status">
                    {user?.studentStatus === 'current' && 'Current Student'}
                    {user?.studentStatus === 'recent' && 'Recent Graduate'}
                    {user?.studentStatus === 'prospective' && 'Prospective Student'}
                    {user?.studentStatus === 'other' && 'Other'}
                  </p>
                  {user?.university && (
                    <p className="profile-university">{user.university}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="events-section">
            <div className="events-card">
              <div className="events-header">
                <h3>My Registered Events</h3>
                <span className="event-count">{userEvents.length} events</span>
              </div>

              {loading ? (
                <div className="loading">Loading your events...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : userEvents.length === 0 ? (
                <div className="no-events">
                  <p>You haven't registered for any events yet.</p>
                  <a href="/events" className="browse-events-btn">
                    Browse Events
                  </a>
                </div>
              ) : (
                <div className="events-list">
                  {userEvents.map((event) => (
                    <div key={event._id} className="event-item">
                      <div className="event-info">
                        <h4>{event.title}</h4>
                        <p className="event-date">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="event-time">{event.time}</p>
                        <p className="event-location">{event.location}</p>
                        <p className="event-description">{event.description}</p>
                      </div>
                      <div className="event-actions">
                        <button 
                          className="unregister-btn"
                          onClick={() => handleUnregisterEvent(event._id)}
                        >
                          Unregister
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <a href="/events" className="action-btn">
                  <span className="action-icon">📅</span>
                  Browse Events
                </a>
                <a href="/feedback" className="action-btn">
                  <span className="action-icon">💬</span>
                  Give Feedback
                </a>
                <a href="/contact" className="action-btn">
                  <span className="action-icon">📧</span>
                  Contact Us
                </a>
                <a href="/gallery" className="action-btn">
                  <span className="action-icon">📸</span>
                  View Gallery
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
