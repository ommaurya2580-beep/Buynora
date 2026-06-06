export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  authUrl: import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/api/v1/auth',
  productUrl: import.meta.env.VITE_PRODUCT_URL || 'http://localhost:8080/api/v1/products',
  orderUrl: import.meta.env.VITE_ORDER_URL || 'http://localhost:8080/api/v1/orders',
  paymentUrl: import.meta.env.VITE_PAYMENT_URL || 'http://localhost:8080/api/v1/payments',
  isDev: import.meta.env.MODE === 'development',
};
