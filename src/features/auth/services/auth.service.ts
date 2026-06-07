import api from '../../../services/api';
import { UserProfile } from '../../../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async getCurrentUser(): Promise<UserProfile> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.post('/auth/me/update', profile);
    return res.data;
  }
};
