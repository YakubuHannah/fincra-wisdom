import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authService = {
  // Login with Google
  googleLogin: async (googleToken: string) => {
    const response = await axios.post(
      `${API_URL}/auth/google`,
      { token: googleToken },
      { withCredentials: true }
    );
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },
};

export default authService;