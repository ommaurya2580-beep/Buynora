import axios from 'axios';
import { TokenManager } from './tokenManager';
import { environment } from '../../../config/environment';

let refreshPromise: Promise<string | null> | null = null;

export const RefreshTokenManager = {
  refreshAccessToken: async (): Promise<string | null> => {
    if (refreshPromise) {
      return refreshPromise;
    }
    
    refreshPromise = (async () => {
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }
        
        // Use a clean axios instance to avoid infinite loop with the global interceptor
        const res = await axios.post(`${environment.apiBaseUrl}/auth/refresh`, {
          refreshToken
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const { accessToken, newRefreshToken } = res.data;
        
        TokenManager.setAccessToken(accessToken);
        if (newRefreshToken) {
          TokenManager.setRefreshToken(newRefreshToken);
        }
        
        return accessToken;
      } catch (error) {
        TokenManager.clearAll();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
    
    return refreshPromise;
  }
};
