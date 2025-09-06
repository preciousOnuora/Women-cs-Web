import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '../config/eventConfig';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = EVENT_CONFIG.targetDate.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.days}</span>
        <span className="countdown-label">DAYS</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.hours}</span>
        <span className="countdown-label">HOURS</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.minutes}</span>
        <span className="countdown-label">MINUTES</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.seconds}</span>
        <span className="countdown-label">SECONDS</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
