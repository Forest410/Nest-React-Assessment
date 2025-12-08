import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (data: {
    toAddress: string;
    amount: string;
    gasLimit?: string;
    gasPrice?: string;
  }) => api.post('/transactions', data),
};

// Init API
export const initAPI = {
  seed: () => api.post('/init'),
};

// Stats API
export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export default api;
