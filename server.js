const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  university: {
    type: String,
    trim: true
  },
  studentStatus: {
    type: String,
    required: true,
    enum: ['current', 'recent', 'prospective', 'other']
  },
  eventParticipation: {
    type: String,
    enum: ['hackathon', 'workshops', 'networking', 'mentorship', 'multiple', 'none', '']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  overallExperience: {
    type: String,
    trim: true
  },
  technicalSkills: {
    type: String,
    trim: true
  },
  networkingValue: {
    type: String,
    trim: true
  },
  suggestions: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// API Routes

// Feedback form submission
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback. Please try again.',
      error: error.message
    });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      data: contact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again.',
      error: error.message
    });
  }
});

// Get all feedback (for admin purposes)
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
});

// Get all contact messages (for admin purposes)
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages.',
      error: error.message
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
