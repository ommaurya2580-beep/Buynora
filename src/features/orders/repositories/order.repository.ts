import { orderService } from '../services/order.service';
import { Order } from '../../../types';

export const OrderRepository = {
  async getOrders(): Promise<Order[]> {
    return orderService.getOrders();
  },

  async createOrder(orderData: Omit<Order, 'date' | 'status' | 'trackingStep'>): Promise<Order> {
    return orderService.createOrder(orderData);
  },

  async updateTracking(orderId: string, step: number, status: Order['status']): Promise<Order> {
    return orderService.updateTracking(orderId, step, status);
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return orderService.cancelOrder(orderId);
  }
};
