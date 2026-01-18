import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:5001/api/analytics';

// Create axios instance
const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Task API
export const taskAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats/dashboard')
};

// Analytics API
export const analyticsAPI = {
  getUserStats: (userId) => axios.get(`${ANALYTICS_URL}/user-stats/${userId}`),
  getProductivity: (userId, days = 30) => 
    axios.get(`${ANALYTICS_URL}/productivity/${userId}?days=${days}`)
};

export default api;