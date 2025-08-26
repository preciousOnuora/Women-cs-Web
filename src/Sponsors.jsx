import React from 'react';
import athenaLogo from './Images/athena.png';
import diageoLogo from './Images/diageoLogo.png';
import hwuLogo from './Images/hwu.png';

const Sponsors = () => {
  return (
    <div className="sponsors-page">
      <div className="sponsors-container">
        <h1 className="page-title2">Our Sponsors</h1>
        
        <div className="sponsors-content">
          <div className="sponsors-intro">
            <h2>Supporting Women in Computer Science</h2>
            <p>We're grateful for the generous support of our sponsors who help make our events and programs possible. Their commitment to diversity and inclusion in technology helps us create opportunities for women to thrive in Computer Science.</p>
          </div>
          
          <div className="sponsors-grid">
            <div className="sponsor-card">
              <div className="sponsor-logo">
                <img src={diageoLogo} alt="Diageo Logo" />
              </div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">24 hr Hackathon 2025</div>
            </div>
            
            <div className="sponsor-card">
              <div className="sponsor-logo">
                <img src={athenaLogo} alt="Athena SWAN Logo" />
              </div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">Social Events</div>
            </div>
            
            <div className="sponsor-card">
              <div className="sponsor-logo">
                <img src={hwuLogo} alt="Heriot-Watt University Logo" />
              </div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">Host</div>
            </div>
            
            <div className="sponsor-card">
              <div className="sponsor-logo empty"></div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">COMING SOON</div>
            </div>
            
            <div className="sponsor-card">
              <div className="sponsor-logo empty"></div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">COMING SOON</div>
            </div>
            
            <div className="sponsor-card">
              <div className="sponsor-logo empty"></div>
              <div className="sponsor-divider"></div>
              <div className="sponsor-description">COMING SOON</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
