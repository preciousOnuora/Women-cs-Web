# Vercel Deployment Setup

## Environment Variables Required

You need to set up the following environment variables in your Vercel dashboard:

### MONGODB_URI
- **Value**: Your MongoDB Atlas connection string
- **Example**: `mongodb+srv://preonuo:preonuo@cluster0.sg0wcaf.mongodb.net/womenatcs?retryWrites=true&w=majority&appName=Cluster0`

### NODE_ENV
- **Value**: `production`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://preonuo:preonuo@cluster0.sg0wcaf.mongodb.net/womenatcs?retryWrites=true&w=majority&appName=Cluster0`
   - **Environment**: Production, Preview, Development (select all)
   
   - **Name**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Production, Preview, Development (select all)

## API Endpoints

The following API endpoints are available on Vercel:

- `GET /api/events` - Fetch all active events
- `POST /api/events` - Create a new event
- `DELETE /api/events/:id` - Delete an event
- `POST /api/feedback` - Submit feedback
- `POST /api/contact` - Submit contact form

## Current Events in Database

The following events are currently in your MongoDB Atlas database:
- **24HR HACKATHON 2026** - February 7, 2026 at Heriot-Watt Campus, Robotarium

## Deployment

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. The API routes will be available at `https://your-domain.vercel.app/api/events`
4. Your website will be available at `https://your-domain.vercel.app`

## Testing Production

After deployment, test these URLs:
- `https://your-domain.vercel.app/api/events` - Should return event data
- `https://your-domain.vercel.app/events` - Should show events page with data
