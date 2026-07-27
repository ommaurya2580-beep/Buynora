package com.buynora.cart.controller;

import com.buynora.cart.dto.CartItemRequest;
import com.buynora.cart.model.Cart;
import com.buynora.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addToCart(@PathVariable String userId, @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(userId, productId, color, size, quantity));
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId, color, size));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
