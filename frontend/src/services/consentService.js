import api from './api.js';

export const getRequests = () =>
  api.get('/consent/requests');

export const approveRequest = (id, selectedFields, expiryHours) =>
  api.post('/consent/approve', { consentId: id, approvedFields: selectedFields, expiryHours });

export const denyRequest = (id) =>
  api.post('/consent/deny', { consentId: id });

export const getHistory = () =>
  api.get('/consent/history');
