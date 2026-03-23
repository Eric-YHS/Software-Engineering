// Automatically detect the API URL based on the current browser address.
// This allows the app to work on localhost AND local network IPs (e.g., 192.168.x.x) without manual config.

const hostname = window.location.hostname;

// If running on standard ports, assume backend is on port 3001 on the same machine
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${hostname}:3001/api`;