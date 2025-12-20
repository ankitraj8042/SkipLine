import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // User register
  userRegister: async (userData) => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  },

  // User login
  userLogin: async (email, password) => {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    return response.data;
  },

  // Admin register
  adminRegister: async (userData) => {
    const response = await axios.post(`${API_URL}/users/admin/register`, userData);
    return response.data;
  },

  // Admin login
  adminLogin: async (email, password) => {
    const response = await axios.post(`${API_URL}/users/admin/login`, { email, password });
    return response.data;
  },

  // Get profile
  getProfile: async (id) => {
    const response = await axios.get(`${API_URL}/users/profile/${id}`);
    return response.data;
  }
};

// Queue API calls
export const queueAPI = {
  // Get all queues
  getAllQueues: async () => {
    const response = await axios.get(`${API_URL}/queues`);
    return response.data;
  },

  // Get queue by ID
  getQueueById: async (id) => {
    const response = await axios.get(`${API_URL}/queues/${id}`);
    return response.data;
  },

  // Join queue
  joinQueue: async (id, userData) => {
    const response = await axios.post(`${API_URL}/queues/${id}/join`, userData);
    return response.data;
  },

  // Get position in queue
  getPosition: async (queueId, phone) => {
    const response = await axios.get(`${API_URL}/queues/${queueId}/position/${phone}`);
    return response.data;
  },

  // Cancel queue entry
  cancelEntry: async (queueId, entryId) => {
    const response = await axios.delete(`${API_URL}/queues/${queueId}/cancel/${entryId}`);
    return response.data;
  }
};

// Admin API calls
export const adminAPI = {
  // Create queue
  createQueue: async (queueData) => {
    const response = await axios.post(`${API_URL}/admin/queues`, queueData);
    return response.data;
  },

  // Update queue
  updateQueue: async (id, queueData) => {
    const response = await axios.put(`${API_URL}/admin/queues/${id}`, queueData);
    return response.data;
  },

  // Delete queue
  deleteQueue: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/queues/${id}`);
    return response.data;
  },

  // Get queue entries
  getQueueEntries: async (id) => {
    const response = await axios.get(`${API_URL}/admin/queues/${id}/entries`);
    return response.data;
  },

  // Call next person
  callNext: async (id) => {
    const response = await axios.post(`${API_URL}/admin/queues/${id}/call-next`);
    return response.data;
  },

  // Mark as served
  markServed: async (entryId) => {
    const response = await axios.post(`${API_URL}/admin/entries/${entryId}/served`);
    return response.data;
  },

  // Mark as missed
  markMissed: async (entryId) => {
    const response = await axios.post(`${API_URL}/admin/entries/${entryId}/missed`);
    return response.data;
  },

  // Skip to entry
  skipTo: async (entryId) => {
    const response = await axios.post(`${API_URL}/admin/entries/${entryId}/skip-to`);
    return response.data;
  },

  // Get queue stats
  getQueueStats: async (id) => {
    const response = await axios.get(`${API_URL}/admin/queues/${id}/stats`);
    return response.data;
  },

  // Get QR code
  getQRCode: async (id) => {
    const response = await axios.get(`${API_URL}/admin/queues/${id}/qrcode`);
    return response.data;
  }
};

export default {
  authAPI,
  queueAPI,
  adminAPI
};
