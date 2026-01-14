// Import libraries
import { useState, useEffect } from 'react';
import { fetchIntel } from '../services/api';
import axios from 'axios';

// Function to refresh data at regular intervals
export function useHeartbeat(seconds = 30) {
  // States to hold fetched data and timer and sync time and player count
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState(seconds);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [playerCount, setPlayerCount] = useState(null);

  // Async function to fetch data and reset timer
  const refresh = async () => {
    try {
      // Fetch Map/Intel Data
      const result = await fetchIntel();
      if (result) {
        setData(result);
        
        // Update Timestamp
        const now = new Date();
        const timestamp = now.getUTCHours().toString().padStart(2, '0') + ":" + 
                          now.getUTCMinutes().toString().padStart(2, '0') + ":" + 
                          now.getUTCSeconds().toString().padStart(2, '0');
        setLastSyncTime(timestamp);
      }

      // App ID 1808500 is the official ARC Raiders retail ID
      const STEAM_APP_ID = "1808500";
      // Fetch Steam Player Count via corsproxy.io
      const PROXY = "https://corsproxy.io/?";
      const STEAM_URL = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${STEAM_APP_ID}`;
      
      const steamRes = await axios.get(PROXY + encodeURIComponent(STEAM_URL));
      
      // If valid response, update player count
      if (steamRes.data?.response?.player_count !== undefined) {
        // Format with commas
        setPlayerCount(steamRes.data.response.player_count.toLocaleString());
      }
      
      // Reset the visual timer after a successful pulse
      setTimer(seconds);

      // Handle errors during the heartbeat process
    } catch (err) {
      console.error("HEARTBEAT_FAILURE:", err);
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
  return { data, timer, lastSyncTime, playerCount };
}