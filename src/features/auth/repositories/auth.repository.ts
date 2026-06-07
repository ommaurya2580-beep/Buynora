import { authService } from '../services/auth.service';
import { UserProfile } from '../../../types';

export const AuthRepository = {
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    return authService.login(email, password);
  },

  async getCurrentUser(): Promise<UserProfile> {
    return authService.getCurrentUser();
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return authService.updateProfile(profile);
  }
};
