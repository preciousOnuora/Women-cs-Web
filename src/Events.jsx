/**
 * Events Component
 * 
 * This component displays both upcoming and past events for the Women@CS website.
 * It fetches event data from the backend API and provides registration functionality.
 * 
 * Features:
 * - Displays upcoming events with registration capability
 * - Shows past events with event history
 * - Handles loading states and error messages
 * - Responsive design with consistent styling
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import './Events.css';
import diageoLogo from './Images/diageoLogo.png';
import athenaLogo from './Images/athena.png';

const Events = () => {
  // Authentication context for user login status
  const { isAuthenticated, user } = useAuth();
  
  // State management for events data and UI
  const [events, setEvents] = useState([]);           // Array of events from API
  const [loading, setLoading] = useState(true);       // Loading state for API calls
  const [error, setError] = useState('');             // Error messages
  const [registering, setRegistering] = useState({}); // Registration status per event

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Fetch events from the backend API
   * Uses different URLs for production vs development environments
   * Handles errors and updates loading state
   */
  const fetchEvents = async () => {
    try {
      // Use relative URL for production, full URL for development
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/events' : 'http://localhost:5001/api/events';
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.success) {
        setEvents(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle event registration
   * Checks authentication, sends registration request to API
   * Updates UI state and refreshes events data
   * @param {string} eventId - The ID of the event to register for
   */
  const handleRegister = async (eventId) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert('Please sign in to register for events');
      return;
    }

    // Check if user ID is available
    console.log('User object:', user);
    console.log('User ID field:', user._id || user.id);
    
    const userId = user._id || user.id;
    if (!userId) {
      console.error('User ID not available:', user);
      alert('User information not available. Please try signing in again.');
      return;
    }

    // Set loading state for this specific event
    setRegistering(prev => ({ ...prev, [eventId]: true }));

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      
      // Use appropriate API URL based on environment
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/events' : 'http://localhost:5001/api/events';
      
      console.log('Registering for event:', eventId, 'with user:', userId);
      
      // Send registration request to API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          eventId,
          userId: userId 
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Successfully registered for the event!');
        // Refresh events to update participant count
        fetchEvents();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event. Please try again.');
    } finally {
      // Clear loading state for this event
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
  };

  /**
   * Format date string for display
   * Converts ISO date string to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Check if an event is upcoming (future date)
   * @param {string} dateString - ISO date string
   * @returns {boolean} True if event is in the future
   */
  const isEventUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  };

  // Filter events into upcoming and past categories
  const upcomingEvents = events.filter(event => isEventUpcoming(event.date));
  // const pastEvents = events.filter(event => !isEventUpcoming(event.date));

  return (
    <div className="events-page">
      <div className="events-container">
        {/* Upcoming Events Section */}
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className="no-events">
              <p>No upcoming events scheduled. Check back soon!</p>
            </div>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-participants">
                      {event.currentParticipants}/{event.maxParticipants} registered
                    </div>
                  </div>
                  
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="event-detail">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(event.date)}</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{event.time}</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{event.location}</span>
                    </div>
                    <div className="event-detail">
                      <span className="detail-label">Sponsor:</span>
                      <span className="detail-value">To be announced</span>
                    </div>
                  </div>
                  
                  <button 
                    className={`register-btn ${event.currentParticipants >= event.maxParticipants ? 'full' : ''}`}
                    onClick={() => handleRegister(event._id)}
                    disabled={registering[event._id] || event.currentParticipants >= event.maxParticipants}
                  >
                    {registering[event._id] ? 'Registering...' : 
                     event.currentParticipants >= event.maxParticipants ? 'Event Full' : 
                     'Register for Event'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events Section */}
        <section className="events-section">
          <h2 className="section-title">Past Events</h2>
          
          {/* Hackathon Event - 2025 */}
          <div className="past-event-card">
            <div className="event-main-content">
              <div className="event-header">
                <h1 className="event-name">24HR HACKATHON</h1>
                <img src={diageoLogo} alt="Diageo Logo" className="sponsor-logo" />
              </div>

              <p className="event-description">
                Work in <span className="highlight">Teams of 5</span> to collaborate code, and innovate! 
                This event features inspiring talks on career journeys, networking opportunities with 
                <span className="highlight"> industry professionals</span>, and the chance to win 
                <span className="highlight"> prizes</span>. Fuel your creativity with 
                <span className="highlight"> free pizza</span> and showcase your skills in this 
                unmissable coding adventure!
              </p>

              <div className="event-details">
                <div className="location">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">Heriot-Watt Campus, Robotarium</span>
                </div>
                <div className="datetime">
                  <span className="detail-label">Date & Time:</span>
                  <span className="detail-value">7TH FEB 2025 10:30AM - 8TH FEB 2025 10:30AM</span>
                </div>
                <div className="sponsor">
                  <span className="detail-label">Sponsored by:</span>
                  <span className="detail-value">Diageo</span>
                </div>
              </div>

              {/* Event Passed Message */}
              <div className="event-passed-message">
                <h3 className="passed-title">Event Passed</h3>
                <p className="passed-text">This event has already taken place. Stay tuned for future events!</p>
              </div>
            </div>
          </div>

          {/* Edinburgh Zoo Event - 2024 */}
          <div className="past-event-card">
            <div className="event-main-content">
              <div className="event-header">
                <h1 className="event-name">EDINBURGH ZOO</h1>
                <img src={athenaLogo} alt="Athena SWAN Logo" className="sponsor-logo" />
              </div>

              <p className="event-description">
                Join us for our <span className="highlight">first ever event</span> - a <span className="highlight">fantastic day out</span> at Edinburgh Zoo, generously sponsored by 
                <span className="highlight"> Athena SWAN</span>! Taking place during reading week, this is the perfect 
                opportunity to <span className="highlight">join our group</span> and start building our community. You'll enjoy 
                exploring the zoo's diverse wildlife, learning about conservation efforts, and building stronger 
                connections with fellow <span className="highlight">Women@CS</span> members in a relaxed, social setting. 
                This will be a <span className="highlight">wonderful way to launch</span> our group and set the foundation for future events!
              </p>

              <div className="event-details">
                <div className="location">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">Edinburgh Zoo</span>
                </div>
                <div className="datetime">
                  <span className="detail-label">Date & Time:</span>
                  <span className="detail-value">16TH OCT 2024 12:00PM</span>
                </div>
                <div className="sponsor">
                  <span className="detail-label">Sponsored by:</span>
                  <span className="detail-value">Athena SWAN</span>
                </div>
              </div>

              {/* Event Passed Message */}
              <div className="event-passed-message">
                <h3 className="passed-title">Event Passed</h3>
                <p className="passed-text">This event has already taken place. Stay tuned for future events!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;
