const { User } = require('./utils');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
}
