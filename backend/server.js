/**
 * Women@CS Backend Server
 * 
 * This is the main server file for the Women@CS website backend.
 * It handles API routes, database connections, and serves the React frontend.
 * 
 * Features:
 * - MongoDB Atlas database connection
 * - RESTful API endpoints for events, feedback, and contact
 * - CORS enabled for frontend communication
 * - Environment variable configuration
 * - Error handling and logging
 */

// Import required dependencies
const express = require('express');        // Web framework for Node.js
const mongoose = require('mongoose');      // MongoDB object modeling tool
const cors = require('cors');              // Cross-Origin Resource Sharing middleware
const dotenv = require('dotenv');          // Environment variable loader
const path = require('path');              // File path utilities
const bcrypt = require('bcryptjs');        // Password hashing
const jwt = require('jsonwebtoken');       // JSON Web Token
const crypto = require('crypto');          // Cryptographic functionality
const nodemailer = require('nodemailer');  // Email service

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express application
const app = express();

// =============================================================================
// MIDDLEWARE CONFIGURATION
// =============================================================================

// Enable CORS for all routes (allows frontend to communicate with backend)
app.use(cors());

// Parse JSON request bodies (for API endpoints)
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

// MongoDB connection string - uses environment variable or defaults to local
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

// Log environment configuration for debugging
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VERCEL:', process.env.VERCEL);
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('- MONGODB_URI value:', process.env.MONGODB_URI ? 
  process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT SET');

/**
 * Connect to MongoDB with automatic retry logic
 * This function handles connection failures and retries every 5 seconds
 * until a successful connection is established
 */
const connectWithRetry = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,           // Use new URL parser
    useUnifiedTopology: true,        // Use new server discovery and monitoring engine
    serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('MongoDB URI being used:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    console.log('Retrying connection in 5 seconds...');
    // Retry connection after 5 seconds
    setTimeout(connectWithRetry, 5000);
  });
};

// Start the database connection process
connectWithRetry();

// =============================================================================
// DATABASE SCHEMAS
// =============================================================================

/**
 * Feedback Schema
 * Defines the structure for feedback submissions from users
 * Includes validation rules and data types for each field
 */
const feedbackSchema = new mongoose.Schema({
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
  university: {
    type: String,
    trim: true
  },
  studentStatus: {
    type: String,
    required: true,
    enum: ['current', 'recent', 'prospective', 'other']
  },
  eventParticipation: {
    type: String,
    enum: ['hackathon', 'workshops', 'networking', 'mentorship', 'multiple', 'none', '']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  overallExperience: {
    type: String,
    trim: true
  },
  technicalSkills: {
    type: String,
    trim: true
  },
  networkingValue: {
    type: String,
    trim: true
  },
  suggestions: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Feedback model from the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

/**
 * Contact Schema
 * Defines the structure for contact form submissions
 * Used for general inquiries and messages from users
 */
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

// Create the Contact model from the schema
const Contact = mongoose.model('Contact', contactSchema);

/**
 * Event Schema
 * Defines the structure for events in the Women@CS calendar
 * Includes event details, capacity, and status tracking
 */
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

// Create the Event model from the schema
const Event = mongoose.model('Event', eventSchema);

/**
 * User Schema
 * Defines the structure for user accounts and authentication
 * Includes password hashing, JWT token generation, and validation
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  university: {
    type: String,
    trim: true
  },
  studentStatus: {
    type: String,
    enum: ['current', 'recent', 'prospective', 'other']
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id, 
      email: this.email, 
      role: this.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set expire time (1 hour from now)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  
  return resetToken;
};

// Clear password reset token
userSchema.methods.clearPasswordResetToken = function() {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// =============================================================================
// API ROUTES
// =============================================================================

/**
 * Test Endpoint
 * Simple endpoint to verify server is running
 * Returns server status and environment information
 * GET /api/test
 */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      hasMongoUri: !!process.env.MONGODB_URI
    }
  });
});

/**
 * Health Check Endpoint
 * Returns database connection status and server health information
 * Used for monitoring and debugging
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    success: true,
    status: 'OK',
    database: {
      status: dbStatusText[dbStatus] || 'unknown',
      readyState: dbStatus
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      vercel: !!process.env.VERCEL
    }
  });
});

/**
 * Submit Feedback
 * Handles feedback form submissions from users
 * Validates data and saves to database
 * POST /api/feedback
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully!',
      data: feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback. Please try again.',
      error: error.message
    });
  }
});

/**
 * Submit Contact Form
 * Handles contact form submissions from users
 * Validates data and saves to database
 * POST /api/contact
 */
app.post('/api/contact', async (req, res) => {
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
});

/**
 * Get All Feedback (Admin)
 * Retrieves all feedback submissions for administrative purposes
 * Returns feedback sorted by submission date (newest first)
 * GET /api/feedback
 */
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback.',
      error: error.message
    });
  }
});

/**
 * Get All Contact Messages (Admin)
 * Retrieves all contact form submissions for administrative purposes
 * Returns messages sorted by submission date (newest first)
 * GET /api/contact
 */
app.get('/api/contact', async (req, res) => {
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
});

// =============================================================================
// AUTHENTICATION API ROUTES
// =============================================================================

// Email service for password reset emails
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return null;
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email service not configured. Reset URL:', resetUrl);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Women@CS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your Women@CS account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3498db; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Women@CS Team<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
};

/**
 * Authentication Routes Handler
 * Handles login, register, forgot password, reset password, and logout
 * POST /api/auth?action=login|register|forgot-password|reset-password|logout
 */
app.post('/api/auth', async (req, res) => {
  const { action } = req.query;

  try {
    if (action === 'login') {
      // Login logic
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = user.generateAuthToken();
      user.lastLogin = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Login successful!',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            university: user.university,
            studentStatus: user.studentStatus,
            role: user.role
          },
          token
        }
      });

    } else if (action === 'register') {
      // Registration logic
      const { firstName, lastName, email, password, university, studentStatus } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        university,
        studentStatus
      });

      await user.save();
      const token = user.generateAuthToken();
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            university: user.university,
            studentStatus: user.studentStatus,
            role: user.role
          },
          token
        }
      });

    } else if (action === 'forgot-password') {
      // Forgot password logic
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an email address'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      if (!user.isActive) {
        return res.status(200).json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      const resetToken = user.generatePasswordResetToken();
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const emailResult = await sendPasswordResetEmail(user.email, resetUrl);
      
      if (!emailResult.success) {
        console.log('Email service not configured. Reset URL:', resetUrl);
      }

      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      });

    } else if (action === 'reset-password') {
      // Reset password logic
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both token and new password'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token'
        });
      }

      user.password = password;
      user.clearPasswordResetToken();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully! You can now log in with your new password.'
      });

    } else if (action === 'logout') {
      // Logout logic (JWT tokens are stateless, so just return success)
      res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action'
      });
    }

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
});

// =============================================================================
// EVENTS API ROUTES
// =============================================================================

/**
 * Get All Events
 * Retrieves all active events from the database
 * Includes connection waiting logic for Vercel serverless environment
 * Returns events sorted by date (upcoming first)
 * GET /api/events
 */
app.get('/api/events', async (req, res) => {
  try {
    // Wait for database connection with timeout
    const waitForConnection = () => {
      return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
          resolve();
          return;
        }
        
        const timeout = setTimeout(() => {
          reject(new Error('Database connection timeout'));
        }, 10000); // 10 second timeout
        
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    };

    await waitForConnection();
    
    let events = await Event.find({ isActive: true }).sort({ date: 1 });
    
    // If no events in database, return sample events including Bowling
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
          isActive: true
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
          isActive: true
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
          isActive: true
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
          isActive: true
        }
      ];
    }
    
    console.log('Successfully fetched events:', events.length);
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    console.log('Database connection failed, returning sample events');
    
    // Return sample events when database connection fails
    const events = [
      {
        _id: 'sample1',
        title: "Bowling Night",
        description: "Join us for a fun evening of bowling! A great opportunity to socialize, have fun, and connect with fellow Women@CS members. Whether you're a bowling pro or a complete beginner, everyone is welcome!",
        date: new Date('2025-10-16T17:00:00Z'),
        time: "5:00 PM",
        location: "Fountain Park, Dundee St, Edinburgh EH11 1AW",
        maxParticipants: 30,
        currentParticipants: 0,
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
      }
    ];
    
    res.json({
      success: true,
      data: events
    });
  }
});

// Create a new event
app.post('/api/events', async (req, res) => {
  try {
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
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event. Please try again.',
      error: error.message
    });
  }
});

// Admin route to create new events
app.post('/api/events/admin', async (req, res) => {
  try {
    const { title, description, date, time, location, maxParticipants, sponsor, currentParticipants = 0, isUpcoming = true } = req.body;

    if (!title || !description || !date || !time || !location || !maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new event
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      maxParticipants: parseInt(maxParticipants),
      currentParticipants: parseInt(currentParticipants),
      isActive: isUpcoming,
      sponsor: sponsor || 'To be announced'
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event. Please try again.',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
