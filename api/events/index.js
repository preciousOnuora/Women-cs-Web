const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

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
  // Connect to database
  await connectDB();
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Check if hackathon 2026 event exists, if not create it
      const existingHackathon = await Event.findOne({ title: "24HR HACKATHON 2026" });
      if (!existingHackathon) {
        const hackathonEvent = new Event({
          title: "24HR HACKATHON 2026",
          description: "Work in Teams of 5 to collaborate, code, and innovate! This event features inspiring talks on career journeys, networking opportunities with industry professionals, and the chance to win prizes. Fuel your creativity with free pizza and showcase your skills in this unmissable coding adventure!",
          date: new Date('2026-02-07'),
          time: "10:30 AM - 10:30 AM (24 hours)",
          location: "Heriot-Watt Campus, Robotarium",
          maxParticipants: 100,
          currentParticipants: 0,
          isActive: true
        });
        await hackathonEvent.save();
        console.log('Created hackathon 2026 event');
      }

      // Get all active events
      const events = await Event.find({ isActive: true })
        .sort({ date: 1 });

      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching events.',
        error: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      // Create a new event (admin only - for now, anyone can create)
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
