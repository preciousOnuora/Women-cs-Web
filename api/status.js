export default function handler(req, res) {
  res.status(200).json({ 
    status: 'working',
    message: 'API is functioning',
    timestamp: new Date().toISOString()
  });
}
