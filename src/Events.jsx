import React from 'react';
import './Events.css';
import diageoLogo from './Images/diageoLogo.png';
import athenaLogo from './Images/athena.png';

const Events = () => {
  return (
    <div className="events-page">
      <div className="events-container">
        {/* Upcoming Events Section */}
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="upcoming-event-card">
            <div className="event-content">
              <h3 className="event-title">Hackathon 2026</h3>
              <p className="event-status">Coming Soon</p>
            </div>
          </div>
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
                  <span className="detail-value">8TH FEB 2025 10:30AM - 9TH FEB 2025 10:30AM</span>
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
