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

  console.log('Delete API called:', req.method, req.url);
  console.log('Request body:', req.body);

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

  try {
    if (req.method === 'DELETE') {
      // Delete event route
      console.log('Deleting event with data:', body);
      
      const { eventId } = body;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'Event ID is required'
        });
      }

      // For Vercel, we'll remove from global admin events
      // In a real app, you'd delete from database
      console.log('Deleting event with ID:', eventId);

      // Initialize global admin events if it doesn't exist
      global.adminEvents = global.adminEvents || [];
      
      // Find and remove the event
      const initialLength = global.adminEvents.length;
      global.adminEvents = global.adminEvents.filter(event => event._id !== eventId);
      const removedCount = initialLength - global.adminEvents.length;
      
      console.log(`Removed ${removedCount} event(s) with ID: ${eventId}`);
      console.log('Remaining admin events:', global.adminEvents.length);

      res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });

    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} Not Allowed`
      });
    }
  } catch (error) {
    console.error('Error in delete API:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request. Please try again.',
      error: error.message
    });
  }
};
