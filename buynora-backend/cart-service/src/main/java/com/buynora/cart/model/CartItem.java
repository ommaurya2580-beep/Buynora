package com.buynora.cart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem {
    private String productId;
    private int quantity;
    private String color;
    private String size;
    private BigDecimal price;
    private String name;
    private String brand;
    private String imageUrl;
}
