import React from 'react';
import './Gallery.css';
import zoo1 from './Images/zoo1.jpg';
import zoo2 from './Images/zoo2.jpg';
import zoo3 from './Images/zoo3.jpg';
import zoo4 from './Images/zoo4.jpg';
import zoo5 from './Images/zoo5.jpg';
import zoo6 from './Images/zoo6.jpg';
import hthon1 from './Images/hthon1.jpg';
import hthon2 from './Images/hthon2.jpg';
import hthon3 from './Images/hthon3.jpg';
import hthon4 from './Images/hthon4.jpg';
import hthon5 from './Images/hthon5.jpg';
import hthon6 from './Images/hthon6.jpg';
import hthon7 from './Images/hthon7.jpg';
import hthon8 from './Images/hthon8.jpg';
import hthon9 from './Images/hthon9.jpg';
import hthon10 from './Images/hthon10.jpg';
import hthon11 from './Images/hthon11.jpg';
import hthon12 from './Images/hthon12.jpg';
import hthon13 from './Images/hthon13.jpg';
import hthon14 from './Images/hthon14.jpg';
import hthon15 from './Images/hthon15.jpg';
import hthon16 from './Images/hthon16.jpg';
import hthon17 from './Images/hthon17.jpg';

const Gallery = () => {
  // Event data with actual imported images
  const events = [
    {
      id: 1,
      title: "Edinburgh Zoo",
      date: "October 2024",
      description: "Our first ever event - a fantastic day out at Edinburgh Zoo, generously sponsored by Athena SWAN! Taking place during reading week, this was the perfect opportunity to open our group and start building our community.",
      photos: [
        { id: 1, src: zoo1, alt: "Group photo at Edinburgh Zoo entrance" },
        { id: 2, src: zoo2, alt: "Members exploring the zoo" },
        { id: 3, src: zoo3, alt: "Wildlife observation" },
        { id: 4, src: zoo4, alt: "Group enjoying the day" },
        { id: 5, src: zoo5, alt: "Conservation learning" },
        { id: 6, src: zoo6, alt: "Final group photo" }
      ]
    },
    {
      id: 2,
      title: "24HR Hackathon",
      date: "February 2025",
      description: "Work in Teams of 5 to collaborate, code, and innovate! This event features inspiring talks on career journeys, networking opportunities with industry professionals, and the chance to win prizes.",
      photos: [
        { id: 7, src: hthon1, alt: "Hackathon kickoff" },
        { id: 8, src: hthon2, alt: "Team collaboration" },
        { id: 9, src: hthon3, alt: "Coding session" },
        { id: 10, src: hthon4, alt: "Industry talks" },
        { id: 11, src: hthon5, alt: "Networking break" },
        { id: 12, src: hthon6, alt: "Coding workshop" },
        { id: 13, src: hthon7, alt: "Team building activities" },
        { id: 14, src: hthon8, alt: "Technical discussions" },
        { id: 15, src: hthon9, alt: "Problem solving session" },
        { id: 16, src: hthon10, alt: "Group brainstorming" },
        { id: 17, src: hthon11, alt: "Skill sharing" },
        { id: 18, src: hthon12, alt: "Collaborative coding" },
        { id: 19, src: hthon13, alt: "Industry networking" },
        { id: 20, src: hthon14, alt: "Project development" },
        { id: 21, src: hthon15, alt: "Team presentations" },
        { id: 22, src: hthon16, alt: "Award ceremony" },
        { id: 23, src: hthon17, alt: "Final group photo" }
      ]
    }
  ];

  return (
    <div className="gallery-page">
      <div className="gallery-container">
        <h1 className="page-title">Event Gallery</h1>
        
        <div className="gallery-intro">
          <h2>Capturing Our Journey</h2>
          <p>Explore the moments that define our Women@CS community. From our first event at Edinburgh Zoo to our latest hackathon, each photo tells a story of collaboration, learning, and friendship.</p>
        </div>

        {events.map((event) => (
          <div key={event.id} className="event-gallery-section">
            <div className="event-header">
              <h3 className="event-title">{event.title}</h3>
              <span className="event-date">{event.date}</span>
            </div>
            
            <p className="event-description">{event.description}</p>
            
            <div className="photo-grid">
              {event.photos.map((photo) => (
                <div key={photo.id} className="photo-item">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="gallery-photo"
                    loading="lazy"
                  />
                  <div className="photo-overlay">
                    <span className="photo-caption">{photo.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="gallery-footer">
          <h3>More Memories Coming Soon</h3>
          <p>Stay tuned for photos from our upcoming events and activities. Join us to be part of the next chapter in our Women@CS story!</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
