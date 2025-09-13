const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

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

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String },
  studentStatus: { type: String, enum: ['current', 'recent', 'prospective', 'other'] },
  isActive: { type: Boolean, default: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate auth token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Clear password reset token
userSchema.methods.clearPasswordResetToken = function() {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

const User = mongoose.model('User', userSchema);

// Email service for password reset emails
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Gmail configuration incomplete. Missing EMAIL_USER or EMAIL_PASS');
      return null;
    }
    
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('Gmail transporter created successfully');
      return transporter;
    } catch (error) {
      console.error('Error creating Gmail transporter:', error);
      return null;
    }
  }
  
  console.log('No email service configured or unsupported service');
  return null;
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    console.log('Attempting to send password reset email to:', email);
    console.log('Reset URL:', resetUrl);
    console.log('Email service:', process.env.EMAIL_SERVICE);
    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass configured:', !!process.env.EMAIL_PASS);
    
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

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { success: false, message: 'Failed to send password reset email' };
  }
};

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

  // Connect to database with error handling
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
    if (action === 'login') {
      // Login logic
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const token = user.generateAuthToken();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            university: user.university,
            studentStatus: user.studentStatus
          },
          token
        }
      });

    } else if (action === 'register') {
      // Registration logic
      const { firstName, lastName, email, password, university, studentStatus } = body;

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
          message: 'User already exists with this email'
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

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            university: user.university,
            studentStatus: user.studentStatus
          },
          token
        }
      });

    } else if (action === 'forgot-password') {
      // Forgot password logic
      const { email } = body;

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
      const { token, password } = body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both token and new password'
        });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      user.password = password;
      user.clearPasswordResetToken();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });

    } else if (action === 'logout') {
      // Logout logic (client-side token removal)
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Supported actions: login, register, forgot-password, reset-password, logout'
      });
    }
  } catch (error) {
    console.error('Error in auth API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
