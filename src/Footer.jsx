import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Women in Computer Science</h3>
          <p>Empowering women to pursue careers in technology and computer science through mentorship, networking, and educational opportunities.</p>
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/sponsors">Sponsors</a></li>
            <li><a href="/feedback">Feedback</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i>womenincs.hw@gmail.com</p>
            <p><i className="fas fa-phone"></i> (555) 123-4567</p>
            <p><i className="fas fa-map-marker-alt"></i> 123 Tech Street, CS City, ST 12345</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
