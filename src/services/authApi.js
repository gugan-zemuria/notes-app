import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://notes-app-server-26sz.onrender.com/api';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

export const auth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    try {
      const response = await authApi.post('/auth/signup', { email, password });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const response = await authApi.post('/auth/signin', { email, password });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Sign in with Google OAuth
  signInWithGoogle: async () => {
    try {
      const response = await authApi.post('/auth/google');
      
      if (response.data.url) {
        // Redirect to Google OAuth
        window.location.href = response.data.url;
      }
      
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const response = await authApi.post('/auth/signout');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      console.log('Making getCurrentUser request...');
      const response = await authApi.get('/auth/user');
      console.log('getCurrentUser response:', response.status, response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.log('getCurrentUser error:', error.response?.status, error.response?.data);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const response = await authApi.post('/auth/reset-password', { email });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Handle OAuth callback
  handleCallback: async (code) => {
    try {
      const response = await authApi.post('/auth/callback', { code });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Handle token authentication (for implicit flow)
  authenticateWithToken: async (accessToken, refreshToken) => {
    try {
      const response = await authApi.post('/auth/token', { 
        access_token: accessToken, 
        refresh_token: refreshToken 
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }
};

export default auth;