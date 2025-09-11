const { User, verifyToken } = require('../../../auth/utils');
const mongoose = require('mongoose');

// Event Registration Schema
const eventRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

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

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Verify token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const userId = decoded.userId;
      const eventId = req.query.eventId;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'Event ID is required'
        });
      }

      // Find and remove registration
      const registration = await EventRegistration.findOneAndDelete({
        userId,
        eventId
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found'
        });
      }

      // Update event participant count
      const event = await Event.findById(eventId);
      if (event) {
        event.currentParticipants = Math.max(0, event.currentParticipants - 1);
        await event.save();
      }

      res.status(200).json({
        success: true,
        message: 'Successfully unregistered from the event!'
      });
    } catch (error) {
      console.error('Error unregistering from event:', error);
      res.status(500).json({
        success: false,
        message: 'Error unregistering from event. Please try again.',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
