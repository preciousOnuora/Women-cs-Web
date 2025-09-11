const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxParticipants: { type: Number, default: 50 },
  currentParticipants: { type: Number, default: 0 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isUpcoming: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Sample events data
const sampleEvents = [
  {
    title: "Women in Tech Networking Event",
    description: "Join us for an evening of networking, inspiration, and connection with fellow women in technology. This event features keynote speakers, panel discussions, and networking opportunities.",
    date: new Date('2024-12-15T18:00:00Z'),
    location: "Edinburgh University, Informatics Forum",
    maxParticipants: 100,
    currentParticipants: 0,
    isUpcoming: true
  },
  {
    title: "Coding Workshop: Introduction to React",
    description: "Learn the fundamentals of React development in this hands-on workshop. Perfect for beginners and those looking to refresh their skills. We'll cover components, state, and props.",
    date: new Date('2024-12-20T14:00:00Z'),
    location: "Online - Zoom",
    maxParticipants: 30,
    currentParticipants: 0,
    isUpcoming: true
  },
  {
    title: "Career Panel: Breaking into Tech",
    description: "Hear from successful women in tech about their career journeys, challenges they've overcome, and advice for those starting out. Q&A session included.",
    date: new Date('2025-01-10T17:30:00Z'),
    location: "Edinburgh University, Appleton Tower",
    maxParticipants: 80,
    currentParticipants: 0,
    isUpcoming: true
  },
  {
    title: "Hackathon: Sustainability in Tech",
    description: "A 24-hour hackathon focused on creating tech solutions for environmental sustainability. Teams of 2-4 people, prizes for winners!",
    date: new Date('2025-01-25T09:00:00Z'),
    location: "Edinburgh University, Informatics Forum",
    maxParticipants: 50,
    currentParticipants: 0,
    isUpcoming: true
  }
];

// Seed function
const seedEvents = async () => {
  try {
    await connectDB();
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Seeded ${events.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedEvents();
}

module.exports = { seedEvents };
