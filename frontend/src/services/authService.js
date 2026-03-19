import api from './api';

export function verifyOtp(phone, otp) {
  return api.post('/auth/verify-otp', { phone, otp }).then((res) => res.data);
}

export function sendOtp(phone) {
  return api.post('/auth/send-otp', { phone }).then((res) => res.data);
}

export default {
  verifyOtp,
  sendOtp,
};
import api from './api.js';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (userData) =>
  api.post('/auth/register', userData);

export const verifyOTP = (phone, otp) =>
  api.post('/auth/verify-otp', { phone, otp });
