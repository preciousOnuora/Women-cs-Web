const mongoose = require('mongoose');

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/womenatcs';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Event Schema
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

const Event = mongoose.model('Event', eventSchema);

// Sample events data
const sampleEvents = [
  {
    title: "24HR HACKATHON 2026",
    description: "Work in Teams of 5 to collaborate, code, and innovate! This event features inspiring talks on career journeys, networking opportunities with industry professionals, and the chance to win prizes. Fuel your creativity with free pizza and showcase your skills in this unmissable coding adventure!",
    date: new Date('2026-02-07'),
    time: "10:30 AM - 10:30 AM (24 hours)",
    location: "Heriot-Watt Campus, Robotarium",
    maxParticipants: 100,
    currentParticipants: 0,
    isActive: true
  },
  {
    title: "Women in Tech Networking Event",
    description: "Join us for an evening of networking with successful women in technology. Connect with mentors, peers, and industry leaders.",
    date: new Date('2024-09-15'),
    time: "6:00 PM - 8:00 PM",
    location: "Heriot-Watt University, Edinburgh Campus",
    maxParticipants: 100,
    currentParticipants: 23,
    isActive: false
  },
  {
    title: "Coding Workshop: Introduction to React",
    description: "Learn the fundamentals of React development in this hands-on workshop. Perfect for beginners and those looking to refresh their skills.",
    date: new Date('2024-09-22'),
    time: "10:00 AM - 4:00 PM",
    location: "Computer Lab 1, Heriot-Watt University",
    maxParticipants: 30,
    currentParticipants: 15,
    isActive: false
  },
  {
    title: "Career Panel: Breaking into Tech",
    description: "Hear from successful women who have built careers in technology. Learn about different paths, challenges, and opportunities in the industry.",
    date: new Date('2024-10-05'),
    time: "2:00 PM - 4:00 PM",
    location: "Lecture Hall A, Heriot-Watt University",
    maxParticipants: 80,
    currentParticipants: 45,
    isActive: false
  },
  {
    title: "Hackathon: Sustainable Tech Solutions",
    description: "48-hour hackathon focused on creating technology solutions for environmental challenges. Teams of 2-4 people welcome.",
    date: new Date('2024-10-12'),
    time: "Friday 6:00 PM - Sunday 6:00 PM",
    location: "Innovation Hub, Heriot-Watt University",
    maxParticipants: 60,
    currentParticipants: 12,
    isActive: false
  },
  {
    title: "Mentorship Program Launch",
    description: "Kickoff event for our new mentorship program connecting students with industry professionals. Learn about the program and meet potential mentors.",
    date: new Date('2024-10-20'),
    time: "3:00 PM - 5:00 PM",
    location: "Student Union Building, Heriot-Watt University",
    maxParticipants: 50,
    currentParticipants: 8,
    isActive: false
  }
];

// Function to seed events
async function seedEvents() {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Successfully seeded ${events.length} events`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

// Run the seed function
seedEvents();
