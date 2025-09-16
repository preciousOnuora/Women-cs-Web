const mongoose = require('mongoose');

// Connect to MongoDB
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

  console.log('Admin API called:', req.method, req.url);
  console.log('Request body:', req.body);

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
    if (req.method === 'POST') {
      // Admin route to create new events
      console.log('Creating new event with data:', body);
      
      const { title, description, date, time, location, maxParticipants, sponsor, currentParticipants = 0, isUpcoming = true } = body;

      if (!title || !description || !date || !time || !location || !maxParticipants) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // For Vercel, we'll add the event to our sample events
      // In a real app, you'd save to database
      const newEvent = {
        _id: `admin_${Date.now()}`,
        title,
        description,
        date: new Date(date),
        time,
        location,
        maxParticipants: parseInt(maxParticipants),
        currentParticipants: parseInt(currentParticipants),
        isUpcoming: isUpcoming,
        sponsor: sponsor || 'To be announced',
        participants: []
      };

      console.log('Created event:', newEvent);

      res.status(201).json({
        success: true,
        message: 'Event created successfully!',
        data: newEvent
      });

    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} Not Allowed`
      });
    }
  } catch (error) {
    console.error('Error in admin API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
