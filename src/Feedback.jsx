import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    studentStatus: '',
    eventParticipation: '',
    overallExperience: '',
    technicalSkills: '',
    networkingValue: '',
    suggestions: '',
    rating: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Thank you for your feedback! We appreciate your input.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          university: '',
          studentStatus: '',
          eventParticipation: '',
          overallExperience: '',
          technicalSkills: '',
          networkingValue: '',
          suggestions: '',
          rating: 5
        });
      } else {
        alert('Error submitting feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <h1 className="page-title">Help Us Learn & Improve</h1>
        
        <div className="feedback-content">
          <div className="feedback-intro">
            <h2>Your Feedback Matters!</h2>
            <p>We're committed to creating the best possible experience for our members. Your feedback helps us understand what's working well and where we can improve. Please take a moment to share your thoughts with us.</p>
          </div>
          
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="university">University/Institution</label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Enter your university or institution name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="studentStatus">Are you a student? *</label>
                <select
                  id="studentStatus"
                  name="studentStatus"
                  value={formData.studentStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="current">Current Student</option>
                  <option value="recent">Recent Graduate</option>
                  <option value="prospective">Prospective Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Event Experience</h3>
              
              <div className="form-group">
                <label htmlFor="eventParticipation">Which events have you participated in?</label>
                <select
                  id="eventParticipation"
                  name="eventParticipation"
                  value={formData.eventParticipation}
                  onChange={handleChange}
                >
                  <option value="">Select events</option>
                  <option value="hackathon">24HR Hackathon</option>
                  <option value="workshops">Technical Workshops</option>
                  <option value="networking">Networking Events</option>
                  <option value="mentorship">Mentorship Programs</option>
                  <option value="multiple">Multiple Events</option>
                  <option value="none">Haven't attended yet</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="rating">Overall Rating *</label>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${star <= formData.rating ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">{formData.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Specific Feedback</h3>
              
              <div className="form-group">
                <label htmlFor="overallExperience">How would you describe your overall experience?</label>
                <textarea
                  id="overallExperience"
                  name="overallExperience"
                  value={formData.overallExperience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Share your overall experience with Women@CS..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="technicalSkills">How have our events helped develop your technical skills?</label>
                <textarea
                  id="technicalSkills"
                  name="technicalSkills"
                  value={formData.technicalSkills}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe how our events have contributed to your technical growth..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="networkingValue">What networking value have you gained?</label>
                <textarea
                  id="networkingValue"
                  name="networkingValue"
                  value={formData.networkingValue}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Share your networking experiences and connections made..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="suggestions">Suggestions for improvement</label>
                <textarea
                  id="suggestions"
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleChange}
                  rows="4"
                  placeholder="What would you like to see more of? Any specific improvements or new initiatives?"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit Feedback
              </button>
              <button type="button" className="reset-btn" onClick={() => setFormData({
                name: '',
                email: '',
                university: '',
                studentStatus: '',
                eventParticipation: '',
                overallExperience: '',
                technicalSkills: '',
                networkingValue: '',
                suggestions: '',
                rating: 5
              })}>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
