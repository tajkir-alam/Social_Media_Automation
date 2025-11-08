import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://social-media-automation-sigma.vercel.app/api';

export const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  filters: { status: 'all', limit: 20, skip: 0 },

  // Generate new post
  generatePost: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/posts`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: [response.data.post, ...state.posts],
        currentPost: response.data.post,
        isLoading: false,
      }));
      return response.data.post;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate post';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Get user posts
  getUserPosts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const params = { ...get().filters, ...filters };
      const response = await axios.get(`${API_URL}/posts`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        posts: response.data.posts,
        filters: params,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch posts';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Get single post
  getPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentPost: response.data.post, isLoading: false });
      return response.data.post;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch post';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Update post
  updatePost: async (postId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/posts/${postId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data.post : p)),
        currentPost: response.data.post,
        isLoading: false,
      }));
      return response.data.post;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Approve and post
  approveAndPost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/posts/${postId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data.post : p)),
        currentPost: response.data.post,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        currentPost: null,
        isLoading: false,
      }));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set current post
  setCurrentPost: (post) => set({ currentPost: post }),
}));
