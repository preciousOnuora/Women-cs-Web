const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

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

  if (req.method === 'POST') {
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
  } else if (req.method === 'GET') {
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
