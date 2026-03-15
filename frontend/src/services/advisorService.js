import api from './api.js';

export const getInsights = () =>
  api.get('/advisor/insights');

export const chat = (message, history) =>
  api.post('/advisor/chat', { message, history });
