const mongoose = require('mongoose');
const cors = require('cors');

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

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
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
  } else if (req.method === 'GET') {
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
