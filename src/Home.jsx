import React from 'react';
import { useNavigate } from 'react-router-dom';
import qrCode from './Images/qrCode.jpeg';
import CountdownTimer from './components/CountdownTimer';
import { EVENT_CONFIG } from './config/eventConfig';

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
            <h2>{EVENT_CONFIG.eventName}</h2>
            <CountdownTimer />
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
              <img src={qrCode} alt="QR Code for Group Chat" className="qr-image" />
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