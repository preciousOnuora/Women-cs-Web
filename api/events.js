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

  try {
    if (req.method === 'GET') {
      // Check if this is a request for user events
      const { userId } = req.query;
      
      if (userId) {
        // Get events for a specific user (for dashboard)
        console.log('Fetching events for user:', userId);
        console.log('User ID type:', typeof userId);
        
        try {
          // First, let's see what events exist and what participants they have
          const allEvents = await Event.find({});
          console.log('All events in database:', allEvents.length);
          allEvents.forEach((event, index) => {
            console.log(`Event ${index}:`, {
              id: event._id,
              title: event.title,
              participants: event.participants,
              participantsCount: event.participants.length
            });
          });
          
          // Try different query approaches
          let events = [];
          
          // Try exact match first
          events = await Event.find({ 
            participants: userId 
          }).sort({ date: 1 });
          
          console.log('Exact match found:', events.length);
          
          // If no exact match, try with ObjectId conversion
          if (events.length === 0) {
            try {
              const mongoose = require('mongoose');
              const objectId = new mongoose.Types.ObjectId(userId);
              events = await Event.find({ 
                participants: objectId 
              }).sort({ date: 1 });
              console.log('ObjectId match found:', events.length);
            } catch (objectIdError) {
              console.log('ObjectId conversion failed:', objectIdError.message);
            }
          }
          
          // If still no match, try string comparison
          if (events.length === 0) {
            events = await Event.find({ 
              participants: { $in: [userId.toString()] }
            }).sort({ date: 1 });
            console.log('String match found:', events.length);
          }
          
          console.log('Final events found for user:', events.length);
          
          res.status(200).json({
            success: true,
            data: events
          });
        } catch (dbError) {
          console.error('Database error fetching user events:', dbError);
          console.error('Error details:', {
            message: dbError.message,
            name: dbError.name,
            code: dbError.code
          });
          
          // Return empty array instead of error for now
          res.status(200).json({
            success: true,
            data: []
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
                title: "Bowling Night",
                description: "Join us for a fun evening of bowling! A great opportunity to socialize, have fun, and connect with fellow Women@CS members. Whether you're a bowling pro or a complete beginner, everyone is welcome!",
                date: new Date('2025-10-16T17:00:00Z'),
                time: "5:00 PM",
                location: "Fountain Park, Dundee St, Edinburgh EH11 1AW",
                maxParticipants: 30,
                currentParticipants: 0,
                isUpcoming: true
              },
              {
                _id: 'sample2',
                title: "Women in Tech Networking Event",
                description: "Join us for an evening of networking, inspiration, and connection with fellow women in technology. This event features keynote speakers, panel discussions, and networking opportunities.",
                date: new Date('2024-12-15T18:00:00Z'),
                time: "6:00 PM",
                location: "Edinburgh University, Informatics Forum",
                maxParticipants: 100,
                currentParticipants: 0,
                isUpcoming: true
              },
              {
                _id: 'sample3',
                title: "Coding Workshop: Introduction to React",
                description: "Learn the fundamentals of React development in this hands-on workshop. Perfect for beginners and those looking to refresh their skills. We'll cover components, state, and props.",
                date: new Date('2024-12-20T14:00:00Z'),
                time: "2:00 PM",
                location: "Online - Zoom",
                maxParticipants: 30,
                currentParticipants: 0,
                isUpcoming: true
              },
              {
                _id: 'sample4',
                title: "Career Panel: Breaking into Tech",
                description: "Hear from successful women in tech about their career journeys, challenges they've overcome, and advice for those starting out. Q&A session included.",
                date: new Date('2025-01-10T17:30:00Z'),
                time: "5:30 PM",
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
          // Get userId from body or try to extract from token
          let actualUserId = userId;
          
          if (!actualUserId) {
            // Try to get user ID from JWT token
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              try {
                const jwt = require('jsonwebtoken');
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                actualUserId = decoded.userId;
                console.log('Extracted userId from token for unregister:', actualUserId);
              } catch (tokenError) {
                console.error('Error decoding token for unregister:', tokenError);
              }
            }
          }
          
          if (!actualUserId) {
            return res.status(400).json({
              success: false,
              message: 'User ID is required for unregistration. Please sign in again.'
            });
          }

          // Remove user from event participants
          const event = await Event.findById(eventId);
          if (!event) {
            return res.status(404).json({
              success: false,
              message: 'Event not found'
            });
          }

          event.participants = event.participants.filter(pid => pid.toString() !== actualUserId);
          event.currentParticipants = event.participants.length;
          await event.save();
          
          console.log('Successfully unregistered user', actualUserId, 'from event', eventId);

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
          // Get userId from body or try to extract from token
          let actualUserId = userId;
          
          if (!actualUserId) {
            // Try to get user ID from JWT token
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
              try {
                const jwt = require('jsonwebtoken');
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                actualUserId = decoded.userId;
                console.log('Extracted userId from token:', actualUserId);
              } catch (tokenError) {
                console.error('Error decoding token:', tokenError);
              }
            }
          }
          
          if (!actualUserId) {
            return res.status(400).json({
              success: false,
              message: 'User ID is required for registration. Please sign in again.'
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
          if (event.participants.includes(actualUserId)) {
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
          event.participants.push(actualUserId);
          event.currentParticipants = event.participants.length;
          await event.save();
          
          console.log('Successfully registered user', actualUserId, 'for event', eventId);

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
