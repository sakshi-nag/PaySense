// src/store/authStore.js
import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../utils/api';

export const useAuthStore = create((set) => ({
  isLoading: true,
  userToken: null,
  user: null,
  hasSeenOnboarding: false,

  // Initialize auth state on app startup
  initializeApp: async () => {
    try {
      const [token, user, hasSeenOnboarding] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
        AsyncStorage.getItem('hasSeenOnboarding'),
      ]);

      if (token) {
        set({ userToken: token, user: JSON.parse(user) });
      }
      if (hasSeenOnboarding) {
        set({ hasSeenOnboarding: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userData', JSON.stringify(user)),
      ]);

      set({ userToken: token, user });
      return { success: true };
    } catch (error) {
      // DEMO MODE: Allow login with any credentials for offline testing
      const demoUser = {
        id: 1,
        name: email.split('@')[0] || 'User',
        email: email,
        monthlyBudget: 50000,
      };
      const demoToken = 'demo-token-' + Date.now();

      await Promise.all([
        AsyncStorage.setItem('userToken', demoToken),
        AsyncStorage.setItem('userData', JSON.stringify(demoUser)),
      ]);

      set({ userToken: demoToken, user: demoUser });
      return { success: true };
    }
  },

  // Sign up user
  signup: async (name, email, password) => {
    try {
      const response = await authAPI.signup(name, email, password);
      const { token, user } = response.data;

      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userData', JSON.stringify(user)),
      ]);

      set({ userToken: token, user });
      return { success: true };
    } catch (error) {
      // DEMO MODE: Allow signup with any credentials for offline testing
      const demoUser = {
        id: Date.now(),
        name: name || email.split('@')[0],
        email: email,
        monthlyBudget: 50000,
      };
      const demoToken = 'demo-token-' + Date.now();

      await Promise.all([
        AsyncStorage.setItem('userToken', demoToken),
        AsyncStorage.setItem('userData', JSON.stringify(demoUser)),
      ]);

      set({ userToken: demoToken, user: demoUser });
      return { success: true };
    }
  },

  // Logout user
  logout: async () => {
    await Promise.all([
      AsyncStorage.removeItem('userToken'),
      AsyncStorage.removeItem('userData'),
    ]);
    set({ userToken: null, user: null });
  },

  // Mark onboarding as seen
  completeOnboarding: async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    set({ hasSeenOnboarding: true });
  },
}));
