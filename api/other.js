const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

// Connect to MongoDB with error handling
const connectDB = async () => {
  if (mongoose.connections[0].readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  university: { type: String, trim: true },
  studentStatus: { type: String, required: true, enum: ['current', 'recent', 'prospective', 'other'] },
  eventParticipation: { type: String, enum: ['hackathon', 'workshops', 'networking', 'mentorship', 'multiple', 'none', ''] },
  rating: { type: Number, required: true, min: 1, max: 5 },
  overallExperience: { type: String, trim: true },
  technicalSkills: { type: String, trim: true },
  networkingValue: { type: String, trim: true },
  suggestions: { type: String, trim: true },
  submittedAt: { type: Date, default: Date.now }
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
    console.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }

  const { action } = req.query;

  try {
    if (action === 'contact') {
      // Handle contact form
      if (req.method === 'POST') {
        const contact = new Contact(body);
        await contact.save();
        
        res.status(201).json({
          success: true,
          message: 'Message sent successfully! We\'ll get back to you soon.',
          data: contact
        });
      } else if (req.method === 'GET') {
        const contacts = await Contact.find().sort({ submittedAt: -1 });
        res.json({
          success: true,
          data: contacts
        });
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

    } else if (action === 'feedback') {
      // Handle feedback form
      if (req.method === 'POST') {
        const feedback = new Feedback(body);
        await feedback.save();
        
        res.status(201).json({
          success: true,
          message: 'Feedback submitted successfully!',
          data: feedback
        });
      } else if (req.method === 'GET') {
        const feedback = await Feedback.find().sort({ submittedAt: -1 });
        res.json({
          success: true,
          data: feedback
        });
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use ?action=contact or ?action=feedback'
      });
    }

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
