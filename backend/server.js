const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VERCEL:', process.env.VERCEL);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('- MONGODB_URI value:', process.env.MONGODB_URI ? 
  process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT SET');

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('MongoDB URI being used:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

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

// Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

// API Routes

// Simple test endpoint (no database required)
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    success: true,
    status: 'OK',
    database: {
      status: dbStatusText[dbStatus] || 'unknown',
      readyState: dbStatus
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      vercel: !!process.env.VERCEL
    }
  });
});

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

// Events API Routes
// Get all events
app.get('/api/events', async (req, res) => {
  try {
    // Wait for database connection with timeout
    const waitForConnection = () => {
      return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
          resolve();
          return;
        }
        
        const timeout = setTimeout(() => {
          reject(new Error('Database connection timeout'));
        }, 10000); // 10 second timeout
        
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    };

    await waitForConnection();
    
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    console.log('Successfully fetched events:', events.length);
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, time, location, maxParticipants } = req.body;

    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      maxParticipants: maxParticipants || 50
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event. Please try again.',
      error: error.message
    });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event. Please try again.',
      error: error.message
    });
  }
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

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
