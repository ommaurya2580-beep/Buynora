import axios from 'axios';
import { UserProfile } from '../../../types';

export interface UserProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

// Ensure the baseURL points to the live AWS EC2 User Service via the API Gateway
const api = axios.create({
  baseURL: import.meta.env.VITE_USER_URL || 'http://3.95.240.195:8080/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getProfileByEmail: async (email: string): Promise<UserProfile> => {
    const response = await api.get(`/${email}`);
    // Map backend DTO (firstName, lastName) to frontend interface (name)
    return {
      ...response.data,
      name: `${response.data.firstName} ${response.data.lastName}`.trim(),
    };
  },

  updateProfile: async (email: string, data: UserProfileRequest): Promise<UserProfile> => {
    const response = await api.put(`/${email}`, data);
    return {
      ...response.data,
      name: `${response.data.firstName} ${response.data.lastName}`.trim(),
    };
  }
};
