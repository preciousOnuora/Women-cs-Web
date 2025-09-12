const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxParticipants: { type: Number, default: 50 },
  currentParticipants: { type: Number, default: 0 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isUpcoming: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

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

  // Connect to database
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }

  // Parse JSON body if it exists
  let body = {};
  if (req.body) {
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON in request body'
      });
    }
  }

  try {
    if (req.method === 'GET') {
      // Check if this is a request for user events
      const { userId } = req.query;
      
      if (userId) {
        // Get events for a specific user (for dashboard)
        console.log('Fetching events for user:', userId);
        
        try {
          // Get events where the user is a participant
          const events = await Event.find({ 
            participants: userId 
          }).sort({ date: 1 });
          
          console.log('Found events for user:', events.length);
          
          res.status(200).json({
            success: true,
            data: events
          });
        } catch (dbError) {
          console.error('Database error fetching user events:', dbError);
          res.status(500).json({
            success: false,
            message: 'Database error fetching user events',
            error: dbError.message
          });
        }
      } else {
        // Get all events
        try {
          let events = await Event.find().sort({ date: 1 });
          
          // If no events in database, return sample events
          if (events.length === 0) {
            console.log('No events in database, returning sample events');
            events = [
              {
                _id: 'sample1',
                title: "Women in Tech Networking Event",
                description: "Join us for an evening of networking, inspiration, and connection with fellow women in technology. This event features keynote speakers, panel discussions, and networking opportunities.",
                date: new Date('2024-12-15T18:00:00Z'),
                location: "Edinburgh University, Informatics Forum",
                maxParticipants: 100,
                currentParticipants: 0,
                isUpcoming: true
              },
              {
                _id: 'sample2',
                title: "Coding Workshop: Introduction to React",
                description: "Learn the fundamentals of React development in this hands-on workshop. Perfect for beginners and those looking to refresh their skills. We'll cover components, state, and props.",
                date: new Date('2024-12-20T14:00:00Z'),
                location: "Online - Zoom",
                maxParticipants: 30,
                currentParticipants: 0,
                isUpcoming: true
              },
              {
                _id: 'sample3',
                title: "Career Panel: Breaking into Tech",
                description: "Hear from successful women in tech about their career journeys, challenges they've overcome, and advice for those starting out. Q&A session included.",
                date: new Date('2025-01-10T17:30:00Z'),
                location: "Edinburgh University, Appleton Tower",
                maxParticipants: 80,
                currentParticipants: 0,
                isUpcoming: true
              }
            ];
          }
          
          res.status(200).json({
            success: true,
            data: events
          });
        } catch (dbError) {
          console.error('Database error fetching events:', dbError);
          res.status(500).json({
            success: false,
            message: 'Database error fetching events',
            error: dbError.message
          });
        }
      }
    } else if (req.method === 'POST') {
      // Handle event registration/unregistration
      const { action, eventId, userId } = body;
      
      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'Event ID is required'
        });
      }

      if (action === 'unregister') {
        try {
          // Remove user from event participants
          const event = await Event.findById(eventId);
          if (!event) {
            return res.status(404).json({
              success: false,
              message: 'Event not found'
            });
          }

          event.participants = event.participants.filter(pid => pid.toString() !== userId);
          event.currentParticipants = event.participants.length;
          await event.save();

          res.status(200).json({
            success: true,
            message: 'Unregistration successful'
          });
        } catch (error) {
          console.error('Error unregistering from event:', error);
          res.status(500).json({
            success: false,
            message: 'Error unregistering from event'
          });
        }
      } else {
        // Handle registration
        try {
          if (!userId) {
            return res.status(400).json({
              success: false,
              message: 'User ID is required for registration'
            });
          }

          // Find the event
          const event = await Event.findById(eventId);
          if (!event) {
            return res.status(404).json({
              success: false,
              message: 'Event not found'
            });
          }

          // Check if user is already registered
          if (event.participants.includes(userId)) {
            return res.status(400).json({
              success: false,
              message: 'You are already registered for this event'
            });
          }

          // Check if event is full
          if (event.currentParticipants >= event.maxParticipants) {
            return res.status(400).json({
              success: false,
              message: 'This event is full'
            });
          }

          // Add user to participants
          event.participants.push(userId);
          event.currentParticipants = event.participants.length;
          await event.save();

          res.status(200).json({
            success: true,
            message: 'Registration successful'
          });
        } catch (error) {
          console.error('Error registering for event:', error);
          res.status(500).json({
            success: false,
            message: 'Error registering for event'
          });
        }
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in events API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
