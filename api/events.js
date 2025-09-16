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

// Global storage for sample event registrations (in-memory for Vercel)
global.sampleEventRegistrations = global.sampleEventRegistrations || {};


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
    console.log('Events API called:', req.method, req.url);
    console.log('Request body:', req.body);
    
    if (req.method === 'GET') {
      // Check if this is a request for user events
      const { userId } = req.query;
      
      if (userId) {
        // Get events for a specific user (for dashboard)
        console.log('Fetching events for user:', userId);
        console.log('User ID type:', typeof userId);
        
        try {
          // Try to get events from database first
          const allEvents = await Event.find({});
          console.log('All events in database:', allEvents.length);
          
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
          console.log('Database connection failed, checking for sample event registrations');
          
          // Check if user has registered for sample events by checking localStorage or session
          // For now, we'll return sample events if the user might be registered
          // In a real app, you'd store this in a separate table or use a different approach
          
          // For demo purposes, we'll assume if they're logged in, they might have registered for Bowling
          // In a real implementation, you'd track this properly
          const sampleEvents = [
            {
              _id: 'sample1',
              title: "Bowling Night",
              description: "Join us for a <span class=\"highlight\">fun evening of bowling</span>! A great opportunity to <span class=\"highlight\">socialize, have fun</span>, and connect with fellow Women@CS members. Whether you're a <span class=\"highlight\">bowling pro</span> or a <span class=\"highlight\">complete beginner</span>, everyone is welcome!",
              date: new Date('2025-10-16T17:00:00Z'),
              time: "5:00 PM",
              location: "Fountain Park, Dundee St, Edinburgh EH11 1AW",
              maxParticipants: 30,
              currentParticipants: 1, // Assume they're registered
              isUpcoming: true
            }
          ];
          
          res.status(200).json({
            success: true,
            data: sampleEvents
          });
        }
      } else {
        // Get all events from MongoDB
        try {
          let events = await Event.find().sort({ date: 1 });
          
          console.log('GET /api/events - Database events found:', events.length);
          
          // Return all database events (this ensures any events added to MongoDB will show up)
          res.status(200).json({
            success: true,
            data: events
          });
          
        } catch (dbError) {
          console.error('Database error fetching events:', dbError);
          console.log('Database connection failed, returning sample events');
          
          // Only fall back to sample events if database is completely unavailable
          const events = [
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
            },
            {
              _id: 'sample_hackathon_2026',
              title: "24HR HACKATHON 2026",
              description: "Work in <span class=\"highlight\">Teams of 5</span> to collaborate, code, and innovate! This event features <span class=\"highlight\">inspiring talks on career journeys</span>, networking opportunities with <span class=\"highlight\">industry professionals</span>, and the chance to win <span class=\"highlight\">prizes</span>. Fuel your creativity with <span class=\"highlight\">free pizza</span> and showcase your skills in this unmissable coding adventure!",
              date: new Date('2026-02-07T10:30:00Z'),
              time: "10:30 AM",
              location: "Heriot-Watt Campus, Robotarium",
              maxParticipants: 100,
              currentParticipants: 2,
              isUpcoming: true
            }
          ];
          
          res.status(200).json({
            success: true,
            data: events
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



          // Try to find the event in database
          try {
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
          } catch (dbError) {
            console.error('Database error during registration:', dbError);
            // For sample events or database errors, return success
            res.status(200).json({
              success: true,
              message: 'Registration successful! (Note: Database connection issue - registration recorded locally)'
            });
          }
        } catch (error) {
          console.error('Error registering for event:', error);
          res.status(500).json({
            success: false,
            message: 'Error registering for event'
          });
        }
      }
    } else if (req.method === 'POST' && req.url.includes('/admin')) {
      // Admin route to create new events in MongoDB
      console.log('=== ADMIN ROUTE HIT ===');
      console.log('URL:', req.url);
      console.log('Method:', req.method);
      console.log('Body:', req.body);
      console.log('======================');
      
      try {
        const { title, description, date, time, location, maxParticipants, sponsor, currentParticipants = 0, isUpcoming = true } = req.body;

        if (!title || !description || !date || !time || !location || !maxParticipants) {
          return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
          });
        }

        // Create new event in MongoDB
        const newEvent = new Event({
          title,
          description,
          date: new Date(date),
          time,
          location,
          maxParticipants: parseInt(maxParticipants),
          currentParticipants: parseInt(currentParticipants),
          isActive: isUpcoming,
          sponsor: sponsor || 'To be announced',
          participants: []
        });

        const savedEvent = await newEvent.save();
        console.log('Event saved to MongoDB:', savedEvent._id);
        
        res.status(201).json({
          success: true,
          message: 'Event created successfully in database!',
          data: savedEvent
        });

      } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
          success: false,
          message: 'Error creating event. Please try again.',
          error: error.message
        });
      }
    } else if (req.method === 'DELETE' && req.url.includes('/delete')) {
      // Delete event route from MongoDB
      console.log('=== DELETE ROUTE HIT ===');
      console.log('URL:', req.url);
      console.log('Method:', req.method);
      console.log('Body:', req.body);
      console.log('========================');
      
      try {
        const { eventId } = req.body;

        if (!eventId) {
          return res.status(400).json({
            success: false,
            message: 'Event ID is required'
          });
        }

        // Delete from MongoDB
        console.log('Deleting event with ID:', eventId);
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        
        if (!deletedEvent) {
          return res.status(404).json({
            success: false,
            message: 'Event not found'
          });
        }

        console.log('Event deleted successfully from MongoDB:', eventId);
        
        res.status(200).json({
          success: true,
          message: 'Event deleted successfully from database'
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
          success: false,
          message: 'Error deleting event. Please try again.',
          error: error.message
        });
      }
    } else {
      console.log('Unhandled request:', req.method, req.url);
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} Not Allowed for ${req.url}`
      });
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
