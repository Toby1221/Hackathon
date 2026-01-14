// Import libraries
import { useState, useEffect } from 'react';
import { fetchIntel } from '../services/api';

// Function to refresh data at regular intervals
export function useHeartbeat(seconds = 30) {
  // States to hold fetched data and timer
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState(seconds);

  // Async function to fetch data and reset timer
  const refresh = async () => {
    // Fetch data from API
    const result = await fetchIntel();
    // If data is fetched successfully, update state and reset timer
    if (result) {
      setData(result);
      setTimer(seconds); 
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
  return { data, timer };
}