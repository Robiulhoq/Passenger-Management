import axios from 'axios';

const apiHost = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${apiHost}/api/auth`;

const authService = {
  login: async (userName, password) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        userName,
        password,
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  },
};

export default authService;
