import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate('/feedback');
  };

  return (
    <main className="main-content">
      <div className="hero-section">
        <h1 className="main-title">WOMEN@CS</h1>
        
        <div className="content-cards">
          <div className="event-card">
            <h2>Upcoming Event!</h2>
            <div className="countdown">
              <span className="time">12 DAYS 5HRS 3 MIN 3 SECS</span>
            </div>
          </div>
          
          <div className="feedback-card">
            <h3>Tell us How To Improve!</h3>
            <button className="help-btn" onClick={handleFeedbackClick}>Help us learn</button>
          </div>
        </div>
        
        <div className="bottom-section">
          <div className="chat-card">
            <h3>Join our Group Chat!</h3>
            <div className="qr-placeholder">
              <div className="qr-pattern"></div>
            </div>
          </div>
          
          <div className="description">
            <p>We are a <span className="highlight">student-led group</span> dedicated to supporting and <span className="highlight">empowering women</span>. Our mission is to foster a strong, inclusive community where members can build confidence in their technical skills, connect with like-minded peers, and <span className="highlight">gain industry insights</span>. We achieve this through a <span className="highlight">range of initiatives</span>, including mentorship programs, technical workshops, networking events, and hackathons.</p>
          </div>
        </div>
        
      </div>
    </main>
  );
};

export default Home;