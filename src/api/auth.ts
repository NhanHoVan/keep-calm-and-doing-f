import { User } from '../types';
import { http } from './http';

export const authApi = {
  login: async (): Promise<User> => {
    return http<User>('/api/auth/login', { method: 'POST' });
  },

  loginWithGoogle: async (credential: string): Promise<User> => {
    return http<User>('/api/auth/google', { 
      method: 'POST',
      body: JSON.stringify({ credential })
    });
  },

  logout: async (): Promise<void> => {
    return http<void>('/api/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await http<User>('/api/auth/session');
    } catch {
      return null;
    }
  }
};
