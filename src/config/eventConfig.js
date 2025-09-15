// Event Configuration
// Change the target date here to easily update the countdown timer
export const EVENT_CONFIG = {
  // Target date for the upcoming event
  // Format: new Date(year, month-1, day, hour, minute, second)
  // Note: month is 0-indexed (0 = January, 1 = February, etc.)
  targetDate: new Date(2026, 1, 7, 0, 0, 0), // February 7th, 2026 at midnight
  
  // Event details
  eventName: "Upcoming HackathonEvent!",
  
  // You can easily change the target date by modifying the line above
  // Examples:
  // new Date(2025, 11, 25, 18, 0, 0) // December 25th, 2025 at 6 PM
  // new Date(2026, 2, 15, 12, 30, 0) // March 15th, 2026 at 12:30 PM
};
