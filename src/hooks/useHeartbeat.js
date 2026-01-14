// Import libraries
import { useState, useEffect } from 'react';
import { fetchIntel } from '../services/api';

// Function to refresh data at regular intervals
export function useHeartbeat(seconds = 30) {
  // States to hold fetched data and timer and sync time
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState(seconds);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Async function to fetch data and reset timer
  const refresh = async () => {
    // Fetch data from API
    const result = await fetchIntel();
    // If data is fetched successfully, update state and reset timer
    if (result) {
      setData(result);
      setTimer(seconds);
      
      const now = new Date();
      const timestamp = now.getUTCHours().toString().padStart(2, '0') + ":" + 
                        now.getUTCMinutes().toString().padStart(2, '0') + ":" + 
                        now.getUTCSeconds().toString().padStart(2, '0');
      setLastSyncTime(timestamp);
    }
  };

  // useEffect to set up interval for refreshing data
  useEffect(() => {
    // Initial data fetch
    refresh();
    // Set up interval to decrement timer every second
    const interval = setInterval(() => {
      // Decrement timer or refresh data when timer reaches zero
      setTimer((prev) => {
        if (prev <= 1) {
          refresh();
          return seconds;
        }
        return prev - 1;
      });
    }, 1000);
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Return the fetched data and current timer value
  return { data, timer, lastSyncTime };
}