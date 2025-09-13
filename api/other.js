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

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  university: { type: String },
  studentStatus: { type: String },
  eventParticipation: { type: String },
  overallExperience: { type: String },
  technicalSkills: { type: String },
  networkingValue: { type: String },
  suggestions: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
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
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
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
          data: { id: contact._id }
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
          data: { id: feedback._id }
        });
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Supported actions: contact, feedback'
      });
    }
  } catch (error) {
    console.error('Error in other API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
