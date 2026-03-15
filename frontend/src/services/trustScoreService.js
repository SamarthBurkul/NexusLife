import api from './api.js';

export const getScore = () =>
  api.get('/trustscore');

export const getBreakdown = () =>
  api.get('/trustscore/breakdown');
