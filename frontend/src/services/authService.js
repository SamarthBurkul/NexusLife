import api from './api';

export const sendOtp = (phone) => api.post('/auth/send-otp', { phone }).then((res) => res.data);

export const verifyOtp = (phone, otp) => api.post('/auth/verify-otp', { phone, otp }).then((res) => res.data);

// keep legacy camelCase name used across the codebase
export const verifyOTP = (phone, otp) => verifyOtp(phone, otp);

export const login = (email, password) => api.post('/auth/login', { email, password });

export const register = (userData) => api.post('/auth/register', userData);

export default {
  sendOtp,
  verifyOtp,
  verifyOTP,
  login,
  register,
};
