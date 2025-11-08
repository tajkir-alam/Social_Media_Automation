import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://social-media-automation-sigma.vercel.app/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Register
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        email,
        password,
        name,
      });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Get profile
  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async (onboardingData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/users/onboarding/complete`, onboardingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete onboarding';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Connect social media
  connectSocialMedia: async (platform, credentials) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/users/social-media/connect`,
        { platform, ...credentials },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to connect social media';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
