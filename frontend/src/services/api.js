import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Safely ensure it ends with /api if users forget it in Vercel config
if (!baseURL.endsWith('/api') && !baseURL.includes('localhost')) {
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // Reduced from 30s to 15s for faster feedback
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

// Retry logic for failed requests (except login/auth endpoints)
let retryCount = {};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    // Don't retry auth endpoints
    if (config.url.includes('/auth/')) {
      if (error.response?.status === 401) {
        console.warn('[API] 401 Unauthorized - clearing token and redirecting to login');
        localStorage.removeItem('nexuslife_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // Retry other endpoints on network errors (max 2 retries)
    if (!retryCount[config.url]) retryCount[config.url] = 0;
    
    if ((error.code === 'ECONNABORTED' || error.message === 'Network Error') && retryCount[config.url] < 2) {
      retryCount[config.url]++;
      console.log(`[API] Retrying ${config.url} (attempt ${retryCount[config.url]})`);
      return new Promise(resolve => setTimeout(() => resolve(api(config)), 500));
    }
    
    if (retryCount[config.url]) delete retryCount[config.url];
    return Promise.reject(error);
  }
);

export default api;
