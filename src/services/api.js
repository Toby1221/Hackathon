// Import libraries
import axios from 'axios';

// Async function to fetch intel data
export const fetchIntel = async () => {
  // Start timer to measure latency
  const startTime = performance.now();
  
  try {
    // Load the manifest.json to get the list of item files
    const manifestRes = await axios.get('/items/manifest.json');
    const fileNames = manifestRes.data;

    // Fetch all individual items.json in parallel
    const itemRequests = fileNames.map(file => 
      axios.get(`/items/${file}`).then(res => res.data)
    );
    
    // Wait for all item requests to complete
    const allItems = await Promise.all(itemRequests);
    // End timer to measure latency
    const endTime = performance.now();

    // Return the aggregated data along with latency and timestamp
    return {
      items: allItems,
      latency: Math.round(endTime - startTime),
      timestamp: new Date().toLocaleTimeString(),
      error: false
    };
    // Handle errors during the fetch process
  } catch (error) {
    console.error("UPLINK_FAILURE:", error);
    return { items: [], error: true };
  }
};