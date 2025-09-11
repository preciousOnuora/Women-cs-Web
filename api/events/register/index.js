const { User, verifyToken } = require('../../auth/utils');
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
      const { eventId } = req.body;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'Event ID is required'
        });
      }

      // Check if event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }

      if (!event.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Event is no longer active'
        });
      }

      // Check if user is already registered
      const existingRegistration = await EventRegistration.findOne({
        userId,
        eventId
      });

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'You are already registered for this event'
        });
      }

      // Check if event is full
      if (event.currentParticipants >= event.maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Event is full'
        });
      }

      // Create registration
      const registration = new EventRegistration({
        userId,
        eventId
      });

      await registration.save();

      // Update event participant count
      event.currentParticipants += 1;
      await event.save();

      res.status(201).json({
        success: true,
        message: 'Successfully registered for the event!',
        data: {
          registration,
          event
        }
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering for event. Please try again.',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
