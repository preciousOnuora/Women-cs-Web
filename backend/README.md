# Women@CS Website - Full Stack with MongoDB Atlas

A modern website for Women@CS with React frontend and MongoDB Atlas backend for form handling.

## Features

- **React Frontend**: Modern, responsive design with multiple pages
- **MongoDB Atlas Backend**: Cloud database for storing form submissions
- **Form Handling**: Contact and Feedback forms with database storage
- **Vercel Deployment**: Full-stack deployment with serverless functions
- **Professional Design**: Modern UI with glass morphism effects

## Tech Stack

- **Frontend**: React, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Deployment**: Vercel
- **Environment**: Environment variables for configuration

## Setup Instructions

### 1. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up or log in to your account

2. **Create a New Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 2. Environment Variables

1. **Create .env file**:
   ```bash
   cp env.example .env
   ```

2. **Update .env with your MongoDB connection**:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/womenatcs?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=production
   ```

### 3. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies (if not already installed)
npm install react react-dom react-router-dom
```

### 4. Local Development

```bash
# Start the development server
npm run dev
```

The server will run on `http://localhost:5000`

### 5. Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add your `MONGODB_URI` variable

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

## API Endpoints

### Feedback Form
- **POST** `/api/feedback` - Submit feedback form
- **GET** `/api/feedback` - Get all feedback (admin)

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Get all contact messages (admin)

## Database Schema

### Feedback Collection
```javascript
{
  name: String (required),
  email: String (required),
  university: String,
  studentStatus: String (required),
  eventParticipation: String,
  rating: Number (1-5, required),
  overallExperience: String,
  technicalSkills: String,
  networkingValue: String,
  suggestions: String,
  submittedAt: Date
}
```

### Contact Collection
```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  submittedAt: Date
}
```

## File Structure

```
├── src/
│   ├── Components/
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── Contact.jsx
│   │   ├── Sponsors.jsx
│   │   ├── Feedback.jsx
│   │   ├── Gallery.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── Images/
│   └── CSS files
├── server.js
├── package.json
├── vercel.json
├── .env
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check your connection string in .env
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password are correct

2. **Vercel Deployment Issues**:
   - Make sure environment variables are set in Vercel dashboard
   - Check that vercel.json is properly configured
   - Ensure all dependencies are in package.json

3. **Form Submission Errors**:
   - Check browser console for errors
   - Verify API endpoints are working
   - Ensure CORS is properly configured

## Support

For issues or questions:
- Check the troubleshooting section above
- Review MongoDB Atlas documentation
- Check Vercel deployment logs

## License

MIT License - feel free to use this project for your own Women in Tech initiatives!
