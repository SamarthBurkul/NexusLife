import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Ensure baseURL consistently ends with /api (handle user configs that omit it)
if (!baseURL.endsWith('/api')) {
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

  // Ensure headers object exists
  config.headers = config.headers || {};

  // Don't attach Authorization header to auth endpoints (login/verify/etc.)
  // This avoids accidental preflight/CORS issues and leaking tokens where not needed
  if (config.url && config.url.includes('/auth/')) {
    // ensure content-type is present for POSTs
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json';
    return config;
  }

  if (token) {
    // preserve existing headers while adding Authorization
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    console.log('[API] Authorization header attached for request:', config.url);
  } else {
    console.debug('[API] No token in localStorage for:', config.url);
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
        const status = error.response?.status;

        // Surface rate-limit details so the UI can react
        if (status === 429) {
          const ra = error.response.headers?.['retry-after'] || error.response.headers?.['Retry-After'];
          let retryAfterMs = 60 * 1000; // default 1 minute
          if (ra) {
            const asInt = parseInt(ra, 10);
            if (!Number.isNaN(asInt)) retryAfterMs = asInt * 1000; // seconds value
            else {
              // try parse as HTTP date
              const t = Date.parse(ra);
              if (!Number.isNaN(t)) retryAfterMs = Math.max(0, t - Date.now());
            }
          }
          error.isRateLimited = true;
          error.retryAfter = retryAfterMs;
        }

        if (status === 401) {
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
