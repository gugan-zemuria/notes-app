import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Authentication failed. Please log in again.');
      // Optionally redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const notesApi = {
  // Get all notes with optional filters and pagination
  getAllNotes: async (filters = {}, page = 1, limit = 12) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.labels) params.append('labels', filters.labels);
      if (filters.search) params.append('search', filters.search);
      if (filters.drafts !== undefined) params.append('drafts', filters.drafts);
      if (filters.visibility) params.append('visibility', filters.visibility);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `/notes?${params.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  },

  // Get single note by ID
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch note: ${error.message}`);
    }
  },

  // Get public note by share token
  getPublicNote: async (token) => {
    try {
      const response = await api.get(`/public/${token}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch public note: ${error.message}`);
    }
  },

  // Autosave note
  autosaveNote: async (id, noteData) => {
    try {
      const response = await api.post(`/notes/${id}/autosave`, noteData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to autosave note: ${error.message}`);
    }
  },

  // Toggle note visibility
  toggleVisibility: async (id, isPublic) => {
    try {
      const response = await api.patch(`/notes/${id}/visibility`, { is_public: isPublic });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to toggle visibility: ${error.message}`);
    }
  },

  // Publish draft (change from draft to published)
  publishDraft: async (id) => {
    try {
      const response = await api.patch(`/notes/${id}/publish`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to publish draft: ${error.message}`);
    }
  },

  // Create a new note
  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  },

  // Update an existing note
  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update note: ${error.message}`);
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  },



  // Categories API
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  },

  // Labels API
  getAllLabels: async () => {
    try {
      const response = await api.get('/labels');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch labels: ${error.message}`);
    }
  },

  createLabel: async (labelData) => {
    try {
      const response = await api.post('/labels', labelData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create label: ${error.message}`);
    }
  }
};

export default notesApi;