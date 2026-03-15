import api from './api.js';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (userData) =>
  api.post('/auth/register', userData);

export const verifyOTP = (phone, otp) =>
  api.post('/auth/verify-otp', { phone, otp });
