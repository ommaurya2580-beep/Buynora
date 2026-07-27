package com.buynora.cart.service;

import com.buynora.cart.dto.CartItemRequest;
import com.buynora.cart.model.Cart;
import com.buynora.cart.model.CartItem;
import com.buynora.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public Cart getCart(String userId) {
        return cartRepository.findById(userId).orElseGet(() -> createEmptyCart(userId));
    }

    public Cart addToCart(String userId, CartItemRequest request) {
        Cart cart = getCart(userId);
        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()) &&
                        (request.getColor() == null || request.getColor().equals(item.getColor())) &&
                        (request.getSize() == null || request.getSize().equals(item.getSize())))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .color(request.getColor())
                    .size(request.getSize())
                    .price(request.getPrice())
                    .name(request.getName())
                    .brand(request.getBrand())
                    .imageUrl(request.getImageUrl())
                    .build();
            cart.getItems().add(newItem);
        }

        updateSubtotal(cart);
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, String productId, String color, String size, int quantity) {
        Cart cart = getCart(userId);
        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId) &&
                        (color == null || color.equals(item.getColor())) &&
                        (size == null || size.equals(item.getSize())))
                .findFirst()
                .ifPresent(item -> item.setQuantity(Math.max(1, quantity)));
                
        updateSubtotal(cart);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String userId, String productId, String color, String size) {
        Cart cart = getCart(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId) &&
                (color == null || color.equals(item.getColor())) &&
                (size == null || size.equals(item.getSize())));
                
        updateSubtotal(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        cartRepository.deleteById(userId);
    }

    private Cart createEmptyCart(String userId) {
        return Cart.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .subtotal(BigDecimal.ZERO)
                .build();
    }

    private void updateSubtotal(Cart cart) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setSubtotal(subtotal);
    }
}
