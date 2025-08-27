# Forgot Password Functionality Setup

This document explains how to set up and use the forgotten password functionality that has been added to your Women@CS application.

## Features Added

✅ **Complete Forgot Password Flow**:
- Forgot password form accessible from login page
- Secure token-based password reset
- Email notifications (configurable)
- Password reset form with validation
- Token expiration (1 hour)
- Security best practices

## Files Added/Modified

### New Files:
- `api/auth/forgot-password/index.js` - API endpoint for password reset requests
- `api/auth/reset-password/index.js` - API endpoint for password reset with token
- `api/auth/emailService.js` - Email service for sending reset emails
- `src/ForgotPassword.jsx` - React component for forgot password form
- `src/ResetPassword.jsx` - React component for password reset form

### Modified Files:
- `api/auth/utils.js` - Added password reset token fields and methods
- `src/contexts/AuthContext.jsx` - Added forgotPassword and resetPassword methods
- `src/Login.jsx` - Added "Forgot Password" link
- `src/Header.jsx` - Added forgot password modal handling
- `src/App.jsx` - Added reset password route
- `src/Login.css` - Added styles for forgot password components
- `backend/package.json` - Added required dependencies
- `backend/env.example` - Added email configuration variables

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install the new dependencies:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT tokens
- `nodemailer` - For sending emails

### 2. Environment Variables

Copy the environment example and configure your variables:

```bash
cp backend/env.example backend/.env
```

Update your `.env` file with:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/womenatcs?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret for token signing
JWT_SECRET=your_very_secure_jwt_secret_here

# Email Service Configuration (for password reset emails)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

### 3. Email Service Setup (Optional)

For development, you can use Gmail with an App Password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Use the App Password** in your `EMAIL_PASS` environment variable

**Note**: In production, use a proper email service like SendGrid, AWS SES, or similar.

### 4. Database Migration

The User schema has been updated with new fields:
- `resetPasswordToken` - Stores hashed reset token
- `resetPasswordExpires` - Token expiration timestamp

Existing users will have these fields as `undefined` until they request a password reset.

## How It Works

### 1. User Requests Password Reset
- User clicks "Forgot your password?" on login form
- Enters email address
- System generates secure token and sends email (if configured)

### 2. User Resets Password
- User clicks link in email (or uses URL from console in development)
- Enters new password twice for confirmation
- System validates token and updates password
- User is redirected to login page

### 3. Security Features
- **Token Expiration**: Reset tokens expire after 1 hour
- **One-time Use**: Tokens are cleared after successful password reset
- **Secure Hashing**: Tokens are hashed before storage
- **Rate Limiting**: Consider adding rate limiting for production

## Testing

### Development Mode
1. Start your application
2. Go to login page
3. Click "Forgot your password?"
4. Enter a valid email address
5. Check console logs for the reset URL
6. Copy the URL and open in browser
7. Set new password

### Production Mode
1. Configure email service properly
2. Users will receive actual emails with reset links
3. Test with real email addresses

## API Endpoints

### POST `/api/auth/forgot-password`
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### POST `/api/auth/reset-password`
**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully! You can now log in with your new password."
}
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret in production
2. **Email Security**: Use proper email service with authentication
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **HTTPS**: Always use HTTPS in production
5. **Token Storage**: Tokens are hashed before database storage
6. **Expiration**: Tokens expire after 1 hour

## Troubleshooting

### Common Issues:

1. **"Email service not configured"**
   - Check your environment variables
   - Ensure email credentials are correct

2. **"Invalid or expired reset token"**
   - Token may have expired (1 hour limit)
   - Request a new password reset

3. **Database connection issues**
   - Check MongoDB connection string
   - Ensure database is accessible

4. **CORS errors**
   - Check that API endpoints are properly configured
   - Verify frontend is making requests to correct URLs

## Next Steps

For production deployment:

1. **Set up proper email service** (SendGrid, AWS SES, etc.)
2. **Add rate limiting** to prevent abuse
3. **Implement proper logging** for security monitoring
4. **Add email templates** for better user experience
5. **Consider adding** password strength requirements
6. **Add monitoring** for failed reset attempts

## Support

If you encounter any issues, check:
1. Console logs for error messages
2. Network tab for API request/response details
3. Database for user records and tokens
4. Environment variables configuration
