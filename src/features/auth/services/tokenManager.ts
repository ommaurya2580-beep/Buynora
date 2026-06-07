export const TokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token');
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
  },
  clearAccessToken: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  setRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token);
  },
  clearRefreshToken: (): void => {
    localStorage.removeItem('refreshToken');
  },
  
  clearAll: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token'); // old token format compatibility
  }
};
