# Vercel Deployment Setup

## Environment Variables Required

You need to set up the following environment variable in your Vercel dashboard:

### MONGODB_URI
- **Value**: Your MongoDB Atlas connection string
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/womenatcs?retryWrites=true&w=true`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
   - **Environment**: Production, Preview, Development (select all)

## API Endpoints

The following API endpoints are now available on Vercel:

- `GET /api/events` - Fetch all active events
- `POST /api/events` - Create a new event
- `DELETE /api/events/:id` - Delete an event

## Automatic Event Creation

The hackathon 2026 event will be automatically created when the API is first called if it doesn't exist in the database.

## Deployment

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. The API routes will be available at `https://your-domain.vercel.app/api/events`
