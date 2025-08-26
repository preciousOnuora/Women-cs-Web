import React from 'react';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="page-title">Contact Us</h1>
        
        <div className="contact-content">
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Whether you have questions about our events, want to get involved, or just want to say hello, feel free to reach out.</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <h3>📧 Email</h3>
                <p>info@womenatcs.org</p>
              </div>
              
              <div className="contact-method">
                <h3>📱 Social Media</h3>
                <p>Follow us on LinkedIn, Twitter, and Instagram</p>
              </div>
              
              <div className="contact-method">
                <h3>📍 Location</h3>
                <p>Heriot-Watt University, Edinburgh Campus</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email" />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="What's this about?" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Your message here..."></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
