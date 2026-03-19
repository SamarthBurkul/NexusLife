import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Safely ensure it ends with /api if users forget it in Vercel config
if (!baseURL.endsWith('/api') && !baseURL.includes('localhost')) {
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // Increased timeout for complex operations
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexuslife_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Token attached to request:', config.url);
  } else {
    console.warn('[API] No token found in localStorage for:', config.url);
  }
  return config;
});

// Handle 401 responses — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('nexuslife_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
