// Modified api.js
import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://todo-backend-6a64.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login/', { username, password });
    // Store tokens in localStorage
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout/', {
      refresh: localStorage.getItem('refresh_token')
    });
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  } catch (error) {
    // Still clear tokens even if the API call fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

// Add token refresh functionality
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken
        });
        
        localStorage.setItem('access_token', response.data.access);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// The rest of your API functions remain the same
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/user/');
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}/`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}/`);
  } catch (error) {
    throw error;
  }
};
