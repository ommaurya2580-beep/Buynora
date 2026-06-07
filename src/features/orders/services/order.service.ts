import api from '../../../services/api';
import { Order } from '../../../types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const res = await api.get('/orders');
    return res.data;
  },

  async createOrder(orderData: Omit<Order, 'date' | 'status' | 'trackingStep'>): Promise<Order> {
    const res = await api.post('/orders/create', orderData);
    return res.data;
  },

  async updateTracking(orderId: string, step: number, status: Order['status']): Promise<Order> {
    const res = await api.post(`/orders/${orderId}/tracking`, { step, status });
    return res.data;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const res = await api.post(`/orders/${orderId}/cancel`);
    return res.data;
  }
};
