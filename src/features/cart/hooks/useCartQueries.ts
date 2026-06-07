import { useMutation } from '@tanstack/react-query';
import { CartRepository } from '../repositories/cart.repository';

export const useVerifyCouponMutation = () => {
  return useMutation({
    mutationFn: (code: string) => CartRepository.verifyCoupon(code)
  });
};
